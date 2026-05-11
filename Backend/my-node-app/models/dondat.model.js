const { pool } = require('../config/db');
const KhuyenMaiModel = require('./khuyenmai.model');

class DonDatModel {
    /**
     * Admin: Lấy danh sách tất cả đơn đặt
     */
    static async getAll({ page = 1, limit = 10, trangThai, search, maUser } = {}) {
        const offset = (page - 1) * limit;
        const queryParams = [];
        let baseQuery = `
            FROM DonDat dd
            LEFT JOIN Users u ON dd.maUser = u.maUser
            LEFT JOIN KhuyenMai km ON dd.maKhuyenMai = km.maKhuyenMai
            WHERE 1=1
        `;
        if (trangThai) { baseQuery += ` AND dd.trangThai = ?`; queryParams.push(trangThai.toUpperCase()); }
        if (maUser) { baseQuery += ` AND dd.maUser = ?`; queryParams.push(parseInt(maUser)); }
        if (search) {
            baseQuery += ` AND (u.ten LIKE ? OR u.email LIKE ? OR CAST(dd.maDon AS CHAR) LIKE ?)`;
            const s = `%${search}%`; queryParams.push(s, s, s);
        }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        let dataQuery = `
            SELECT dd.*, u.ten AS tenUser, u.email AS emailUser, u.sdt AS sdtUser,
                   km.ten AS tenKhuyenMai, km.giamGia
            ${baseQuery}
            ORDER BY dd.ngayTao DESC
            LIMIT ? OFFSET ?
        `;
        queryParams.push(parseInt(limit), parseInt(offset));
        const [rows] = await pool.query(dataQuery, queryParams);

        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: parseInt(page) };
    }

    /**
     * Lấy chi tiết 1 đơn đặt (kèm ChiTietDon + ThanhToan)
     */
    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT dd.*, u.ten AS tenUser, u.email AS emailUser, u.sdt AS sdtUser,
                    km.ten AS tenKhuyenMai, km.giamGia
             FROM DonDat dd
             LEFT JOIN Users u ON dd.maUser = u.maUser
             LEFT JOIN KhuyenMai km ON dd.maKhuyenMai = km.maKhuyenMai
             WHERE dd.maDon = ?`,
            [id]
        );
        if (!rows[0]) return null;
        const don = rows[0];

        const [chiTiet] = await pool.query(
            `SELECT ct.*, dv.ten AS tenDichVu, dv.loaiDichVu
             FROM ChiTietDon ct
             LEFT JOIN DichVu dv ON ct.maDichVu = dv.maDichVu
             WHERE ct.maDon = ?
             ORDER BY ct.maChiTiet ASC`,
            [id]
        );
        don.chiTietDon = chiTiet;

        const [thanhToan] = await pool.query(
            `SELECT * FROM ThanhToan WHERE maDon = ? ORDER BY ngayTao DESC`,
            [id]
        );
        don.lichSuThanhToan = thanhToan;

        return don;
    }

    /**
     * Customer: Lấy danh sách đơn của bản thân
     */
    static async getByUser(maUser, { page = 1, limit = 10, trangThai } = {}) {
        const offset = (page - 1) * limit;
        const queryParams = [maUser];
        let baseQuery = `
            FROM DonDat dd
            LEFT JOIN KhuyenMai km ON dd.maKhuyenMai = km.maKhuyenMai
            WHERE dd.maUser = ?
        `;
        if (trangThai) { baseQuery += ` AND dd.trangThai = ?`; queryParams.push(trangThai.toUpperCase()); }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        let dataQuery = `
            SELECT dd.*, km.ten AS tenKhuyenMai, km.giamGia
            ${baseQuery}
            ORDER BY dd.ngayTao DESC
            LIMIT ? OFFSET ?
        `;
        queryParams.push(parseInt(limit), parseInt(offset));
        const [rows] = await pool.query(dataQuery, queryParams);

        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: parseInt(page) };
    }

    /**
     * Customer: Tạo đơn đặt (kèm danh sách chi tiết)
     * chiTietList: [{ maDichVu, maPhanLoaiDichVu, soLuong, giaTaiThoiDiemMua, ngayBatDauSuDung, ngayKetThucSuDung }]
     */
    static async create(maUser, maKhuyenMai, chiTietList) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // 1) Tính số đêm (nếu là khách sạn có ngày nhận/trả)
            function calculateNights(start, end) {
                if (!start || !end) return 1;
                const s = new Date(start);
                const e = new Date(end);
                if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 1;
                const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
                return Math.max(1, diff);
            }

            // 2) Tính breakdown từng chi tiết
            let tongTruocThue = 0;
            const enriched = chiTietList.map((ct) => {
                const nights = calculateNights(ct.ngayBatDauSuDung, ct.ngayKetThucSuDung);
                const sub = ct.soLuong * ct.giaTaiThoiDiemMua * nights;
                const giaGoc = ct.giaTaiThoiDiemMua * nights;
                return { ...ct, nights, sub, giaGoc };
            });

            tongTruocThue = enriched.reduce((sum, ct) => sum + ct.sub, 0);
            const thuePhi = Math.round(tongTruocThue * 0.1);
            let tongSauThue = tongTruocThue + thuePhi;

            // 3) Áp dụng khuyến mãi nếu có
            let appliedKhuyenMai = null;
            if (maKhuyenMai) {
                const km = await KhuyenMaiModel.validateKhuyenMai(maKhuyenMai);
                if (km) {
                    appliedKhuyenMai = km;
                    if (km.giamGia <= 100) {
                        tongSauThue = tongSauThue * (1 - km.giamGia / 100);
                    } else {
                        tongSauThue = Math.max(0, tongSauThue - km.giamGia);
                    }
                }
            }

            const tongGia = Math.round(tongSauThue);

            // 4) Tạo đơn đặt với các trường breakdown mới
            const [donResult] = await conn.query(
                `INSERT INTO DonDat (maUser, maKhuyenMai, tongGia, giaGoc, tongTruocThue, thuePhi, tongSauThue, vatRate, trangThai, loaiDon)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
                [
                    maUser,
                    appliedKhuyenMai ? maKhuyenMai : null,
                    tongGia,
                    tongTruocThue,
                    tongTruocThue,
                    thuePhi,
                    tongSauThue,
                    10.00,
                    'HOTEL' // có thể phát hiện từ chiTietList/context nếu cần đa loại
                ]
            );
            const maDon = donResult.insertId;

            // 5) Tạo chi tiết đơn có đủ nights và thanhTien
            for (const ct of enriched) {
                await conn.query(
                    `INSERT INTO ChiTietDon (maDon, maDichVu, maPhanLoaiDichVu, soLuong, giaTaiThoiDiemMua, thanhTien, ngayBatDauSuDung, ngayKetThucSuDung, soDem)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        maDon,
                        ct.maDichVu,
                        ct.maPhanLoaiDichVu || null,
                        ct.soLuong,
                        ct.giaTaiThoiDiemMua,
                        ct.sub,
                        ct.ngayBatDauSuDung || null,
                        ct.ngayKetThucSuDung || null,
                        ct.nights
                    ]
                );
            }

            await conn.commit();
            conn.release();
            return {
                maDon,
                maUser,
                tongGia,
                trangThai: 'PENDING',
                chiTietDon: enriched
            };
        } catch (err) {
            await conn.rollback();
            conn.release();
            throw err;
        }
    }

    /**
     * Admin: Cập nhật trạng thái đơn
     */
    static async updateStatus(id, trangThai) {
        const validStatuses = ['PENDING', 'CONFIRMED', 'PAID', 'PARTIAL_PAID', 'CANCELLED', 'COMPLETED'];
        if (!validStatuses.includes(trangThai)) throw new Error('Trạng thái đơn không hợp lệ!');
        const [result] = await pool.query(`UPDATE DonDat SET trangThai = ? WHERE maDon = ?`, [trangThai, id]);
        return result.affectedRows > 0;
    }

    /**
     * Customer: Hủy đơn (chỉ hủy nếu đang PENDING)
     */
    static async cancelByUser(maDon, maUser) {
        const [rows] = await pool.query(`SELECT * FROM DonDat WHERE maDon = ? AND maUser = ?`, [maDon, maUser]);
        if (!rows[0]) throw new Error('Không tìm thấy đơn đặt!');
        if (rows[0].trangThai !== 'PENDING') throw new Error('Chỉ có thể hủy đơn đang ở trạng thái PENDING!');
        await pool.query(`UPDATE DonDat SET trangThai = 'CANCELLED' WHERE maDon = ?`, [maDon]);
        return true;
    }
}

module.exports = DonDatModel;
