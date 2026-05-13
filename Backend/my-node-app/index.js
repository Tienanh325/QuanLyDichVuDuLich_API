const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { connectDB } = require('./config/db');

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
        ];
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    credentials: true
}));
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// ROUTES
// ==========================================

// Auth (Đăng ký, Đăng nhập)
app.use('/api/auth', require('./routes/auth.routes'));

// Admin (Bảo vệ bằng JWT + role ADMIN)
app.use('/api/admin', require('./routes/admin.routes'));

// Customer & Public (Public không cần token, /toi/* cần token)
app.use('/api', require('./routes/customer.routes'));

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Travel API đang chạy!',
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// 404 HANDLER
// ==========================================
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        data: null,
        message: `Không tìm thấy route: ${req.method} ${req.originalUrl}`
    });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
    console.error('❌ Unhandled Error:', err);
    res.status(err.status || 500).json({
        status: 'error',
        data: null,
        message: err.message || 'Lỗi server không xác định!'
    });
});

// ==========================================
// KHỞI ĐỘNG SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
        });
    } catch (err) {
        process.exitCode = 1;
        console.error('❌ Server không khởi động do lỗi DB');
    }
};

startServer();
