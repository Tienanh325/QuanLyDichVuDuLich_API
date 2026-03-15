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
    public class TourDAL
    {
        private readonly DatabaseHelper _db;

        public TourDAL(DatabaseHelper db)
        {
            _db = db;
        }

        public List<Tour> GetAllTour(out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable("SELECT * FROM Tour", out error);

            var list = new List<Tour>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new Tour
                {
                    MaTour = (int)row["MaTour"],
                    maDichVu = (int)row["maDichVu"],
                    Ten = row["Ten"].ToString(),
                    ViTri = row["ViTri"].ToString(),
                    ThoiGian = (int)row["ThoiGian"],
                    Gia = (double)row["Gia"],
                    NgayBatDau = (DateTime)row["NgayBatDau"],
                    SoLuong = (int)row["SoLuong"],
                    MoTa = row["MoTa"].ToString(),
                    DanhGia =row["DanhGia"].ToString()
                });
            }

            return list;
        }

        public Tour GetTourById(int id, out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable($"SELECT * FROM Tour WHERE accID={id}", out error);

            if (!string.IsNullOrEmpty(error) || dt == null || dt.Rows.Count == 0)
                return null;

            var row = dt.Rows[0];

            return new Tour
            {
                MaTour = (int)row["MaTour"],
                maDichVu = (int)row["maDichVu"],
                Ten = row["Ten"].ToString(),
                ViTri = row["ViTri"].ToString(),
                ThoiGian = (int)row["ThoiGian"],
                Gia = (double)row["Gia"],
                NgayBatDau = (DateTime)row["NgayBatDau"],
                SoLuong = (int)row["SoLuong"],
                MoTa = row["MoTa"].ToString(),
                DanhGia = row["DanhGia"].ToString()
            };
        }

        public bool InsertTour(Tour tour, out string error)
        {
            string sql =
                $"INSERT INTO Tour ( maDichVu, Ten,ViTri, ThoiGian, Gia, NgayBatDau, SoLuong, MoTa, DanhGia) " +
                $"VALUES ('{tour.maDichVu}', '{tour.Ten}', '{tour.ThoiGian}','{tour.Gia}','{tour.NgayBatDau}','{tour.SoLuong}','{tour.MoTa}','{tour.DanhGia}')";

            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
        }
        public bool UpdateTour(Tour tour, out string error)
        {
            if (tour.MaTour <= 0)
            {
                error = "Invalid MaTour";
                return false;
            }

            string sql = "UPDATE Tour SET " +
                $"maDichVu = {tour.maDichVu}, " +
                $"Ten = N'{tour.Ten.Replace("'", "''")}', " +
                $"MoTa = N'{tour.MoTa.Replace("'", "''")}', " +
                $"Gia = {tour.Gia}, " +
                $"NgayBatDau = '{tour.NgayBatDau:yyyy-MM-dd}', " +
                $"SoLuong = {tour.SoLuong}, " +
                $"VaiTro = N'{tour.MoTa.Replace("'", "''")}', " +
                $"DanhGia = '{tour.DanhGia.Replace("'", "''")}' " +
                $"WHERE MaTour = {tour.MaTour}";

            error = _db.ExecuteNoneQuery(sql);
            return string.IsNullOrEmpty(error);
        }
        public bool DeleteTour(int id, out string error)
        {
            string sql = $"DELETE FROM Tour WHERE MaTour={id}";

            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
        }
        public List<Tour> SearchByname(string Ten, out string error)
        {
            error = "";

            var dt = _db.ExecuteQueryToDataTable(
                $"SELECT * FROM Tour WHERE Ten LIKE '%{Ten}%'", out error);

            var list = new List<Tour>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new Tour
                {
                    MaTour = (int)row["MaTour"],
                    maDichVu = (int)row["maDichVu"],
                    Ten = row["Ten"].ToString(),
                    ViTri = row["ViTri"].ToString(),
                    ThoiGian = (int)row["ThoiGian"],
                    Gia = (double)row["Gia"],
                    NgayBatDau = (DateTime)row["NgayBatDau"],
                    SoLuong = (int)row["SoLuong"],
                    MoTa = row["MoTa"].ToString(),
                    DanhGia = row["DanhGia"].ToString()
                });
            }

            return list;
        }
    }
}

