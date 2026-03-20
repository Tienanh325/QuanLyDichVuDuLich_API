using Microsoft.AspNetCore.Mvc;
using BLL;

namespace QuanLyDichVuDuLich_API.Controllers
{
    [Route("api/User/loaive")]
    [ApiController]
    public class User_LoaiVeController : ControllerBase
    {
        private readonly User_LoaiVeBLL _bll;

        public User_LoaiVeController(User_LoaiVeBLL bll)
        {
            _bll = bll;
        }

        [Route("LoaiVe_GetAllLoaiVe")]
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
            var nhacungcap = _bll.GetByIdLoaiVe(id, out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            if (nhacungcap == null)
                return NotFound();

            return Ok(nhacungcap);
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
