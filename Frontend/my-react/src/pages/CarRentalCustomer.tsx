import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
} from "lucide-react";
import "../assets/css/homecustomer.css";
import "../assets/css/carrental.css";

type IconType = typeof Search;
type CarPopover = "pickup" | "dropoff" | "startDate" | "duration" | null;
type RentalType = "self_drive" | "with_driver";

const rentalTypes = [
  { id: "self_drive", label: "Tự lái" },
  { id: "with_driver", label: "Có tài xế" },
];

const pickupLocations = [
  "Hà Nội",
  "TP HCM",
  "Đà Nẵng",
  "Phủ Quốc",
  "Nha Trang",
];

const carPartners = [
  { name: "AVIS", logo: "AVIS" },
  { name: "AVIS", logo: "AVIS" },
  { name: "Europcar", logo: "Europcar" },
  { name: "Dollar", logo: "Dollar" },
  { name: "Budget", logo: "Budget" },
  { name: "THRIFTY", logo: "THRIFTY" },
  { name: "Hertz", logo: "Hertz" },
  { name: "SiXT", logo: "SiXT" },
  { name: "DOOLER", logo: "DOOLER" },
  { name: "DOLOMY", logo: "DOLOMY" },
  { name: "Unipro", logo: "Unipro" },
  { name: "OKI", logo: "OKI" },
];

const selfDriveRequirements = {
  included: [
    "Bảo hiểm cho xe và hành khách",
    "Thời gian sử dụng xe tối 24 tiếng cho mỗi ngày thuê",
  ],
  notIncluded: [
    "Chi phí nhiên liệu, đỗ xe và những phí khác liên quan",
    "Phí cấp lại bằng lái nếu quên hoặc bị mất",
  ],
  discountInfo: [
    "Miễn phí đón và trả khách tại sân bay và trong thành phố",
    "Tặng xe cho ngành công nghiệp, nếu có yêu cầu hợp lệ khác",
  ],
  note: "Lưu ý: Các quy định mang tính chất chỉ định không bắt buộc và không cấu thành cơ sở dự định hành động pháp lý của bất kỳ cá nhân hay pháp nhân.",
};

const withDriverRequirements = {
  included: [
    "Số dùng xe trong thành phố",
    "Thời gian lái xe bán 12 sáng tối đón 23:59 cho mỗi ngày thuê xe",
  ],
  notIncluded: [
    "Nhân sự, phí ship, phí đựng, phí cấp giấy của tài xế và tiền tips",
    "Phí lịch trình lệnh để loại vận chuyển khi hết vé trung tâm",
  ],
  discountInfo: [
    "Miễn phí đón và trả khách tại sân bay và trong thành phố",
    "Từ xe sẽ bàn với người trong Hoading tự 12 - 24 tiếng trong giờ đón khách. Thường hay không có sự luân phiên ngày, sẽ sẻ lúc nếu lộ bạn chống sang khi qua trải nghi ghi xác nhân chống sang khi qua",
  ],
};

const faqItems = [
  {
    question: "Tại sao lôi thuê xe ở tôi trên Traveloka?",
    answer: "Traveloka cung cấp các dịch vụ thuê xe với giá cạnh tranh, nhiều lựa chọn xe và đối tác uy tín.",
  },
  {
    question: "Làm thế nào để đặt xe trên Traveloka?",
    answer: "Chọn địa điểm nhận xe, ngày đi, loại xe và click 'Tìm xe'. Sau đó chọn xe phù hợp và hoàn tất đặt phòng.",
  },
  {
    question: "Tôi có thể hủy được không?",
    answer: "Có, bạn có thể hủy trước thời hạn quy định và nhận lại tiền hoặc tín dụng.",
  },
  {
    question: "Làm thế nào để tôi được lợi ích gợi ý đặc biệt?",
    answer: "Bạn có thể dùng mã giảm giá hoặc tham gia chương trình khách hàng thân thiết.",
  },
  {
    question: "Dịch vụ thuê xe có bảo gồm những gì?",
    answer: "Bao gồm bảo hiểm cơ bản, hỗ trợ 24/7 và nhiều dịch vụ khác tùy theo gói được chọn.",
  },
  {
    question: "Tôi nên làm gì khi không may liên tác với tài xế?",
    answer: "Hãy liên hệ với trung tâm hỗ trợ khách hàng của chúng tôi để được giúp đỡ ngay lập tức.",
  },
];

const carTypes = [
  { name: "Toyota Avios", segments: "A" },
  { name: "Toyota Vans", segments: "B" },
  { name: "Toyota Camry", segments: "C" },
  { name: "Toyota Vios", segments: "D" },
  { name: "Alphard", segments: "E" },
];

const carDestinations = [
  { name: "Thái lạn ở Jakarta", image: "🌴" },
  { name: "Thái xe ở Bandung", image: "🏔️" },
  { name: "Thái xe ở Bali", image: "🏝️" },
  { name: "Thái xe ở Kuala Lumpur", image: "🏙️" },
  { name: "Thái xe ở Bangkok", image: "🌆" },
  { name: "Thái xe ở Sydney", image: "🌊" },
  { name: "Thái xe ở Manila", image: "🏢" },
  { name: "Thái xe ở Melbourne", image: "🌃" },
  { name: "Thái xe ở Thành phố Hồ Chí Minh", image: "🌉" },
];

type CarFieldButtonProps = {
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

function formatCarDate(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")} thg ${date.getMonth() + 1}, ${date.getFullYear()}`;
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

function CarFieldButton({
  label,
  value,
  icon: Icon,
  isOpen,
  onClick,
  className,
  children,
}: CarFieldButtonProps) {
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
      className={["travel-car-field-wrap", isOpen ? "is-open" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className="travel-car-field"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="travel-car-field__label">{label}</span>
        <span className="travel-car-field__value">{value}</span>
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

export default function CarRentalCustomer() {
  const [rentalType, setRentalType] = useState<RentalType>("self_drive");
  const [pickupLocation, setPickupLocation] = useState("Hà Nội");
  const [startDate, setStartDate] = useState(() => addDays(new Date(), 1));
  const [duration, setDuration] = useState("1");
  const [openPopover, setOpenPopover] = useState<CarPopover>(null);

  function handleStartDateSelect(date: Date) {
    setStartDate(date);
    setOpenPopover(null);
  }

  return (
    <main className="car-rental">
      <section className="car-rental__hero">
        <div className="customer-shell__container">
          <div className="car-rental__hero-head">
            <h1>Dịch vụ cho thuê xe tự lái và thuê xe có tài xế ở Long Traveloka</h1>
            <p>
              Tận hưởng dịch vụ xe cho thuê ô tô hay thuê xe có tài xế giá rẻ tại Traveloka. Traveloka - Nền tảng đặt dịch hành đơn Đông Nam Á cung cấp dịch vụ cho thuê xe ô tô với giá cạnh tranh tốt nhất Việt Nam
            </p>
          </div>

          <section className="travel-search car-rental__search" id="tim-kiem">
            <div className="travel-search__inner">
              <div className="car-rental__tabs">
                {rentalTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={["car-rental__tab", rentalType === type.id ? "is-active" : ""]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setRentalType(type.id as RentalType)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="travel-car-search-bar">
                <CarFieldButton
                  label="Bản điểm nhận xe du lịch"
                  value={pickupLocation}
                  icon={MapPin}
                  isOpen={openPopover === "pickup"}
                  onClick={() =>
                    setOpenPopover((currentValue) =>
                      currentValue === "pickup" ? null : "pickup"
                    )
                  }
                  className="travel-car-field-wrap--pickup"
                >
                  {openPopover === "pickup" ? (
                    <div className="travel-car-panel travel-car-panel--pickup">
                      <input
                        type="text"
                        placeholder="Nhập thành phố, sân bay, khách sạn..."
                        className="travel-car-panel__input"
                      />
                      <div className="travel-car-panel__list">
                        {pickupLocations.map((location) => (
                          <button
                            key={location}
                            type="button"
                            className="travel-car-panel__item"
                            onClick={() => {
                              setPickupLocation(location);
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
                </CarFieldButton>

                <CarFieldButton
                  label="Ngày bắt đầu"
                  value={formatCarDate(startDate)}
                  icon={CalendarDays}
                  isOpen={openPopover === "startDate"}
                  onClick={() =>
                    setOpenPopover((currentValue) =>
                      currentValue === "startDate" ? null : "startDate"
                    )
                  }
                  className="travel-car-field-wrap--date"
                >
                  {openPopover === "startDate" ? (
                    <div className="travel-car-panel travel-car-panel--date">
                      <div className="travel-car-calendar">
                        {calendarMonths.map((item) => (
                          <div
                            key={`${item.year}-${item.monthIndex}`}
                            className="travel-car-calendar__month"
                          >
                            <div className="travel-car-calendar__header">
                              <button
                                type="button"
                                aria-label="Tháng trước"
                              >
                                <ChevronLeft size={20} />
                              </button>
                              <span className="travel-car-calendar__title">
                                Tháng {item.monthIndex + 1} năm {item.year}
                              </span>
                              <button
                                type="button"
                                aria-label="Tháng sau"
                              >
                                <ChevronRight size={20} />
                              </button>
                            </div>

                            <div className="travel-car-calendar__weekdays">
                              {weekdays.map((weekday) => (
                                <span
                                  key={weekday}
                                  className="travel-car-calendar__weekday"
                                >
                                  {weekday}
                                </span>
                              ))}
                            </div>

                            <div className="travel-car-calendar__days">
                              {getCalendarDays(item.year, item.monthIndex).map(
                                (date, dayIndex) => {
                                  if (!date) {
                                    return (
                                      <span
                                        key={`blank-${dayIndex}`}
                                        className="travel-car-calendar__blank"
                                      />
                                    );
                                  }

                                  const isSelected = isSameDay(date, startDate);
                                  const isPast = date < new Date();

                                  const className = [
                                    "travel-car-calendar__day",
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
                                      onClick={() => handleStartDateSelect(date)}
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
                </CarFieldButton>

                <div className="travel-car-field-wrap travel-car-field-wrap--duration">
                  <label htmlFor="duration" className="travel-car-field__label">
                    Thời lượng
                  </label>
                  <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="travel-car-field__select"
                  >
                    {Array.from({ length: 30 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {i + 1} ngày
                      </option>
                    ))}
                  </select>
                </div>

                <button type="button" className="travel-search__submit" aria-label="Tìm xe">
                  <Search size={24} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="car-rental__section">
        <div className="customer-shell__container">
          <div className="car-rental__section-head">
            <h2>Các đối tác cho thuê xe</h2>
            <p>Các công ty lớn cho thuê xe ở yêu thích</p>
          </div>

          <div className="car-rental__partners-grid">
            {carPartners.map((partner) => (
              <div key={partner.name} className="car-rental__partner-card">
                {partner.logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="car-rental__section car-rental__section--alt">
        <div className="customer-shell__container">
          <h2>Thuê Xe Tự Lái</h2>
          <p>
            Thuê xe tự lái là lựa chọn lý tưởng để có chuyến thành từ hoặc độc lập với khả năng tự chủ toàn bộ thời gian. bạn có thể tuỳ thuộc phái chở vì bạn muốn Traveloka - Nền tảng đặt dịch hành đơn Đông Nam Á có thể cung cấp cho thuê xe tự lái với giá cạnh tranh tốt nhất.
          </p>
          <p>Đặc biệt, thêm giáo đặt xe tối 24 tiếng cho mỗi ngày thuê</p>
        </div>
      </section>

      <section className="car-rental__section car-rental__section--alt">
        <div className="customer-shell__container">
          <h2>Thuê xe có tài xế</h2>
          <p>
            Di chuyến thuận tiện là mô tả chính của dịch quản trọng khi bạn di du lịch. Đặc biệt khi bạn mộng muốn có một chuyến di lịch có một chuyến di lịch giải pháp dù vậy không ngợi rằng Traveloka là tương hợp tỷ vừa bạn để có mộngvên ở TP. Cùng với sự phát triển của khu thuê xe, bạn có thể sử dụng khi hướng dẫn vào thư của chúng tôi để phục vụ hiệu quả với chi tiêu vì lời cầu của vấn đề mình.
          </p>
        </div>
      </section>

      <section className="car-rental__section">
        <div className="customer-shell__container">
          <h2>Yêu cầu chung khi thuê xe</h2>

          <div className="car-rental__requirements-grid">
            <div className="car-rental__requirement-card">
              <h3>Yêu cầu chung khi thuê xe tự lái</h3>

              <div className="car-rental__requirement-group">
                <strong>Bao gồm</strong>
                <ul>
                  {selfDriveRequirements.included.map((item, index) => (
                    <li key={index}>
                      <span className="bullet">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="car-rental__requirement-group">
                <strong>Không bao gồm</strong>
                <ul>
                  {selfDriveRequirements.notIncluded.map((item, index) => (
                    <li key={index}>
                      <span className="bullet">✗</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="car-rental__requirement-group">
                <strong>Gia đoạn giúp cấn thiết</strong>
                <ul>
                  {selfDriveRequirements.discountInfo.map((item, index) => (
                    <li key={index}>
                      <span className="bullet">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="car-rental__note">{selfDriveRequirements.note}</p>
            </div>

            <div className="car-rental__requirement-card">
              <h3>Yêu cầu chung khi thuê xe có tài xế</h3>

              <div className="car-rental__requirement-group">
                <strong>Bao gồm</strong>
                <ul>
                  {withDriverRequirements.included.map((item, index) => (
                    <li key={index}>
                      <span className="bullet">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="car-rental__requirement-group">
                <strong>Không bao gồm</strong>
                <ul>
                  {withDriverRequirements.notIncluded.map((item, index) => (
                    <li key={index}>
                      <span className="bullet">✗</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="car-rental__requirement-group">
                <strong>Gia đoạn giúp cấn thiết</strong>
                <ul>
                  {withDriverRequirements.discountInfo.map((item, index) => (
                    <li key={index}>
                      <span className="bullet">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="car-rental__section">
        <div className="customer-shell__container">
          <h2>Câu hỏi thường gặp (FAQ)</h2>

          <div className="car-rental__faq-grid">
            {faqItems.map((item, index) => (
              <details key={index} className="car-rental__faq-item">
                <summary className="car-rental__faq-question">
                  {item.question}
                </summary>
                <p className="car-rental__faq-answer">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="car-rental__section">
        <div className="customer-shell__container">
          <h2>Các loại xe của Golden Bird</h2>

          <div className="car-rental__cars-grid">
            {carTypes.map((car) => (
              <div key={car.name} className="car-rental__car-card">
                <div className="car-rental__car-image">🚗</div>
                <strong>{car.name}</strong>
                <span>{car.segments}</span>
              </div>
            ))}
          </div>

          <div className="car-rental__monthly-card">
            <h3>Monthly Car Rental in Traveloka</h3>
            <p>
              Find complete information regarding monthly car rental in Traveloka. Find the best provider to fulfill your monthly car needs.
            </p>
            <button type="button" className="car-rental__cta-button">
              Tìm năng
            </button>
          </div>
        </div>
      </section>

      <section className="car-rental__section car-rental__section--alt">
        <div className="customer-shell__container">
          <h2>RLP ÁN TOÀN VÀ TiỀN LỢI KHI THUÊ XE TRONG KỲ NGHỈ</h2>
          <p>
            Thuê xe ô tô được hỗ trợ với mục một lựa chọn như cạnh tranh người. Trong kỳ long một sự công bằng mà yêu cầu hợp nhất của người muốn tự chủ và đang để quản trị phần lợi chủ để nhận được sự an toàn, hiệu năng cao vô cùng. Sự công bằng mà tận hưởng vị trợ phát triển của khu thuê xe để mục chính vằng để lợi chủ của kinh tế tầm thị được khu năng để mục chính Việt Nam khi ghi khoảng với mục nhất giác như Traveloka.
          </p>
          <p>
            Xác cho phép với giả định chiến lược lợi chủ trong lĩnh vực thuê xe và bán lẻ lợi ích. Vị trị lợi chủ được hỗ trợ với mục một lựa chọn vằng được xác định chính sách với mục lợi chủ được hỗ trợ từ cho phép với giả định chiến lược lợi chủ trong lĩnh vực thuê xe và bán lẻ lợi ích.
          </p>
        </div>
      </section>

      <section className="car-rental__section">
        <div className="customer-shell__container">
          <h2>Các địa điểm thần kỳ được phổ biến</h2>

          <div className="car-rental__destinations-grid">
            {carDestinations.map((dest) => (
              <div key={dest.name} className="car-rental__destination-card">
                <div className="car-rental__destination-image">
                  {dest.image}
                </div>
                <span>{dest.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
