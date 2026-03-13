using System;
using System.Collections.Generic;

namespace Models
{
    public partial class ChiTietDon
    {
        public int maChiTiet { get; set; }

        public int maDon { get; set; }

        public int maDichVu { get; set; }

        public int SoLuong { get; set; }

        public double? Gia { get; set; }

        public virtual DichVu DichVu { get; set; }

        public virtual DonDat DonDat { get; set; }
    }
}