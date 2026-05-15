const { pool } = require('../config/db');

const serviceTypeMapSql = `
    CASE
        WHEN dv.loaiDichVu = 'KHACH_SAN' THEN 'KHACH_SAN'
        WHEN dv.loaiDichVu = 'VE_MAY_BAY' THEN 'MAY_BAY'
        WHEN dv.loaiDichVu = 'VE_TAU' THEN 'TAU'
        ELSE 'TOUR'
    END
`;

class DanhGiaModel {
    static async getAll({ page = 1, limit = 10, maDichVu, maUser, soSao, sort = 'newest', hasImages, verified } = {}) {
        const offset = (Number(page) - 1) * Number(limit);
        const queryParams = [];
        let baseQuery = `
            FROM DanhGia dg
            LEFT JOIN Users u ON dg.maUser = u.maUser
            LEFT JOIN DichVu dv ON dg.maDichVu = dv.maDichVu
            WHERE 1=1
        `;
        if (maDichVu) { baseQuery += ` AND dg.maDichVu = ?`; queryParams.push(Number(maDichVu)); }
        if (maUser) { baseQuery += ` AND dg.maUser = ?`; queryParams.push(Number(maUser)); }
        if (soSao) { baseQuery += ` AND dg.soSao = ?`; queryParams.push(Number(soSao)); }
        if (verified === 'true') { baseQuery += ` AND dg.maDon IS NOT NULL`; }
        if (hasImages === 'true') { baseQuery += ` AND EXISTS (SELECT 1 FROM AnhDanhGia a WHERE a.maDanhGia = dg.maDanhGia)`; }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;
        const orderBy = sort === 'highest' ? 'dg.soSao DESC, dg.ngayDanhGia DESC'
            : sort === 'lowest' ? 'dg.soSao ASC, dg.ngayDanhGia DESC'
            : sort === 'images' ? '(SELECT COUNT(*) FROM AnhDanhGia a WHERE a.maDanhGia = dg.maDanhGia) DESC, dg.ngayDanhGia DESC'
            : 'dg.ngayDanhGia DESC';

        const dataParams = [...queryParams, Number(limit), offset];
        const [rows] = await pool.query(`
            SELECT dg.*, u.ten AS tenUser, u.username, dv.ten AS tenDichVu,
                   ${serviceTypeMapSql} AS loaiReview,
                   dg.maDon IS NOT NULL AS daXacMinh
            ${baseQuery}
            ORDER BY ${orderBy}
            LIMIT ? OFFSET ?
        `, dataParams);

        await this.attachReviewDetails(rows);
        const thongKeSao = maDichVu ? await this.getSummary(maDichVu) : null;
        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / Number(limit)), currentPage: Number(page), thongKeSao };
    }

    static async getSummary(maDichVu) {
        const [avg] = await pool.query(
            `SELECT AVG(soSao) AS diemTrungBinh, COUNT(*) AS tongDanhGia FROM DanhGia WHERE maDichVu = ?`,
            [maDichVu]
        );
        const [distribution] = await pool.query(
            `SELECT soSao, COUNT(*) AS soLuong FROM DanhGia WHERE maDichVu = ? GROUP BY soSao`,
            [maDichVu]
        );
        const subRatings = [];
        const phanPhoi = [5, 4, 3, 2, 1].map((star) => ({
            soSao: star,
            soLuong: distribution.find((item) => Number(item.soSao) === star)?.soLuong ?? 0,
        }));
        return { ...avg[0], phanPhoi, tieuChi: subRatings };
    }

    static async getCriteriaByService() {
        return [];
    }

    static async getMyReview(maUser, maDichVu) {
        const [rows] = await pool.query(`
            SELECT dg.* FROM DanhGia dg WHERE dg.maUser = ? AND dg.maDichVu = ? LIMIT 1
        `, [maUser, maDichVu]);
        await this.attachReviewDetails(rows);
        return rows[0] ?? null;
    }

    static async create(maUser, data) {
        const { maDichVu, soSao, tieuDe, binhLuan, tieuChi = [], hinhAnh = [] } = data;
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            const [existing] = await conn.query(`SELECT maDanhGia FROM DanhGia WHERE maUser = ? AND maDichVu = ?`, [maUser, maDichVu]);
            if (existing[0]) throw new Error('Bạn đã đánh giá dịch vụ này rồi!');

            const [ordered] = await conn.query(
                `SELECT dd.maDon FROM ChiTietDon ct
                 JOIN DonDat dd ON ct.maDon = dd.maDon
                 WHERE dd.maUser = ? AND ct.maDichVu = ? AND dd.trangThai IN ('PAID', 'COMPLETED')
                 ORDER BY dd.ngayTao DESC LIMIT 1`,
                [maUser, maDichVu]
            );
            const [result] = await conn.query(
                `INSERT INTO DanhGia (maUser, maDichVu, maDon, soSao, tieuDe, binhLuan) VALUES (?, ?, ?, ?, ?, ?)`,
                [maUser, maDichVu, ordered[0]?.maDon ?? null, soSao, tieuDe || null, binhLuan || null]
            );
            await this.replaceDetails(conn, result.insertId, tieuChi, hinhAnh);
            await conn.commit();
            return this.getMyReview(maUser, maDichVu);
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    static async update(maDanhGia, maUser, data) {
        const { soSao, tieuDe, binhLuan, tieuChi = [], hinhAnh = [] } = data;
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            const [result] = await conn.query(
                `UPDATE DanhGia SET soSao=?, tieuDe=?, binhLuan=? WHERE maDanhGia=? AND maUser=?`,
                [soSao, tieuDe || null, binhLuan || null, maDanhGia, maUser]
            );
            if (result.affectedRows === 0) {
                await conn.rollback();
                return false;
            }
            await this.replaceDetails(conn, maDanhGia, tieuChi, hinhAnh);
            await conn.commit();
            return true;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    static async replaceDetails(conn, maDanhGia, tieuChi = [], hinhAnh = []) {
        await conn.query(`DELETE FROM ChiTietDanhGia WHERE maDanhGia = ?`, [maDanhGia]);
        await conn.query(`DELETE FROM AnhDanhGia WHERE maDanhGia = ?`, [maDanhGia]);

        for (const item of tieuChi) {
            if (!item?.maTieuChi || !item?.diem) continue;
            await conn.query(
                `INSERT INTO ChiTietDanhGia (maDanhGia, maTieuChi, diem) VALUES (?, ?, ?)`,
                [maDanhGia, item.maTieuChi, item.diem]
            );
        }

        for (const [index, urlAnh] of hinhAnh.filter(Boolean).slice(0, 5).entries()) {
            await conn.query(
                `INSERT INTO AnhDanhGia (maDanhGia, urlAnh, thuTu) VALUES (?, ?, ?)`,
                [maDanhGia, urlAnh, index]
            );
        }
    }

    static async attachReviewDetails(rows) {
        if (!rows.length) return;
        const ids = rows.map((row) => row.maDanhGia);
        const [criteria] = await pool.query(`SELECT * FROM ChiTietDanhGia WHERE maDanhGia IN (?)`, [ids]);
        const [images] = await pool.query(`SELECT * FROM AnhDanhGia WHERE maDanhGia IN (?) ORDER BY thuTu ASC`, [ids]);

        for (const row of rows) {
            row.tieuChi = criteria.filter((item) => item.maDanhGia === row.maDanhGia);
            row.hinhAnh = images.filter((item) => item.maDanhGia === row.maDanhGia).map((item) => item.urlAnh);
        }
    }

    static async remove(maDanhGia, maUser = null) {
        let query = `DELETE FROM DanhGia WHERE maDanhGia = ?`;
        const params = [maDanhGia];
        if (maUser !== null) { query += ` AND maUser = ?`; params.push(maUser); }
        const [result] = await pool.query(query, params);
        return result.affectedRows > 0;
    }
}

module.exports = DanhGiaModel;
