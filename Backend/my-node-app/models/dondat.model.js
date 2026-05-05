const { pool } = require('../config/db');
const KhuyenMaiModel = require('./khuyenmai.model');

class DonDatModel {
    /**
     * Admin: Lấy danh sách tất cả đơn đặt
     */
    static async getAll({ page = 1, limit = 10, trangThai, search, maUser } = {}) {
        const offset = (page - 1) * limit;
        const queryParams = [];
        let baseQuery = `
            FROM DonDat dd
            LEFT JOIN Users u ON dd.maUser = u.maUser
            LEFT JOIN KhuyenMai km ON dd.maKhuyenMai = km.maKhuyenMai
            WHERE 1=1
        `;
        if (trangThai) { baseQuery += ` AND dd.trangThai = ?`; queryParams.push(trangThai.toUpperCase()); }
        if (maUser) { baseQuery += ` AND dd.maUser = ?`; queryParams.push(parseInt(maUser)); }
        if (search) {
            baseQuery += ` AND (u.ten LIKE ? OR u.email LIKE ? OR CAST(dd.maDon AS CHAR) LIKE ?)`;
            const s = `%${search}%`; queryParams.push(s, s, s);
        }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        let dataQuery = `
            SELECT dd.*, u.ten AS tenUser, u.email AS emailUser, u.sdt AS sdtUser,
                   km.ten AS tenKhuyenMai, km.giamGia
            ${baseQuery}
            ORDER BY dd.ngayTao DESC
            LIMIT ? OFFSET ?
        `;
        queryParams.push(parseInt(limit), parseInt(offset));
        const [rows] = await pool.query(dataQuery, queryParams);

        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: parseInt(page) };
    }

    /**
     * Lấy chi tiết 1 đơn đặt (kèm ChiTietDon + ThanhToan)
     */
    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT dd.*, u.ten AS tenUser, u.email AS emailUser, u.sdt AS sdtUser,
                    km.ten AS tenKhuyenMai, km.giamGia
             FROM DonDat dd
             LEFT JOIN Users u ON dd.maUser = u.maUser
             LEFT JOIN KhuyenMai km ON dd.maKhuyenMai = km.maKhuyenMai
             WHERE dd.maDon = ?`,
            [id]
        );
        if (!rows[0]) return null;
        const don = rows[0];

        const [chiTiet] = await pool.query(
            `SELECT ct.*, dv.ten AS tenDichVu, dv.loaiDichVu
             FROM ChiTietDon ct
             LEFT JOIN DichVu dv ON ct.maDichVu = dv.maDichVu
             WHERE ct.maDon = ?
             ORDER BY ct.maChiTiet ASC`,
            [id]
        );
        don.chiTietDon = chiTiet;

        const [thanhToan] = await pool.query(
            `SELECT * FROM ThanhToan WHERE maDon = ? ORDER BY ngayTao DESC`,
            [id]
        );
        don.lichSuThanhToan = thanhToan;

        return don;
    }

    /**
     * Customer: Lấy danh sách đơn của bản thân
     */
    static async getByUser(maUser, { page = 1, limit = 10, trangThai } = {}) {
        const offset = (page - 1) * limit;
        const queryParams = [maUser];
        let baseQuery = `FROM DonDat dd WHERE dd.maUser = ?`;
        if (trangThai) { baseQuery += ` AND dd.trangThai = ?`; queryParams.push(trangThai.toUpperCase()); }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        let dataQuery = `
            SELECT dd.*, km.ten AS tenKhuyenMai
            ${baseQuery}
            LEFT JOIN KhuyenMai km ON dd.maKhuyenMai = km.maKhuyenMai
            ORDER BY dd.ngayTao DESC
            LIMIT ? OFFSET ?
        `;
        queryParams.push(parseInt(limit), parseInt(offset));
        const [rows] = await pool.query(dataQuery, queryParams);

        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: parseInt(page) };
    }

    /**
     * Customer: Tạo đơn đặt (kèm danh sách chi tiết)
     * chiTietList: [{ maDichVu, maPhanLoaiDichVu, soLuong, giaTaiThoiDiemMua, ngayBatDauSuDung, ngayKetThucSuDung }]
     */
    static async create(maUser, maKhuyenMai, chiTietList) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Tính tổng giá gốc
            let tongGia = chiTietList.reduce((sum, ct) => sum + ct.soLuong * ct.giaTaiThoiDiemMua, 0);

            // Áp dụng khuyến mãi nếu có
            let appliedKhuyenMai = null;
            if (maKhuyenMai) {
                const km = await KhuyenMaiModel.validateKhuyenMai(maKhuyenMai);
                if (km) {
                    appliedKhuyenMai = km;
                    // Nếu giảm giá <= 100 -> coi là % giảm, ngược lại là tiền trực tiếp
                    if (km.giamGia <= 100) {
                        tongGia = tongGia * (1 - km.giamGia / 100);
                    } else {
                        tongGia = Math.max(0, tongGia - km.giamGia);
                    }
                }
            }

            const [donResult] = await conn.query(
                `INSERT INTO DonDat (maUser, maKhuyenMai, tongGia, trangThai) VALUES (?, ?, ?, 'PENDING')`,
                [maUser, appliedKhuyenMai ? maKhuyenMai : null, tongGia]
            );
            const maDon = donResult.insertId;

            // Tạo chi tiết đơn
            for (const ct of chiTietList) {
                await conn.query(
                    `INSERT INTO ChiTietDon (maDon, maDichVu, maPhanLoaiDichVu, soLuong, giaTaiThoiDiemMua, ngayBatDauSuDung, ngayKetThucSuDung)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [maDon, ct.maDichVu, ct.maPhanLoaiDichVu || null, ct.soLuong, ct.giaTaiThoiDiemMua,
                     ct.ngayBatDauSuDung || null, ct.ngayKetThucSuDung || null]
                );
            }

            await conn.commit();
            conn.release();
            return { maDon, maUser, tongGia, trangThai: 'PENDING', chiTietDon: chiTietList };
        } catch (err) {
            await conn.rollback();
            conn.release();
            throw err;
        }
    }

    /**
     * Admin: Cập nhật trạng thái đơn
     */
    static async updateStatus(id, trangThai) {
        const validStatuses = ['PENDING', 'CONFIRMED', 'PAID', 'PARTIAL_PAID', 'CANCELLED', 'COMPLETED'];
        if (!validStatuses.includes(trangThai)) throw new Error('Trạng thái đơn không hợp lệ!');
        const [result] = await pool.query(`UPDATE DonDat SET trangThai = ? WHERE maDon = ?`, [trangThai, id]);
        return result.affectedRows > 0;
    }

    /**
     * Customer: Hủy đơn (chỉ hủy nếu đang PENDING)
     */
    static async cancelByUser(maDon, maUser) {
        const [rows] = await pool.query(`SELECT * FROM DonDat WHERE maDon = ? AND maUser = ?`, [maDon, maUser]);
        if (!rows[0]) throw new Error('Không tìm thấy đơn đặt!');
        if (rows[0].trangThai !== 'PENDING') throw new Error('Chỉ có thể hủy đơn đang ở trạng thái PENDING!');
        await pool.query(`UPDATE DonDat SET trangThai = 'CANCELLED' WHERE maDon = ?`, [maDon]);
        return true;
    }
}

module.exports = DonDatModel;
