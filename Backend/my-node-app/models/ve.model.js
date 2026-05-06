const { pool } = require('../config/db');

class VeModel {
    // =================== VÉ GỐC (Ve bảng cha) ===================

    static async getAll({ page = 1, limit = 10, loaiVeCon, search, trangThai } = {}) {
        const offset = (page - 1) * limit;
        const queryParams = [];
        let baseQuery = `
            FROM Ve v
            LEFT JOIN DichVu dv ON v.maDichVu = dv.maDichVu
            LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
            WHERE 1=1
        `;
        if (loaiVeCon) { baseQuery += ` AND v.loaiVeCon = ?`; queryParams.push(loaiVeCon.toUpperCase()); }
        if (trangThai) { baseQuery += ` AND v.trangThai = ?`; queryParams.push(trangThai.toUpperCase()); }
        if (search) {
            baseQuery += ` AND (dv.ten LIKE ? OR ncc.ten LIKE ?)`;
            const s = `%${search}%`; queryParams.push(s, s);
        }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        // JOIN bảng con để lấy thông tin chi tiết (điểm đi, điểm đến, hãng, giá, số chỗ)
        let dataQuery = `
            SELECT
                v.maVe, v.maDichVu, v.loaiVeCon, v.trangThai, v.ngayTao,
                dv.ten AS tenDichVu, ncc.ten AS tenNhaCungCap,
                -- Máy bay
                mb.hangHangKhong, mb.soHieuChuyenBay,
                mb.diemKhoiHanh AS diemKhoiHanh_mb, mb.diemDen AS diemDen_mb,
                mb.thoiGianKhoiHanh AS thoiGianKhoiHanh_mb,
                -- Tàu hỏa
                th.hangTau, th.soHieuChuyenTau,
                th.diemKhoiHanh AS diemKhoiHanh_th, th.diemDen AS diemDen_th,
                th.thoiGianKhoiHanh AS thoiGianKhoiHanh_th,
                -- Khu vui chơi
                kvc.diaDiemSuDung, kvc.ngayHetHan,
                -- Giá vé (lấy mức thấp nhất)
                MIN(gv.gia) AS gia,
                SUM(gv.soChoTrong) AS soChoTrong
            FROM Ve v
            LEFT JOIN DichVu dv ON v.maDichVu = dv.maDichVu
            LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
            LEFT JOIN VeMayBay mb ON v.maVe = mb.maVe AND v.loaiVeCon = 'MAY_BAY'
            LEFT JOIN VeTauHoa th ON v.maVe = th.maVe AND v.loaiVeCon = 'TAU_HOA'
            LEFT JOIN VeKhuVuiChoi kvc ON v.maVe = kvc.maVe AND v.loaiVeCon = 'VUI_CHOI'
            LEFT JOIN GiaVe gv ON v.maVe = gv.maVe
            WHERE 1=1
        `;

        if (loaiVeCon) { dataQuery += ` AND v.loaiVeCon = ?`; }
        if (trangThai) { dataQuery += ` AND v.trangThai = ?`; }
        if (search) {
            dataQuery += ` AND (dv.ten LIKE ? OR ncc.ten LIKE ?)`;
        }

        dataQuery += `
            GROUP BY v.maVe
            ORDER BY v.maVe DESC LIMIT ? OFFSET ?
        `;
        queryParams.push(parseInt(limit), parseInt(offset));
        const [rows] = await pool.query(dataQuery, queryParams);

        // Chuẩn hóa dữ liệu cho frontend
        const normalized = rows.map(row => {
            const isMAYBAY = row.loaiVeCon === 'MAY_BAY';
            const isTAUHOA = row.loaiVeCon === 'TAU_HOA';
            return {
                ...row,
                diemKhoiHanh: row.diemKhoiHanh_mb || row.diemKhoiHanh_th || row.diaDiemSuDung || '',
                diemDen: row.diemDen_mb || row.diemDen_th || '',
                ngayKhoiHanh: row.thoiGianKhoiHanh_mb || row.thoiGianKhoiHanh_th || row.ngayHetHan || null,
                hang: isMAYBAY ? row.hangHangKhong : (isTAUHOA ? row.hangTau : row.tenNhaCungCap || ''),
                TenVe: row.tenDichVu || `Vé ${row.loaiVeCon}`,
            };
        });

        return { data: normalized, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: parseInt(page) };
    }

    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT v.*, dv.ten AS tenDichVu, dv.moTa, ncc.ten AS tenNhaCungCap
             FROM Ve v
             LEFT JOIN DichVu dv ON v.maDichVu = dv.maDichVu
             LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
             WHERE v.maVe = ?`,
            [id]
        );
        if (!rows[0]) return null;
        const ve = rows[0];

        // Lấy chi tiết loại vé con
        if (ve.loaiVeCon === 'MAY_BAY') {
            const [detail] = await pool.query(`SELECT * FROM VeMayBay WHERE maVe = ?`, [id]);
            ve.chiTiet = detail[0] || null;
        } else if (ve.loaiVeCon === 'TAU_HOA') {
            const [detail] = await pool.query(`SELECT * FROM VeTauHoa WHERE maVe = ?`, [id]);
            ve.chiTiet = detail[0] || null;
        } else if (ve.loaiVeCon === 'VUI_CHOI') {
            const [detail] = await pool.query(`SELECT * FROM VeKhuVuiChoi WHERE maVe = ?`, [id]);
            ve.chiTiet = detail[0] || null;
        }

        // Lấy bảng giá
        const [giaVe] = await pool.query(
            `SELECT gv.*, lv.tenLoaiVe FROM GiaVe gv
             LEFT JOIN LoaiVe lv ON gv.maLoaiVe = lv.maLoaiVe
             WHERE gv.maVe = ? ORDER BY gv.gia ASC`,
            [id]
        );
        ve.bảngGia = giaVe;

        return ve;
    }

    static async createVe(data) {
        const { maDichVu, loaiVeCon } = data;
        const [result] = await pool.query(
            `INSERT INTO Ve (maDichVu, loaiVeCon, trangThai) VALUES (?, ?, 'AVAILABLE')`,
            [maDichVu || null, loaiVeCon]
        );
        return result.insertId;
    }

    static async updateVeTrangThai(maVe, trangThai) {
        const [result] = await pool.query(`UPDATE Ve SET trangThai = ? WHERE maVe = ?`, [trangThai, maVe]);
        return result.affectedRows > 0;
    }

    static async removeVe(id) {
        const [result] = await pool.query(`DELETE FROM Ve WHERE maVe = ?`, [id]);
        return result.affectedRows > 0;
    }

    // =================== VÉ MÁY BAY ===================

    static async createVeMayBay(maVe, data) {
        const { hangHangKhong, soHieuChuyenBay, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen } = data;
        await pool.query(
            `INSERT INTO VeMayBay (maVe, hangHangKhong, soHieuChuyenBay, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [maVe, hangHangKhong, soHieuChuyenBay, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen]
        );
    }

    static async updateVeMayBay(maVe, data) {
        const { hangHangKhong, soHieuChuyenBay, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen } = data;
        const [result] = await pool.query(
            `UPDATE VeMayBay SET hangHangKhong=?, soHieuChuyenBay=?, diemKhoiHanh=?, diemDen=?, thoiGianKhoiHanh=?, thoiGianDen=? WHERE maVe=?`,
            [hangHangKhong, soHieuChuyenBay, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen, maVe]
        );
        return result.affectedRows > 0;
    }

    // =================== VÉ TÀU HỎA ===================

    static async createVeTauHoa(maVe, data) {
        const { hangTau, soHieuChuyenTau, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen } = data;
        await pool.query(
            `INSERT INTO VeTauHoa (maVe, hangTau, soHieuChuyenTau, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [maVe, hangTau, soHieuChuyenTau, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen]
        );
    }

    static async updateVeTauHoa(maVe, data) {
        const { hangTau, soHieuChuyenTau, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen } = data;
        const [result] = await pool.query(
            `UPDATE VeTauHoa SET hangTau=?, soHieuChuyenTau=?, diemKhoiHanh=?, diemDen=?, thoiGianKhoiHanh=?, thoiGianDen=? WHERE maVe=?`,
            [hangTau, soHieuChuyenTau, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen, maVe]
        );
        return result.affectedRows > 0;
    }

    // =================== VÉ KHU VUI CHƠI ===================

    static async createVeKhuVuiChoi(maVe, data) {
        const { diaDiemSuDung, ngayHetHan } = data;
        await pool.query(
            `INSERT INTO VeKhuVuiChoi (maVe, diaDiemSuDung, ngayHetHan) VALUES (?, ?, ?)`,
            [maVe, diaDiemSuDung, ngayHetHan || null]
        );
    }

    static async updateVeKhuVuiChoi(maVe, data) {
        const { diaDiemSuDung, ngayHetHan } = data;
        const [result] = await pool.query(
            `UPDATE VeKhuVuiChoi SET diaDiemSuDung=?, ngayHetHan=? WHERE maVe=?`,
            [diaDiemSuDung, ngayHetHan || null, maVe]
        );
        return result.affectedRows > 0;
    }

    // =================== LOẠI VÉ & GIÁ VÉ ===================



    static async getGiaVeByVe(maVe) {
        const [rows] = await pool.query(
            `SELECT gv.*, lv.tenLoaiVe FROM GiaVe gv
             LEFT JOIN LoaiVe lv ON gv.maLoaiVe = lv.maLoaiVe
             WHERE gv.maVe = ? ORDER BY gv.gia ASC`,
            [maVe]
        );
        return rows;
    }

    static async upsertGiaVe(maVe, maLoaiVe, gia, soChoTrong) {
        await pool.query(
            `INSERT INTO GiaVe (maVe, maLoaiVe, gia, soChoTrong) VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE gia = ?, soChoTrong = ?`,
            [maVe, maLoaiVe, gia, soChoTrong, gia, soChoTrong]
        );
    }

    static async updateSoChoTrong(maVe, maLoaiVe, delta) {
        const [result] = await pool.query(
            `UPDATE GiaVe SET soChoTrong = soChoTrong + ?
             WHERE maVe = ? AND maLoaiVe = ? AND soChoTrong + ? >= 0`,
            [delta, maVe, maLoaiVe, delta]
        );
        return result.affectedRows > 0;
    }

    static async removeGiaVe(maGiaVe) {
        const [result] = await pool.query(`DELETE FROM GiaVe WHERE maGiaVe = ?`, [maGiaVe]);
        return result.affectedRows > 0;
    }

    // =================== TÌM VÉ MÁY BAY (cho trang tìm kiếm) ===================

    static async searchVeMayBay({ diemKhoiHanh, diemDen, ngayKhoiHanh, limit = 20 } = {}) {
        const queryParams = [];
        let query = `
            SELECT v.maVe, v.loaiVeCon, v.trangThai,
                   mb.hangHangKhong, mb.soHieuChuyenBay, mb.diemKhoiHanh, mb.diemDen,
                   mb.thoiGianKhoiHanh, mb.thoiGianDen,
                   dv.ten AS tenDichVu, ncc.ten AS tenNhaCungCap,
                   MIN(gv.gia) AS giaThapNhat,
                   SUM(gv.soChoTrong) AS tongSoCho
            FROM Ve v
            JOIN VeMayBay mb ON v.maVe = mb.maVe
            LEFT JOIN DichVu dv ON v.maDichVu = dv.maDichVu
            LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
            LEFT JOIN GiaVe gv ON v.maVe = gv.maVe
            WHERE v.trangThai = 'AVAILABLE'
        `;
        if (diemKhoiHanh) { query += ` AND mb.diemKhoiHanh LIKE ?`; queryParams.push(`%${diemKhoiHanh}%`); }
        if (diemDen) { query += ` AND mb.diemDen LIKE ?`; queryParams.push(`%${diemDen}%`); }
        if (ngayKhoiHanh) { query += ` AND DATE(mb.thoiGianKhoiHanh) = ?`; queryParams.push(ngayKhoiHanh); }
        query += ` GROUP BY v.maVe ORDER BY mb.thoiGianKhoiHanh ASC LIMIT ?`;
        queryParams.push(parseInt(limit));

        const [rows] = await pool.query(query, queryParams);
        return rows;
    }

    static async searchVeTauHoa({ diemKhoiHanh, diemDen, ngayKhoiHanh, limit = 20 } = {}) {
        const queryParams = [];
        let query = `
            SELECT v.maVe, v.loaiVeCon, v.trangThai,
                   th.hangTau, th.soHieuChuyenTau, th.diemKhoiHanh, th.diemDen,
                   th.thoiGianKhoiHanh, th.thoiGianDen,
                   dv.ten AS tenDichVu, ncc.ten AS tenNhaCungCap,
                   MIN(gv.gia) AS giaThapNhat,
                   SUM(gv.soChoTrong) AS tongSoCho
            FROM Ve v
            JOIN VeTauHoa th ON v.maVe = th.maVe
            LEFT JOIN DichVu dv ON v.maDichVu = dv.maDichVu
            LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
            LEFT JOIN GiaVe gv ON v.maVe = gv.maVe
            WHERE v.trangThai = 'AVAILABLE'
        `;
        if (diemKhoiHanh) { query += ` AND th.diemKhoiHanh LIKE ?`; queryParams.push(`%${diemKhoiHanh}%`); }
        if (diemDen) { query += ` AND th.diemDen LIKE ?`; queryParams.push(`%${diemDen}%`); }
        if (ngayKhoiHanh) { query += ` AND DATE(th.thoiGianKhoiHanh) = ?`; queryParams.push(ngayKhoiHanh); }
        query += ` GROUP BY v.maVe ORDER BY th.thoiGianKhoiHanh ASC LIMIT ?`;
        queryParams.push(parseInt(limit));

        const [rows] = await pool.query(query, queryParams);
        return rows;
    }
}

module.exports = VeModel;
