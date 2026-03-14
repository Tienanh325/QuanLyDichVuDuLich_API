using System;
using DAL;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models;

namespace BLL
{
    public class TaiKhoanBLL
    {
        private readonly TaiKhoanDAL _dal;

        public TaiKhoanBLL(TaiKhoanDAL dal)
        {
            _dal = dal;
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
    }
}
