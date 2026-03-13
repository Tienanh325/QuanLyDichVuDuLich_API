using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class TaiKhoan
    {
        public int accID { get; set; }
        public string tenDangNhap { get; set; }
        public string matKhau { get; set; }
        public string vaiTro { get; set; }

        public ICollection<NguoiDung> NguoiDung { get; set; }
        public ICollection<QuanTriVien> QuanTriVien { get; set; }
        
    }
}
