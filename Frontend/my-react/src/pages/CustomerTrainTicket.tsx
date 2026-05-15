import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { ComponentType, ReactNode } from "react";
import {
  CalendarDays,
  MapPinned,
  Search,
  Ticket,
  Headset,
  ShieldCheck,
} from "lucide-react";
import baibienImage from "../assets/images/baibien.jpg";
import "../assets/css/CustomerHome.css";
import "../assets/css/CustomerHotel.css";
import "../assets/css/CustomerTrainTicket.css";
import { ConfigProvider, DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/locale/vi_VN";
import { formatVnd, searchTauHoa } from "../services/veService";

dayjs.locale("vi");



type HotelFieldButtonProps = {
  label: string;
  value?: string;
  placeholder?: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  isTypable?: boolean;
  onChange?: (val: string) => void;
};

function HotelFieldButton({
  label,
  value = "",
  placeholder = "",
  icon: Icon,
  isOpen = false,
  onClick,
  className,
  children,
  isTypable = false,
  onChange,
}: HotelFieldButtonProps) {
  const wrapperClassName = ["travel-hotel-field-wrap", className, isOpen ? "is-open" : ""]
    .filter(Boolean)
    .join(" ");
  const fieldClassName = ["travel-hotel-field", isOpen ? "is-open" : ""].filter(Boolean).join(" ");

  return (
    <div className={wrapperClassName}>
      <div className="travel-hotel-field__label">{label}</div>
      <div className={fieldClassName} onClick={onClick}>
        <span className="travel-hotel-field__icon">
          <Icon size={22} />
        </span>
        {children ? (
          <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        ) : isTypable ? (
          <input
            type="text"
            className="travel-hotel-field__input"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            style={{ 
              border: "none", 
              background: "transparent", 
              outline: "none", 
              width: "100%", 
              fontSize: 15, 
              fontWeight: 600, 
              color: "#242628", 
              padding: 0 
            }}
          />
        ) : (
          <span className="travel-hotel-field__value">{value || placeholder}</span>
        )}
      </div>
    </div>
  );
}

function SearchButton({ ariaLabel = "Tìm kiếm", onClick }: { ariaLabel?: string; onClick?: () => void }) {
  return (
    <button type="button" className="travel-search__submit" aria-label={ariaLabel} onClick={onClick}>
      <Search size={24} />
    </button>
  );
}

export default function CustomerTrainTicket() {
  const [busDeparture, setBusDeparture] = useState("");
  const [busDestination, setBusDestination] = useState("");
  const [busJourneyDate, setBusJourneyDate] = useState(dayjs());
  const navigate = useNavigate();
  const { data: popularTrains } = useQuery({
    queryKey: ["train-landing-routes"],
    queryFn: () => searchTauHoa({ limit: 5 }),
  });

  function handleTrainSearch() {
    const params = new URLSearchParams();
    if (busDeparture) params.set("from", busDeparture);
    if (busDestination) params.set("to", busDestination);
    params.set("date", busJourneyDate.format("YYYY-MM-DD"));
    navigate(`/mua-sam/ket-qua-tau?${params.toString()}`);
  }

  return (
    <div className="hotel-customer train-customer">
      <section className="hotel-customer__hero">
        <div className="customer-shell__container">
          <div
            className="hotel-customer__hero-image-wrapper"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(8, 24, 45, 0) 20%, rgba(8, 24, 45, 0.85) 100%), url(${baibienImage})`,
            }}
          >
            <div className="hotel-customer__hero-copy">
              <h1>Tìm và đặt vé tàu hỏa giá hời cho chuyến đi tiếp theo của bạn</h1>
              <p>So sánh nhanh giờ tàu, hãng tàu, mức giá và ưu đãi nổi bật để chốt hành trình dễ dàng hơn.</p>
            </div>
          </div>

          <section className="travel-search hotel-customer__search" id="tim-kiem">
            <div className="travel-panel travel-panel--train" style={{ position: 'relative', zIndex: 5 }}>
              <div className="travel-form">
                <div className="travel-form__layout travel-form__layout--hotel">
                  <HotelFieldButton
                    label="Từ"
                    value={busDeparture}
                    placeholder="Nhập thành phố hoặc ga"
                    icon={MapPinned}
                    isTypable
                    onChange={(val) => setBusDeparture(val)}
                  />
                  <HotelFieldButton
                    label="Đến"
                    value={busDestination}
                    placeholder="Nhập thành phố hoặc ga"
                    icon={MapPinned}
                    isTypable
                    onChange={(val) => setBusDestination(val)}
                  />
                  <HotelFieldButton
                    label="Ngày khởi hành"
                    icon={CalendarDays}
                  >
                    <ConfigProvider locale={viVN}>
                      <DatePicker
                        value={busJourneyDate}
                        onChange={(date) => { if (date) setBusJourneyDate(date); }}
                        format="DD/MM/YYYY"
                        variant="borderless"
                        allowClear={false}
                        style={{ padding: 0, width: "100%", fontWeight: 600, fontSize: 15 }}
                      />
                    </ConfigProvider>
                  </HotelFieldButton>
                  <SearchButton ariaLabel="Tìm vé tàu" onClick={handleTrainSearch} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="hotel-customer__section">
        <div className="customer-shell__container">
          <div className="train-customer__hero-container">
            <div className="train-customer__hero-content">
              <h1 className="train-customer__hero-title">Trải nghiệm hành trình tàu hỏa tuyệt vời.</h1>
              <p className="train-customer__hero-subtitle">
                Đặt vé tàu dễ dàng, nhanh chóng và an toàn. Khám phá vẻ đẹp Việt Nam qua 8 cung kinh tàu hỏa cùng Traveloka.
              </p>
            </div>
            <div className="train-customer__hero-image">
              <img src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=1200" alt="Tàu cao tốc chạy qua núi" />
            </div>
          </div>
        </div>
      </section>

      <section className="train-customer__routes">
        <h2 className="train-customer__section-title">Hành trình phổ biến</h2>
        <p className="train-customer__section-subtitle">Những tuyến tàu được yêu thích nhất với giá tốt nhất.</p>
        <div className="train-customer__routes-grid">
          {(popularTrains?.data ?? []).map((train, index) => (
            <div
              key={train.maVe}
              className={`train-customer__route-card ${index < 2 ? 'train-customer__route-card--large' : 'train-customer__route-card--small'}`}
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800)' }}
              onClick={() => navigate(`/mua-sam/chi-tiet-tau/${train.maVe}`)}
            >
              {index === 0 && <div className="train-customer__route-badge">Yêu thích nhất</div>}
              <div className="train-customer__route-overlay">
                <h3 className="train-customer__route-title">{train.diemKhoiHanh} → {train.diemDen}</h3>
                <span className="train-customer__route-meta">{train.soHieuChuyenTau || train.hangTau}</span>
                <span className="train-customer__route-price">{formatVnd(train.giaThapNhat)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="train-customer__why">
        <div className="train-customer__why-container">
          <div className="train-customer__why-title-wrapper">
            <h2>Tại sao nên đặt vé tàu trên Traveloka?</h2>
          </div>
          <div className="train-customer__why-grid">
            <div className="train-customer__why-card">
              <div className="train-customer__why-icon">
                <Ticket size={28} />
              </div>
              <h3>E-ticket tiện lợi</h3>
              <p>Không cần in. Chỉ cần xuất trình mã QR trên điện thoại khi lên tàu.</p>
            </div>
            <div className="train-customer__why-card">
              <div className="train-customer__why-icon">
                <Headset size={28} />
              </div>
              <h3>Hỗ trợ 24/7</h3>
              <p>Đội ngũ chăm sóc khách hàng luôn sẵn sàng giải đáp mọi thắc mắc của bạn.</p>
            </div>
            <div className="train-customer__why-card">
              <div className="train-customer__why-icon">
                <ShieldCheck size={28} />
              </div>
              <h3>Thanh toán an toàn</h3>
              <p>Đa dạng phương thức thanh toán bảo mật theo tiêu chuẩn quốc tế.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
