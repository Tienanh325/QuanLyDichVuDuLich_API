const TourModel = require('../models/tour.model');

class TourController {
    static async adminGetAll(req, res) {
        try {
            const result = await TourModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách tour thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const tour = await TourModel.getById(req.params.id);
            if (!tour) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy tour!' });
            return res.status(200).json({ status: 'success', data: tour, message: 'Lấy thông tin tour thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminCreate(req, res) {
        try {
            const { maDichVu, viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach } = req.body;
            if (!maDichVu || !giaTour) {
                return res.status(400).json({ status: 'error', data: null, message: 'maDichVu và giaTour là bắt buộc!' });
            }
            const newTour = await TourModel.create({ maDichVu, viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach });
            return res.status(201).json({ status: 'success', data: newTour, message: 'Tạo tour thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminUpdate(req, res) {
        try {
            const { viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach } = req.body;
            const isUpdated = await TourModel.update(req.params.id, { viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach });
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy tour!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật tour thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminRemove(req, res) {
        try {
            const isDeleted = await TourModel.remove(req.params.id);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy tour!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa tour thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // Public
    static async publicGetAll(req, res) {
        try {
            const result = await TourModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách tour thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
}

module.exports = TourController;
