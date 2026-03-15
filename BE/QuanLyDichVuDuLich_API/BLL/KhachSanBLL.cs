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
    public class KhachSanBLL
    {
        private readonly KhachSanDAL _dal;
        private readonly DatabaseHelper _db;

        public KhachSanBLL(KhachSanDAL dal, DatabaseHelper db)
        {
            _dal = dal;
            _db = db;
        }

        public List<KhachSan> GetAll(out string error)
        {
            return _dal.GetAllKhachSan(out error);
        }

        public KhachSan GetByIdKhachSan(int id, out string error)
        {
            return _dal.GetKhachSanById(id, out error);
        }

        public bool CreateKhachSan(KhachSan khachsan, out string error)
        {
            if (string.IsNullOrWhiteSpace(khachsan.ten))
            {
                error = "Ten is required";
                return false;
            }

            return _dal.InsertKhachSan(khachsan, out error);
        }
        public bool UpdateKhachSan(int id, KhachSan khachsan, out string error)
        {
            if (id <= 0)
            {
                error = "Invalid user id";
                return false;
            }

            if (string.IsNullOrWhiteSpace(khachsan.ten))
            {
                error = "Username is required";
                return false;
            }

            khachsan.maKhachSan = id;

            return _dal.UpdateKhachSan(khachsan, out error);
        }
        public List<KhachSan> Search(string username, out string error)
        {
            return _dal.SearchByname(username, out error);
        }
        public bool DeleteKhachSan(int id, out string error)
        {
            error = string.Empty;
            try
            {
                return _dal.DeleteKhachSan(id, out error);
            }
            catch (Exception ex)
            {
                error = ex.Message;
                return false;
            }
        }
    }
}
