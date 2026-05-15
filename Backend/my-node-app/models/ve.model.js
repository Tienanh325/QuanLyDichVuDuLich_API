const { pool } = require('../config/db');

class VeModel {
    // =================== VÉ GỐC (Ve bảng cha) ===================

    static async getAll({ page = 1, limit = 10, loaiVeCon, search, trangThai, from, to } = {}) {
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const pageSize = Math.max(1, Math.min(1000, parseInt(limit, 10) || 10));
        const offset = (pageNumber - 1) * pageSize;
        const params = [];
        const whereParts = ['1=1'];

        if (loaiVeCon) { whereParts.push('v.loaiVeCon = ?'); params.push(loaiVeCon.toUpperCase()); }
        if (trangThai) { whereParts.push('v.trangThai = ?'); params.push(trangThai.toUpperCase()); }
        if (search) {
            whereParts.push('(dv.ten LIKE ? OR ncc.ten LIKE ?)');
            const s = `%${search}%`; params.push(s, s);
        }
        if (from) { whereParts.push('DATE(COALESCE(mb.thoiGianKhoiHanh, th.thoiGianKhoiHanh, v.ngayTao)) >= ?'); params.push(from); }
        if (to) { whereParts.push('DATE(COALESCE(mb.thoiGianKhoiHanh, th.thoiGianKhoiHanh, v.ngayTao)) <= ?'); params.push(to); }

        const baseQuery = `
            FROM Ve v
            LEFT JOIN DichVu dv ON v.maDichVu = dv.maDichVu
            LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
            LEFT JOIN VeMayBay mb ON v.maVe = mb.maVe AND v.loaiVeCon = 'MAY_BAY'
            LEFT JOIN VeTauHoa th ON v.maVe = th.maVe AND v.loaiVeCon = 'TAU_HOA'
            WHERE ${whereParts.join(' AND ')}
        `;

        const [[{ total }]] = await pool.query(`SELECT COUNT(DISTINCT v.maVe) AS total ${baseQuery}`, params);
        const [rows] = await pool.query(`
            SELECT v.maVe, v.maDichVu, v.loaiVeCon, v.trangThai, v.ngayTao,
                   dv.ten AS tenDichVu, ncc.ten AS tenNhaCungCap,
                   mb.hangHangKhong, mb.soHieuChuyenBay, mb.diemKhoiHanh AS diemKhoiHanh_mb, mb.diemDen AS diemDen_mb,
                   mb.thoiGianKhoiHanh AS thoiGianKhoiHanh_mb,
                   th.hangTau, th.soHieuChuyenTau, th.diemKhoiHanh AS diemKhoiHanh_th, th.diemDen AS diemDen_th,
                   th.thoiGianKhoiHanh AS thoiGianKhoiHanh_th,
                   MIN(gv.gia) AS gia, SUM(gv.soChoTrong) AS soChoTrong
            ${baseQuery.replace('WHERE', 'LEFT JOIN GiaVe gv ON v.maVe = gv.maVe WHERE')}
            GROUP BY v.maVe
            ORDER BY COALESCE(mb.thoiGianKhoiHanh, th.thoiGianKhoiHanh, v.ngayTao) DESC
            LIMIT ? OFFSET ?
        `, [...params, pageSize, offset]);

        const [summaryRows] = await pool.query(`
            SELECT v.loaiVeCon,
                   v.trangThai,
                   COALESCE(mb.diemKhoiHanh, th.diemKhoiHanh, '') AS diemKhoiHanh,
                   COALESCE(mb.diemDen, th.diemDen, '') AS diemDen,
                   COUNT(DISTINCT v.maVe) AS count,
                   COALESCE(SUM(gv.gia), 0) AS revenue,
                   COALESCE(SUM(gv.soChoTrong), 0) AS seats
            ${baseQuery.replace('WHERE', 'LEFT JOIN GiaVe gv ON v.maVe = gv.maVe WHERE')}
            GROUP BY v.loaiVeCon, v.trangThai, diemKhoiHanh, diemDen
        `, params);

        const normalized = rows.map(row => {
            const isMAYBAY = row.loaiVeCon === 'MAY_BAY';
            const isTAUHOA = row.loaiVeCon === 'TAU_HOA';
            return { ...row, diemKhoiHanh: row.diemKhoiHanh_mb || row.diemKhoiHanh_th || '', diemDen: row.diemDen_mb || row.diemDen_th || '', ngayKhoiHanh: row.thoiGianKhoiHanh_mb || row.thoiGianKhoiHanh_th || null, hang: isMAYBAY ? row.hangHangKhong : (isTAUHOA ? row.hangTau : row.tenNhaCungCap || ''), tenVe: row.tenDichVu || `Vé ${row.loaiVeCon}` };
        });

        const summary = this.buildAdminSummary(summaryRows);
        return { data: normalized, totalRecords: total, totalPages: Math.ceil(total / pageSize), currentPage: pageNumber, summary };
    }

    static buildAdminSummary(rows = []) {
        const byType = new Map();
        const byRoute = new Map();
        const statusCounts = { available: 0, upcoming: 0, soldout: 0, cancelled: 0 };
        let revenue = 0;
        let available = 0;
        let cancelled = 0;

        for (const row of rows) {
            const type = row.loaiVeCon || 'KHAC';
            const status = String(row.trangThai || '').toUpperCase();
            const count = Number(row.count || 0);
            const rowRevenue = Number(row.revenue || 0);
            const seats = Number(row.seats || 0);
            revenue += rowRevenue;
            available += seats;
            if (status.includes('CANCEL')) cancelled += count;
            if (status.includes('SOLD') || seats <= 0) statusCounts.soldout += count;
            else if (status.includes('CANCEL')) statusCounts.cancelled += count;
            else statusCounts.available += count;

            const typeItem = byType.get(type) || { label: type, count: 0, revenue: 0, cancelled: 0, complete: 0 };
            typeItem.count += count;
            typeItem.revenue += rowRevenue;
            typeItem.cancelled += status.includes('CANCEL') ? count : 0;
            typeItem.complete += status.includes('CANCEL') ? 0 : count;
            byType.set(type, typeItem);

            const routeLabel = `${row.diemKhoiHanh || 'Khác'} → ${row.diemDen || 'Khác'}`;
            const routeItem = byRoute.get(`${type}-${routeLabel}`) || { label: routeLabel, type, count: 0, revenue: 0 };
            routeItem.count += count;
            routeItem.revenue += rowRevenue;
            byRoute.set(`${type}-${routeLabel}`, routeItem);
        }

        const reportRows = Array.from(byType.values()).map(item => ({
            label: item.label,
            count: item.count,
            revenue: item.revenue,
            cancelRate: item.count ? `${((item.cancelled / item.count) * 100).toFixed(1)}%` : '0%',
            completeRate: item.count ? `${((item.complete / item.count) * 100).toFixed(1)}%` : '0%',
        }));

        const topRoutes = Array.from(byRoute.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
        const sold = rows.reduce((sum, row) => sum + Number(row.count || 0), 0);
        return { sold, revenue, available, cancelled, statusCounts, reportRows, topRoutes };
    }

    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT v.*, dv.ten AS tenDichVu, dv.moTa, ncc.ten AS tenNhaCungCap
             FROM Ve v
             LEFT JOIN DichVu dv ON v.maDichVu = dv.maDichVu
             LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
             WHERE v.maVe = ?`,
            [id]
        );
        if (!rows[0]) return null;
        const ve = rows[0];

        // Lấy chi tiết loại vé con
        if (ve.loaiVeCon === 'MAY_BAY') {
            const [detail] = await pool.query(`SELECT * FROM VeMayBay WHERE maVe = ?`, [id]);
            ve.chiTiet = detail[0] || null;
        } else if (ve.loaiVeCon === 'TAU_HOA') {
            const [detail] = await pool.query(`SELECT * FROM VeTauHoa WHERE maVe = ?`, [id]);
            ve.chiTiet = detail[0] || null;
        }

        // Lấy bảng giá
        const [giaVe] = await pool.query(
            `SELECT gv.*, lv.tenLoaiVe FROM GiaVe gv
             LEFT JOIN LoaiVe lv ON gv.maLoaiVe = lv.maLoaiVe
             WHERE gv.maVe = ? ORDER BY gv.gia ASC`,
            [id]
        );
        ve.bảngGia = giaVe;

        return ve;
    }

    static async createVe(data) {
        const { maDichVu, loaiVeCon } = data;
        const [result] = await pool.query(
            `INSERT INTO Ve (maDichVu, loaiVeCon, trangThai) VALUES (?, ?, 'AVAILABLE')`,
            [maDichVu || null, loaiVeCon]
        );
        return result.insertId;
    }

    static async updateVeTrangThai(maVe, trangThai) {
        const [result] = await pool.query(`UPDATE Ve SET trangThai = ? WHERE maVe = ?`, [trangThai, maVe]);
        return result.affectedRows > 0;
    }

    static async removeVe(id) {
        const [result] = await pool.query(`DELETE FROM Ve WHERE maVe = ?`, [id]);
        return result.affectedRows > 0;
    }

    // =================== VÉ MÁY BAY ===================

    static async createVeMayBay(maVe, data) {
        const { hangHangKhong, soHieuChuyenBay, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen } = data;
        await pool.query(
            `INSERT INTO VeMayBay (maVe, hangHangKhong, soHieuChuyenBay, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [maVe, hangHangKhong, soHieuChuyenBay, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen]
        );
    }

    static async updateVeMayBay(maVe, data) {
        const { hangHangKhong, soHieuChuyenBay, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen } = data;
        const [result] = await pool.query(
            `UPDATE VeMayBay SET hangHangKhong=?, soHieuChuyenBay=?, diemKhoiHanh=?, diemDen=?, thoiGianKhoiHanh=?, thoiGianDen=? WHERE maVe=?`,
            [hangHangKhong, soHieuChuyenBay, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen, maVe]
        );
        return result.affectedRows > 0;
    }

    // =================== VÉ TÀU HỎA ===================

    static async createVeTauHoa(maVe, data) {
        const { hangTau, soHieuChuyenTau, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen } = data;
        await pool.query(
            `INSERT INTO VeTauHoa (maVe, hangTau, soHieuChuyenTau, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [maVe, hangTau, soHieuChuyenTau, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen]
        );
    }

    static async updateVeTauHoa(maVe, data) {
        const { hangTau, soHieuChuyenTau, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen } = data;
        const [result] = await pool.query(
            `UPDATE VeTauHoa SET hangTau=?, soHieuChuyenTau=?, diemKhoiHanh=?, diemDen=?, thoiGianKhoiHanh=?, thoiGianDen=? WHERE maVe=?`,
            [hangTau, soHieuChuyenTau, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen, maVe]
        );
        return result.affectedRows > 0;
    }


    // =================== LOẠI VÉ & GIÁ VÉ ===================



    static async getGiaVeByVe(maVe) {
        const [rows] = await pool.query(
            `SELECT gv.*, lv.tenLoaiVe FROM GiaVe gv
             LEFT JOIN LoaiVe lv ON gv.maLoaiVe = lv.maLoaiVe
             WHERE gv.maVe = ? ORDER BY gv.gia ASC`,
            [maVe]
        );
        return rows;
    }

    static async upsertGiaVe(maVe, maLoaiVe, gia, soChoTrong, giaGoc = null, thuePhi = 0) {
        await pool.query(
            `INSERT INTO GiaVe (maVe, maLoaiVe, gia, giaGoc, soChoTrong, thuePhi) VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE gia = ?, giaGoc = ?, soChoTrong = ?, thuePhi = ?`,
            [maVe, maLoaiVe, gia, giaGoc, soChoTrong, thuePhi, gia, giaGoc, soChoTrong, thuePhi]
        );
    }

    static async updateSoChoTrong(maVe, maLoaiVe, delta) {
        const [result] = await pool.query(
            `UPDATE GiaVe SET soChoTrong = soChoTrong + ?
             WHERE maVe = ? AND maLoaiVe = ? AND soChoTrong + ? >= 0`,
            [delta, maVe, maLoaiVe, delta]
        );
        return result.affectedRows > 0;
    }

    static async removeGiaVe(maGiaVe) {
        const [result] = await pool.query(`DELETE FROM GiaVe WHERE maGiaVe = ?`, [maGiaVe]);
        return result.affectedRows > 0;
    }

    // =================== TÌM VÉ MÁY BAY (cho trang tìm kiếm) ===================

    static buildPagination(page = 1, limit = 20) {
        const currentPage = Math.max(1, parseInt(page, 10) || 1);
        const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
        return { currentPage, pageSize, offset: (currentPage - 1) * pageSize };
    }

    static async searchVeMayBay({ diemKhoiHanh, diemDen, ngayKhoiHanh, page = 1, limit = 20, hangHangKhong, soDiemDung, minPrice, maxPrice } = {}) {
        const { currentPage, pageSize, offset } = this.buildPagination(page, limit);
        const queryParams = [];
        let baseQuery = `
            FROM Ve v
            JOIN VeMayBay mb ON v.maVe = mb.maVe
            LEFT JOIN DichVu dv ON v.maDichVu = dv.maDichVu
            LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
            LEFT JOIN GiaVe gv ON v.maVe = gv.maVe
            WHERE v.trangThai = 'AVAILABLE'
        `;
        if (diemKhoiHanh) { baseQuery += ` AND mb.diemKhoiHanh LIKE ?`; queryParams.push(`%${diemKhoiHanh}%`); }
        if (diemDen) { baseQuery += ` AND mb.diemDen LIKE ?`; queryParams.push(`%${diemDen}%`); }
        if (ngayKhoiHanh) { baseQuery += ` AND DATE(mb.thoiGianKhoiHanh) = ?`; queryParams.push(ngayKhoiHanh); }
        if (hangHangKhong) { baseQuery += ` AND mb.hangHangKhong = ?`; queryParams.push(hangHangKhong); }
        if (soDiemDung !== undefined && soDiemDung !== '') { baseQuery += ` AND mb.soDiemDung = ?`; queryParams.push(parseInt(soDiemDung, 10)); }
        if (minPrice) { baseQuery += ` AND gv.gia >= ?`; queryParams.push(Number(minPrice)); }
        if (maxPrice) { baseQuery += ` AND gv.gia <= ?`; queryParams.push(Number(maxPrice)); }

        const countSql = `SELECT COUNT(*) AS total FROM (SELECT v.maVe ${baseQuery} GROUP BY v.maVe) counted`;
        const dataSql = `
            SELECT v.maVe, v.loaiVeCon, v.trangThai,
                   mb.hangHangKhong, mb.soHieuChuyenBay, mb.diemKhoiHanh, mb.diemDen,
                   mb.thoiGianKhoiHanh, mb.thoiGianDen,
                   dv.ten AS tenDichVu, ncc.ten AS tenNhaCungCap,
                   MIN(gv.gia) AS giaThapNhat,
                   SUM(gv.soChoTrong) AS tongSoCho
            ${baseQuery}
            GROUP BY v.maVe
            ORDER BY mb.thoiGianKhoiHanh ASC
            LIMIT ? OFFSET ?
        `;
        const [[{ total }], [rows]] = await Promise.all([
            pool.query(countSql, queryParams),
            pool.query(dataSql, [...queryParams, pageSize, offset]),
        ]);

        return { data: rows, totalRecords: total, totalPages: Math.ceil(total / pageSize), currentPage, pageSize };
    }

    static async searchVeTauHoa({ diemKhoiHanh, diemDen, ngayKhoiHanh, page = 1, limit = 20 } = {}) {
        const { currentPage, pageSize, offset } = this.buildPagination(page, limit);
        const queryParams = [];
        let baseQuery = `
            FROM Ve v
            JOIN VeTauHoa th ON v.maVe = th.maVe
            LEFT JOIN DichVu dv ON v.maDichVu = dv.maDichVu
            LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
            LEFT JOIN GiaVe gv ON v.maVe = gv.maVe
            WHERE v.trangThai = 'AVAILABLE'
        `;
        if (diemKhoiHanh) { baseQuery += ` AND th.diemKhoiHanh LIKE ?`; queryParams.push(`%${diemKhoiHanh}%`); }
        if (diemDen) { baseQuery += ` AND th.diemDen LIKE ?`; queryParams.push(`%${diemDen}%`); }
        if (ngayKhoiHanh) { baseQuery += ` AND DATE(th.thoiGianKhoiHanh) = ?`; queryParams.push(ngayKhoiHanh); }

        const countSql = `SELECT COUNT(*) AS total FROM (SELECT v.maVe ${baseQuery} GROUP BY v.maVe) counted`;
        const dataSql = `
            SELECT v.maVe, v.loaiVeCon, v.trangThai,
                   th.hangTau, th.soHieuChuyenTau, th.diemKhoiHanh, th.diemDen,
                   th.thoiGianKhoiHanh, th.thoiGianDen,
                   dv.ten AS tenDichVu, ncc.ten AS tenNhaCungCap,
                   MIN(gv.gia) AS giaThapNhat,
                   SUM(gv.soChoTrong) AS tongSoCho
            ${baseQuery}
            GROUP BY v.maVe
            ORDER BY th.thoiGianKhoiHanh ASC
            LIMIT ? OFFSET ?
        `;
        const [[{ total }], [rows]] = await Promise.all([
            pool.query(countSql, queryParams),
            pool.query(dataSql, [...queryParams, pageSize, offset]),
        ]);

        return { data: rows, totalRecords: total, totalPages: Math.ceil(total / pageSize), currentPage, pageSize };
    }

    // =================== TICKET CHILD TABLES ===================

    // VeTienIch (bulk)
    static async getVeTienIch(maVe) {
        const [rows] = await pool.query(
            `SELECT vti.maTienIch, t.tenTienIch, t.icon, t.loaiTienIch
             FROM VeTienIch vti
             JOIN TienIch t ON vti.maTienIch = t.maTienIch
             WHERE vti.maVe = ?`,
            [maVe]
        );
        return rows;
    }
    static async upsertVeTienIch(maVe, maTienIchList) {
        await pool.query('START TRANSACTION');
        try {
            await pool.query(`DELETE FROM VeTienIch WHERE maVe = ?`, [maVe]);
            if (maTienIchList && maTienIchList.length) {
                const values = maTienIchList.map(id => [maVe, id]);
                await pool.query('INSERT INTO VeTienIch (maVe, maTienIch) VALUES ?', [values]);
            }
            await pool.query('COMMIT');
            return true;
        } catch (e) {
            await pool.query('ROLLBACK');
            throw e;
        }
    }

    // VeTauKhoang
    static async getVeTauKhoang(maVe) {
        const [rows] = await pool.query(`SELECT * FROM VeTauKhoang WHERE maVe = ? ORDER BY thuTu ASC`, [maVe]);
        return rows;
    }
    static async createVeTauKhoang(maVe, data) {
        const { tenKhoang, toaSo, loaiCho, thuTu = 0 } = data;
        const [result] = await pool.query(
            `INSERT INTO VeTauKhoang (maVe, tenKhoang, toaSo, loaiCho, thuTu) VALUES (?, ?, ?, ?, ?)`,
            [maVe, tenKhoang, toaSo || null, loaiCho, thuTu]
        );
        return { maKhoang: result.insertId, ...data };
    }
    static async updateVeTauKhoang(maKhoang, data) {
        const { tenKhoang, toaSo, loaiCho, thuTu } = data;
        const [result] = await pool.query(
            `UPDATE VeTauKhoang SET tenKhoang=?, toaSo=?, loaiCho=?, thuTu=? WHERE maKhoang=?`,
            [tenKhoang, toaSo || null, loaiCho, thuTu, maKhoang]
        );
        return result.affectedRows > 0;
    }
    static async removeVeTauKhoang(maKhoang) {
        const [result] = await pool.query(`DELETE FROM VeTauKhoang WHERE maKhoang = ?`, [maKhoang]);
        return result.affectedRows > 0;
    }

    // VeTauGhe
    static async getVeTauGhe(maKhoang) {
        const [rows] = await pool.query(`SELECT * FROM VeTauGhe WHERE maKhoang = ? ORDER BY CAST(soGhe AS UNSIGNED) ASC`, [maKhoang]);
        return rows;
    }
    static async createVeTauGhe(maKhoang, data) {
        const { soGhe, trangThai = 'AVAILABLE', tang, giaThem = 0 } = data;
        const [result] = await pool.query(
            `INSERT INTO VeTauGhe (maKhoang, soGhe, trangThai, tang, giaThem) VALUES (?, ?, ?, ?, ?)`,
            [maKhoang, soGhe, trangThai, tang || null, giaThem]
        );
        return { maGhe: result.insertId, ...data };
    }
    static async updateVeTauGhe(maGhe, data) {
        const { soGhe, trangThai, tang, giaThem } = data;
        const [result] = await pool.query(
            `UPDATE VeTauGhe SET soGhe=?, trangThai=?, tang=?, giaThem=? WHERE maGhe=?`,
            [soGhe, trangThai, tang || null, giaThem, maGhe]
        );
        return result.affectedRows > 0;
    }
    static async removeVeTauGhe(maGhe) {
        const [result] = await pool.query(`DELETE FROM VeTauGhe WHERE maGhe = ?`, [maGhe]);
        return result.affectedRows > 0;
    }
}

module.exports = VeModel;
