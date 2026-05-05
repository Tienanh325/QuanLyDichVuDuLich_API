import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Contact, 
  UserCircle, 
  Settings2, 
  Star, 
  BedDouble, 
  Calendar,
  ShieldCheck
} from "lucide-react";
import "../assets/css/checkoutkhachsan.css";
import hotelRoomImg from "../assets/images/hotel_room_deluxe.png"; // Using the previously generated image

// --- SUB-COMPONENTS ---

function StepProgress() {
  return (
    <div className="step-progress">
      <div className="step-item active">
        <div className="step-circle">1</div>
        <div className="step-label">Thông tin khách<br/>hàng</div>
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

function ContactForm() {
  return (
    <div className="checkout-card">
      <div className="card-header">
        <Contact size={22} />
        Thông tin liên hệ
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Họ và tên (như trên CCCD/Hộ chiếu)</label>
          <input type="text" className="form-input" placeholder="VD: Nguyễn Văn A" />
          <div className="form-hint">Vui lòng nhập tên đúng định dạng để nhận diện tại quầy.</div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Số điện thoại</label>
          <div className="phone-input-group">
            <span className="phone-prefix">+84</span>
            <input type="text" className="form-input" placeholder="912 345 678" />
          </div>
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">Email</label>
        <input type="email" className="form-input" placeholder="email@example.com" />
        <div className="form-hint">Voucher xác nhận sẽ được gửi đến địa chỉ email này.</div>
      </div>
      
      <label className="checkbox-wrap">
        <input type="checkbox" defaultChecked />
        <span className="checkbox-label">Tôi là khách lưu trú</span>
      </label>
    </div>
  );
}

function GuestForm() {
  return (
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
        <label className="special-request-item">
          <input type="checkbox" />
          <span>Phòng không hút thuốc</span>
        </label>
        <label className="special-request-item">
          <input type="checkbox" />
          <span>Giường lớn</span>
        </label>
        <label className="special-request-item">
          <input type="checkbox" />
          <span>Nhận phòng sớm</span>
        </label>
        <label className="special-request-item">
          <input type="checkbox" />
          <span>Phòng yên tĩnh</span>
        </label>
      </div>
    </div>
  );
}

function BookingSummary() {
  return (
    <>
      <div className="checkout-card hotel-summary-card">
        <div className="hotel-thumbnail">
          <div className="hotel-badge">Hạng Deluxe</div>
          <img src={hotelRoomImg} alt="Phòng khách sạn" />
        </div>
        
        <div className="hotel-info-body">
          <h3 className="hotel-name">The Azure Serenity Resort &amp; Spa</h3>
          <div className="hotel-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={14} fill="currentColor" stroke="none" />
            ))}
          </div>
          
          <div className="room-meta">
            <BedDouble size={18} className="room-meta-icon" />
            <div>
              <span className="room-meta-text">Deluxe Ocean View</span>
              <span className="room-meta-sub">1 Giường King, 2 Người lớn</span>
            </div>
          </div>
          
          <div className="booking-dates">
            <div className="date-block">
              <div className="date-label">Nhận phòng</div>
              <div className="date-value">24 Th12 2024</div>
            </div>
            <div className="date-block">
              <div className="date-label">Trả phòng</div>
              <div className="date-value">26 Th12 2024</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="checkout-card">
        <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#0d1b2e", marginBottom: "16px" }}>
          Chi tiết giá
        </h4>
        
        <div className="price-row">
          <span className="price-label">Giá phòng (2 đêm)</span>
          <span className="price-value">6.800.000 VND</span>
        </div>
        <div className="price-row">
          <span className="price-label">Thuế và phí dịch vụ</span>
          <span className="price-value">680.000 VND</span>
        </div>
        <div className="price-row price-discount">
          <span className="price-label">Ưu đãi giảm giá</span>
          <span className="price-value">- 250.000 VND</span>
        </div>
        
        <div className="price-total">
          <span className="price-total-label">Tổng cộng</span>
          <div className="price-total-value">
            <span className="price-total-amount">7.230.000 VND</span>
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

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <StepProgress />
        
        <div className="checkout-layout">
          {/* CỘT TRÁI - 70% */}
          <div className="checkout-left">
            <ContactForm />
            <GuestForm />
            <SpecialRequest />
            
            <div className="checkout-footer">
              <button 
                type="button" 
                className="btn-continue"
                onClick={() => navigate("/mua-sam/thanh-toan-dat-cho")}
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </div>
          
          {/* CỘT PHẢI - 30% */}
          <div className="checkout-right">
            <BookingSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
