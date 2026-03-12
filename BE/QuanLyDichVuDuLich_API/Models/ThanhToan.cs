using System;
using System.Collections.Generic;

namespace Models
{
    public partial class ThanhToan
    {
        public int MaThanhToan { get; set; }

        public int? MaDon { get; set; }

        public double SoTien { get; set; }

        public string PhuongThuc { get; set; }

        public string TrangThai { get; set; }

        public DateTime? NgayThanhToan { get; set; }

        public virtual DonDat MaDonNavigation { get; set; }
    }
}

