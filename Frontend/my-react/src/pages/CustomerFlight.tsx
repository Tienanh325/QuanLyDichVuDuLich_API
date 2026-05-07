import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  ChevronDown,
  Copy,
  CreditCard,
  PlaneTakeoff,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import baibienImage from "../assets/images/baibien.jpg";
import thuongHieuImage from "../assets/images/thuonghieu.jpg";
import "../assets/css/CustomerHome.css";
import "../assets/css/CustomerHotel.css";
import "../assets/css/CustomerFlight.css";
import CustomerFlightSearchResults from "./CustomerFlightSearchResults";
import { buildFlightSearchQuery, formatFlightDateLabel, parseFlightSearchParams } from "../utils/flightSearch";
import type { FlightSearchState } from "../utils/flightSearch";

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
const couponCards = [
  {
    tag: "Mới hôm nay",
    title: "Giảm đến 12% cho lần đặt vé đầu tiên",
    body: "Áp dụng cho khách hàng mới trên web và app, số lượng mã có hạn.",
    code: "BAYMOINGAY",
  },
  {
    tag: "Quốc tế",
    title: "Giảm thêm 250.000 VND cho chặng Đông Bắc Á",
    body: "Phù hợp với vé khứ hồi đến Seoul, Tokyo, Osaka hoặc Busan.",
    code: "FLYKOREA250",
  },
  {
    tag: "Gia đình",
    title: "Tặng mã giảm cho nhóm 3 khách trở lên",
    body: "Dễ dùng cho chuyến đi gia đình hoặc đi cùng nhóm bạn.",
    code: "TEAMFLY",
  },
] as const;

const promoCards = [
  {
    title: "Mừng đại lễ, săn vé bay thảnh thơi",
    subtitle: "Khởi hành linh hoạt cho biển đảo và city break",
    description: "Nhiều chặng bay nội địa và quốc tế đang có giá đẹp trong tuần.",
  },
  {
    title: "Hàn Quốc đang có deal rất tốt",
    subtitle: "Seoul, Busan và Jeju được tìm nhiều",
    description: "Khám phá khung giờ đẹp, mức giá ổn và nhiều lựa chọn bay thẳng.",
  },
  {
    title: "Bay Singapore, Bangkok dễ chốt hơn",
    subtitle: "Phù hợp cho lịch trình ngắn ngày",
    description: "Một vài hành trình được quan tâm nhất để bạn tham khảo ngay.",
  },
] as const;

const domesticFares = [
  { origin: "TP. HCM", destination: "Phú Quốc", airline: "Vietnam Airlines", price: "1.214.000 VND" },
  { origin: "Hà Nội", destination: "Đà Nẵng", airline: "VietJet Air", price: "978.000 VND" },
  { origin: "TP. HCM", destination: "Đà Nẵng", airline: "Bamboo Airways", price: "1.096.000 VND" },
  { origin: "Hà Nội", destination: "Nha Trang", airline: "Vietnam Airlines", price: "1.328.000 VND" },
] as const;

const internationalFares = [
  { origin: "TP. HCM", destination: "Singapore", airline: "Scoot", price: "1.998.000 VND" },
  { origin: "Hà Nội", destination: "Bangkok", airline: "Thai AirAsia", price: "2.126.000 VND" },
  { origin: "Đà Nẵng", destination: "Seoul", airline: "T'way Air", price: "3.672.000 VND" },
  { origin: "TP. HCM", destination: "Tokyo", airline: "ZIPAIR Tokyo", price: "5.486.000 VND" },
] as const;

const articleCards = [
  "Bí kíp chọn giờ bay đẹp để tối ưu chi phí và thời gian nghỉ ngơi",
  "Khi nào nên đặt vé quốc tế để có nhiều lựa chọn nhất?",
  "Hành lý xách tay và ký gửi: những điều nên kiểm tra trước khi bay",
  "Kết hợp vé máy bay và khách sạn như thế nào để tiết kiệm hơn",
] as const;

const routeColumns = [
  {
    title: "Các deal bay nổi bật từ Việt Nam",
    routes: [
      { label: "TP. HCM -> Bangkok", airline: "Thai AirAsia", price: "2.132.000 VND" },
      { label: "Hà Nội -> Seoul", airline: "VietJet Air", price: "3.896.000 VND" },
      { label: "Đà Nẵng -> Singapore", airline: "Singapore Airlines", price: "2.517.000 VND" },
      { label: "TP. HCM -> Tokyo", airline: "ZIPAIR Tokyo", price: "5.184.000 VND" },
    ],
  },
  {
    title: "Chặng được khách hàng tìm nhiều",
    routes: [
      { label: "TP. HCM -> Đà Nẵng", airline: "VietJet Air", price: "1.024.000 VND" },
      { label: "Hà Nội -> TP. HCM", airline: "Bamboo Airways", price: "1.486.000 VND" },
      { label: "TP. HCM -> Singapore", airline: "Scoot", price: "1.998.000 VND" },
      { label: "Hà Nội -> Bangkok", airline: "Thai Lion Air", price: "2.326.000 VND" },
    ],
  },
] as const;

const reasonCards = [
  {
    title: "Cảnh báo giá tiện lợi",
    body: "Theo dõi chặng yêu thích để không bỏ lỡ mức giá tốt.",
    icon: BellRing,
  },
  {
    title: "Dễ so sánh lịch bay",
    body: "Xem nhanh giờ cất cánh, hạ cánh và hãng bay trong một nơi.",
    icon: ShieldCheck,
  },
  {
    title: "Thanh toán gọn gàng",
    body: "Nhiều lựa chọn thanh toán quen thuộc để chốt vé nhanh hơn.",
    icon: CreditCard,
  },
  {
    title: "Có hỗ trợ khi cần",
    body: "Câu hỏi thường gặp và hướng dẫn giúp bạn yên tâm hơn trước chuyến đi.",
    icon: Sparkles,
  },
] as const;

const airlineLogos = [
  "Vietnam Airlines",
  "VietJet Air",
  "Bamboo Airways",
  "Scoot",
  "Thai AirAsia",
  "Singapore Airlines",
  "HK Express",
  "ZIPAIR",
];

const paymentLogos = ["MoMo", "Visa", "Mastercard", "VietQR", "VNPAY", "ZaloPay"];

const faqItems = [
  {
    question: "Cần chuẩn bị gì khi đặt vé máy bay?",
    answer: "Bạn nên kiểm tra đúng họ tên, ngày sinh, giấy tờ tuỳ thân, chặng bay và hành lý trước khi thanh toán.",
  },
  {
    question: "Có thể theo dõi giá vé không?",
    answer: "Có. Bạn có thể theo dõi chặng yêu thích để nhận thông báo khi giá thay đổi.",
  },
  {
    question: "Vé máy bay có bao gồm hành lý không?",
    answer: "Điều này phụ thuộc từng hãng và từng hạng vé. Một số vé đã có hành lý xách tay, còn ký gửi có thể cần mua thêm.",
  },
  {
    question: "Có thể đổi ngày bay hoặc hoàn vé không?",
    answer: "Có, nhưng điều kiện sẽ khác nhau theo từng hãng bay, từng hạng vé và thời điểm thay đổi.",
  },
  {
    question: "Thanh toán vé máy bay bằng cách nào?",
    answer: "Bạn có thể dùng thẻ nội địa, thẻ quốc tế, ví điện tử hoặc chuyển khoản qua các cổng đang được hỗ trợ.",
  },
] as const;

const discoverColumns = [
  {
    title: "Chặng nội địa phổ biến",
    links: ["TP. HCM đi Hà Nội", "Hà Nội đi Đà Nẵng", "TP. HCM đi Phú Quốc", "Hà Nội đi Nha Trang"],
  },
  {
    title: "Chặng quốc tế được yêu thích",
    links: ["TP. HCM đi Singapore", "Hà Nội đi Bangkok", "Đà Nẵng đi Seoul", "TP. HCM đi Tokyo"],
  },
  {
    title: "Mẹo đặt vé hữu ích",
    links: ["Kinh nghiệm săn vé bay giá rẻ", "Cách chọn giờ bay phù hợp", "Khi nào nên đặt vé sớm", "Mẹo tiết kiệm phí hành lý"],
  },
  {
    title: "Kết hợp hành trình",
    links: ["Khách sạn gần sân bay", "Combo vé máy bay và khách sạn", "Gợi ý lịch trình 3 ngày 2 đêm"],
  },
];

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
        {isTypable ? (
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
      {children}
    </div>
  );
}

type SearchButtonProps = {
  onClick?: () => void;
  ariaLabel?: string;
};

function SearchButton({ onClick, ariaLabel = "T\u00ecm chuy\u1ebfn bay" }: SearchButtonProps) {
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
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="hotel-customer__section-head hotel-customer__section-head--stacked">
      <div>
        <span>{label}</span>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}

export default function CustomerFlight() {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedSearch = useMemo(
    () => parseFlightSearchParams(new URLSearchParams(location.search)),
    [location.search]
  );
  const [tripType] = useState<TripType>(parsedSearch.tripType);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [flightRoute, setFlightRoute] = useState<RouteValues>({
    fromTitle: parsedSearch.fromTitle,
    fromSubtitle: parsedSearch.fromSubtitle,
    toTitle: parsedSearch.toTitle,
    toSubtitle: parsedSearch.toSubtitle,
  });
  const [departDate] = useState(parsedSearch.departDate);
  const [returnDate] = useState(parsedSearch.returnDate);

  const isResultsView = parsedSearch.view === "results";

  const activeSearchState: FlightSearchState = {
    ...parsedSearch,
    view: isResultsView ? "results" : "landing",
    tripType,
    fromTitle: flightRoute.fromTitle,
    fromSubtitle: flightRoute.fromSubtitle ?? "",
    toTitle: flightRoute.toTitle,
    toSubtitle: flightRoute.toSubtitle ?? "",
    departDate,
    returnDate: tripType === "oneWay" ? "" : returnDate,
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
                    value={formatFlightDateLabel(departDate)}
                    icon={CalendarDays}
                  />
                  <SearchButton ariaLabel="Tìm chuyến bay" onClick={handleFlightSearch} />
                </div>
              </div>
            </div>
          </section>

        </div>
      </section>

      <section className="hotel-customer__section" id="uu-dai">
        <div className="customer-shell__container">
          <SectionHead label="Ưu đãi dành cho bạn" title="Đặt vé trên web, mở app dùng mã giảm ngay" />
          <div className="flight-customer__coupon-grid">
            {couponCards.map((item) => (
              <article key={item.code} className="flight-customer__coupon-card">
                <span className="flight-customer__coupon-tag">{item.tag}</span>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
                <div className="flight-customer__coupon-footer">
                  <span>{item.code}</span>
                  <button type="button">
                    <Copy size={14} />
                    Sao chép
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain">
        <div className="customer-shell__container">
          <SectionHead label="Ưu đãi vé máy bay" title="Những khối nội dung nổi bật dành cho khách hàng" />
          <div className="hotel-customer__promo-grid">
            {promoCards.map((item, index) => (
              <article
                key={item.title}
                className="hotel-customer__promo-card"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(8, 24, 45, 0.22) 0%, rgba(8, 24, 45, 0.82) 100%), url(${index % 2 === 0 ? baibienImage : thuongHieuImage})`,
                }}
              >
                <span>Flight</span>
                <strong>{item.title}</strong>
                <em>{item.subtitle}</em>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section" id="gia-re">
        <div className="customer-shell__container">
          <SectionHead label="Vé máy bay nội địa giá tốt" title="Những chặng bay đang được quan tâm" />
          <div className="flight-customer__fare-grid">
            {domesticFares.map((item, index) => (
              <article key={`${item.origin}-${item.destination}`} className="flight-customer__fare-card">
                <div
                  className="flight-customer__fare-thumb"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(8, 24, 45, 0.14) 0%, rgba(8, 24, 45, 0.76) 100%), url(${index % 2 === 0 ? baibienImage : thuongHieuImage})`,
                  }}
                />
                <div className="flight-customer__fare-body">
                  <span>{item.origin} {" -> "} {item.destination}</span>
                  <strong>{item.airline}</strong>
                  <p>{item.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain">
        <div className="customer-shell__container">
          <SectionHead label="Vé máy bay quốc tế giá tốt" title="Một vài hành trình nổi bật để bạn tham khảo" />
          <div className="flight-customer__fare-grid">
            {internationalFares.map((item, index) => (
              <article key={`${item.origin}-${item.destination}`} className="flight-customer__fare-card">
                <div
                  className="flight-customer__fare-thumb"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(8, 24, 45, 0.14) 0%, rgba(8, 24, 45, 0.76) 100%), url(${index % 2 === 0 ? thuongHieuImage : baibienImage})`,
                  }}
                />
                <div className="flight-customer__fare-body">
                  <span>{item.origin} {" -> "} {item.destination}</span>
                  <strong>{item.airline}</strong>
                  <p>{item.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain">
        <div className="customer-shell__container">
          <SectionHead label="Bài viết mới nhất" title="Cập nhật mẹo đặt vé và chuẩn bị hành trình" />
          <div className="flight-customer__article-grid">
            {articleCards.map((item, index) => (
              <article key={item} className="flight-customer__article-card">
                <div
                  className="flight-customer__article-thumb"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(9, 16, 31, 0.1) 0%, rgba(9, 16, 31, 0.64) 100%), url(${index % 2 === 0 ? baibienImage : thuongHieuImage})`,
                  }}
                />
                <div className="flight-customer__article-body">
                  <strong>{item}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain">
        <div className="customer-shell__container">
          <SectionHead label="Tìm kiếm các deal bay từ Việt Nam" title="Giá tham khảo cho các chặng được quan tâm nhiều" />
          <div className="flight-customer__route-board">
            {routeColumns.map((column) => (
              <div key={column.title} className="flight-customer__route-column">
                <h3>{column.title}</h3>
                {column.routes.map((item) => (
                  <article key={`${item.label}-${item.price}`} className="flight-customer__route-row">
                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.airline}</span>
                    </div>
                    <span className="flight-customer__route-price">{item.price}</span>
                    <ArrowRight size={16} />
                  </article>
                ))}
              </div>
            ))}
          </div>

          <article className="flight-customer__app-banner">
            <div className="flight-customer__app-copy">
              <span>Deal chỉ có trên app</span>
              <strong>Mở ứng dụng để nhận thêm mã bay và thông báo giá theo chặng yêu thích</strong>
            </div>
            <div className="flight-customer__app-qr">
              <QrCode size={58} />
            </div>
          </article>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain">
        <div className="customer-shell__container">
          <div className="flight-customer__reason-grid">
            {reasonCards.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="flight-customer__reason-card">
                  <span className="flight-customer__reason-icon">
                    <Icon size={18} />
                  </span>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain">
        <div className="customer-shell__container">
          <SectionHead label="Đối tác hàng không" title="Đặt vé với nhiều hãng bay trong nước và quốc tế" />
          <div className="hotel-customer__logo-grid">
            {airlineLogos.map((item) => (
              <div key={item} className="hotel-customer__logo-card">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain">
        <div className="customer-shell__container">
          <SectionHead label="Đối tác thanh toán" title="Nhiều lựa chọn thanh toán quen thuộc để chốt vé nhanh hơn" />
          <div className="hotel-customer__payment-grid">
            {paymentLogos.map((item) => (
              <div key={item} className="hotel-customer__payment-card">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain" id="faq">
        <div className="customer-shell__container">
          <SectionHead label="Hỗ trợ" title="Các câu hỏi thường gặp" />
          <div className="hotel-customer__faq">
            {faqItems.map((item, index) => {
              const isOpen = index === activeFaqIndex;

              return (
                <article key={item.question} className={isOpen ? "hotel-customer__faq-item is-open" : "hotel-customer__faq-item"}>
                  <button
                    type="button"
                    className="hotel-customer__faq-question"
                    onClick={() => setActiveFaqIndex((currentValue) => (currentValue === index ? -1 : index))}
                  >
                    <span>{item.question}</span>
                    <ChevronDown size={18} />
                  </button>
                  {isOpen ? <p className="hotel-customer__faq-answer">{item.answer}</p> : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain hotel-customer__section--discover">
        <div className="customer-shell__container">
          <SectionHead label="Khám phá thêm" title="Các lựa chọn du lịch độc đáo cho hành trình của bạn" />
          <div className="hotel-customer__discover-grid">
            {discoverColumns.map((column) => (
              <div key={column.title} className="hotel-customer__discover-column">
                <h3>{column.title}</h3>
                <ul>
                  {column.links.map((item) => (
                    <li key={item}>
                      <a href="#tim-kiem">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
