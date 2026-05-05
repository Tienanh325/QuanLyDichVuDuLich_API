const { pool } = require('../config/db');

class DanhGiaModel {
    static async getAll({ page = 1, limit = 10, maDichVu, maUser, soSao } = {}) {
        const offset = (page - 1) * limit;
        const queryParams = [];
        let baseQuery = `
            FROM DanhGia dg
            LEFT JOIN Users u ON dg.maUser = u.maUser
            LEFT JOIN DichVu dv ON dg.maDichVu = dv.maDichVu
            WHERE 1=1
        `;
        if (maDichVu) { baseQuery += ` AND dg.maDichVu = ?`; queryParams.push(parseInt(maDichVu)); }
        if (maUser) { baseQuery += ` AND dg.maUser = ?`; queryParams.push(parseInt(maUser)); }
        if (soSao) { baseQuery += ` AND dg.soSao = ?`; queryParams.push(parseInt(soSao)); }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        let dataQuery = `
            SELECT dg.*, u.ten AS tenUser, u.username, dv.ten AS tenDichVu
            ${baseQuery}
            ORDER BY dg.ngayDanhGia DESC
            LIMIT ? OFFSET ?
        `;
        queryParams.push(parseInt(limit), parseInt(offset));
        const [rows] = await pool.query(dataQuery, queryParams);

        // Thống kê phân phối sao cho dịch vụ
        let thongKeSao = null;
        if (maDichVu) {
            const [stats] = await pool.query(
                `SELECT soSao, COUNT(*) AS soLuong FROM DanhGia WHERE maDichVu = ? GROUP BY soSao ORDER BY soSao DESC`,
                [maDichVu]
            );
            const [avg] = await pool.query(
                `SELECT AVG(soSao) AS diemTrungBinh, COUNT(*) AS tongDanhGia FROM DanhGia WHERE maDichVu = ?`,
                [maDichVu]
            );
            thongKeSao = { phanPhoi: stats, ...avg[0] };
        }

        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: parseInt(page), thongKeSao };
    }

    static async create(maUser, data) {
        const { maDichVu, soSao, binhLuan } = data;

        // Kiểm tra đã đánh giá chưa
        const [existing] = await pool.query(
            `SELECT * FROM DanhGia WHERE maUser = ? AND maDichVu = ?`,
            [maUser, maDichVu]
        );
        if (existing[0]) throw new Error('Bạn đã đánh giá dịch vụ này rồi!');

        // Kiểm tra user đã từng đặt dịch vụ này chưa
        const [ordered] = await pool.query(
            `SELECT ct.maChiTiet FROM ChiTietDon ct
             JOIN DonDat dd ON ct.maDon = dd.maDon
             WHERE dd.maUser = ? AND ct.maDichVu = ? AND dd.trangThai IN ('PAID', 'COMPLETED')
             LIMIT 1`,
            [maUser, maDichVu]
        );
        if (!ordered[0]) throw new Error('Bạn cần đặt và hoàn thành dịch vụ này trước khi đánh giá!');

        const [result] = await pool.query(
            `INSERT INTO DanhGia (maUser, maDichVu, soSao, binhLuan) VALUES (?, ?, ?, ?)`,
            [maUser, maDichVu, soSao, binhLuan || null]
        );
        return { maDanhGia: result.insertId, maUser, maDichVu, soSao, binhLuan };
    }

    static async update(maDanhGia, maUser, data) {
        const { soSao, binhLuan } = data;
        const [result] = await pool.query(
            `UPDATE DanhGia SET soSao=?, binhLuan=? WHERE maDanhGia=? AND maUser=?`,
            [soSao, binhLuan || null, maDanhGia, maUser]
        );
        return result.affectedRows > 0;
    }

    /**
     * User xóa đánh giá của mình HOẶC Admin xóa bất kỳ
     */
    static async remove(maDanhGia, maUser = null) {
        let query = `DELETE FROM DanhGia WHERE maDanhGia = ?`;
        const params = [maDanhGia];
        if (maUser !== null) { query += ` AND maUser = ?`; params.push(maUser); }
        const [result] = await pool.query(query, params);
        return result.affectedRows > 0;
    }
}

module.exports = DanhGiaModel;
