const { pool } = require('./config/db');

async function test() {
  try {
    const viTri = 'nha trang';
    const whereClause = `WHERE dv.trangThai = 1 AND ks.viTri LIKE ?`;
    const whereParams = [`%${viTri}%`];

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM KhachSan ks LEFT JOIN DichVu dv ON ks.maDichVu = dv.maDichVu ${whereClause}`,
      whereParams
    );
    console.log('Total:', total);

    const dataParams = [...whereParams, 5, 0];
    const [rows] = await pool.query(
      `SELECT ks.maKhachSan, ks.maDichVu, ks.viTri, COALESCE(ks.tenkhachsan, dv.ten) AS ten,
              ncc.ten AS tenNhaCungCap, NULL AS avatar,
              (SELECT MIN(lp.giaPhong) FROM LoaiPhong lp WHERE lp.maKhachSan = ks.maKhachSan AND lp.soLuongPhongTrong > 0) AS giaTuKhoang
       FROM KhachSan ks
       LEFT JOIN DichVu dv ON ks.maDichVu = dv.maDichVu
       LEFT JOIN NhaCungCap ncc ON dv.maNhaCungCap = ncc.maNhaCungCap
       ${whereClause}
       ORDER BY ks.maKhachSan DESC
       LIMIT ? OFFSET ?`,
      dataParams
    );
    console.log('Rows:', rows.length);
    console.log(JSON.stringify(rows.slice(0, 2), null, 2));
  } catch (err) {
    console.error('ERROR:', err.code, err.message);
  } finally {
    await pool.end();
  }
}

test();
