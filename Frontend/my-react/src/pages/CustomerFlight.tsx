import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Headset,
  PlaneTakeoff,
  Search,
  Tag,
} from "lucide-react";
import baibienImage from "../assets/images/baibien.jpg";
import "../assets/css/CustomerHome.css";
import "../assets/css/CustomerHotel.css";
import "../assets/css/CustomerFlight.css";
import CustomerFlightSearchResults from "./CustomerFlightSearchResults";
import { buildFlightSearchQuery, parseFlightSearchParams } from "../utils/flightSearch";
import type { FlightSearchState } from "../utils/flightSearch";
import { formatGio, formatVnd, searchMayBay } from "../services/veService";
import { ConfigProvider, DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/locale/vi_VN";

dayjs.locale("vi");

type TripType = "oneWay" | "roundTrip" | "multiCity";

type RouteValues = {
  fromTitle: string;
  fromSubtitle?: string;
  toTitle: string;
  toSubtitle?: string;
};

type HotelFieldButtonProps = {
  label: string;
  value?: string;
  placeholder?: string;
  icon: React.ElementType;
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  isTypable?: boolean;
  onChange?: (val: string) => void;
};

/* ─── Data ─────────────────────────────────────────────────────────── */

const flightPromotions = [
  {
    id: 1,
    route: "TP. Hồ Chí Minh → Đà Nẵng",
    price: "890.000 VND",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1559628233-100c798642d4?auto=format&fit=crop&q=80&w=480",
  },
  {
    id: 2,
    route: "Hà Nội → Phú Quốc",
    price: "1.120.000 VND",
    badge: "Phổ thông",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=480",
  },
  {
    id: 3,
    route: "Đà Nẵng → TP. Hồ Chí Minh",
    price: "750.000 VND",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=480",
  },
  {
    id: 4,
    route: "TP. Hồ Chí Minh → Nha Trang",
    price: "680.000 VND",
    badge: "Phổ thông",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=480",
  },
  {
    id: 5,
    route: "Hà Nội → Đà Lạt",
    price: "950.000 VND",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=480",
  },
  {
    id: 6,
    route: "TP. Hồ Chí Minh → Hà Nội",
    price: "1.280.000 VND",
    badge: "Phổ thông",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=480",
  },
] as const;

const valuePropositions = [
  {
    icon: Tag,
    title: "Giá rẻ mỗi ngày",
    description: "So sánh giá vé từ nhiều hãng bay, đảm bảo bạn luôn nhận được mức giá tốt nhất thị trường.",
    color: "#fff4eb",
    iconColor: "#ff5e1f",
  },
  {
    icon: Headset,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ chăm sóc khách hàng chuyên nghiệp, luôn sẵn sàng giải đáp mọi thắc mắc của bạn.",
    color: "#e8f4fd",
    iconColor: "#0b7eff",
  },
  {
    icon: CreditCard,
    title: "Thanh toán linh hoạt",
    description: "Đa dạng phương thức thanh toán: thẻ quốc tế, ví điện tử, chuyển khoản ngân hàng và trả góp.",
    color: "#edf8ef",
    iconColor: "#22a552",
  },
] as const;

const travelInspirations = [
  {
    id: 1,
    title: "Sapa: Thành phố trong sương",
    description: "Khám phá vẻ đẹp hùng vĩ của ruộng bậc thang và văn hóa bản địa đặc sắc.",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=480",
  },
  {
    id: 2,
    title: "Đà Nẵng: Thành phố đáng sống",
    description: "Biển xanh, cát trắng, cầu Vàng lung linh và ẩm thực miền Trung hấp dẫn.",
    image: "https://images.unsplash.com/photo-1559628233-100c798642d4?auto=format&fit=crop&q=80&w=480",
  },
  {
    id: 3,
    title: "Phú Quốc: Đảo ngọc phương Nam",
    description: "Thiên đường nghỉ dưỡng với bãi biển hoang sơ và hải sản tươi ngon.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=480",
  },
  {
    id: 4,
    title: "Đà Lạt: Thành phố ngàn hoa",
    description: "Không khí se lạnh, đồi thông thơ mộng và những quán cà phê đẹp như mơ.",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=480",
  },
] as const;

const faqItems = [
  {
    question: "Làm thế nào để đặt vé máy bay?",
    answer:
      "Bạn chỉ cần nhập điểm đi, điểm đến, ngày bay vào khung tìm kiếm, sau đó chọn chuyến bay phù hợp và tiến hành thanh toán. Vé điện tử sẽ được gửi đến email của bạn ngay lập tức.",
  },
  {
    question: "Tôi có thể hủy hoặc đổi vé không?",
    answer:
      "Có, bạn có thể hủy hoặc đổi vé tùy thuộc vào chính sách của từng hãng bay và hạng vé. Vui lòng kiểm tra điều kiện vé trước khi đặt hoặc liên hệ đội ngũ hỗ trợ 24/7 của chúng tôi.",
  },
  {
    question: "Có những phương thức thanh toán nào?",
    answer:
      "Chúng tôi hỗ trợ đa dạng phương thức: thẻ tín dụng/ghi nợ Visa, Mastercard, JCB; ví điện tử MoMo, ZaloPay, VNPay; và chuyển khoản ngân hàng nội địa.",
  },
  {
    question: "Vé máy bay có bao gồm hành lý không?",
    answer:
      "Điều này phụ thuộc vào hạng vé và hãng bay. Hầu hết vé đều bao gồm hành lý xách tay, còn hành lý ký gửi có thể cần mua thêm tùy loại vé.",
  },
  {
    question: "Làm sao để nhận được giá vé tốt nhất?",
    answer:
      "Hãy đặt vé sớm, linh hoạt ngày bay, và theo dõi các chương trình khuyến mãi trên trang của chúng tôi. Bạn cũng có thể đăng ký nhận bản tin để cập nhật deal mới nhất.",
  },
] as const;

const strategicPartners = [
  "Vietnam Airlines",
  "VietJet Air",
  "Bamboo Airways",
  "Pacific Airlines",
  "Vietravel Airlines",
  "Singapore Airlines",
  "Thai AirAsia",
  "Korean Air",
  "Japan Airlines",
  "Cathay Pacific",
];

/* ─── Shared subcomponents ─────────────────────────────────────────── */

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

type SearchButtonProps = {
  onClick?: () => void;
  ariaLabel?: string;
};

function SearchButton({ onClick, ariaLabel = "Tìm chuyến bay" }: SearchButtonProps) {
  return (
    <button type="button" className="travel-search__submit" aria-label={ariaLabel} onClick={onClick}>
      <Search size={24} />
    </button>
  );
}

function SectionHead({
  label,
  title,
  description,
  seeAllHref,
}: {
  label: string;
  title: string;
  description?: string;
  seeAllHref?: string;
}) {
  return (
    <div className="flight-section__head">
      <div>
        <span className="flight-section__label">{label}</span>
        <h2 className="flight-section__title">{title}</h2>
        {description ? <p className="flight-section__desc">{description}</p> : null}
      </div>
      {seeAllHref ? (
        <a href={seeAllHref} className="flight-section__see-all">
          Xem tất cả <ArrowRight size={16} />
        </a>
      ) : null}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */

export default function CustomerFlight() {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedSearch = useMemo(
    () => parseFlightSearchParams(new URLSearchParams(location.search)),
    [location.search]
  );
  const [tripType] = useState<TripType>(parsedSearch.tripType);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { data: landingFlights } = useQuery({
    queryKey: ["flight-landing-promotions"],
    queryFn: () => searchMayBay({ limit: 6 }),
  });
  const [flightRoute, setFlightRoute] = useState<RouteValues>({
    fromTitle: parsedSearch.fromTitle,
    fromSubtitle: parsedSearch.fromSubtitle,
    toTitle: parsedSearch.toTitle,
    toSubtitle: parsedSearch.toSubtitle,
  });
  const [departDate, setDepartDate] = useState<dayjs.Dayjs>(
    parsedSearch.departDate ? dayjs(parsedSearch.departDate) : dayjs()
  );

  const isResultsView = parsedSearch.view === "results";

  const activeSearchState: FlightSearchState = {
    ...parsedSearch,
    view: isResultsView ? "results" : "landing",
    tripType,
    fromTitle: flightRoute.fromTitle,
    fromSubtitle: flightRoute.fromSubtitle ?? "",
    toTitle: flightRoute.toTitle,
    toSubtitle: flightRoute.toSubtitle ?? "",
    departDate: departDate.format("YYYY-MM-DD"),
    returnDate: tripType === "oneWay" ? "" : parsedSearch.returnDate,
  };

  function handleFlightSearch() {
    navigate(
      `/mua-sam/ve-may-bay?${buildFlightSearchQuery({
        ...activeSearchState,
        view: "results",
      })}`
    );
  }

  function handleStartNewSearch() {
    navigate("/mua-sam/ve-may-bay");
  }

  if (isResultsView) {
    return (
      <div className="flight-customer">
        <CustomerFlightSearchResults searchState={activeSearchState} onStartNewSearch={handleStartNewSearch} />
      </div>
    );
  }

  return (
    <div className="hotel-customer flight-customer">
      {/* ── Hero + Search ─────────────────────────────────────── */}
      <section className="hotel-customer__hero">
        <div className="customer-shell__container">
          <div
            className="hotel-customer__hero-image-wrapper"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(8, 24, 45, 0) 20%, rgba(8, 24, 45, 0.85) 100%), url(${baibienImage})`,
            }}
          >
            <div className="hotel-customer__hero-copy">
              <h1>Tìm và đặt vé máy bay giá hời cho chuyến đi tiếp theo của bạn</h1>
              <p>So sánh nhanh giờ bay, hãng bay, mức giá và ưu đãi nổi bật để chốt hành trình dễ dàng hơn.</p>
            </div>
          </div>

          <section className="travel-search hotel-customer__search" id="tim-kiem">
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
                        onChange={(date) => { if (date) setDepartDate(date); }}
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
          </section>
        </div>
      </section>

      {/* ── 3. Flight Promotions ──────────────────────────────── */}
      <section className="flight-section" id="khuyen-mai">
        <div className="customer-shell__container">
          <SectionHead
            label="Khuyến mãi"
            title="Khuyến mãi chuyến bay giá tốt"
            seeAllHref="#khuyen-mai"
          />
          <div className="flight-promo__grid">
            {(landingFlights?.data && landingFlights.data.length > 0 ? landingFlights.data : flightPromotions).map((item: any) => {
              const id = item.maVe ?? item.id;
              const route = item.diemKhoiHanh ? `${item.diemKhoiHanh} → ${item.diemDen}` : item.route;
              const price = item.giaThapNhat != null ? formatVnd(item.giaThapNhat) : item.price;
              const badge = item.hangHangKhong ? `${item.hangHangKhong} • ${formatGio(item.thoiGianKhoiHanh)}` : item.badge;
              return (
              <article key={id} className="flight-promo__card" onClick={() => navigate(`/mua-sam/chi-tiet-chuyen-bay/${id}`)} style={{ cursor: 'pointer' }}>
                <div className="flight-promo__card-image">
                  <img src={item.image ?? "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=480"} alt={route} />
                  <span className={`flight-promo__badge ${badge === "Hot" ? "flight-promo__badge--hot" : ""}`}>
                    {badge}
                  </span>
                </div>
                <div className="flight-promo__card-body">
                  <span className="flight-promo__route">{route}</span>
                  <strong className="flight-promo__price">{price}</strong>
                  <button type="button" className="flight-promo__arrow" aria-label="Xem chi tiết" onClick={(event) => { event.stopPropagation(); navigate(`/mua-sam/chi-tiet-chuyen-bay/${id}`); }}>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </article>
            );})}
          </div>
        </div>
      </section>

      {/* ── 4. Value Proposition ──────────────────────────────── */}
      <section className="flight-section flight-section--light" id="tai-sao">
        <div className="customer-shell__container">
          <div className="flight-value__header">
            <span className="flight-section__label">Ưu điểm nổi bật</span>
            <h2 className="flight-section__title">Tại sao đặt vé máy bay với Traveloka?</h2>
          </div>
          <div className="flight-value__grid">
            {valuePropositions.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flight-value__card">
                  <div className="flight-value__icon" style={{ backgroundColor: item.color }}>
                    <Icon size={28} color={item.iconColor} />
                  </div>
                  <h3 className="flight-value__subtitle">{item.title}</h3>
                  <p className="flight-value__desc">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Travel Inspiration ────────────────────────────── */}
      <section className="flight-section" id="cam-hung">
        <div className="customer-shell__container">
          <SectionHead
            label="Khám phá"
            title="Cảm hứng cho chuyến đi tiếp theo"
          />
          <div className="flight-inspire__grid">
            {travelInspirations.map((item) => (
              <article key={item.id} className="flight-inspire__card">
                <div className="flight-inspire__card-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="flight-inspire__card-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ────────────────────────────────────────────── */}
      <section className="flight-section flight-section--light" id="faq">
        <div className="customer-shell__container">
          <div className="flight-faq__header">
            <span className="flight-section__label">Hỗ trợ</span>
            <h2 className="flight-section__title">Câu hỏi thường gặp</h2>
          </div>
          <div className="flight-faq__list">
            {faqItems.map((item, index) => {
              const isOpen = index === activeFaqIndex;
              return (
                <div key={item.question} className={`flight-faq__item ${isOpen ? "is-open" : ""}`}>
                  <button
                    type="button"
                    className="flight-faq__question"
                    onClick={() => setActiveFaqIndex((cur) => (cur === index ? -1 : index))}
                  >
                    <span>{item.question}</span>
                    <ChevronDown size={20} className={`flight-faq__chevron ${isOpen ? "is-rotated" : ""}`} />
                  </button>
                  <div className={`flight-faq__answer ${isOpen ? "is-visible" : ""}`}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. Strategic Partners ─────────────────────────────── */}
      <section className="flight-section" id="doi-tac">
        <div className="customer-shell__container">
          <div className="flight-partners__header">
            <span className="flight-section__label">Đối tác tin cậy</span>
            <h2 className="flight-section__title">Đối tác hàng không chiến lược</h2>
          </div>
          <div className="flight-partners__grid">
            {strategicPartners.map((name) => (
              <div key={name} className="flight-partners__card">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Newsletter ────────────────────────────────────── */}
      <section className="flight-newsletter" id="newsletter">
        <div className="customer-shell__container">
          <div className="flight-newsletter__inner">
            <div className="flight-newsletter__copy">
              <h2>Đăng ký nhận tin khuyến mãi</h2>
              <p>Nhận ngay thông tin ưu đãi vé máy bay, deal hot và mã giảm giá độc quyền qua email.</p>
            </div>
            <form
              className="flight-newsletter__form"
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail.trim()) {
                  alert("Đăng ký thành công! Cảm ơn bạn đã theo dõi.");
                  setNewsletterEmail("");
                }
              }}
            >
              <input
                type="email"
                className="flight-newsletter__input"
                placeholder="Nhập địa chỉ email của bạn"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="flight-newsletter__submit">
                ĐĂNG KÝ NGAY
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
