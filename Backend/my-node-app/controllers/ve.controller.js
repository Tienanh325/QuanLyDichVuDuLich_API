const VeModel = require('../models/ve.model');

class VeController {
    // =========== ADMIN: VÉ GỐC (Ve) ===========

    static async adminGetAll(req, res) {
        try {
            const result = await VeModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: result, message: 'Lấy danh sách vé thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const ve = await VeModel.getById(req.params.id);
            if (!ve) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy vé!' });
            return res.status(200).json({ status: 'success', data: ve, message: 'Lấy thông tin vé thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Admin: Tạo vé máy bay (Ve + VeMayBay + GiaVe) */
    static async adminCreateMayBay(req, res) {
        try {
            const { maDichVu, chiTiet, bảngGia } = req.body;
            const { hangHangKhong, soHieuChuyenBay, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen } = chiTiet || {};
            if (!hangHangKhong || !diemKhoiHanh || !diemDen || !thoiGianKhoiHanh || !thoiGianDen) {
                return res.status(400).json({ status: 'error', data: null, message: 'Thiếu thông tin vé máy bay!' });
            }
            const maVe = await VeModel.createVe({ maDichVu, loaiVeCon: 'MAY_BAY' });
            await VeModel.createVeMayBay(maVe, chiTiet);
            if (bảngGia && Array.isArray(bảngGia)) {
                for (const g of bảngGia) {
                    await VeModel.upsertGiaVe(maVe, g.maLoaiVe, g.gia, g.soChoTrong || 0);
                }
            }
            const newVe = await VeModel.getById(maVe);
            return res.status(201).json({ status: 'success', data: newVe, message: 'Tạo vé máy bay thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Admin: Tạo vé tàu hỏa */
    static async adminCreateTauHoa(req, res) {
        try {
            const { maDichVu, chiTiet, bảngGia } = req.body;
            const { hangTau } = chiTiet || {};
            if (!hangTau) return res.status(400).json({ status: 'error', data: null, message: 'Thiếu thông tin vé tàu hỏa!' });
            const maVe = await VeModel.createVe({ maDichVu, loaiVeCon: 'TAU_HOA' });
            await VeModel.createVeTauHoa(maVe, chiTiet);
            if (bảngGia && Array.isArray(bảngGia)) {
                for (const g of bảngGia) {
                    await VeModel.upsertGiaVe(maVe, g.maLoaiVe, g.gia, g.soChoTrong || 0);
                }
            }
            const newVe = await VeModel.getById(maVe);
            return res.status(201).json({ status: 'success', data: newVe, message: 'Tạo vé tàu hỏa thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Admin: Tạo vé khu vui chơi */
    static async adminCreateVuiChoi(req, res) {
        try {
            const { maDichVu, chiTiet, bảngGia } = req.body;
            const maVe = await VeModel.createVe({ maDichVu, loaiVeCon: 'VUI_CHOI' });
            await VeModel.createVeKhuVuiChoi(maVe, chiTiet || {});
            if (bảngGia && Array.isArray(bảngGia)) {
                for (const g of bảngGia) {
                    await VeModel.upsertGiaVe(maVe, g.maLoaiVe, g.gia, g.soChoTrong || 0);
                }
            }
            const newVe = await VeModel.getById(maVe);
            return res.status(201).json({ status: 'success', data: newVe, message: 'Tạo vé khu vui chơi thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Admin: Cập nhật trạng thái vé */
    static async adminUpdateStatus(req, res) {
        try {
            const { trangThai } = req.body;
            const valid = ['AVAILABLE', 'BOOKED', 'CANCELLED', 'EXPIRED'];
            if (!trangThai || !valid.includes(trangThai)) {
                return res.status(400).json({ status: 'error', data: null, message: 'Trạng thái không hợp lệ!' });
            }
            const isUpdated = await VeModel.updateVeTrangThai(req.params.id, trangThai);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy vé!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật trạng thái vé thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminRemove(req, res) {
        try {
            const isDeleted = await VeModel.removeVe(req.params.id);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy vé!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa vé thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // =========== LOẠI VÉ ===========

    static async getAllLoaiVe(req, res) {
        try {
            const loaiVe = await VeModel.getAllLoaiVe();
            return res.status(200).json({ status: 'success', data: loaiVe, message: 'Lấy danh sách loại vé thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminCreateLoaiVe(req, res) {
        try {
            const { tenLoaiVe } = req.body;
            if (!tenLoaiVe) return res.status(400).json({ status: 'error', data: null, message: 'Tên loại vé là bắt buộc!' });
            const newLoaiVe = await VeModel.createLoaiVe(tenLoaiVe);
            return res.status(201).json({ status: 'success', data: newLoaiVe, message: 'Tạo loại vé thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminRemoveLoaiVe(req, res) {
        try {
            const isDeleted = await VeModel.removeLoaiVe(req.params.id);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy loại vé!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa loại vé!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // =========== GIÁ VÉ ===========

    static async getGiaVe(req, res) {
        try {
            const giaVe = await VeModel.getGiaVeByVe(req.params.id);
            return res.status(200).json({ status: 'success', data: giaVe, message: 'Lấy bảng giá vé thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminUpsertGiaVe(req, res) {
        try {
            const { maLoaiVe, gia, soChoTrong = 0 } = req.body;
            if (!maLoaiVe || !gia || gia <= 0) {
                return res.status(400).json({ status: 'error', data: null, message: 'maLoaiVe và gia (> 0) là bắt buộc!' });
            }
            await VeModel.upsertGiaVe(req.params.id, maLoaiVe, gia, soChoTrong);
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật giá vé thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async adminRemoveGiaVe(req, res) {
        try {
            const isDeleted = await VeModel.removeGiaVe(req.params.giaVeId);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy bảng giá!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa giá vé!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // =========== PUBLIC / CUSTOMER ===========

    static async searchMayBay(req, res) {
        try {
            const results = await VeModel.searchVeMayBay(req.query);
            return res.status(200).json({ status: 'success', data: results, message: 'Tìm kiếm vé máy bay thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async searchTauHoa(req, res) {
        try {
            const results = await VeModel.searchVeTauHoa(req.query);
            return res.status(200).json({ status: 'success', data: results, message: 'Tìm kiếm vé tàu hỏa thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
}

module.exports = VeController;
