const jwt = require('jsonwebtoken');

/**
 * Middleware xác thực cho người dùng đã đăng nhập (ADMIN hoặc CUSTOMER)
 */
const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                data: null,
                message: 'Không tìm thấy Access Token. Vui lòng đăng nhập!'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'travel_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                data: null,
                message: 'Token đã hết hạn. Vui lòng đăng nhập lại!'
            });
        }
        return res.status(401).json({
            status: 'error',
            data: null,
            message: 'Token không hợp lệ!'
        });
    }
};

/**
 * Middleware chỉ cho phép ADMIN
 */
const requireAdmin = (req, res, next) => {
    requireAuth(req, res, () => {
        if (req.user.vaiTro !== 'ADMIN') {
            return res.status(403).json({
                status: 'error',
                data: null,
                message: 'Từ chối truy cập! Yêu cầu quyền Quản trị viên (ADMIN).'
            });
        }
        next();
    });
};

module.exports = { requireAuth, requireAdmin };
