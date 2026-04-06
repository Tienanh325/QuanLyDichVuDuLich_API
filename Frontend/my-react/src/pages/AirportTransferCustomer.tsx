import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Info,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
  Clock,
  MapPin,
} from "lucide-react";
import "../assets/css/homecustomer.css";
import "../assets/css/airporttransfer.css";

type IconType = typeof Search;
type AirportPopover = "pickup" | "dropoff" | "date" | "time" | null;

const heroHighlights = [
  {
    title: "Phù hợp với nhu cầu",
    body: "Với nhiều lựa chọn xe sẽ giúp bạn dễ dàng chọn loại xe phù hợp với nhu cầu của mình.",
    icon: ShieldCheck,
  },
  {
    title: "Không cần lo lắng",
    body: "Bãi trước để thông báo giá xe hoàn toàn cọc trước và các tài xế sẽ đón bạn đúng giờ.",
    icon: Sparkles,
  },
  {
    title: "Đối tác tốt nhất",
    body: "Sự tin tưởng từ các công ty vận tải lớn nhất khu vực cho các dịch vụ của chúng tôi.",
    icon: ShieldCheck,
  },
] as const;

const pickupOptions = [
  "Sân bay Nội Bài, Hà Nội",
  "Sân bay Tân Sơn Nhất, TP HCM",
  "Sân bay Đà Nẵng",
  "Sân bay Phủ Quốc",
  "Sân bay Cần Thơ",
];

const dropoffOptions = [
  "Trung tâm thành phố",
  "Khách sạn",
  "Nhà riêng",
  "Ga tàu",
  "Bến xe",
];

const airportOperators = [
  { name: "Nỏi Sân Ngoài", logo: "🏢" },
  { name: "VTS", logo: "🚗" },
  { name: "Megabus", logo: "🚌" },
  { name: "SATICO", logo: "🚕" },
  { name: "SmartStyle", logo: "✨" },
  { name: "Hertz", logo: "🎯" },
  { name: "S9", logo: "S9" },
  { name: "CarGo", logo: "🚐" },
  { name: "Golden Route", logo: "⭐" },
  { name: "BigBird", logo: "🦅" },
  { name: "KLIA", logo: "✈️" },
  { name: "X-Trans", logo: "🚗" },
];

const paymentMethods = [
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

const processSteps = [
  {
    number: 1,
    title: "Tìm xe",
    description: "Bấu chọn tìm bằng cách chọn điểm xuất phát và đặc điểm phù hợp (nếu như bay) đặn thông tin ngày đến sân bay.",
  },
  {
    number: 2,
    title: "Chọn xe",
    description: "Chọn xe phù hợp với nhu cầu của bạn từ trạng kết quả tìm kiếm bao gồm thông tin vận chuyển và phương tiện công cộng.",
  },
  {
    number: 3,
    title: "Xem thông tin xe",
    description: "Kiểm tra thông tin xe, địa điểm đón và xuống xe. Luận ý cung cấp thông tin chuyến đi nếu như được yêu cầu.",
  },
  {
    number: 4,
    title: "Diễn biễu màu đặt chỗ",
    description: "Điền thông tin liên hệ và thông tin hành khách. Đảm bảo thông tin chính xác để không rắc rối về sau hành trình của bạn.",
  },
  {
    number: 5,
    title: "Hoàn tất thanh toán",
    description: "Kiểm tra xá thông tin đặt chỗ trước đó tiếp tục thanh toán. Chọn phương thức thanh toán yêu thích và hoàn tất đặt chỗ.",
  },
  {
    number: 6,
    title: "Nhận phiếu thanh toán",
    description: "Khi thanh toán đã được các luộc phiếu thanh toán sẽ được gửi đến sân bay của bạn được gởi ứng dụng Traveloka hoặc email.",
  },
];

const whyChooseUs = [
  {
    icon: "💰",
    title: "Phù hợp với nhu cầu",
    description: "Với nhiều lựa chọn xe sẽ xe riêng dấn sân bay bạn có thể dễ dàng lựa chọn loại xe phù hợp với nhu cầu như kích thước phòng, hay tính năng thích hợp người đông hay ít.",
  },
  {
    icon: "🛡️",
    title: "Không cần lo lắng",
    description: "Bãi trước để thông báo giá xe hoàn toàn cọc trước và các tài xế sẽ đón bạn đúng giờ. Hơn nữa ứng dụng GPS sẽ theo dõi vị trí tài xế trong suốt hành trình.",
  },
  {
    icon: "⭐",
    title: "Đối tác tốt nhất",
    description: "Sự tin tưởng từ các công ty vận tải lớn nhất khu vực cho các dịch vụ của chúng tôi là đủ để bạn yên tâm khi sử dụng dịch vụ xe đưa đón sân bay Traveloka.",
  },
];

type AirportFieldButtonProps = {
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

function formatAirportDate(date: Date) {
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

function AirportFieldButton({
  label,
  value,
  icon: Icon,
  isOpen,
  onClick,
  className,
  children,
}: AirportFieldButtonProps) {
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
      className={[
        "travel-airport-field-wrap",
        isOpen ? "is-open" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className="travel-airport-field"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="travel-airport-field__label">{label}</span>
        <span className="travel-airport-field__value">{value}</span>
        <Icon size={20} />
      </button>
      {children}
    </div>
  );
}

const weekdays = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"];
const calendarMonths = [
  { year: 2026, monthIndex: 3 },
  { year: 2026, monthIndex: 4 },
];

export default function AirportTransferCustomer() {
  const [pickupLocation, setPickupLocation] = useState("Sân bay Tân Sơn Nhất");
  const [dropoffLocation, setDropoffLocation] = useState("Trung tâm thành phố");
  const [pickupDate, setPickupDate] = useState(() => addDays(new Date(), 1));
  const [pickupTime, setPickupTime] = useState("08:00");
  const [openPopover, setOpenPopover] = useState<AirportPopover>(null);

  function handleDateSelect(date: Date) {
    setPickupDate(date);
    setOpenPopover(null);
  }

  return (
    <main className="airport-transfer">
      <section className="airport-transfer__hero">
        <div className="customer-shell__container">
          <div className="airport-transfer__hero-content">
            <div className="airport-transfer__hero-head">
              <h1>Tạm biệt mọi lo lắng và mặt mối với dịch vụ xe đưa đón sân bay Traveloka</h1>
              <p>
                Traveloka cung cấp dịch vụ đưa đón sân bay giúp khách hàng có dùng từ chuyến đi và có sẵn dụng tức thờ trong chuyến đi như cần với những lựa chọn phù hợp với từng người cần của mình. Đặt ngay xe đưa đón sân bay trên Traveloka
              </p>
            </div>

            <div className="airport-transfer__promo-image">
              <div className="promo-badge">CÓ MẠI LÌNH</div>
              <div className="promo-badge-sub">ĐƯA ĐÓN</div>
            </div>
          </div>

          <section className="travel-search airport-transfer__search" id="tim-kiem">
            <div className="travel-search__inner">
              <div className="travel-airport-search-bar">
                <AirportFieldButton
                  label="Tử sân bay"
                  value={pickupLocation}
                  icon={MapPinned}
                  isOpen={openPopover === "pickup"}
                  onClick={() =>
                    setOpenPopover((currentValue) =>
                      currentValue === "pickup" ? null : "pickup"
                    )
                  }
                  className="travel-airport-field-wrap--pickup"
                >
                  {openPopover === "pickup" ? (
                    <div className="travel-airport-panel travel-airport-panel--pickup">
                      <input
                        type="text"
                        placeholder="Nhập sân bay..."
                        className="travel-airport-panel__input"
                      />
                      <div className="travel-airport-panel__list">
                        {pickupOptions.map((airport) => (
                          <button
                            key={airport}
                            type="button"
                            className="travel-airport-panel__item"
                            onClick={() => {
                              setPickupLocation(airport);
                              setOpenPopover(null);
                            }}
                          >
                            <MapPinned size={16} />
                            {airport}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </AirportFieldButton>

                <AirportFieldButton
                  label="Đến nơi xurc, địu chỉ, nơi nhà"
                  value={dropoffLocation}
                  icon={MapPin}
                  isOpen={openPopover === "dropoff"}
                  onClick={() =>
                    setOpenPopover((currentValue) =>
                      currentValue === "dropoff" ? null : "dropoff"
                    )
                  }
                  className="travel-airport-field-wrap--dropoff"
                >
                  {openPopover === "dropoff" ? (
                    <div className="travel-airport-panel travel-airport-panel--dropoff">
                      <input
                        type="text"
                        placeholder="Nhập địa chỉ đến..."
                        className="travel-airport-panel__input"
                      />
                      <div className="travel-airport-panel__list">
                        {dropoffOptions.map((location) => (
                          <button
                            key={location}
                            type="button"
                            className="travel-airport-panel__item"
                            onClick={() => {
                              setDropoffLocation(location);
                              setOpenPopover(null);
                            }}
                          >
                            <MapPin size={16} />
                            {location}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </AirportFieldButton>

                <AirportFieldButton
                  label="Ngày đón"
                  value={formatAirportDate(pickupDate)}
                  icon={CalendarDays}
                  isOpen={openPopover === "date"}
                  onClick={() =>
                    setOpenPopover((currentValue) =>
                      currentValue === "date" ? null : "date"
                    )
                  }
                  className="travel-airport-field-wrap--date"
                >
                  {openPopover === "date" ? (
                    <div className="travel-airport-panel travel-airport-panel--date">
                      <div className="travel-airport-calendar">
                        {calendarMonths.map((item) => (
                          <div key={`${item.year}-${item.monthIndex}`} className="travel-airport-calendar__month">
                            <div className="travel-airport-calendar__header">
                              <button type="button" aria-label="Tháng trước">
                                <ChevronLeft size={20} />
                              </button>
                              <span className="travel-airport-calendar__title">
                                Tháng {item.monthIndex + 1} năm {item.year}
                              </span>
                              <button type="button" aria-label="Tháng sau">
                                <ChevronRight size={20} />
                              </button>
                            </div>

                            <div className="travel-airport-calendar__weekdays">
                              {weekdays.map((weekday) => (
                                <span key={weekday} className="travel-airport-calendar__weekday">
                                  {weekday}
                                </span>
                              ))}
                            </div>

                            <div className="travel-airport-calendar__days">
                              {getCalendarDays(item.year, item.monthIndex).map(
                                (date, dayIndex) => {
                                  if (!date) {
                                    return (
                                      <span
                                        key={`blank-${dayIndex}`}
                                        className="travel-airport-calendar__blank"
                                      />
                                    );
                                  }

                                  const isSelected = isSameDay(date, pickupDate);
                                  const isPast = date < new Date();
                                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                                  const className = [
                                    "travel-airport-calendar__day",
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
                                      onClick={() => handleDateSelect(date)}
                                      disabled={isPast}
                                    >
                                      {date.getDate()}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </AirportFieldButton>

                <AirportFieldButton
                  label="Giờ đón"
                  value={pickupTime}
                  icon={Clock}
                  isOpen={openPopover === "time"}
                  onClick={() =>
                    setOpenPopover((currentValue) =>
                      currentValue === "time" ? null : "time"
                    )
                  }
                  className="travel-airport-field-wrap--time"
                >
                  {openPopover === "time" ? (
                    <div className="travel-airport-panel travel-airport-panel--time">
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="travel-airport-panel__time-input"
                      />
                    </div>
                  ) : null}
                </AirportFieldButton>

                <button type="button" className="travel-search__submit" aria-label="Tìm xe">
                  <Search size={24} />
                </button>
              </div>
            </div>

            <div className="travel-search__footer">
              <div className="travel-search__footer-title">Tìm kiếm nổi bật</div>
              <div className="travel-search__footer-links">
                <a href="#tai-sao">
                  <CircleDollarSign size={16} />
                  Tại sao nên dặt với Traveloka
                </a>
                <a href="#doi-tac">
                  <MapPinned size={16} />
                  Đối tác xe đưa đón
                </a>
                <a href="#quy-trinh">
                  <Info size={16} />
                  Quy trình đặt xe
                </a>
              </div>
            </div>
          </section>

          <div className="airport-transfer__hero-highlights">
            {heroHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="airport-transfer__highlight-card">
                  <span className="airport-transfer__highlight-icon">
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

      <section className="airport-transfer__section airport-transfer__section--process" id="quy-trinh">
        <div className="customer-shell__container">
          <div className="airport-transfer__section-head">
            <div>
              <span>Quy trình dễ dàng</span>
              <h2>Cách đặt xe đưa đón sân bay trên Traveloka như thế nào?</h2>
            </div>
          </div>

          <div className="airport-transfer__process-grid">
            {processSteps.map((step) => (
              <article key={step.number} className="airport-transfer__process-card">
                <div className="airport-transfer__process-number">
                  {step.number}
                </div>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="airport-transfer__section" id="tai-sao">
        <div className="customer-shell__container">
          <div className="airport-transfer__section-head">
            <div>
              <span>Lợi ích</span>
              <h2>Tại sao lại nên dặt vé đưa đón sân bay qua Traveloka?</h2>
            </div>
          </div>

          <div className="airport-transfer__why-grid">
            {whyChooseUs.map((item) => (
              <article key={item.title} className="airport-transfer__why-card">
                <div className="airport-transfer__why-icon">{item.icon}</div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="airport-transfer__section airport-transfer__section--plain" id="doi-tac">
        <div className="customer-shell__container">
          <div className="airport-transfer__section-head">
            <div>
              <span>Đối tác</span>
              <h2>Đối tác xe đưa đón sân bay</h2>
            </div>
          </div>

          <div className="airport-transfer__operator-grid">
            {airportOperators.map((item) => (
              <div key={item.name} className="airport-transfer__operator-card">
                <div className="airport-transfer__operator-logo">
                  {item.logo}
                </div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="airport-transfer__section airport-transfer__section--plain">
        <div className="customer-shell__container">
          <div className="airport-transfer__section-head airport-transfer__section-head--stacked">
            <div>
              <span>Thanh toán</span>
              <h2>Nhiều phương thức thanh toán</h2>
              <p>Các phương thức thanh toán quen thuộc giúp quá trình đặt xe diễn ra nhanh và an toàn.</p>
            </div>
          </div>

          <div className="airport-transfer__payment-grid">
            {paymentMethods.map((item) => (
              <div key={item} className="airport-transfer__payment-card">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
