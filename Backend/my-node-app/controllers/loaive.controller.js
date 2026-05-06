const LoaiVeModel = require('../models/loaive.model');

class LoaiVeController {
    static async getAllLoaiVe(req, res) {
        try {
            const loaiVe = await LoaiVeModel.getAllLoaiVe();
            return res.status(200).json({ status: 'success', data: loaiVe, message: 'Lấy danh sách loại vé thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminCreateLoaiVe(req, res) {
        try {
            const { tenLoaiVe, trangthai } = req.body;
            if (!tenLoaiVe) return res.status(400).json({ status: 'error', data: null, message: 'Tên loại vé là bắt buộc!' });
            // Convert: "active" → 1, "inactive" → 0, or accept 0/1 directly
            const trangThaiValue = (trangthai === 'inactive' || trangthai === 0 || trangthai === '0') ? 0 : 1;
            const newLoaiVe = await LoaiVeModel.createLoaiVe(tenLoaiVe, trangThaiValue);
            return res.status(201).json({ status: 'success', data: newLoaiVe, message: 'Tạo loại vé thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminUpdateLoaiVe(req, res) {
        try {
            const { tenLoaiVe, trangthai } = req.body;
            if (!tenLoaiVe) return res.status(400).json({ status: 'error', data: null, message: 'Tên loại vé là bắt buộc!' });
            // Convert: "active" → 1, "inactive" → 0, or accept 0/1 directly
            const trangThaiValue = (trangthai === 'inactive' || trangthai === 0 || trangthai === '0') ? 0 : 1;
            const isUpdated = await LoaiVeModel.updateLoaiVe(req.params.id, tenLoaiVe, trangThaiValue);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy loại vé!' });
            return res.status(200).json({
                status: 'success',
                data: { maLoaiVe: parseInt(req.params.id), tenLoaiVe, trangThai: trangThaiValue },
                message: 'Cập nhật loại vé thành công!'
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminRemoveLoaiVe(req, res) {
        try {
            const isDeleted = await LoaiVeModel.removeLoaiVe(req.params.id);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy loại vé!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa loại vé!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
}

module.exports = LoaiVeController;
