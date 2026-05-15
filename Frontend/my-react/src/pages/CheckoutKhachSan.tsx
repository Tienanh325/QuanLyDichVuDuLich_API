import { useState, useEffect, type ReactNode } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatVnd } from "../utils/money";
import {
  Contact,
  UserCircle,
  Settings2,
  Star,
  BedDouble,
  ShieldCheck,
  Loader2,
  Plane,
  Train,
  MapPinned,
  CalendarDays,
  Users,
  Luggage,
} from "lucide-react";
import "../assets/css/checkoutkhachsan.css";
import hotelRoomImg from "../assets/images/hotel_room_deluxe.png";
import { getCurrentSession } from "../utils/auth";
import { createDonDat } from "../services/donDatService";
import { saveBookingInfo } from "../utils/bookingStorage";

// --- HELPERS ---

function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}


function formatDate(dateStr: string) {
  if (!dateStr) return "Chưa chọn";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
}

// --- SUB-COMPONENTS ---

function StepProgress() {
  return (
    <div className="step-progress">
      <div className="step-item active">
        <div className="step-circle">1</div>
        <div className="step-label">Thông tin khách hàng</div>
      </div>
      <div className="step-line" />
      <div className="step-item">
        <div className="step-circle">2</div>
        <div className="step-label">Thanh toán</div>
      </div>
      <div className="step-line" />
      <div className="step-item">
        <div className="step-circle">3</div>
        <div className="step-label">Hoàn tất</div>
      </div>
    </div>
  );
}

interface ContactFormProps {
  hoTen: string;
  sdt: string;
  email: string;
  isGuest: boolean;
  serviceType: string;
  onHoTenChange: (v: string) => void;
  onSdtChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onIsGuestChange: (v: boolean) => void;
}

function ContactForm({ hoTen, sdt, email, isGuest, serviceType, onHoTenChange, onSdtChange, onEmailChange, onIsGuestChange }: ContactFormProps) {
  return (
    <div className="checkout-card">
      <div className="card-header">
        <Contact size={22} />
        Thông tin liên hệ
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{serviceType === 'flight' || serviceType === 'train' ? 'Họ và tên (như trên giấy tờ tùy thân)' : 'Họ và tên (như trên CCCD/Hộ chiếu)'}</label>
          <input
            type="text"
            className="form-input"
            placeholder="VD: Nguyễn Văn A"
            value={hoTen}
            onChange={(e) => onHoTenChange(e.target.value)}
            required
          />
          <div className="form-hint">{serviceType === 'flight' ? 'Vui lòng nhập đúng tên để khớp thông tin làm thủ tục chuyến bay.' : serviceType === 'train' ? 'Vui lòng nhập đúng tên để khớp thông tin vé tàu.' : serviceType === 'tour' ? 'Vui lòng nhập đúng tên để nhà cung cấp xác nhận danh sách tham gia.' : 'Vui lòng nhập tên đúng định dạng để nhận diện tại quầy.'}</div>
        </div>

        <div className="form-group">
          <label className="form-label">Số điện thoại</label>
          <div className="phone-input-group">
            <span className="phone-prefix">+84</span>
            <input
              type="text"
              className="form-input"
              placeholder="912 345 678"
              value={sdt}
              onChange={(e) => onSdtChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-input"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
        <div className="form-hint">Voucher xác nhận sẽ được gửi đến địa chỉ email này.</div>
      </div>

      <label className="checkbox-wrap">
        <input type="checkbox" checked={isGuest} onChange={(e) => onIsGuestChange(e.target.checked)} />
        <span className="checkbox-label">{serviceType === 'flight' || serviceType === 'train' ? 'Tôi là hành khách' : serviceType === 'tour' ? 'Tôi là người tham gia' : 'Tôi là khách lưu trú'}</span>
      </label>
    </div>
  );
}

function SpecialRequest({ serviceType }: { serviceType: string }) {
  const requestConfig: Record<string, { title: string; description: string; items: string[] }> = {
    hotel: {
      title: 'Yêu cầu đặc biệt',
      description: 'Mặc dù chúng tôi không thể đảm bảo tất cả các yêu cầu sẽ được đáp ứng, khách sạn sẽ cố gắng hỗ trợ tốt nhất.',
      items: ['Phòng không hút thuốc', 'Giường lớn', 'Nhận phòng sớm', 'Phòng yên tĩnh'],
    },
    flight: {
      title: 'Tùy chọn chuyến bay',
      description: 'Các lựa chọn thêm sẽ được nhà cung cấp xác nhận theo điều kiện vé và khả năng phục vụ.',
      items: ['Ghế ngồi gần cửa sổ', 'Suất ăn đặc biệt', 'Thêm hành lý ký gửi', 'Ưu tiên làm thủ tục'],
    },
    train: {
      title: 'Tùy chọn chuyến tàu',
      description: 'Một số yêu cầu phụ thuộc vào khoang tàu và tình trạng chỗ thực tế tại thời điểm xác nhận.',
      items: ['Ngồi cùng khoang', 'Ghế cạnh cửa sổ', 'Hỗ trợ người lớn tuổi', 'Ưu tiên gần cửa ra vào'],
    },
    tour: {
      title: 'Yêu cầu cho hoạt động',
      description: 'Thông tin thêm sẽ giúp nhà cung cấp chuẩn bị trải nghiệm phù hợp hơn cho đoàn của bạn.',
      items: ['Đón tại khách sạn', 'Hướng dẫn viên tiếng Việt', 'Phù hợp trẻ em', 'Ăn chay / dị ứng thực phẩm'],
    },
  };

  const config = requestConfig[serviceType] ?? requestConfig.hotel;

  return (
    <div className="checkout-card">
      <div className="card-header">
        <Settings2 size={22} />
        {config.title}
      </div>

      <p style={{ fontSize: "14px", color: "#4a5a6a", marginBottom: "16px", lineHeight: "1.5" }}>
        {config.description}
      </p>

      <div className="special-request-grid">
        {config.items.map((req) => (
          <label key={req} className="special-request-item">
            <input type="checkbox" />
            <span>{req}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ServiceInfoPanel({ serviceType, primaryDetail, secondaryDetail, subtitle }: { serviceType: string; primaryDetail: string; secondaryDetail: string; subtitle: string }) {
  const itemsByType: Record<string, { icon: ReactNode; label: string; value: string }[]> = {
    hotel: [
      { icon: <CalendarDays size={18} />, label: 'Lịch lưu trú', value: primaryDetail },
      { icon: <Users size={18} />, label: 'Thông tin phòng', value: secondaryDetail },
      { icon: <BedDouble size={18} />, label: 'Loại phòng', value: subtitle },
    ],
    flight: [
      { icon: <Plane size={18} />, label: 'Ngày bay', value: primaryDetail },
      { icon: <Users size={18} />, label: 'Hành khách', value: secondaryDetail },
      { icon: <Luggage size={18} />, label: 'Hạng vé', value: subtitle },
    ],
    train: [
      { icon: <Train size={18} />, label: 'Ngày đi', value: primaryDetail },
      { icon: <Users size={18} />, label: 'Ghế đã chọn', value: subtitle },
      { icon: <CalendarDays size={18} />, label: 'Hành trình', value: secondaryDetail },
    ],
    tour: [
      { icon: <MapPinned size={18} />, label: 'Ngày tham gia', value: primaryDetail },
      { icon: <Users size={18} />, label: 'Số khách', value: secondaryDetail },
      { icon: <CalendarDays size={18} />, label: 'Điểm đến', value: subtitle },
    ],
  };

  const items = itemsByType[serviceType] ?? itemsByType.hotel;

  return (
    <div className="checkout-card">
      <div className="card-header">
        {serviceType === 'flight' ? <Plane size={22} /> : serviceType === 'train' ? <Train size={22} /> : serviceType === 'tour' ? <MapPinned size={22} /> : <BedDouble size={22} />}
        Thông tin dịch vụ
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((item) => (
          <div key={`${item.label}-${item.value}`} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', border: '1px solid #e5edf5', borderRadius: 12, background: '#f8fbff' }}>
            <div style={{ color: '#0194F3', marginTop: 2 }}>{item.icon}</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{item.value || 'Chưa cập nhật'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getOrderType(serviceType: string): 'HOTEL' | 'FLIGHT' | 'TRAIN' | 'ACTIVITY' {
  switch (serviceType) {
    case 'flight':
      return 'FLIGHT';
    case 'train':
      return 'TRAIN';
    case 'tour':
      return 'ACTIVITY';
    default:
      return 'HOTEL';
  }
}

function getSubmitLabel(serviceType: string) {
  switch (serviceType) {
    case 'flight':
      return 'Đang giữ chỗ chuyến bay...';
    case 'train':
      return 'Đang giữ chỗ tàu...';
    case 'tour':
      return 'Đang đặt hoạt động...';
    default:
      return 'Đang đặt chỗ...';
  }
}

function getErrorLabel(serviceType: string) {
  switch (serviceType) {
    case 'flight':
      return 'Đặt vé máy bay';
    case 'train':
      return 'Đặt vé tàu';
    case 'tour':
      return 'Đặt hoạt động';
    default:
      return 'Đặt phòng';
  }
}

interface BookingSummaryProps {
  serviceLabel: string;
  title: string;
  subtitle: string;
  primaryDetail: string;
  secondaryDetail: string;
  quantityLabel: string;
  baseAmount: number;
  taxFee: number;
  total: number;
}

function BookingSummary({ serviceLabel, title, subtitle, primaryDetail, secondaryDetail, quantityLabel, baseAmount, taxFee, total }: BookingSummaryProps) {
  return (
    <>
      <div className="checkout-card hotel-summary-card">
        <div className="hotel-thumbnail">
          <div className="hotel-badge">{serviceLabel || "Đặt chỗ"}</div>
          <img src={hotelRoomImg} alt="Dịch vụ đã chọn" />
        </div>

        <div className="hotel-info-body">
          <h3 className="hotel-name">{title || "Dịch vụ đã chọn"}</h3>
          <div className="hotel-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={14} fill="currentColor" stroke="none" />
            ))}
          </div>

          <div className="room-meta">
            <BedDouble size={18} className="room-meta-icon" />
            <div>
              <span className="room-meta-text">{subtitle || serviceLabel}</span>
              <span className="room-meta-sub">{secondaryDetail || "Thông tin đặt chỗ"}</span>
            </div>
          </div>

          <div className="booking-dates">
            <div className="date-block">
              <div className="date-label">Ngày sử dụng</div>
              <div className="date-value">{primaryDetail || "Chưa chọn"}</div>
            </div>
            <div className="date-block">
              <div className="date-label">Dịch vụ</div>
              <div className="date-value">{serviceLabel || "Đặt chỗ"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="checkout-card">
        <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#0d1b2e", marginBottom: "16px" }}>
          Chi tiết giá
        </h4>

        <div className="price-row">
          <span className="price-label">{quantityLabel || "Giá dịch vụ"}</span>
          <span className="price-value">{formatVnd(baseAmount)}</span>
        </div>
        <div className="price-row">
          <span className="price-label">Thuế và phí dịch vụ (10%)</span>
          <span className="price-value">{formatVnd(taxFee)}</span>
        </div>

        <div className="price-total">
          <span className="price-total-label">Tổng cộng</span>
          <div className="price-total-value">
            <span className="price-total-amount">{formatVnd(total)}</span>
            <span className="price-total-tax">Đã bao gồm VAT</span>
          </div>
        </div>
      </div>

      <div className="security-box">
        <ShieldCheck size={20} />
        <span className="security-text">Bảo mật thông tin &amp; Thanh toán an toàn 100%.</span>
      </div>
    </>
  );
}

// --- MAIN COMPONENT ---

export default function CheckoutKhachSan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Đọc params từ URL
  const serviceType = searchParams.get("serviceType") ?? "hotel";
  const serviceLabel = searchParams.get("serviceLabel") ?? "Khách sạn";
  const khachSanId = searchParams.get("khachSanId") ?? "";
  const maDichVu = searchParams.get("maDichVu") ?? "";
  const loaiPhongId = searchParams.get("loaiPhongId") ?? "";
  const maPhanLoaiDichVu = searchParams.get("maPhanLoaiDichVu") ?? loaiPhongId;
  const tenLoaiPhong = searchParams.get("tenLoaiPhong") ?? "";
  const giaPhong = Number(searchParams.get("giaPhong") ?? "0");
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const adults = searchParams.get("adults") ?? "2";
  const rooms = searchParams.get("rooms") ?? "1";
  const tenKhachSan = searchParams.get("tenKhachSan") ?? "";
  const title = searchParams.get("title") ?? tenKhachSan ?? "Dịch vụ đã chọn";
  const subtitle = searchParams.get("subtitle") ?? tenLoaiPhong;
  const primaryDetail = searchParams.get("primaryDetail") ?? (checkIn && checkOut ? `${formatDate(checkIn)} → ${formatDate(checkOut)}` : formatDate(checkIn));
  const secondaryDetail = searchParams.get("secondaryDetail") ?? `${rooms} phòng, ${adults} khách`;
  const quantityLabel = searchParams.get("quantityLabel") ?? `Giá phòng (${rooms} phòng)`;
  const quantity = Number(searchParams.get("quantity") ?? rooms ?? "1") || 1;
  const unitPrice = Number(searchParams.get("unitPrice") ?? giaPhong ?? "0");
  const directPrice = Number(searchParams.get("price") ?? "0");
  const startDate = searchParams.get("startDate") ?? checkIn;
  const endDate = searchParams.get("endDate") ?? checkOut;

  const nights = calculateNights(checkIn, checkOut);
  const baseAmount = directPrice || giaPhong * nights * Number(rooms);
  const taxFee = Math.round(baseAmount * 0.1);
  const total = baseAmount + taxFee;

  // Form state
  const [hoTen, setHoTen] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  const [isGuest, setIsGuest] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill nếu đã đăng nhập
  const session = getCurrentSession();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (session) {
      setHoTen(session.fullName ?? "");
      setEmail(session.email ?? "");
    }
  }, [session]);

  async function handleContinue() {
    if (!hoTen.trim() || !email.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ họ tên và email.");
      return;
    }
    if (!maDichVu || unitPrice <= 0) {
      setErrorMsg("Thông tin dịch vụ không hợp lệ. Vui lòng quay lại và chọn lại.");
      return;
    }

    // Kiểm tra đăng nhập
    if (!session) {
      navigate("/dang-nhap", { state: { from: window.location.pathname + window.location.search } });
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const donDat = await createDonDat({
        loaiDon: getOrderType(serviceType),
        chiTietList: [{
          maDichVu: Number(maDichVu),
          maPhanLoaiDichVu: maPhanLoaiDichVu ? Number(maPhanLoaiDichVu) : null,
          soLuong: quantity,
          giaTaiThoiDiemMua: unitPrice,
          ngayBatDauSuDung: startDate || null,
          ngayKetThucSuDung: endDate || null,
        }],
        thongTinDatCho: {
          hoTenLienHe: hoTen.trim(),
          emailLienHe: email.trim(),
          sdtLienHe: sdt.trim() || null,
          laNguoiSuDung: isGuest,
        },
      });

      saveBookingInfo({
        maDon: donDat.maDon,
        tongGia: donDat.tongGia,
        serviceType: serviceType as "hotel" | "flight" | "train" | "tour" | "activity",
        serviceLabel,
        serviceName: title,
        title,
        subtitle,
        primaryDetail,
        secondaryDetail,
        startDate,
        endDate,
        quantityLabel,
        priceLabel: formatVnd(donDat.tongGia),
        baseAmount,
        taxFee,
        tenKhachSan,
        tenLoaiPhong,
        checkIn,
        checkOut,
        nights,
        giaPhong,
        rooms,
        adults,
        khachSanId,
      });

      navigate("/mua-sam/thanh-toan");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra khi đặt phòng.";
      // Nếu lỗi 401 → chưa đăng nhập
      if (String(msg).includes("401") || String(msg).includes("token")) {
        navigate("/dang-nhap");
        return;
      }
      setErrorMsg(`${getErrorLabel(serviceType)} thất bại: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <StepProgress />

        <div className="checkout-layout">
          {/* CỘT TRÁI - 70% */}
          <div className="checkout-left">
            <ContactForm
              hoTen={hoTen}
              sdt={sdt}
              email={email}
              isGuest={isGuest}
              serviceType={serviceType}
              onHoTenChange={setHoTen}
              onSdtChange={setSdt}
              onEmailChange={setEmail}
              onIsGuestChange={setIsGuest}
            />

            {!isGuest && (
              <div className="checkout-card">
                <div className="card-header">
                  <UserCircle size={22} />
                  {serviceType === 'flight' || serviceType === 'train' ? 'Thông tin hành khách' : serviceType === 'tour' ? 'Thông tin người tham gia' : 'Thông tin khách lưu trú'}
                </div>
                <div className="form-group">
                  <label className="form-label">Họ tên khách</label>
                  <input type="text" className="form-input" placeholder="Nhập tên khách nếu không phải là người đặt" />
                </div>
              </div>
            )}

            <ServiceInfoPanel
              serviceType={serviceType}
              primaryDetail={primaryDetail}
              secondaryDetail={secondaryDetail}
              subtitle={subtitle}
            />

            <SpecialRequest serviceType={serviceType} />

            {errorMsg && (
              <div style={{ background: "#fff1f2", color: "#be123c", padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontSize: 14 }}>
                {errorMsg}
              </div>
            )}

            <div className="checkout-footer">
              <button
                type="button"
                className="btn-continue"
                onClick={() => void handleContinue()}
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}
              >
                {isSubmitting ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> {getSubmitLabel(serviceType)}</> : "Tiếp tục thanh toán"}
              </button>
            </div>
          </div>

          {/* CỘT PHẢI - 30% */}
          <div className="checkout-right">
            <BookingSummary
              serviceLabel={serviceLabel}
              title={title}
              subtitle={subtitle}
              primaryDetail={primaryDetail}
              secondaryDetail={secondaryDetail}
              quantityLabel={quantityLabel}
              baseAmount={baseAmount}
              taxFee={taxFee}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
