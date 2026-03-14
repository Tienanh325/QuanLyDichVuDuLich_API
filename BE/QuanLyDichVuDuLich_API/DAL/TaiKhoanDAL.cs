using DAL.Helper;
using System;
using System.Collections.Generic;
using System.Data;
using Models;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class TaiKhoanDAL
    {
        private readonly DatabaseHelper _db;

        public TaiKhoanDAL(DatabaseHelper db)
        {
            _db = db;
        }

        public List<TaiKhoan> GetAllTaiKhoan(out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable("SELECT * FROM TaiKhoan", out error);

            var list = new List<TaiKhoan>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new TaiKhoan
                {
                    accID = (int)row["accID"],
                    tenDangNhap = row["tenDangNhap"].ToString(),
                    matKhau = row["matKhau"].ToString(),
                    vaiTro = row["vaiTro"].ToString(),
                });
            }

            return list;
        }

        public TaiKhoan GetTaiKhoanById(int id, out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable($"SELECT * FROM TaiKhoan WHERE accID={id}", out error);

            if (!string.IsNullOrEmpty(error) || dt == null || dt.Rows.Count == 0)
                return null;

            var row = dt.Rows[0];

            return new TaiKhoan
            {
                accID = (int)row["accID"],
                tenDangNhap = row["tenDangNhap"].ToString(),
                matKhau = row["matKhau"].ToString(),
                vaiTro = row["vaiTro"].ToString(),
            };
        }

        public bool InsertTaiKhoan(TaiKhoan taikhoan, out string error)
        {
            string sql =
                $"INSERT INTO TaiKhoan ( tenDangNhap, matKhau, vaiTro) " +
                $"VALUES ('{taikhoan.tenDangNhap}', '{taikhoan.matKhau}', '{taikhoan.vaiTro}')";

            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
        }
        public bool UpdateTaiKhoan(TaiKhoan taikhoan, out string error)
        {
            if (taikhoan.accID <= 0)
            {
                error = "Invalid accID";
                return false;
            }

            string sql =
                $"UPDATE TaiKhoan SET " +
                $"tenDangNhap = '{taikhoan.tenDangNhap.Replace("'", "''")}', " +
                $"matKhau = '{taikhoan.matKhau.Replace("'", "''")}', " +
                $"vaiTro = '{taikhoan.vaiTro.Replace("'", "''")}', " +
                $"WHERE accID = {taikhoan.accID}";

            error = _db.ExecuteNoneQuery(sql);
            return string.IsNullOrEmpty(error);
        }
    }
}
