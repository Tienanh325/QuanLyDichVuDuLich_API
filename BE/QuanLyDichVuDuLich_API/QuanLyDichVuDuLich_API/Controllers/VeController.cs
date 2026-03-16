using System.Collections.Generic;
using BLL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using QuanLyDichVuDuLich_API.Data;

namespace QuanLyDichVuDuLich_API.Controllers
{
    [Route("api/Ve")]
    [ApiController]
    public class VeController : ControllerBase
    {
        private readonly VeBLL _bll;
        private readonly TravelBookingContext _context;

        public VeController(VeBLL bll, TravelBookingContext context)
        {
            _bll = bll;
            _context = context;
        }

        [Route("Ve_GetAll")]
        [HttpGet]
        public IActionResult GetAll()
        {
            var list = _bll.GetAll(out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            return Ok(list);
        }

        [Route("Ve_GetByID")]
        [HttpGet]
        public IActionResult GetById(int id)
        {
            var ve = _bll.GetByIdVe(id, out string error);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            if (ve == null)
                return NotFound();

            return Ok(ve);
        }

        [Route("Ve_Create")]
        [HttpPost]
        public IActionResult Create([FromBody] Ve ve)
        {
            bool ok = _bll.CreateVe(ve, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Created successfully" });
        }

        [Route("Ve_Update")]
        [HttpPost]
        public IActionResult Update(int id, [FromBody] Ve ve)
        {
            bool ok = _bll.UpdateVe(id, ve, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Updated successfully" });
        }

        [Route("Ve_Delete")]
        [HttpDelete]
        public IActionResult Delete(int id)
        {
            bool ok = _bll.DeleteVe(id, out string error);

            if (!ok)
                return BadRequest(error);

            return Ok(new { message = "Deleted successfully" });
        }


        [Route("Ve_Search")]
        [HttpGet]
        public IActionResult Search(
            string? diemDen,
            string? loaiVe,
            double? minPrice,
            double? maxPrice,
            DateTime? ngayKhoiHanh)
        {
            string error = string.Empty;
            var list = from v in _context.Set<Ve>() 
                       join l in _context.Set<LoaiVe>() 
                       on v.LoaiVeID equals l.LoaiVeID
                       select new
                       {
                           v.MaVe,
                           v.maDichVu,
                           v.TenVe,
                           v.DiemKhoiHanh,
                           v.DiemDen,
                           v.NgayKhoiHanh,
                           v.Gia,
                           v.SoChoTrong,
                           v.Hang,
                           TenLoai = l.TenLoaiVe
                       };

            if (!string.IsNullOrEmpty(error))
                    return StatusCode(500, error);

            // Tìm theo vị trí
            if (!string.IsNullOrEmpty(diemDen))
            {
                list = list.Where(x => x.DiemDen != null &&
                       x.DiemDen.ToLower().Contains(diemDen.ToLower()));
            }

            if (!string.IsNullOrEmpty(loaiVe))
            {
                list = list.Where(x => x.TenLoai.ToLower()
                .Contains(loaiVe.ToLower()));
            }

            if (minPrice.HasValue)
            {
                list = list.Where(x => x.Gia >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                list = list.Where(x => x.Gia <= maxPrice.Value);
            }

            if (ngayKhoiHanh.HasValue)
            {
                list = list.Where(x => x.NgayKhoiHanh.HasValue &&
                                       x.NgayKhoiHanh.Value.Date == ngayKhoiHanh.Value.Date);
            }

            return Ok(list.ToList());
        }
        }
    }
