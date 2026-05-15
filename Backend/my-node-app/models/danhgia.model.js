const { pool } = require('../config/db');

const serviceTypeMapSql = `
    CASE
        WHEN dv.loaiDichVu = 'KHACH_SAN' THEN 'KHACH_SAN'
        WHEN dv.loaiDichVu = 'VE' AND v.loaiVeCon = 'MAY_BAY' THEN 'MAY_BAY'
        WHEN dv.loaiDichVu = 'VE' AND v.loaiVeCon = 'TAU_HOA' THEN 'TAU'
        ELSE 'TOUR'
    END
`;

const tableExistsCache = new Map();

async function hasTable(tableName) {
    if (!tableExistsCache.has(tableName)) {
        tableExistsCache.set(tableName, (async () => {
            const [rows] = await pool.query('SHOW TABLES LIKE ?', [tableName]);
            return rows.length > 0;
        })());
    }
    return tableExistsCache.get(tableName);
}

class DanhGiaModel {
    static async getAll({ page = 1, limit = 10, maDichVu, maUser, soSao, sort = 'newest', hasImages, verified } = {}) {
        const offset = (Number(page) - 1) * Number(limit);
        const queryParams = [];
        let baseQuery = `
            FROM DanhGia dg
            LEFT JOIN Users u ON dg.maUser = u.maUser
            LEFT JOIN DichVu dv ON dg.maDichVu = dv.maDichVu
            LEFT JOIN Ve v ON v.maDichVu = dv.maDichVu
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

        for (const row of rows) {
            if (typeof row.tieuDe === 'undefined') row.tieuDe = null;
            if (typeof row.trangThai === 'undefined') row.trangThai = 'DA_DUYET';
        }

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
        const subRatings = await this.getCriteriaSummary(maDichVu);
        const phanPhoi = [5, 4, 3, 2, 1].map((star) => ({
            soSao: star,
            soLuong: distribution.find((item) => Number(item.soSao) === star)?.soLuong ?? 0,
        }));
        return { ...avg[0], phanPhoi, tieuChi: subRatings };
    }

    static async getCriteriaByService(maDichVu) {
        if (!(await hasTable('TieuChiDanhGia'))) return [];
        const [serviceRows] = await pool.query(
            `SELECT dv.loaiDichVu, v.loaiVeCon
             FROM DichVu dv
             LEFT JOIN Ve v ON v.maDichVu = dv.maDichVu
             WHERE dv.maDichVu = ?
             LIMIT 1`,
            [maDichVu]
        );
        const service = serviceRows[0];
        if (!service?.loaiDichVu) return [];

        const reviewType = service.loaiDichVu === 'KHACH_SAN'
            ? 'KHACH_SAN'
            : service.loaiDichVu === 'VE' && service.loaiVeCon === 'MAY_BAY'
                ? 'MAY_BAY'
                : service.loaiDichVu === 'VE' && service.loaiVeCon === 'TAU_HOA'
                    ? 'TAU'
                    : 'TOUR';

        const [rows] = await pool.query(
            `SELECT maTieuChi, tenTieuChi, moTa, thuTu
             FROM TieuChiDanhGia
             WHERE loaiDichVu = ?
             ORDER BY thuTu ASC, maTieuChi ASC`,
            [reviewType]
        );
        return rows;
    }

    static async getCriteriaSummary(maDichVu) {
        if (!(await hasTable('TieuChiDanhGia')) || !(await hasTable('ChiTietDanhGia'))) return [];
        const [rows] = await pool.query(
            `SELECT ct.maTieuChi, tc.tenTieuChi, AVG(ct.diem) AS diemTrungBinh
             FROM ChiTietDanhGia ct
             JOIN DanhGia dg ON dg.maDanhGia = ct.maDanhGia
             JOIN TieuChiDanhGia tc ON tc.maTieuChi = ct.maTieuChi
             WHERE dg.maDichVu = ?
             GROUP BY ct.maTieuChi, tc.tenTieuChi
             ORDER BY tc.thuTu ASC, ct.maTieuChi ASC`,
            [maDichVu]
        );
        return rows;
    }

    static async getReviewWithRelations(maDanhGia) {
        const [rows] = await pool.query(
            `SELECT dg.*, u.ten AS tenUser, u.username, dv.ten AS tenDichVu,
                    ${serviceTypeMapSql} AS loaiReview,
                    dg.maDon IS NOT NULL AS daXacMinh
             FROM DanhGia dg
             LEFT JOIN Users u ON dg.maUser = u.maUser
             LEFT JOIN DichVu dv ON dg.maDichVu = dv.maDichVu
             LEFT JOIN Ve v ON v.maDichVu = dv.maDichVu
             WHERE dg.maDanhGia = ?
             LIMIT 1`,
            [maDanhGia]
        );
        for (const row of rows) {
            if (typeof row.tieuDe === 'undefined') row.tieuDe = null;
            if (typeof row.trangThai === 'undefined') row.trangThai = 'DA_DUYET';
        }
        await this.attachReviewDetails(rows);
        return rows[0] ?? null;
    }

    static async getMyReview(maUser, maDichVu) {
        const [rows] = await pool.query(`
            SELECT dg.* FROM DanhGia dg WHERE dg.maUser = ? AND dg.maDichVu = ? LIMIT 1
        `, [maUser, maDichVu]);
        for (const row of rows) {
            if (typeof row.tieuDe === 'undefined') row.tieuDe = null;
            if (typeof row.trangThai === 'undefined') row.trangThai = 'DA_DUYET';
        }
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
                `INSERT INTO DanhGia (maUser, maDichVu, maDon, soSao, binhLuan) VALUES (?, ?, ?, ?, ?)`,
                [maUser, maDichVu, ordered[0]?.maDon ?? null, soSao, binhLuan || null]
            );
            await this.replaceDetails(conn, result.insertId, tieuChi, hinhAnh);
            await conn.commit();
            return this.getReviewWithRelations(result.insertId);
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
                `UPDATE DanhGia SET soSao=?, binhLuan=? WHERE maDanhGia=? AND maUser=?`,
                [soSao, binhLuan || null, maDanhGia, maUser]
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
        const hasCriteriaTable = await hasTable('ChiTietDanhGia');
        const hasImagesTable = await hasTable('AnhDanhGia');

        if (hasCriteriaTable) {
            await conn.query(`DELETE FROM ChiTietDanhGia WHERE maDanhGia = ?`, [maDanhGia]);
            for (const item of tieuChi) {
                if (!item?.maTieuChi || !item?.diem) continue;
                await conn.query(
                    `INSERT INTO ChiTietDanhGia (maDanhGia, maTieuChi, diem) VALUES (?, ?, ?)`,
                    [maDanhGia, item.maTieuChi, item.diem]
                );
            }
        }

        if (hasImagesTable) {
            await conn.query(`DELETE FROM AnhDanhGia WHERE maDanhGia = ?`, [maDanhGia]);
            for (const [index, urlAnh] of hinhAnh.filter(Boolean).slice(0, 5).entries()) {
                await conn.query(
                    `INSERT INTO AnhDanhGia (maDanhGia, urlAnh, thuTu) VALUES (?, ?, ?)`,
                    [maDanhGia, urlAnh, index]
                );
            }
        }
    }

    static async attachReviewDetails(rows) {
        if (!rows.length) return;
        const ids = rows.map((row) => row.maDanhGia);
        let criteria = [];
        let images = [];

        if (await hasTable('ChiTietDanhGia')) {
            const [criteriaRows] = await pool.query(
                `SELECT ct.maDanhGia, ct.maTieuChi, ct.diem, tc.tenTieuChi, tc.moTa, tc.thuTu
                 FROM ChiTietDanhGia ct
                 LEFT JOIN TieuChiDanhGia tc ON tc.maTieuChi = ct.maTieuChi
                 WHERE ct.maDanhGia IN (?)
                 ORDER BY tc.thuTu ASC, ct.maTieuChi ASC`,
                [ids]
            );
            criteria = criteriaRows;
        }

        if (await hasTable('AnhDanhGia')) {
            const [imageRows] = await pool.query(`SELECT * FROM AnhDanhGia WHERE maDanhGia IN (?) ORDER BY thuTu ASC`, [ids]);
            images = imageRows;
        }

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
