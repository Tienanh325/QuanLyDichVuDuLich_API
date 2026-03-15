using System;
using DAL;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models;
using System.Data;
using DAL.Helper;

namespace BLL
{
    public class TaiKhoanBLL
    {
        private readonly TaiKhoanDAL _dal;
        private readonly DatabaseHelper _db;

        public TaiKhoanBLL(TaiKhoanDAL dal,DatabaseHelper db)
        {
            _dal = dal;
            _db = db;
        }

        public List<TaiKhoan> GetAll(out string error)
        {
            return _dal.GetAllTaiKhoan (out error);
        }

        public TaiKhoan GetByIdTaiKhoan(int id, out string error)
        {
            return _dal.GetTaiKhoanById(id, out error);
        }

        public bool CreateTaiKhoan(TaiKhoan taiKhoan, out string error)
        {
            if (string.IsNullOrWhiteSpace(taiKhoan.tenDangNhap))
            {
                error = "tenDangNhap is required";
                return false;
            }

            return _dal.InsertTaiKhoan(taiKhoan, out error);
        }
        public bool UpdateTaiKhoan(int id, TaiKhoan taiKhoan, out string error)
        {
            if (id <= 0)
            {
                error = "Invalid user id";
                return false;
            }

            if (string.IsNullOrWhiteSpace(taiKhoan.tenDangNhap))
            {
                error = "Username is required";
                return false;
            }

            taiKhoan.accID = id;

            return _dal.UpdateTaiKhoan(taiKhoan, out error);
        }
        public List<TaiKhoan> SearchByUsername(string username, out string error)
        {
            error = "";

            var dt = _db.ExecuteQueryToDataTable(
                $"SELECT * FROM TaiKhoan WHERE tenDangNhap LIKE '%{username}%'", out error);

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
                    vaiTro = row["vaiTro"].ToString()
                });
            }

            return list;
        }
        public TaiKhoan Login(string username, string password, out string error)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                error = "Username and password required";
                return null;
            }

            return _dal.Login(username, password, out error);
        }
        public List<TaiKhoan> Search(string username, out string error)
        {
            return _dal.SearchByUsername(username, out error);
        }
        public bool ChangePassword(int id, string newPassword, out string error)
        {
            if (string.IsNullOrWhiteSpace(newPassword))
            {
                error = "Password required";
                return false;
            }

            return _dal.ChangePassword(id, newPassword, out error);
        }
        public bool DeleteTaiKhoan(int id, out string error)
        {
            error = string.Empty;
            try
            {
                return _dal.DeleteTaiKhoan(id, out error);
            }
            catch (Exception ex)
            {
                error = ex.Message;
                return false;
            }
        }
    }
}
