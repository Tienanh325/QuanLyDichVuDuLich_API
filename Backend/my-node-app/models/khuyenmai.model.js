const { pool } = require('../config/db');

class KhuyenMaiModel {
    static async getAll({ page = 1, limit = 10, status } = {}) {
        const offset = (page - 1) * limit;
        const queryParams = [];
        let baseQuery = `FROM KhuyenMai WHERE 1=1`;
        if (status !== undefined && status !== '') {
            baseQuery += ` AND trangThai = ?`;
            queryParams.push((status === 'true' || status === '1') ? 1 : 0);
        }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        let dataQuery = `SELECT * ${baseQuery} ORDER BY ngayBatDau DESC LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.query(dataQuery, queryParams);
        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: parseInt(page) };
    }

    static async getById(id) {
        const [rows] = await pool.query(`SELECT * FROM KhuyenMai WHERE maKhuyenMai = ?`, [id]);
        return rows[0] || null;
    }

    /** Kiểm tra mã khuyến mãi còn hiệu lực không */
    static async validateKhuyenMai(maKhuyenMai) {
        const [rows] = await pool.query(
            `SELECT * FROM KhuyenMai
             WHERE maKhuyenMai = ? AND trangThai = 1
               AND ngayBatDau <= NOW() AND ngayKetThuc >= NOW()`,
            [maKhuyenMai]
        );
        return rows[0] || null;
    }

    static async create(data) {
        const { ten, giamGia, ngayBatDau, ngayKetThuc } = data;
        const [result] = await pool.query(
            `INSERT INTO KhuyenMai (ten, giamGia, ngayBatDau, ngayKetThuc, trangThai) VALUES (?, ?, ?, ?, 1)`,
            [ten, giamGia, ngayBatDau, ngayKetThuc]
        );
        return { maKhuyenMai: result.insertId, ...data };
    }

    static async update(id, data) {
        const { ten, giamGia, ngayBatDau, ngayKetThuc } = data;
        const [result] = await pool.query(
            `UPDATE KhuyenMai SET ten=?, giamGia=?, ngayBatDau=?, ngayKetThuc=? WHERE maKhuyenMai=?`,
            [ten, giamGia, ngayBatDau, ngayKetThuc, id]
        );
        return result.affectedRows > 0;
    }

    static async updateStatus(id, status) {
        const sv = (status === 'true' || status === true || status === '1') ? 1 : 0;
        const [result] = await pool.query(`UPDATE KhuyenMai SET trangThai = ? WHERE maKhuyenMai = ?`, [sv, id]);
        return result.affectedRows > 0;
    }

    static async remove(id) {
        const [result] = await pool.query(`DELETE FROM KhuyenMai WHERE maKhuyenMai = ?`, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = KhuyenMaiModel;
