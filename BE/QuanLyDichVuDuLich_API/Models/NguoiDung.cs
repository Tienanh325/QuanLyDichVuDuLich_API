using System;
using System.Collections.Generic;

namespace Models
{
    public partial class NguoiDung
    {
        public int maNguoiDung { get; set; }
        public string ten { get; set; }
        public string sdt { get; set; }
        public string email { get; set; }
        public int accID { get; set; }
        public TaiKhoan TaiKhoan { get; set; }
        public virtual ICollection<DonDat> DonDat { get; set; } = new List<DonDat>();
    }
}



