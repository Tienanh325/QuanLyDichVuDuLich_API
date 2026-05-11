const AdminConfigModel = require('../models/adminconfig.model');

class AdminConfigController {
    static async getDanhMucHoatDong(req, res) {
        try {
            const result = await AdminConfigModel.getDanhMucHoatDong();
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh mục hoạt động thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async createDanhMucHoatDong(req, res) {
        try {
            const { tenDanhMuc } = req.body;
            if (!tenDanhMuc) return res.status(400).json({ status: 'error', data: null, message: 'Tên danh mục là bắt buộc!' });
            const result = await AdminConfigModel.createDanhMucHoatDong(req.body);
            return res.status(201).json({ status: 'success', data: result, message: 'Tạo danh mục hoạt động thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async updateDanhMucHoatDong(req, res) {
        try {
            const { tenDanhMuc } = req.body;
            if (!tenDanhMuc) return res.status(400).json({ status: 'error', data: null, message: 'Tên danh mục là bắt buộc!' });
            const isUpdated = await AdminConfigModel.updateDanhMucHoatDong(req.params.id, req.body);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy danh mục!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật danh mục hoạt động thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async removeDanhMucHoatDong(req, res) {
        try {
            const isDeleted = await AdminConfigModel.removeDanhMucHoatDong(req.params.id);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy danh mục!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa danh mục hoạt động!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getTienIch(req, res) {
        try {
            const result = await AdminConfigModel.getTienIch(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách tiện ích thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async createTienIch(req, res) {
        try {
            const { tenTienIch, loaiTienIch } = req.body;
            if (!tenTienIch || !loaiTienIch) return res.status(400).json({ status: 'error', data: null, message: 'Tên tiện ích và loại tiện ích là bắt buộc!' });
            const result = await AdminConfigModel.createTienIch(req.body);
            return res.status(201).json({ status: 'success', data: result, message: 'Tạo tiện ích thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async updateTienIch(req, res) {
        try {
            const { tenTienIch, loaiTienIch } = req.body;
            if (!tenTienIch || !loaiTienIch) return res.status(400).json({ status: 'error', data: null, message: 'Tên tiện ích và loại tiện ích là bắt buộc!' });
            const isUpdated = await AdminConfigModel.updateTienIch(req.params.id, req.body);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy tiện ích!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật tiện ích thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async removeTienIch(req, res) {
        try {
            const isDeleted = await AdminConfigModel.removeTienIch(req.params.id);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy tiện ích!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa tiện ích!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getNewsletter(req, res) {
        try {
            const result = await AdminConfigModel.getNewsletter(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách đăng ký nhận tin thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async updateNewsletterStatus(req, res) {
        try {
            const { trangThai } = req.body;
            if (!trangThai) return res.status(400).json({ status: 'error', data: null, message: 'Trạng thái là bắt buộc!' });
            const isUpdated = await AdminConfigModel.updateNewsletterStatus(req.params.id, trangThai);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy đăng ký nhận tin!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật trạng thái nhận tin thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async removeNewsletter(req, res) {
        try {
            const isDeleted = await AdminConfigModel.removeNewsletter(req.params.id);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy đăng ký nhận tin!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa đăng ký nhận tin!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
}

module.exports = AdminConfigController;
