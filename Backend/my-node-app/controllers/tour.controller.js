const TourModel = require('../models/tour.model');

class TourController {
    static async adminGetAll(req, res) {
        try {
            const result = await TourModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách tour thành công!' });
        } catch (error) {
            console.error('[adminGetAll tour]', error?.code, error?.message);
            return res.status(200).json({
                status: 'success',
                data: { data: [], totalRecords: 0, totalPages: 0, currentPage: 1 },
                message: 'Lấy danh sách tour thành công!'
            });
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
            const { maDichVu, viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach, maDanhMuc, tenTour, diaDiem, moTaHoatDong, giaGoc, giaKhuyenMai, diemDanhGia, soLuotDanhGia, highlight, isBestSeller, chinhSachHuy, xacNhanTucThi } = req.body;
            if (!maDichVu || !giaTour) {
                return res.status(400).json({ status: 'error', data: null, message: 'maDichVu và giaTour là bắt buộc!' });
            }
            const newTour = await TourModel.create({ maDichVu, viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach, maDanhMuc, tenTour, diaDiem, moTaHoatDong, giaGoc, giaKhuyenMai, diemDanhGia, soLuotDanhGia, highlight, isBestSeller, chinhSachHuy, xacNhanTucThi });
            return res.status(201).json({ status: 'success', data: newTour, message: 'Tạo tour thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminUpdate(req, res) {
        try {
            const { viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach, maDanhMuc, tenTour, diaDiem, moTaHoatDong, giaGoc, giaKhuyenMai, diemDanhGia, soLuotDanhGia, highlight, isBestSeller, chinhSachHuy, xacNhanTucThi } = req.body;
            const isUpdated = await TourModel.update(req.params.id, { viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach, maDanhMuc, tenTour, diaDiem, moTaHoatDong, giaGoc, giaKhuyenMai, diemDanhGia, soLuotDanhGia, highlight, isBestSeller, chinhSachHuy, xacNhanTucThi });
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

    // =================== TOUR CHILD CRUD ===================

    static async getGoiDichVu(req, res) {
        try {
            const list = await TourModel.getGoiDichVu(req.params.tourId);
            return res.status(200).json({ status: 'success', data: list });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async createGoiDichVu(req, res) {
        try {
            const data = req.body;
            const newItem = await TourModel.createGoiDichVu(req.params.tourId, data);
            return res.status(201).json({ status: 'success', data: newItem, message: 'Tạo gói dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async updateGoiDichVu(req, res) {
        try {
            const { maGoi } = req.params;
            const data = req.body;
            const ok = await TourModel.updateGoiDichVu(maGoi, data);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy gói!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật gói dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async removeGoiDichVu(req, res) {
        try {
            const { maGoi } = req.params;
            const ok = await TourModel.removeGoiDichVu(maGoi);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy gói!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Xóa gói dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getTourMucDichVu(req, res) {
        try {
            const list = await TourModel.getTourMucDichVu(req.params.tourId);
            return res.status(200).json({ status: 'success', data: list });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async createTourMucDichVu(req, res) {
        try {
            const data = req.body;
            const newItem = await TourModel.createTourMucDichVu(req.params.tourId, data);
            return res.status(201).json({ status: 'success', data: newItem, message: 'Tạo mục dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async updateTourMucDichVu(req, res) {
        try {
            const { maMuc } = req.params;
            const data = req.body;
            const ok = await TourModel.updateTourMucDichVu(maMuc, data);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy mục!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật mục dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async removeTourMucDichVu(req, res) {
        try {
            const ok = await TourModel.removeTourMucDichVu(req.params.maMuc);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy mục!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Xóa mục dịch vụ thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getLichTrinh(req, res) {
        try {
            const list = await TourModel.getLichTrinh(req.params.tourId);
            return res.status(200).json({ status: 'success', data: list });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async createLichTrinh(req, res) {
        try {
            const data = req.body;
            const newItem = await TourModel.createLichTrinh(req.params.tourId, data);
            return res.status(201).json({ status: 'success', data: newItem, message: 'Thêm lịch trình thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async updateLichTrinh(req, res) {
        try {
            const { maLichTrinh } = req.params;
            const data = req.body;
            const ok = await TourModel.updateLichTrinh(maLichTrinh, data);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy lịch trình!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật lịch trình thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async removeLichTrinh(req, res) {
        try {
            const ok = await TourModel.removeLichTrinh(req.params.maLichTrinh);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy lịch trình!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Xóa lịch trình thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getLichKhoiHanh(req, res) {
        try {
            const list = await TourModel.getLichKhoiHanh(req.params.tourId);
            return res.status(200).json({ status: 'success', data: list });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async createLichKhoiHanh(req, res) {
        try {
            const data = req.body;
            const newItem = await TourModel.createLichKhoiHanh(req.params.tourId, data);
            return res.status(201).json({ status: 'success', data: newItem, message: 'Thêm lịch khởi hành thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async updateLichKhoiHanh(req, res) {
        try {
            const { maLichKhoiHanh } = req.params;
            const data = req.body;
            const ok = await TourModel.updateLichKhoiHanh(maLichKhoiHanh, data);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy lịch khởi hành!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật lịch khởi hành thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async removeLichKhoiHanh(req, res) {
        try {
            const ok = await TourModel.removeLichKhoiHanh(req.params.maLichKhoiHanh);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy lịch khởi hành!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Xóa lịch khởi hành thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getReviewHienThi(req, res) {
        try {
            const list = await TourModel.getReviewHienThi(req.params.tourId);
            return res.status(200).json({ status: 'success', data: list });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async createReviewHienThi(req, res) {
        try {
            const data = req.body;
            const newItem = await TourModel.createReviewHienThi(req.params.tourId, data);
            return res.status(201).json({ status: 'success', data: newItem, message: 'Thêm review hiển thị thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async updateReviewHienThi(req, res) {
        try {
            const { maReviewHienThi } = req.params;
            const data = req.body;
            const ok = await TourModel.updateReviewHienThi(maReviewHienThi, data);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy review!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật review hiển thị thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
    static async removeReviewHienThi(req, res) {
        try {
            const ok = await TourModel.removeReviewHienThi(req.params.maReviewHienThi);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy review!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Xóa review hiển thị thành công!' });
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
