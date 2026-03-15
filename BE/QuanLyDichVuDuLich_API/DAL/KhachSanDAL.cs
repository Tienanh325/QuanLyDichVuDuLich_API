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
    public class KhachSanDAL
    {
        private readonly DatabaseHelper _db;

        public KhachSanDAL(DatabaseHelper db)
        {
            _db = db;
        }

        public List<KhachSan> GetAllKhachSan(out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable("SELECT * FROM KhachSan", out error);

            var list = new List<KhachSan>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new KhachSan
                {
                    maKhachSan = (int)row["maKhachSan"],
                    maDichVu = (int)row["maDichVu"],
                    ten = row["ten"].ToString(),
                    viTri = row["viTri"].ToString(),
                    danhGia = row["danhGia"].ToString(),
                    gia = (double)row["Gia"],
                    phongTrong = (int)row["phongTrong"],
                    moTa = row["moTa"].ToString(),
                    loaiPhong = row["loaiPhong"].ToString()
                });
            }

            return list;
        }

        public KhachSan GetKhachSanById(int id, out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable($"SELECT * FROM KhachSan WHERE accID={id}", out error);

            if (!string.IsNullOrEmpty(error) || dt == null || dt.Rows.Count == 0)
                return null;

            var row = dt.Rows[0];

            return new KhachSan
            {
                maKhachSan = (int)row["maKhachSan"],
                maDichVu = (int)row["maDichVu"],
                ten = row["ten"].ToString(),
                viTri = row["viTri"].ToString(),
                danhGia = row["danhGia"].ToString(),
                gia = (double)row["Gia"],
                phongTrong = (int)row["phongTrong"],
                moTa = row["moTa"].ToString(),
                loaiPhong = row["loaiPhong"].ToString()
            };
        }

        public bool InsertKhachSan(KhachSan khachsan, out string error)
        {
            string sql =
                $"INSERT INTO KhachSan ( maDichVu, ten,viTri, danhGia, gia, phongTrong, moTa, loaiPhong) " +
                $"VALUES ('{khachsan.maDichVu}', '{khachsan.ten}', '{khachsan.viTri}','{khachsan.danhGia}','{khachsan.gia}','{khachsan.phongTrong}','{khachsan.moTa}','{khachsan.loaiPhong}')";

            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
        }
        public bool UpdateKhachSan(KhachSan khachsan, out string error)
        {
            if (khachsan.maKhachSan <= 0)
            {
                error = "Invalid KhachSan";
                return false;
            }

            string sql = "UPDATE KhachSan SET " +
                $"maDichVu = {khachsan.maDichVu}, " +
                $"ten = N'{khachsan.ten.Replace("'", "''")}', " +
                $"viTri = N'{khachsan.viTri.Replace("'", "''")}', " +
                $"danhGia = N'{khachsan.danhGia.Replace("'", "''")}', " +
                $"gia = {khachsan.gia}, " +
                $"phongTrong = {khachsan.phongTrong}, " +
                $"moTa = N'{khachsan.moTa.Replace("'", "''")}', " +
                $"loaiPhong = N'{khachsan.loaiPhong.Replace("'", "''")}' " +
                $"WHERE maKhachSan = {khachsan.maKhachSan}";

            error = _db.ExecuteNoneQuery(sql);
            return string.IsNullOrEmpty(error);
        }
        public bool DeleteKhachSan(int id, out string error)
        {
            string sql = $"DELETE FROM KhachSan WHERE maKhachSan={id}";

            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
        }
        public List<KhachSan> SearchByname(string khachsan, out string error)
        {
            error = "";

            var dt = _db.ExecuteQueryToDataTable(
                $"SELECT * FROM KhachSan WHERE ten LIKE '%{khachsan}%'", out error);

            var list = new List<KhachSan>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new KhachSan
                {
                    maKhachSan = (int)row["maKhachSan"],
                    maDichVu = (int)row["maDichVu"],
                    ten = row["ten"].ToString(),
                    viTri = row["viTri"].ToString(),
                    danhGia = row["danhGia"].ToString(),
                    gia = (double)row["Gia"],
                    phongTrong = (int)row["phongTrong"],
                    moTa = row["moTa"].ToString(),
                    loaiPhong = row["loaiPhong"].ToString()
                });
            }

            return list;
        }
    }
}
