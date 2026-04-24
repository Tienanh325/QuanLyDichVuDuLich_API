const mysql = require('mysql2/promise');
require('dotenv').config(); // Đảm bảo đã load biến môi trường

// Khởi tạo Connection Pool thay vì một Connection duy nhất
// Pool giúp quản lý nhiều connection cùng lúc, tái sử dụng chúng để tăng hiệu suất.
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'Travel',
    port: process.env.DB_PORT || 3306,
    
    // Các cấu hình quan trọng cho Môi trường Production
    waitForConnections: true, // Nếu pool đã đạt giới hạn, các query mới sẽ phải đợi (queue) thay vì throw error
    connectionLimit: process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT) : 10, // Số lượng connection tối đa trong pool. Nên tuỳ chỉnh theo CPU / RAM server
    queueLimit: 0, // 0 = Không giới hạn số lượng query trong hàng đợi
    
    // Cấu hình Keep Alive giúp tự động kết nối lại khi rớt mạng hoặc MySQL ngắt connection sau thời gian dài
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000 // Gửi ping sau 10 giây rảnh rỗi để giữ connection sống
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
        
        // Xử lý các mã lỗi phổ biến để dễ debug
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('⚠️ Kết nối tới Database đã bị đóng. Pool sẽ tự động kết nối lại khi có truy vấn mới.');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('⚠️ Database có quá nhiều kết nối (quá tải). Cần kiểm tra lại connectionLimit.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('⚠️ Kết nối bị từ chối. Hãy chắc chắn MySQL server đang chạy.');
        }
        
        // Throw lỗi nếu bạn muốn dừng ứng dụng khi không thể kết nối DB lúc khởi động
        // throw err; 
    }
};

module.exports = { pool, connectDB };
