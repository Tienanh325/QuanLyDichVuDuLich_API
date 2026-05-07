import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  MapPinned,
  Search,
  Star,
  Users,
} from "lucide-react";
import baibienImage from "../assets/images/baibien.jpg";
import "../assets/css/CustomerHome.css";
import "../assets/css/CustomerHotel.css";
import CustomerHotelSearchResults from "./CustomerHotelSearchResults";
import {
  type HotelSearchState,
  buildHotelSearchQuery,
  defaultHotelSearchState,
  hotelQueryDateToDate,
  parseHotelSearchParams,
  toHotelQueryDate,
} from "../utils/hotelSearch";

type IconType = typeof Search;
type HotelPopover = "destination" | "stay" | "guests" | null;

type HotelFormState = {
  destination: PopularHotelDestination;
  stay: { checkIn: Date; checkOut: Date };
  guests: { adults: number; children: number; rooms: number };
};

const exclusiveOffers = [
  {
    id: 1,
    name: "Melia Bali - Nusa Dua",
    location: "Nusa Dua, Bali, Indonesia",
    rating: 4.8,
    reviews: 1245,
    oldPrice: 2500000,
    newPrice: 1850000,
    discount: 26,
    image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: 2,
    name: "Pan Pacific Hanoi",
    location: "Ba Đình, Hà Nội, Việt Nam",
    rating: 4.7,
    reviews: 892,
    oldPrice: 1800000,
    newPrice: 1280000,
    discount: 29,
    image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: 3,
    name: "Furama Resort Danang",
    location: "Bãi Bắc, Đà Nẵng, Việt Nam",
    rating: 4.9,
    reviews: 2103,
    oldPrice: 2100000,
    newPrice: 1450000,
    discount: 31,
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
] as const;

const accommodationTypes = [
  {
    id: 1,
    title: "Khu nghỉ dưỡng",
    subtitle: "Resort & Spa Luxury",
    image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    id: 2,
    title: "Biệt thự",
    subtitle: "Private Villa Escape",
    image: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  },
  {
    id: 3,
    title: "Căn hộ",
    subtitle: "Modern Apartment",
    image: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  },
  {
    id: 4,
    title: "Boutique Hotel",
    subtitle: "Unique Stay Experience",
    image: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)",
  },
] as const;

const massonryDestinations = [
  {
    id: 1,
    name: "Đà Nẵng",
    subtitle: "Thành phố biển xinh đẹp",
    hotels: "2.320 khách sạn",
    image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    size: "large",
  },
  {
    id: 2,
    name: "Hạ Long",
    subtitle: "Di sản thế giới",
    hotels: "1.540 khách sạn",
    image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    size: "small",
  },
  {
    id: 3,
    name: "Hội An",
    subtitle: "Phố cổ yên bình",
    hotels: "980 khách sạn",
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    size: "small",
  },
  {
    id: 4,
    name: "TP HCM",
    subtitle: "Thành phố sôi động",
    hotels: "2.876 khách sạn",
    image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    size: "small",
  },
  {
    id: 5,
    name: "TP HCM",
    subtitle: "Thành phố sôi động",
    hotels: "2.876 khách sạn",
    image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    size: "small",
  },
] as const;

const whyBookWithTraveloka = [
  {
    icon: CheckCircle,
    title: "Giá tốt nhất thị trường",
    description: "So sánh giá tức thì, đảm bảo bạn luôn nhận mức giá tốt nhất.",
  },
  {
    icon: Heart,
    title: "Hủy phòng linh hoạt",
    description: "Hủy miễn phí đến 24 giờ trước nhận phòng cho hầu hết các lựa chọn.",
  },
  {
    icon: Clock,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ khách hàng chuyên nghiệp luôn sẵn sàng hỗ trợ bạn mọi lúc.",
  },
] as const;
const hotelWeekdays = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"];
const hotelCalendarMonths = [
  { year: 2026, monthIndex: 3 },
  { year: 2026, monthIndex: 4 },
];

type PopularHotelDestination = {
  name: string;
  subtitle: string;
  type: string;
  count: string;
};

const popularHotelDestinations: PopularHotelDestination[] = [
  {
    name: "Đà Lạt",
    subtitle: "Lâm Đồng, Việt Nam",
    type: "Thành phố",
    count: "1.811 khách sạn",
  },
  {
    name: "Thành phố Vũng Tàu",
    subtitle: "Bà Rịa - Vũng Tàu, Việt Nam",
    type: "Thành phố",
    count: "1.024 khách sạn",
  },
  {
    name: "Nha Trang",
    subtitle: "Khánh Hòa, Việt Nam",
    type: "Thành phố",
    count: "1.355 khách sạn",
  },
  {
    name: "Kuala Lumpur",
    subtitle: "Malaysia",
    type: "Thành phố",
    count: "5.998 khách sạn",
  },
  {
    name: "Pattaya",
    subtitle: "Thái Lan",
    type: "Thành phố",
    count: "4.719 khách sạn",
  },
];

function findHotelDestination(destination: string, subtitle: string) {
  return (
    popularHotelDestinations.find((item) => item.name === destination) ?? {
      name: destination || defaultHotelSearchState.destination,
      subtitle: subtitle || defaultHotelSearchState.destinationSubtitle,
      type: "Thành phố",
      count: "Nhiều khách sạn",
    }
  );
}

type HotelFieldButtonProps = {
  label: string;
  value?: string;
  placeholder?: string;
  icon: IconType;
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
  helperText?: string;
  hasChevron?: boolean;
  children?: ReactNode;
  isTypable?: boolean;
  onChange?: (val: string) => void;
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

function isDateBetween(date: Date, startDate: Date, endDate: Date) {
  return date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime();
}

function formatHotelSearchDate(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")} thg ${date.getMonth() + 1} ${date.getFullYear()}`;
}

function formatHotelPanelDate(date: Date) {
  const weekdayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

  return `${weekdayNames[date.getDay()]}, ${String(date.getDate()).padStart(2, "0")} thg ${date.getMonth() + 1
    } ${date.getFullYear()}`;
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

function HotelFieldButton({
  label,
  value = "",
  placeholder = "",
  icon: Icon,
  isOpen = false,
  onClick,
  className,
  helperText,
  hasChevron = false,
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
        {hasChevron ? (
          <span className="travel-hotel-field__chevron">
            <ChevronDown size={18} />
          </span>
        ) : null}
      </div>
      {helperText ? <div className="travel-hotel-field__helper">{helperText}</div> : null}
      {children}
    </div>
  );
}

export default function CustomerHotel() {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedSearch = useMemo(
    () => parseHotelSearchParams(new URLSearchParams(location.search)),
    [location.search],
  );
  const hotelSearchRef = useRef<HTMLDivElement | null>(null);
  const [openHotelPopover, setOpenHotelPopover] = useState<HotelPopover>(null);
  const [hotelDateFocus, setHotelDateFocus] = useState<"checkIn" | "checkOut">("checkIn");
  const [hotelDestination, setHotelDestination] = useState({
    name: "",
    subtitle: "",
    type: "Thành phố",
    count: "Nhiều khách sạn",
  });
  const [hotelForm, setHotelForm] = useState<HotelFormState>(() => ({
    destination: findHotelDestination("", ""),
    stay: {
      checkIn: hotelQueryDateToDate(parsedSearch.checkInDate),
      checkOut: hotelQueryDateToDate(parsedSearch.checkOutDate),
    },
    guests: {
      adults: parsedSearch.adults,
      children: parsedSearch.children,
      rooms: parsedSearch.rooms,
    },
  }));
  // Synchronize form state with parsed search params from URL
  // This is a valid pattern for deriving component state from route parameters
  useEffect(() => {
    if (parsedSearch.destination) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHotelDestination({
        name: parsedSearch.destination,
        subtitle: parsedSearch.destinationSubtitle,
        type: "Thành phố",
        count: "Nhiều khách sạn",
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHotelForm({
      destination: findHotelDestination(parsedSearch.destination, parsedSearch.destinationSubtitle),
      stay: {
        checkIn: hotelQueryDateToDate(parsedSearch.checkInDate),
        checkOut: hotelQueryDateToDate(parsedSearch.checkOutDate),
      },
      guests: {
        adults: parsedSearch.adults,
        children: parsedSearch.children,
        rooms: parsedSearch.rooms,
      },
    });
  }, [
    parsedSearch.adults,
    parsedSearch.checkInDate,
    parsedSearch.checkOutDate,
    parsedSearch.children,
    parsedSearch.destination,
    parsedSearch.destinationSubtitle,
    parsedSearch.rooms,
  ]);

  useEffect(() => {
    if (!openHotelPopover) {
      return undefined;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!hotelSearchRef.current?.contains(event.target as Node)) {
        setOpenHotelPopover(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenHotelPopover(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openHotelPopover]);



  function handleHotelDateSelect(date: Date) {
    if (hotelDateFocus === "checkIn") {
      setHotelForm((currentValue) => ({
        ...currentValue,
        stay: {
          checkIn: date,
          checkOut:
            currentValue.stay.checkOut.getTime() <= date.getTime() ? addDays(date, 1) : currentValue.stay.checkOut,
        },
      }));
      setHotelDateFocus("checkOut");
      return;
    }

    setHotelForm((currentValue) => {
      if (date.getTime() <= currentValue.stay.checkIn.getTime()) {
        return {
          ...currentValue,
          stay: {
            checkIn: date,
            checkOut: addDays(date, 1),
          },
        };
      }

      return {
        ...currentValue,
        stay: {
          ...currentValue.stay,
          checkOut: date,
        },
      };
    });
    setHotelDateFocus("checkIn");
  }

  const hotelStaySummary = `${formatHotelSearchDate(hotelForm.stay.checkIn)} - ${formatHotelSearchDate(
    hotelForm.stay.checkOut,
  )}`;
  const hotelGuestSummary = `${hotelForm.guests.adults} người lớn, ${hotelForm.guests.children} Trẻ em, ${hotelForm.guests.rooms} phòng`;
  const isResultsView = parsedSearch.view === "results";
  const activeSearchState: HotelSearchState = {
    ...parsedSearch,
    view: isResultsView ? "results" : "landing",
    destination: hotelDestination.name,
    destinationSubtitle: hotelDestination.subtitle,
    checkInDate: toHotelQueryDate(hotelForm.stay.checkIn),
    checkOutDate: toHotelQueryDate(hotelForm.stay.checkOut),
    adults: hotelForm.guests.adults,
    children: hotelForm.guests.children,
    rooms: hotelForm.guests.rooms,
  };
  function handleHotelSearch() {
    navigate(
      `/mua-sam/khach-san?${buildHotelSearchQuery({
        ...activeSearchState,
        view: "results",
      })}`,
    );
  }

  function handleStartNewSearch() {
    navigate("/mua-sam/khach-san");
  }

  if (isResultsView) {
    return (
      <div className="hotel-customer">
        <CustomerHotelSearchResults
          key={`${activeSearchState.checkInDate}-${activeSearchState.checkOutDate}-${activeSearchState.destination}`}
          searchState={activeSearchState}
          onStartNewSearch={handleStartNewSearch}
        />
      </div>
    );
  }

  return (
    <div className="hotel-customer">
      <section className="hotel-customer__hero">
        <div className="customer-shell__container">
          {/* Cập nhật linear-gradient để bóng đen tập trung ở dưới cùng, làm nổi chữ */}
          <div
            className="hotel-customer__hero-image-wrapper"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(8, 24, 45, 0) 20%, rgba(8, 24, 45, 0.85) 100%), url(${baibienImage})`,
            }}
          >
            <div className="hotel-customer__hero-copy">
              <h1>Điểm đến tiếp theo của bạn? Đặt khách sạn giá tốt với Traveloka</h1>
              <p>Khám phá nhiều lựa chọn từ khách sạn, biệt thự, resort và hơn thế nữa</p>
            </div>
          </div>

          <section className="travel-search hotel-customer__search" id="tim-kiem">
            <div className="travel-panel travel-panel--hotel" ref={hotelSearchRef}>
              <div className="travel-form">
                <div className="travel-form__layout travel-form__layout--hotel">
                  <HotelFieldButton
                    label="Thành phố, địa điểm hoặc tên khách sạn:"
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
                    value={hotelStaySummary}
                    icon={CalendarDays}
                    isOpen={openHotelPopover === "stay"}
                    onClick={() =>
                      setOpenHotelPopover((currentValue) => (currentValue === "stay" ? null : "stay"))
                    }
                  >
                    {openHotelPopover === "stay" ? (
                      <div className="travel-hotel-panel travel-hotel-panel--stay">
                        <div className="travel-hotel-panel__heading">
                          <h3>Chọn ngày lưu trú</h3>
                        </div>

                        <div className="travel-hotel-stay-summary">
                          <button
                            type="button"
                            className={
                              hotelDateFocus === "checkIn"
                                ? "travel-hotel-stay-summary-card is-focus"
                                : "travel-hotel-stay-summary-card"
                            }
                            onClick={() => setHotelDateFocus("checkIn")}
                          >
                            <span>Nhận phòng</span>
                            <strong>{formatHotelPanelDate(hotelForm.stay.checkIn)}</strong>
                          </button>

                          <button
                            type="button"
                            className={
                              hotelDateFocus === "checkOut"
                                ? "travel-hotel-stay-summary-card is-focus"
                                : "travel-hotel-stay-summary-card"
                            }
                            onClick={() => setHotelDateFocus("checkOut")}
                          >
                            <span>Trả phòng</span>
                            <strong>{formatHotelPanelDate(hotelForm.stay.checkOut)}</strong>
                          </button>
                        </div>

                        <div className="travel-hotel-calendars">
                          {hotelCalendarMonths.map((item, index) => (
                            <div key={`${item.year}-${item.monthIndex}`} className="travel-hotel-calendar">
                              <div className="travel-hotel-calendar__header">
                                <span className="travel-hotel-calendar__nav" aria-hidden="true">
                                  {index === 0 ? <ChevronLeft size={18} /> : null}
                                </span>
                                <strong>
                                  {new Date(item.year, item.monthIndex, 1).toLocaleDateString("vi-VN", {
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </strong>
                                <span className="travel-hotel-calendar__nav" aria-hidden="true">
                                  {index === hotelCalendarMonths.length - 1 ? <ChevronRight size={18} /> : null}
                                </span>
                              </div>

                              <div className="travel-hotel-calendar__weekdays">
                                {hotelWeekdays.map((weekday) => (
                                  <span key={weekday} className="travel-hotel-calendar__weekday">
                                    {weekday}
                                  </span>
                                ))}
                              </div>

                              <div className="travel-hotel-calendar__days">
                                {getCalendarDays(item.year, item.monthIndex).map((date, dayIndex) => {
                                  if (!date) {
                                    return <span key={`blank-${dayIndex}`} className="travel-hotel-calendar__blank" />;
                                  }

                                  const isSelected =
                                    isSameDay(date, hotelForm.stay.checkIn) || isSameDay(date, hotelForm.stay.checkOut);
                                  const isInRange = isDateBetween(date, hotelForm.stay.checkIn, hotelForm.stay.checkOut);
                                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                                  const className = [
                                    "travel-hotel-calendar__day",
                                    isWeekend ? "is-weekend" : "",
                                    isInRange ? "is-in-range" : "",
                                    isSelected ? "is-selected" : "",
                                  ]
                                    .filter(Boolean)
                                    .join(" ");

                                  return (
                                    <button
                                      key={date.toISOString()}
                                      type="button"
                                      className={className}
                                      onClick={() => handleHotelDateSelect(date)}
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
                  </HotelFieldButton>

                  <HotelFieldButton
                    label="Khách và Phòng"
                    value={hotelGuestSummary}
                    icon={Users}
                  >
                  </HotelFieldButton>

                  <button type="button" className="travel-search__submit" aria-label="Tìm khách sạn" onClick={handleHotelSearch}>
                    <Search size={22} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--exclusive">
        <div className="customer-shell__container">
          <div className="hotel-customer__section-head">
            <div>
              <span>Đặc quyền</span>
              <h2>Ưu đãi khách sạn độc quyền</h2>
            </div>
            <a href="#pho-bien" className="hotel-customer__see-all">
              Xem tất cả
              <ChevronRight size={18} />
            </a>
          </div>

          <div className="hotel-customer__exclusive-grid">
            {exclusiveOffers.map((offer) => (
              <article key={offer.id} className="hotel-customer__exclusive-card">
                <div
                  className="hotel-customer__exclusive-image"
                  style={{ backgroundImage: offer.image }}
                >
                  <span className="hotel-customer__discount-badge">{offer.discount}%</span>
                  <button
                    type="button"
                    className="hotel-customer__favorite-btn"
                    aria-label="Thêm vào yêu thích"
                  >
                    <Heart size={20} />
                  </button>
                </div>
                <div className="hotel-customer__exclusive-info">
                  <h3>{offer.name}</h3>
                  <p className="hotel-customer__location">{offer.location}</p>
                  <div className="hotel-customer__rating">
                    <div className="hotel-customer__stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(offer.rating) ? "is-filled" : ""}
                          fill={i < Math.floor(offer.rating) ? "#fbbf24" : "none"}
                          color={i < Math.floor(offer.rating) ? "#fbbf24" : "#d1d5db"}
                        />
                      ))}
                    </div>
                    <span className="hotel-customer__reviews">
                      {offer.rating} ({offer.reviews} đánh giá)
                    </span>
                  </div>
                  <div className="hotel-customer__price">
                    <span className="hotel-customer__old-price">
                      {new Intl.NumberFormat("vi-VN").format(offer.oldPrice)}đ
                    </span>
                    <span className="hotel-customer__new-price">
                      {new Intl.NumberFormat("vi-VN").format(offer.newPrice)}đ
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--accommodation">
        <div className="customer-shell__container">
          <div className="hotel-customer__section-head">
            <div>
              <span>Khám phá</span>
              <h2>Các loại hình lưu trú đa dạng</h2>
            </div>
          </div>

          <div className="hotel-customer__accommodation-grid">
            {accommodationTypes.map((type) => (
              <article
                key={type.id}
                className="hotel-customer__accommodation-card"
                style={{ backgroundImage: type.image }}
              >
                <div className="hotel-customer__accommodation-overlay">
                  <h3>{type.title}</h3>
                  <p>{type.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--masonry">
        <div className="customer-shell__container">
          <div className="hotel-customer__section-head">
            <div>
              <span>Kỳ nghỉ tiếp theo</span>
              <h2>Điểm đến phổ biến cho kỳ nghỉ tiếp theo</h2>
            </div>
          </div>

          <div className="hotel-customer__masonry-grid">
            {massonryDestinations.map((destination) => (
              <article
                key={destination.id}
                className={`hotel-customer__masonry-card ${destination.size === "large" ? "is-large" : "is-small"
                  }`}
                style={{ backgroundImage: destination.image }}
              >
                <div className="hotel-customer__masonry-overlay">
                  <h3>{destination.name}</h3>
                  <p>{destination.subtitle}</p>
                  <span className="hotel-customer__hotels-count">{destination.hotels}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--why-us">
        <div className="customer-shell__container">
          <div className="hotel-customer__why-us-wrapper">
            <div className="hotel-customer__why-us-content">
              <div className="hotel-customer__why-us-header">
                <span>Tại sao nên chọn</span>
                <h2>Tại sao nên đặt phòng với Traveloka</h2>
                <p>
                  Chúng tôi mang đến trải nghiệm đặt phòng tuyệt vời với dịch vụ hỗ trợ tốt
                  nhất, giá cả cạnh tranh và chính sách linh hoạt.
                </p>
              </div>

              <div className="hotel-customer__why-us-benefits">
                {whyBookWithTraveloka.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="hotel-customer__benefit-item">
                      <div className="hotel-customer__benefit-icon">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h4>{benefit.title}</h4>
                        <p>{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hotel-customer__why-us-image">
              <div
                className="hotel-customer__receptionist-image"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(100, 200, 200, 0.3) 0%, rgba(150, 100, 200, 0.3) 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
