const NhaCungCapModel = require('../models/nhacungcap.model');

class NhaCungCapController {
    static async getAll(req, res) {
        try {
            const { page = 1, limit = 10, sortBy, status } = req.query;

            const result = await NhaCungCapModel.getAll(page, limit, sortBy, status);

            return res.status(200).json({
                status: 'success',
                data: result,
                message: 'Lấy danh sách nhà cung cấp thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi lấy danh sách nhà cung cấp.'
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const supplier = await NhaCungCapModel.getById(id);

            if (!supplier) {
                return res.status(404).json({
                    status: 'error',
                    data: null,
                    message: 'Không tìm thấy nhà cung cấp!'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: supplier,
                message: 'Lấy thông tin nhà cung cấp thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi lấy thông tin nhà cung cấp.'
            });
        }
    }

    static async create(req, res) {
        try {
            const { ten, email, sdt, diaChi, loai } = req.body;

            if (!ten) {
                return res.status(400).json({
                    status: 'error',
                    data: null,
                    message: 'Tên nhà cung cấp là bắt buộc!'
                });
            }

            const newSupplier = await NhaCungCapModel.create({ ten, email, sdt, diaChi, loai });

            return res.status(201).json({
                status: 'success',
                data: newSupplier,
                message: 'Tạo nhà cung cấp mới thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi tạo nhà cung cấp.'
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { ten, email, sdt, diaChi, loai } = req.body;

            const isUpdated = await NhaCungCapModel.update(id, { ten, email, sdt, diaChi, loai });

            if (!isUpdated) {
                return res.status(404).json({
                    status: 'error',
                    data: null,
                    message: 'Không tìm thấy nhà cung cấp hoặc dữ liệu không thay đổi!'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: { maNhaCungCap: id, ...req.body },
                message: 'Cập nhật thông tin nhà cung cấp thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi cập nhật nhà cung cấp.'
            });
        }
    }

    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (status === undefined) {
                return res.status(400).json({
                    status: 'error',
                    data: null,
                    message: 'Trạng thái (status) là bắt buộc!'
                });
            }

            const isUpdated = await NhaCungCapModel.updateStatus(id, status);

            if (!isUpdated) {
                return res.status(404).json({
                    status: 'error',
                    data: null,
                    message: 'Không tìm thấy nhà cung cấp!'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: { maNhaCungCap: id, trangThai: status },
                message: 'Cập nhật trạng thái thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi cập nhật trạng thái.'
            });
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;
            const isDeleted = await NhaCungCapModel.remove(id);

            if (!isDeleted) {
                return res.status(404).json({
                    status: 'error',
                    data: null,
                    message: 'Không tìm thấy nhà cung cấp để xóa!'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: null,
                message: 'Đã xóa nhà cung cấp thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi xóa nhà cung cấp.'
            });
        }
    }
}

module.exports = NhaCungCapController;
