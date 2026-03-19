using BLL;
using Microsoft.AspNetCore.Mvc;
using Models;
using QuanLyDichVuDuLich_API.Data;
using static BLL.User_DanhGiaBLL;

namespace QuanLyDichVuDuLich_API.Controllers
{
    [Route("api/DanhGia")]
    [ApiController]
    public class User_DanhGiaController : ControllerBase
    {
        private readonly User_DanhGiaBLL _bll;
        private readonly TravelBookingContext _context;

        public User_DanhGiaController(User_DanhGiaBLL bll, TravelBookingContext context)
        {
            _bll = bll;
            _context = context;
        }

        // ===============================
        // 🔹 Lấy tất cả đánh giá theo dịch vụ
        // ===============================
        [HttpGet("by-dichvu/{maDichVu}")]
        public IActionResult GetByDichVu(int maDichVu)
        {
            var data = _bll.GetDanhGiaByDichVu(maDichVu, out string error);

            if (!string.IsNullOrEmpty(error))
                return BadRequest(error);

            return Ok(data);
        }

        // ===============================
        // 🔹 Lấy đánh giá theo ID
        // ===============================
        [HttpGet("get-by-id/{id}")]
        public IActionResult GetById(int id)
        {
            var data = _bll.GetByIdDanhGia(id, out string error);

            if (!string.IsNullOrEmpty(error))
                return BadRequest(error);

            if (data == null)
                return NotFound();

            return Ok(data);
        }

        // ===============================
        // 🔹 Tạo đánh giá (QUAN TRỌNG)
        // ===============================
        [HttpPost("create")]
        public IActionResult Create([FromBody] DanhGia model)
        {
            if (model == null)
                return BadRequest("Dữ liệu không hợp lệ");

            var result = _bll.CreateDanhGia(model, out string error);

            if (!result)
                return BadRequest(error);

            return Ok(new
            {
                message = "Đánh giá thành công"
            });
        }

        // ===============================
        // 🔹 Cập nhật đánh giá
        // ===============================
        [HttpPut("update")]
        public IActionResult Update([FromBody] DanhGia model)
        {
            if (model == null || model.maDanhGia <= 0)
                return BadRequest("Dữ liệu không hợp lệ");

            var result = _bll.UpdateDanhGia(model, out string error);

            if (!result)
                return BadRequest(error);

            return Ok(new
            {
                message = "Cập nhật thành công"
            });
        }

        // ===============================
        // 🔹 Xóa đánh giá
        // ===============================
        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            var result = _bll.DeleteDanhGia(id, out string error);

            if (!result)
                return BadRequest(error);

            return Ok(new
            {
                message = "Xóa thành công"
            });
        }

        // ===============================
        // 🔹 Lấy rating trung bình
        // ===============================
        [HttpGet("avg/{maDichVu}")]
        public IActionResult GetAverage(int maDichVu)
        {
            var avg = _bll.GetAverageDanhGia(maDichVu);

            return Ok(new
            {
                maDichVu,
                average = avg
            });
        }

        // ===============================
        // 🔹 Check đã mua chưa
        // ===============================
        [HttpGet("check-purchased")]
        public IActionResult CheckPurchased(int maNguoiDung, int maDichVu)
        {
            var result = _bll.CheckPurchased(maNguoiDung, maDichVu);

            return Ok(new
            {
                purchased = result
            });
        }

        // ===============================
        // 🔹 Check đã đánh giá chưa
        // ===============================
        [HttpGet("check-reviewed")]
        public IActionResult CheckReviewed(int maNguoiDung, int maDichVu)
        {
            var result = _bll.CheckExistsDanhGia(maNguoiDung, maDichVu);

            return Ok(new
            {
                reviewed = result
            });
        }


    }
}
