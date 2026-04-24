const DichVuModel = require('../models/Admin_dichvu');

class DichVuController {
    static async getAll(req, res) {
        try {
            const result = await DichVuModel.getAll();

            return res.status(200).json({
                status: 'success',
                data: result,
                message: 'Lấy danh sách dịch vụ thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi lấy danh sách dịch vụ.'
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const service = await DichVuModel.getById(id);

            if (!service) {
                return res.status(404).json({
                    status: 'error',
                    data: null,
                    message: 'Không tìm thấy dịch vụ!'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: service,
                message: 'Lấy thông tin dịch vụ thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi lấy thông tin dịch vụ.'
            });
        }
    }

    static async create(req, res) {
        try {
            const { ten, moTa, loaiDichVu, maNhaCungCap, trangThai } = req.body;

            if (!ten) {
                return res.status(400).json({
                    status: 'error',
                    data: null,
                    message: 'Tên dịch vụ là bắt buộc!'
                });
            }

            if (!loaiDichVu) {
                return res.status(400).json({
                    status: 'error',
                    data: null,
                    message: 'Loại dịch vụ (loaiDichVu) là bắt buộc!'
                });
            }

            const newService = await DichVuModel.create({ ten, moTa, loaiDichVu, maNhaCungCap, trangThai });

            return res.status(201).json({
                status: 'success',
                data: newService,
                message: 'Tạo dịch vụ mới thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi tạo dịch vụ.'
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { ten, moTa, loaiDichVu, maNhaCungCap, trangThai } = req.body;

            const isUpdated = await DichVuModel.update(id, { ten, moTa, loaiDichVu, maNhaCungCap, trangThai });

            if (!isUpdated) {
                return res.status(404).json({
                    status: 'error',
                    data: null,
                    message: 'Không tìm thấy dịch vụ hoặc dữ liệu không thay đổi!'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: { maDichVu: Number(id), ...req.body },
                message: 'Cập nhật thông tin dịch vụ thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi cập nhật dịch vụ.'
            });
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;
            const isDeleted = await DichVuModel.remove(id);

            if (!isDeleted) {
                return res.status(404).json({
                    status: 'error',
                    data: null,
                    message: 'Không tìm thấy dịch vụ để xóa!'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: null,
                message: 'Đã xóa dịch vụ thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi xóa dịch vụ.'
            });
        }
    }
}

module.exports = DichVuController;
