using System;
using System.Collections.Generic;

namespace Models
{
    public partial class DanhGia
    {
        public int MaDanhGia { get; set; }

        public int? maNguoiDung { get; set; }

        public int? maDichVu { get; set; }

        public int? SoSao { get; set; }

        public string BinhLuan { get; set; }

        public DateTime? NgayDanhGia { get; set; }

        public virtual DichVu DichVu { get; set; }

        public virtual NguoiDung NguoiDung { get; set; }
    }
}