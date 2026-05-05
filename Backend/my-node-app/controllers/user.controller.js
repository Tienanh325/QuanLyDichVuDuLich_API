const UserModel = require('../models/user.model');

class UserController {
    // ========================= ADMIN APIs =========================

    /** Admin: Lấy danh sách tất cả người dùng */
    static async adminGetAll(req, res) {
        try {
            const { page = 1, limit = 10, sortBy, status, search, vaiTro } = req.query;
            const result = await UserModel.getAll(page, limit, sortBy, status, search, vaiTro);
            return res.status(200).json({
                status: 'success',
                data: result,
                message: 'Lấy danh sách người dùng thành công!'
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Admin: Xem chi tiết người dùng kèm thống kê */
    static async adminGetById(req, res) {
        try {
            const user = await UserModel.getByIdWithStats(req.params.id);
            if (!user) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy người dùng!' });
            return res.status(200).json({ status: 'success', data: user, message: 'Lấy thông tin người dùng thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Admin: Khóa/Mở khóa tài khoản */
    static async adminUpdateStatus(req, res) {
        try {
            const { status } = req.body;
            if (status === undefined) {
                return res.status(400).json({ status: 'error', data: null, message: 'Trạng thái (status) là bắt buộc!' });
            }
            const isUpdated = await UserModel.updateStatus(req.params.id, status);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy người dùng!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật trạng thái tài khoản thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Admin: Phân quyền vai trò */
    static async adminUpdateRole(req, res) {
        try {
            const { vaiTro } = req.body;
            if (!vaiTro) return res.status(400).json({ status: 'error', data: null, message: 'Vai trò là bắt buộc!' });
            const isUpdated = await UserModel.updateRole(req.params.id, vaiTro);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy người dùng!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Cập nhật vai trò thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Admin: Đặt lại mật khẩu cho user */
    static async adminResetPassword(req, res) {
        try {
            const { newPassword } = req.body;
            if (!newPassword || newPassword.length < 6) {
                return res.status(400).json({ status: 'error', data: null, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
            }
            const isUpdated = await UserModel.resetPassword(req.params.id, newPassword);
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy người dùng!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đặt lại mật khẩu thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Admin: Xóa người dùng */
    static async adminRemove(req, res) {
        try {
            const isDeleted = await UserModel.remove(req.params.id);
            if (!isDeleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy người dùng để xóa!' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa người dùng thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    // ========================= CUSTOMER APIs =========================

    /** Customer: Lấy thông tin cá nhân */
    static async getProfile(req, res) {
        try {
            const user = await UserModel.getById(req.user.maUser);
            if (!user) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy tài khoản!' });
            return res.status(200).json({ status: 'success', data: user, message: 'Lấy thông tin cá nhân thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Customer: Cập nhật thông tin cá nhân */
    static async updateProfile(req, res) {
        try {
            const { ten, email, sdt } = req.body;
            if (!ten) return res.status(400).json({ status: 'error', data: null, message: 'Tên không được để trống!' });
            const isUpdated = await UserModel.update(req.user.maUser, { ten, email, sdt });
            if (!isUpdated) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy tài khoản!' });
            return res.status(200).json({ status: 'success', data: { ten, email, sdt }, message: 'Cập nhật thông tin thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    /** Customer: Đổi mật khẩu */
    static async changePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                return res.status(400).json({ status: 'error', data: null, message: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới!' });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ status: 'error', data: null, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
            }
            await UserModel.changePassword(req.user.maUser, oldPassword, newPassword);
            return res.status(200).json({ status: 'success', data: null, message: 'Đổi mật khẩu thành công!' });
        } catch (error) {
            return res.status(400).json({ status: 'error', data: null, message: error.message });
        }
    }
}

module.exports = UserController;
