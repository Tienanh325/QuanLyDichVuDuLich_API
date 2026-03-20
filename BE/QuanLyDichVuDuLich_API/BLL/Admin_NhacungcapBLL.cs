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
    public class Admin_NhacungcapBLL
    {
        private readonly Admin_NhacungcapDAL _dal;
        private readonly DatabaseHelper _db;

        public Admin_NhacungcapBLL(Admin_NhacungcapDAL dal, DatabaseHelper db)
        {
            _dal = dal;
            _db = db;
        }

        public List<NhaCungCap> GetAllNhaCungCap(out string error)
        {
            return _dal.GetAllNhaCungCap(out error);
        }

        public NhaCungCap GetByIdNhaCungCap(int id, out string error)
        {
            return _dal.GetByIdNhaCungCap(id, out error);
        }

        public bool CreateNhaCungCap(NhaCungCap nhacungcap, out string error)
        {
            if (string.IsNullOrWhiteSpace(nhacungcap.Ten))
            {
                error = "Ten is required";
                return false;
            }

            return _dal.InsertNhaCungCap(nhacungcap, out error);
        }
        public bool UpdateNhaCungCap(int id, NhaCungCap nhacungcap, out string error)
        {
            if (id <= 0)
            {
                error = "Invalid user id";
                return false;
            }

            if (string.IsNullOrWhiteSpace(nhacungcap.Ten))
            {
                error = "Username is required";
                return false;
            }

            nhacungcap.MaNhaCungCap = id;

            return _dal.UpdateNhaCungCap(nhacungcap, out error);
        }
        public List<NhaCungCap> Search(string username, out string error)
        {
            return _dal.SearchByname(username, out error);
        }
        public bool DeleteNhaCungCap(int id, out string error)
        {
            error = string.Empty;
            try
            {
                return _dal.DeleteNhaCungCap(id, out error);
            }
            catch (Exception ex)
            {
                error = ex.Message;
                return false;
            }
        }
    }
}
