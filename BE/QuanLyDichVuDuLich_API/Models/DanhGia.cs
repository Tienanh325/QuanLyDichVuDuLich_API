using System;
using System.Collections.Generic;

namespace Models
{
    public partial class DanhGia
    {
        public int MaDanhGia { get; set; }

        public int? MaNguoiDung { get; set; }

        public int? MaDichVu { get; set; }

        public int? SoSao { get; set; }

        public string BinhLuan { get; set; }

        public DateTime? NgayDanhGia { get; set; }

        public virtual DichVu MaDichVuNavigation { get; set; }

        public virtual NguoiDung MaNguoiDungNavigation { get; set; }
    }
}