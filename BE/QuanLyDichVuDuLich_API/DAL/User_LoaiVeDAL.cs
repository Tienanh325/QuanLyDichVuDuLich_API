using DAL.Helper;
using Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class User_LoaiVeDAL
    {
        private readonly DatabaseHelper _db;

        public User_LoaiVeDAL(DatabaseHelper db)
        {
            _db = db;
        }

        public List<LoaiVe> GetAllLoaiVe(out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable("SELECT * FROM LoaiVe", out error);

            var list = new List<LoaiVe>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new LoaiVe
                {
                    LoaiVeID = (int)row["LoaiVeID"],
                    TenLoaiVe = row["TenLoaiVe"].ToString()
                });
            }

            return list;
        }

        public LoaiVe GetByIdLoaiVe(int id, out string error)
        {
            error = "";
            var dt = _db.ExecuteQueryToDataTable($"SELECT * FROM LoaiVe WHERE LoaiVeID={id}", out error);

            if (!string.IsNullOrEmpty(error) || dt == null || dt.Rows.Count == 0)
                return null;

            var row = dt.Rows[0];

            return new LoaiVe
            {
                LoaiVeID = (int)row["LoaiVeID"],
                TenLoaiVe = row["TenLoaiVe"].ToString()
            };
        }
        public List<LoaiVe> SearchByname(string Ten, out string error)
        {
            error = "";

            var dt = _db.ExecuteQueryToDataTable(
                $"SELECT * FROM LoaiVe WHERE TenLoaiVe LIKE '%{Ten}%'", out error);

            var list = new List<LoaiVe>();

            if (!string.IsNullOrEmpty(error) || dt == null)
                return list;

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new LoaiVe
                {
                    LoaiVeID = (int)row["LoaiVeID"],
                    TenLoaiVe = row["TenLoaiVe"].ToString()
                });
            }

            return list;
        }
    }
}
