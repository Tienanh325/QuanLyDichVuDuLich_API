using Microsoft.AspNetCore.Mvc;
using Models;
using QuanLyDichVuDuLich_API.Data;

namespace QuanLyDichVuDuLich_API.Controllers
{
    [Route("api/admin/dichvu")]
    [ApiController]
    public class Admin_DichVuController : ControllerBase
    {
        private readonly TravelBookingContext _context;

        public Admin_DichVuController(TravelBookingContext context)
        {
            _context = context;
        }

        // ========================
        // 1. TẠO DỊCH VỤ + LOẠI
        // ========================
        [HttpPost("create")]
        public IActionResult Create(DichVu dv, string loai)
        {
            using var tran = _context.Database.BeginTransaction();

            try
            {
                _context.DichVu.Add(dv);
                _context.SaveChanges();

                if (loai == "tour")
                    _context.Tour.Add(new Tour { MaDichVu = dv.MaDichVu });

                else if (loai == "khachsan")
                    _context.KhachSan.Add(new KhachSan { MaDichVu = dv.MaDichVu });

                else if (loai == "ve")
                    _context.Ve.Add(new Ve { MaDichVu = dv.MaDichVu });

                _context.SaveChanges();
                tran.Commit();

                return Ok(dv);
            }
            catch (Exception ex)
            {
                tran.Rollback();
                return BadRequest(ex.Message);
            }
        }

        // ========================
        // 2. CẬP NHẬT
        // ========================
        [HttpPut("update")]
        public IActionResult Update(DichVu dv)
        {
            _context.DichVu.Update(dv);
            _context.SaveChanges();

            return Ok();
        }

        // ========================
        // 3. XÓA
        // ========================
        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            var dv = _context.DichVu.Find(id);
            if (dv == null) return NotFound();

            if (dv.ChiTietDon.Any())
                return BadRequest("Đã phát sinh đơn");

            _context.DichVu.Remove(dv);
            _context.SaveChanges();

            return Ok();
        }

        // ========================
        // 4. ẨN / HIỆN
        // ========================
        [HttpPut("toggle/{id}")]
        public IActionResult Toggle(int id)
        {
            var dv = _context.DichVu.Find(id);

            dv.TrangThai = dv.TrangThai == "Active" ? "Inactive" : "Active";

            _context.SaveChanges();

            return Ok(dv.TrangThai);
        }

        // ========================
        // 5. QUẢN LÝ ĐÁNH GIÁ
        // ========================
        [HttpGet("review")]
        public IActionResult GetReview()
        {
            return Ok(_context.DanhGia.ToList());
        }

        [HttpDelete("review/{id}")]
        public IActionResult DeleteReview(int id)
        {
            var dg = _context.DanhGia.Find(id);
            _context.DanhGia.Remove(dg);
            _context.SaveChanges();

            return Ok();
        }

        // ========================
        // 6. THỐNG KÊ
        // ========================
        [HttpGet("thongke")]
        public IActionResult ThongKe()
        {
            var data = new
            {
                TongDichVu = _context.DichVu.Count(),
                TongDon = _context.ChiTietDon.Count(),

                DoanhThu = _context.ChiTietDon
                    .Sum(x => x.SoLuong * x.Gia),

                Top = _context.ChiTietDon
                    .GroupBy(x => x.MaDichVu)
                    .Select(g => new
                    {
                        MaDichVu = g.Key,
                        SoLuong = g.Sum(x => x.SoLuong)
                    })
                    .OrderByDescending(x => x.SoLuong)
                    .Take(5)
            };

            return Ok(data);
        }
    }
}
