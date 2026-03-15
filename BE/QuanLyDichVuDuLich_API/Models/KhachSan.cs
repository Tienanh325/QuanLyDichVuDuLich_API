using System;
using System.Collections.Generic;

namespace Models
{
    public class KhachSan
    {
        public int maKhachSan { get; set; }

        public int maDichVu { get; set; }

        public string ten { get; set; }

        public string viTri { get; set; }

        public string danhGia { get; set; }

        public double gia { get; set; }

        public int phongTrong { get; set; }

        public string moTa { get; set; }
        public string loaiPhong { get; set; }

        public DichVu DichVu { get; set; }
    }
}

