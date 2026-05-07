import { useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  Copy,
  MapPinned,
  Search,
} from "lucide-react";
import baibienImage from "../assets/images/baibien.jpg";
import "../assets/css/CustomerHome.css";
import "../assets/css/CustomerBusTicket.css";

const promoCards = [
  {
    title: "Khuyến mãi Tết Nguyên Đán",
    subtitle: "Giảm đến 30% cho các chuyến xe",
    description: "Đặt vé xe sớm trong dịp Tết để nhận ưu đãi đặc biệt.",
    tag: "Hot",
    accent: "city",
  },
  {
    title: "Chương trình khách thường xuyên",
    subtitle: "Tích điểm với mỗi chuyến đi",
    description: "Đổi điểm thành tiền giảm cho chuyến xe tiếp theo.",
    tag: "Quốc tế",
    accent: "night",
  },
  {
    title: "Ưu đãi cuối tuần",
    subtitle: "Giảm 15% cho chuyến xe thứ bảy và chủ nhật",
    description: "Tận hưởng chuyến đi giá rẻ vào cuối tuần với nhiều lựa chọn lịch trình.",
    tag: "Mới",
    accent: "city",
  },
] as const;

const popularRoutes = [
  { title: "TP HCM - Đà Lạt", meta: "5h - 150 km", accent: "tropical" },
  { title: "TP HCM - Nha Trang", meta: "6h - 180 km", accent: "beach" },
  { title: "TP HCM - Vũng Tàu", meta: "2h - 120 km", accent: "ocean" },
  { title: "Hà Nội - Hạ Long", meta: "3h - 160 km", accent: "harbor" },
  { title: "Hà Nội - Thanh Hóa", meta: "2h - 120 km", accent: "city" },
  { title: "Hà Nội - Hải Phòng", meta: "2.5h - 140 km", accent: "night" },
  { title: "TP HCM - Cần Thơ", meta: "4h - 170 km", accent: "sunrise" },
  { title: "TP HCM - Phú Quốc", meta: "12h - 250 km", accent: "sand" },
  { title: "Đà Nẵng - Huế", meta: "3h - 145 km", accent: "coast" },
  { title: "Đà Nẵng - Quảng Ngãi", meta: "2h - 100 km", accent: "oldtown" },
  { title: "TP HCM - Rạch Giá", meta: "8h - 240 km", accent: "urban" },
  { title: "TP HCM - An Giang", meta: "5h - 180 km", accent: "forest" },
] as const;

const busOperators = [
  "Thaco Bus",
  "Phương Trang",
  "Megabus",
  "Đạt Hoàng",
  "Nam Nghĩa",
  "Sao Việt",
  "Thiên Tân",
  "Thanh Bình",
];

const paymentLogos = [
  "MoMo",
  "Visa",
  "Mastercard",
  "VietQR",
  "JCB",
  "ZaloPay",
  "VNPAY",
  "BIDV",
  "Vietcombank",
  "OnePay",
];

const destinationThemes = {
  tropical: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  beach: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  ocean: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  harbor: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  city: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  night: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  sunrise: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  sand: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)",
  coast: "linear-gradient(135deg, #2e2e78 0%, #662d8c 100%)",
  oldtown: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
  urban: "linear-gradient(135deg, #5433ff 0%, #20bdff 100%)",
  forest: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
} as const;

const faqItems = [
  {
    question: "Cách đặt vé tàu trên Traveloka?",
    answer:
      "Chọn điểm khởi hành, điểm đến, ngày đi và số hành khách rồi bấm Tìm kiếm. Sau đó bạn có thể lọc theo giá, thời gian xuất phát và hãng tàu trước khi đặt vé.",
  },
  {
    question: "Tôi có thể hủy vé xe được không?",
    answer:
      "Tùy vào chính sách hủy của hãng xe. Bạn nên kiểm tra phần điều kiện đặt vé để biết chi tiết về hủy miễn phí hoặc mức phí hủy.",
  },
  {
    question: "Vé tàu có những ưu đãi gì?",
    answer:
      "Bạn có thể áp dụng mã giảm giá, tích điểm thành viên, hoặc tận dụng các chương trình khuyến mãi theo mùa để nhận giá vé tốt hơn.",
  },
  {
    question: "Tôi có thể đổi chuyến được không?",
    answer:
      "Có. Bạn có thể yêu cầu đổi chuyến trước thời hạn quy định. Nếu chuyến mới có giá thấp hơn, sẽ được hoàn tiền phần chênh lệch.",
  },
  {
    question: "Tàu hỏa có những tiện nghi gì?",
    answer:
      "Tùy theo hãng tàu, các tiện nghi có thể bao gồm: Wi-Fi, điều hòa không khí, giường nằm, nước lạnh miễn phí, toilet trên tàu.",
  },
] as const;

const discoverColumns = [
  {
    title: "Tuyến xe nổi bật",
    links: [
      "Vé xe Hà Nội ",
      "Vé xe TP HCM",
      "Vé xe Đà Nẵng",
      "Vé xe Hải Phòng",
      "Vé xe Cần Thơ",
      "Vé xe Nha Trang",
      "Vé xe Đà Lạt",
      "Vé xe Long An",
    ],
  },
  {
    title: "Tuyến đường phổ biến",
    links: [
      "TP HCM - Hà Nội",
      "TP HCM - Đà Lạt",
      "TP HCM - Nha Trang",
      "Hà Nội - Hạ Long",
      "TP HCM - Vũng Tàu",
      "TP HCM - Cần Thơ",
      "Đà Nẵng - Huế",
      "TP HCM - Rạch Giá",
    ],
  },
  {
    title: "Mẹo đặt vé xe",
    links: [
      "Cách tìm vé xe rẻ nhất",
      "Chọn giờ xuất phát phù hợp",
      "So sánh hãng xe",
      "Hiểu rõ về tiện nghi xe",
      "Đặt vé sớm để tiết kiệm",
      "Cách dùng mã giảm giá",
      "Chính sách hoàn tiền",
      "Lưu ý khi đặt vé",
    ],
  },
] as const;

type HotelFieldButtonProps = {
  label: string;
  value?: string;
  placeholder?: string;
  icon: any;
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

function SearchButton({ ariaLabel = "Tìm kiếm", onClick }: { ariaLabel?: string; onClick?: () => void }) {
  return (
    <button type="button" className="travel-search__submit" aria-label={ariaLabel} onClick={onClick}>
      <Search size={24} />
    </button>
  );
}

export default function CustomerTrainTicket() {
  const [busDeparture, setBusDeparture] = useState("Hà Nội");
  const [busDestination, setBusDestination] = useState("TP HCM");
  const [busJourneyDate] = useState(() => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate;
  });

  function formatBusSearchDate(date: Date) {
    return `${String(date.getDate()).padStart(2, "0")} thg ${date.getMonth() + 1}`;
  }

  return (
    <main className="hotel-customer bus-customer">
      <section className="hotel-customer__hero">
        <div className="customer-shell__container">
          <div
            className="hotel-customer__hero-image-wrapper"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(8, 24, 45, 0) 20%, rgba(8, 24, 45, 0.85) 100%), url(${baibienImage})`,
            }}
          >
            <div className="hotel-customer__hero-copy">
              <h1>Đặt vé tàu giá rẻ, chất lượng tốt</h1>
              <p>Tìm và so sánh vé tàu từ hàng trăm tuyến đường trên toàn quốc</p>
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
                    value={formatBusSearchDate(busJourneyDate)}
                    icon={CalendarDays}
                  />
                  <SearchButton ariaLabel="Tìm vé tàu" onClick={() => {}} />
                </div>
              </div>
            </div>
          </section>

        </div>
      </section>

      <section className="bus-customer__section" id="uu-dai">
        <div className="customer-shell__container">
          <div className="bus-customer__section-head">
            <div>
              <span>Ưu đãi nổi bật</span>
              <h2>Đặt vé tàu nhanh chóng và tiết kiệm ngay hôm nay</h2>
            </div>
          </div>

          <div className="bus-customer__promo-grid">
            {promoCards.map((item) => (
              <article
                key={item.title}
                className="bus-customer__promo-card"
                style={{
                  backgroundImage: destinationThemes[item.accent],
                }}
              >
                <span>{item.tag}</span>
                <strong>{item.title}</strong>
                <em>{item.subtitle}</em>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <article className="bus-customer__voucher-banner">
            <div className="bus-customer__voucher-copy">
              <strong>Tiết kiệm thêm với mã giảm giá mới nhất</strong>
              <p>Sử dụng TVLXEKH để áp dụng cho khách hàng mới đủ điều kiện.</p>
            </div>
            <div className="bus-customer__voucher-code">
              <span>Mã: TVLXEKH</span>
              <button type="button">
                <Copy size={14} />
                Sao chép
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="bus-customer__section" id="pho-bien">
        <div className="customer-shell__container">
          <div className="bus-customer__section-head">
            <div>
              <span>Tuyến đường phổ biến</span>
              <h2>Chọn tuyến đường phổ biến và đặt vé ngay</h2>
            </div>
          </div>

          <div className="bus-customer__route-grid">
            {popularRoutes.map((item) => (
              <article
                key={item.title}
                className="bus-customer__route-card"
                style={{ backgroundImage: destinationThemes[item.accent] }}
              >
                <div className="bus-customer__route-overlay">
                  <strong>{item.title}</strong>
                  <span>{item.meta}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bus-customer__section bus-customer__section--plain">
        <div className="customer-shell__container">
          <div className="bus-customer__section-head bus-customer__section-head--stacked">
            <div>
              <span>Nhà xe uy tín</span>
              <h2>Các hãng tàu hàng đầu</h2>
              <p>
                Các nhà xe lớn và uy tín trên toàn quốc đã có mặt để bạn dễ dàng so sánh, đặt vé
                và thanh toán trên cùng một nền tảng.
              </p>
            </div>
          </div>

          <div className="bus-customer__operator-grid">
            {busOperators.map((item) => (
              <div key={item} className="bus-customer__operator-card">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bus-customer__section bus-customer__section--plain">
        <div className="customer-shell__container">
          <div className="bus-customer__section-head bus-customer__section-head--stacked">
            <div>
              <span>Thanh toán</span>
              <h2>Nhiều phương thức thanh toán</h2>
              <p>Các phương thức thanh toán quen thuộc giúp quá trình đặt vé diễn ra nhanh và an toàn.</p>
            </div>
          </div>

          <div className="bus-customer__payment-grid">
            {paymentLogos.map((item) => (
              <div key={item} className="bus-customer__payment-card">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bus-customer__section bus-customer__section--plain">
        <div className="customer-shell__container">
          <div className="bus-customer__section-head">
            <div>
              <span>Câu hỏi thường gặp</span>
              <h2 id="faq">Giải đáp những thắc mắc của bạn</h2>
            </div>
          </div>

          <div className="bus-customer__faq-grid">
            {faqItems.map((item, index) => (
              <article key={index} className="bus-customer__faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bus-customer__section bus-customer__section--plain">
        <div className="customer-shell__container">
          <div className="bus-customer__section-head">
            <div>
              <span>Khám phá thêm</span>
              <h2>Tìm hiểu thêm về Traveloka</h2>
            </div>
          </div>

          <div className="bus-customer__discover-grid">
            {discoverColumns.map((column) => (
              <div key={column.title} className="bus-customer__discover-column">
                <h3>{column.title}</h3>
                <ul>
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#traveloka">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
