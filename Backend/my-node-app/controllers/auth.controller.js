const AuthService = require('../services/auth.service');

class AuthController {
    // === ĐĂNG KÝ ===
    static async register(req, res) {
        try {
            const { username, password, ten, email, sdt } = req.body;

            // Validate dữ liệu cơ bản
            if (!username || !password || !ten) {
                return res.status(400).json({
                    status: 'error',
                    data: null,
                    message: 'Vui lòng cung cấp đầy đủ: username, password, ten.'
                });
            }

            const newUser = await AuthService.register({ username, password, ten, email, sdt });

            return res.status(201).json({
                status: 'success',
                data: newUser,
                message: 'Đăng ký tài khoản thành công!'
            });

        } catch (error) {
            return res.status(400).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi đăng ký.'
            });
        }
    }

    // === ĐĂNG NHẬP ===
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    status: 'error',
                    data: null,
                    message: 'Vui lòng nhập đầy đủ username và password.'
                });
            }

            const authData = await AuthService.login(username, password);

            return res.status(200).json({
                status: 'success',
                data: authData,
                message: 'Đăng nhập thành công!'
            });

        } catch (error) {
            // Lỗi mật khẩu sai, tài khoản không tồn tại, v.v.
            return res.status(401).json({
                status: 'error',
                data: null,
                message: error.message || 'Lỗi server khi đăng nhập.'
            });
        }
    }
}

module.exports = AuthController;
