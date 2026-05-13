const { pool } = require('../config/db');

class DichVuModel {
    /**
     * Lấy danh sách dịch vụ có phân trang, lọc, tìm kiếm
     */
    static async getAll({ page = 1, limit = 12, sortBy, status, loaiDichVu, search, maNhaCungCap } = {}) {
        const queryParams = [];
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.max(parseInt(limit, 10) || 12, 1);
        const offsetNum = (pageNum - 1) * limitNum;
        let baseQuery = `
                FROM DichVu dv
                LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
                WHERE 1=1
            `;

        if (status !== undefined && status !== '') {
            baseQuery += ` AND dv.trangThai = ?`;
            queryParams.push((status === 'true' || status === '1' || status === true) ? 1 : 0);
        }
        if (loaiDichVu) {
            baseQuery += ` AND dv.loaiDichVu = ?`;
            queryParams.push(loaiDichVu.toUpperCase());
        }
        if (maNhaCungCap) {
            baseQuery += ` AND dv.maNhaCungCap = ?`;
            queryParams.push(parseInt(maNhaCungCap, 10));
        }
        if (search) {
            baseQuery += ` AND (dv.ten LIKE ? OR dv.moTa LIKE ?)`;
            const s = `%${search}%`;
            queryParams.push(s, s);
        }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0]?.total || 0;

        const selectFields = `
                dv.maDichVu, dv.ten, dv.moTa, dv.loaiDichVu,
                dv.maNhaCungCap, ncc.ten AS tenNhaCungCap,
                dv.trangThai,
                NULL AS avatar
            `;
        let dataQuery = `SELECT ${selectFields} ${baseQuery}`;

        const allowedSortCols = { maDichVu: 'dv.maDichVu', ten: 'dv.ten', loaiDichVu: 'dv.loaiDichVu' };
        if (sortBy) {
            const isDesc = sortBy.startsWith('-');
            const colKey = isDesc ? sortBy.substring(1) : sortBy;
            dataQuery += ` ORDER BY ${allowedSortCols[colKey] || 'dv.maDichVu'} ${isDesc ? 'DESC' : 'ASC'}`;
        } else {
            dataQuery += ` ORDER BY dv.maDichVu DESC`;
        }

        dataQuery += ` LIMIT ? OFFSET ?`;
        queryParams.push(limitNum, offsetNum);

        const [rows] = await pool.query(dataQuery, queryParams);
        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limitNum), currentPage: pageNum };
    }

    /**
     * Lấy chi tiết 1 dịch vụ kèm hình ảnh và thông tin con (Tour/KhachSan/Ve)
     */
    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT dv.*, ncc.ten AS tenNhaCungCap, ncc.sdt AS sdtNhaCungCap
             FROM DichVu dv
             LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
             WHERE dv.maDichVu = ?`,
            [id]
        );
        if (!rows[0]) return null;

        const dichvu = rows[0];

        // Lấy thông tin con tùy loaiDichVu
        if (dichvu.loaiDichVu === 'TOUR') {
            const [tourData] = await pool.query(`SELECT * FROM Tour WHERE maDichVu = ?`, [id]);
            dichvu.chiTiet = tourData[0] || null;
        } else if (dichvu.loaiDichVu === 'KHACH_SAN') {
            const [ksData] = await pool.query(`SELECT * FROM KhachSan WHERE maDichVu = ?`, [id]);
            if (ksData[0]) {
                const [loaiPhong] = await pool.query(
                    `SELECT * FROM LoaiPhong WHERE maKhachSan = ?`,
                    [ksData[0].maKhachSan]
                );
                dichvu.chiTiet = { ...ksData[0], loaiPhong };
            }
        } else if (dichvu.loaiDichVu === 'VE') {
            const [veData] = await pool.query(
                `SELECT v.*, gv.gia, gv.soChoTrong, lv.tenLoaiVe
                 FROM Ve v
                 LEFT JOIN GiaVe gv ON v.maVe = gv.maVe
                 LEFT JOIN LoaiVe lv ON gv.maLoaiVe = lv.maLoaiVe
                 WHERE v.maDichVu = ?`,
                [id]
            );
            dichvu.chiTiet = veData;
        }

        // Đánh giá trung bình
        const [rating] = await pool.query(
            `SELECT AVG(soSao) AS diemTrungBinh, COUNT(*) AS soLuongDanhGia
             FROM DanhGia WHERE maDichVu = ?`,
            [id]
        );
        dichvu.danhGia = rating[0];

        return dichvu;
    }

    /**
     * Tạo dịch vụ mới
     */
    static async create(data) {
        const { ten, moTa, loaiDichVu, maNhaCungCap, trangThai } = data;
        const statusValue = trangThai !== undefined ? trangThai : true;
        const [result] = await pool.query(
            `INSERT INTO DichVu (ten, moTa, loaiDichVu, maNhaCungCap, trangThai) VALUES (?, ?, ?, ?, ?)`,
            [ten, moTa, loaiDichVu, maNhaCungCap || null, statusValue]
        );
        return { maDichVu: result.insertId, ...data, trangThai: statusValue };
    }

    /**
     * Cập nhật dịch vụ
     */
    static async update(id, data) {
        const { ten, moTa, loaiDichVu, maNhaCungCap, trangThai } = data;
        const statusValue = (trangThai !== undefined && trangThai !== null) ? trangThai : 1;
        const params = [ten, moTa, loaiDichVu, maNhaCungCap || null, statusValue, id];
        console.log('[DichVuModel.update] id:', id, '| trangThai received:', trangThai, '| statusValue:', statusValue, '| all params:', JSON.stringify(params));
        const [result] = await pool.query(
            `UPDATE DichVu SET ten = ?, moTa = ?, loaiDichVu = ?, maNhaCungCap = ?, trangThai = ? WHERE maDichVu = ?`,
            params
        );
        console.log('[DichVuModel.update] result:', JSON.stringify({ affectedRows: result.affectedRows, changedRows: result.changedRows }));
        return result.affectedRows > 0;
    }

    /**
     * Cập nhật trạng thái
     */
    static async updateStatus(id, status) {
        const statusValue = (status === 'true' || status === true || status === '1') ? 1 : 0;
        const [result] = await pool.query(
            `UPDATE DichVu SET trangThai = ? WHERE maDichVu = ?`,
            [statusValue, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Xóa dịch vụ (sẽ cascade xóa hình ảnh và bảng con)
     */
    static async remove(id) {
        const [result] = await pool.query(`DELETE FROM DichVu WHERE maDichVu = ?`, [id]);
        return result.affectedRows > 0;
    }

    /**
     * Lấy các dịch vụ nổi bật/được đánh giá cao (cho trang chủ)
     */
    static async getFeatured(loaiDichVu, limit = 8) {
        const params = [];
        let query = `
            SELECT dv.maDichVu, dv.ten, dv.moTa, dv.loaiDichVu,
                   ncc.ten AS tenNhaCungCap,
                   ha.urlAnh AS avatar,
                   AVG(dg.soSao) AS diemTrungBinh, COUNT(dg.maDanhGia) AS soLuongDanhGia
            FROM DichVu dv
            LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
            LEFT JOIN DanhGia dg ON dv.maDichVu = dg.maDichVu
            WHERE dv.trangThai = 1
        `;
        if (loaiDichVu) {
            query += ` AND dv.loaiDichVu = ?`;
            params.push(loaiDichVu.toUpperCase());
        }
        query += ` GROUP BY dv.maDichVu ORDER BY diemTrungBinh DESC, soLuongDanhGia DESC LIMIT ?`;
        params.push(parseInt(limit));

        const [rows] = await pool.query(query, params);
        return rows;
    }
}

module.exports = DichVuModel;
