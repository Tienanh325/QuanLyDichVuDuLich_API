using Models;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BLL.User_LoaiVeBLL;

namespace BLL
{
    public class User_LoaiVeBLL
    {
       
        private readonly User_LoaiVeDAL _dal;

        public User_LoaiVeBLL(User_LoaiVeDAL dal)
        {
            _dal = dal;
        }

        public List<LoaiVe> GetAllLoaiVe(out string error)
        {
            return _dal.GetAllLoaiVe(out error);
        }
        public LoaiVe GetByIdLoaiVe(int id, out string error)
        {
            return _dal.GetByIdLoaiVe(id, out error);
        }

        public List<LoaiVe> Search(string keyword, out string error)
        {
            return _dal.SearchByname(keyword, out error);
        }
    }
}
