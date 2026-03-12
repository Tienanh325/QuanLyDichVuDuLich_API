using System;
using System.Collections.Generic;

namespace Models
{
    public partial class Ve
    {
        public int MaVe { get; set; }

        public int? MaDichVu { get; set; }

        public string Loai { get; set; }

        public string DiemKhoiHanh { get; set; }

        public string DiemDen { get; set; }

        public DateTime? NgayKhoiHanh { get; set; }

        public double? Gia { get; set; }

        public int? SoChoTrong { get; set; }

        public string Hang { get; set; }

        public virtual DichVu MaDichVuNavigation { get; set; }
    }
}
