using System;
using System.Collections.Generic;

namespace Models
{
    public partial class DonDat
    {
        public int MaDon { get; set; }

        public int? maNguoiDung { get; set; }

        public double? TongGia { get; set; }

        public string TrangThai { get; set; }

        public DateTime? NgayTao { get; set; }

        public virtual ICollection<ChiTietDon> ChiTietDon { get; set; } = new List<ChiTietDon>();

        public virtual NguoiDung NguoiDung { get; set; }

        public virtual ICollection<ThanhToan> ThanhToan { get; set; } = new List<ThanhToan>();
    }
}
