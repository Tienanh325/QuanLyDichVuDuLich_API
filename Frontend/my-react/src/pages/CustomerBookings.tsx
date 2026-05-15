import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, CalendarDays, CreditCard, Hash, MapPin, Ticket } from "lucide-react";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";
import { formatDate, formatVnd, getBookingCode, readBookingInfo } from "../utils/bookingStorage";
import type { StoredBookingInfo } from "../utils/bookingStorage";
import "../assets/css/CustomerBookings.css";

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

function CurrentBookingSection({ booking }: { booking: StoredBookingInfo | null }) {
  return (
    <div className="bookings-section">
      <h2 className="bookings-section-title">Vé điện tử & phiếu thanh toán hiện hành</h2>
      {booking ? <ElectronicTicket booking={booking} /> : <EmptyBookingCard />}
    </div>
  );
}

function ElectronicTicket({ booking }: { booking: StoredBookingInfo }) {
  const detailDate = booking.primaryDetail ?? `${formatDate(booking.startDate ?? booking.checkIn)} → ${formatDate(booking.endDate ?? booking.checkOut)}`;
  const title = booking.title ?? booking.serviceName;
  const subtitle = booking.subtitle ?? booking.tenLoaiPhong ?? booking.secondaryDetail;

  return (
    <div className="booking-ticket-card">
      <div className="booking-ticket-header">
        <div>
          <span className="booking-ticket-badge">{booking.serviceLabel}</span>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="booking-ticket-code">
          <span>Mã đặt chỗ</span>
          <strong>{getBookingCode(booking)}</strong>
        </div>
      </div>

      <div className="booking-ticket-body">
        <div className="booking-ticket-main">
          <div className="booking-ticket-qr">
            <Ticket size={44} />
            <span>VÉ ĐIỆN TỬ</span>
          </div>
          <div className="booking-ticket-status">Đã thanh toán</div>
        </div>

        <div className="booking-ticket-details">
          <div className="booking-ticket-row">
            <CalendarDays size={18} />
            <span>Thời gian</span>
            <strong>{detailDate}</strong>
          </div>
          <div className="booking-ticket-row">
            <MapPin size={18} />
            <span>Chi tiết</span>
            <strong>{booking.secondaryDetail ?? booking.quantityLabel ?? "Đã xác nhận"}</strong>
          </div>
          <div className="booking-ticket-row">
            <CreditCard size={18} />
            <span>Thanh toán</span>
            <strong>{booking.priceLabel ?? formatVnd(booking.tongGia)}</strong>
          </div>
          <div className="booking-ticket-row">
            <Hash size={18} />
            <span>Loại vé</span>
            <strong>{booking.serviceLabel}</strong>
          </div>
        </div>
      </div>

      <div className="booking-ticket-actions">
        <button type="button" className="booking-ticket-primary">Xem phiếu</button>
        <Link to="/mua-sam/giao-dich" className="booking-ticket-secondary">Lịch sử giao dịch</Link>
      </div>
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
  const [booking, setBooking] = useState<StoredBookingInfo | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    queueMicrotask(() => setBooking(readBookingInfo()));
  }, []);

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <CustomerSidebar activeKey="bookings" />

        <div className="bookings-content">
          <CurrentBookingSection booking={booking} />
          
          <TransactionHistorySection />
        </div>
      </div>
    </div>
  );
}
