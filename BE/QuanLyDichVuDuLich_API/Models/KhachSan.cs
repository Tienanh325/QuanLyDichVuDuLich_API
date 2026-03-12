using System;
using System.Collections.Generic;

namespace Models
{ 
        public partial class KhachSan
    {
        public int MaKhachSan { get; set; }

        public int? MaDichVu { get; set; }

        public string Ten { get; set; }

        public string ViTri { get; set; }

        public string DanhGia { get; set; }

        public double? Gia { get; set; }

        public int? PhongTrong { get; set; }

        public string MoTa { get; set; }

        public virtual DichVu MaDichVuNavigation { get; set; }
    }
}

