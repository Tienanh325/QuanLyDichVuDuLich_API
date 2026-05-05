const DashboardModel = require('../models/dashboard.model');

class DashboardController {
    static async getOverviewAnalytics(req, res) {
        try {
            const data = await DashboardModel.getOverview();
            return res.status(200).json({
                status: 'success',
                data,
                message: 'Lấy thống kê tổng quan thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi lấy thống kê.'
            });
        }
    }
}

module.exports = DashboardController;
