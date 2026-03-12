using System;
using System.Collections.Generic;

namespace Models
{
    public partial class ChiTietDon
    {
        public int MaChiTiet { get; set; }

        public int? MaDon { get; set; }

        public int? MaDichVu { get; set; }

        public int? SoLuong { get; set; }

        public double? Gia { get; set; }

        public virtual DichVu MaDichVuNavigation { get; set; }

        public virtual DonDat MaDonNavigation { get; set; }
    }
}