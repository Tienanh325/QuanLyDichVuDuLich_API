import { Routes, Route, Navigate } from 'react-router-dom';
import ThongKe from '../pages/ThongKe';
import DichVu from '../pages/DichVu';
import LoaiVe from '../pages/LoaiVe';
import KhachSan from '../pages/KhachSan';
import Tour from '../pages/Tour';
import Ve from '../pages/Ve';
import VeMayBay from '../pages/VeMayBayt';
import VeTauHoa from '../pages/VeTauHoa';
import VeKhuVuiChoi from '../pages/VeKhuVuiChoi';
import KhuyenMai from '../pages/KhuyenMai';
import DanhGia from '../pages/DanhGia';
import DonHang from '../pages/DonHang';
import NhaCungCap from '../pages/NhaCungcap';
import KhachHang from '../pages/KhachHang';
import MainLayout from '../layouts/mainLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import DangNhap from '../pages/DangNhap';
import DangKy from '../pages/DangKy';
import HomeCustomer from '../pages/homecustomer';
import HotelCustomer from '../pages/HotelCustomer';

export default function RoutesIndex() {
  return (
    <Routes>
      <Route path="/dang-nhap" element={<DangNhap />} />
      <Route path="/dang-ky" element={<DangKy />} />
      <Route path="/mua-sam" element={<CustomerLayout />}>
        <Route index element={<HomeCustomer />} />
        <Route path="khach-san" element={<HotelCustomer />} />
      </Route>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/ThongKe" replace />} />
        <Route path="ThongKe" element={<ThongKe />} />
        <Route path="DichVu" element={<DichVu />} />
        <Route path="LoaiVe" element={<LoaiVe />} />
        <Route path="KhachSan" element={<KhachSan />} />
        <Route path="Tour" element={<Tour />} />
        <Route path="Ve" element={<Ve />} />
        <Route path="VeMayBay" element={<VeMayBay />} />
        <Route path="VeTauHoa" element={<VeTauHoa />} />
        <Route path="VeKhuVuiChoi" element={<VeKhuVuiChoi />} />
        <Route path="KhuyenMai" element={<KhuyenMai />} />
        <Route path="DanhGia" element={<DanhGia />} />
        <Route path="DonHang" element={<DonHang />} />
        <Route path="NhaCungCap" element={<NhaCungCap />} />
        <Route path="KhachHang" element={<KhachHang />} />
      </Route>
      <Route path="*" element={<Navigate to="/dang-nhap" replace />} />
    </Routes>
  );
}
