const { pool } = require('../config/db');

const SORT_FIELDS = new Set(['ngayTao', 'altText', 'thuTu']);

class HinhAnhModel {
    static async getAll(filters = {}) {
        const conditions = [];
        const values = [];

        if (filters.search) {
            conditions.push('(ha.altText LIKE ? OR ha.urlAnh LIKE ? OR dv.ten LIKE ?)');
            const keyword = `%${filters.search}%`;
            values.push(keyword, keyword, keyword);
        }

        if (filters.isAvatar !== undefined && filters.isAvatar !== '') {
            conditions.push('ha.isAvatar = ?');
            values.push(Number(filters.isAvatar) ? 1 : 0);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const sortBy = SORT_FIELDS.has(filters.sortBy) ? filters.sortBy : 'ngayTao';
        const sortOrder = String(filters.sortOrder).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const [rows] = await pool.query(
            `SELECT ha.*, dv.ten AS tenDichVu
             FROM HinhAnh ha
             JOIN DichVu dv ON dv.maDichVu = ha.maDichVu
             ${whereClause}
             ORDER BY ha.${sortBy} ${sortOrder}, ha.maHinhAnh DESC`,
            values
        );
        return rows;
    }

    static async getById(maHinhAnh) {
        const [rows] = await pool.query(
            `SELECT ha.*, dv.ten AS tenDichVu
             FROM HinhAnh ha
             JOIN DichVu dv ON dv.maDichVu = ha.maDichVu
             WHERE ha.maHinhAnh = ?`,
            [maHinhAnh]
        );
        return rows[0] || null;
    }

    static async getByDichVu(maDichVu) {
        const [rows] = await pool.query(
            `SELECT * FROM HinhAnh WHERE maDichVu = ? ORDER BY isAvatar DESC, thuTu ASC`,
            [maDichVu]
        );
        return rows;
    }

    static async create(maDichVu, urlAnh, isAvatar = false, altText = null, thuTu = 0) {
        if (isAvatar) {
            await pool.query(`UPDATE HinhAnh SET isAvatar = 0 WHERE maDichVu = ?`, [maDichVu]);
        }
        const [result] = await pool.query(
            `INSERT INTO HinhAnh (maDichVu, urlAnh, altText, isAvatar, thuTu) VALUES (?, ?, ?, ?, ?)`,
            [maDichVu, urlAnh, altText, isAvatar ? 1 : 0, thuTu]
        );
        return this.getById(result.insertId);
    }

    static async update(maHinhAnh, payload) {
        const existing = await this.getById(maHinhAnh);
        if (!existing) return null;

        const maDichVu = payload.maDichVu ?? existing.maDichVu;
        const isAvatar = payload.isAvatar === true || payload.isAvatar === 1 || payload.isAvatar === '1';

        if (isAvatar) {
            await pool.query(`UPDATE HinhAnh SET isAvatar = 0 WHERE maDichVu = ? AND maHinhAnh <> ?`, [maDichVu, maHinhAnh]);
        }

        const [result] = await pool.query(
            `UPDATE HinhAnh
             SET maDichVu = ?, urlAnh = ?, altText = ?, isAvatar = ?, thuTu = ?
             WHERE maHinhAnh = ?`,
            [
                maDichVu,
                payload.urlAnh ?? existing.urlAnh,
                payload.altText ?? null,
                isAvatar ? 1 : 0,
                Number(payload.thuTu ?? existing.thuTu ?? 0),
                maHinhAnh
            ]
        );

        return result.affectedRows > 0 ? this.getById(maHinhAnh) : null;
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

    static async removeMany(ids) {
        if (!ids.length) return 0;
        const placeholders = ids.map(() => '?').join(',');
        const [result] = await pool.query(`DELETE FROM HinhAnh WHERE maHinhAnh IN (${placeholders})`, ids);
        return result.affectedRows;
    }
}

module.exports = HinhAnhModel;
