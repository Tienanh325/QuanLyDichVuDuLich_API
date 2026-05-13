const { pool } = require('../config/db');

class TourModel {
    static async getAll({ page = 1, limit = 10, sortBy, search, viTri } = {}) {
        const offset = (page - 1) * limit;
        const queryParams = [];
        let baseQuery = `
            FROM Tour t
            LEFT JOIN DichVu dv ON t.maDichVu = dv.maDichVu
            LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
            WHERE 1=1
        `;
        if (viTri) { baseQuery += ` AND t.viTri LIKE ?`; queryParams.push(`%${viTri}%`); }
        if (search) {
            baseQuery += ` AND (t.tenTour LIKE ? OR dv.ten LIKE ? OR t.viTri LIKE ?)`;
            const s = `%${search}%`; queryParams.push(s, s, s);
        }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        const allowedSort = { giaTour: 't.giaTour', ngayBatDau: 't.ngayBatDau', maTour: 't.maTour' };
        let dataQuery = `SELECT t.*, dv.ten AS tenDichVu, dv.moTa, dv.loaiDichVu, ncc.ten AS tenNhaCungCap ${baseQuery}`;
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
            `SELECT t.*, dv.ten AS tenDichVu, dv.moTa, dv.trangThai, ncc.ten AS tenNhaCungCap
             FROM Tour t
             LEFT JOIN DichVu dv ON t.maDichVu = dv.maDichVu
             LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
             WHERE t.maTour = ?`,
            [id]
        );
        if (!rows[0]) return null;
        const [rating] = await pool.query(
            `SELECT AVG(soSao) AS diemTrungBinh, COUNT(*) AS soLuongDanhGia FROM DanhGia WHERE maDichVu = ?`,
            [rows[0].maDichVu]
        );
        return { ...rows[0], hinhAnh: [], danhGia: rating[0] };
    }

    static async create(data) {
        const {
            maDichVu, maDanhMuc, tenTour, diaDiem, viTri, viTriKhoiHanh, moTaHoatDong, thoiGian,
            giaTour, giaGoc, giaKhuyenMai, ngayBatDau, soLuongKhach = 0, diemDanhGia = 0,
            soLuotDanhGia = 0, highlight, isBestSeller = 0, chinhSachHuy, xacNhanTucThi = 0
        } = data;
        const [result] = await pool.query(
            `INSERT INTO Tour (maDichVu, maDanhMuc, tenTour, diaDiem, viTri, viTriKhoiHanh, moTaHoatDong, thoiGian, giaTour, giaGoc, giaKhuyenMai, ngayBatDau, soLuongKhach, diemDanhGia, soLuotDanhGia, highlight, isBestSeller, chinhSachHuy, xacNhanTucThi)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [maDichVu, maDanhMuc || null, tenTour || null, diaDiem || null, viTri, viTriKhoiHanh || null, moTaHoatDong || null, thoiGian, giaTour, giaGoc || null, giaKhuyenMai || null, ngayBatDau || null, soLuongKhach, diemDanhGia, soLuotDanhGia, highlight || null, isBestSeller ? 1 : 0, chinhSachHuy || null, xacNhanTucThi ? 1 : 0]
        );
        return { maTour: result.insertId, ...data };
    }

    static async update(id, data) {
        const {
            maDanhMuc, tenTour, diaDiem, viTri, viTriKhoiHanh, moTaHoatDong, thoiGian,
            giaTour, giaGoc, giaKhuyenMai, ngayBatDau, soLuongKhach = 0, diemDanhGia = 0,
            soLuotDanhGia = 0, highlight, isBestSeller = 0, chinhSachHuy, xacNhanTucThi = 0
        } = data;
        const [result] = await pool.query(
            `UPDATE Tour SET maDanhMuc=?, tenTour=?, diaDiem=?, viTri=?, viTriKhoiHanh=?, moTaHoatDong=?, thoiGian=?, giaTour=?, giaGoc=?, giaKhuyenMai=?, ngayBatDau=?, soLuongKhach=?, diemDanhGia=?, soLuotDanhGia=?, highlight=?, isBestSeller=?, chinhSachHuy=?, xacNhanTucThi=? WHERE maTour=?`,
            [maDanhMuc || null, tenTour || null, diaDiem || null, viTri, viTriKhoiHanh || null, moTaHoatDong || null, thoiGian, giaTour, giaGoc || null, giaKhuyenMai || null, ngayBatDau || null, soLuongKhach, diemDanhGia, soLuotDanhGia, highlight || null, isBestSeller ? 1 : 0, chinhSachHuy || null, xacNhanTucThi ? 1 : 0, id]
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

    // =================== TOUR CHILD TABLES ===================

    // GoiDichVu
    static async getGoiDichVu(maTour) {
        const [rows] = await pool.query(`SELECT * FROM GoiDichVu WHERE maTour = ? ORDER BY thuTu ASC`, [maTour]);
        return rows;
    }
    static async createGoiDichVu(maTour, data) {
        const { tenGoi, moTaGoi, giaGoi, giaGoc, soKhachToiThieu = 1, soKhachToiDa, trangThai = 1, thuTu = 0 } = data;
        const [result] = await pool.query(
            `INSERT INTO GoiDichVu (maTour, tenGoi, moTaGoi, giaGoi, giaGoc, soKhachToiThieu, soKhachToiDa, trangThai, thuTu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [maTour, tenGoi, moTaGoi, giaGoi, giaGoc, soKhachToiThieu, soKhachToiDa, trangThai, thuTu]
        );
        return { maGoi: result.insertId, ...data };
    }
    static async updateGoiDichVu(maGoi, data) {
        const { tenGoi, moTaGoi, giaGoi, giaGoc, soKhachToiThieu, soKhachToiDa, trangThai, thuTu } = data;
        const [result] = await pool.query(
            `UPDATE GoiDichVu SET tenGoi=?, moTaGoi=?, giaGoi=?, giaGoc=?, soKhachToiThieu=?, soKhachToiDa=?, trangThai=?, thuTu=? WHERE maGoi=?`,
            [tenGoi, moTaGoi, giaGoi, giaGoc, soKhachToiThieu, soKhachToiDa, trangThai, thuTu, maGoi]
        );
        return result.affectedRows > 0;
    }
    static async removeGoiDichVu(maGoi) {
        const [result] = await pool.query(`DELETE FROM GoiDichVu WHERE maGoi = ?`, [maGoi]);
        return result.affectedRows > 0;
    }

    // TourMucDichVu
    static async getTourMucDichVu(maTour) {
        const [rows] = await pool.query(`SELECT * FROM TourMucDichVu WHERE maTour = ? ORDER BY loaiMuc, thuTu ASC`, [maTour]);
        return rows;
    }
    static async createTourMucDichVu(maTour, data) {
        const { loaiMuc, noiDung, thuTu = 0 } = data;
        const [result] = await pool.query(
            `INSERT INTO TourMucDichVu (maTour, loaiMuc, noiDung, thuTu) VALUES (?, ?, ?, ?)`,
            [maTour, loaiMuc, noiDung, thuTu]
        );
        return { maMuc: result.insertId, ...data };
    }
    static async updateTourMucDichVu(maMuc, data) {
        const { loaiMuc, noiDung, thuTu } = data;
        const [result] = await pool.query(
            `UPDATE TourMucDichVu SET loaiMuc=?, noiDung=?, thuTu=? WHERE maMuc=?`,
            [loaiMuc, noiDung, thuTu, maMuc]
        );
        return result.affectedRows > 0;
    }
    static async removeTourMucDichVu(maMuc) {
        const [result] = await pool.query(`DELETE FROM TourMucDichVu WHERE maMuc = ?`, [maMuc]);
        return result.affectedRows > 0;
    }

    // LichTrinhTour
    static async getLichTrinh(maTour) {
        const [rows] = await pool.query(`SELECT * FROM LichTrinhTour WHERE maTour = ? ORDER BY thuTu ASC`, [maTour]);
        return rows;
    }
    static async createLichTrinh(maTour, data) {
        const { thoiGian, tieuDe, chiTiet, thuTu = 0 } = data;
        const [result] = await pool.query(
            `INSERT INTO LichTrinhTour (maTour, thoiGian, tieuDe, chiTiet, thuTu) VALUES (?, ?, ?, ?, ?)`,
            [maTour, thoiGian, tieuDe, chiTiet, thuTu]
        );
        return { maLichTrinh: result.insertId, ...data };
    }
    static async updateLichTrinh(maLichTrinh, data) {
        const { thoiGian, tieuDe, chiTiet, thuTu } = data;
        const [result] = await pool.query(
            `UPDATE LichTrinhTour SET thoiGian=?, tieuDe=?, chiTiet=?, thuTu=? WHERE maLichTrinh=?`,
            [thoiGian, tieuDe, chiTiet, thuTu, maLichTrinh]
        );
        return result.affectedRows > 0;
    }
    static async removeLichTrinh(maLichTrinh) {
        const [result] = await pool.query(`DELETE FROM LichTrinhTour WHERE maLichTrinh = ?`, [maLichTrinh]);
        return result.affectedRows > 0;
    }

    // TourLichKhoiHanh
    static async getLichKhoiHanh(maTour) {
        const [rows] = await pool.query(`SELECT * FROM TourLichKhoiHanh WHERE maTour = ? ORDER BY ngayKhoiHanh ASC`, [maTour]);
        return rows;
    }
    static async createLichKhoiHanh(maTour, data) {
        const { ngayKhoiHanh, gioKhoiHanh, soChoToiDa = 0, soChoConLai = 0, trangThai = 'OPEN' } = data;
        const [result] = await pool.query(
            `INSERT INTO TourLichKhoiHanh (maTour, ngayKhoiHanh, gioKhoiHanh, soChoToiDa, soChoConLai, trangThai) VALUES (?, ?, ?, ?, ?, ?)`,
            [maTour, ngayKhoiHanh, gioKhoiHanh, soChoToiDa, soChoConLai, trangThai]
        );
        return { maLichKhoiHanh: result.insertId, ...data };
    }
    static async updateLichKhoiHanh(maLichKhoiHanh, data) {
        const { ngayKhoiHanh, gioKhoiHanh, soChoToiDa, soChoConLai, trangThai } = data;
        const [result] = await pool.query(
            `UPDATE TourLichKhoiHanh SET ngayKhoiHanh=?, gioKhoiHanh=?, soChoToiDa=?, soChoConLai=?, trangThai=? WHERE maLichKhoiHanh=?`,
            [ngayKhoiHanh, gioKhoiHanh, soChoToiDa, soChoConLai, trangThai, maLichKhoiHanh]
        );
        return result.affectedRows > 0;
    }
    static async removeLichKhoiHanh(maLichKhoiHanh) {
        const [result] = await pool.query(`DELETE FROM TourLichKhoiHanh WHERE maLichKhoiHanh = ?`, [maLichKhoiHanh]);
        return result.affectedRows > 0;
    }

    // TourReviewHienThi
    static async getReviewHienThi(maTour) {
        const [rows] = await pool.query(`SELECT * FROM TourReviewHienThi WHERE maTour = ? ORDER BY thuTu ASC`, [maTour]);
        return rows;
    }
    static async createReviewHienThi(maTour, data) {
        const { tenKhach, avatar, soSao = 5, noiDung, thuTu = 0 } = data;
        const [result] = await pool.query(
            `INSERT INTO TourReviewHienThi (maTour, tenKhach, avatar, soSao, noiDung, thuTu) VALUES (?, ?, ?, ?, ?, ?)`,
            [maTour, tenKhach, avatar, soSao, noiDung, thuTu]
        );
        return { maReviewHienThi: result.insertId, ...data };
    }
    static async updateReviewHienThi(maReviewHienThi, data) {
        const { tenKhach, avatar, soSao, noiDung, thuTu } = data;
        const [result] = await pool.query(
            `UPDATE TourReviewHienThi SET tenKhach=?, avatar=?, soSao=?, noiDung=?, thuTu=? WHERE maReviewHienThi=?`,
            [tenKhach, avatar, soSao, noiDung, thuTu, maReviewHienThi]
        );
        return result.affectedRows > 0;
    }
    static async removeReviewHienThi(maReviewHienThi) {
        const [result] = await pool.query(`DELETE FROM TourReviewHienThi WHERE maReviewHienThi = ?`, [maReviewHienThi]);
        return result.affectedRows > 0;
    }
}

module.exports = TourModel;
