import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Divider } from "antd";
import { Briefcase } from "lucide-react";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";
import "../assets/css/CustomerBookings.css";

// --- MOCK DATA ---
const bookings: any[] = [];
// const transactions: any[] = []; // Not used directly in this UI as requested, just linking to history

function EmptyBookingCard() {
  return (
    <div className="bookings-card">
      <div className="bookings-empty-state">
        <div className="bookings-empty-icon">
          <Briefcase size={80} strokeWidth={1} />
        </div>
        <div className="bookings-empty-text">
          <h3>Không tìm thấy đặt chỗ</h3>
          <p>
            Mọi chỗ bạn đặt sẽ được hiển thị tại đây. Hiện bạn chưa có bất kỳ đặt chỗ nào, hãy đặt trên trang chủ ngay!
          </p>
        </div>
      </div>
    </div>
  );
}

function CurrentBookingSection() {
  return (
    <div className="bookings-section">
      <h2 className="bookings-section-title">Vé điện tử & phiếu thanh toán hiện hành</h2>
      {bookings.length === 0 ? (
        <EmptyBookingCard />
      ) : (
        <div className="bookings-card">
          {/* List of bookings would go here */}
          <p>Danh sách vé điện tử...</p>
        </div>
      )}
    </div>
  );
}

function TransactionHistorySection() {
  return (
    <div className="bookings-section">
      <h2 className="bookings-section-title">Lịch sử giao dịch</h2>
      <div className="bookings-card">
        <Link to="/mua-sam/giao-dich" className="bookings-link">
          Xem Lịch sử giao dịch của bạn
        </Link>
      </div>
    </div>
  );
}

export default function CustomerBookings() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <CustomerSidebar activeKey="bookings" />

        <div className="bookings-content">
          <CurrentBookingSection />
          
          <TransactionHistorySection />
          
          <Divider className="bookings-divider">
            BookingHistory.mercBottomTitle
          </Divider>
        </div>
      </div>
    </div>
  );
}
