const { pool } = require('../config/db');

function addDateRange(whereParts, params, column, range = {}) {
    if (range.from) {
        whereParts.push(`${column} >= ?`);
        params.push(`${range.from} 00:00:00`);
    }
    if (range.to) {
        whereParts.push(`${column} <= ?`);
        params.push(`${range.to} 23:59:59`);
    }
}

function buildWhere(base, column, range) {
    const whereParts = [base];
    const params = [];
    addDateRange(whereParts, params, column, range);
    return { where: whereParts.join(' AND '), params };
}

class DashboardModel {
    static async getOverview(range = {}) {
        const orderFilter = buildWhere('1=1', 'ngayTao', range);
        const pendingFilter = buildWhere("trangThai = 'PENDING'", 'ngayTao', range);
        const paidFilter = buildWhere("trangThai = 'PAID'", 'COALESCE(ngayThanhToan, ngayTao)', range);
        const userCustomerFilter = buildWhere("vaiTro = 'CUSTOMER'", 'ngayTao', range);
        const userAdminFilter = buildWhere("vaiTro = 'ADMIN'", 'ngayTao', range);

        const [overview] = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM Users WHERE ${userCustomerFilter.where}) AS tongKhachHang,
                (SELECT COUNT(*) FROM Users WHERE ${userAdminFilter.where}) AS tongAdmin,
                (SELECT COUNT(*) FROM NhaCungCap WHERE trangThai = 1) AS tongNhaCungCap,
                (SELECT COUNT(*) FROM DichVu WHERE trangThai = 1) AS tongDichVu,
                (SELECT COUNT(*) FROM Tour) AS tongTour,
                (SELECT COUNT(*) FROM KhachSan) AS tongKhachSan,
                (SELECT COUNT(*) FROM Ve WHERE trangThai = 'AVAILABLE') AS tongVeConTrong,
                (SELECT COUNT(*) FROM DonDat WHERE ${orderFilter.where}) AS tongDonDat,
                (SELECT COUNT(*) FROM DonDat WHERE ${pendingFilter.where}) AS donDangCho,
                (SELECT COUNT(*) FROM DonDat WHERE DATE(ngayTao) = CURDATE()) AS donHomNay,
                (SELECT COALESCE(SUM(soTien), 0) FROM ThanhToan WHERE ${paidFilter.where}) AS tongDoanhThu,
                (SELECT COALESCE(SUM(soTien), 0) FROM ThanhToan WHERE trangThai = 'PAID' AND DATE(COALESCE(ngayThanhToan, ngayTao)) = CURDATE()) AS doanhThuHomNay
        `, [
            ...userCustomerFilter.params,
            ...userAdminFilter.params,
            ...orderFilter.params,
            ...pendingFilter.params,
            ...paidFilter.params,
        ]);

        const revenueFilter = buildWhere("trangThai = 'PAID'", 'COALESCE(ngayThanhToan, ngayTao)', range);
        const [doanhThuTheoThang] = await pool.query(`
            SELECT
                YEAR(COALESCE(ngayThanhToan, ngayTao)) AS nam,
                MONTH(COALESCE(ngayThanhToan, ngayTao)) AS thang,
                COUNT(*) AS soGiaoDich,
                COALESCE(SUM(soTien), 0) AS tongDoanhThu
            FROM ThanhToan
            WHERE ${revenueFilter.where}
            GROUP BY YEAR(COALESCE(ngayThanhToan, ngayTao)), MONTH(COALESCE(ngayThanhToan, ngayTao))
            ORDER BY nam ASC, thang ASC
        `, revenueFilter.params);

        const recentOrdersFilter = buildWhere('1=1', 'dd.ngayTao', range);
        const [donGanDay] = await pool.query(`
            SELECT dd.maDon, dd.tongGia, dd.trangThai, dd.ngayTao,
                   u.ten AS tenUser, u.email AS emailUser
            FROM DonDat dd
            LEFT JOIN Users u ON dd.maUser = u.maUser
            WHERE ${recentOrdersFilter.where}
            ORDER BY dd.ngayTao DESC
            LIMIT 10
        `, recentOrdersFilter.params);

        const serviceFilter = buildWhere('dv.trangThai = 1', 'dd.ngayTao', range);
        const [dichVuTheLoai] = await pool.query(`
            SELECT
                dv.loaiDichVu,
                COUNT(DISTINCT dv.maDichVu) AS soLuong,
                COALESCE(SUM(CASE
                    WHEN dd.trangThai IN ('PAID', 'COMPLETED') THEN ct.soLuong
                    ELSE 0
                END), 0) AS soLuotDat,
                COALESCE(SUM(CASE
                    WHEN dd.trangThai IN ('PAID', 'COMPLETED') THEN ct.thanhTien
                    ELSE 0
                END), 0) AS doanhThu
            FROM DichVu dv
            LEFT JOIN ChiTietDon ct ON dv.maDichVu = ct.maDichVu
            LEFT JOIN DonDat dd ON ct.maDon = dd.maDon
            WHERE ${serviceFilter.where}
            GROUP BY dv.loaiDichVu
            ORDER BY doanhThu DESC, soLuong DESC
        `, serviceFilter.params);

        const topServiceFilter = buildWhere("dd.trangThai IN ('PAID', 'COMPLETED')", 'dd.ngayTao', range);
        const [topDichVu] = await pool.query(`
            SELECT dv.maDichVu, dv.ten, dv.loaiDichVu,
                   COALESCE(SUM(ct.soLuong), 0) AS soLuotDat,
                   COALESCE(SUM(ct.thanhTien), 0) AS doanhThu
            FROM DichVu dv
            JOIN ChiTietDon ct ON dv.maDichVu = ct.maDichVu
            JOIN DonDat dd ON ct.maDon = dd.maDon
            WHERE ${topServiceFilter.where}
            GROUP BY dv.maDichVu, dv.ten, dv.loaiDichVu
            ORDER BY doanhThu DESC, soLuotDat DESC
            LIMIT 5
        `, topServiceFilter.params);

        const reviewFilter = buildWhere('soSao <= 2', 'ngayDanhGia', range);
        const [[{ danhGiaThap }]] = await pool.query(`
            SELECT COUNT(*) AS danhGiaThap
            FROM DanhGia
            WHERE ${reviewFilter.where}
        `, reviewFilter.params);

        const failedPaymentFilter = buildWhere("trangThai IN ('FAILED', 'CANCELLED')", 'ngayTao', range);
        const [[{ thanhToanLoi }]] = await pool.query(`
            SELECT COUNT(*) AS thanhToanLoi
            FROM ThanhToan
            WHERE ${failedPaymentFilter.where}
        `, failedPaymentFilter.params);

        const [[{ dichVuSapHetCho }]] = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM Tour WHERE soLuongKhach BETWEEN 1 AND 5)
                + (SELECT COUNT(*) FROM LoaiPhong WHERE soLuongPhongTrong BETWEEN 1 AND 2)
                + (SELECT COUNT(*) FROM GiaVe WHERE soChoTrong BETWEEN 1 AND 5) AS dichVuSapHetCho
        `);

        const canhBaoVanHanh = [
            {
                title: 'Đơn đặt đang chờ xử lý',
                detail: `${overview[0].donDangCho || 0} đơn đặt cần được xác nhận hoặc cập nhật trạng thái.`,
                tone: '#f59e0b',
                value: overview[0].donDangCho || 0
            },
            {
                title: 'Đánh giá tiêu cực',
                detail: `${danhGiaThap || 0} đánh giá từ 2 sao trở xuống cần theo dõi.`,
                tone: '#ef4444',
                value: danhGiaThap || 0
            },
            {
                title: 'Dịch vụ sắp hết chỗ',
                detail: `${dichVuSapHetCho || 0} tour, loại phòng hoặc giá vé còn ít chỗ.`,
                tone: '#7c3aed',
                value: dichVuSapHetCho || 0
            },
            {
                title: 'Thanh toán lỗi',
                detail: `${thanhToanLoi || 0} giao dịch thất bại hoặc bị hủy trong kỳ.`,
                tone: '#2563eb',
                value: thanhToanLoi || 0
            }
        ];

        return {
            overview: overview[0],
            doanhThuTheoThang,
            donGanDay,
            dichVuTheLoai,
            topDichVu,
            canhBaoVanHanh,
            meta: { from: range.from || null, to: range.to || null }
        };
    }
}

module.exports = DashboardModel;
