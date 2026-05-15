import { formatVnd } from "./money";

export type BookingServiceType = "hotel" | "flight" | "train" | "tour" | "activity";

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
  baseAmount?: number;
  taxFee?: number;
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
const BOOKING_LIST_KEY = "travelhub_booking_list";
const BOOKING_ORDER_KEY = "travelhub_maDon";

export { formatVnd };

export function formatDate(dateStr?: string) {
  if (!dateStr) return "Chưa chọn";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
}

export function getBookingCode(booking: Pick<StoredBookingInfo, "maDon">) {
  return `#${booking.maDon}`;
}

function normalizeBookingInfo(parsed: Partial<StoredBookingInfo>): StoredBookingInfo | null {
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
    baseAmount: Number(parsed.baseAmount ?? 0),
    taxFee: Number(parsed.taxFee ?? 0),
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
}

export function saveBookingInfo(booking: StoredBookingInfo) {
  localStorage.setItem(BOOKING_ORDER_KEY, String(booking.maDon));
  localStorage.setItem(BOOKING_INFO_KEY, JSON.stringify(booking));

  const bookings = readAllBookingInfo().filter((item) => item.maDon !== booking.maDon);
  bookings.unshift(normalizeBookingInfo(booking) ?? booking);
  localStorage.setItem(BOOKING_LIST_KEY, JSON.stringify(bookings));
}

export function readBookingInfo(): StoredBookingInfo | null {
  const raw = localStorage.getItem(BOOKING_INFO_KEY);
  if (!raw) return null;

  try {
    return normalizeBookingInfo(JSON.parse(raw) as Partial<StoredBookingInfo>);
  } catch {
    return null;
  }
}

export function readAllBookingInfo(): StoredBookingInfo[] {
  const raw = localStorage.getItem(BOOKING_LIST_KEY);
  if (!raw) {
    const currentBooking = readBookingInfo();
    return currentBooking ? [currentBooking] : [];
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredBookingInfo>[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => normalizeBookingInfo(item))
      .filter((item): item is StoredBookingInfo => item !== null);
  } catch {
    return [];
  }
}

export function clearBookingInfo() {
  localStorage.removeItem(BOOKING_INFO_KEY);
  localStorage.removeItem(BOOKING_LIST_KEY);
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
