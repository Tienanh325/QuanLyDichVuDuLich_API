using System;
using System.Collections.Generic;

namespace Models
{
    public partial class NguoiDung
    {
        public int MaNguoiDung { get; set; }
        public string TenDangNhap { get; set; }
        public string MatKhau { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public string DiaChi { get; set; }
        public virtual ICollection<DonDat> DonDats { get; set; } = new List<DonDat>();
    }
}



