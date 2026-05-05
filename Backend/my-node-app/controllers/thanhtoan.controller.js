const ThanhToanModel = require('../models/thanhtoan.model');

class ThanhToanController {
    // ======= ADMIN =======

    static async adminGetAll(req, res) {
        try {
            const result = await ThanhToanModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách thanh toán thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminGetByDon(req, res) {
        try {
            const result = await ThanhToanModel.getByDon(req.params.donId);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy lịch sử thanh toán thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminRefund(req, res) {
        try {
            const { loaiHoan } = req.body;
            if (!loaiHoan) return res.status(400).json({ status: 'error', data: null, message: 'Loại hoàn tiền là bắt buộc!' });
            await ThanhToanModel.refund(req.params.id, loaiHoan);
            return res.status(200).json({ status: 'success', data: null, message: 'Hoàn tiền thành công!' });
        } catch (error) {
            return res.status(400).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminThongKeDoanhThu(req, res) {
        try {
            const { nam } = req.query;
            const result = await ThanhToanModel.thongKeDoanhThu(nam);
            return res.status(200).json({ status: 'success', data: result, message: 'Thống kê doanh thu thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminThongKeTongQuan(req, res) {
        try {
            const result = await ThanhToanModel.thongKeTongQuan();
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy tổng quan thanh toán thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // ======= CUSTOMER =======

    /**
     * Customer: Thanh toán đơn hàng - gọi Stored Procedure
     * Body: { maDon, soTien, phuongThuc, maGiaoDichNgoai }
     */
    static async customerThanhToan(req, res) {
        try {
            const { maDon, soTien, phuongThuc, maGiaoDichNgoai } = req.body;

            if (!maDon || !soTien || !phuongThuc) {
                return res.status(400).json({ status: 'error', data: null, message: 'Vui lòng cung cấp: maDon, soTien, phuongThuc!' });
            }

            const validMethods = ['VNPAY', 'MOMO', 'COD', 'BANK_TRANSFER', 'WALLET'];
            if (!validMethods.includes(phuongThuc.toUpperCase())) {
                return res.status(400).json({ status: 'error', data: null, message: `Phương thức thanh toán không hợp lệ! Chỉ chấp nhận: ${validMethods.join(', ')}` });
            }

            const result = await ThanhToanModel.thanhToanDonHang(maDon, soTien, phuongThuc.toUpperCase(), maGiaoDichNgoai);

            return res.status(200).json({
                status: 'success',
                data: result,
                message: result.trangThai === 'PAID'
                    ? 'Thanh toán thành công! Đơn hàng đã được xác nhận.'
                    : 'Thanh toán một phần thành công! Vui lòng thanh toán thêm để hoàn tất đơn hàng.'
            });
        } catch (error) {
            return res.status(400).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Customer: Xem lịch sử thanh toán của đơn mình */
    static async customerGetByDon(req, res) {
        try {
            // Kiểm tra đơn thuộc về user
            const { pool } = require('../config/db');
            const [don] = await pool.query(`SELECT maUser FROM DonDat WHERE maDon = ?`, [req.params.donId]);
            if (!don[0] || don[0].maUser !== req.user.maUser) {
                return res.status(403).json({ status: 'error', data: null, message: 'Bạn không có quyền xem đơn hàng này!' });
            }
            const result = await ThanhToanModel.getByDon(req.params.donId);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy lịch sử thanh toán thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
}

module.exports = ThanhToanController;
