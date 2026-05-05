const DonDatModel = require('../models/dondat.model');

class DonDatController {
    // ======= ADMIN =======

    static async adminGetAll(req, res) {
        try {
            const result = await DonDatModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách đơn đặt thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminGetById(req, res) {
        try {
            const don = await DonDatModel.getById(req.params.id);
            if (!don) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy đơn đặt!' });
            return res.status(200).json({ status: 'success', data: don, message: 'Lấy thông tin đơn đặt thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminUpdateStatus(req, res) {
        try {
            const { trangThai } = req.body;
            if (!trangThai) return res.status(400).json({ status: 'error', data: null, message: 'Trạng thái là bắt buộc!' });
            const isUpdated = await DonDatModel.updateStatus(req.params.id, trangThai);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy đơn đặt!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật trạng thái đơn thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // ======= CUSTOMER =======

    /** Customer: Đặt dịch vụ */
    static async customerCreate(req, res) {
        try {
            const { maKhuyenMai, chiTietList } = req.body;
            const maUser = req.user.maUser;

            if (!chiTietList || !Array.isArray(chiTietList) || chiTietList.length === 0) {
                return res.status(400).json({ status: 'error', data: null, message: 'Danh sách dịch vụ đặt (chiTietList) không được rỗng!' });
            }

            // Kiểm tra từng chi tiết
            for (const ct of chiTietList) {
                if (!ct.maDichVu || !ct.soLuong || !ct.giaTaiThoiDiemMua) {
                    return res.status(400).json({ status: 'error', data: null, message: 'Mỗi mục đặt cần có: maDichVu, soLuong, giaTaiThoiDiemMua!' });
                }
            }

            const newDon = await DonDatModel.create(maUser, maKhuyenMai || null, chiTietList);
            return res.status(201).json({ status: 'success', data: newDon, message: 'Đặt dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Customer: Xem danh sách đơn của mình */
    static async customerGetMyOrders(req, res) {
        try {
            const result = await DonDatModel.getByUser(req.user.maUser, req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách đơn đặt thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Customer: Xem chi tiết 1 đơn của mình */
    static async customerGetMyOrderById(req, res) {
        try {
            const don = await DonDatModel.getById(req.params.id);
            if (!don || don.maUser !== req.user.maUser) {
                return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy đơn đặt!' });
            }
            return res.status(200).json({ status: 'success', data: don, message: 'Lấy thông tin đơn đặt thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Customer: Hủy đơn */
    static async customerCancel(req, res) {
        try {
            await DonDatModel.cancelByUser(req.params.id, req.user.maUser);
            return res.status(200).json({ status: 'success', data: null, message: 'Hủy đơn thành công!' });
        } catch (error) {
            return res.status(400).json({ status: 'error', data: null, message: error.message });
        }
    }
}

module.exports = DonDatController;
