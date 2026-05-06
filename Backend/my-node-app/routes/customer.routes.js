const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');

// Controllers
const UserController = require('../controllers/user.controller');
const DichVuController = require('../controllers/dichvu.controller');
const TourController = require('../controllers/tour.controller');
const KhachSanController = require('../controllers/khachsan.controller');
const VeController = require('../controllers/ve.controller');
const KhuyenMaiController = require('../controllers/khuyenmai.controller');
const DonDatController = require('../controllers/dondat.controller');
const ThanhToanController = require('../controllers/thanhtoan.controller');
const DanhGiaController = require('../controllers/danhgia.controller');
const LoaiVeController = require('../controllers/loaive.controller');

// ==========================================
// 1. PUBLIC ROUTES (Không cần đăng nhập)
// ==========================================

// Dịch vụ công khai
router.get('/dich-vu', DichVuController.publicGetAll);
router.get('/dich-vu/noi-bat', DichVuController.publicGetFeatured);
router.get('/dich-vu/:id', DichVuController.publicGetById);

// Tour (tìm kiếm & xem chi tiết)
router.get('/tour', TourController.publicGetAll);
router.get('/tour/:id', TourController.getById);

// Khách sạn
router.get('/khach-san', KhachSanController.publicGetAll);
router.get('/khach-san/:id', KhachSanController.getById);

// Vé (tìm kiếm)
router.get('/ve/may-bay/tim-kiem', VeController.searchMayBay);
router.get('/ve/tau-hoa/tim-kiem', VeController.searchTauHoa);
router.get('/ve/:id', VeController.getById);

// Loại vé (public, để hiển thị filter)
router.get('/loai-ve', LoaiVeController.getAllLoaiVe);

// Đánh giá (public)
router.get('/danh-gia', DanhGiaController.publicGetAll);

// ==========================================
// 2. AUTHENTICATED ROUTES (Cần đăng nhập)
// ==========================================

// Profile
router.get('/toi/profile', requireAuth, UserController.getProfile);
router.put('/toi/profile', requireAuth, UserController.updateProfile);
router.patch('/toi/doi-mat-khau', requireAuth, UserController.changePassword);

// Kiểm tra khuyến mãi
router.get('/khuyen-mai/:id/kiem-tra', requireAuth, KhuyenMaiController.validateKhuyenMai);

// Đặt dịch vụ
router.post('/don-dat', requireAuth, DonDatController.customerCreate);
router.get('/toi/don-dat', requireAuth, DonDatController.customerGetMyOrders);
router.get('/toi/don-dat/:id', requireAuth, DonDatController.customerGetMyOrderById);
router.patch('/toi/don-dat/:id/huy', requireAuth, DonDatController.customerCancel);

// Thanh toán
router.post('/thanh-toan', requireAuth, ThanhToanController.customerThanhToan);
router.get('/toi/don-dat/:donId/thanh-toan', requireAuth, ThanhToanController.customerGetByDon);

// Đánh giá
router.post('/danh-gia', requireAuth, DanhGiaController.customerCreate);
router.put('/danh-gia/:id', requireAuth, DanhGiaController.customerUpdate);
router.delete('/danh-gia/:id', requireAuth, DanhGiaController.customerRemove);

module.exports = router;
