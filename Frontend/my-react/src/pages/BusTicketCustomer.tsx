import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Copy,
  Info,
  MapPinned,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import "../assets/css/homecustomer.css";
import "../assets/css/buscustomer.css";

type IconType = typeof Search;
type BusPopover = "departure" | "destination" | "date" | "passengers" | null;
type BusGuestKey = "adults" | "children";

const heroHighlights = [
  {
    title: "Giá vé rẻ nhất",
    body: "So sánh giá vé từ các hãng xe lớn và chọn chuyến đi phù hợp nhất với ngân sách.",
    icon: CircleDollarSign,
  },
  {
    title: "An toàn và thoải mái",
    body: "Xe khách hiện đại với đủ tiện nghi, chuyến đi an toàn với các nhà xe uy tín.",
    icon: ShieldCheck,
  },
  {
    title: "Hỗ trợ 24/7",
    body: "Đội ngũ hỗ trợ nhanh chóng sẵn sàng giải đáp mọi thắc mắc về chuyến đi.",
    icon: Sparkles,
  },
] as const;

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
    question: "Cách đặt vé xe khách trên Traveloka?",
    answer:
      "Chọn điểm khởi hành, điểm đến, ngày đi và số hành khách rồi bấm Tìm kiếm. Sau đó bạn có thể lọc theo giá, thời gian xuất phát và hãng xe trước khi đặt vé.",
  },
  {
    question: "Tôi có thể hủy vé xe được không?",
    answer:
      "Tùy vào chính sách hủy của hãng xe. Bạn nên kiểm tra phần điều kiện đặt vé để biết chi tiết về hủy miễn phí hoặc mức phí hủy.",
  },
  {
    question: "Vé xe khách có những ưu đãi gì?",
    answer:
      "Bạn có thể áp dụng mã giảm giá, tích điểm thành viên, hoặc tận dụng các chương trình khuyến mãi theo mùa để nhận giá vé tốt hơn.",
  },
  {
    question: "Tôi có thể đổi chuyến được không?",
    answer:
      "Có. Bạn có thể yêu cầu đổi chuyến trước thời hạn quy định. Nếu chuyến mới có giá thấp hơn, sẽ được hoàn tiền phần chênh lệch.",
  },
  {
    question: "Xe khách có những tiện nghi gì?",
    answer:
      "Tùy theo hãng xe, các tiện nghi có thể bao gồm: Wi-Fi, điều hòa không khí, ghế reclining, nước lạnh miễn phí, toilet trên xe.",
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

const busWeekdays = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"];
const busCalendarMonths = [
  { year: 2026, monthIndex: 3 },
  { year: 2026, monthIndex: 4 },
];

type BusFieldButtonProps = {
  label: string;
  value: string;
  icon: IconType;
  isOpen?: boolean;
  onClick: () => void;
  className?: string;
  children?: ReactNode;
};

function addDays(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

function isSameDay(leftDate: Date, rightDate: Date) {
  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  );
}

function formatBusSearchDate(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")} thg ${date.getMonth() + 1}`;
}

function getCalendarDays(year: number, monthIndex: number) {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7;
  const days: Array<Date | null> = Array.from({ length: leadingEmptyDays }, () => null);

  for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
    days.push(new Date(year, monthIndex, dayNumber));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function BusFieldButton({
  label,
  value,
  icon: Icon,
  isOpen,
  onClick,
  className,
  children,
}: BusFieldButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClick();
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClick]);

  return (
    <div
      ref={ref}
      className={["travel-bus-field-wrap", isOpen ? "is-open" : "", className].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        className="travel-bus-field"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="travel-bus-field__label">{label}</span>
        <span className="travel-bus-field__value">{value}</span>
        <Icon size={20} />
      </button>
      {children}
    </div>
  );
}

export default function BusTicketCustomer() {
  const [busDeparture, setBusDeparture] = useState("Hà Nội");
  const [busDestination, setBusDestination] = useState("TP HCM");
  const [busJourneyDate, setBusJourneyDate] = useState(() => addDays(new Date(), 1));
  const [busPassengers, setBusPassengers] = useState({ adults: 1, children: 0 });
  const [openBusPopover, setOpenBusPopover] = useState<BusPopover>(null);

  const busPassengerSummary = useMemo(() => {
    const parts = [];
    if (busPassengers.adults > 0) {
      parts.push(`${busPassengers.adults} người lớn`);
    }
    if (busPassengers.children > 0) {
      parts.push(`${busPassengers.children} trẻ em`);
    }
    return parts.join(", ");
  }, [busPassengers]);

  function handleBusDateSelect(date: Date) {
    setBusJourneyDate(date);
    setOpenBusPopover(null);
  }

  function handleBusPassengerChange(key: BusGuestKey, amount: number) {
    setBusPassengers((currentValue) => ({
      ...currentValue,
      [key]: Math.max(0, currentValue[key] + amount),
    }));
  }

  function swapLocations() {
    const temp = busDeparture;
    setBusDeparture(busDestination);
    setBusDestination(temp);
  }

  return (
    <main className="bus-customer">
      <section className="bus-customer__hero">
        <div className="customer-shell__container">
          <div className="bus-customer__hero-head">
            <h1>Đặt vé xe khách giá rẻ, chất lượng tốt</h1>
            <p>
              Tìm và so sánh vé xe khách từ hàng trăm tuyến đường trên toàn quốc
            </p>
          </div>

          <section className="travel-search bus-customer__search" id="tim-kiem">
            <div className="travel-search__inner">
              <div className="travel-bus-search-bar">
                <BusFieldButton
                  label="Nơi khởi hành"
                  value={busDeparture}
                  icon={MapPinned}
                  isOpen={openBusPopover === "departure"}
                  onClick={() =>
                    setOpenBusPopover((currentValue) =>
                      currentValue === "departure" ? null : "departure"
                    )
                  }
                  className="travel-bus-field-wrap--departure"
                >
                  {openBusPopover === "departure" ? (
                    <div className="travel-bus-panel travel-bus-panel--departure">
                      <input
                        type="text"
                        placeholder="Nhập thành phố hoặc tuyến đường..."
                        className="travel-bus-panel__input"
                      />
                      <div className="travel-bus-panel__list">
                        {["Hà Nội", "TP HCM", "Đà Nẵng", "Hải Phòng", "Cần Thơ"].map((city) => (
                          <button
                            key={city}
                            type="button"
                            className="travel-bus-panel__item"
                            onClick={() => {
                              setBusDeparture(city);
                              setOpenBusPopover(null);
                            }}
                          >
                            <MapPinned size={16} />
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </BusFieldButton>

                <button
                  type="button"
                  className="travel-bus-swap"
                  onClick={swapLocations}
                  aria-label="Hoán đổi điểm khởi hành và điểm đến"
                >
                  <ChevronRight size={20} />
                </button>

                <BusFieldButton
                  label="Nơi đến"
                  value={busDestination}
                  icon={MapPinned}
                  isOpen={openBusPopover === "destination"}
                  onClick={() =>
                    setOpenBusPopover((currentValue) =>
                      currentValue === "destination" ? null : "destination"
                    )
                  }
                  className="travel-bus-field-wrap--destination"
                >
                  {openBusPopover === "destination" ? (
                    <div className="travel-bus-panel travel-bus-panel--destination">
                      <input
                        type="text"
                        placeholder="Nhập thành phố hoặc tuyến đường..."
                        className="travel-bus-panel__input"
                      />
                      <div className="travel-bus-panel__list">
                        {["TP HCM", "Đà Lạt", "Nha Trang", "Hạ Long", "Vũng Tàu"].map((city) => (
                          <button
                            key={city}
                            type="button"
                            className="travel-bus-panel__item"
                            onClick={() => {
                              setBusDestination(city);
                              setOpenBusPopover(null);
                            }}
                          >
                            <MapPinned size={16} />
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </BusFieldButton>

                <BusFieldButton
                  label="Ngày khởi hành"
                  value={formatBusSearchDate(busJourneyDate)}
                  icon={CalendarDays}
                  isOpen={openBusPopover === "date"}
                  onClick={() =>
                    setOpenBusPopover((currentValue) =>
                      currentValue === "date" ? null : "date"
                    )
                  }
                  className="travel-bus-field-wrap--date"
                >
                  {openBusPopover === "date" ? (
                    <div className="travel-bus-panel travel-bus-panel--date">
                      <div className="travel-bus-calendar">
                        {busCalendarMonths.map((item) => (
                          <div key={`${item.year}-${item.monthIndex}`} className="travel-bus-calendar__month">
                            <div className="travel-bus-calendar__header">
                              <button type="button">
                                <ChevronLeft size={20} />
                              </button>
                              <span className="travel-bus-calendar__title">
                                Tháng {item.monthIndex + 1} năm {item.year}
                              </span>
                              <button type="button">
                                <ChevronRight size={20} />
                              </button>
                            </div>

                            <div className="travel-bus-calendar__weekdays">
                              {busWeekdays.map((weekday) => (
                                <span key={weekday} className="travel-bus-calendar__weekday">
                                  {weekday}
                                </span>
                              ))}
                            </div>

                            <div className="travel-bus-calendar__days">
                              {getCalendarDays(item.year, item.monthIndex).map((date, dayIndex) => {
                                if (!date) {
                                  return (
                                    <span
                                      key={`blank-${dayIndex}`}
                                      className="travel-bus-calendar__blank"
                                    />
                                  );
                                }

                                const isSelected = isSameDay(date, busJourneyDate);
                                const isPast = date < new Date();
                                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                                const className = [
                                  "travel-bus-calendar__day",
                                  isWeekend ? "is-weekend" : "",
                                  isSelected ? "is-selected" : "",
                                  isPast ? "is-past" : "",
                                ]
                                  .filter(Boolean)
                                  .join(" ");

                                return (
                                  <button
                                    key={date.toISOString()}
                                    type="button"
                                    className={className}
                                    onClick={() => handleBusDateSelect(date)}
                                    disabled={isPast}
                                  >
                                    {date.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </BusFieldButton>

                <BusFieldButton
                  label="Hành khách"
                  value={busPassengerSummary}
                  icon={Users}
                  isOpen={openBusPopover === "passengers"}
                  onClick={() =>
                    setOpenBusPopover((currentValue) =>
                      currentValue === "passengers" ? null : "passengers"
                    )
                  }
                  className="travel-bus-field-wrap--passengers"
                >
                  {openBusPopover === "passengers" ? (
                    <div className="travel-bus-panel travel-bus-panel--passengers">
                      <div className="travel-bus-guest-list">
                        <div className="travel-bus-guest-row">
                          <div className="travel-bus-guest-copy">
                            <strong>Người lớn</strong>
                            <span>Từ 12 tuổi trở lên</span>
                          </div>
                          <div className="travel-bus-guest-counter">
                            <button
                              type="button"
                              onClick={() => handleBusPassengerChange("adults", -1)}
                              disabled={busPassengers.adults <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span>{busPassengers.adults}</span>
                            <button
                              type="button"
                              onClick={() => handleBusPassengerChange("adults", 1)}
                              disabled={busPassengers.adults >= 9}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="travel-bus-guest-row">
                          <div className="travel-bus-guest-copy">
                            <strong>Trẻ em</strong>
                            <span>Dưới 12 tuổi</span>
                          </div>
                          <div className="travel-bus-guest-counter">
                            <button
                              type="button"
                              onClick={() => handleBusPassengerChange("children", -1)}
                              disabled={busPassengers.children <= 0}
                            >
                              <Minus size={16} />
                            </button>
                            <span>{busPassengers.children}</span>
                            <button
                              type="button"
                              onClick={() => handleBusPassengerChange("children", 1)}
                              disabled={busPassengers.children >= 9}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="travel-bus-panel__actions">
                        <button
                          type="button"
                          className="travel-bus-done"
                          onClick={() => setOpenBusPopover(null)}
                        >
                          Xong
                        </button>
                      </div>
                    </div>
                  ) : null}
                </BusFieldButton>

                <button type="button" className="travel-search__submit" aria-label="Tìm vé xe">
                  <Search size={24} />
                </button>
              </div>
            </div>

            <div className="travel-search__footer">
              <div className="travel-search__footer-title">Tìm kiếm nổi bật</div>
              <div className="travel-search__footer-links">
                <a href="#uu-dai">
                  <CircleDollarSign size={16} />
                  Mã giảm giá hôm nay
                </a>
                <a href="#pho-bien">
                  <Ticket size={16} />
                  Tuyến đường phổ biến
                </a>
                <a href="#faq">
                  <Info size={16} />
                  Câu hỏi thường gặp
                </a>
              </div>
            </div>
          </section>

          <div className="bus-customer__hero-highlights">
            {heroHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="bus-customer__highlight-card">
                  <span className="bus-customer__highlight-icon">
                    <Icon size={18} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bus-customer__section" id="uu-dai">
        <div className="customer-shell__container">
          <div className="bus-customer__section-head">
            <div>
              <span>Ưu đãi nổi bật</span>
              <h2>Đặt vé xe khách nhanh chóng và tiết kiệm ngay hôm nay</h2>
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
              <h2>Các hãng xe khách hàng đầu</h2>
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
