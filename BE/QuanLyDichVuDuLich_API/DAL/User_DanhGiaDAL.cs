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
    public class User_DanhGiaDAL
    {
        private readonly DatabaseHelper _db;

        public User_DanhGiaDAL(DatabaseHelper db)
        {
            _db = db;
        }

        public List<DanhGia> GetDanhGiaByDichVu(int maDichVu, out string error)
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

        public DanhGia GetByIdDanhGia(int id, out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable($"SELECT * FROM DanhGia WHERE maDanhGia={id}", out error);

            if (!string.IsNullOrEmpty(error) || dt == null || dt.Rows.Count == 0)
                return null;

            var row = dt.Rows[0];

            return new DanhGia
            {
                maDanhGia = (int)row["maDanhGia"],
                maNguoiDung = (int)row["maNguoiDung"],
                maDichVu = (int)row["maDichVu"],
                soSao = (int)row["soSao"],
                binhLuan = row["binhLuan"].ToString(),
                ngayDanhGia = (DateTime)row["ngayDanhGia"]
            };
        }
        public bool CreatDanhGia(DanhGia danhgia, out string error)
        {
            var result = _db.ExecuteScalarSProcedure( out error, "sp_create_danhgia",
                "@maNguoiDung", danhgia.maNguoiDung,
                "@maDichVu", danhgia.maDichVu,
                "@soSao", danhgia.soSao,
                "@binhLuan", danhgia.binhLuan,
                "@ngayDanhGia", danhgia.ngayDanhGia);

            return string.IsNullOrEmpty(error);
        }
        public bool UpdateDanhGia(DanhGia danhgia, out string error)
        {
            if (danhgia.maDanhGia <= 0)
            {
                error = "Invalid maDanhGia";
                return false;
            }

            string sql = "UPDATE DanhGia SET " +
                $"maNguoiDung = N'{danhgia.maNguoiDung}', " +
                $"maDichVu = {danhgia.maDichVu}, " +               
                $"soSao = N'{danhgia.soSao}', " +
                $"binhLuan = N'{danhgia.binhLuan.Replace("'", "''")}', " +
                $"ngayDanhGia = N'{danhgia.ngayDanhGia:yyyy-MM-dd}' " +
                $"WHERE maDanhGia = {danhgia.maDanhGia}";

            error = _db.ExecuteNoneQuery(sql);
            return string.IsNullOrEmpty(error);
        }
        public bool DeleteDanhGia(int id, out string error)
        {
            string sql = $"DELETE FROM DanhGia WHERE maDanhGia={id}";

            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
        }
        public double GetAverageDanhGia(int maDichVu)
        {
            string msg = "";

            var result = _db.ExecuteScalarSProcedure( out msg, "sp_avg_danhgia",
                "@maDichVu", maDichVu);

            return result != null ? Convert.ToDouble(result) : 0;
        }

        // ✔ Check đã mua chưa
        public bool CheckPurchased(int maNguoiDung, int maDichVu)
        {
            string msg = "";

            var result = _db.ExecuteScalarSProcedure(out msg, "sp_check_purchased",
                "@maNguoiDung", maNguoiDung,
                "@maDichVu", maDichVu);

            return Convert.ToInt32(result) > 0;
        }

        // ✔ Check đã đánh giá chưa
        public bool CheckExistsDanhGia(int maNguoiDung, int maDichVu)
        {
            string msg = "";

            var result = _db.ExecuteScalarSProcedure(out msg, "sp_check_review",
                "@maNguoiDung", maNguoiDung,
                "@maDichVu", maDichVu);

            return Convert.ToInt32(result) > 0;
        }
        public void UpdateRating(int maDichVu, out string error)
        {
            _db.ExecuteScalarSProcedure( out error, "sp_update_rating_by_type",
                "@maDichVu", maDichVu);
        }
    }
}
