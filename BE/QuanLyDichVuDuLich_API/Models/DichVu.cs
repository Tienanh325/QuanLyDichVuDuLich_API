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

        public int? maNhaCungCap { get; set; }

        public string TrangThai { get; set; }

        public virtual ICollection<ChiTietDon> ChiTietDon { get; set; } = new List<ChiTietDon>();

        public virtual ICollection<DanhGia> DanhGia { get; set; } = new List<DanhGia>();

        public virtual ICollection<KhachSan> KhachSan { get; set; } = new List<KhachSan>();

        public virtual NhaCungCap NhaCungCap { get; set; }

        public virtual ICollection<Tour> Tour { get; set; } = new List<Tour>();

        public virtual ICollection<Ve> Ve { get; set; } = new List<Ve>();
    }
}