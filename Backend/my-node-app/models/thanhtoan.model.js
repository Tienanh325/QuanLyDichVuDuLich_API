const { pool } = require('../config/db');

class ThanhToanModel {
    /**
     * Admin: Lấy danh sách thanh toán
     */
    static async getAll({ page = 1, limit = 10, trangThai, phuongThuc, search } = {}) {
        const offset = (page - 1) * limit;
        const queryParams = [];
        let baseQuery = `
            FROM ThanhToan tt
            LEFT JOIN DonDat dd ON tt.maDon = dd.maDon
            LEFT JOIN Users u ON dd.maUser = u.maUser
            WHERE 1=1
        `;
        if (trangThai) { baseQuery += ` AND tt.trangThai = ?`; queryParams.push(trangThai.toUpperCase()); }
        if (phuongThuc) { baseQuery += ` AND tt.phuongThuc = ?`; queryParams.push(phuongThuc.toUpperCase()); }
        if (search) {
            baseQuery += ` AND (u.ten LIKE ? OR u.email LIKE ? OR tt.maGiaoDichNgoai LIKE ?)`;
            const s = `%${search}%`; queryParams.push(s, s, s);
        }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        let dataQuery = `
            SELECT tt.*, u.ten AS tenUser, u.email AS emailUser, dd.tongGia
            ${baseQuery}
            ORDER BY tt.ngayTao DESC
            LIMIT ? OFFSET ?
        `;
        queryParams.push(parseInt(limit), parseInt(offset));
        const [rows] = await pool.query(dataQuery, queryParams);

        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: parseInt(page) };
    }

    /**
     * Lấy lịch sử thanh toán theo đơn hàng
     */
    static async getByDon(maDon) {
        const [rows] = await pool.query(
            `SELECT tt.*, u.ten AS tenUser FROM ThanhToan tt
             LEFT JOIN Users u ON tt.maUser = u.maUser
             WHERE tt.maDon = ? ORDER BY tt.ngayTao DESC`,
            [maDon]
        );
        return rows;
    }

    /**
     * Gọi Stored Procedure ThanhToanDonHang (đã có trong DB)
     * Procedure tự động cập nhật trạng thái đơn sang PAID hoặc PARTIAL_PAID
     */
    static async thanhToanDonHang(maDon, soTien, phuongThuc, maGiaoDichNgoai) {
        // Kiểm tra đơn hàng tồn tại và chưa bị hủy
        const [donRows] = await pool.query(
            `SELECT * FROM DonDat WHERE maDon = ?`,
            [maDon]
        );
        if (!donRows[0]) throw new Error('Không tìm thấy đơn đặt!');
        if (donRows[0].trangThai === 'CANCELLED') throw new Error('Đơn đặt đã bị hủy, không thể thanh toán!');
        if (soTien <= 0) throw new Error('Số tiền thanh toán phải lớn hơn 0!');

        // Gọi Stored Procedure
        await pool.query(
            `CALL ThanhToanDonHang(?, ?, ?, ?)`,
            [maDon, soTien, phuongThuc, maGiaoDichNgoai || null]
        );

        // Lấy thông tin đơn sau khi thanh toán
        const [updatedDon] = await pool.query(
            `SELECT dd.*,
                    COALESCE(SUM(tt.soTien), 0) AS tongDaThanhToan
             FROM DonDat dd
             LEFT JOIN ThanhToan tt ON dd.maDon = tt.maDon AND tt.trangThai = 'PAID'
             WHERE dd.maDon = ?
             GROUP BY dd.maDon`,
            [maDon]
        );

        return updatedDon[0];
    }

    /**
     * Admin: Hoàn tiền (cập nhật trạng thái thanh toán)
     */
    static async refund(maThanhToan, loaiHoan) {
        const validTypes = ['REFUNDED', 'PARTIAL_REFUND'];
        if (!validTypes.includes(loaiHoan)) throw new Error('Loại hoàn tiền không hợp lệ!');

        const [rows] = await pool.query(`SELECT * FROM ThanhToan WHERE maThanhToan = ?`, [maThanhToan]);
        if (!rows[0]) throw new Error('Không tìm thấy giao dịch thanh toán!');
        if (rows[0].trangThai !== 'PAID') throw new Error('Chỉ có thể hoàn tiền giao dịch đã thanh toán!');

        const [result] = await pool.query(
            `UPDATE ThanhToan SET trangThai = ? WHERE maThanhToan = ?`,
            [loaiHoan, maThanhToan]
        );
        return result.affectedRows > 0;
    }

    /**
     * Admin: Thống kê doanh thu theo tháng
     */
    static async thongKeDoanhThu(nam) {
        const queryParams = [];
        let query = `
            SELECT 
                MONTH(ngayThanhToan) AS thang,
                YEAR(ngayThanhToan) AS nam,
                COUNT(*) AS soGiaoDich,
                SUM(soTien) AS tongDoanhThu
            FROM ThanhToan
            WHERE trangThai = 'PAID'
        `;
        if (nam) { query += ` AND YEAR(ngayThanhToan) = ?`; queryParams.push(parseInt(nam)); }
        query += ` GROUP BY YEAR(ngayThanhToan), MONTH(ngayThanhToan) ORDER BY nam DESC, thang DESC`;

        const [rows] = await pool.query(query, queryParams);
        return rows;
    }

    /**
     * Thống kê tổng quan (cho Dashboard)
     */
    static async thongKeTongQuan() {
        const [rows] = await pool.query(`
            SELECT
                COUNT(*) AS tongGiaoDich,
                SUM(CASE WHEN trangThai = 'PAID' THEN soTien ELSE 0 END) AS tongDoanhThu,
                COUNT(CASE WHEN trangThai = 'PENDING' THEN 1 END) AS soGiaoDichPending,
                COUNT(CASE WHEN trangThai = 'PAID' THEN 1 END) AS soGiaoDichThanhCong,
                COUNT(CASE WHEN trangThai = 'FAILED' THEN 1 END) AS soGiaoDichThatBai,
                COUNT(CASE WHEN DATE(ngayTao) = CURDATE() THEN 1 END) AS giaoDichHomNay,
                SUM(CASE WHEN trangThai = 'PAID' AND DATE(ngayTao) = CURDATE() THEN soTien ELSE 0 END) AS doanhThuHomNay
            FROM ThanhToan
        `);
        return rows[0];
    }
}

module.exports = ThanhToanModel;
