using System;
using System.Collections.Generic;

namespace Models
{
    public partial class Tour
    {
        public int MaTour { get; set; }

        public int? maDichVu { get; set; }

        public string Ten { get; set; }

        public string ViTri { get; set; }

        public int? ThoiGian { get; set; }

        public double? Gia { get; set; }

        public DateTime? NgayBatDau { get; set; } // Changed from DateOnly to DateTime

        public int? SoLuong { get; set; }

        public string MoTa { get; set; }

        public string DanhGia { get; set; }

        public virtual DichVu DichVu { get; set; }
    }
}
