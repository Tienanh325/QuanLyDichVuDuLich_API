const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    // === ĐĂNG KÝ ===
    static async register(userData) {
        const { username, password, ten, email, sdt } = userData;

        // 1. Kiểm tra username hoặc email đã tồn tại chưa
        const [existingUsers] = await pool.query(
            `SELECT * FROM Users WHERE username = ? OR email = ?`,
            [username, email]
        );

        if (existingUsers.length > 0) {
            const isUsernameExist = existingUsers.some(u => u.username === username);
            if (isUsernameExist) {
                throw new Error('Tên đăng nhập đã tồn tại!');
            } else {
                throw new Error('Email đã được sử dụng!');
            }
        }

        // 2. Hash mật khẩu (Sử dụng bcrypt)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Lưu vào Database
        const [result] = await pool.query(
            `INSERT INTO Users (username, password, ten, email, sdt, vaiTro, trangThai) 
             VALUES (?, ?, ?, ?, ?, 'CUSTOMER', true)`,
            [username, hashedPassword, ten, email, sdt]
        );

        // 4. Trả về thông tin user (Không trả về mật khẩu)
        return {
            maUser: result.insertId,
            username,
            ten,
            email,
            sdt,
            vaiTro: 'CUSTOMER'
        };
    }

    // === ĐĂNG NHẬP ===
    static async login(username, password) {
        // 1. Tìm user theo username
        const [users] = await pool.query(
            `SELECT * FROM Users WHERE username = ?`,
            [username]
        );

        const user = users[0];
        if (!user) {
            throw new Error('Tên đăng nhập không tồn tại!');
        }

        if (!user.trangThai) {
            throw new Error('Tài khoản của bạn đã bị khóa!');
        }

        // 2. So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Mật khẩu không chính xác!');
        }

        // 3. Tạo JWT Token
        // Cần đảm bảo có JWT_SECRET trong file .env
        const payload = {
            maUser: user.maUser,
            username: user.username,
            vaiTro: user.vaiTro
        };
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'travel_secret_key', 
            { expiresIn: '1d' } // Token sống 1 ngày
        );

        // 4. Trả về dữ liệu
        return {
            token,
            user: {
                maUser: user.maUser,
                username: user.username,
                ten: user.ten,
                email: user.email,
                sdt: user.sdt,
                vaiTro: user.vaiTro
            }
        };
    }
}

module.exports = AuthService;
