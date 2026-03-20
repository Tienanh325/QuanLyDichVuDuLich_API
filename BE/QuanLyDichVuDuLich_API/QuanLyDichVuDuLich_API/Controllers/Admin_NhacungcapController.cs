using BLL;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace QuanLyDichVuDuLich_API.Controllers
{
    [Route("api/Admin/QLNhaCungCap")]
    [ApiController]
    public class Admin_NhacungcapController : ControllerBase
    {
        private readonly Admin_NhacungcapBLL _bll;

        public Admin_NhacungcapController(Admin_NhacungcapBLL bll)
        {
            _bll = bll;
        }


        [Route("NhaCungCap_GetAllNhaCungCap")]
        [HttpGet]
        public IActionResult GetAllNhaCungCap()
        {
            var list = _bll.GetAllNhaCungCap(out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            return Ok(list);
        }

        // =============================
        // Lấy NhaCungCap theo ID
        // =============================
        [Route("NhaCungCap_GetByID")]
        [HttpGet]
        public IActionResult GetByIdNhaCungCap(int id)
        {
            var nhacungcap = _bll.GetByIdNhaCungCap(id, out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            if (nhacungcap == null)
                return NotFound();

            return Ok(nhacungcap);
        }

        // =============================
        // Thêm NhaCungCap
        // =============================
        [Route("NhaCungCap_Create")]
        [HttpPost]
        public IActionResult CreateNhaCungCap([FromBody] NhaCungCap nhacungcap)
        {
            bool ok = _bll.CreateNhaCungCap(nhacungcap, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Created successfully" });
        }

        // =============================
        // Cập nhật NhaCungCap
        // =============================
        [Route("NhaCungCap_Update")]
        [HttpPost]
        public IActionResult UpdateNhaCungCap(int id, [FromBody] NhaCungCap nhacungcap)
        {
            bool ok = _bll.UpdateNhaCungCap(id, nhacungcap, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Updated successfully" });
        }

        // =============================
        // Xóa NhaCungCap
        // =============================
        [Route("NhaCungCap_Delete")]
        [HttpDelete]
        public IActionResult DeleteNhaCungCap(int id)
        {
            bool ok = _bll.DeleteNhaCungCap(id, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Deleted successfully" });
        }

        // =============================
        // Tìm kiếm theo tên NhaCungCap
        // =============================
        [Route("NhaCungCap_Search")]
        [HttpGet]
        public IActionResult SearchNhaCungCap(string ten)
        {
            var list = _bll.Search(ten, out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            return Ok(list);
        }
    }
}
