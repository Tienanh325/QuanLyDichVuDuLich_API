export type BookingServiceType = "hotel" | "flight" | "train" | "tour";

export interface StoredBookingInfo {
  maDon: number;
  tongGia: number;
  serviceType: BookingServiceType;
  serviceLabel: string;
  serviceName: string;
  title: string;
  subtitle?: string;
  primaryDetail?: string;
  secondaryDetail?: string;
  startDate?: string;
  endDate?: string;
  quantityLabel?: string;
  priceLabel?: string;
  tenKhachSan?: string;
  tenLoaiPhong?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  giaPhong?: number;
  rooms?: number | string;
  adults?: number | string;
  khachSanId?: string;
  origin?: string;
  destination?: string;
  timeLabel?: string;
  passengers?: number | string;
}

const BOOKING_INFO_KEY = "travelhub_booking_info";
const BOOKING_ORDER_KEY = "travelhub_maDon";

export function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + " VND";
}

export function formatDate(dateStr?: string) {
  if (!dateStr) return "Chưa chọn";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
}

export function getBookingCode(booking: Pick<StoredBookingInfo, "maDon">) {
  return `#${booking.maDon}`;
}

export function saveBookingInfo(booking: StoredBookingInfo) {
  localStorage.setItem(BOOKING_ORDER_KEY, String(booking.maDon));
  localStorage.setItem(BOOKING_INFO_KEY, JSON.stringify(booking));
}

export function readBookingInfo(): StoredBookingInfo | null {
  const raw = localStorage.getItem(BOOKING_INFO_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredBookingInfo>;
    if (!parsed.maDon) return null;

    const serviceType = parsed.serviceType ?? "hotel";
    const title = parsed.title ?? parsed.serviceName ?? parsed.tenKhachSan ?? "Đặt chỗ";
    const subtitle = parsed.subtitle ?? parsed.tenLoaiPhong;
    const serviceName = parsed.serviceName ?? title;

    return {
      maDon: Number(parsed.maDon),
      tongGia: Number(parsed.tongGia ?? 0),
      serviceType,
      serviceLabel: parsed.serviceLabel ?? getDefaultServiceLabel(serviceType),
      serviceName,
      title,
      subtitle,
      primaryDetail: parsed.primaryDetail,
      secondaryDetail: parsed.secondaryDetail,
      startDate: parsed.startDate ?? parsed.checkIn,
      endDate: parsed.endDate ?? parsed.checkOut,
      quantityLabel: parsed.quantityLabel,
      priceLabel: parsed.priceLabel,
      tenKhachSan: parsed.tenKhachSan,
      tenLoaiPhong: parsed.tenLoaiPhong,
      checkIn: parsed.checkIn,
      checkOut: parsed.checkOut,
      nights: parsed.nights,
      giaPhong: parsed.giaPhong,
      rooms: parsed.rooms,
      adults: parsed.adults,
      khachSanId: parsed.khachSanId,
      origin: parsed.origin,
      destination: parsed.destination,
      timeLabel: parsed.timeLabel,
      passengers: parsed.passengers,
    };
  } catch {
    return null;
  }
}

export function clearBookingInfo() {
  localStorage.removeItem(BOOKING_INFO_KEY);
  localStorage.removeItem(BOOKING_ORDER_KEY);
}

function getDefaultServiceLabel(serviceType: BookingServiceType) {
  switch (serviceType) {
    case "flight":
      return "Vé máy bay";
    case "train":
      return "Vé tàu";
    case "tour":
      return "Tour & Hoạt động";
    default:
      return "Khách sạn";
  }
}
