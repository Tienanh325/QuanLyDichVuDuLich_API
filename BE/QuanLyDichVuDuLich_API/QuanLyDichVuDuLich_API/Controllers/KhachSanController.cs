using Microsoft.AspNetCore.Mvc;
using BLL;
using Models;

namespace QuanLyDichVuDuLich_API.Controllers
{
    [Route("api/QLKhachSan")]
    [ApiController]
    public class KhachSansController : ControllerBase
    {
        private readonly KhachSanBLL _bll;

        public KhachSansController(KhachSanBLL bll)
        {
            _bll = bll;
        }

        // =============================
        // Lấy danh sách khách sạn
        // =============================
        [Route("KhachSan_GetAll")]
        [HttpGet]
        public IActionResult GetAll()
        {
            var list = _bll.GetAll(out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            return Ok(list);
        }

        // =============================
        // Lấy khách sạn theo ID
        // =============================
        [Route("KhachSan_GetByID")]
        [HttpGet]
        public IActionResult GetById(int id)
        {
            var khachsan = _bll.GetByIdKhachSan(id, out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            if (khachsan == null)
                return NotFound();

            return Ok(khachsan);
        }

        // =============================
        // Thêm khách sạn
        // =============================
        [Route("KhachSan_Create")]
        [HttpPost]
        public IActionResult Create([FromBody] KhachSan khachsan)
        {
            bool ok = _bll.CreateKhachSan(khachsan, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Created successfully" });
        }

        // =============================
        // Cập nhật khách sạn
        // =============================
        [Route("KhachSan_Update")]
        [HttpPost]
        public IActionResult Update(int id, [FromBody] KhachSan khachsan)
        {
            bool ok = _bll.UpdateKhachSan(id, khachsan, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Updated successfully" });
        }

        // =============================
        // Xóa khách sạn
        // =============================
        [Route("KhachSan_Delete")]
        [HttpDelete]
        public IActionResult Delete(int id)
        {
            bool ok = _bll.DeleteKhachSan(id, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Deleted successfully" });
        }

        // =============================
        // Tìm kiếm theo tên khách sạn
        // =============================
        [Route("KhachSan_Search")]
        [HttpGet]
        public IActionResult Search(string ten)
        {
            var list = _bll.Search(ten, out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            return Ok(list);
        }

        // =============================
        // Lọc khách sạn theo điều kiện
        // =============================
        [Route("KhachSan_Filter")]
        [HttpGet]
        public IActionResult Filter(string viTri, string loaiPhong, double? minPrice, double? maxPrice, string danhGia)
        {
            var list = _bll.GetAll(out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            if (!string.IsNullOrEmpty(viTri))
                list = list.Where(x => x.viTri.ToLower().Contains(viTri.ToLower())).ToList();

            if (!string.IsNullOrEmpty(loaiPhong))
                list = list.Where(x => x.moTa.ToLower().Contains(loaiPhong.ToLower())).ToList();

            if (minPrice != null)
                list = list.Where(x => x.gia >= minPrice).ToList();

            if (maxPrice != null)
                list = list.Where(x => x.gia <= maxPrice).ToList();

            if (!string.IsNullOrEmpty(danhGia))
                list = list.Where(x => x.danhGia.Contains(danhGia)).ToList();

            return Ok(list);
        }
    }
}