using DAL.Helper;
using DAL;
using Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class TourBLL
    {
        private readonly TourDAL _dal;
        private readonly DatabaseHelper _db;

        public TourBLL(TourDAL dal, DatabaseHelper db)
        {
            _dal = dal;
            _db = db;
        }

        public List<Tour> GetAll(out string error)
        {
            return _dal.GetAllTour(out error);
        }

        public Tour GetByIdTour(int id, out string error)
        {
            return _dal.GetTourById(id, out error);
        }

        public bool CreateTour(Tour tour, out string error)
        {
            if (string.IsNullOrWhiteSpace(tour.Ten))
            {
                error = "Ten is required";
                return false;
            }

            return _dal.InsertTour(tour, out error);
        }
        public bool UpdateTour(int id, Tour tour, out string error)
        {
            if (id <= 0)
            {
                error = "Invalid user id";
                return false;
            }

            if (string.IsNullOrWhiteSpace(tour.Ten))
            {
                error = "Username is required";
                return false;
            }

            tour.MaTour = id;

            return _dal.UpdateTour(tour, out error);
        }
        public List<Tour> Search(string username, out string error)
        {
            return _dal.SearchByname(username, out error);
        }
        public bool DeleteTour(int id, out string error)
        {
            error = string.Empty;
            try
            {
                return _dal.DeleteTour(id, out error);
            }
            catch (Exception ex)
            {
                error = ex.Message;
                return false;
            }
        }
    }
}
