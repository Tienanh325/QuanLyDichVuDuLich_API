const { pool } = require('../config/db');

class LoaiVeModel {
    static async getAllLoaiVe() {
        const [rows] = await pool.query(`SELECT * FROM LoaiVe ORDER BY maLoaiVe ASC`);
        return rows;
    }

    static async createLoaiVe(tenLoaiVe, trangThai = 1) {
        const [result] = await pool.query(
            `INSERT INTO LoaiVe (tenLoaiVe, trangThai) VALUES (?, ?)`,
            [tenLoaiVe, trangThai]
        );
        return { maLoaiVe: result.insertId, tenLoaiVe, trangThai };
    }

    static async updateLoaiVe(id, tenLoaiVe, trangThai) {
        const [result] = await pool.query(
            `UPDATE LoaiVe SET tenLoaiVe = ?, trangThai = ? WHERE maLoaiVe = ?`,
            [tenLoaiVe, trangThai, id]
        );
        return result.affectedRows > 0;
    }

    static async removeLoaiVe(id) {
        const [result] = await pool.query(`DELETE FROM LoaiVe WHERE maLoaiVe = ?`, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = LoaiVeModel;
