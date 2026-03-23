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
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="home" element={<Home />} />
         <Route path="categories" element={<Categories />} />
        <Route path="products" element={<Products />} />
        <Route path="discounts" element={<Discounts />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
