import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Contact,
  UserCircle,
  Settings2,
  Star,
  BedDouble,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import "../assets/css/checkoutkhachsan.css";
import hotelRoomImg from "../assets/images/hotel_room_deluxe.png";
import { getCurrentSession } from "../utils/auth";
import { createDonDat } from "../services/hotelService";

// --- HELPERS ---

function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + " VND";
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
  onHoTenChange: (v: string) => void;
  onSdtChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onIsGuestChange: (v: boolean) => void;
}

function ContactForm({ hoTen, sdt, email, isGuest, onHoTenChange, onSdtChange, onEmailChange, onIsGuestChange }: ContactFormProps) {
  return (
    <div className="checkout-card">
      <div className="card-header">
        <Contact size={22} />
        Thông tin liên hệ
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Họ và tên (như trên CCCD/Hộ chiếu)</label>
          <input
            type="text"
            className="form-input"
            placeholder="VD: Nguyễn Văn A"
            value={hoTen}
            onChange={(e) => onHoTenChange(e.target.value)}
            required
          />
          <div className="form-hint">Vui lòng nhập tên đúng định dạng để nhận diện tại quầy.</div>
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
        <span className="checkbox-label">Tôi là khách lưu trú</span>
      </label>
    </div>
  );
}

function SpecialRequest() {
  return (
    <div className="checkout-card">
      <div className="card-header">
        <Settings2 size={22} />
        Yêu cầu đặc biệt
      </div>

      <p style={{ fontSize: "14px", color: "#4a5a6a", marginBottom: "16px", lineHeight: "1.5" }}>
        Mặc dù chúng tôi không thể đảm bảo tất cả các yêu cầu sẽ được đáp ứng, khách sạn sẽ cố gắng hỗ trợ tốt nhất.
      </p>

      <div className="special-request-grid">
        {["Phòng không hút thuốc", "Giường lớn", "Nhận phòng sớm", "Phòng yên tĩnh"].map((req) => (
          <label key={req} className="special-request-item">
            <input type="checkbox" />
            <span>{req}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

interface BookingSummaryProps {
  tenKhachSan: string;
  tenLoaiPhong: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  giaPhong: number;
  rooms: number;
  adults: number;
}

function BookingSummary({ tenKhachSan, tenLoaiPhong, checkIn, checkOut, nights, giaPhong, rooms, adults }: BookingSummaryProps) {
  const roomCharge = giaPhong * nights * rooms;
  const taxFee = Math.round(roomCharge * 0.1);
  const total = roomCharge + taxFee;

  return (
    <>
      <div className="checkout-card hotel-summary-card">
        <div className="hotel-thumbnail">
          <div className="hotel-badge">{tenLoaiPhong || "Phòng đã chọn"}</div>
          <img src={hotelRoomImg} alt="Phòng khách sạn" />
        </div>

        <div className="hotel-info-body">
          <h3 className="hotel-name">{tenKhachSan || "Khách sạn"}</h3>
          <div className="hotel-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={14} fill="currentColor" stroke="none" />
            ))}
          </div>

          <div className="room-meta">
            <BedDouble size={18} className="room-meta-icon" />
            <div>
              <span className="room-meta-text">{tenLoaiPhong}</span>
              <span className="room-meta-sub">{rooms} phòng, {adults} người lớn</span>
            </div>
          </div>

          <div className="booking-dates">
            <div className="date-block">
              <div className="date-label">Nhận phòng</div>
              <div className="date-value">{formatDate(checkIn)}</div>
            </div>
            <div className="date-block">
              <div className="date-label">Trả phòng</div>
              <div className="date-value">{formatDate(checkOut)}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#647b92", marginTop: 8 }}>
            {nights} đêm
          </div>
        </div>
      </div>

      <div className="checkout-card">
        <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#0d1b2e", marginBottom: "16px" }}>
          Chi tiết giá
        </h4>

        <div className="price-row">
          <span className="price-label">Giá phòng ({nights} đêm × {rooms} phòng)</span>
          <span className="price-value">{formatVnd(roomCharge)}</span>
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
  const khachSanId = searchParams.get("khachSanId") ?? "";
  const maDichVu = searchParams.get("maDichVu") ?? "";
  const loaiPhongId = searchParams.get("loaiPhongId") ?? "";
  const tenLoaiPhong = searchParams.get("tenLoaiPhong") ?? "";
  const giaPhong = Number(searchParams.get("giaPhong") ?? "0");
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const adults = searchParams.get("adults") ?? "2";
  const rooms = searchParams.get("rooms") ?? "1";
  const tenKhachSan = searchParams.get("tenKhachSan") ?? "";

  const nights = calculateNights(checkIn, checkOut);

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
  }, []);

  async function handleContinue() {
    if (!hoTen.trim() || !email.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ họ tên và email.");
      return;
    }
    if (!maDichVu || !giaPhong) {
      setErrorMsg("Thông tin phòng không hợp lệ. Vui lòng quay lại và chọn phòng lại.");
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
        chiTietList: [{
          maDichVu: Number(maDichVu),
          maPhanLoaiDichVu: loaiPhongId ? Number(loaiPhongId) : null,
          soLuong: Number(rooms),
          giaTaiThoiDiemMua: giaPhong,
          ngayBatDauSuDung: checkIn || null,
          ngayKetThucSuDung: checkOut || null,
        }],
      });

      // Lưu maDon để dùng ở trang payment
      localStorage.setItem("travelhub_maDon", String(donDat.maDon));
      localStorage.setItem("travelhub_booking_info", JSON.stringify({
        maDon: donDat.maDon,
        tongGia: donDat.tongGia,
        tenKhachSan,
        tenLoaiPhong,
        checkIn,
        checkOut,
        nights,
        giaPhong,
        rooms,
        adults,
        khachSanId,
      }));

      navigate("/mua-sam/thanh-toan-dat-cho");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra khi đặt phòng.";
      // Nếu lỗi 401 → chưa đăng nhập
      if (String(msg).includes("401") || String(msg).includes("token")) {
        navigate("/dang-nhap");
        return;
      }
      setErrorMsg(`Đặt phòng thất bại: ${msg}`);
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
              onHoTenChange={setHoTen}
              onSdtChange={setSdt}
              onEmailChange={setEmail}
              onIsGuestChange={setIsGuest}
            />

            {!isGuest && (
              <div className="checkout-card">
                <div className="card-header">
                  <UserCircle size={22} />
                  Thông tin khách lưu trú
                </div>
                <div className="form-group">
                  <label className="form-label">Họ tên khách</label>
                  <input type="text" className="form-input" placeholder="Nhập tên khách nếu không phải là người đặt" />
                </div>
              </div>
            )}

            <SpecialRequest />

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
                {isSubmitting ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Đang đặt phòng...</> : "Tiếp tục thanh toán"}
              </button>
            </div>
          </div>

          {/* CỘT PHẢI - 30% */}
          <div className="checkout-right">
            <BookingSummary
              tenKhachSan={tenKhachSan}
              tenLoaiPhong={tenLoaiPhong}
              checkIn={checkIn}
              checkOut={checkOut}
              nights={nights}
              giaPhong={giaPhong}
              rooms={Number(rooms)}
              adults={Number(adults)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
