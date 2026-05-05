const { pool } = require('../config/db');

class TourModel {
    static async getAll({ page = 1, limit = 10, sortBy, search, viTri } = {}) {
        const offset = (page - 1) * limit;
        const queryParams = [];
        let baseQuery = `
            FROM Tour t
            LEFT JOIN DichVu dv ON t.maDichVu = dv.maDichVu
            LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
            LEFT JOIN HinhAnh ha ON dv.maDichVu = ha.maDichVu AND ha.isAvatar = 1
            WHERE dv.trangThai = 1
        `;
        if (viTri) { baseQuery += ` AND t.viTri LIKE ?`; queryParams.push(`%${viTri}%`); }
        if (search) {
            baseQuery += ` AND (dv.ten LIKE ? OR t.viTri LIKE ?)`;
            const s = `%${search}%`; queryParams.push(s, s);
        }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        const allowedSort = { giaTour: 't.giaTour', ngayBatDau: 't.ngayBatDau', maTour: 't.maTour' };
        let dataQuery = `SELECT t.*, dv.ten, dv.moTa, dv.loaiDichVu, ncc.ten AS tenNhaCungCap, ha.urlAnh AS avatar ${baseQuery}`;
        if (sortBy) {
            const isDesc = sortBy.startsWith('-');
            const col = isDesc ? sortBy.substring(1) : sortBy;
            dataQuery += ` ORDER BY ${allowedSort[col] || 't.maTour'} ${isDesc ? 'DESC' : 'ASC'}`;
        } else { dataQuery += ` ORDER BY t.ngayBatDau ASC`; }
        dataQuery += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.query(dataQuery, queryParams);
        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: parseInt(page) };
    }

    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT t.*, dv.ten, dv.moTa, dv.trangThai, ncc.ten AS tenNhaCungCap
             FROM Tour t
             LEFT JOIN DichVu dv ON t.maDichVu = dv.maDichVu
             LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
             WHERE t.maTour = ?`,
            [id]
        );
        if (!rows[0]) return null;
        const [images] = await pool.query(`SELECT * FROM HinhAnh WHERE maDichVu = ? ORDER BY isAvatar DESC`, [rows[0].maDichVu]);
        const [rating] = await pool.query(
            `SELECT AVG(soSao) AS diemTrungBinh, COUNT(*) AS soLuongDanhGia FROM DanhGia WHERE maDichVu = ?`,
            [rows[0].maDichVu]
        );
        return { ...rows[0], hinhAnh: images, danhGia: rating[0] };
    }

    static async create(data) {
        const { maDichVu, viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach } = data;
        const [result] = await pool.query(
            `INSERT INTO Tour (maDichVu, viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach) VALUES (?, ?, ?, ?, ?, ?)`,
            [maDichVu, viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach]
        );
        return { maTour: result.insertId, ...data };
    }

    static async update(id, data) {
        const { viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach } = data;
        const [result] = await pool.query(
            `UPDATE Tour SET viTri=?, thoiGian=?, giaTour=?, ngayBatDau=?, soLuongKhach=? WHERE maTour=?`,
            [viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach, id]
        );
        return result.affectedRows > 0;
    }

    static async updateSoLuong(id, delta) {
        const [result] = await pool.query(
            `UPDATE Tour SET soLuongKhach = soLuongKhach + ? WHERE maTour = ? AND soLuongKhach + ? >= 0`,
            [delta, id, delta]
        );
        return result.affectedRows > 0;
    }

    static async remove(id) {
        const [result] = await pool.query(`DELETE FROM Tour WHERE maTour = ?`, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = TourModel;
