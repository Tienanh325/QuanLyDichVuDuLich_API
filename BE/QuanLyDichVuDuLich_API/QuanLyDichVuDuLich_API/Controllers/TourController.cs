using Microsoft.AspNetCore.Mvc;
using BLL;
using Models;

namespace QuanLyDichVuDuLich_API.Controllers
{
    [Route("api/QLTour")]
    [ApiController]
    public class ToursController : ControllerBase
    {
        private readonly TourBLL _bll;

        public ToursController(TourBLL bll)
        {
            _bll = bll;
        }

        // =============================
        // Lấy danh sách tour
        // =============================
        [Route("Tour_GetAll")]
        [HttpGet]
        public IActionResult GetAll()
        {
            var list = _bll.GetAll(out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            return Ok(list);
        }

        // =============================
        // Lấy tour theo ID
        // =============================
        [Route("Tour_GetByID")]
        [HttpGet]
        public IActionResult GetById(int id)
        {
            var tour = _bll.GetByIdTour(id, out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            if (tour == null)
                return NotFound();

            return Ok(tour);
        }

        // =============================
        // Thêm tour
        // =============================
        [Route("Tour_Create")]
        [HttpPost]
        public IActionResult Create([FromBody] Tour tour)
        {
            bool ok = _bll.CreateTour(tour, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Created successfully" });
        }

        // =============================
        // Cập nhật tour
        // =============================
        [Route("Tour_Update")]
        [HttpPost]
        public IActionResult Update(int id, [FromBody] Tour tour)
        {
            bool ok = _bll.UpdateTour(id, tour, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Updated successfully" });
        }

        // =============================
        // Xóa tour
        // =============================
        [Route("Tour_Delete")]
        [HttpDelete]
        public IActionResult Delete(int id)
        {
            bool ok = _bll.DeleteTour(id, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Deleted successfully" });
        }

        // =============================
        // Tìm kiếm theo tên tour
        // =============================
        [Route("Tour_Search")]
        [HttpGet]
        public IActionResult Search(string ten)
        {
            var list = _bll.Search(ten, out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            return Ok(list);
        }

        // =============================
        // Tìm kiếm nâng cao giống giao diện
        // =============================
        [Route("Tour_Filter")]
        [HttpGet]
        public IActionResult Filter(string viTri, DateTime? ngayKhoiHanh, double? minPrice, double? maxPrice, string danhGia)
        {
            var list = _bll.GetAll(out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            // lọc theo địa điểm
            if (!string.IsNullOrEmpty(viTri))
            {
                list = list.Where(x => x.ViTri.ToLower().Contains(viTri.ToLower())).ToList();
            }

            // lọc theo ngày khởi hành
            if (ngayKhoiHanh != null)
            {
                list = list.Where(x => x.NgayBatDau.HasValue && x.NgayBatDau.Value.Date == ngayKhoiHanh.Value.Date).ToList();
            }

            // lọc giá thấp nhất
            if (minPrice != null)
            {
                list = list.Where(x => x.Gia >= minPrice).ToList();
            }

            // lọc giá cao nhất
            if (maxPrice != null)
            {
                list = list.Where(x => x.Gia <= maxPrice).ToList();
            }

            // lọc đánh giá
            if (!string.IsNullOrEmpty(danhGia))
            {
                list = list.Where(x => x.DanhGia.Contains(danhGia)).ToList();
            }

            return Ok(list);
        }
    }
}