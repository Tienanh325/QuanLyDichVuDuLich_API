const DanhGiaModel = require('../models/danhgia.model');

class DanhGiaController {
    static async adminGetAll(req, res) {
        try {
            const result = await DanhGiaModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách đánh giá thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminRemove(req, res) {
        try {
            const isDeleted = await DanhGiaModel.remove(req.params.id, null);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy đánh giá!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa đánh giá thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async publicGetAll(req, res) {
        try {
            const result = await DanhGiaModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách đánh giá thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async publicGetSummary(req, res) {
        try {
            const result = await DanhGiaModel.getSummary(req.params.maDichVu);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy thống kê đánh giá thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async publicGetCriteria(req, res) {
        try {
            const result = await DanhGiaModel.getCriteriaByService(req.params.maDichVu);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy tiêu chí đánh giá thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async customerGetMine(req, res) {
        try {
            const result = await DanhGiaModel.getMyReview(req.user.maUser, req.params.maDichVu);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy đánh giá của tôi thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static validatePayload(req, res) {
        const { maDichVu, soSao, binhLuan, hinhAnh = [] } = req.body;
        if (!maDichVu || !soSao) return 'maDichVu và soSao là bắt buộc!';
        if (soSao < 1 || soSao > 5) return 'soSao phải từ 1 đến 5!';
        if (binhLuan && binhLuan.length > 2000) return 'Bình luận tối đa 2000 ký tự!';
        if (Array.isArray(hinhAnh) && hinhAnh.length > 5) return 'Chỉ được thêm tối đa 5 ảnh!';
        return null;
    }

    static async customerCreate(req, res) {
        try {
            const errorMessage = DanhGiaController.validatePayload(req, res);
            if (errorMessage) return res.status(400).json({ status: 'error', data: null, message: errorMessage });
            const newDG = await DanhGiaModel.create(req.user.maUser, req.body);
            return res.status(201).json({ status: 'success', data: newDG, message: 'Đánh giá thành công!' });
        } catch (error) {
            return res.status(400).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async customerUpdate(req, res) {
        try {
            const errorMessage = DanhGiaController.validatePayload(req, res);
            if (errorMessage) return res.status(400).json({ status: 'error', data: null, message: errorMessage });
            const isUpdated = await DanhGiaModel.update(req.params.id, req.user.maUser, req.body);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy đánh giá!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật đánh giá thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async customerRemove(req, res) {
        try {
            const isDeleted = await DanhGiaModel.remove(req.params.id, req.user.maUser);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy đánh giá!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa đánh giá thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
}

module.exports = DanhGiaController;
