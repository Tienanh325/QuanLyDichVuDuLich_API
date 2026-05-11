import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import baibienImage from "../assets/images/baibien.jpg";
import {

  ArrowRight,
  BedDouble,
  CalendarDays,
  MapPinned,
  PlaneTakeoff,
  Search,
  ShieldCheck,
  Ticket,
  Train,
  Users,
} from "lucide-react";
import "../assets/css/CustomerHome.css";
import { buildFlightSearchQuery } from "../utils/flightSearch";
import { buildHotelSearchQuery } from "../utils/hotelSearch";
import { ConfigProvider, DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/locale/vi_VN";

dayjs.locale("vi");

type ServiceId = "hotel" | "flight" | "train" | "activity";
type IconType = typeof Search;

type RouteValues = {
  fromTitle: string;
  fromSubtitle?: string;
  toTitle: string;
  toSubtitle?: string;
};

const serviceTabs: Array<{
  id: ServiceId;
  label: string;
  icon: IconType;
}> = [
  { id: "hotel", label: "Khách sạn", icon: BedDouble },
  { id: "flight", label: "Vé máy bay", icon: PlaneTakeoff },
  { id: "train", label: "Vé tàu", icon: Train },
  { id: "activity", label: "Tour & Hoạt động", icon: Ticket },
];
const reasonCards = [
  {
    title: "Hơn 1 triệu đánh giá thật từ du khách",
    body: "Xem phản hồi minh bạch để chọn khách sạn, vé xe và hoạt động phù hợp.",
  },
  {
    title: "Nhiều lựa chọn cho mọi kế hoạch",
    body: "Từ chuyến đi công tác đến kỳ nghỉ gia đình, Traveloka đều có lựa chọn nhanh.",
  },
  {
    title: "Trợ giá hấp dẫn mỗi ngày",
    body: "Ưu đãi theo tuyến, theo mùa và theo nhu cầu được cập nhật liên tục.",
  },
  {
    title: "Thanh toán an toàn linh hoạt",
    body: "Hỗ trợ nhiều hình thức thanh toán và lưu thông tin hành khách tiện hơn.",
  },
];

type SearchButtonProps = {
  ariaLabel?: string;
  onClick?: () => void;
};

function SearchButton({ ariaLabel = "Tìm kiếm", onClick }: SearchButtonProps) {
  return (
    <button type="button" className="travel-search__submit" aria-label={ariaLabel} onClick={onClick}>
      <Search size={24} />
    </button>
  );
}

type HotelFieldButtonProps = {
  label: string;
  value?: string;
  placeholder?: string;
  icon: IconType;
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
  className,
  children,
  isTypable = false,
  onChange,
}: HotelFieldButtonProps) {
  const wrapperClassName = ["travel-hotel-field-wrap", className].filter(Boolean).join(" ");
  const fieldClassName = "travel-hotel-field";

  return (
    <div className={wrapperClassName}>
      <div className="travel-hotel-field__label">{label}</div>
      <div className={fieldClassName}>
        <span className="travel-hotel-field__icon">
          <Icon size={22} />
        </span>
        {children ? (
          children
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



export default function CustomerHome() {
  const navigate = useNavigate();
  const hotelSearchRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<ServiceId>("hotel");
 const [hotelDestination, setHotelDestination] = useState({
  name: "",
  subtitle: "",
  type: "",
  count: "",
});
  const [hotelStay, setHotelStay] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(() => {
    return [dayjs(), dayjs().add(1, "day")];
  });
 const [hotelGuests, setHotelGuests] = useState({
  guests: "",
});
  const [flightRoute, setFlightRoute] = useState<RouteValues>({
    fromTitle: "",
    fromSubtitle: "",
    toTitle: "",
    toSubtitle: "",
  });
  const [trainRoute, setTrainRoute] = useState<RouteValues>({
    fromTitle: "",
    toTitle: "",
  });
  const [activitySearch, setActivitySearch] = useState("");

  const homeFlightReturnDate = dayjs().add(3, "day").format("YYYY-MM-DD");
  const [departDate, setDepartDate] = useState<dayjs.Dayjs>(dayjs());
  const [trainDepartDate, setTrainDepartDate] = useState<dayjs.Dayjs>(dayjs());

  function handleHotelSearch() {
    navigate(
      `/mua-sam/khach-san?${buildHotelSearchQuery({
        view: "results",
        destination: hotelDestination.name,
        destinationSubtitle: hotelDestination.subtitle,
        checkInDate: hotelStay[0].format("YYYY-MM-DD"),
        checkOutDate: hotelStay[1].format("YYYY-MM-DD"),
        guests: Number(hotelGuests.guests || 0),
      })}`
    );
  }

  function handleFlightSearch() {
    navigate(
      `/mua-sam/ve-may-bay?${buildFlightSearchQuery({
        view: "results",
        tripType: "roundTrip",
        fromTitle: flightRoute.fromTitle,
        fromSubtitle: flightRoute.fromSubtitle ?? "",
        toTitle: flightRoute.toTitle,
        toSubtitle: flightRoute.toSubtitle ?? "",
        departDate: departDate.format("YYYY-MM-DD"),
        returnDate: homeFlightReturnDate,
        passengers: "1 hành khách",
        cabinClass: "Phổ thông",
      })}`
    );
  }

  function handleTrainSearch() {
    const params = new URLSearchParams();
    if (trainRoute.fromTitle) params.set("from", trainRoute.fromTitle);
    if (trainRoute.toTitle) params.set("to", trainRoute.toTitle);
    params.set("date", trainDepartDate.format("YYYY-MM-DD"));
    navigate(`/mua-sam/ket-qua-tau?${params.toString()}`);
  }

  function handleActivitySearch() {
    navigate(`/mua-sam/ket-qua-hoat-dong?q=${encodeURIComponent(activitySearch)}`);
  }

  const renderPanel = () => {
    if (activeTab === "hotel") {
      return (
        <div className="travel-panel travel-panel--hotel" ref={hotelSearchRef}>
          <div className="travel-form">
            <div className="travel-form__layout travel-form__layout--hotel">
              <HotelFieldButton
                label="Thành phố, địa điểm hoặc tên khách sạn"
                value={hotelDestination.name}
                placeholder="Nhập địa điểm"
                icon={MapPinned}
                isTypable
                  onChange={(val) =>
                    setHotelDestination((prev) => ({
                      ...prev,
                      name: val,
                    }))
                  }
              >
              </HotelFieldButton>
              <HotelFieldButton
                label="Ngày nhận phòng và trả phòng"
                icon={CalendarDays}
                className="travel-hotel-field-wrap--stay"
              >
                <ConfigProvider locale={viVN}>
                  <DatePicker.RangePicker
                    value={hotelStay}
                    onChange={(dates) => {
                      if (dates && dates[0] && dates[1]) {
                        setHotelStay([dates[0], dates[1]]);
                      }
                    }}
                    format="DD/MM/YYYY"
                    variant="borderless"
                    allowClear={false}
                    style={{ padding: 0, width: "100%", fontWeight: 600, fontSize: 15 }}
                  />
                </ConfigProvider>
              </HotelFieldButton>
              <HotelFieldButton
                label="Số khách"
                value={hotelGuests.guests}
                placeholder="Hãy nhập số người ở"
                icon={Users}
                isTypable
                onChange={(value) => {
                  const onlyNumber = value.replace(/\D/g, "");

                  setHotelGuests({
                    guests: onlyNumber,
                  });
                }}
              />
              <SearchButton ariaLabel="Tìm khách sạn" onClick={handleHotelSearch} />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "flight") {
      return (
        <div className="travel-panel travel-panel--flight" style={{ position: 'relative', zIndex: 5 }}>
          <div className="travel-form">
            <div className="travel-form__layout travel-form__layout--hotel">
              <HotelFieldButton
                label="Từ"
                value={flightRoute.fromTitle}
                placeholder="Chọn sân bay khởi hành"
                icon={PlaneTakeoff}
                isTypable
                onChange={(val) => setFlightRoute(prev => ({ ...prev, fromTitle: val }))}
              />
              <HotelFieldButton
                label="Đến"
                value={flightRoute.toTitle}
                placeholder="Chọn sân bay đến"
                icon={PlaneTakeoff}
                isTypable
                onChange={(val) => setFlightRoute(prev => ({ ...prev, toTitle: val }))}
              />
              <HotelFieldButton
                label="Ngày khởi hành"
                icon={CalendarDays}
              >
                <ConfigProvider locale={viVN}>
                  <DatePicker
                    value={departDate}
                    onChange={(date) => {
                      if (date) setDepartDate(date);
                    }}
                    format="DD/MM/YYYY"
                    variant="borderless"
                    allowClear={false}
                    style={{ padding: 0, width: "100%", fontWeight: 600, fontSize: 15 }}
                  />
                </ConfigProvider>
              </HotelFieldButton>
              <SearchButton ariaLabel="Tìm chuyến bay" onClick={handleFlightSearch} />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "train") {
      return (
        <div className="travel-panel travel-panel--train" style={{ position: 'relative', zIndex: 5 }}>
          <div className="travel-form">
            <div className="travel-form__layout travel-form__layout--hotel">
              <HotelFieldButton
                label="Từ"
                value={trainRoute.fromTitle}
                placeholder="Nhập thành phố hoặc ga"
                icon={Train}
                isTypable
                onChange={(val) => setTrainRoute(prev => ({ ...prev, fromTitle: val }))}
              />
              <HotelFieldButton
                label="Đến"
                value={trainRoute.toTitle}
                placeholder="Nhập thành phố hoặc ga"
                icon={Train}
                isTypable
                onChange={(val) => setTrainRoute(prev => ({ ...prev, toTitle: val }))}
              />
              <HotelFieldButton
                label="Ngày khởi hành"
                icon={CalendarDays}
              >
                <ConfigProvider locale={viVN}>
                  <DatePicker
                    value={trainDepartDate}
                    onChange={(date) => {
                      if (date) setTrainDepartDate(date);
                    }}
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
      );
    }

    if (activeTab === "activity") {
      return (
        <div className="travel-panel travel-panel--activity" style={{ position: 'relative', zIndex: 5 }}>
          <div className="travel-form">
            <div className="travel-form__layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 48px', alignItems: 'flex-end', gap: 12, padding: '0 12px' }}>
              <HotelFieldButton
                label="Tìm kiếm tour & hoạt động"
                value={activitySearch}
                placeholder="Bạn có ý tưởng gì cho chuyến đi tiếp theo?"
                icon={Search}
                isTypable
                onChange={setActivitySearch}
              />
              <SearchButton ariaLabel="Tìm tour & hoạt động" onClick={handleActivitySearch} />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="home-customer">
      <section
        className="home-customer__hero-shell"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(11, 25, 45, 0.36) 0%, rgba(11, 25, 45, 0.22) 18%, rgba(9, 27, 52, 0.78) 100%), linear-gradient(90deg, rgba(8, 23, 43, 0.18) 0%, rgba(8, 23, 43, 0.04) 100%), url(${baibienImage})`,
        }}
      >
        <div className="customer-shell__container">
          <div className="home-customer__hero-copy">
            <h1>App du lịch hàng đầu, một chạm đi bất cứ đâu</h1>
          </div>

          <section className="travel-search" id="tim-kiem">
            <div className="travel-search__services">
              {serviceTabs.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === activeTab;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={isActive ? "travel-service is-active" : "travel-service"}
                    onClick={() => {
                      setActiveTab(item.id);
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {renderPanel()}
          </section>
        </div>
      </section>
      {/* Promos Section ('Ưu đãi chọn lọc') */}
      <section style={{ padding: '64px 0', background: '#fff' }}>
        <div className="customer-shell__container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Ưu đãi chọn lọc</h2>
              <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>Những khuyến mãi tốt nhất dành riêng cho bạn</p>
            </div>
            <a href="#uu-dai" style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Xem tất cả ưu đãi <ArrowRight size={16} />
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24 }}>
            <div style={{ 
              borderRadius: 20, 
              overflow: 'hidden', 
              position: 'relative', 
              minHeight: 360,
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%), url(https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 40
            }}>
              <h3 style={{ color: '#fff', fontSize: 40, fontWeight: 800, margin: '0 0 8px 0' }}>Mùa Hè Rực Rỡ</h3>
              <p style={{ color: '#f8fafc', fontSize: 20, marginBottom: 24 }}>Giảm giá lên đến 45%</p>
              <div>
                <button style={{ background: '#fff', color: '#0284c7', padding: '12px 24px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                  Nhận mã giảm giá
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ 
                flex: 1, 
                borderRadius: 20, 
                background: '#0284c7', 
                color: '#fff', 
                padding: 32, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center' 
              }}>
                <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px 0' }}>Khuyến mãi bay toàn cầu</h3>
                <p style={{ fontSize: 16, margin: 0, opacity: 0.9 }}>Tích điểm gấp đôi cho mọi chuyến bay quốc tế.</p>
              </div>
              <div style={{ 
                flex: 1, 
                borderRadius: 20, 
                background: '#f1f5f9', 
                color: '#0f172a', 
                padding: 32, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center' 
              }}>
                <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px 0' }}>Tour & Hoạt động</h3>
                <p style={{ fontSize: 16, margin: 0, color: '#475569' }}>Ưu đãi đặc biệt cho tour và hoạt động vui chơi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section ('Điểm đến truyền cảm hứng') */}
      <section style={{ padding: '64px 0', background: '#f8fafc' }}>
        <div className="customer-shell__container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Điểm đến truyền cảm hứng</h2>
              <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>Lựa chọn hàng đầu cho chuyến đi sắp tới của bạn</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #cbd5e1', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <button style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { name: "Đà Nẵng", count: "1,240 PROPERTIES", img: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=500&q=80" },
              { name: "Bali", count: "2,450 PROPERTIES", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80" },
              { name: "Tokyo", count: "3,120 PROPERTIES", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&q=80" },
              { name: "Dubai", count: "980 PROPERTIES", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80" },
            ].map(dest => (
              <div key={dest.name} style={{ cursor: 'pointer' }}>
                <div style={{ 
                  height: 320, 
                  borderRadius: 16, 
                  overflow: 'hidden', 
                  marginBottom: 16,
                  backgroundImage: `url(${dest.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.3s ease'
                }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>{dest.name}</h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0, fontWeight: 500, letterSpacing: 0.5 }}>{dest.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodations Section ('Chỗ nghỉ đẳng cấp') */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="customer-shell__container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>Chỗ nghỉ đẳng cấp</h2>
            <p style={{ fontSize: 18, color: '#64748b', margin: 0 }}>Trải nghiệm dịch vụ 5 sao tại những địa điểm tuyệt đẹp nhất</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { name: "InterContinental Danang Sun Peninsula Resort", price: "$420/đêm", location: "Đà Nẵng, Việt Nam", rating: "4.9", reviews: "1.2k", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" },
              { name: "Four Seasons Resort Bali at Sayan", price: "$650/đêm", location: "Ubud, Bali", rating: "4.9", reviews: "2.1k", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80" },
              { name: "Aman Tokyo", price: "$850/đêm", location: "Otemachi, Tokyo", rating: "4.8", reviews: "940", img: "https://images.unsplash.com/photo-1542314831-c6a4d14d8835?w=800&q=80" },
            ].map(acc => (
              <div key={acc.name} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', transition: 'box-shadow 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ 
                  height: 240, 
                  position: 'relative',
                  backgroundImage: `url(${acc.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <div style={{ position: 'absolute', top: 16, left: 16, background: '#fff', padding: '6px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                    <span style={{ color: '#f59e0b' }}>★</span> {acc.rating} <span style={{ color: '#cbd5e1' }}>|</span> <span style={{ color: '#64748b', fontWeight: 500 }}>{acc.reviews} đánh giá</span>
                  </div>
                  <button style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0, flex: 1, paddingRight: 16, lineHeight: 1.4 }}>{acc.name}</h3>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{acc.price}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14 }}>
                    <MapPinned size={16} /> {acc.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-customer__section">
        <div className="customer-shell__container">
          <div className="home-customer__title-row">
            <h2>Lý do nên đặt chỗ với Traveloka?</h2>
          </div>

          <div className="home-customer__reason-grid">
            {reasonCards.map((item) => (
              <article key={item.title} className="home-customer__reason-card">
                <div className="home-customer__reason-icon">
                  <ShieldCheck size={18} />
                </div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
