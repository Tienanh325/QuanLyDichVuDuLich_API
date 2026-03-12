using System;
using System.Collections.Generic;

namespace Models
{
    public partial class NhaCungCap
    {
        public int MaNhaCungCap { get; set; }

        public string Ten { get; set; }

        public string Email { get; set; }

        public string SoDienThoai { get; set; }

        public string DiaChi { get; set; }

        public string Loai { get; set; }

        public string TrangThai { get; set; }

        public virtual ICollection<DichVu> DichVus { get; set; } = new List<DichVu>();
    }
}