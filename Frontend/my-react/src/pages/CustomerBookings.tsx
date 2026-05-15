import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, CalendarDays, CreditCard, Hash, MapPin, Ticket } from "lucide-react";
import { Spin } from "antd";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";
import { formatDate, formatVnd, getBookingCode } from "../utils/bookingStorage";
import { getMyOrders, type DonDatDetail } from "../services/donDatService";
import "../assets/css/CustomerBookings.css";

interface BookingTicketViewModel {
  maDon: number;
  tongGia: number;
  serviceLabel: string;
  title: string;
  subtitle?: string;
  primaryDetail?: string;
  secondaryDetail?: string;
  paymentStatus: string;
}

function formatRange(start?: string | null, end?: string | null) {
  if (start && end) return `${formatDate(start)} → ${formatDate(end)}`;
  return formatDate(start ?? end ?? undefined);
}

function mapOrderToBooking(order: DonDatDetail): BookingTicketViewModel {
  const firstItem = order.chiTietDon?.[0];
  const rawType = firstItem?.loaiDichVu?.trim() || "Dịch vụ";
  const serviceLabel = rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase();
  const soLuong = firstItem?.soLuong ?? 1;

  return {
    maDon: order.maDon,
    tongGia: order.tongGia,
    serviceLabel,
    title: firstItem?.tenDichVu || "Dịch vụ Travel",
    subtitle: rawType,
    primaryDetail: formatRange(firstItem?.ngayBatDauSuDung, firstItem?.ngayKetThucSuDung),
    secondaryDetail: `Số lượng: ${soLuong}`,
    paymentStatus: order.trangThai,
  };
}

function getPaymentStatusLabel(status: string) {
  const normalizedStatus = String(status || "").toUpperCase();
  if (normalizedStatus === "COMPLETED") return "Thành công";
  if (["CANCELLED", "DA_HUY"].includes(normalizedStatus)) return "Đã hủy";
  return "Chờ xác nhận";
}

function isCurrentBooking(status: string) {
  return status !== "DA_HUY";
}

function LoadingSection() {
  return (
    <div className="bookings-card" style={{ textAlign: "center", padding: "48px 24px" }}>
      <Spin size="large" />
    </div>
  );
}

function EmptyBookingCard() {
  return (
    <div className="bookings-card">
      <div className="bookings-empty-state">
        <div className="bookings-empty-icon">
          <Briefcase size={80} strokeWidth={1} />
        </div>
        <div className="bookings-empty-text">
          <h3>Không tìm thấy đặt chỗ</h3>
          <p>Mọi chỗ bạn đặt sẽ được hiển thị tại đây. Hiện bạn chưa có bất kỳ đặt chỗ nào, hãy đặt trên trang chủ ngay!</p>
        </div>
      </div>
    </div>
  );
}

function CurrentBookingSection({ bookings, loading }: { bookings: BookingTicketViewModel[]; loading: boolean }) {
  return (
    <div className="bookings-section">
      <h2 className="bookings-section-title">Vé điện tử & phiếu thanh toán hiện hành</h2>
      {loading ? <LoadingSection /> : bookings.length > 0 ? bookings.map((booking) => <ElectronicTicket key={booking.maDon} booking={booking} />) : <EmptyBookingCard />}
    </div>
  );
}

function ElectronicTicket({ booking }: { booking: BookingTicketViewModel }) {
  return (
    <div className="booking-ticket-card">
      <div className="booking-ticket-header">
        <div>
          <span className="booking-ticket-badge">{booking.serviceLabel}</span>
          <h3>{booking.title}</h3>
          {booking.subtitle && <p>{booking.subtitle}</p>}
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
          <div className="booking-ticket-status">{getPaymentStatusLabel(booking.paymentStatus)}</div>
        </div>

        <div className="booking-ticket-details">
          <div className="booking-ticket-row">
            <CalendarDays size={18} />
            <span>Thời gian</span>
            <strong>{booking.primaryDetail ?? "Chưa xác nhận"}</strong>
          </div>
          <div className="booking-ticket-row">
            <MapPin size={18} />
            <span>Chi tiết</span>
            <strong>{booking.secondaryDetail ?? "Đã xác nhận"}</strong>
          </div>
          <div className="booking-ticket-row">
            <CreditCard size={18} />
            <span>Thanh toán</span>
            <strong>{formatVnd(booking.tongGia)}</strong>
          </div>
          <div className="booking-ticket-row">
            <Hash size={18} />
            <span>Loại vé</span>
            <strong>{booking.serviceLabel}</strong>
          </div>
        </div>
      </div>

      <div className="booking-ticket-actions">
        <Link to={`/mua-sam/dat-cho-cua-toi/${booking.maDon}`} className="booking-ticket-primary">Xem phiếu</Link>
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
  const [bookings, setBookings] = useState<BookingTicketViewModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    void fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      const res = await getMyOrders({ limit: 50 });
      const currentBookings = (res.data || [])
        .filter((order) => isCurrentBooking(order.trangThai))
        .map(mapOrderToBooking);
      setBookings(currentBookings);
    } catch (error) {
      console.error("Lỗi khi tải phiếu thanh toán:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <CustomerSidebar activeKey="bookings" />

        <div className="bookings-content">
          <CurrentBookingSection bookings={bookings} loading={loading} />
          <TransactionHistorySection />
        </div>
      </div>
    </div>
  );
}
