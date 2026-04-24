const jwt = require('jsonwebtoken');

const requireAdminAuth = (req, res, next) => {
    try {
        // 1. Lấy token từ header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                data: null,
                message: 'Không tìm thấy Access Token. Vui lòng đăng nhập!'
            });
        }

        const token = authHeader.split(' ')[1];

        // 2. Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'travel_secret_key');

        // 3. Kiểm tra quyền ADMIN
        if (decoded.vaiTro !== 'ADMIN') {
            return res.status(403).json({
                status: 'error',
                data: null,
                message: 'Từ chối truy cập! Yêu cầu quyền Quản trị viên (ADMIN).'
            });
        }

        // 4. Lưu thông tin user vào request để dùng sau nếu cần
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

module.exports = { requireAdminAuth };
