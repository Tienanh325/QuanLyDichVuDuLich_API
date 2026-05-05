const KhuyenMaiModel = require('../models/khuyenmai.model');

class KhuyenMaiController {
    // ======= ADMIN =======
    static async adminGetAll(req, res) {
        try {
            const result = await KhuyenMaiModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách khuyến mãi thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const km = await KhuyenMaiModel.getById(req.params.id);
            if (!km) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy khuyến mãi!' });
            return res.status(200).json({ status: 'success', data: km, message: 'Lấy thông tin khuyến mãi thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminCreate(req, res) {
        try {
            const { ten, giamGia, ngayBatDau, ngayKetThuc } = req.body;
            if (!ten || !giamGia || !ngayBatDau || !ngayKetThuc) {
                return res.status(400).json({ status: 'error', data: null, message: 'Vui lòng cung cấp đầy đủ: ten, giamGia, ngayBatDau, ngayKetThuc!' });
            }
            const newKM = await KhuyenMaiModel.create({ ten, giamGia, ngayBatDau, ngayKetThuc });
            return res.status(201).json({ status: 'success', data: newKM, message: 'Tạo khuyến mãi thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminUpdate(req, res) {
        try {
            const { ten, giamGia, ngayBatDau, ngayKetThuc } = req.body;
            const isUpdated = await KhuyenMaiModel.update(req.params.id, { ten, giamGia, ngayBatDau, ngayKetThuc });
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy khuyến mãi!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật khuyến mãi thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminUpdateStatus(req, res) {
        try {
            const { status } = req.body;
            if (status === undefined) return res.status(400).json({ status: 'error', data: null, message: 'Trạng thái là bắt buộc!' });
            const isUpdated = await KhuyenMaiModel.updateStatus(req.params.id, status);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy khuyến mãi!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật trạng thái thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminRemove(req, res) {
        try {
            const isDeleted = await KhuyenMaiModel.remove(req.params.id);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy khuyến mãi!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa khuyến mãi thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // ======= CUSTOMER =======

    /** Customer: Kiểm tra mã khuyến mãi có hiệu lực không */
    static async validateKhuyenMai(req, res) {
        try {
            const km = await KhuyenMaiModel.validateKhuyenMai(req.params.id);
            if (!km) return res.status(404).json({ status: 'error', data: null, message: 'Mã khuyến mãi không hợp lệ hoặc đã hết hạn!' });
            return res.status(200).json({ status: 'success', data: km, message: 'Mã khuyến mãi hợp lệ!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
}

module.exports = KhuyenMaiController;
