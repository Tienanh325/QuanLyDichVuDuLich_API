const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
    /**
     * Lấy danh sách người dùng (phân trang, lọc, sắp xếp) - dành cho Admin
     */
    static async getAll(page = 1, limit = 10, sortBy, status, search, vaiTro) {
        const offset = (page - 1) * limit;
        const queryParams = [];

        let baseQuery = `FROM Users WHERE 1=1`;

        if (status !== undefined && status !== '') {
            const statusValue = (status === 'true' || status === '1' || status === true) ? 1 : 0;
            baseQuery += ` AND trangThai = ?`;
            queryParams.push(statusValue);
        }

        if (vaiTro && ['ADMIN', 'CUSTOMER'].includes(vaiTro.toUpperCase())) {
            baseQuery += ` AND vaiTro = ?`;
            queryParams.push(vaiTro.toUpperCase());
        }

        if (search) {
            baseQuery += ` AND (username LIKE ? OR ten LIKE ? OR email LIKE ? OR sdt LIKE ?)`;
            const searchVal = `%${search}%`;
            queryParams.push(searchVal, searchVal, searchVal, searchVal);
        }

        const [countResult] = await pool.query(
            `SELECT COUNT(*) as total ${baseQuery}`,
            queryParams
        );
        const totalRecords = countResult[0].total;

        let dataQuery = `SELECT maUser, username, ten, email, sdt, vaiTro, trangThai ${baseQuery}`;

        const allowedSortCols = ['maUser', 'username', 'ten', 'email', 'vaiTro'];
        if (sortBy) {
            const isDesc = sortBy.startsWith('-');
            const colName = isDesc ? sortBy.substring(1) : sortBy;
            if (allowedSortCols.includes(colName)) {
                dataQuery += ` ORDER BY ${colName} ${isDesc ? 'DESC' : 'ASC'}`;
            } else {
                dataQuery += ` ORDER BY maUser DESC`;
            }
        } else {
            dataQuery += ` ORDER BY maUser DESC`;
        }

        dataQuery += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.query(dataQuery, queryParams);

        return {
            data: rows,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: parseInt(page)
        };
    }

    /**
     * Lấy thông tin 1 người dùng theo ID (không trả về password)
     */
    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT maUser, username, ten, email, sdt, gioiTinh, ngaySinh, thanhPho, vaiTro, trangThai FROM Users WHERE maUser = ?`,
            [id]
        );
        return rows[0] || null;
    }

    /**
     * Lấy thống kê của 1 user (đơn đặt, tổng chi)
     */
    static async getByIdWithStats(id) {
        const user = await this.getById(id);
        if (!user) return null;

        const [stats] = await pool.query(
            `SELECT 
                COUNT(*) as tongDon,
                SUM(CASE WHEN trangThai = 'PAID' THEN tongGia ELSE 0 END) as tongChiTieu
             FROM DonDat WHERE maUser = ?`,
            [id]
        );

        return {
            ...user,
            tongDon: stats[0].tongDon || 0,
            tongChiTieu: stats[0].tongChiTieu || 0
        };
    }

    /**
     * Cập nhật thông tin cá nhân
     */
    static async update(id, data) {
        const { ten, email, sdt, gioiTinh, ngaySinh, thanhPho } = data;
        const [result] = await pool.query(
            `UPDATE Users SET ten = ?, email = ?, sdt = ?, gioiTinh = ?, ngaySinh = ?, thanhPho = ? WHERE maUser = ?`,
            [ten, email, sdt, gioiTinh, ngaySinh, thanhPho, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Admin cập nhật vai trò
     */
    static async updateRole(id, vaiTro) {
        if (!['ADMIN', 'CUSTOMER'].includes(vaiTro)) {
            throw new Error('Vai trò không hợp lệ! Chỉ chấp nhận ADMIN hoặc CUSTOMER.');
        }
        const [result] = await pool.query(
            `UPDATE Users SET vaiTro = ? WHERE maUser = ?`,
            [vaiTro, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Khóa/Mở khóa tài khoản
     */
    static async updateStatus(id, status) {
        const statusValue = (status === 'true' || status === true || status === '1') ? 1 : 0;
        const [result] = await pool.query(
            `UPDATE Users SET trangThai = ? WHERE maUser = ?`,
            [statusValue, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Đổi mật khẩu
     */
    static async changePassword(id, oldPassword, newPassword) {
        const [rows] = await pool.query(`SELECT password FROM Users WHERE maUser = ?`, [id]);
        if (!rows[0]) throw new Error('Người dùng không tồn tại!');

        const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
        if (!isMatch) throw new Error('Mật khẩu cũ không chính xác!');

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);

        await pool.query(`UPDATE Users SET password = ? WHERE maUser = ?`, [hashed, id]);
        return true;
    }

    /**
     * Admin đặt lại mật khẩu cho user
     */
    static async resetPassword(id, newPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        const [result] = await pool.query(
            `UPDATE Users SET password = ? WHERE maUser = ?`,
            [hashed, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Admin xóa user
     */
    static async remove(id) {
        const [result] = await pool.query(`DELETE FROM Users WHERE maUser = ?`, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = UserModel;
