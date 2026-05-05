import { useState } from "react";
import { 
  ShieldCheck, 
  CreditCard, 
  Landmark, 
  Wallet,
  CheckCircle2,
  HelpCircle,
  CalendarDays,
  Moon,
  BedDouble,
  Lock
} from "lucide-react";
import "../assets/css/paymentkhachsan.css";
import hotelHeroImg from "../assets/images/hotel_hero_city.png"; // Using a placeholder image for the hotel

// --- SUB-COMPONENTS ---

function StepProgress() {
  return (
    <div className="payment-step-progress">
      <div className="payment-step-item">
        <div className="payment-step-circle" style={{ backgroundColor: "#f0f6ff", color: "#1a73e8" }}>
          <CheckCircle2 size={16} />
        </div>
        <div className="payment-step-label" style={{ color: "#0d1b2e" }}>Thông tin</div>
      </div>
      <div className="payment-step-line" />
      <div className="payment-step-item active">
        <div className="payment-step-circle">2</div>
        <div className="payment-step-label">Thanh toán</div>
      </div>
      <div className="payment-step-line" />
      <div className="payment-step-item">
        <div className="payment-step-circle">3</div>
        <div className="payment-step-label">Hoàn tất</div>
      </div>
    </div>
  );
}

function PaymentMethod() {
  const [activeMethod, setActiveMethod] = useState("credit_card");

  return (
    <>
      <div className="payment-section-title">Phương thức thanh toán</div>
      
      <div className="payment-methods">
        <div 
          className={`payment-method-card ${activeMethod === "credit_card" ? "active" : ""}`}
          onClick={() => setActiveMethod("credit_card")}
        >
          {activeMethod === "credit_card" && <CheckCircle2 size={18} className="payment-method-check" />}
          <CreditCard size={24} className="payment-method-icon" />
          <div className="payment-method-title">Thẻ tín dụng</div>
          <div className="payment-method-desc">Visa, Mastercard, JCB</div>
        </div>
        
        <div 
          className={`payment-method-card ${activeMethod === "bank_transfer" ? "active" : ""}`}
          onClick={() => setActiveMethod("bank_transfer")}
        >
          {activeMethod === "bank_transfer" && <CheckCircle2 size={18} className="payment-method-check" />}
          <Landmark size={24} className="payment-method-icon" />
          <div className="payment-method-title">Chuyển khoản</div>
          <div className="payment-method-desc">Tất cả ngân hàng nội địa</div>
        </div>
        
        <div 
          className={`payment-method-card ${activeMethod === "e_wallet" ? "active" : ""}`}
          onClick={() => setActiveMethod("e_wallet")}
        >
          {activeMethod === "e_wallet" && <CheckCircle2 size={18} className="payment-method-check" />}
          <Wallet size={24} className="payment-method-icon" />
          <div className="payment-method-title">Ví điện tử</div>
          <div className="payment-method-desc">MoMo, ZaloPay, ShopeePay</div>
        </div>
      </div>

      {activeMethod === "credit_card" && (
        <div className="payment-card-form">
          <div className="payment-form-row">
            <div className="payment-form-group">
              <label className="payment-form-label">Số thẻ</label>
              <input type="text" className="payment-form-input" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="payment-form-group">
              <label className="payment-form-label">Tên trên thẻ</label>
              <input type="text" className="payment-form-input" placeholder="NGUYEN VAN A" />
            </div>
          </div>
          
          <div className="payment-form-row">
            <div className="payment-form-group">
              <label className="payment-form-label">Ngày hết hạn</label>
              <input type="text" className="payment-form-input" placeholder="MM / YY" />
            </div>
            <div className="payment-form-group">
              <label className="payment-form-label">CVV/CVC</label>
              <div style={{ position: "relative" }}>
                <input type="text" className="payment-form-input" placeholder="***" />
                <HelpCircle size={18} color="#9eaab6" style={{ position: "absolute", right: 16, top: 16 }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function BillingInfo() {
  return (
    <>
      <div className="payment-section-title">Thông tin hóa đơn</div>
      <div className="payment-billing-info">
        <label className="payment-checkbox-wrap">
          <input type="checkbox" />
          <div className="payment-checkbox-content">
            <span className="payment-checkbox-label">Tôi muốn xuất hóa đơn giá trị gia tăng (VAT) cho doanh nghiệp</span>
            <span className="payment-checkbox-note">Thông tin sẽ được gửi qua email sau khi hoàn tất thanh toán.</span>
          </div>
        </label>
      </div>
    </>
  );
}

function BookingSummary() {
  return (
    <>
      <div className="payment-summary-card">
        <div className="payment-hotel-hero">
          <img src={hotelHeroImg} alt="Hotel Hero" />
          <div className="payment-hotel-hero-overlay">
            <div className="payment-hotel-type">HOTELS</div>
            <h3 className="payment-hotel-name">The Azure Luxury Resort</h3>
          </div>
        </div>
        
        <div className="payment-booking-details">
          <div className="payment-detail-row">
            <CalendarDays size={20} className="payment-detail-icon" />
            <div className="payment-detail-content">
              <span className="payment-detail-label">Ngày nhận phòng</span>
              <span className="payment-detail-value">Thứ 6, 12 Th07 2024</span>
            </div>
          </div>
          
          <div className="payment-detail-row">
            <Moon size={20} className="payment-detail-icon" />
            <div className="payment-detail-content">
              <span className="payment-detail-label">Thời gian lưu trú</span>
              <span className="payment-detail-value">3 đêm (1 phòng, 2 khách)</span>
            </div>
          </div>
          
          <div className="payment-detail-row">
            <BedDouble size={20} className="payment-detail-icon" />
            <div className="payment-detail-content">
              <span className="payment-detail-label">Loại phòng</span>
              <span className="payment-detail-value">Deluxe Ocean View Double</span>
            </div>
          </div>
        </div>
        
        <div className="payment-price-section">
          <div className="payment-price-title">Chi tiết giá</div>
          
          <div className="payment-price-row">
            <span className="payment-price-label">Giá phòng (3 đêm)</span>
            <span className="payment-price-value">12.450.000 VND</span>
          </div>
          
          <div className="payment-price-row">
            <span className="payment-price-label">Thuế và phí dịch vụ</span>
            <span className="payment-price-value">1.245.000 VND</span>
          </div>
          
          <div className="payment-price-row payment-price-discount">
            <span className="payment-price-label">Khuyến mãi (TRAVELOKA24)</span>
            <span className="payment-price-value">- 500.000 VND</span>
          </div>
          
          <div className="payment-total-divider" />
          
          <div className="payment-total-row">
            <span className="payment-total-label">Tổng cộng</span>
            <span className="payment-total-value">13.195.000 VND</span>
          </div>
        </div>
      </div>
      
      <button type="button" className="payment-btn">
        <Lock size={18} />
        Thanh toán an toàn
      </button>
      
      <div className="payment-terms">
        Bằng cách nhấn nút, bạn đồng ý với <a href="#">Điều khoản &amp; Chính sách</a> của chúng tôi.
      </div>
    </>
  );
}

// --- MAIN COMPONENT ---

export default function PaymentKhachSan() {
  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <StepProgress />
        
        <div className="payment-layout">
          {/* CỘT TRÁI - 70% */}
          <div className="payment-left">
            <h1 className="payment-title">Thanh toán đặt chỗ</h1>
            
            <div className="payment-security-box">
              <ShieldCheck size={24} className="payment-security-icon" />
              <div className="payment-security-content">
                <h4>Thanh toán an toàn &amp; bảo mật</h4>
                <p>Dữ liệu của bạn được mã hóa hoàn toàn bằng công nghệ SSL tiên tiến.</p>
              </div>
            </div>
            
            <PaymentMethod />
            <BillingInfo />
          </div>
          
          {/* CỘT PHẢI - 30% */}
          <div className="payment-right">
            <BookingSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
