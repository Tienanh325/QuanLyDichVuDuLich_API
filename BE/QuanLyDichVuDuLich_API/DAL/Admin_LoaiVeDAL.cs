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
    public class Admin_LoaiVeDAL
    {
        private readonly DatabaseHelper _db;

        public Admin_LoaiVeDAL(DatabaseHelper db)
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

        public bool InsertLoaiVe(LoaiVe loaive, out string error)
        {
            string sql =
                $"INSERT INTO LoaiVe ( TenLoaiVe) " +
                $"VALUES ('{loaive.TenLoaiVe}')";

            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
        }
        public bool UpdateLoaiVe(LoaiVe loaive, out string error)
        {
            if (loaive.LoaiVeID <= 0)
            {
                error = "Invalid LoaiVe";
                return false;
            }

            string sql = "UPDATE LoaiVe SET " +
                $"TenLoaiVe = {loaive.TenLoaiVe.Replace("'", "''")}, " +
                $"WHERE LoaiVeID = {loaive.LoaiVeID}";

            error = _db.ExecuteNoneQuery(sql);
            return string.IsNullOrEmpty(error);
        }
        public bool DeleteLoaiVe(int id, out string error)
        {
            string sql = $"DELETE FROM LoaiVe WHERE LoaiVeID={id}";

            error = _db.ExecuteNoneQuery(sql);

            return string.IsNullOrEmpty(error);
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

