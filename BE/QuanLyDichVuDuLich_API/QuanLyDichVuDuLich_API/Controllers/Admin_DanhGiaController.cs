namespace QuanLyDichVuDuLich_API.Controllers
{
    using BLL;
    using Microsoft.AspNetCore.Mvc;
    using Models;
    using System.Linq;

    namespace API.Controllers
    {
        [Route("api/admin/danhgia")]
        [ApiController]
        public class Admin_DanhGiaController : ControllerBase
        {
            private readonly Admin_DanhGiaBLL _bll;

            public Admin_DanhGiaController(Admin_DanhGiaBLL bll)
            {
                _bll = bll;
            }

            // ===============================
            // 🔹 Lấy tất cả đánh giá
            // ===============================
            [HttpGet("get-all")]
            public IActionResult GetAll()
            {
                var data = _bll.GetAllDanhGia(out string error);

                if (!string.IsNullOrEmpty(error))
                    return BadRequest(error);

                return Ok(data);
            }

            // ===============================
            // 🔹 Tìm kiếm đánh giá
            // ===============================
            [HttpGet("search")]
            public IActionResult Search(string? keyword, int? soSao)
            {
                var data = _bll.Search(keyword, soSao, out string error);

                if (!string.IsNullOrEmpty(error))
                    return BadRequest(error);

                return Ok(data);
            }

            // ===============================
            // 🔹 Lấy theo dịch vụ
            // ===============================
            [HttpGet("by-dichvu/{maDichVu}")]
            public IActionResult GetByDichVu(int maDichVu)
            {
                var data = _bll.GetByDichVu(maDichVu, out string error);

                if (!string.IsNullOrEmpty(error))
                    return BadRequest(error);

                return Ok(data);
            }

            // ===============================
            // 🔹 Xóa đánh giá (QUAN TRỌNG)
            // ===============================
            [HttpDelete("delete/{id}")]
            public IActionResult Delete(int id)
            {
                var result = _bll.Delete(id, out string error);

                if (!result)
                    return BadRequest(error);

                return Ok(new
                {
                    message = "Admin đã xóa đánh giá"
                });
            }

            // ===============================
            // 🔹 Thống kê theo dịch vụ
            // ===============================
            [HttpGet("stats/{maDichVu}")]
            public IActionResult Stats(int maDichVu)
            {
                var data = _bll.GetStats(maDichVu, out string error);

                if (!string.IsNullOrEmpty(error))
                    return BadRequest(error);

                return Ok(data);
            }
        }
    }
}
