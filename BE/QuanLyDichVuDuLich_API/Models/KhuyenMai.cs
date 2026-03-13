using System;
using System.Collections.Generic;

namespace Models
{
    public partial class KhuyenMai
    {
        public int MaKhuyenMai { get; set; }
        public string TenKhuyenMai { get; set; }
        public double PhanTramGiam { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public string TrangThai { get; set; }
        public virtual ICollection<DonDat> DonDat { get; set; } = new List<DonDat>();
    }
}
