using Models;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BLL.User_DanhGiaBLL;

namespace BLL
{
    public class User_DanhGiaBLL 
    {
        private readonly User_DanhGiaDAL _dal;

        public User_DanhGiaBLL(User_DanhGiaDAL dal)
        {
            _dal = dal;
        }

        public List<DanhGia> GetDanhGiaByDichVu(int maDichVu, out string error)
        {
            return _dal.GetDanhGiaByDichVu(maDichVu, out error);
        }

        public DanhGia GetByIdDanhGia(int id, out string error)
        {
            return _dal.GetByIdDanhGia(id, out error);
        }

        // ⭐ LOGIC QUAN TRỌNG NHẤT
        public bool CreateDanhGia(DanhGia danhgia, out string error)
        {
            error = "";

            // 1. Check đã mua chưa
            if (!_dal.CheckPurchased(danhgia.maNguoiDung, danhgia.maDichVu))
            {
                error = "Bạn chưa mua dịch vụ này";
                return false;
            }

            // 2. Check đã đánh giá chưa
            if (_dal.CheckExistsDanhGia(danhgia.maNguoiDung, danhgia.maDichVu))
            {
                error = "Bạn đã đánh giá dịch vụ này rồi";
                return false;
            }

            // 3. Validate số sao
            if (danhgia.soSao < 1 || danhgia.soSao > 5)
            {
                error = "Số sao phải từ 1 đến 5";
                return false;
            }

            // 4. Gán ngày nếu null
            if (danhgia.ngayDanhGia == default(DateTime))
            {
                danhgia.ngayDanhGia = DateTime.Now;
            }

            bool result = _dal.CreatDanhGia(danhgia, out error);
            if (result)
            {
                // 🔥 CẬP NHẬT RATING
                _dal.UpdateRating(danhgia.maDichVu, out error);
            }

            return result;
        }

        public bool UpdateDanhGia(DanhGia danhgia, out string error)
        {
            error = "";

            if (danhgia.maDanhGia <= 0)
            {
                error = "ID không hợp lệ";
                return false;
            }

            if (danhgia.soSao < 1 || danhgia.soSao > 5)
            {
                error = "Số sao phải từ 1 đến 5";
                return false;
            }

            return _dal.UpdateDanhGia(danhgia, out error);
        }

        public bool DeleteDanhGia(int id, out string error)
        {
            return _dal.DeleteDanhGia(id, out error);
        }

        public double GetAverageDanhGia(int maDichVu)
        {
            return _dal.GetAverageDanhGia(maDichVu);
        }

        public bool CheckPurchased(int maNguoiDung, int maDichVu)
        {
            return _dal.CheckPurchased(maNguoiDung, maDichVu);
        }

        public bool CheckExistsDanhGia(int maNguoiDung, int maDichVu)
        {
            return _dal.CheckExistsDanhGia(maNguoiDung, maDichVu);
        }
    }
}
