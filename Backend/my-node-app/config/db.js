const mysql = require('mysql2/promise');
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'Travel',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true, 
    connectionLimit: process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT) : 10,
    queueLimit: 0, 
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000 
});

// Hàm kiểm tra kết nối khi khởi động server
const connectDB = async () => {
    try {
        // Lấy thử 1 connection từ pool để test
        const connection = await pool.getConnection();
        console.log('✅ Kết nối tới MySQL thành công (Connection Pool)!');
        connection.release(); // Trả connection lại cho pool ngay sau khi test
    } catch (err) {
        console.error('❌ Lỗi kết nối CSDL MySQL:', err.message);
        
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('⚠️ Kết nối tới Database đã bị đóng. Pool sẽ tự động kết nối lại khi có truy vấn mới.');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('⚠️ Database có quá nhiều kết nối (quá tải). Cần kiểm tra lại connectionLimit.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('⚠️ Kết nối bị từ chối. Hãy chắc chắn MySQL server đang chạy.');
        }
    }
};

module.exports = { pool, connectDB };
