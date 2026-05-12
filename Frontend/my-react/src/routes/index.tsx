import { Routes, Route, Navigate } from 'react-router-dom';
import AdminThongKe from '../pages/AdminThongKe';
import AdminDichVu from '../pages/AdminDichVu';
import AdminLoaiVe from '../pages/AdminLoaiVe';
import AdminKhachSan from '../pages/AdminKhachSan';
import AdminTour from '../pages/AdminTour';
import AdminVe from '../pages/AdminVe';
import AdminVeMayBay from '../pages/AdminVeMayBay';
import AdminVeTauHoa from '../pages/AdminVeTauHoa';
import AdminKhuyenMai from '../pages/AdminKhuyenMai';
import AdminDanhGia from '../pages/AdminDanhGia';
import AdminDonHang from '../pages/AdminDonHang';
import AdminNhaCungCap from '../pages/AdminNhaCungCap';
import AdminKhachHang from '../pages/AdminKhachHang';
import AdminCauHinhHeThong from '../pages/AdminCauHinhHeThong';
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import DangNhap from '../pages/DangNhap';
import DangKy from '../pages/DangKy';
import CustomerFlight from '../pages/CustomerFlight';
import CustomerHome from '../pages/CustomerHome';
import CustomerHotel from '../pages/CustomerHotel';
import CustomerTrainTicket from '../pages/CustomerTrainTicket';
import CustomerActivity from '../pages/CustomerActivity';
import CustomerHotelDetail from '../pages/CustomerHotelDetail';
import CheckoutKhachSan from '../pages/CheckoutKhachSan';
import PaymentKhachSan from '../pages/PaymentKhachSan';
import SuccessKhachSan from '../pages/SuccessKhachSan';
import CustomerTransactions from '../pages/CustomerTransactions';
import CustomerProfile from '../pages/CustomerProfile';
import CustomerBookings from '../pages/CustomerBookings';
import CustomerTrainSearchResults from '../pages/CustomerTrainSearchResults';
import CustomerActivitySearchResults from '../pages/CustomerActivitySearchResults';
import CustomerActivityDetail from '../pages/CustomerActivityDetail';
import CustomerTrainDetail from '../pages/CustomerTrainDetail';
import CustomerFlightDetail from '../pages/CustomerFlightDetail';

export default function RoutesIndex() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dang-nhap" replace />} />
      <Route path="/dang-nhap" element={<DangNhap />} />
      <Route path="/dang-ky" element={<DangKy />} />
      <Route path="/mua-sam" element={<CustomerLayout />}>
        <Route index element={<CustomerHome />} />
        <Route path="khach-san" element={<CustomerHotel />} />
        <Route path="ve-may-bay" element={<CustomerFlight />} />
        <Route path="chi-tiet-chuyen-bay/:id" element={<CustomerFlightDetail />} />
        <Route path="ve-tau" element={<CustomerTrainTicket />} />
        <Route path="hoat-dong-vui-choi" element={<CustomerActivity />} />
        <Route path="giao-dich" element={<CustomerTransactions />} />
        <Route path="tai-khoan" element={<CustomerProfile />} />
        <Route path="dat-cho-cua-toi" element={<CustomerBookings />} />
        <Route path="khach-san/:id" element={<CustomerHotelDetail />} />
        <Route path="thanh-toan-khach-san" element={<CheckoutKhachSan />} />
        <Route path="thanh-toan-dat-cho" element={<PaymentKhachSan />} />
        <Route path="thanh-toan-thanh-cong" element={<SuccessKhachSan />} />
        <Route path="ket-qua-tau" element={<CustomerTrainSearchResults />} />
        <Route path="chi-tiet-tau/:id" element={<CustomerTrainDetail />} />
        <Route path="ket-qua-hoat-dong" element={<CustomerActivitySearchResults />} />
        <Route path="hoat-dong-vui-choi/:id" element={<CustomerActivityDetail />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="ThongKe" replace />} />
        <Route path="ThongKe" element={<AdminThongKe />} />
        <Route path="DichVu" element={<AdminDichVu />} />
        <Route path="LoaiVe" element={<AdminLoaiVe />} />
        <Route path="KhachSan" element={<AdminKhachSan />} />
        <Route path="Tour" element={<AdminTour />} />
        <Route path="Ve" element={<AdminVe />} />
        <Route path="VeMayBay" element={<AdminVeMayBay />} />
        <Route path="VeTauHoa" element={<AdminVeTauHoa />} />
        <Route path="VeKhuVuiChoi" element={<Navigate to="Tour" replace />} />
        <Route path="KhuyenMai" element={<AdminKhuyenMai />} />
        <Route path="DanhGia" element={<AdminDanhGia />} />
        <Route path="DonHang" element={<AdminDonHang />} />
        <Route path="NhaCungCap" element={<AdminNhaCungCap />} />
        <Route path="KhachHang" element={<AdminKhachHang />} />
        <Route path="CauHinhHeThong" element={<AdminCauHinhHeThong />} />
      </Route>
      <Route path="*" element={<Navigate to="/dang-nhap" replace />} />
    </Routes>
  );
}
