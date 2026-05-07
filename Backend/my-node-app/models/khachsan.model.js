const { pool } = require('../config/db');

class KhachSanModel {
    static async getAll({ page = 1, limit = 10, search, viTri } = {}) {
        const offset = (page - 1) * limit;
        const whereParams = [];
        let whereClause = `WHERE dv.trangThai = 1`;

        if (viTri) { whereClause += ` AND ks.viTri LIKE ?`; whereParams.push(`%${viTri}%`); }
        if (search) {
            whereClause += ` AND (dv.ten LIKE ? OR ks.viTri LIKE ? OR ks.tenkhachsan LIKE ?)`;
            const s = `%${search}%`; whereParams.push(s, s, s);
        }

        const [[{ total }]] = await pool.query(
            `SELECT COUNT(*) as total
             FROM KhachSan ks
             LEFT JOIN DichVu dv ON ks.maDichVu = dv.maDichVu
             LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
             LEFT JOIN HinhAnh ha ON dv.maDichVu = ha.maDichVu AND ha.isAvatar = 1
             ${whereClause}`,
            whereParams
        );
        const totalRecords = total;

        const dataParams = [...whereParams, parseInt(limit), parseInt(offset)];
        const [rows] = await pool.query(
            `SELECT ks.maKhachSan, ks.maDichVu, ks.viTri,
                    COALESCE(ks.tenkhachsan, dv.ten) AS ten,
                    COALESCE(ks.tenkhachsan, dv.ten) AS tenKhachSan,
                    dv.ten AS tenDichVu, dv.moTa,
                    ncc.ten AS tenNhaCungCap,
                    ha.urlAnh AS avatar,
                    MIN(lp.giaPhong) AS giaTuKhoang
             FROM KhachSan ks
             LEFT JOIN DichVu dv ON ks.maDichVu = dv.maDichVu
             LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
             LEFT JOIN HinhAnh ha ON dv.maDichVu = ha.maDichVu AND ha.isAvatar = 1
             LEFT JOIN LoaiPhong lp ON ks.maKhachSan = lp.maKhachSan AND lp.soLuongPhongTrong > 0
             ${whereClause}
             GROUP BY ks.maKhachSan, ks.maDichVu, ks.viTri, ks.tenkhachsan, dv.ten, dv.moTa, ncc.ten, ha.urlAnh
             ORDER BY ks.maKhachSan DESC
             LIMIT ? OFFSET ?`,
            dataParams
        );

        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: parseInt(page) };
    }

    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT ks.*, COALESCE(ks.tenkhachsan, dv.ten) AS ten,
                    COALESCE(ks.tenkhachsan, dv.ten) AS tenKhachSan,
                    dv.ten AS tenDichVu, dv.moTa, dv.trangThai, ncc.ten AS tenNhaCungCap
             FROM KhachSan ks
             LEFT JOIN DichVu dv ON ks.maDichVu = dv.maDichVu
             LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
             WHERE ks.maKhachSan = ?`,
            [id]
        );
        if (!rows[0]) return null;

        const [loaiPhong] = await pool.query(`SELECT * FROM LoaiPhong WHERE maKhachSan = ? ORDER BY giaPhong ASC`, [id]);
        const [images] = await pool.query(`SELECT * FROM HinhAnh WHERE maDichVu = ? ORDER BY isAvatar DESC`, [rows[0].maDichVu]);
        const [rating] = await pool.query(
            `SELECT AVG(soSao) AS diemTrungBinh, COUNT(*) AS soLuongDanhGia FROM DanhGia WHERE maDichVu = ?`,
            [rows[0].maDichVu]
        );
        return { ...rows[0], loaiPhong, hinhAnh: images, danhGia: rating[0] };
    }

    static async create(data) {
        const { maDichVu, viTri, ten } = data;
        const [result] = await pool.query(
            `INSERT INTO KhachSan (maDichVu, viTri, tenkhachsan) VALUES (?, ?, ?)`,
            [maDichVu, viTri, ten]
        );
        return { maKhachSan: result.insertId, ...data };
    }

    static async update(id, data) {
        const { viTri, ten } = data;
        const [result] = await pool.query(`UPDATE KhachSan SET viTri=?, tenkhachsan=? WHERE maKhachSan=?`, [viTri, ten, id]);
        return result.affectedRows > 0;
    }

    static async remove(id) {
        const [result] = await pool.query(`DELETE FROM KhachSan WHERE maKhachSan = ?`, [id]);
        return result.affectedRows > 0;
    }

    // ====== LOẠI PHÒNG ======
    static async getLoaiPhong(maKhachSan) {
        const [rows] = await pool.query(`SELECT * FROM LoaiPhong WHERE maKhachSan = ? ORDER BY giaPhong ASC`, [maKhachSan]);
        return rows;
    }

    static async createLoaiPhong(data) {
        const { maKhachSan, tenLoaiPhong, giaPhong, sucChua, soLuongPhongTrong } = data;
        const [result] = await pool.query(
            `INSERT INTO LoaiPhong (maKhachSan, tenLoaiPhong, giaPhong, sucChua, soLuongPhongTrong) VALUES (?, ?, ?, ?, ?)`,
            [maKhachSan, tenLoaiPhong, giaPhong, sucChua, soLuongPhongTrong || 0]
        );
        return { maLoaiPhong: result.insertId, ...data };
    }

    static async updateLoaiPhong(maLoaiPhong, data) {
        const { tenLoaiPhong, giaPhong, sucChua, soLuongPhongTrong } = data;
        const [result] = await pool.query(
            `UPDATE LoaiPhong SET tenLoaiPhong=?, giaPhong=?, sucChua=?, soLuongPhongTrong=? WHERE maLoaiPhong=?`,
            [tenLoaiPhong, giaPhong, sucChua, soLuongPhongTrong, maLoaiPhong]
        );
        return result.affectedRows > 0;
    }

    static async updateSoPhongTrong(maLoaiPhong, delta) {
        const [result] = await pool.query(
            `UPDATE LoaiPhong SET soLuongPhongTrong = soLuongPhongTrong + ? WHERE maLoaiPhong = ? AND soLuongPhongTrong + ? >= 0`,
            [delta, maLoaiPhong, delta]
        );
        return result.affectedRows > 0;
    }

    static async removeLoaiPhong(maLoaiPhong) {
        const [result] = await pool.query(`DELETE FROM LoaiPhong WHERE maLoaiPhong = ?`, [maLoaiPhong]);
        return result.affectedRows > 0;
    }
}

module.exports = KhachSanModel;
