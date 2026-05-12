const KhachSanModel = require('../models/khachsan.model');

class KhachSanController {
    // ========= KHÁCH SẠN =========

    static async adminGetAll(req, res) {
        try {
            const result = await KhachSanModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách khách sạn thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const ks = await KhachSanModel.getById(req.params.id);
            if (!ks) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy khách sạn!' });
            return res.status(200).json({ status: 'success', data: ks, message: 'Lấy thông tin khách sạn thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminCreate(req, res) {
        try {
            const { maDichVu } = req.body;
            if (!maDichVu) return res.status(400).json({ status: 'error', data: null, message: 'maDichVu là bắt buộc!' });
            const newKS = await KhachSanModel.create(req.body);
            return res.status(201).json({ status: 'success', data: newKS, message: 'Tạo khách sạn thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminUpdate(req, res) {
        try {
            const isUpdated = await KhachSanModel.update(req.params.id, req.body);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy khách sạn!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật khách sạn thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminRemove(req, res) {
        try {
            const isDeleted = await KhachSanModel.remove(req.params.id);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy khách sạn!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa khách sạn thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // ========= LOẠI PHÒNG =========

    static async getLoaiPhong(req, res) {
        try {
            const loaiPhong = await KhachSanModel.getLoaiPhong(req.params.id);
            return res.status(200).json({ status: 'success', data: loaiPhong, message: 'Lấy danh sách loại phòng thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async createLoaiPhong(req, res) {
        try {
            const data = { maKhachSan: req.params.id, ...req.body };
            if (!data.tenLoaiPhong || !data.giaPhong) {
                return res.status(400).json({ status: 'error', data: null, message: 'Tên loại phòng và giá phòng là bắt buộc!' });
            }
            const newLP = await KhachSanModel.createLoaiPhong(data);
            return res.status(201).json({ status: 'success', data: newLP, message: 'Tạo loại phòng thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async updateLoaiPhong(req, res) {
        try {
            const isUpdated = await KhachSanModel.updateLoaiPhong(req.params.phongId, req.body);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy loại phòng!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật loại phòng thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async removeLoaiPhong(req, res) {
        try {
            const isDeleted = await KhachSanModel.removeLoaiPhong(req.params.phongId);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy loại phòng!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa loại phòng thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // ========= TIỆN ÍCH / FAQ =========

    static async getKhachSanTienIch(req, res) {
        try {
            const data = await KhachSanModel.getKhachSanTienIch(req.params.id);
            return res.status(200).json({ status: 'success', data });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async updateKhachSanTienIch(req, res) {
        try {
            const ids = req.body.maTienIchList || req.body.maTienIch || [];
            await KhachSanModel.upsertKhachSanTienIch(req.params.id, Array.isArray(ids) ? ids : []);
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật tiện ích khách sạn thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getKhachSanFAQ(req, res) {
        try {
            const data = await KhachSanModel.getKhachSanFAQ(req.params.id);
            return res.status(200).json({ status: 'success', data });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async createKhachSanFAQ(req, res) {
        try {
            const newItem = await KhachSanModel.createKhachSanFAQ(req.params.id, req.body);
            return res.status(201).json({ status: 'success', data: newItem, message: 'Tạo FAQ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async updateKhachSanFAQ(req, res) {
        try {
            const ok = await KhachSanModel.updateKhachSanFAQ(req.params.faqId, req.body);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy FAQ!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật FAQ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async removeKhachSanFAQ(req, res) {
        try {
            const ok = await KhachSanModel.removeKhachSanFAQ(req.params.faqId);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy FAQ!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Xóa FAQ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getLoaiPhongTienIch(req, res) {
        try {
            const data = await KhachSanModel.getLoaiPhongTienIch(req.params.phongId);
            return res.status(200).json({ status: 'success', data });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async updateLoaiPhongTienIch(req, res) {
        try {
            const ids = req.body.maTienIchList || req.body.maTienIch || [];
            await KhachSanModel.upsertLoaiPhongTienIch(req.params.phongId, Array.isArray(ids) ? ids : []);
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật tiện ích phòng thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // Public
    static async publicGetAll(req, res) {
        try {
            const result = await KhachSanModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách khách sạn thành công!' });
        } catch (error) {
            console.error('❌ Lỗi publicGetAll khách sạn:', error.message);
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
}

module.exports = KhachSanController;
