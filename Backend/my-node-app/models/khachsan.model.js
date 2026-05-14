const { pool } = require('../config/db');

class KhachSanModel {
    static async getAll({ page = 1, limit = 10, search, viTri, minPrice, maxPrice, soSao } = {}) {
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
        const offset = (pageNum - 1) * limitNum;
        const whereParams = [];
        let whereClause = `WHERE dv.trangThai = 1`;

        if (viTri) {
            whereClause += ` AND ks.viTri LIKE ?`;
            whereParams.push(`%${viTri}%`);
        }
        if (search) {
            whereClause += ` AND (dv.ten LIKE ? OR ks.viTri LIKE ? OR ks.tenkhachsan LIKE ?)`;
            const s = `%${search}%`;
            whereParams.push(s, s, s);
        }
        if (soSao) {
            const stars = String(soSao).split(',').map((item) => parseInt(item, 10)).filter((item) => item >= 1 && item <= 5);
            if (stars.length) {
                whereClause += ` AND ks.soSao IN (${stars.map(() => '?').join(',')})`;
                whereParams.push(...stars);
            }
        }
        if (minPrice || maxPrice) {
            whereClause += ` AND EXISTS (SELECT 1 FROM LoaiPhong lp WHERE lp.maKhachSan = ks.maKhachSan AND lp.soLuongPhongTrong > 0`;
            if (minPrice) {
                whereClause += ` AND lp.giaPhong >= ?`;
                whereParams.push(Number(minPrice));
            }
            if (maxPrice) {
                whereClause += ` AND lp.giaPhong <= ?`;
                whereParams.push(Number(maxPrice));
            }
            whereClause += `)`;
        }

        try {
            const [[{ total }]] = await pool.query(
                `SELECT COUNT(*) as total
                 FROM KhachSan ks
                 LEFT JOIN DichVu dv ON ks.maDichVu = dv.maDichVu
                 ${whereClause}`,
                whereParams
            );

            const dataParams = [...whereParams, limitNum, offset];
            const [rows] = await pool.query(
                `SELECT ks.maKhachSan,
                        ks.maDichVu,
                        ks.viTri,
                        ks.tenkhachsan AS tenKhachSan,
                        ks.tenkhachsan AS ten,
                        dv.ten AS tenDichVu,
                        dv.moTa,
                        ncc.ten AS tenNhaCungCap,
                        NULL AS avatar,
                        (SELECT MIN(lp.giaPhong) FROM LoaiPhong lp WHERE lp.maKhachSan = ks.maKhachSan AND lp.soLuongPhongTrong > 0) AS giaTuKhoang
                 FROM KhachSan ks
                 LEFT JOIN DichVu dv ON ks.maDichVu = dv.maDichVu
                 LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
                 ${whereClause}
                 ORDER BY ks.maKhachSan DESC
                 LIMIT ? OFFSET ?`,
                dataParams
            );

            return { data: rows, totalRecords: total, totalPages: Math.ceil(total / limitNum), currentPage: pageNum };
        } catch (err) {
            console.error('❌ KhachSanModel.getAll failed');
            console.error(`   code: ${err.code || 'UNKNOWN'}`);
            console.error(`   message: ${err.message}`);
            throw err;
        }
    }

    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT ks.*, ks.tenkhachsan AS ten,
                    ks.tenkhachsan AS tenKhachSan,
                    dv.ten AS tenDichVu, dv.moTa, dv.trangThai, ncc.ten AS tenNhaCungCap
             FROM KhachSan ks
             LEFT JOIN DichVu dv ON ks.maDichVu = dv.maDichVu
             LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
             WHERE ks.maKhachSan = ?`,
            [id]
        );
        if (!rows[0]) return null;

        const [loaiPhong] = await pool.query(`SELECT * FROM LoaiPhong WHERE maKhachSan = ? ORDER BY giaPhong ASC`, [id]);
        const [rating] = await pool.query(
            `SELECT AVG(soSao) AS diemTrungBinh, COUNT(*) AS soLuongDanhGia FROM DanhGia WHERE maDichVu = ?`,
            [rows[0].maDichVu]
        );
        return { ...rows[0], loaiPhong, hinhAnh: [], danhGia: rating[0] };
    }

    static async create(data) {
        const { maDichVu, viTri, ten, tenkhachsan, diaChiChiTiet, soSao = 5, gioCheckIn = '14:00:00', gioCheckOut = '12:00:00', chinhSachHuy, lat, lng } = data;
        const [result] = await pool.query(
            `INSERT INTO KhachSan (maDichVu, viTri, tenkhachsan, diaChiChiTiet, soSao, gioCheckIn, gioCheckOut, chinhSachHuy, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [maDichVu, viTri, tenkhachsan || ten, diaChiChiTiet || null, soSao, gioCheckIn, gioCheckOut, chinhSachHuy || 'Miễn phí hủy trước 48h', lat || null, lng || null]
        );
        return { maKhachSan: result.insertId, ...data };
    }

    static async update(id, data) {
        const { viTri, ten, tenkhachsan, diaChiChiTiet, soSao = 5, gioCheckIn = '14:00:00', gioCheckOut = '12:00:00', chinhSachHuy, lat, lng } = data;
        const [result] = await pool.query(
            `UPDATE KhachSan SET viTri=?, tenkhachsan=?, diaChiChiTiet=?, soSao=?, gioCheckIn=?, gioCheckOut=?, chinhSachHuy=?, lat=?, lng=? WHERE maKhachSan=?`,
            [viTri, tenkhachsan || ten, diaChiChiTiet || null, soSao, gioCheckIn, gioCheckOut, chinhSachHuy || 'Miễn phí hủy trước 48h', lat || null, lng || null, id]
        );
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
        const { maKhachSan, tenLoaiPhong, moTa, giaPhong, sucChua = 1, loaiGiuong = 'Giường đôi', dienTich, huongPhong, soLuongPhongTrong, anhPhong, trangThai = 1 } = data;
        const [result] = await pool.query(
            `INSERT INTO LoaiPhong (maKhachSan, tenLoaiPhong, moTa, giaPhong, sucChua, loaiGiuong, dienTich, huongPhong, soLuongPhongTrong, anhPhong, trangThai)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [maKhachSan, tenLoaiPhong, moTa || null, giaPhong, sucChua, loaiGiuong, dienTich || null, huongPhong || null, soLuongPhongTrong || 0, anhPhong || null, trangThai]
        );
        return { maLoaiPhong: result.insertId, ...data };
    }

    static async updateLoaiPhong(maLoaiPhong, data) {
        const { tenLoaiPhong, moTa, giaPhong, sucChua, loaiGiuong, dienTich, huongPhong, soLuongPhongTrong, anhPhong, trangThai } = data;
        const [result] = await pool.query(
            `UPDATE LoaiPhong SET tenLoaiPhong=?, moTa=?, giaPhong=?, sucChua=?, loaiGiuong=?, dienTich=?, huongPhong=?, soLuongPhongTrong=?, anhPhong=?, trangThai=? WHERE maLoaiPhong=?`,
            [tenLoaiPhong, moTa || null, giaPhong, sucChua, loaiGiuong, dienTich || null, huongPhong || null, soLuongPhongTrong, anhPhong || null, trangThai, maLoaiPhong]
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

    // =================== KHÁCH SẠN CHILD TABLES ===================

    // KhachSanTienIch (bulk replace)
    static async getKhachSanTienIch(maKhachSan) {
        const [rows] = await pool.query(
            `SELECT kti.maTienIch, t.tenTienIch, t.icon, t.loaiTienIch
             FROM KhachSanTienIch kti
             JOIN TienIch t ON kti.maTienIch = t.maTienIch
             WHERE kti.maKhachSan = ?`,
            [maKhachSan]
        );
        return rows;
    }
    static async upsertKhachSanTienIch(maKhachSan, maTienIchList) {
        // Replace all assignments for this hotel
        await pool.query('START TRANSACTION');
        try {
            await pool.query(`DELETE FROM KhachSanTienIch WHERE maKhachSan = ?`, [maKhachSan]);
            if (maTienIchList && maTienIchList.length) {
                const values = maTienIchList.map(id => [maKhachSan, id]);
                await pool.query('INSERT INTO KhachSanTienIch (maKhachSan, maTienIch) VALUES ?', [values]);
            }
            await pool.query('COMMIT');
            return true;
        } catch (e) {
            await pool.query('ROLLBACK');
            throw e;
        }
    }

    // KhachSanFAQ
    static async getKhachSanFAQ(maKhachSan) {
        const [rows] = await pool.query(`SELECT * FROM KhachSanFAQ WHERE maKhachSan = ? ORDER BY thuTu ASC`, [maKhachSan]);
        return rows;
    }
    static async createKhachSanFAQ(maKhachSan, data) {
        const { cauHoi, cauTraLoi, thuTu = 0 } = data;
        const [result] = await pool.query(
            `INSERT INTO KhachSanFAQ (maKhachSan, cauHoi, cauTraLoi, thuTu) VALUES (?, ?, ?, ?)`,
            [maKhachSan, cauHoi, cauTraLoi, thuTu]
        );
        return { maFAQ: result.insertId, ...data };
    }
    static async updateKhachSanFAQ(maFAQ, data) {
        const { cauHoi, cauTraLoi, thuTu } = data;
        const [result] = await pool.query(
            `UPDATE KhachSanFAQ SET cauHoi=?, cauTraLoi=?, thuTu=? WHERE maFAQ=?`,
            [cauHoi, cauTraLoi, thuTu, maFAQ]
        );
        return result.affectedRows > 0;
    }
    static async removeKhachSanFAQ(maFAQ) {
        const [result] = await pool.query(`DELETE FROM KhachSanFAQ WHERE maFAQ = ?`, [maFAQ]);
        return result.affectedRows > 0;
    }

    // LoaiPhongTienIch (bulk replace for a room)
    static async getLoaiPhongTienIch(maLoaiPhong) {
        const [rows] = await pool.query(
            `SELECT lpti.maTienIch, t.tenTienIch, t.icon, t.loaiTienIch
             FROM LoaiPhongTienIch lpti
             JOIN TienIch t ON lpti.maTienIch = t.maTienIch
             WHERE lpti.maLoaiPhong = ?`,
            [maLoaiPhong]
        );
        return rows;
    }
    static async upsertLoaiPhongTienIch(maLoaiPhong, maTienIchList) {
        await pool.query('START TRANSACTION');
        try {
            await pool.query(`DELETE FROM LoaiPhongTienIch WHERE maLoaiPhong = ?`, [maLoaiPhong]);
            if (maTienIchList && maTienIchList.length) {
                const values = maTienIchList.map(id => [maLoaiPhong, id]);
                await pool.query('INSERT INTO LoaiPhongTienIch (maLoaiPhong, maTienIch) VALUES ?', [values]);
            }
            await pool.query('COMMIT');
            return true;
        } catch (e) {
            await pool.query('ROLLBACK');
            throw e;
        }
    }
}

module.exports = KhachSanModel;
