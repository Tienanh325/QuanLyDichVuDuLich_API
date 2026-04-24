const DashboardModel = require('../models/dashboard.model');

class DashboardController {
    static async getOverviewAnalytics(req, res) {
        try {
            // Thực thi tất cả các query song song bằng Promise.all để tối ưu hiệu suất
            const [totalRevenue, totalCustomers, orderStatusStats, topServices] = await Promise.all([
                DashboardModel.getRevenue(),
                DashboardModel.getTotalCustomers(),
                DashboardModel.getOrderStatusStats(),
                DashboardModel.getTopServices()
            ]);

            // Format lại orderStatusStats thành một object dễ đọc hơn (vd: { PENDING: 5, PAID: 10 })
            const formattedOrderStats = orderStatusStats.reduce((acc, curr) => {
                acc[curr.trangThai] = curr.count;
                return acc;
            }, {});

            return res.status(200).json({
                status: 'success',
                data: {
                    totalRevenue,
                    totalCustomers,
                    ordersByStatus: formattedOrderStats,
                    topServices
                },
                message: 'Lấy dữ liệu thống kê tổng quan thành công!'
            });

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi truy xuất thống kê.'
            });
        }
    }
}

module.exports = DashboardController;
