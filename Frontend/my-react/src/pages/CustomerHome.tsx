import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import baibienImage from "../assets/images/baibien.jpg";
import {
  ArrowLeftRight,
  ArrowRight,
  BedDouble,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Crosshair,
  MapPinned,
  Minus,
  PlaneTakeoff,
  Plus,
  Search,
  ShieldCheck,
  Ticket,
  Train,
  Users,
} from "lucide-react";
import "../assets/css/CustomerHome.css";
import { buildFlightSearchQuery } from "../utils/flightSearch";
import { buildHotelSearchQuery, toHotelQueryDate } from "../utils/hotelSearch";

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
  { id: "activity", label: "Hoạt động & Vui chơi", icon: Ticket },
];

const activityTags = [
  "Điểm tham quan",
  "Spa & Thư giãn",
  "Tour",
  "Thể thao giải trí",
  "Trò chơi & Hoạt động",
  "Phương tiện di chuyển",
  "Cần thiết cho du lịch",
  "Trải nghiệm ẩm thực",
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

const destinationColumns = [
  {
    title: "Các điểm bay trong nước",
    links: [
      "Vé máy bay Hà Nội đi Đà Nẵng",
      "Vé máy bay TP HCM đi Hà Nội",
      "Vé máy bay Hải Phòng đi Phú Quốc",
      "Vé máy bay Huế đi Nha Trang",
      "Vé máy bay Cần Thơ đi Đà Lạt",
      "Vé máy bay Vinh đi TP HCM",
    ],
  },
  {
    title: "Khách sạn ưa chuộng",
    links: [
      "Khách sạn tại Đà Nẵng",
      "Khách sạn tại Nha Trang",
      "Khách sạn tại Hạ Long",
      "Khách sạn tại Đà Lạt",
      "Khách sạn tại Vũng Tàu",
      "Khách sạn tại Phú Quốc",
    ],
  },
  {
    title: "Hoạt động nổi bật",
    links: [
      "VinWonders Nam Hội An",
      "Sun World Hạ Long",
      "Bà Nà Hills",
      "Safari Phú Quốc",
      "Suối khoáng nóng I-Resort",
      "Tour city Sài Gòn",
    ],
  },
  {
    title: "Tuyến tàu phổ biến",
    links: [
      "Sài Gòn đi Đà Lạt",
      "Sài Gòn đi Vũng Tàu",
      "Đà Nẵng đi Huế",
      "Hà Nội đi Sa Pa",
      "Cần Thơ đi Rạch Giá",
      "Nha Trang đi Đà Lạt",
    ],
  },
];

const hotelTrustedBrands = ["MILLENNIUM", "ALL", "ARCHIPELAGO", "ASCOTT"];
const hotelWeekdays = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"];
const hotelCalendarMonths = [
  { year: 2026, monthIndex: 3 },
  { year: 2026, monthIndex: 4 },
];
const popularHotelDestinations = [
  {
    name: "Đà Lạt",
    subtitle: "Tỉnh Lâm Đồng, Lam Dong, Việt Nam",
    type: "Thành Phố",
    count: "1.811 khách sạn",
  },
  {
    name: "Thành phố Vũng Tàu",
    subtitle: "Bà Rịa - Vũng Tàu, Thành phố Hồ Chí Minh, Việt Nam",
    type: "Thành Phố",
    count: "1.024 khách sạn",
  },
  {
    name: "Nha Trang",
    subtitle: "Khánh Hòa, Tỉnh Khánh Hòa, Việt Nam",
    type: "Thành Phố",
    count: "1.355 khách sạn",
  },
  {
    name: "Kuala Lumpur",
    subtitle: "Malaysia",
    type: "Thành Phố",
    count: "5.998 khách sạn",
  },
  {
    name: "Pattaya",
    subtitle: "Chon Buri, Thái Lan",
    type: "Thành Phố",
    count: "4.719 khách sạn",
  },
];

type HotelPopover = "destination" | "stay" | "guests" | null;
type HotelGuestKey = "adults" | "children" | "rooms";

type FieldCardProps = {
  label?: string;
  title: string;
  subtitle?: string;
  icon?: IconType;
  muted?: boolean;
  placeholder?: boolean;
  style?: React.CSSProperties;
};

type RouteGroupProps = {
  fromLabel: string;
  toLabel: string;
  fromIcon: IconType;
  toIcon: IconType;
  values: RouteValues;
  onSwap: () => void;
  placeholder?: boolean;
  mutedTo?: boolean;
};

type HotelFieldButtonProps = {
  label: string;
  value: string;
  icon: IconType;
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  isTypable?: boolean;
  onChange?: (val: string) => void;
};

function addDays(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + amount);
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

  return `${weekdayNames[date.getDay()]}, ${String(date.getDate()).padStart(2, "0")} thg ${
    date.getMonth() + 1
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

function FieldCard({
  label,
  title,
  subtitle,
  icon: Icon,
  muted = false,
  placeholder = false,
  style,
}: FieldCardProps) {
  const className = [
    "travel-field-card",
    muted ? "is-muted" : "",
    placeholder ? "is-placeholder" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} style={style}>
      {label ? <div className="travel-field-card__label">{label}</div> : null}

      <div className="travel-field-card__body">
        {Icon ? (
          <span className="travel-field-card__icon">
            <Icon size={22} />
          </span>
        ) : null}

        <div className="travel-field-card__copy">
          <strong>{title}</strong>
          {subtitle ? <small>{subtitle}</small> : null}
        </div>
      </div>
    </div>
  );
}

function RouteGroup({
  fromLabel,
  toLabel,
  fromIcon,
  toIcon,
  values,
  onSwap,
  placeholder = false,
  mutedTo = false,
}: RouteGroupProps) {
  return (
    <div className="travel-route-group">
      <FieldCard
        label={fromLabel}
        title={values.fromTitle}
        subtitle={values.fromSubtitle}
        icon={fromIcon}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="travel-field-switch"
        aria-label="Đổi chiều nơi đi và nơi đến"
        onClick={onSwap}
      >
        <ArrowLeftRight size={18} />
      </button>
      <FieldCard
        label={toLabel}
        title={values.toTitle}
        subtitle={values.toSubtitle}
        icon={toIcon}
        placeholder={placeholder}
        muted={mutedTo}
      />
    </div>
  );
}

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

function HotelFieldButton({
  label,
  value,
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
          <span className="travel-hotel-field__value">{value}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function CustomerHome() {
  const navigate = useNavigate();
  const hotelSearchRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<ServiceId>("hotel");
  const [openHotelPopover, setOpenHotelPopover] = useState<HotelPopover>(null);
  const [hotelDateFocus, setHotelDateFocus] = useState<"checkIn" | "checkOut">("checkIn");
  const [hotelDestination, setHotelDestination] = useState(popularHotelDestinations[0]);
  const [hotelStay, setHotelStay] = useState({
    checkIn: new Date(2026, 3, 9),
    checkOut: new Date(2026, 3, 10),
  });
  const [hotelGuests, setHotelGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1,
  });
  const [flightRoute, setFlightRoute] = useState<RouteValues>({
    fromTitle: "TP HCM (SGN)",
    fromSubtitle: "Sân bay Tân Sơn Nhất",
    toTitle: "Bangkok (BKKA)",
    toSubtitle: "Tất cả sân bay",
  });
  const [trainRoute, setTrainRoute] = useState<RouteValues>({
    fromTitle: "Nhập thành phố hoặc ga",
    toTitle: "Nhập thành phố hoặc ga",
  });
  const [activitySearch, setActivitySearch] = useState("Bạn có ý tưởng gì cho chuyến đi tiếp theo không?");

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

  function swapRoute(setter: Dispatch<SetStateAction<RouteValues>>) {
    setter((currentValue) => ({
      fromTitle: currentValue.toTitle,
      fromSubtitle: currentValue.toSubtitle,
      toTitle: currentValue.fromTitle,
      toSubtitle: currentValue.fromSubtitle,
    }));
  }

  function handleHotelGuestChange(field: HotelGuestKey, delta: number) {
    setHotelGuests((currentValue) => {
      const minimumValue = field === "children" ? 0 : 1;
      const nextValue = Math.max(minimumValue, currentValue[field] + delta);

      return {
        ...currentValue,
        [field]: nextValue,
      };
    });
  }

  function handleHotelDateSelect(date: Date) {
    if (hotelDateFocus === "checkIn") {
      setHotelStay((currentValue) => ({
        checkIn: date,
        checkOut:
          currentValue.checkOut.getTime() <= date.getTime() ? addDays(date, 1) : currentValue.checkOut,
      }));
      setHotelDateFocus("checkOut");
      return;
    }

    setHotelStay((currentValue) => {
      if (date.getTime() <= currentValue.checkIn.getTime()) {
        return {
          checkIn: date,
          checkOut: addDays(date, 1),
        };
      }

      return {
        ...currentValue,
        checkOut: date,
      };
    });
    setHotelDateFocus("checkIn");
  }

  const hotelStaySummary = `${formatHotelSearchDate(hotelStay.checkIn)} - ${formatHotelSearchDate(
    hotelStay.checkOut,
  )}`;
  const hotelGuestSummary = `${hotelGuests.adults} người lớn, ${hotelGuests.children} Trẻ em, ${hotelGuests.rooms} phòng`;

  const homeFlightDepartureDate = "2026-04-01";
  const homeFlightReturnDate = "2026-04-03";

  function handleHotelSearch() {
    navigate(
      `/mua-sam/khach-san?${buildHotelSearchQuery({
        view: "results",
        destination: hotelDestination.name,
        destinationSubtitle: hotelDestination.subtitle,
        checkInDate: toHotelQueryDate(hotelStay.checkIn),
        checkOutDate: toHotelQueryDate(hotelStay.checkOut),
        adults: hotelGuests.adults,
        children: hotelGuests.children,
        rooms: hotelGuests.rooms,
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
        departDate: homeFlightDepartureDate,
        returnDate: homeFlightReturnDate,
        passengers: "1 hành khách",
        cabinClass: "Phổ thông",
      })}`
    );
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
                icon={MapPinned}
                isOpen={openHotelPopover === "destination"}
                isTypable
                onChange={(val) => setHotelDestination(prev => ({ ...prev, name: val, subtitle: "", type: "", count: "" }))}
                onClick={() =>
                  setOpenHotelPopover((currentValue) =>
                    currentValue === "destination" ? null : "destination",
                  )
                }
                className="travel-hotel-field-wrap--destination"
              >
                {openHotelPopover === "destination" ? (
                  <div className="travel-hotel-panel travel-hotel-panel--destination">
                    <button type="button" className="travel-hotel-nearby">
                      <Crosshair size={18} />
                      <span>Gần tôi</span>
                    </button>

                    <div className="travel-hotel-panel__title">Điểm đến phổ biến</div>

                    <div className="travel-hotel-destination-list">
                      {popularHotelDestinations.map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          className={
                            hotelDestination.name === item.name
                              ? "travel-hotel-destination-item is-selected"
                              : "travel-hotel-destination-item"
                          }
                          onClick={() => {
                            setHotelDestination(item);
                            setOpenHotelPopover(null);
                          }}
                        >
                          <span className="travel-hotel-destination-item__copy">
                            <strong>{item.name}</strong>
                            <small>{item.subtitle}</small>
                          </span>
                          <span className="travel-hotel-destination-item__meta">
                            <span className="travel-hotel-destination-item__tag">{item.type}</span>
                            <span className="travel-hotel-destination-item__count">{item.count}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </HotelFieldButton>
              <HotelFieldButton
                label="Ngày nhận phòng và trả phòng"
                value={hotelStaySummary}
                icon={CalendarDays}
                isOpen={openHotelPopover === "stay"}
                onClick={() =>
                  setOpenHotelPopover((currentValue) => (currentValue === "stay" ? null : "stay"))
                }
                className="travel-hotel-field-wrap--stay"
              >
                {openHotelPopover === "stay" ? (
                  <div className="travel-hotel-panel travel-hotel-panel--stay">
                    <div className="travel-hotel-panel__heading">
                      <h3>Ngày Ở</h3>
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
                        <strong>{formatHotelPanelDate(hotelStay.checkIn)}</strong>
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
                        <strong>{formatHotelPanelDate(hotelStay.checkOut)}</strong>
                      </button>
                    </div>

                    <div className="travel-hotel-calendars">
                      {hotelCalendarMonths.map((item, index) => (
                        <div key={`${item.year}-${item.monthIndex}`} className="travel-hotel-calendar">
                          <div className="travel-hotel-calendar__header">
                            <span className="travel-hotel-calendar__nav" aria-hidden="true">
                              {index === 0 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                            </span>
                            <strong>{`tháng ${item.monthIndex + 1} năm ${item.year}`}</strong>
                            <span className="travel-hotel-calendar__nav travel-hotel-calendar__nav--ghost" />
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
                                return (
                                  <span
                                    key={`${item.year}-${item.monthIndex}-empty-${dayIndex}`}
                                    className="travel-hotel-calendar__blank"
                                  />
                                );
                              }

                              const isSelected =
                                isSameDay(date, hotelStay.checkIn) || isSameDay(date, hotelStay.checkOut);
                              const isInRange = isDateBetween(date, hotelStay.checkIn, hotelStay.checkOut);
                              const isWeekend = date.getDay() === 0;
                              const dayClassName = [
                                "travel-hotel-calendar__day",
                                isSelected ? "is-selected" : "",
                                isInRange ? "is-in-range" : "",
                                isWeekend ? "is-weekend" : "",
                              ]
                                .filter(Boolean)
                                .join(" ");

                              return (
                                <button
                                  key={date.toISOString()}
                                  type="button"
                                  className={dayClassName}
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
                isOpen={openHotelPopover === "guests"}
                onClick={() =>
                  setOpenHotelPopover((currentValue) => (currentValue === "guests" ? null : "guests"))
                }
                className="travel-hotel-field-wrap--guests"
              >
                {openHotelPopover === "guests" ? (
                  <div className="travel-hotel-panel travel-hotel-panel--guests">
                    <div className="travel-hotel-guest-list">
                      <div className="travel-hotel-guest-row">
                        <div className="travel-hotel-guest-copy">
                          <strong>Người lớn</strong>
                        </div>
                        <div className="travel-hotel-guest-counter">
                          <button
                            type="button"
                            aria-label="Giảm số người lớn"
                            onClick={() => handleHotelGuestChange("adults", -1)}
                            disabled={hotelGuests.adults <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span>{hotelGuests.adults}</span>
                          <button
                            type="button"
                            aria-label="Tăng số người lớn"
                            onClick={() => handleHotelGuestChange("adults", 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="travel-hotel-guest-row">
                        <div className="travel-hotel-guest-copy">
                          <strong>Trẻ em</strong>
                        </div>
                        <div className="travel-hotel-guest-counter">
                          <button
                            type="button"
                            aria-label="Giảm số trẻ em"
                            onClick={() => handleHotelGuestChange("children", -1)}
                            disabled={hotelGuests.children <= 0}
                          >
                            <Minus size={16} />
                          </button>
                          <span>{hotelGuests.children}</span>
                          <button
                            type="button"
                            aria-label="Tăng số trẻ em"
                            onClick={() => handleHotelGuestChange("children", 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="travel-hotel-guest-row">
                        <div className="travel-hotel-guest-copy">
                          <strong>Phòng</strong>
                        </div>
                        <div className="travel-hotel-guest-counter">
                          <button
                            type="button"
                            aria-label="Giảm số phòng"
                            onClick={() => handleHotelGuestChange("rooms", -1)}
                            disabled={hotelGuests.rooms <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span>{hotelGuests.rooms}</span>
                          <button
                            type="button"
                            aria-label="Tăng số phòng"
                            onClick={() => handleHotelGuestChange("rooms", 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="travel-hotel-panel__actions">
                      <button
                        type="button"
                        className="travel-hotel-done"
                        onClick={() => setOpenHotelPopover(null)}
                      >
                        Xong
                      </button>
                    </div>
                  </div>
                ) : null}
              </HotelFieldButton>
              <SearchButton ariaLabel="Tìm khách sạn" onClick={handleHotelSearch} />
            </div>
          </div>

          <div className="travel-hotel-trusted">
            <span>Trusted by</span>
            <ul>
              {hotelTrustedBrands.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
                icon={PlaneTakeoff}
                isTypable
                onChange={(val) => setFlightRoute(prev => ({ ...prev, fromTitle: val }))}
              />
              <HotelFieldButton
                label="Đến"
                value={flightRoute.toTitle}
                icon={PlaneTakeoff}
                isTypable
                onChange={(val) => setFlightRoute(prev => ({ ...prev, toTitle: val }))}
              />
              <HotelFieldButton
                label="Ngày khởi hành"
                value="1 thg 4 2026"
                icon={CalendarDays}
              />
              <SearchButton ariaLabel="Tìm chuyến bay" onClick={handleFlightSearch} />
            </div>
          </div>

          <div className="travel-search__footer">
            <div className="travel-search__footer-title">Tìm kiếm</div>
            <div className="travel-search__footer-links">
              <a href="#uu-dai">
                <CircleDollarSign size={16} />
                Khám phá ý tưởng chuyến bay
              </a>
              <a href="#uu-dai">
                <CircleDollarSign size={16} />
                Cảnh báo giá
              </a>
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
                icon={Train}
                isTypable
                onChange={(val) => setTrainRoute(prev => ({ ...prev, fromTitle: val }))}
              />
              <HotelFieldButton
                label="Đến"
                value={trainRoute.toTitle}
                icon={Train}
                isTypable
                onChange={(val) => setTrainRoute(prev => ({ ...prev, toTitle: val }))}
              />
              <HotelFieldButton
                label="Ngày khởi hành"
                value="31 thg 3 2026"
                icon={CalendarDays}
              />
              <SearchButton ariaLabel="Tìm vé tàu" onClick={() => navigate("/mua-sam/ve-tau")} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="travel-panel travel-panel--activity" style={{ position: 'relative', zIndex: 5 }}>
        <div className="travel-form">
          <div className="travel-form__layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 48px', alignItems: 'flex-end', gap: 12, padding: '0 12px' }}>
            <HotelFieldButton
              label="Tìm kiếm hoạt động"
              value={activitySearch}
              icon={Search}
              isTypable
              onChange={setActivitySearch}
            />
            <SearchButton ariaLabel="Tìm ý tưởng" onClick={() => {}} />
          </div>
        </div>

        <div className="travel-activity-caption">
          Hoặc chọn một danh mục để mở khóa trải nghiệm tiếp theo của bạn
        </div>

        <div className="travel-activity-tags">
          {activityTags.map((item) => (
            <button key={item} type="button" className="travel-activity-tag">
              {item}
            </button>
          ))}
        </div>
      </div>
    );
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
                      if (item.id !== "hotel") {
                        setOpenHotelPopover(null);
                      }
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
                <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px 0' }}>Xperience Plus</h3>
                <p style={{ fontSize: 16, margin: 0, color: '#475569' }}>Mua 2 tính tiền 1 tại các khu vui chơi giải trí.</p>
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

      <section className="home-customer__section home-customer__section--links">
        <div className="customer-shell__container">
          <div className="home-customer__title-row">
            <h2>Bạn muốn khám phá điều gì?</h2>
          </div>

          <div className="home-customer__links-grid">
            {destinationColumns.map((group) => (
              <div key={group.title} className="home-customer__links-column">
                <h3>{group.title}</h3>
                <ul>
                  {group.links.map((item) => (
                    <li key={item}>
                      <a href="#footer">{item}</a>
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
