const DashboardModel = require('../models/dashboard.model');

class DashboardController {
    static async getOverviewAnalytics(req, res) {
        try {
            const { from, to } = req.query;
            const fromDate = from ? new Date(`${from}T00:00:00`) : null;
            const toDate = to ? new Date(`${to}T23:59:59`) : null;

            if ((from && Number.isNaN(fromDate.getTime())) || (to && Number.isNaN(toDate.getTime()))) {
                return res.status(400).json({ status: 'error', data: null, message: 'Khoảng thời gian không hợp lệ.' });
            }

            if (fromDate && toDate && fromDate > toDate) {
                return res.status(400).json({ status: 'error', data: null, message: 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc.' });
            }

            const data = await DashboardModel.getOverview({ from, to });
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
