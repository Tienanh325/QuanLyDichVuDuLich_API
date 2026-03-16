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
    public class VeBLL
    {
        private readonly VeDAL _dal;
        private readonly DatabaseHelper _db;

        public VeBLL(VeDAL dal, DatabaseHelper db)
        {
            _dal = dal;
            _db = db;
        }

        public List<Ve> GetAll(out string error)
        {
            return _dal.GetAllVe(out error);
        }

        public Ve GetByIdVe(int id, out string error)
        {
            return _dal.GetVeById(id, out error);
        }

        public bool CreateVe(Ve ve, out string error)
        {
            if (string.IsNullOrWhiteSpace(ve.TenVe))
            {
                error = "Ten is required";
                return false;
            }

            return _dal.InsertVe(ve, out error);
        }
        public bool UpdateVe(int id, Ve ve, out string error)
        {
            if (id <= 0)
            {
                error = "Invalid TenVe id";
                return false;
            }

            if (string.IsNullOrWhiteSpace(ve.TenVe))
            {
                error = "Username is required";
                return false;
            }

            ve.MaVe = id;

            return _dal.UpdateVe(ve, out error);
        }
        public List<Ve> Search(string username, out string error)
        {
            return _dal.SearchByname(username, out error);
        }
        public bool DeleteVe(int id, out string error)
        {
            error = string.Empty;
            try
            {
                return _dal.DeleteVe(id, out error);
            }
            catch (Exception ex)
            {
                error = ex.Message;
                return false;
            }
        }
    }
}
