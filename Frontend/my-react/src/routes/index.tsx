import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Categories from   '../pages/Categories';
import Products from '../pages/Products';
import Discounts from '../pages/Discounts';
import Coupons from '../pages/Coupons';
import Orders from '../pages/Orders';
import Customers from '../pages/Customers';
import Settings from '../pages/Settings';
import MainLayout from '../layouts/mainLayout';

export default function RoutesIndex() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/ThongKe" replace />} />
        <Route path="Thongke" element={<Dashboard />} />
        <Route path="LoaiVe" element={<Categories />} />
        <Route path="KhachSan" element={<Products />} />
        <Route path="Tour" element={<Home />} />
        <Route path="Ve" element={<Orders />} />
        <Route path="VeMayBay" element={<Orders />} />
        <Route path="VeTauHoa" element={<Orders />} />
        <Route path="VeKhuVuiChoi" element={<Orders />} />
        <Route path="KhuyenMai" element={<Discounts />} />
        <Route path="DanhGia" element={<Coupons />} />
        <Route path="DonHang" element={<Orders />} />
        <Route path="NhaCungCap" element={<Customers />} />
        <Route path="KhachHang" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/ThongKe" replace />} />
    </Routes>
  );
}
