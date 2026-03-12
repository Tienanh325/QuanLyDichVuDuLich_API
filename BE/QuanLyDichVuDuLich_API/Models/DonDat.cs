using System;
using System.Collections.Generic;

namespace Models
{
    public partial class DonDat
    {
        public int MaDon { get; set; }

        public int? MaNguoiDung { get; set; }

        public double? TongGia { get; set; }

        public string TrangThai { get; set; }

        public DateTime? NgayTao { get; set; }

        public virtual ICollection<ChiTietDon> ChiTietDons { get; set; } = new List<ChiTietDon>();

        public virtual NguoiDung MaNguoiDungNavigation { get; set; }

        public virtual ICollection<ThanhToan> ThanhToans { get; set; } = new List<ThanhToan>();
    }
}
