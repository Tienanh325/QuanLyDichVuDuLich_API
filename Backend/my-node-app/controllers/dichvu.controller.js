const DichVuModel = require('../models/dichvu.model');
const HinhAnhModel = require('../models/hinhanh.model');

class DichVuController {
    // =================== ADMIN ===================

    static async adminGetAll(req, res) {
        try {
            const result = await DichVuModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
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
            const { ten, moTa, loaiDichVu, maNhaCungCap } = req.body;
            if (!ten || !loaiDichVu) {
                return res.status(400).json({ status: 'error', data: null, message: 'Tên và loại dịch vụ là bắt buộc!' });
            }
            const validTypes = ['TOUR', 'KHACH_SAN', 'VE'];
            if (!validTypes.includes(loaiDichVu.toUpperCase())) {
                return res.status(400).json({ status: 'error', data: null, message: 'Loại dịch vụ không hợp lệ! Chỉ chấp nhận: TOUR, KHACH_SAN, VE' });
            }
            const newDichVu = await DichVuModel.create({ ten, moTa, loaiDichVu: loaiDichVu.toUpperCase(), maNhaCungCap });
            return res.status(201).json({ status: 'success', data: newDichVu, message: 'Tạo dịch vụ mới thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminUpdate(req, res) {
        try {
            const { ten, moTa, loaiDichVu, maNhaCungCap } = req.body;
            if (!ten || !loaiDichVu) {
                return res.status(400).json({ status: 'error', data: null, message: 'Tên và loại dịch vụ là bắt buộc!' });
            }
            const isUpdated = await DichVuModel.update(req.params.id, { ten, moTa, loaiDichVu, maNhaCungCap });
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

    // =================== HÌNH ẢNH (Admin) ===================

    static async addHinhAnh(req, res) {
        try {
            const { urlAnh, isAvatar = false } = req.body;
            if (!urlAnh) return res.status(400).json({ status: 'error', data: null, message: 'URL hình ảnh là bắt buộc!' });
            const newImage = await HinhAnhModel.create(req.params.id, urlAnh, isAvatar);
            return res.status(201).json({ status: 'success', data: newImage, message: 'Thêm hình ảnh thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async setAvatar(req, res) {
        try {
            const isUpdated = await HinhAnhModel.setAvatar(req.params.imageId, req.params.id);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy hình ảnh!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã đặt làm ảnh đại diện!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async removeHinhAnh(req, res) {
        try {
            const isDeleted = await HinhAnhModel.remove(req.params.imageId);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy hình ảnh!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa hình ảnh!' });
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
