const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../middleware/adminAuth');

const DashboardController = require('../controllers/dashboard.controller');
const NhaCungCapController = require('../controllers/nhacungcap.controller');

// ==========================================
// MIDDLEWARE BẢO VỆ TOÀN BỘ ROUTE ADMIN
// ==========================================
router.use(requireAdminAuth);

// ==========================================
// 1. DASHBOARD ANALYTICS (THỐNG KÊ)
// ==========================================
router.get('/thong-ke', DashboardController.getOverviewAnalytics);

// ==========================================
// 2. MODULE NHÀ CUNG CẤP (CRUD)
// ==========================================
// Lấy danh sách (có phân trang, sắp xếp, lọc)
router.get('/nha-cung-cap', NhaCungCapController.getAll);

// Lấy chi tiết 1 nhà cung cấp (kèm doanh thu, số lượng dịch vụ)
router.get('/nha-cung-cap/:id', NhaCungCapController.getById);

// Thêm mới nhà cung cấp
router.post('/nha-cung-cap', NhaCungCapController.create);

// Cập nhật thông tin cơ bản
router.put('/nha-cung-cap/:id', NhaCungCapController.update);

// Cập nhật trạng thái (Bật/tắt)
router.patch('/nha-cung-cap/:id/status', NhaCungCapController.updateStatus);

// Xóa nhà cung cấp
router.delete('/nha-cung-cap/:id', NhaCungCapController.remove);

module.exports = router;
