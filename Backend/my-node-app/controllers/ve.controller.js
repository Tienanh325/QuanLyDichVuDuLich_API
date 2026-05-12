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
            const { maDichVu, chiTiet, bảngGia, bangGia } = req.body;
            const priceList = bảngGia || bangGia;
            const { hangHangKhong, soHieuChuyenBay, diemKhoiHanh, diemDen, thoiGianKhoiHanh, thoiGianDen } = chiTiet || {};
            if (!hangHangKhong || !diemKhoiHanh || !diemDen || !thoiGianKhoiHanh || !thoiGianDen) {
                return res.status(400).json({ status: 'error', data: null, message: 'Thiếu thông tin vé máy bay!' });
            }
            const maVe = await VeModel.createVe({ maDichVu, loaiVeCon: 'MAY_BAY' });
            await VeModel.createVeMayBay(maVe, chiTiet);
            if (Array.isArray(priceList)) {
                for (const g of priceList) {
                    await VeModel.upsertGiaVe(maVe, g.maLoaiVe, g.gia, g.soChoTrong || 0, g.giaGoc || null, g.thuePhi || 0);
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
            const { maDichVu, chiTiet, bảngGia, bangGia } = req.body;
            const priceList = bảngGia || bangGia;
            const { hangTau } = chiTiet || {};
            if (!hangTau) return res.status(400).json({ status: 'error', data: null, message: 'Thiếu thông tin vé tàu hỏa!' });
            const maVe = await VeModel.createVe({ maDichVu, loaiVeCon: 'TAU_HOA' });
            await VeModel.createVeTauHoa(maVe, chiTiet);
            if (Array.isArray(priceList)) {
                for (const g of priceList) {
                    await VeModel.upsertGiaVe(maVe, g.maLoaiVe, g.gia, g.soChoTrong || 0, g.giaGoc || null, g.thuePhi || 0);
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
            const { maDichVu, chiTiet, bảngGia, bangGia } = req.body;
            const priceList = bảngGia || bangGia;
            const maVe = await VeModel.createVe({ maDichVu, loaiVeCon: 'VUI_CHOI' });
            await VeModel.createVeKhuVuiChoi(maVe, chiTiet || {});
            if (Array.isArray(priceList)) {
                for (const g of priceList) {
                    await VeModel.upsertGiaVe(maVe, g.maLoaiVe, g.gia, g.soChoTrong || 0, g.giaGoc || null, g.thuePhi || 0);
                }
            }
            const newVe = await VeModel.getById(maVe);
            return res.status(201).json({ status: 'success', data: newVe, message: 'Tạo vé khu vui chơi thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Admin: Cập nhật thông tin vé (PUT) */
    static async adminUpdate(req, res) {
        try {
            const { maDichVu, chiTiet, bảngGia, bangGia, loaiVeCon } = req.body;
            const priceList = bảngGia || bangGia;
            const id = req.params.id;
            
            // Note: we can't easily change loaiVeCon, we assume it's the same or we just update the specific table
            const ve = await VeModel.getById(id);
            if (!ve) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy vé!' });

            // Update specific table based on type
            const typeToUpdate = loaiVeCon || ve.loaiVeCon;
            if (typeToUpdate === 'MAY_BAY') {
                await VeModel.updateVeMayBay(id, chiTiet || {});
            } else if (typeToUpdate === 'TAU_HOA') {
                await VeModel.updateVeTauHoa(id, chiTiet || {});
            } else if (typeToUpdate === 'VUI_CHOI') {
                await VeModel.updateVeKhuVuiChoi(id, chiTiet || {});
            }

            // Update prices
            if (Array.isArray(priceList)) {
                for (const g of priceList) {
                    await VeModel.upsertGiaVe(id, g.maLoaiVe, g.gia, g.soChoTrong || 0, g.giaGoc || null, g.thuePhi || 0);
                }
            }
            
            const updatedVe = await VeModel.getById(id);
            return res.status(200).json({ status: 'success', data: updatedVe, message: 'Cập nhật vé thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Admin: Cập nhật trạng thái vé */
    static async adminUpdateStatus(req, res) {
        try {
            const { trangThai } = req.body;
            const valid = ['AVAILABLE', 'SOLD_OUT', 'CANCELLED', 'INACTIVE'];
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
            const { maLoaiVe, gia, giaGoc = null, soChoTrong = 0, thuePhi = 0 } = req.body;
            if (!maLoaiVe || !gia || gia <= 0) {
                return res.status(400).json({ status: 'error', data: null, message: 'maLoaiVe và gia (> 0) là bắt buộc!' });
            }
            await VeModel.upsertGiaVe(req.params.id, maLoaiVe, gia, soChoTrong, giaGoc, thuePhi);
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

    // =========== TIỆN ÍCH / KHOANG / GHẾ ===========

    static async getVeTienIch(req, res) {
        try {
            const data = await VeModel.getVeTienIch(req.params.id);
            return res.status(200).json({ status: 'success', data });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async updateVeTienIch(req, res) {
        try {
            const ids = req.body.maTienIchList || req.body.maTienIch || [];
            await VeModel.upsertVeTienIch(req.params.id, Array.isArray(ids) ? ids : []);
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật tiện ích vé thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getVeTauKhoang(req, res) {
        try {
            const data = await VeModel.getVeTauKhoang(req.params.id);
            return res.status(200).json({ status: 'success', data });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async createVeTauKhoang(req, res) {
        try {
            const newItem = await VeModel.createVeTauKhoang(req.params.id, req.body);
            return res.status(201).json({ status: 'success', data: newItem, message: 'Tạo khoang tàu thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async updateVeTauKhoang(req, res) {
        try {
            const ok = await VeModel.updateVeTauKhoang(req.params.khoangId, req.body);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy khoang!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật khoang tàu thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async removeVeTauKhoang(req, res) {
        try {
            const ok = await VeModel.removeVeTauKhoang(req.params.khoangId);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy khoang!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Xóa khoang tàu thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getVeTauGhe(req, res) {
        try {
            const data = await VeModel.getVeTauGhe(req.params.khoangId);
            return res.status(200).json({ status: 'success', data });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async createVeTauGhe(req, res) {
        try {
            const newItem = await VeModel.createVeTauGhe(req.params.khoangId, req.body);
            return res.status(201).json({ status: 'success', data: newItem, message: 'Tạo ghế tàu thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async updateVeTauGhe(req, res) {
        try {
            const ok = await VeModel.updateVeTauGhe(req.params.gheId, req.body);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy ghế!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật ghế tàu thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async removeVeTauGhe(req, res) {
        try {
            const ok = await VeModel.removeVeTauGhe(req.params.gheId);
            if (!ok) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy ghế!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Xóa ghế tàu thành công!' });
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
