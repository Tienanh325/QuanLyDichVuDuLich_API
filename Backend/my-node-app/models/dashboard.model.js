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
                SUM(soTien) AS doanhThu
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
            SELECT loaiDichVu, COUNT(*) AS soLuong
            FROM DichVu WHERE trangThai = 1
            GROUP BY loaiDichVu
        `);

        const [topDichVu] = await pool.query(`
            SELECT dv.maDichVu, dv.ten, dv.loaiDichVu,
                   COUNT(ct.maChiTiet) AS soLuotDat,
                   SUM(ct.soLuong * ct.giaTaiThoiDiemMua) AS doanhThu
            FROM DichVu dv
            JOIN ChiTietDon ct ON dv.maDichVu = ct.maDichVu
            JOIN DonDat dd ON ct.maDon = dd.maDon
            WHERE dd.trangThai IN ('PAID', 'COMPLETED')
            GROUP BY dv.maDichVu
            ORDER BY soLuotDat DESC
            LIMIT 5
        `);

        return {
            overview: overview[0],
            doanhThuTheoThang,
            donGanDay,
            dichVuTheLoai,
            topDichVu
        };
    }
}

module.exports = DashboardModel;
