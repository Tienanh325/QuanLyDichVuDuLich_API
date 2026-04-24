const { pool } = require('../config/db');

class DashboardModel {
    static async getRevenue() {
        // Tổng doanh thu từ bảng ThanhToan có trạng thái PAID
        const [rows] = await pool.query(
            `SELECT SUM(soTien) as totalRevenue 
             FROM ThanhToan 
             WHERE trangThai = 'PAID'`
        );
        return rows[0].totalRevenue || 0;
    }

    static async getTotalCustomers() {
        // Tổng số khách hàng từ bảng Users (bỏ qua ADMIN)
        const [rows] = await pool.query(
            `SELECT COUNT(maUser) as totalCustomers 
             FROM Users 
             WHERE vaiTro = 'CUSTOMER'`
        );
        return rows[0].totalCustomers || 0;
    }

    static async getOrderStatusStats() {
        // Số lượng đơn hàng chia theo trạng thái
        const [rows] = await pool.query(
            `SELECT trangThai, COUNT(maDon) as count 
             FROM DonDat 
             GROUP BY trangThai`
        );
        return rows;
    }

    static async getTopServices() {
        // Top 5 dịch vụ được đặt nhiều nhất
        const [rows] = await pool.query(
            `SELECT d.maDichVu, d.ten as tenDichVu, d.loaiDichVu, COUNT(c.maChiTiet) as totalBookings, SUM(c.soLuong) as totalQuantity
             FROM ChiTietDon c
             JOIN DichVu d ON c.maDichVu = d.maDichVu
             GROUP BY d.maDichVu, d.ten, d.loaiDichVu
             ORDER BY totalBookings DESC, totalQuantity DESC
             LIMIT 5`
        );
        return rows;
    }
}

module.exports = DashboardModel;
