using Microsoft.AspNetCore.Mvc;
using BLL;
using System.Data;
using Models;

namespace QuanLyDichVuDuLich_API.Controllers
{
    [Route("api/QLTaiKhoan")]
    [ApiController]
    public class TaiKhoansController : ControllerBase
    {
        private readonly TaiKhoanBLL _bll;

        public TaiKhoansController(TaiKhoanBLL bll)
        {
            _bll = bll;
        }
        [Route("TaiKhoan_GetAll")]
        [HttpGet]
        public IActionResult GetAll()
        {
            var list = _bll.GetAll(out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            return Ok(list);
        }
        [Route("TaiKhoan_GetByID")]
        [HttpGet]
        public IActionResult GetById(int id)
        {
            var taikhoan = _bll.GetByIdTaiKhoan(id, out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            if (taikhoan == null)
                return NotFound();

            return Ok(taikhoan);
        }
        [Route("TaiKhoan_Create")]
        [HttpPost]
        public IActionResult Create([FromBody] TaiKhoan taikhoan)
        {
            bool ok = _bll.CreateTaiKhoan(taikhoan, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Created" });
        }

        [Route("TaiKhoan_Update")]
        [HttpPost]
        public IActionResult Update(int id, [FromBody] TaiKhoan taikhoan)
        {
            bool ok = _bll.UpdateTaiKhoan(id, taikhoan, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Updated successfully" });
        }
    }
}
