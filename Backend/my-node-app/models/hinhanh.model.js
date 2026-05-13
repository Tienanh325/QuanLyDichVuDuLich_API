const { pool } = require('../config/db');

const SORT_FIELDS = new Set(['altText', 'thuTu']);
class HinhAnhModel {
    static async getAll(filters = {}) {
        const conditions = [];
        const values = [];

        if (filters.search) {
            conditions.push('(ha.altText LIKE ? OR ha.urlAnh LIKE ?)');
            const keyword = `%${filters.search}%`;
            values.push(keyword, keyword);
        }

        if (filters.isAvatar !== undefined && filters.isAvatar !== '') {
            conditions.push('ha.isAvatar = ?');
            values.push(Number(filters.isAvatar) ? 1 : 0);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const sortBy = SORT_FIELDS.has(filters.sortBy) ? filters.sortBy : 'maHinhAnh';
        const sortOrder = String(filters.sortOrder).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        const limit = Math.max(parseInt(filters.limit, 10) || 100, 1);
        const page = Math.max(parseInt(filters.page, 10) || 1, 1);
        const offset = (page - 1) * limit;

        const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM HinhAnh ha ${whereClause}`, values);
        const totalRecords = countRows[0]?.total || 0;

        const [rows] = await pool.query(
            `SELECT ha.*
             FROM HinhAnh ha
             ${whereClause}
             ORDER BY ha.${sortBy} ${sortOrder}, ha.maHinhAnh DESC
             LIMIT ? OFFSET ?`,
            [...values, limit, offset]
        );
        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: page };
    }

    static async getById(maHinhAnh) {
        const [rows] = await pool.query(
            `SELECT ha.*
             FROM HinhAnh ha
             WHERE ha.maHinhAnh = ?`,
            [maHinhAnh]
        );
        return rows[0] || null;
    }

    static async getByDichVu(_maDichVu) {
        return [];
    }

    static async create(urlAnh, isAvatar = false, altText = null, thuTu = 0) {
        if (isAvatar) {
            await pool.query(`UPDATE HinhAnh SET isAvatar = 0`);
        }
        const [result] = await pool.query(
            `INSERT INTO HinhAnh (urlAnh, altText, isAvatar, thuTu) VALUES (?, ?, ?, ?)`,
            [urlAnh, altText, isAvatar ? 1 : 0, thuTu]
        );
        return this.getById(result.insertId);
    }

    static async update(maHinhAnh, payload) {
        const existing = await this.getById(maHinhAnh);
        if (!existing) return null;

        const isAvatar = payload.isAvatar === true || payload.isAvatar === 1 || payload.isAvatar === '1';

        if (isAvatar) {
            await pool.query(`UPDATE HinhAnh SET isAvatar = 0 WHERE maHinhAnh <> ?`, [maHinhAnh]);
        }

        const [result] = await pool.query(
            `UPDATE HinhAnh
             SET urlAnh = ?, altText = ?, isAvatar = ?, thuTu = ?
             WHERE maHinhAnh = ?`,
            [
                payload.urlAnh ?? existing.urlAnh,
                payload.altText ?? null,
                isAvatar ? 1 : 0,
                Number(payload.thuTu ?? existing.thuTu ?? 0),
                maHinhAnh
            ]
        );

        return result.affectedRows > 0 ? this.getById(maHinhAnh) : null;
    }

    static async setAvatar(maHinhAnh) {
        await pool.query(`UPDATE HinhAnh SET isAvatar = 0`);
        const [result] = await pool.query(
            `UPDATE HinhAnh SET isAvatar = 1 WHERE maHinhAnh = ?`,
            [maHinhAnh]
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
