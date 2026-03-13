using System;
using System.Collections.Generic;

namespace Models
{
    public partial class QuanTriVien
    {
        public int MaAdmin { get; set; }
        public string ten { get; set; }
        public string sdt { get; set; }
        public string email { get; set; }
        public int accID { get; set; }
        public TaiKhoan TaiKhoan { get; set; }
    }
}
