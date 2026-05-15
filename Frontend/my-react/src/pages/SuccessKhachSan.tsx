import { useEffect } from "react";
import {
  CheckCircle2,
  Ticket,
  Headset,
  Star,
  ShieldCheck,
  Award,
  ThumbsUp
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/css/successkhachsan.css";
import hotelHeroImg from "../assets/images/hotel_hero_city.png";
import { formatVnd, readBookingInfo } from "../utils/bookingStorage";
import type { StoredBookingInfo } from "../utils/bookingStorage";

type SuccessState = Partial<StoredBookingInfo>;

// --- SUB-COMPONENTS ---

function StepProgress() {
  return (
    <div className="success-step-progress">
      <div className="success-step-item">
        <div className="success-step-circle" style={{ backgroundColor: "#e6f4ea", color: "#1e8e3e" }}>
          <CheckCircle2 size={16} />
        </div>
        <div className="success-step-label">Thông tin khách hàng</div>
      </div>
      <div className="success-step-line active-line" />
      <div className="success-step-item">
        <div className="success-step-circle" style={{ backgroundColor: "#e6f4ea", color: "#1e8e3e" }}>
          <CheckCircle2 size={16} />
        </div>
        <div className="success-step-label">Thanh toán</div>
      </div>
      <div className="success-step-line active-line" />
      <div className="success-step-item active">
        <div className="success-step-circle">3</div>
        <div className="success-step-label">Hoàn tất</div>
      </div>
    </div>
  );
}

function SuccessMessage({ booking }: { booking: SuccessState | null }) {
  const navigate = useNavigate();
  const maDon = booking?.maDon;

  return (
    <div className="success-left">
      <div className="success-icon-wrap">
        <CheckCircle2 size={48} strokeWidth={2.5} />
      </div>

      <h1 className="success-title">Thanh toán thành công!</h1>

      {maDon && (
        <div style={{ marginBottom: 16, padding: "10px 18px", background: "#e6f4ea", borderRadius: 10, color: "#15803d", fontSize: 16, fontWeight: 700 }}>
          Mã đặt phòng: <span style={{ fontSize: 22 }}>#{maDon}</span>
        </div>
      )}

      <p className="success-desc">
        Cảm ơn bạn đã đặt chỗ. Thông tin chi tiết đã được gửi đến email của bạn. Quý khách vui lòng kiểm tra hộp thư đến hoặc thư rác.
      </p>

      <div className="success-actions">
        <button type="button" className="success-btn-primary" onClick={() => navigate("/mua-sam/dat-cho-cua-toi", { state: booking })}>
          <Ticket size={18} />
          Xem vé điện tử / Phiếu thanh toán
        </button>
        <button type="button" className="success-btn-secondary" onClick={() => navigate("/mua-sam")}>
          Quay lại Trang chủ
        </button>
      </div>

      <div className="success-support-card">
        <div className="success-support-icon">
          <Headset size={24} />
        </div>
        <div className="success-support-content">
          <div className="success-support-title">Cần hỗ trợ?</div>
          <div className="success-support-desc">Trung tâm trợ giúp của chúng tôi hoạt động 24/7</div>
        </div>
        <a href="#" className="success-support-link">Liên hệ</a>
      </div>
    </div>
  );
}

function BookingSummary({ booking }: { booking: SuccessState | null }) {
  const title = booking?.title ?? booking?.serviceName ?? booking?.tenKhachSan ?? "Đặt chỗ";
  const subtitle = booking?.subtitle ?? booking?.tenLoaiPhong;
  const tongGia = booking?.tongGia;
  return (
    <div className="success-right">
      <div className="success-summary-card">
        <div className="success-hotel-hero">
          <img src={hotelHeroImg} alt="Hotel Hero" />
          <div className="success-badge">XÁC NHẬN NGAY</div>
        </div>

        <div className="success-hotel-info">
          <h3 className="success-hotel-name">{title}</h3>
          {subtitle && <div style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>{subtitle}</div>}
          <div className="success-hotel-rating">
            <div className="success-hotel-rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} fill="currentColor" stroke="none" />
              ))}
            </div>
          </div>
        </div>

        {tongGia !== undefined && (
          <div className="success-price-details">
            <div className="success-total-row">
              <span className="success-total-label">Tổng thanh toán</span>
              <span className="success-total-value">{formatVnd(tongGia)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="success-trust-badges">
        <div className="success-trust-badge">
          <ShieldCheck size={24} className="success-trust-badge-icon" />
          <span className="success-trust-badge-label">BẢO MẬT 100%</span>
        </div>
        <div className="success-trust-badge">
          <ThumbsUp size={24} className="success-trust-badge-icon" />
          <span className="success-trust-badge-label">ĐỐI TÁC UY TÍN</span>
        </div>
        <div className="success-trust-badge">
          <Award size={24} className="success-trust-badge-icon" />
          <span className="success-trust-badge-label">GIẢI THƯỞNG QUỐC TẾ</span>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function SuccessKhachSan() {
  const location = useLocation();
  const state = (location.state as SuccessState | null) ?? readBookingInfo();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="success-container">
      <div className="success-wrapper">
        <StepProgress />

        <div className="success-layout">
          <SuccessMessage booking={state} />
          <BookingSummary booking={state} />
        </div>
      </div>
    </div>
  );
}
