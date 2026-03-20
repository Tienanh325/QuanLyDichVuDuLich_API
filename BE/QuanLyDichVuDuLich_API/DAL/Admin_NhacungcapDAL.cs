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
    public class Admin_NhacungcapDAL
    {
        private readonly DatabaseHelper _db;

        public Admin_NhacungcapDAL(DatabaseHelper db)
        {
            _db = db;
        }

        public List<NhaCungCap> GetAllNhaCungCap(out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable("SELECT * FROM NhaCungCap", out error);

            var list = new List<NhaCungCap>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new NhaCungCap
                {
                    MaNhaCungCap = (int)row["MaNhaCungCap"],
                    Ten = row["Ten"].ToString(),
                    Email = row["Email"].ToString(),
                    SoDienThoai = row["SoDienThoai"].ToString(),
                    DiaChi = row["DiaChi"].ToString(),
                    Loai = row["Loai"].ToString(),
                    TrangThai = row["TrangThai"].ToString()
                });
            }

            return list;
        }

        public NhaCungCap GetByIdNhaCungCap(int id, out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable($"SELECT * FROM NhaCungCap WHERE MaNhaCungCap={id}", out error);

            if (!string.IsNullOrEmpty(error) || dt == null || dt.Rows.Count == 0)
                return null;

            var row = dt.Rows[0];

            return new NhaCungCap
            {
                MaNhaCungCap = (int)row["MaNhaCungCap"],
                Ten = row["Ten"].ToString(),
                Email = row["Email"].ToString(),
                SoDienThoai = row["SoDienThoai"].ToString(),
                DiaChi = row["DiaChi"].ToString(),
                Loai = row["Loai"].ToString(),
                TrangThai = row["TrangThai"].ToString()
            };
        }

        public bool InsertNhaCungCap(NhaCungCap nhacungcap, out string error)
        {
            string sql =
                $"INSERT INTO NhaCungCap ( Ten, Email, SoDienThoai, DiaChi, Loai, TrangThai) " +
                $"VALUES ('{nhacungcap.Ten}', '{nhacungcap.Email}', '{nhacungcap.SoDienThoai}','{nhacungcap.DiaChi}','{nhacungcap.Loai}','{nhacungcap.TrangThai}')";

            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
        }
        public bool UpdateNhaCungCap(NhaCungCap nhacungcap, out string error)
        {
            if (nhacungcap.MaNhaCungCap <= 0)
            {
                error = "Invalid MaNhaCungCap";
                return false;
            }

            string sql = "UPDATE NhaCungCap SET " +
                $"Ten = {nhacungcap.Ten.Replace("'", "''")}, " +
                $"Email = N'{nhacungcap.Email.Replace("'", "''")}', " +
                $"SoDienThoai = N'{nhacungcap.SoDienThoai.Replace("'", "''")}', " +
                $"DiaChi = {nhacungcap.DiaChi.Replace("'", "''")}, " +
                $"Loai = '{nhacungcap.Loai.Replace("'", "''")}', " +
                $"TrangThai = {nhacungcap.TrangThai.Replace("'", "''")}, " +
                $"WHERE MaNhaCungCap = {nhacungcap.MaNhaCungCap}";

            error = _db.ExecuteNoneQuery(sql);
            return string.IsNullOrEmpty(error);
        }
        public bool DeleteNhaCungCap(int id, out string error)
        {
            string sql = $"DELETE FROM NhaCungCap WHERE MaNhaCungCap={id}";

            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
        }
        public List<NhaCungCap> SearchByname(string Ten, out string error)
        {
            error = "";

            var dt = _db.ExecuteQueryToDataTable(
                $"SELECT * FROM NhaCungCap WHERE Ten LIKE '%{Ten}%'", out error);

            var list = new List<NhaCungCap>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new NhaCungCap
                {
                    MaNhaCungCap = (int)row["MaNhaCungCap"],
                    Ten = row["Ten"].ToString(),
                    Email = row["Email"].ToString(),
                    SoDienThoai = row["SoDienThoai"].ToString(),
                    DiaChi = row["DiaChi"].ToString(),
                    Loai = row["Loai"].ToString(),
                    TrangThai = row["TrangThai"].ToString()
                });
            }

            return list;
        }
    }
}
