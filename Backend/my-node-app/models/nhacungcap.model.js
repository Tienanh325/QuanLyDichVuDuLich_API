const { pool } = require('../config/db');

class NhaCungCapModel {
    static async getAll(page, limit, sortBy, status) {
        const offset = (page - 1) * limit;
        const queryParams = [];
        
        let baseQuery = `FROM NhaCungCap WHERE 1=1`;
        
        if (status !== undefined && status !== '') {
            baseQuery += ` AND trangThai = ?`;
            // status truyền vào thường là string 'true' / 'false' từ query params, cần map sang boolean
            const statusValue = (status === 'true' || status === '1' || status === true) ? 1 : 0;
            queryParams.push(statusValue);
        }

        // 1. Đếm tổng số bản ghi
        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        // 2. Lấy dữ liệu phân trang
        let dataQuery = `SELECT * ${baseQuery}`;
        
        // Sorting an toàn (chống SQL Injection bằng cách validate cột)
        const allowedSortCols = ['maNhaCungCap', 'ten', 'loai'];
        if (sortBy) {
            // VD: sortBy=-ten (desc), sortBy=ten (asc)
            const isDesc = sortBy.startsWith('-');
            const colName = isDesc ? sortBy.substring(1) : sortBy;
            
            if (allowedSortCols.includes(colName)) {
                dataQuery += ` ORDER BY ${colName} ${isDesc ? 'DESC' : 'ASC'}`;
            } else {
                dataQuery += ` ORDER BY maNhaCungCap DESC`; // Default
            }
        } else {
            dataQuery += ` ORDER BY maNhaCungCap DESC`; // Default
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

    static async getById(id) {
        // 1. Lấy thông tin cơ bản
        const [rows] = await pool.query(`SELECT * FROM NhaCungCap WHERE maNhaCungCap = ?`, [id]);
        const supplier = rows[0];

        if (!supplier) return null;

        // 2. Đếm số lượng dịch vụ
        const [serviceCount] = await pool.query(`SELECT COUNT(*) as totalServices FROM DichVu WHERE maNhaCungCap = ?`, [id]);
        
        // 3. Tính tổng doanh thu (Chỉ tính các đơn hàng đã thanh toán)
        const [revenue] = await pool.query(
            `SELECT SUM(c.soLuong * c.giaTaiThoiDiemMua) as totalRevenue 
             FROM ChiTietDon c
             JOIN DichVu d ON c.maDichVu = d.maDichVu
             JOIN DonDat o ON c.maDon = o.maDon
             JOIN ThanhToan t ON o.maDon = t.maDon
             WHERE d.maNhaCungCap = ? AND t.trangThai = 'PAID'`, 
            [id]
        );

        return {
            ...supplier,
            totalServices: serviceCount[0].totalServices || 0,
            totalRevenue: revenue[0].totalRevenue || 0
        };
    }

    static async create(data) {
        const { ten, email, sdt, diaChi, loai } = data;
        const [result] = await pool.query(
            `INSERT INTO NhaCungCap (ten, email, sdt, diaChi, loai, trangThai) VALUES (?, ?, ?, ?, ?, true)`,
            [ten, email, sdt, diaChi, loai]
        );
        return { maNhaCungCap: result.insertId, ...data, trangThai: true };
    }

    static async update(id, data) {
        const { ten, email, sdt, diaChi, loai } = data;
        const [result] = await pool.query(
            `UPDATE NhaCungCap SET ten = ?, email = ?, sdt = ?, diaChi = ?, loai = ? WHERE maNhaCungCap = ?`,
            [ten, email, sdt, diaChi, loai, id]
        );
        return result.affectedRows > 0;
    }

    static async updateStatus(id, status) {
        const statusValue = (status === 'true' || status === true || status === '1') ? 1 : 0;
        const [result] = await pool.query(
            `UPDATE NhaCungCap SET trangThai = ? WHERE maNhaCungCap = ?`,
            [statusValue, id]
        );
        return result.affectedRows > 0;
    }

    static async remove(id) {
        // Cần đảm bảo rằng supplier không có Dịch vụ đang hoạt động nào.
        // Tuy nhiên do setup FOREIGN KEY ON DELETE SET NULL ở DB nên có thể xóa trực tiếp.
        const [result] = await pool.query(`DELETE FROM NhaCungCap WHERE maNhaCungCap = ?`, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = NhaCungCapModel;
