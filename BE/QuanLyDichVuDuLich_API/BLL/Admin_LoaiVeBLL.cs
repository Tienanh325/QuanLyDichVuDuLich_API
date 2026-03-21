using DAL.Helper;
using DAL;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class Admin_LoaiVeBLL
    {
        private readonly Admin_LoaiVeDAL _dal;
        private readonly DatabaseHelper _db;

        public Admin_LoaiVeBLL(Admin_LoaiVeDAL dal, DatabaseHelper db)
        {
            _dal = dal;
            _db = db;
        }

        public List<LoaiVe> GetAllLoaiVe(out string error)
        {
            return _dal.GetAllLoaiVe(out error);
        }

        public LoaiVe GetByIdLoaiVe(int id, out string error)
        {
            return _dal.GetByIdLoaiVe(id, out error);
        }

        public bool CreateLoaiVe(LoaiVe loaive, out string error)
        {
            if (string.IsNullOrWhiteSpace(loaive.TenLoaiVe))
            {
                error = "Ten is required";
                return false;
            }

            return _dal.InsertLoaiVe(loaive, out error);
        }
        public bool UpdateLoaiVe(int id, LoaiVe loaive, out string error)
        {
            if (id <= 0)
            {
                error = "Invalid user id";
                return false;
            }

            if (string.IsNullOrWhiteSpace(loaive.TenLoaiVe))
            {
                error = "Username is required";
                return false;
            }

            loaive.LoaiVeID = id;

            return _dal.InsertLoaiVe(loaive, out error);
        }
        public List<LoaiVe> Search(string username, out string error)
        {
            return _dal.SearchByname(username, out error);
        }
        public bool DeleteLoaiVe(int id, out string error)
        {
            error = string.Empty;
            try
            {
                return _dal.DeleteLoaiVe(id, out error);
            }
            catch (Exception ex)
            {
                error = ex.Message;
                return false;
            }
        }
    }
}
