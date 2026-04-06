import { Routes, Route, Navigate } from 'react-router-dom';
import AdminThongKe from '../pages/AdminThongKe';
import AdminDichVu from '../pages/AdminDichVu';
import AdminLoaiVe from '../pages/AdminLoaiVe';
import AdminKhachSan from '../pages/AdminKhachSan';
import AdminTour from '../pages/AdminTour';
import AdminVe from '../pages/AdminVe';
import AdminVeMayBay from '../pages/AdminVeMayBay';
import AdminVeTauHoa from '../pages/AdminVeTauHoa';
import AdminVeKhuVuiChoi from '../pages/AdminVeKhuVuiChoi';
import AdminKhuyenMai from '../pages/AdminKhuyenMai';
import AdminDanhGia from '../pages/AdminDanhGia';
import AdminDonHang from '../pages/AdminDonHang';
import AdminNhaCungCap from '../pages/AdminNhaCungCap';
import AdminKhachHang from '../pages/AdminKhachHang';
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import DangNhap from '../pages/DangNhap';
import DangKy from '../pages/DangKy';
import CustomerFlight from '../pages/CustomerFlight';
import CustomerHome from '../pages/CustomerHome';
import CustomerHotel from '../pages/CustomerHotel';
import CustomerBusTicket from '../pages/CustomerBusTicket';
import CustomerAirportTransfer from '../pages/CustomerAirportTransfer';
import CustomerCarRental from '../pages/CustomerCarRental';
import CustomerActivity from '../pages/CustomerActivity';

export default function RoutesIndex() {
  return (
    <Routes>
      <Route path="/dang-nhap" element={<DangNhap />} />
      <Route path="/dang-ky" element={<DangKy />} />
      <Route path="/mua-sam" element={<CustomerLayout />}>
        <Route index element={<CustomerHome />} />
        <Route path="khach-san" element={<CustomerHotel />} />
        <Route path="ve-may-bay" element={<CustomerFlight />} />
        <Route path="ve-xe-khach" element={<CustomerBusTicket />} />
        <Route path="dua-don-san-bay" element={<CustomerAirportTransfer />} />
        <Route path="cho-thue-xe" element={<CustomerCarRental />} />
        <Route path="hoat-dong-vui-choi" element={<CustomerActivity />} />
      </Route>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/ThongKe" replace />} />
        <Route path="ThongKe" element={<AdminThongKe />} />
        <Route path="DichVu" element={<AdminDichVu />} />
        <Route path="LoaiVe" element={<AdminLoaiVe />} />
        <Route path="KhachSan" element={<AdminKhachSan />} />
        <Route path="Tour" element={<AdminTour />} />
        <Route path="Ve" element={<AdminVe />} />
        <Route path="VeMayBay" element={<AdminVeMayBay />} />
        <Route path="VeTauHoa" element={<AdminVeTauHoa />} />
        <Route path="VeKhuVuiChoi" element={<AdminVeKhuVuiChoi />} />
        <Route path="KhuyenMai" element={<AdminKhuyenMai />} />
        <Route path="DanhGia" element={<AdminDanhGia />} />
        <Route path="DonHang" element={<AdminDonHang />} />
        <Route path="NhaCungCap" element={<AdminNhaCungCap />} />
        <Route path="KhachHang" element={<AdminKhachHang />} />
      </Route>
      <Route path="*" element={<Navigate to="/dang-nhap" replace />} />
    </Routes>
  );
}
