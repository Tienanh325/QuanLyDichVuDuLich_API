using DAL;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class Admin_DanhGiaBLL
    {
        private readonly Admin_DanhGiaDAL _dal;

        public Admin_DanhGiaBLL(Admin_DanhGiaDAL dal)
        {
            _dal = dal;
        }

        public List<DanhGia> GetAllDanhGia(out string error)
        {
            return _dal.GetAllDanhGia(out error);
        }

        public List<DanhGia> GetByDichVu(int maDichVu, out string error)
        {
            return _dal.GetByDichVu(maDichVu, out error);
        }

        public bool Delete(int id, out string error)
        {
            return _dal.Delete(id, out error);
        }
        public List<DanhGia> Search(string keyword, int? soSao, out string error)
        {
            return _dal.Search(keyword, soSao, out error);
        }

        public object GetStats(int maDichVu, out string error)
        {
            var dt = _dal.GetStats(maDichVu, out error);

            if (!string.IsNullOrEmpty(error) || dt == null || dt.Rows.Count == 0)
                return null;

            var row = dt.Rows[0];

            return new
            {
                maDichVu,
                tongDanhGia = Convert.ToInt32(row["tongDanhGia"]),
                trungBinh = row["trungBinh"] != DBNull.Value ? Convert.ToDouble(row["trungBinh"]) : 0,
                star1 = Convert.ToInt32(row["star1"]),
                star2 = Convert.ToInt32(row["star2"]),
                star3 = Convert.ToInt32(row["star3"]),
                star4 = Convert.ToInt32(row["star4"]),
                star5 = Convert.ToInt32(row["star5"])
            };
        }
    }
}
