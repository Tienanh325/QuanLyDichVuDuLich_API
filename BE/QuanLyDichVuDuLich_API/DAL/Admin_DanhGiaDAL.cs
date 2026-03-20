using DAL.Helper;
using Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class Admin_DanhGiaDAL
    {
        private readonly DatabaseHelper _db;

        public Admin_DanhGiaDAL(DatabaseHelper db)
        {
            _db = db;
        }

        // ===============================
        // 🔹 Lấy tất cả đánh giá
        // ===============================
        public List<DanhGia> GetAllDanhGia(out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable("SELECT * FROM DanhGia", out error);

            var list = new List<DanhGia>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new DanhGia
                {
                    maDanhGia = (int)row["maDanhGia"],
                    maNguoiDung = (int)row["maNguoiDung"],
                    maDichVu = (int)row["maDichVu"],
                    soSao = (int)row["soSao"],
                    binhLuan = row["binhLuan"].ToString(),
                    ngayDanhGia = (DateTime)row["ngayDanhGia"]
                });
            }

            return list;
        }

        // ===============================
        // 🔹 Lấy theo dịch vụ
        // ===============================
        public List<DanhGia> GetByDichVu(int maDichVu, out string error)
        {
            error = "";

            var dt = _db.ExecuteQueryToDataTable(
                $"SELECT * FROM DanhGia WHERE maDichVu = {maDichVu}",
                out error);

            var list = new List<DanhGia>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new DanhGia
                {
                    maDanhGia = (int)row["maDanhGia"],
                    maNguoiDung = (int)row["maNguoiDung"],
                    maDichVu = (int)row["maDichVu"],
                    soSao = (int)row["soSao"],
                    binhLuan = row["binhLuan"].ToString(),
                    ngayDanhGia = (DateTime)row["ngayDanhGia"]
                });
            }

            return list;
        }

        // ===============================
        // 🔹 Xóa đánh giá
        // ===============================
        public bool Delete(int id, out string error)
        {
            string sql = $"DELETE FROM DanhGia WHERE maDanhGia = {id}";
            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
        }
        public List<DanhGia> Search(string keyword, int? soSao, out string error)
        {
            error = "";

            string sql = "SELECT * FROM DanhGia WHERE 1=1";

            if (!string.IsNullOrEmpty(keyword))
            {
                sql += $" AND binhLuan LIKE N'%{keyword}%'";
            }

            if (soSao.HasValue)
            {
                sql += $" AND soSao = {soSao.Value}";
            }

            var dt = _db.ExecuteQueryToDataTable(sql, out error);

            var list = new List<DanhGia>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new DanhGia
                {
                    maDanhGia = (int)row["maDanhGia"],
                    maNguoiDung = (int)row["maNguoiDung"],
                    maDichVu = (int)row["maDichVu"],
                    soSao = (int)row["soSao"],
                    binhLuan = row["binhLuan"].ToString(),
                    ngayDanhGia = (DateTime)row["ngayDanhGia"]
                });
            }

            return list;
        }
        public DataTable GetStats(int maDichVu, out string error)
        {
            error = "";

            string sql = $@"
        SELECT 
            COUNT(*) as tongDanhGia,
            AVG(CAST(soSao AS FLOAT)) as trungBinh,
            SUM(CASE WHEN soSao = 1 THEN 1 ELSE 0 END) as star1,
            SUM(CASE WHEN soSao = 2 THEN 1 ELSE 0 END) as star2,
            SUM(CASE WHEN soSao = 3 THEN 1 ELSE 0 END) as star3,
            SUM(CASE WHEN soSao = 4 THEN 1 ELSE 0 END) as star4,
            SUM(CASE WHEN soSao = 5 THEN 1 ELSE 0 END) as star5
        FROM DanhGia
        WHERE maDichVu = {maDichVu}
    ";

            return _db.ExecuteQueryToDataTable(sql, out error);
        }
    }
}
