const { pool } = require('../config/db');

class DashboardModel {
    static async getOverview() {
        const [overview] = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM Users WHERE vaiTro = 'CUSTOMER') AS tongKhachHang,
                (SELECT COUNT(*) FROM Users WHERE vaiTro = 'ADMIN') AS tongAdmin,
                (SELECT COUNT(*) FROM NhaCungCap WHERE trangThai = 1) AS tongNhaCungCap,
                (SELECT COUNT(*) FROM DichVu WHERE trangThai = 1) AS tongDichVu,
                (SELECT COUNT(*) FROM Tour) AS tongTour,
                (SELECT COUNT(*) FROM KhachSan) AS tongKhachSan,
                (SELECT COUNT(*) FROM Ve WHERE trangThai = 'AVAILABLE') AS tongVeConTrong,
                (SELECT COUNT(*) FROM DonDat) AS tongDonDat,
                (SELECT COUNT(*) FROM DonDat WHERE trangThai = 'PENDING') AS donDangCho,
                (SELECT COUNT(*) FROM DonDat WHERE DATE(ngayTao) = CURDATE()) AS donHomNay,
                (SELECT COALESCE(SUM(soTien), 0) FROM ThanhToan WHERE trangThai = 'PAID') AS tongDoanhThu,
                (SELECT COALESCE(SUM(soTien), 0) FROM ThanhToan WHERE trangThai = 'PAID' AND DATE(ngayTao) = CURDATE()) AS doanhThuHomNay
        `);

        const [doanhThuTheoThang] = await pool.query(`
            SELECT
                YEAR(ngayThanhToan) AS nam,
                MONTH(ngayThanhToan) AS thang,
                COUNT(*) AS soGiaoDich,
                COALESCE(SUM(soTien), 0) AS tongDoanhThu
            FROM ThanhToan
            WHERE trangThai = 'PAID' AND ngayThanhToan >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY YEAR(ngayThanhToan), MONTH(ngayThanhToan)
            ORDER BY nam ASC, thang ASC
        `);

        const [donGanDay] = await pool.query(`
            SELECT dd.maDon, dd.tongGia, dd.trangThai, dd.ngayTao,
                   u.ten AS tenUser, u.email AS emailUser
            FROM DonDat dd
            LEFT JOIN Users u ON dd.maUser = u.maUser
            ORDER BY dd.ngayTao DESC
            LIMIT 10
        `);

        const [dichVuTheLoai] = await pool.query(`
            SELECT
                dv.loaiDichVu,
                COUNT(DISTINCT dv.maDichVu) AS soLuong,
                COALESCE(SUM(CASE
                    WHEN dd.trangThai IN ('PAID', 'COMPLETED') THEN ct.soLuong
                    ELSE 0
                END), 0) AS soLuotDat,
                COALESCE(SUM(CASE
                    WHEN dd.trangThai IN ('PAID', 'COMPLETED') THEN ct.soLuong * ct.giaTaiThoiDiemMua
                    ELSE 0
                END), 0) AS doanhThu
            FROM DichVu dv
            LEFT JOIN ChiTietDon ct ON dv.maDichVu = ct.maDichVu
            LEFT JOIN DonDat dd ON ct.maDon = dd.maDon
            WHERE dv.trangThai = 1
            GROUP BY dv.loaiDichVu
            ORDER BY doanhThu DESC, soLuong DESC
        `);

        const [topDichVu] = await pool.query(`
            SELECT dv.maDichVu, dv.ten, dv.loaiDichVu,
                   COALESCE(SUM(ct.soLuong), 0) AS soLuotDat,
                   COALESCE(SUM(ct.soLuong * ct.giaTaiThoiDiemMua), 0) AS doanhThu
            FROM DichVu dv
            JOIN ChiTietDon ct ON dv.maDichVu = ct.maDichVu
            JOIN DonDat dd ON ct.maDon = dd.maDon
            WHERE dd.trangThai IN ('PAID', 'COMPLETED')
            GROUP BY dv.maDichVu, dv.ten, dv.loaiDichVu
            ORDER BY doanhThu DESC, soLuotDat DESC
            LIMIT 5
        `);

        const [[{ danhGiaThap }]] = await pool.query(`
            SELECT COUNT(*) AS danhGiaThap
            FROM DanhGia
            WHERE soSao <= 2 AND ngayDanhGia >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);

        const [[{ thanhToanLoi }]] = await pool.query(`
            SELECT COUNT(*) AS thanhToanLoi
            FROM ThanhToan
            WHERE trangThai IN ('FAILED', 'CANCELLED')
              AND ngayTao >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `);

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
                title: 'Đánh giá tiêu cực 30 ngày',
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
                title: 'Thanh toán lỗi 7 ngày',
                detail: `${thanhToanLoi || 0} giao dịch thất bại hoặc bị hủy trong 7 ngày gần đây.`,
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
            canhBaoVanHanh
        };
    }
}

module.exports = DashboardModel;
