const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth.middleware');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', 'uploads'),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Controllers
const DashboardController = require('../controllers/dashboard.controller');
const NhaCungCapController = require('../controllers/nhacungcap.controller');
const DichVuController = require('../controllers/dichvu.controller');
const TourController = require('../controllers/tour.controller');
const KhachSanController = require('../controllers/khachsan.controller');
const VeController = require('../controllers/ve.controller');
const KhuyenMaiController = require('../controllers/khuyenmai.controller');
const DonDatController = require('../controllers/dondat.controller');
const ThanhToanController = require('../controllers/thanhtoan.controller');
const DanhGiaController = require('../controllers/danhgia.controller');
const UserController = require('../controllers/user.controller');
const LoaiVeController = require('../controllers/loaive.controller');
const AdminConfigController = require('../controllers/adminconfig.controller');
const HinhAnhAdminController = require('../controllers/hinhanhadmin.controller');

// ==========================================
// BẢO VỆ TOÀN BỘ ROUTES ADMIN
// ==========================================
router.use(requireAdmin);

// ==========================================
// 1. DASHBOARD
// ==========================================
router.get('/thong-ke', DashboardController.getOverviewAnalytics);
router.get('/thanh-toan/thong-ke', ThanhToanController.adminThongKeTongQuan);
router.get('/thanh-toan/doanh-thu', ThanhToanController.adminThongKeDoanhThu);

// ==========================================
// 1B. CẤU HÌNH UI
// ==========================================
router.get('/danh-muc-hoat-dong', AdminConfigController.getDanhMucHoatDong);
router.post('/danh-muc-hoat-dong', AdminConfigController.createDanhMucHoatDong);
router.put('/danh-muc-hoat-dong/:id', AdminConfigController.updateDanhMucHoatDong);
router.delete('/danh-muc-hoat-dong/:id', AdminConfigController.removeDanhMucHoatDong);
router.get('/tien-ich', AdminConfigController.getTienIch);
router.post('/tien-ich', AdminConfigController.createTienIch);
router.put('/tien-ich/:id', AdminConfigController.updateTienIch);
router.delete('/tien-ich/:id', AdminConfigController.removeTienIch);
router.get('/newsletter', AdminConfigController.getNewsletter);
router.patch('/newsletter/:id/status', AdminConfigController.updateNewsletterStatus);
router.delete('/newsletter/:id', AdminConfigController.removeNewsletter);

// ==========================================
// 2. QUẢN LÝ NGƯỜI DÙNG
// ==========================================
router.get('/nguoi-dung', UserController.adminGetAll);
router.get('/nguoi-dung/:id', UserController.adminGetById);
router.patch('/nguoi-dung/:id/status', UserController.adminUpdateStatus);
router.patch('/nguoi-dung/:id/vai-tro', UserController.adminUpdateRole);
router.patch('/nguoi-dung/:id/reset-password', UserController.adminResetPassword);
router.delete('/nguoi-dung/:id', UserController.adminRemove);

// ==========================================
// 3. NHÀ CUNG CẤP
// ==========================================
router.get('/nha-cung-cap', NhaCungCapController.getAll);
router.get('/nha-cung-cap/:id', NhaCungCapController.getById);
router.post('/nha-cung-cap', NhaCungCapController.create);
router.put('/nha-cung-cap/:id', NhaCungCapController.update);
router.patch('/nha-cung-cap/:id/status', NhaCungCapController.updateStatus);
router.delete('/nha-cung-cap/:id', NhaCungCapController.remove);

// ==========================================
// 4. DỊCH VỤ CHUNG + HÌNH ẢNH (legacy theo dịch vụ)
// ==========================================
router.get('/dich-vu', DichVuController.adminGetAll);
router.get('/dich-vu/:id', DichVuController.adminGetById);
router.post('/dich-vu', DichVuController.adminCreate);
router.put('/dich-vu/:id', DichVuController.adminUpdate);
router.patch('/dich-vu/:id/status', DichVuController.adminUpdateStatus);
router.delete('/dich-vu/:id', DichVuController.adminRemove);
// Hình ảnh độc lập
router.get('/hinh-anh', HinhAnhAdminController.getAllImages);
router.get('/hinh-anh/:id', HinhAnhAdminController.getImageById);
router.post('/hinh-anh', HinhAnhAdminController.createFromUrl);
router.post('/hinh-anh/upload', upload.single('file'), HinhAnhAdminController.uploadFile);
router.put('/hinh-anh/:id', HinhAnhAdminController.updateImage);
router.delete('/hinh-anh/bulk', HinhAnhAdminController.bulkDeleteImages);
router.delete('/hinh-anh/:id', HinhAnhAdminController.deleteImage);

// ==========================================
// 4B. QUẢN LÝ HÌNH ẢNH
// ==========================================

// ==========================================
// 5. TOUR
// ==========================================
router.get('/tour', TourController.adminGetAll);
router.get('/tour/:id', TourController.getById);
router.post('/tour', TourController.adminCreate);
router.put('/tour/:id', TourController.adminUpdate);
router.delete('/tour/:id', TourController.adminRemove);
router.get('/tour/:tourId/goi-dich-vu', TourController.getGoiDichVu);
router.post('/tour/:tourId/goi-dich-vu', TourController.createGoiDichVu);
router.put('/tour/:tourId/goi-dich-vu/:maGoi', TourController.updateGoiDichVu);
router.delete('/tour/:tourId/goi-dich-vu/:maGoi', TourController.removeGoiDichVu);
router.get('/tour/:tourId/muc-dich-vu', TourController.getTourMucDichVu);
router.post('/tour/:tourId/muc-dich-vu', TourController.createTourMucDichVu);
router.put('/tour/:tourId/muc-dich-vu/:maMuc', TourController.updateTourMucDichVu);
router.delete('/tour/:tourId/muc-dich-vu/:maMuc', TourController.removeTourMucDichVu);
router.get('/tour/:tourId/lich-trinh', TourController.getLichTrinh);
router.post('/tour/:tourId/lich-trinh', TourController.createLichTrinh);
router.put('/tour/:tourId/lich-trinh/:maLichTrinh', TourController.updateLichTrinh);
router.delete('/tour/:tourId/lich-trinh/:maLichTrinh', TourController.removeLichTrinh);
router.get('/tour/:tourId/lich-khoi-hanh', TourController.getLichKhoiHanh);
router.post('/tour/:tourId/lich-khoi-hanh', TourController.createLichKhoiHanh);
router.put('/tour/:tourId/lich-khoi-hanh/:maLichKhoiHanh', TourController.updateLichKhoiHanh);
router.delete('/tour/:tourId/lich-khoi-hanh/:maLichKhoiHanh', TourController.removeLichKhoiHanh);
router.get('/tour/:tourId/review-hien-thi', TourController.getReviewHienThi);
router.post('/tour/:tourId/review-hien-thi', TourController.createReviewHienThi);
router.put('/tour/:tourId/review-hien-thi/:maReviewHienThi', TourController.updateReviewHienThi);
router.delete('/tour/:tourId/review-hien-thi/:maReviewHienThi', TourController.removeReviewHienThi);

// ==========================================
// 6. KHÁCH SẠN + LOẠI PHÒNG
// ==========================================
router.get('/khach-san', KhachSanController.adminGetAll);
router.get('/khach-san/:id', KhachSanController.getById);
router.post('/khach-san', KhachSanController.adminCreate);
router.put('/khach-san/:id', KhachSanController.adminUpdate);
router.delete('/khach-san/:id', KhachSanController.adminRemove);
// Loại phòng
router.get('/khach-san/:id/loai-phong', KhachSanController.getLoaiPhong);
router.post('/khach-san/:id/loai-phong', KhachSanController.createLoaiPhong);
router.put('/khach-san/:id/loai-phong/:phongId', KhachSanController.updateLoaiPhong);
router.delete('/khach-san/:id/loai-phong/:phongId', KhachSanController.removeLoaiPhong);
router.get('/khach-san/:id/tien-ich', KhachSanController.getKhachSanTienIch);
router.put('/khach-san/:id/tien-ich', KhachSanController.updateKhachSanTienIch);
router.get('/khach-san/:id/faq', KhachSanController.getKhachSanFAQ);
router.post('/khach-san/:id/faq', KhachSanController.createKhachSanFAQ);
router.put('/khach-san/:id/faq/:faqId', KhachSanController.updateKhachSanFAQ);
router.delete('/khach-san/:id/faq/:faqId', KhachSanController.removeKhachSanFAQ);
router.get('/khach-san/:id/loai-phong/:phongId/tien-ich', KhachSanController.getLoaiPhongTienIch);
router.put('/khach-san/:id/loai-phong/:phongId/tien-ich', KhachSanController.updateLoaiPhongTienIch);

// ==========================================
// 7. VÉ (Máy bay, Tàu hỏa, Vui chơi)
// ==========================================
router.get('/ve', VeController.adminGetAll);
router.get('/ve/:id', VeController.getById);
router.post('/ve/may-bay', VeController.adminCreateMayBay);
router.post('/ve/tau-hoa', VeController.adminCreateTauHoa);
router.post('/ve/vui-choi', VeController.adminCreateVuiChoi);
router.put('/ve/:id', VeController.adminUpdate);
router.patch('/ve/:id/status', VeController.adminUpdateStatus);
router.delete('/ve/:id', VeController.adminRemove);
// Giá vé
router.get('/ve/:id/gia', VeController.getGiaVe);
router.post('/ve/:id/gia', VeController.adminUpsertGiaVe);
router.delete('/ve/:id/gia/:giaVeId', VeController.adminRemoveGiaVe);
// Tiện ích
router.get('/ve/:id/tien-ich', VeController.getVeTienIch);
router.put('/ve/:id/tien-ich', VeController.updateVeTienIch);
// Khoang tàu và ghế (chỉ cho vé tàu)
router.get('/ve/:id/khoang', VeController.getVeTauKhoang);
router.post('/ve/:id/khoang', VeController.createVeTauKhoang);
router.put('/ve/:id/khoang/:khoangId', VeController.updateVeTauKhoang);
router.delete('/ve/:id/khoang/:khoangId', VeController.removeVeTauKhoang);
router.get('/ve/:id/khoang/:khoangId/ghe', VeController.getVeTauGhe);
router.post('/ve/:id/khoang/:khoangId/ghe', VeController.createVeTauGhe);
router.put('/ve/:id/khoang/:khoangId/ghe/:gheId', VeController.updateVeTauGhe);
router.delete('/ve/:id/khoang/:khoangId/ghe/:gheId', VeController.removeVeTauGhe);
// Loại vé
router.get('/loai-ve', LoaiVeController.getAllLoaiVe);
router.post('/loai-ve', LoaiVeController.adminCreateLoaiVe);
router.put('/loai-ve/:id', LoaiVeController.adminUpdateLoaiVe);
router.delete('/loai-ve/:id', LoaiVeController.adminRemoveLoaiVe);

// ==========================================
// 8. KHUYẾN MÃI
// ==========================================
router.get('/khuyen-mai', KhuyenMaiController.adminGetAll);
router.get('/khuyen-mai/:id', KhuyenMaiController.getById);
router.post('/khuyen-mai', KhuyenMaiController.adminCreate);
router.put('/khuyen-mai/:id', KhuyenMaiController.adminUpdate);
router.patch('/khuyen-mai/:id/status', KhuyenMaiController.adminUpdateStatus);
router.delete('/khuyen-mai/:id', KhuyenMaiController.adminRemove);

// ==========================================
// 9. ĐƠN ĐẶT
// ==========================================
router.get('/don-dat', DonDatController.adminGetAll);
router.get('/don-dat/:id', DonDatController.adminGetById);
router.patch('/don-dat/:id/trang-thai', DonDatController.adminUpdateStatus);

// ==========================================
// 10. THANH TOÁN
// ==========================================
router.get('/thanh-toan', ThanhToanController.adminGetAll);
router.get('/don-dat/:donId/thanh-toan', ThanhToanController.adminGetByDon);
router.patch('/thanh-toan/:id/hoan-tien', ThanhToanController.adminRefund);

// ==========================================
// 11. ĐÁNH GIÁ
// ==========================================
router.get('/danh-gia', DanhGiaController.adminGetAll);
router.delete('/danh-gia/:id', DanhGiaController.adminRemove);

module.exports = router;
