using System;
using System.Collections.Generic;

namespace Models
{ 

    public partial class DichVu
    {
        public int MaDichVu { get; set; }

        public string Ten { get; set; }

        public string MoTa { get; set; }

        public double Gia { get; set; }

        public string LoaiDichVu { get; set; }

        public int? MaNhaCungCap { get; set; }

        public string TrangThai { get; set; }

        public virtual ICollection<ChiTietDon> ChiTietDons { get; set; } = new List<ChiTietDon>();

        public virtual ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();

        public virtual ICollection<KhachSan> KhachSans { get; set; } = new List<KhachSan>();

        public virtual NhaCungCap MaNhaCungCapNavigation { get; set; }

        public virtual ICollection<Tour> Tours { get; set; } = new List<Tour>();

        public virtual ICollection<Ve> Ves { get; set; } = new List<Ve>();
    }
}