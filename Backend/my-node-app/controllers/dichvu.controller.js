const DichVuModel = require('../models/dichvu.model');

class DichVuController {
    // =================== ADMIN ===================

    static async adminGetAll(req, res) {
        try {
            const result = await DichVuModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách dịch vụ thành công!' });
        } catch (error) {
            console.error('[adminGetAll dichvu]', error?.code, error?.message);
            return res.status(200).json({
                status: 'success',
                data: { data: [], totalRecords: 0, totalPages: 0, currentPage: 1 },
                message: 'Lấy danh sách dịch vụ thành công!'
            });
        }
    }

    static async adminGetById(req, res) {
        try {
            const dichvu = await DichVuModel.getById(req.params.id);
            if (!dichvu) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy dịch vụ!' });
            return res.status(200).json({ status: 'success', data: dichvu, message: 'Lấy thông tin dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminCreate(req, res) {
        try {
            const { ten, moTa, loaiDichVu, maNhaCungCap, trangThai } = req.body;
            if (!ten || !loaiDichVu) {
                return res.status(400).json({ status: 'error', data: null, message: 'Tên và loại dịch vụ là bắt buộc!' });
            }
            const validTypes = ['TOUR', 'KHACH_SAN', 'VE'];
            if (!validTypes.includes(loaiDichVu.toUpperCase())) {
                return res.status(400).json({ status: 'error', data: null, message: 'Loại dịch vụ không hợp lệ! Chỉ chấp nhận: TOUR, KHACH_SAN, VE' });
            }
            const newDichVu = await DichVuModel.create({ ten, moTa, loaiDichVu: loaiDichVu.toUpperCase(), maNhaCungCap, trangThai });
            return res.status(201).json({ status: 'success', data: newDichVu, message: 'Tạo dịch vụ mới thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminUpdate(req, res) {
        try {
            const { ten, moTa, loaiDichVu, maNhaCungCap, trangThai } = req.body;
            if (!ten || !loaiDichVu) {
                return res.status(400).json({ status: 'error', data: null, message: 'Tên và loại dịch vụ là bắt buộc!' });
            }
            // Luôn chuyển đổi trangThai sang 0/1
            const statusValue = (trangThai === 1 || trangThai === '1' || trangThai === true || trangThai === 'active') ? 1 : 0;
            const isUpdated = await DichVuModel.update(req.params.id, { ten, moTa, loaiDichVu, maNhaCungCap, trangThai: statusValue });
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy dịch vụ!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminUpdateStatus(req, res) {
        try {
            const { status } = req.body;
            if (status === undefined) return res.status(400).json({ status: 'error', data: null, message: 'Trạng thái là bắt buộc!' });
            const isUpdated = await DichVuModel.updateStatus(req.params.id, status);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy dịch vụ!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật trạng thái thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminRemove(req, res) {
        try {
            const isDeleted = await DichVuModel.remove(req.params.id);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy dịch vụ!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // =================== CUSTOMER (PUBLIC) ===================

    /** Trang chủ: Lấy dịch vụ theo loại (public) */
    static async publicGetAll(req, res) {
        try {
            const result = await DichVuModel.getAll({ ...req.query, status: 'true' });
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Trang chủ: Lấy dịch vụ nổi bật */
    static async publicGetFeatured(req, res) {
        try {
            const { loaiDichVu, limit = 8 } = req.query;
            const result = await DichVuModel.getFeatured(loaiDichVu, limit);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy dịch vụ nổi bật thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Public: Xem chi tiết 1 dịch vụ */
    static async publicGetById(req, res) {
        try {
            const dichvu = await DichVuModel.getById(req.params.id);
            if (!dichvu || !dichvu.trangThai) {
                return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy dịch vụ!' });
            }
            return res.status(200).json({ status: 'success', data: dichvu, message: 'Lấy thông tin dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
}

module.exports = DichVuController;
