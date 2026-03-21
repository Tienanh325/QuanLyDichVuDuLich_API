using Microsoft.AspNetCore.Mvc;
using Models;
using QuanLyDichVuDuLich_API.Data;

namespace QuanLyDichVuDuLich_API.Controllers
{
    [Route("api/dichvu")]
    [ApiController]
    public class User_DichVuController : ControllerBase
    {
        private readonly TravelBookingContext _context;

        public User_DichVuController(TravelBookingContext context)
        {
            _context = context;
        }

        // ========================
        // 1. LẤY TẤT CẢ DỊCH VỤ
        // ========================
        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            var data = _context.DichVu
                .Where(x => x.TrangThai == "Active")
                .Select(x => new
                {
                    x.MaDichVu,
                    x.Ten,
                    x.Gia,
                    x.LoaiDichVu,

                    Loai = x.KhachSan.Any() ? "KhachSan" :
                           x.Tour.Any() ? "Tour" : "Ve",

                    SoDanhGia = x.DanhGia.Count(),
                    DanhGiaTB = x.DanhGia.Any() ? x.DanhGia.Average(d => d.SoSao) : 0
                });

            return Ok(data);
        }

        // ========================
        // 2. LỌC THEO LOẠI
        // ========================
        [HttpGet("by-type")]
        public IActionResult GetByType(string loai)
        {
            var query = _context.DichVu.AsQueryable();

            if (loai == "khachsan")
                query = query.Where(x => x.KhachSan.Any());

            else if (loai == "tour")
                query = query.Where(x => x.Tour.Any());

            else if (loai == "ve")
                query = query.Where(x => x.Ve.Any());

            return Ok(query);
        }

        // ========================
        // 3. TÌM KIẾM (GIỐNG IVIVU)
        // ========================
        [HttpGet("search")]
        public IActionResult Search(string keyword, string loai, double? min, double? max)
        {
            var query = _context.DichVu.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.Ten.Contains(keyword));

            if (!string.IsNullOrEmpty(loai))
                query = query.Where(x => x.LoaiDichVu == loai);

            if (min.HasValue)
                query = query.Where(x => x.Gia >= min);

            if (max.HasValue)
                query = query.Where(x => x.Gia <= max);

            return Ok(query);
        }

        // ========================
        // 4. CHI TIẾT DỊCH VỤ
        // ========================
        [HttpGet("detail/{id}")]
        public IActionResult Detail(int id)
        {
            var dv = _context.DichVu
                .Where(x => x.MaDichVu == id)
                .Select(x => new
                {
                    x.MaDichVu,
                    x.Ten,
                    x.MoTa,
                    x.Gia,
                    x.LoaiDichVu,

                    NhaCungCap = x.NhaCungCap.Ten,

                    Loai = x.KhachSan.Any() ? "KhachSan" :
                           x.Tour.Any() ? "Tour" : "Ve",

                    KhachSan = x.KhachSan,
                    Tour = x.Tour,
                    Ve = x.Ve,

                    DanhGia = x.DanhGia
                }).FirstOrDefault();

            return Ok(dv);
        }

        // ========================
        // 5. THÊM VÀO GIỎ HÀNG
        // ========================
        [HttpPost("add-to-cart")]
        public IActionResult AddToCart(int maDon, int maDichVu, int soLuong)
        {
            var dv = _context.DichVu.Find(maDichVu);
            if (dv == null) return BadRequest("Không tồn tại dịch vụ");

            var ct = new ChiTietDon
            {
                MaDon = maDon,
                MaDichVu = maDichVu,
                SoLuong = soLuong,
                Gia = dv.Gia
            };

            _context.ChiTietDon.Add(ct);
            _context.SaveChanges();

            return Ok(ct);
        }

        // ========================
        // 6. GIỎ HÀNG
        // ========================
        [HttpGet("cart/{maDon}")]
        public IActionResult GetCart(int maDon)
        {
            var data = _context.ChiTietDon
                .Where(x => x.MaDon == maDon)
                .Select(x => new
                {
                    x.MaChiTietDon,
                    x.SoLuong,
                    x.Gia,

                    DichVu = new
                    {
                        x.DichVu.MaDichVu,
                        x.DichVu.Ten,

                        Loai = x.DichVu.KhachSan.Any() ? "KhachSan" :
                               x.DichVu.Tour.Any() ? "Tour" : "Ve"
                    }
                });

            return Ok(data);
        }

        // ========================
        // 7. THANH TOÁN
        // ========================
        [HttpPost("checkout/{maDon}")]
        public IActionResult Checkout(int maDon)
        {
            var list = _context.ChiTietDon.Where(x => x.MaDon == maDon);

            var tong = list.Sum(x => x.SoLuong * x.Gia);

            var don = _context.Don.Find(maDon);
            don.TongTien = tong;
            don.TrangThai = "DaThanhToan";

            _context.SaveChanges();

            return Ok(new { TongTien = tong });
        }

        // ========================
        // 8. ĐÁNH GIÁ
        // ========================
        [HttpPost("review")]
        public IActionResult Review(DanhGia dg)
        {
            _context.DanhGia.Add(dg);
            _context.SaveChanges();

            return Ok();
        }
    }
}
