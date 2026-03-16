using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class LoaiVe
    {
        public int LoaiVeID { get; set; }
        public string TenLoaiVe { get; set; }
        public virtual ICollection<Ve> Ves { get; set; }
    }
}
