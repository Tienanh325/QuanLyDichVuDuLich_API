const { pool } = require('../config/db');

class HinhAnhModel {
    static async getByDichVu(maDichVu) {
        const [rows] = await pool.query(
            `SELECT * FROM HinhAnh WHERE maDichVu = ? ORDER BY isAvatar DESC`,
            [maDichVu]
        );
        return rows;
    }

    static async create(maDichVu, urlAnh, isAvatar = false) {
        // Nếu đây là avatar, reset avatar cũ
        if (isAvatar) {
            await pool.query(`UPDATE HinhAnh SET isAvatar = 0 WHERE maDichVu = ?`, [maDichVu]);
        }
        const [result] = await pool.query(
            `INSERT INTO HinhAnh (maDichVu, urlAnh, isAvatar) VALUES (?, ?, ?)`,
            [maDichVu, urlAnh, isAvatar ? 1 : 0]
        );
        return { maHinhAnh: result.insertId, maDichVu, urlAnh, isAvatar };
    }

    static async setAvatar(maHinhAnh, maDichVu) {
        await pool.query(`UPDATE HinhAnh SET isAvatar = 0 WHERE maDichVu = ?`, [maDichVu]);
        const [result] = await pool.query(
            `UPDATE HinhAnh SET isAvatar = 1 WHERE maHinhAnh = ? AND maDichVu = ?`,
            [maHinhAnh, maDichVu]
        );
        return result.affectedRows > 0;
    }

    static async remove(maHinhAnh) {
        const [result] = await pool.query(`DELETE FROM HinhAnh WHERE maHinhAnh = ?`, [maHinhAnh]);
        return result.affectedRows > 0;
    }
}

module.exports = HinhAnhModel;
