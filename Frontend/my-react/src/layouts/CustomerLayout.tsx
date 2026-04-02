import { Outlet } from "react-router-dom";
import FooterCustomer from "../components/Footer/FooterCustomer";
import HeaderCustomer from "../components/Header/HeaderCustomer";
import "../assets/css/CustomerLayout.css";

export default function CustomerLayout() {
  return (
    <div className="customer-layout">
      <HeaderCustomer />
      <main className="customer-layout__main">
        <Outlet />
      </main>
      <FooterCustomer />
    </div>
  );
}
