const TourModel = require('../models/Admin_tour');

class TourController {
    static async getAll(req, res) {
        try {
            const result = await TourModel.getAll();

            return res.status(200).json({
                status: 'success',
                data: result,
                message: 'Lấy danh sách tour thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi lấy danh sách tour.'
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const tour = await TourModel.getById(id);

            if (!tour) {
                return res.status(404).json({
                    status: 'error',
                    data: null,
                    message: 'Không tìm thấy tour!'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: tour,
                message: 'Lấy thông tin tour thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi lấy thông tin tour.'
            });
        }
    }

    static async create(req, res) {
        try {
            const { maDichVu, viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach } = req.body;

            if (!maDichVu) {
                return res.status(400).json({
                    status: 'error',
                    data: null,
                    message: 'Mã dịch vụ (maDichVu) là bắt buộc!'
                });
            }

            const newTour = await TourModel.create({ maDichVu, viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach });

            return res.status(201).json({
                status: 'success',
                data: newTour,
                message: 'Tạo tour mới thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi tạo tour.'
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { maDichVu, viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach } = req.body;

            const isUpdated = await TourModel.update(id, { maDichVu, viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach });

            if (!isUpdated) {
                return res.status(404).json({
                    status: 'error',
                    data: null,
                    message: 'Không tìm thấy tour hoặc dữ liệu không thay đổi!'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: { maTour: Number(id), ...req.body },
                message: 'Cập nhật thông tin tour thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi cập nhật tour.'
            });
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;
            const isDeleted = await TourModel.remove(id);

            if (!isDeleted) {
                return res.status(404).json({
                    status: 'error',
                    data: null,
                    message: 'Không tìm thấy tour để xóa!'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: null,
                message: 'Đã xóa tour thành công!'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi xóa tour.'
            });
        }
    }
}

module.exports = TourController;
