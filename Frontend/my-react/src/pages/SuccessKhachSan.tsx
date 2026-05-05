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
import { useNavigate } from "react-router-dom";
import "../assets/css/successkhachsan.css";
import hotelHeroImg from "../assets/images/hotel_hero_city.png"; // Using placeholder

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

function SuccessMessage() {
  const navigate = useNavigate();

  return (
    <div className="success-left">
      <div className="success-icon-wrap">
        <CheckCircle2 size={48} strokeWidth={2.5} />
      </div>
      
      <h1 className="success-title">Thanh toán thành công!</h1>
    
      <p className="success-desc">
        Cảm ơn bạn đã đặt chỗ tại Traveloka. Thông tin chi tiết đã được gửi đến email của bạn. Quý khách vui lòng kiểm tra hộp thư đến hoặc thư rác.
      </p>
      
      <div className="success-actions">
        <button type="button" className="success-btn-primary">
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

function BookingSummary() {
  return (
    <div className="success-right">
      <div className="success-summary-card">
        <div className="success-hotel-hero">
          <img src={hotelHeroImg} alt="Hotel Hero" />
          <div className="success-badge">XÁC NHẬN NGAY</div>
        </div>
        
        <div className="success-hotel-info">
          <h3 className="success-hotel-name">The Azure Serenity Resort &amp; Spa</h3>
          <div className="success-hotel-rating">
            <div className="success-hotel-rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} fill="currentColor" stroke="none" />
              ))}
            </div>
            <span className="success-hotel-rating-score">5.0</span>
          </div>
        </div>
        
        <div className="success-booking-dates">
          <div className="success-date-block">
            <div className="success-date-label">Ngày nhận phòng</div>
            <div className="success-date-value">24 Th12 2024</div>
          </div>
          <div className="success-date-block">
            <div className="success-date-label">Ngày trả phòng</div>
            <div className="success-date-value">26 Th12 2024</div>
          </div>
        </div>
        
        <div className="success-price-details">
          <div className="success-price-row">
            <span className="success-price-label">2 đêm x 1 Phòng Deluxe Ocean View</span>
            <span className="success-price-value">8.400.000 VND</span>
          </div>
          <div className="success-price-row">
            <span className="success-price-label">Thuế và phí dịch vụ</span>
            <span className="success-price-value">840.000 VND</span>
          </div>
          
          <div className="success-total-row">
            <span className="success-total-label">Tổng cộng</span>
            <span className="success-total-value">9.240.000 VND</span>
          </div>
        </div>
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="success-container">
      <div className="success-wrapper">
        <StepProgress />
        
        <div className="success-layout">
          <SuccessMessage />
          <BookingSummary />
        </div>
      </div>
    </div>
  );
}
