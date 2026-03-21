using BLL;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace QuanLyDichVuDuLich_API.Controllers
{
    [Route("api/Admin/QLLoaiVe")]
    [ApiController]
    public class Admin_LoaiVeController : ControllerBase
    {
        private readonly Admin_LoaiVeBLL _bll;

        public Admin_LoaiVeController(Admin_LoaiVeBLL bll)
        {
            _bll = bll;
        }

        [Route("LoaiVe_GetAll")]
        [HttpGet]
        public IActionResult GetAllLoaiVe()
        {
            var list = _bll.GetAllLoaiVe(out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            return Ok(list);
        }

        [Route("LoaiVe_GetByID")]
        [HttpGet]
        public IActionResult GetByIdLoaiVe(int id)
        {
            var tour = _bll.GetByIdLoaiVe(id, out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            if (tour == null)
                return NotFound();

            return Ok(tour);
        }

        [Route("LoaiVe_Create")]
        [HttpPost]
        public IActionResult CreateLoaiVe([FromBody] LoaiVe loaive)
        {
            bool ok = _bll.CreateLoaiVe(loaive, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Created successfully" });
        }

        [Route("LoaiVe_Update")]
        [HttpPost]
        public IActionResult UpdateLoaiVe(int id, [FromBody] LoaiVe loaive)
        {
            bool ok = _bll.UpdateLoaiVe(id, loaive, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Updated successfully" });
        }

        [Route("LoaiVe_Delete")]
        [HttpDelete]
        public IActionResult DeleteLoaiVe(int id)
        {
            bool ok = _bll.DeleteLoaiVe(id, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Deleted successfully" });
        }

        [Route("LoaiVe_Search")]
        [HttpGet]
        public IActionResult SearchLoaiVe(string ten)
        {
            var list = _bll.Search(ten, out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            return Ok(list);
        }
    }
}
