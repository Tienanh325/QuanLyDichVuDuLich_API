const DanhGiaModel = require('../models/danhgia.model');

class DanhGiaController {
    // ======= ADMIN =======
    static async adminGetAll(req, res) {
        try {
            const result = await DanhGiaModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách đánh giá thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Admin: Xóa đánh giá vi phạm */
    static async adminRemove(req, res) {
        try {
            const isDeleted = await DanhGiaModel.remove(req.params.id, null); // null = admin, không cần check maUser
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy đánh giá!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa đánh giá thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // ======= PUBLIC (xem) =======
    static async publicGetAll(req, res) {
        try {
            const result = await DanhGiaModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách đánh giá thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // ======= CUSTOMER =======
    /** Customer: Thêm đánh giá */
    static async customerCreate(req, res) {
        try {
            const { maDichVu, soSao, binhLuan } = req.body;
            if (!maDichVu || !soSao) {
                return res.status(400).json({ status: 'error', data: null, message: 'maDichVu và soSao là bắt buộc!' });
            }
            if (soSao < 1 || soSao > 5) {
                return res.status(400).json({ status: 'error', data: null, message: 'soSao phải từ 1 đến 5!' });
            }
            const newDG = await DanhGiaModel.create(req.user.maUser, { maDichVu, soSao, binhLuan });
            return res.status(201).json({ status: 'success', data: newDG, message: 'Đánh giá thành công!' });
        } catch (error) {
            return res.status(400).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Customer: Cập nhật đánh giá của mình */
    static async customerUpdate(req, res) {
        try {
            const { soSao, binhLuan } = req.body;
            if (!soSao || soSao < 1 || soSao > 5) {
                return res.status(400).json({ status: 'error', data: null, message: 'soSao phải từ 1 đến 5!' });
            }
            const isUpdated = await DanhGiaModel.update(req.params.id, req.user.maUser, { soSao, binhLuan });
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy đánh giá!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật đánh giá thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Customer: Xóa đánh giá của mình */
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
