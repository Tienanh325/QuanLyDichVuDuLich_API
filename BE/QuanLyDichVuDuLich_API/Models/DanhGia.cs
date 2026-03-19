using System;
using System.Collections.Generic;

namespace Models
{
    public partial class DanhGia
    {
        public int maDanhGia { get; set; }

        public int maNguoiDung { get; set; }

        public int maDichVu { get; set; }

        public int soSao { get; set; }

        public string binhLuan { get; set; }

        public DateTime ngayDanhGia { get; set; }

        public virtual DichVu DichVu { get; set; }

        public virtual NguoiDung NguoiDung { get; set; }
    }
}