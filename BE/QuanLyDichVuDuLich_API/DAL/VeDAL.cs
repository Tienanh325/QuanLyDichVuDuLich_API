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
    public class VeDAL
    {
        private readonly DatabaseHelper _db;

        public VeDAL(DatabaseHelper db)
        {
            _db = db;
        }

        public List<Ve> GetAllVe(out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable("SELECT * FROM Ve", out error);

            var list = new List<Ve>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new Ve
                {
                    MaVe = (int)row["MaVe"],
                    maDichVu = (int)row["maDichVu"],
                    TenVe = row["TenVe"].ToString(),
                    LoaiVeID = (int)row["LoaiVeID"],
                    DiemKhoiHanh = row["DiemKhoiHanh"].ToString(),
                    DiemDen = row["DiemDen"].ToString(),
                    NgayKhoiHanh = (DateTime)row["NgayKhoiHanh"],
                    Gia = (double)row["Gia"],
                    SoChoTrong = (int)row["SoChoTrong"],
                    Hang = row["Hang"].ToString()
                });
            }

            return list;
        }

        public Ve GetVeById(int id, out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable($"SELECT * FROM Ve WHERE MaVe={id}", out error);

            if (!string.IsNullOrEmpty(error) || dt == null || dt.Rows.Count == 0)
                return null;

            var row = dt.Rows[0];

            return new Ve
            {
                MaVe = (int)row["MaVe"],
                maDichVu = (int)row["maDichVu"],
                TenVe = row["TenVe"].ToString(),
                LoaiVeID = (int)row["LoaiVeID"],
                DiemKhoiHanh = row["DiemKhoiHanh"].ToString(),
                DiemDen = row["DiemDen"].ToString(),
                NgayKhoiHanh = (DateTime)row["NgayKhoiHanh"],
                Gia = (double)row["Gia"],
                SoChoTrong = (int)row["SoChoTrong"],
                Hang = row["Hang"].ToString()
            };
        }

        public bool InsertVe(Ve ve, out string error)
        {
            string sql =
                $"INSERT INTO Ve ( maDichVu, TenVe, LoaiVeID, DiemKhoiHanh, DiemDen, NgayKhoiHanh, Gia, SoChoTrong, Hang) " +
                $"VALUES ('{ve.maDichVu}', '{ve.TenVe}', '{ve.LoaiVeID}', '{ve.DiemKhoiHanh}','{ve.DiemDen}','{ve.NgayKhoiHanh}','{ve.Gia}','{ve.SoChoTrong}','{ve.Hang}')";

            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
        }
        public bool UpdateVe(Ve ve, out string error)
        {
            if (ve.MaVe <= 0)
            {
                error = "Invalid MaVe";
                return false;
            }

            string sql = "UPDATE Ve SET " +
                $"maDichVu = {ve.maDichVu}, " +
                $"LoaiVeID = N'{ve.LoaiVeID}', " +
                $"TenVe = N'{ve.TenVe.Replace("'", "''")}', " +
                $"DiemKhoiHanh = N'{ve.DiemKhoiHanh.Replace("'", "''")}', " +
                $"DiemDen = {ve.DiemDen.Replace("'", "''")}, " +
                $"NgayKhoiHanh = N'{ve.NgayKhoiHanh:yyyy-MM-dd}', " +
                $"Gia = {ve.Gia}, " +
                $"SoChoTrong = '{ve.SoChoTrong}', " +              
                $"Hang = '{ve.Hang.Replace("'", "''")}' " +
                $"WHERE MaVe = {ve.MaVe}";

            error = _db.ExecuteNoneQuery(sql);
            return string.IsNullOrEmpty(error);
        }
        public bool DeleteVe(int id, out string error)
        {
            string sql = $"DELETE FROM Ve WHERE MaVe={id}";

            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
        }
        public List<Ve> SearchByname(string DiemDen, out string error)
        {
            error = "";

            var dt = _db.ExecuteQueryToDataTable(
                $"SELECT * FROM Ve WHERE DiemDen LIKE '%{DiemDen}%'", out error);

            var list = new List<Ve>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new Ve
                {
                    MaVe = (int)row["MaVe"],
                    maDichVu = (int)row["maDichVu"],
                    TenVe = row["TenVe"].ToString(),
                    LoaiVeID = (int)row["LoaiVeID"],
                    DiemKhoiHanh = row["DiemKhoiHanh"].ToString(),
                    DiemDen = row["DiemDen"].ToString(),
                    NgayKhoiHanh = (DateTime)row["NgayKhoiHanh"],
                    Gia = (double)row["Gia"],
                    SoChoTrong = (int)row["SoChoTrong"],
                    Hang = row["Hang"].ToString()
                });
            }

            return list;
        }
    }
}
