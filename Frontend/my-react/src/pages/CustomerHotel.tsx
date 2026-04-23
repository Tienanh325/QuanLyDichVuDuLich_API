import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BedDouble,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Copy,
  CreditCard,
  Crosshair,
  Info,
  MapPinned,
  Minus,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TicketPercent,
  Users,
} from "lucide-react";
import baibienImage from "../assets/images/baibien.jpg";
import thuongHieuImage from "../assets/images/thuonghieu.jpg";
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
type HotelGuestKey = "adults" | "children" | "rooms";

type HotelFormState = {
  destination: PopularHotelDestination;
  stay: { checkIn: Date; checkOut: Date };
  guests: { adults: number; children: number; rooms: number };
};

const heroHighlights = [
  {
    title: "Hủy miễn phí linh hoạt",
    body: "Nhiều lựa chọn phòng cho phép thay đổi kế hoạch dễ hơn.",
    icon: ShieldCheck,
  },
  {
    title: "Thanh toán an toàn",
    body: "Thẻ quốc tế, ví điện tử và chuyển khoản đều sẵn sàng.",
    icon: CreditCard,
  },
  {
    title: "Hỗ trợ 24/7",
    body: "Đội ngũ hỗ trợ nhanh cho các vấn đề trước và trong chuyến đi.",
    icon: Sparkles,
  },
] as const;

const promoCards = [
  {
    title: "Mừng đại lễ 30/4",
    subtitle: "Săn ưu đãi nghỉ dưỡng biển",
    description: "Khách sạn ven biển, resort gia đình và combo nghỉ hè giảm sâu.",
    tag: "Mới mở bán",
    accent: "sunrise",
  },
  {
    title: "Hàn Quốc giảm đến 50%",
    subtitle: "Khách sạn trung tâm, gần tàu điện",
    description: "Phù hợp cho chuyến đi tự túc với nhiều mức giá dễ chọn.",
    tag: "Quốc tế",
    accent: "city",
  },
  {
    title: "Deal chớp nhoáng cuối tuần",
    subtitle: "Biệt thự, homestay và khách sạn cao cấp",
    description: "Ưu đãi giới hạn cho kỳ nghỉ gần ngày với chính sách linh hoạt.",
    tag: "Hot",
    accent: "villa",
  },
] as const;

const destinationCards = [
  { title: "Khách sạn ở Bali", meta: "3.120 chỗ ở", accent: "tropical" },
  { title: "Khách sạn ở Bangkok", meta: "5.410 chỗ ở", accent: "night" },
  { title: "Khách sạn ở Singapore", meta: "980 chỗ ở", accent: "city" },
  { title: "Khách sạn ở TP HCM", meta: "2.876 chỗ ở", accent: "urban" },
  { title: "Khách sạn ở Sydney", meta: "1.650 chỗ ở", accent: "harbor" },
  { title: "Khách sạn ở Melbourne", meta: "1.240 chỗ ở", accent: "sunrise" },
  { title: "Khách sạn ở Vũng Tàu", meta: "1.080 chỗ ở", accent: "ocean" },
  { title: "Khách sạn ở Đà Lạt", meta: "1.830 chỗ ở", accent: "forest" },
  { title: "Khách sạn ở Hà Nội", meta: "2.040 chỗ ở", accent: "oldtown" },
  { title: "Khách sạn ở Đà Nẵng", meta: "2.320 chỗ ở", accent: "coast" },
  { title: "Khách sạn ở Nha Trang", meta: "1.760 chỗ ở", accent: "beach" },
  { title: "Khách sạn ở Phan Thiết", meta: "960 chỗ ở", accent: "sand" },
] as const;

const experienceCards = [
  { title: "Homestay ở TP HCM", accent: "urban" },
  { title: "Tìm căn hộ tốt nhất", accent: "city" },
  { title: "Tìm biệt thự tốt nhất", accent: "villa" },
] as const;

const partnerLogos = [
  "Accor",
  "Ascott",
  "Best Western",
  "Furama",
  "Marriott",
  "Meliá",
  "Pan Pacific",
  "Vinpearl",
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

const infoCards = [
  {
    title: "Đặt phòng khách sạn tại Việt Nam trên Traveloka",
    body:
      "Traveloka có hàng nghìn khách sạn, resort, villa và căn hộ tại các điểm đến nổi bật ở Việt Nam. Bạn có thể lọc theo ngân sách, khu vực, tiện nghi hoặc đánh giá để tìm đúng chỗ ở cho chuyến đi gia đình, công tác hay nghỉ dưỡng cuối tuần.",
  },
  {
    title: "Thông tin về chỗ ở trên Traveloka",
    body:
      "Từ khách sạn gần sân bay đến khu nghỉ dưỡng ven biển, Traveloka tổng hợp đa dạng loại hình lưu trú với mức giá cập nhật liên tục. Nhiều lựa chọn còn có chính sách hủy linh hoạt, thanh toán tiện lợi và xác nhận nhanh.",
  },
] as const;

const faqItems = [
  {
    question: "Cách đặt khách sạn trên Traveloka?",
    answer:
      "Chọn điểm đến, ngày nhận và trả phòng, số khách rồi bấm Tìm kiếm. Sau đó bạn có thể lọc theo giá, khu vực và tiện nghi trước khi đặt phòng.",
  },
  {
    question: "Làm thế nào để nhận ưu đãi cho khách sạn trên Traveloka?",
    answer:
      "Bạn có thể theo dõi mục ưu đãi, nhập mã giảm giá đủ điều kiện và đặt phòng trong thời gian diễn ra chương trình để nhận mức giá tốt hơn.",
  },
  {
    question: "Traveloka có hỗ trợ thanh toán linh hoạt không?",
    answer:
      "Có. Bạn có thể thanh toán bằng thẻ quốc tế, thẻ nội địa, ví điện tử hoặc chuyển khoản qua nhiều đối tác thanh toán phổ biến.",
  },
  {
    question: "Tôi có thể xem đánh giá thực tế từ khách trước không?",
    answer:
      "Có. Mỗi chỗ ở đều hiển thị điểm đánh giá và nhận xét từ khách đã lưu trú để bạn dễ so sánh trước khi đặt.",
  },
  {
    question: "Có thể hủy hoặc đổi ngày lưu trú không?",
    answer:
      "Tùy chính sách của từng khách sạn. Bạn nên kiểm tra phần điều kiện đặt phòng để biết chi tiết về hủy miễn phí hoặc đổi ngày.",
  },
] as const;

const discoverColumns = [
  {
    title: "Khách sạn theo điểm đến nổi bật",
    links: [
      "Khách sạn tại Đà Nẵng",
      "Khách sạn tại Đà Lạt",
      "Khách sạn tại Phú Quốc",
      "Khách sạn tại Vũng Tàu",
      "Khách sạn tại Nha Trang",
      "Khách sạn tại Hà Nội",
      "Khách sạn tại TP HCM",
      "Khách sạn tại Hạ Long",
    ],
  },
  {
    title: "Khám phá theo nhu cầu lưu trú",
    links: [
      "Khách sạn gần biển",
      "Khách sạn cho gia đình",
      "Khách sạn có hồ bơi",
      "Khách sạn gần sân bay",
      "Căn hộ cho nhóm bạn",
      "Biệt thự nghỉ dưỡng",
      "Khách sạn công tác",
      "Khách sạn trung tâm thành phố",
    ],
  },
  {
    title: "Kinh nghiệm đặt phòng",
    links: [
      "Cách săn deal khách sạn",
      "Mẹo chọn khu vực lưu trú",
      "Cách đọc đánh giá khách sạn",
      "Những tiện nghi nên ưu tiên",
      "Khi nào nên đặt sớm",
      "Mẹo đặt phòng cuối tuần",
      "Cách dùng mã giảm giá",
      "Lưu ý khi đặt phòng quốc tế",
    ],
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
  value: string;
  icon: IconType;
  isOpen?: boolean;
  onClick: () => void;
  className?: string;
  helperText?: string;
  hasChevron?: boolean;
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
  value,
  icon: Icon,
  isOpen = false,
  onClick,
  className,
  helperText,
  hasChevron = false,
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
        {hasChevron ? (
          <span className="travel-hotel-field__chevron">
            <ChevronDown size={18} />
          </span>
        ) : null}
      </button>
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
  const [hotelForm, setHotelForm] = useState<HotelFormState>(() => ({
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
  }));
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  // Synchronize form state with parsed search params from URL
  // This is a valid pattern for deriving component state from route parameters
  useEffect(() => {
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

  function handleHotelGuestChange(field: HotelGuestKey, delta: number) {
    setHotelForm((currentValue) => {
      const minimumValue = field === "children" ? 0 : 1;
      const nextValue = Math.max(minimumValue, currentValue.guests[field] + delta);

      return {
        ...currentValue,
        guests: {
          ...currentValue.guests,
          [field]: nextValue,
        },
      };
    });
  }

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
    destination: hotelForm.destination.name,
    destinationSubtitle: hotelForm.destination.subtitle,
    checkInDate: toHotelQueryDate(hotelForm.stay.checkIn),
    checkOutDate: toHotelQueryDate(hotelForm.stay.checkOut),
    adults: hotelForm.guests.adults,
    children: hotelForm.guests.children,
    rooms: hotelForm.guests.rooms,
  };

  const destinationThemes = useMemo(
    () => ({
      tropical:
        "linear-gradient(180deg, rgba(8, 25, 44, 0.18) 0%, rgba(8, 25, 44, 0.74) 100%), linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)",
      night:
        "linear-gradient(180deg, rgba(5, 18, 36, 0.14) 0%, rgba(5, 18, 36, 0.82) 100%), linear-gradient(135deg, #4338ca 0%, #f59e0b 100%)",
      city:
        "linear-gradient(180deg, rgba(6, 22, 43, 0.2) 0%, rgba(6, 22, 43, 0.8) 100%), linear-gradient(135deg, #1d4ed8 0%, #38bdf8 100%)",
      urban:
        "linear-gradient(180deg, rgba(12, 21, 39, 0.16) 0%, rgba(12, 21, 39, 0.78) 100%), linear-gradient(135deg, #111827 0%, #0ea5e9 100%)",
      harbor:
        "linear-gradient(180deg, rgba(9, 24, 43, 0.18) 0%, rgba(9, 24, 43, 0.78) 100%), linear-gradient(135deg, #0284c7 0%, #22d3ee 100%)",
      sunrise:
        "linear-gradient(180deg, rgba(41, 16, 20, 0.1) 0%, rgba(41, 16, 20, 0.74) 100%), linear-gradient(135deg, #f97316 0%, #fb7185 100%)",
      ocean:
        "linear-gradient(180deg, rgba(5, 21, 42, 0.16) 0%, rgba(5, 21, 42, 0.82) 100%), linear-gradient(135deg, #0284c7 0%, #2dd4bf 100%)",
      forest:
        "linear-gradient(180deg, rgba(8, 28, 26, 0.16) 0%, rgba(8, 28, 26, 0.82) 100%), linear-gradient(135deg, #16a34a 0%, #84cc16 100%)",
      oldtown:
        "linear-gradient(180deg, rgba(39, 19, 10, 0.14) 0%, rgba(39, 19, 10, 0.82) 100%), linear-gradient(135deg, #92400e 0%, #f59e0b 100%)",
      coast:
        "linear-gradient(180deg, rgba(6, 25, 43, 0.14) 0%, rgba(6, 25, 43, 0.78) 100%), linear-gradient(135deg, #2563eb 0%, #22c55e 100%)",
      beach:
        "linear-gradient(180deg, rgba(8, 24, 45, 0.16) 0%, rgba(8, 24, 45, 0.82) 100%), linear-gradient(135deg, #0ea5e9 0%, #facc15 100%)",
      sand:
        "linear-gradient(180deg, rgba(46, 27, 13, 0.14) 0%, rgba(46, 27, 13, 0.8) 100%), linear-gradient(135deg, #d97706 0%, #fde68a 100%)",
      villa:
        "linear-gradient(180deg, rgba(18, 27, 42, 0.18) 0%, rgba(18, 27, 42, 0.78) 100%), linear-gradient(135deg, #b45309 0%, #10b981 100%)",
    }),
    [],
  );

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
                    value={hotelForm.destination.name}
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
                          Sử dụng vị trí hiện tại của bạn
                        </button>

                        <div className="travel-hotel-panel__title">Điểm đến phổ biến</div>

                        <div className="travel-hotel-destination-list">
                          {popularHotelDestinations.map((item) => (
                            <button
                              key={item.name}
                              type="button"
                              className={
                                hotelForm.destination.name === item.name
                                  ? "travel-hotel-destination-item is-selected"
                                  : "travel-hotel-destination-item"
                              }
                              onClick={() => {
                                setHotelForm((currentValue) => ({
                                  ...currentValue,
                                  destination: item,
                                }));
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
                    helperText="Thời gian: 1 Đêm"
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
                    isOpen={openHotelPopover === "guests"}
                    onClick={() =>
                      setOpenHotelPopover((currentValue) => (currentValue === "guests" ? null : "guests"))
                    }
                    className="travel-hotel-field-wrap--guests"
                    hasChevron
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
                                onClick={() => handleHotelGuestChange("adults", -1)}
                                disabled={hotelForm.guests.adults <= 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span>{hotelForm.guests.adults}</span>
                              <button type="button" onClick={() => handleHotelGuestChange("adults", 1)}>
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
                                onClick={() => handleHotelGuestChange("children", -1)}
                                disabled={hotelForm.guests.children <= 0}
                              >
                                <Minus size={16} />
                              </button>
                              <span>{hotelForm.guests.children}</span>
                              <button type="button" onClick={() => handleHotelGuestChange("children", 1)}>
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>

                          <div className="travel-hotel-guest-row">
                            <div className="travel-hotel-guest-copy">
                              <strong>Số phòng</strong>
                            </div>
                            <div className="travel-hotel-guest-counter">
                              <button
                                type="button"
                                onClick={() => handleHotelGuestChange("rooms", -1)}
                                disabled={hotelForm.guests.rooms <= 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span>{hotelForm.guests.rooms}</span>
                              <button type="button" onClick={() => handleHotelGuestChange("rooms", 1)}>
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="travel-hotel-panel__actions">
                          <button type="button" className="travel-hotel-done" onClick={() => setOpenHotelPopover(null)}>
                            Xong
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </HotelFieldButton>

                  <button type="button" className="travel-search__submit" aria-label="Tìm khách sạn" onClick={handleHotelSearch}>
                    <span>Tìm kiếm</span>
                    <Search size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="travel-search__footer" style={{ padding: "16px 4px 0", marginTop: "12px", borderTop: "none" }}>
                <a href="#history" className="travel-search__history-link">
                  <strong>Khách sạn xem gần đây</strong>
                  <div className="travel-search__history-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
                  </div>
                </a>
              </div>
            </div>
          </section>

          <div className="hotel-customer__hero-highlights">
            {heroHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="hotel-customer__highlight-card">
                  <span className="hotel-customer__highlight-icon">
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

      <section className="hotel-customer__section" id="uu-dai">
        <div className="customer-shell__container">
          <div className="hotel-customer__section-head">
            <div>
              <span>Ưu đãi nổi bật</span>
              <h2>Tìm và đặt phòng khách sạn giá rẻ chỉ với 3 bước đơn giản</h2>
            </div>
          </div>

          <div className="hotel-customer__promo-grid">
            {promoCards.map((item) => (
              <article
                key={item.title}
                className="hotel-customer__promo-card"
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

          <article className="hotel-customer__voucher-banner">
            <div className="hotel-customer__voucher-copy">
              <strong>Tải thêm hơn với ưu đãi giảm giá mới nhất của chúng tôi</strong>
              <p>Sử dụng TVLKHAKSAN để áp dụng cho khách hàng mới đủ điều kiện.</p>
            </div>
            <div className="hotel-customer__voucher-code">
              <span>Mã: TVLKHAKSAN</span>
              <button type="button">
                <Copy size={14} />
                Sao chép
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="hotel-customer__section" id="pho-bien">
        <div className="customer-shell__container">
          <div className="hotel-customer__section-head">
            <div>
              <span>Khách sạn phổ biến</span>
              <h2>Ưu đãi khách sạn tốt nhất tại các điểm đến phổ biến</h2>
            </div>
          </div>

          <div className="hotel-customer__destination-grid">
            {destinationCards.map((item) => (
              <article
                key={item.title}
                className="hotel-customer__destination-card"
                style={{ backgroundImage: destinationThemes[item.accent] }}
              >
                <div className="hotel-customer__destination-overlay">
                  <strong>{item.title}</strong>
                  <span>{item.meta}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain">
        <div className="customer-shell__container">
          <div className="hotel-customer__section-head">
            <div>
              <span>Nhiều hơn khách sạn</span>
              <h2>Chúng tôi không chỉ có khách sạn</h2>
            </div>
          </div>

          <div className="hotel-customer__experience-grid">
            {experienceCards.map((item) => (
              <article
                key={item.title}
                className="hotel-customer__experience-card"
                style={{ backgroundImage: destinationThemes[item.accent] }}
              >
                <strong>{item.title}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain">
        <div className="customer-shell__container">
          <div className="hotel-customer__section-head hotel-customer__section-head--stacked">
            <div>
              <span>Được tin cậy</span>
              <h2>Đối tác khách sạn</h2>
              <p>
                Các chuỗi lưu trú nổi bật trong nước và quốc tế đã có mặt để bạn dễ dàng so sánh,
                đặt phòng và thanh toán trên cùng một nền tảng.
              </p>
            </div>
          </div>

          <div className="hotel-customer__logo-grid">
            {partnerLogos.map((item) => (
              <div key={item} className="hotel-customer__logo-card">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain">
        <div className="customer-shell__container">
          <div className="hotel-customer__section-head hotel-customer__section-head--stacked">
            <div>
              <span>Thanh toán</span>
              <h2>Đặt lẻ thanh toán</h2>
              <p>Nhiều phương thức thanh toán quen thuộc giúp quá trình đặt phòng diễn ra nhanh và an toàn hơn.</p>
            </div>
          </div>

          <div className="hotel-customer__payment-grid">
            {paymentLogos.map((item) => (
              <div key={item} className="hotel-customer__payment-card">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain">
        <div className="customer-shell__container">
          <div className="hotel-customer__info-grid">
            {infoCards.map((item) => (
              <article key={item.title} className="hotel-customer__info-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain" id="faq">
        <div className="customer-shell__container">
          <div className="hotel-customer__section-head hotel-customer__section-head--stacked">
            <div>
              <span>Hỗ trợ</span>
              <h2>Câu hỏi thường gặp</h2>
            </div>
          </div>

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

      <section className="hotel-customer__section hotel-customer__section--plain">
        <div className="customer-shell__container">
          <article className="hotel-customer__newsletter">
            <div className="hotel-customer__newsletter-copy">
              <span>Đăng ký chỗ nghỉ của bạn</span>
              <h2>Tiếp cận hàng triệu khách hàng tiềm năng và phát triển kinh doanh cùng chúng tôi</h2>
              <button type="button">Đăng ký ngay</button>
            </div>
            <div
              className="hotel-customer__newsletter-visual"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(9, 25, 44, 0.08) 0%, rgba(9, 25, 44, 0.42) 100%), url(${thuongHieuImage})`,
              }}
            >
              <div className="hotel-customer__newsletter-qr">
                <QrCode size={54} />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--plain hotel-customer__section--discover">
        <div className="customer-shell__container">
          <div className="hotel-customer__section-head hotel-customer__section-head--stacked">
            <div>
              <span>Khám phá thêm</span>
              <h2>Khám phá các khách sạn phổ biến và điểm đến du lịch hàng đầu</h2>
            </div>
          </div>

          <div className="hotel-customer__discover-grid">
            {discoverColumns.map((group) => (
              <div key={group.title} className="hotel-customer__discover-column">
                <h3>{group.title}</h3>
                <ul>
                  {group.links.map((item) => (
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
