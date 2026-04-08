import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import baibienImage from "../assets/images/baibien.jpg";
import thuongHieuImage from "../assets/images/thuonghieu.jpg";
import {
  ArrowLeftRight,
  ArrowRight,
  BedDouble,
  CalendarDays,
  CarFront,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Copy,
  Crosshair,
  Gift,
  Info,
  MapPinned,
  Minus,
  PlaneTakeoff,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  Ticket,
  Train,
  Users,
} from "lucide-react";
import "../assets/css/CustomerHome.css";
import { buildFlightSearchQuery } from "../utils/flightSearch";

type ServiceId = "hotel" | "flight" | "bus" | "airport" | "car" | "activity";
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
  { id: "bus", label: "Vé xe khách", icon: Train },
  { id: "airport", label: "Đưa đón sân bay", icon: MapPinned },
  { id: "car", label: "Cho thuê xe", icon: CarFront },
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

const couponCards = [
  {
    title: "Giảm đến 75,000 cho lần đặt vé máy bay đầu tiên",
    body: "Áp dụng cho lần đặt đầu tiên trên ứng dụng Traveloka.",
    code: "TVLKBANMOI",
  },
  {
    title: "Giảm giá tới 250.000 cho lần đặt phòng đầu tiên",
    body: "Dùng cho khách sạn, căn hộ và biệt thự đủ điều kiện.",
    code: "HELLOSTAY",
  },
  {
    title: "Giảm 80.000 cho chuyến xe khách đầu tiên",
    body: "Thêm ưu đãi mới cho tuyến nội địa được yêu thích.",
    code: "XEKHACHMOI",
  },
];

const cruiseCards = [
  {
    title: "Disney Adventure: Hành trình 3 ngày",
    body: "Khám phá trải nghiệm du thuyền hoàn toàn mới cho gia đình.",
    badge: "Mở bán",
  },
  {
    title: "Combo Singapore cùng Disney Cruise",
    body: "Kết hợp vé máy bay, khách sạn và vé tham quan tiết kiệm hơn.",
    badge: "Ưu đãi sớm",
  },
  {
    title: "Cabin view biển cực đẹp",
    body: "Tận hưởng hành trình đẳng cấp với nhiều gói cabin linh hoạt.",
    badge: "Hot",
  },
  {
    title: "Ưu đãi đặc quyền cho nhóm bạn",
    body: "Thêm điểm thưởng, quà onboard và giảm giá lịch trình phổ biến.",
    badge: "Giới hạn",
  },
];

const dealCategoryTabs = [
  "Vé máy bay",
  "Chỗ ở",
  "Bus & Shuttle",
  "Đưa đón sân bay",
  "Điểm tham quan",
];

const dealHighlightCards = [
  {
    title: "Mừng đại lễ",
    subtitle: "State hè say",
    description: "Mở bán deal dịp lễ hấp dẫn tại biển.",
    badge: "Mới",
  },
  {
    title: "Hàn Quốc",
    subtitle: "sale đến -50%",
    description: "Ưu đãi khách sạn và vé tham quan hot nhất mùa này.",
    badge: "Traveloka",
  },
  {
    title: "Du lịch Malaysia",
    subtitle: "đến -50%",
    description: "Khám phá kỳ nghỉ quốc tế với giá dễ chịu hơn.",
    badge: "Quốc tế",
  },
];

const hotelTabs = [
  "Đà Nẵng",
  "Nha Trang",
  "Phú Quốc",
  "Vũng Tàu",
  "Hà Nội",
  "Đà Lạt",
  "Huế",
  "Hội An",
  "Phan Thiết",
  "Long Hải",
];

const hotelCards = [
  {
    title: "Sala Đà Nẵng Beach Hotel",
    location: "Đà Nẵng",
    price: "2.576.000 VND",
    rating: "8.9 Ấn tượng",
    area: "Quốc Cường Center Đà Nẵng Hotel by Haviland",
  },
  {
    title: "The Herriott Hotel & Suite",
    location: "Đà Nẵng",
    price: "2.771.000 VND",
    rating: "9.1 Tuyệt vời",
    area: "Cực gần biển Mỹ Khê",
  },
  {
    title: "La Beach Hotel",
    location: "Đà Nẵng",
    price: "1.911.000 VND",
    rating: "8.7 Ấn tượng",
    area: "Chỉ vài phút tới bãi biển",
  },
  {
    title: "Orchid Hotel Ocean Hotel",
    location: "Đà Nẵng",
    price: "2.498.000 VND",
    rating: "9.0 Rất tốt",
    area: "Tầm nhìn đẹp, gần trung tâm",
  },
];

const activityTabs = ["Điểm tham quan", "Tour & trải nghiệm", "Vui chơi biển"];

const activityCards = [
  {
    title: "Sun World Ba Den Mountain",
    location: "Tây Ninh",
    price: "180.000 VND",
    badge: "Mới mở",
  },
  {
    title: "Vé VinWonders Cửa Hội",
    location: "Nghệ An",
    price: "140.000 VND",
    badge: "Ưu đãi hè",
  },
  {
    title: "Lotte World Aquarium Hà Nội",
    location: "Phố Thủng",
    price: "184.000 VND",
    badge: "Phổ biến",
  },
  {
    title: "Vé xem chương trình Tinh hoa Bắc Bộ",
    location: "Hà Nội",
    price: "297.911 VND",
    badge: "45 đã bán",
  },
];

const guideCards = [
  "Bali",
  "Bangkok",
  "Seoul",
  "Istanbul",
  "Liverpool",
];

const inspirationCards = [
  "Chuyến đi tự do linh hoạt",
  "Fun Activities",
  "Travel insurance",
  "Ưu đãi, vé, xe và tour",
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
    title: "Tuyến xe khách phổ biến",
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

function SearchButton({ ariaLabel = "T\u00ecm ki\u1ebfm", onClick }: SearchButtonProps) {
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
}: HotelFieldButtonProps) {
  const wrapperClassName = ["travel-hotel-field-wrap", className, isOpen ? "is-open" : ""]
    .filter(Boolean)
    .join(" ");
  const fieldClassName = ["travel-hotel-field", isOpen ? "is-open" : ""].filter(Boolean).join(" ");

  return (
    <div className={wrapperClassName}>
      <div className="travel-hotel-field__label">{label}</div>
      <button type="button" className={fieldClassName} onClick={onClick}>
        <span className="travel-hotel-field__icon">
          <Icon size={22} />
        </span>
        <span className="travel-hotel-field__value">{value}</span>
      </button>
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
    checkIn: new Date(2026, 3, 2),
    checkOut: new Date(2026, 3, 3),
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
  const [busRoute, setBusRoute] = useState<RouteValues>({
    fromTitle: "Nhập thành phố, nhà ga hoặc bến xe",
    toTitle: "Nhập thành phố, nhà ga hoặc bến xe",
  });
  const [airportRoute, setAirportRoute] = useState<RouteValues>({
    fromTitle: "Ví dụ Sân bay quốc tế Narita",
    toTitle: "Ví dụ Trung tâm mua sắm AEON Narita",
  });

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
        passengers: "1 h\u00e0nh kh\u00e1ch",
        cabinClass: "Ph\u1ed5 th\u00f4ng",
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
              <SearchButton />
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
        <div className="travel-panel travel-panel--flight">
          <div className="travel-form">
            <div className="travel-form__layout travel-form__layout--flight">
              <RouteGroup
                fromLabel="Từ"
                toLabel="Đến"
                fromIcon={PlaneTakeoff}
                toIcon={PlaneTakeoff}
                values={flightRoute}
                onSwap={() => swapRoute(setFlightRoute)}
              />
              <FieldCard label="Ngày khởi hành" title="1 thg 4 2026" icon={CalendarDays} />
              <FieldCard label="Khứ hồi" title="3 thg 4 2026" icon={CalendarDays} muted />
              <SearchButton ariaLabel="T\u00ecm chuy\u1ebfn bay" onClick={handleFlightSearch} />
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

    if (activeTab === "bus") {
      return (
        <div className="travel-panel travel-panel--bus">
          <div className="travel-form">
            <div className="travel-form__layout travel-form__layout--bus">
              <RouteGroup
                fromLabel="Từ"
                toLabel="Đến"
                fromIcon={Train}
                toIcon={Train}
                values={busRoute}
                onSwap={() => swapRoute(setBusRoute)}
                placeholder
              />
              <FieldCard label="Ngày khởi hành" title="31 thg 3 2026" icon={CalendarDays} />
              <FieldCard label="Khứ hồi" title="2 thg 4 2026" icon={CalendarDays} muted placeholder />
              <FieldCard 
                label="Số ghế" 
                title="1 hành khách" 
                icon={Users}
                style={{
                  borderRight: "1px solid #cfd6df",
                  borderTopRightRadius: "24px",
                  borderBottomRightRadius: "24px"
                }}
                />
              <SearchButton />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "airport") {
      return (
        <div className="travel-panel travel-panel--airport">
          <div className="travel-form">
            <div className="travel-form__layout travel-form__layout--airport">
              <RouteGroup
                fromLabel="Từ sân bay"
                toLabel="Đến khu vực, địa chỉ, tòa nhà"
                fromIcon={PlaneTakeoff}
                toIcon={MapPinned}
                values={airportRoute}
                onSwap={() => swapRoute(setAirportRoute)}
                placeholder
              />
              <FieldCard label="Ngày đón" title="31 thg 3, 2026" icon={CalendarDays} />
              <FieldCard label="Giờ đón" title="17:10" icon={CircleDollarSign} />
              <SearchButton />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "car") {
      return (
        <div className="travel-panel travel-panel--car">
          <div className="travel-form">
            <div className="travel-form__layout travel-form__layout--car">
              <FieldCard
                label="Địa điểm thuê xe của bạn"
                title="Điền thành phố, sân bay"
                icon={MapPinned}
                placeholder
                style={{
                  borderRight: "1px solid #cfd6df",
                  borderTopRightRadius: "24px",
                  borderBottomRightRadius: "24px"
                }}
              />
              <FieldCard label="Ngày bắt đầu" title="2 thg 4, 2026" icon={CalendarDays} />
              <FieldCard label="Giờ bắt đầu" title="09:00" icon={CircleDollarSign} />
              <FieldCard label="Ngày kết thúc" title="4 thg 4, 2026" icon={CalendarDays} />
              <FieldCard label="Giờ kết thúc" title="09:00" icon={CircleDollarSign} />
              <SearchButton />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="travel-panel travel-panel--activity">
        <div className="travel-form">
          <div className="travel-activity-search">
            <div className="travel-activity-search__box">
              <Search size={24} />
              <span>Bạn có ý tưởng gì cho chuyến đi tiếp theo không?</span>
            </div>
            <button type="button" className="travel-activity-search__submit" aria-label="Tìm ý tưởng">
              <Search size={24} />
            </button>
            <button type="button" className="travel-activity-idea">
              <MapPinned size={22} />
              <span>Khám phá ý tưởng</span>
              <span aria-hidden="true">→</span>
            </button>
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

      <section className="home-customer__section home-customer__section--promo" id="uu-dai">
        <div className="customer-shell__container">
          <div className="home-customer__section-head">
            <div className="home-customer__section-icon">
              <Gift size={18} />
            </div>
            <div>
              <h2>Đến 12% Phiếu giảm giá cho Người dùng mới</h2>
              <p>Hiệu lực cho giao dịch đầu tiên trên ứng dụng Traveloka</p>
            </div>
          </div>

          <div className="home-customer__coupon-row">
            {couponCards.map((item) => (
              <article key={item.code} className="home-customer__coupon-card">
                <div className="home-customer__coupon-top">
                  <div className="home-customer__coupon-copy">
                    <span className="home-customer__coupon-dot" />
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                  </div>
                  <button type="button" className="home-customer__coupon-info" aria-label="Thông tin ưu đãi">
                    <Info size={16} />
                  </button>
                </div>

                <div className="home-customer__coupon-bottom">
                  <span className="home-customer__coupon-code">{item.code}</span>
                  <button type="button" className="home-customer__coupon-button">
                    <Copy size={14} />
                    Copy
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-customer__section">
        <div className="customer-shell__container">
          <article className="home-customer__app-banner">
            <div className="home-customer__app-copy">
              <span>Deal xịn chỉ trên app</span>
              <strong>Giảm đến 690K cho bạn mới</strong>
            </div>
            <div className="home-customer__app-qr">
              <QrCode size={56} />
            </div>
            <button type="button" className="home-customer__app-button">
              Quét mã tại đây
            </button>
          </article>
        </div>
      </section>

      <section className="home-customer__section">
        <div className="customer-shell__container">
          <div className="home-customer__title-row">
            <h2>Đi từ Disney Adventure Cruise ngay</h2>
            <a href="#footer">
              Xem thêm
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="home-customer__cruise-grid">
            {cruiseCards.map((item, index) => (
              <article
                key={item.title}
                className="home-customer__cruise-card"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(9, 16, 31, 0.12) 0%, rgba(9, 16, 31, 0.76) 100%), url(${index % 2 === 0 ? baibienImage : thuongHieuImage})`,
                }}
              >
                <span className="home-customer__cruise-badge">{item.badge}</span>
                <div className="home-customer__cruise-copy">
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-customer__section home-customer__section--discovery">
        <div className="customer-shell__container">
          <div className="home-customer__chip-row">
            {dealCategoryTabs.map((item, index) => (
              <button
                key={item}
                type="button"
                className={index === 4 ? "home-customer__chip is-active" : "home-customer__chip"}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="home-customer__deal-banner-grid">
            {dealHighlightCards.map((item, index) => (
              <article
                key={item.title}
                className="home-customer__deal-banner-card"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(8, 35, 84, 0.18) 0%, rgba(8, 35, 84, 0.58) 100%), url(${index === 1 ? thuongHieuImage : baibienImage})`,
                }}
              >
                <span className="home-customer__deal-banner-badge">{item.badge}</span>
                <strong>{item.title}</strong>
                <span>{item.subtitle}</span>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="home-customer__see-all-wrap">
            <button type="button" className="home-customer__see-all">
              See All Deals
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <section className="home-customer__section">
        <div className="customer-shell__container">
          <div className="home-customer__section-head">
            <div className="home-customer__section-icon">
              <BedDouble size={18} />
            </div>
            <div>
              <h2>Nhiều lựa chọn khách sạn</h2>
              <p>Đà Nẵng</p>
            </div>
          </div>

          <div className="home-customer__chip-row home-customer__chip-row--compact">
            {hotelTabs.map((item, index) => (
              <button
                key={item}
                type="button"
                className={index === 0 ? "home-customer__chip is-active" : "home-customer__chip"}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="home-customer__hotel-grid">
            {hotelCards.map((item, index) => (
              <article key={item.title} className="home-customer__hotel-card">
                <div
                  className="home-customer__hotel-thumb"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(8, 22, 47, 0.06) 0%, rgba(8, 22, 47, 0.34) 100%), url(${index % 2 === 0 ? baibienImage : thuongHieuImage})`,
                  }}
                >
                  <span className="home-customer__hotel-rating">{item.rating}</span>
                </div>
                <div className="home-customer__hotel-body">
                  <span className="home-customer__hotel-location">{item.location}</span>
                  <strong>{item.title}</strong>
                  <p>{item.area}</p>
                  <div className="home-customer__hotel-price">{item.price}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="home-customer__see-all-wrap">
            <button type="button" className="home-customer__see-all">
              Xem thêm về đối khách sạn
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <section className="home-customer__section">
        <div className="customer-shell__container">
          <div className="home-customer__section-head">
            <div className="home-customer__section-icon">
              <Ticket size={18} />
            </div>
            <div>
              <h2>Hoạt động du lịch</h2>
              <p>Đi cùng người thân và vui hết thích</p>
            </div>
          </div>

          <div className="home-customer__chip-row home-customer__chip-row--compact">
            {activityTabs.map((item, index) => (
              <button
                key={item}
                type="button"
                className={index === 0 ? "home-customer__chip is-active" : "home-customer__chip"}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="home-customer__activity-grid">
            {activityCards.map((item, index) => (
              <article key={item.title} className="home-customer__activity-card">
                <div
                  className="home-customer__activity-thumb"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(9, 16, 31, 0.1) 0%, rgba(9, 16, 31, 0.42) 100%), url(${index % 2 === 0 ? baibienImage : thuongHieuImage})`,
                  }}
                >
                  <span className="home-customer__activity-badge">{item.badge}</span>
                </div>
                <div className="home-customer__activity-body">
                  <strong>{item.title}</strong>
                  <p>{item.location}</p>
                  <div className="home-customer__activity-price">{item.price}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="home-customer__see-all-wrap">
            <button type="button" className="home-customer__see-all">
              Xem tất cả
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <section className="home-customer__section">
        <div className="customer-shell__container">
          <div className="home-customer__section-head">
            <div className="home-customer__section-icon">
              <MapPinned size={18} />
            </div>
            <div>
              <h2>Cẩm nang du lịch</h2>
            </div>
          </div>

          <div className="home-customer__guide-grid">
            {guideCards.map((item, index) => (
              <article
                key={item}
                className="home-customer__guide-card"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(9, 16, 31, 0.1) 0%, rgba(9, 16, 31, 0.64) 100%), url(${index % 2 === 0 ? baibienImage : thuongHieuImage})`,
                }}
              >
                <strong>{item}</strong>
                <span>Anh</span>
              </article>
            ))}
          </div>

          <div className="home-customer__see-all-wrap">
            <button type="button" className="home-customer__see-all">
              Xem thêm
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <section className="home-customer__section">
        <div className="customer-shell__container">
          <div className="home-customer__title-row">
            <h2>Nâng tầm chuyến đi theo cách bạn muốn</h2>
          </div>

          <div className="home-customer__inspiration-grid">
            {inspirationCards.map((item, index) => (
              <article key={item} className="home-customer__mini-card">
                <div
                  className="home-customer__mini-thumb"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(8, 22, 47, 0.04) 0%, rgba(8, 22, 47, 0.28) 100%), url(${index % 2 === 0 ? thuongHieuImage : baibienImage})`,
                  }}
                />
                <strong>{item}</strong>
              </article>
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
