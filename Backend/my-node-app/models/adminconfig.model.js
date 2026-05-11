const { pool } = require('../config/db');

function toStatusValue(status) {
    return (status === false || status === 'false' || status === '0' || status === 0 || status === 'inactive') ? 0 : 1;
}

class AdminConfigModel {
    static async getDanhMucHoatDong() {
        const [rows] = await pool.query(`SELECT * FROM DanhMucHoatDong ORDER BY thuTu ASC, maDanhMuc DESC`);
        return rows;
    }

    static async createDanhMucHoatDong(data) {
        const { tenDanhMuc, icon, gradient, moTa, trangThai, thuTu } = data;
        const [result] = await pool.query(
            `INSERT INTO DanhMucHoatDong (tenDanhMuc, icon, gradient, moTa, trangThai, thuTu) VALUES (?, ?, ?, ?, ?, ?)`,
            [tenDanhMuc, icon || null, gradient || null, moTa || null, toStatusValue(trangThai), Number(thuTu || 0)]
        );
        return { maDanhMuc: result.insertId, tenDanhMuc, icon, gradient, moTa, trangThai: toStatusValue(trangThai), thuTu: Number(thuTu || 0) };
    }

    static async updateDanhMucHoatDong(id, data) {
        const { tenDanhMuc, icon, gradient, moTa, trangThai, thuTu } = data;
        const [result] = await pool.query(
            `UPDATE DanhMucHoatDong SET tenDanhMuc=?, icon=?, gradient=?, moTa=?, trangThai=?, thuTu=? WHERE maDanhMuc=?`,
            [tenDanhMuc, icon || null, gradient || null, moTa || null, toStatusValue(trangThai), Number(thuTu || 0), id]
        );
        return result.affectedRows > 0;
    }

    static async removeDanhMucHoatDong(id) {
        const [result] = await pool.query(`DELETE FROM DanhMucHoatDong WHERE maDanhMuc=?`, [id]);
        return result.affectedRows > 0;
    }

    static async getTienIch({ loaiTienIch } = {}) {
        const params = [];
        let query = `SELECT * FROM TienIch WHERE 1=1`;
        if (loaiTienIch) {
            query += ` AND loaiTienIch = ?`;
            params.push(loaiTienIch);
        }
        query += ` ORDER BY loaiTienIch ASC, tenTienIch ASC`;
        const [rows] = await pool.query(query, params);
        return rows;
    }

    static async createTienIch(data) {
        const { tenTienIch, icon, loaiTienIch, trangThai } = data;
        const [result] = await pool.query(
            `INSERT INTO TienIch (tenTienIch, icon, loaiTienIch, trangThai) VALUES (?, ?, ?, ?)`,
            [tenTienIch, icon || null, loaiTienIch, toStatusValue(trangThai)]
        );
        return { maTienIch: result.insertId, tenTienIch, icon, loaiTienIch, trangThai: toStatusValue(trangThai) };
    }

    static async updateTienIch(id, data) {
        const { tenTienIch, icon, loaiTienIch, trangThai } = data;
        const [result] = await pool.query(
            `UPDATE TienIch SET tenTienIch=?, icon=?, loaiTienIch=?, trangThai=? WHERE maTienIch=?`,
            [tenTienIch, icon || null, loaiTienIch, toStatusValue(trangThai), id]
        );
        return result.affectedRows > 0;
    }

    static async removeTienIch(id) {
        const [result] = await pool.query(`DELETE FROM TienIch WHERE maTienIch=?`, [id]);
        return result.affectedRows > 0;
    }

    static async getNewsletter({ status, source } = {}) {
        const params = [];
        let query = `SELECT * FROM NewsletterSubscription WHERE 1=1`;
        if (status) { query += ` AND trangThai = ?`; params.push(status); }
        if (source) { query += ` AND source = ?`; params.push(source); }
        query += ` ORDER BY ngayTao DESC`;
        const [rows] = await pool.query(query, params);
        return rows;
    }

    static async updateNewsletterStatus(id, trangThai) {
        const [result] = await pool.query(
            `UPDATE NewsletterSubscription SET trangThai=? WHERE maDangKy=?`,
            [trangThai, id]
        );
        return result.affectedRows > 0;
    }

    static async removeNewsletter(id) {
        const [result] = await pool.query(`DELETE FROM NewsletterSubscription WHERE maDangKy=?`, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = AdminConfigModel;
