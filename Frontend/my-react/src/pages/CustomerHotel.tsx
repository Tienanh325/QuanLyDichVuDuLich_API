import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle,
  ChevronDown,
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
  parseHotelSearchParams,
} from "../utils/hotelSearch";
import { ConfigProvider, DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/locale/vi_VN";
import { getPublicHotels } from "../services/hotelService";

dayjs.locale("vi");

type IconType = typeof Search;

type HotelFormState = {
  destination: PopularHotelDestination;
  stay: [dayjs.Dayjs, dayjs.Dayjs];
  guests: number;
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

const roomTypes = [
  {
    id: 1,
    title: "Deluxe Sea View",
    subtitle: "Phòng hướng biển",
    image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    id: 2,
    title: "Superior City View",
    subtitle: "Phòng hướng thành phố",
    image: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  },
  {
    id: 3,
    title: "Family Suite",
    subtitle: "Phòng gia đình",
    image: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  },
  {
    id: 4,
    title: "Presidential Suite",
    subtitle: "Phòng tổng thống",
    image: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)",
  },
] as const;

const destinationGradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
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
        {children ? (
          <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        ) : isTypable ? (
          <input
            type="text"
            className="travel-hotel-field__input"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              width: "100%",
              fontSize: 15,
              fontWeight: 600,
              color: "#242628",
              padding: 0,
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
  const [hotelDestination, setHotelDestination] = useState({
    name: parsedSearch.destination || "",
    subtitle: parsedSearch.destinationSubtitle || "",
    type: "Thành phố",
    count: "Nhiều khách sạn",
  });
  const [hotelForm, setHotelForm] = useState<HotelFormState>(() => {
    const checkIn = parsedSearch.checkInDate
      ? dayjs(parsedSearch.checkInDate)
      : dayjs();
    const checkOut = parsedSearch.checkOutDate
      ? dayjs(parsedSearch.checkOutDate)
      : dayjs().add(1, "day");
    return {
      destination: findHotelDestination(parsedSearch.destination, parsedSearch.destinationSubtitle),
      stay: [checkIn.isValid() ? checkIn : dayjs(), checkOut.isValid() ? checkOut : dayjs().add(1, "day")],
      guests: parsedSearch.guests,
    };
  });
  const hotelGuestSummary = hotelForm.guests > 0 ? `${hotelForm.guests}` : "";
  const { data: landingHotels } = useQuery({
    queryKey: ["hotel-landing-offers"],
    queryFn: () => getPublicHotels({ limit: 6 }),
  });
  const { data: destinationHotels } = useQuery({
    queryKey: ["hotel-destination-stats"],
    queryFn: () => getPublicHotels({ limit: 100 }),
  });
  const topHotelDestinations = useMemo(() => {
    const counts = new Map<string, number>();
    (destinationHotels?.data ?? []).forEach((hotel) => {
      const location = hotel.viTri?.trim();
      if (location) counts.set(location, (counts.get(location) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count], index) => ({
        id: name,
        name,
        subtitle: "Điểm đến khách sạn nổi bật",
        hotels: `${count} khách sạn`,
        image: destinationGradients[index % destinationGradients.length],
        size: index === 0 ? "large" : "small",
      }));
  }, [destinationHotels?.data]);
  const isResultsView = parsedSearch.view === "results";
  const activeSearchState: HotelSearchState = isResultsView
    ? parsedSearch
    : {
        ...parsedSearch,
        view: "landing",
        destination: hotelDestination.name,
        destinationSubtitle: hotelDestination.subtitle,
        checkInDate: hotelForm.stay[0].format("YYYY-MM-DD"),
        checkOutDate: hotelForm.stay[1].format("YYYY-MM-DD"),
        guests: hotelForm.guests,
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
                    label="Thành phố, địa điểm hoặc tên khách sạn"
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
                  />
                  <HotelFieldButton
                    label="Ngày nhận phòng và trả phòng"
                    icon={CalendarDays}
                  >
                    <ConfigProvider locale={viVN}>
                      <DatePicker.RangePicker
                        value={hotelForm.stay}
                        onChange={(dates) => {
                          if (dates && dates[0] && dates[1]) {
                            setHotelForm((prev) => ({ ...prev, stay: [dates[0]!, dates[1]!] }));
                          }
                        }}
                        format="DD/MM/YYYY"
                        variant="borderless"
                        allowClear={false}
                        style={{ padding: 0, width: "100%", fontWeight: 600, fontSize: 15 }}
                      />
                    </ConfigProvider>
                  </HotelFieldButton>

                  <HotelFieldButton
                    label="Số khách"
                    value={hotelGuestSummary}
                    placeholder="Hãy nhập số người ở"
                    icon={Users}
                    isTypable
                    onChange={(value) => {
                      const onlyNumber = value.replace(/\D/g, "");
                      setHotelForm((prev) => ({
                        ...prev,
                        guests: onlyNumber === "" ? 0 : Number(onlyNumber),
                      }));
                    }}
                  />

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
            {(landingHotels?.data ?? exclusiveOffers).map((offer: any) => {
              const id = offer.maKhachSan ?? offer.id;
              const name = offer.ten ?? offer.name;
              const location = offer.viTri ?? offer.location;
              const oldPrice = offer.giaTuKhoang ? Number(offer.giaTuKhoang) * 1.2 : offer.oldPrice;
              const newPrice = offer.giaTuKhoang ?? offer.newPrice;
              const rating = offer.rating ?? 4.8;
              const reviews = offer.reviews ?? 0;
              return (
              <article key={id} className="hotel-customer__exclusive-card" onClick={() => navigate(`/mua-sam/khach-san/${id}`)} style={{ cursor: 'pointer' }}>
                <div
                  className="hotel-customer__exclusive-image"
                  style={{ backgroundImage: offer.image ?? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}
                >
                  <span className="hotel-customer__discount-badge">{offer.discount ?? 15}%</span>
                  <button
                    type="button"
                    className="hotel-customer__favorite-btn"
                    aria-label="Thêm vào yêu thích"
                  >
                    <Heart size={20} />
                  </button>
                </div>
                <div className="hotel-customer__exclusive-info">
                  <h3>{name}</h3>
                  <p className="hotel-customer__location">{location}</p>
                  <div className="hotel-customer__rating">
                    <div className="hotel-customer__stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(rating) ? "is-filled" : ""}
                          fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
                          color={i < Math.floor(rating) ? "#fbbf24" : "#d1d5db"}
                        />
                      ))}
                    </div>
                    <span className="hotel-customer__reviews">
                      {rating} ({reviews} đánh giá)
                    </span>
                  </div>
                  <div className="hotel-customer__price">
                    <span className="hotel-customer__old-price">
                      {new Intl.NumberFormat("vi-VN").format(oldPrice)}đ
                    </span>
                    <span className="hotel-customer__new-price">
                      {new Intl.NumberFormat("vi-VN").format(newPrice)}đ
                    </span>
                  </div>
                </div>
              </article>
            );})}
          </div>
        </div>
      </section>

      <section className="hotel-customer__section hotel-customer__section--accommodation">
        <div className="customer-shell__container">
          <div className="hotel-customer__section-head">
            <div>
              <span>Khám phá</span>
              <h2>Các loại phòng đa dạng</h2>
            </div>
          </div>

          <div className="hotel-customer__accommodation-grid">
            {roomTypes.map((type) => (
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
            {topHotelDestinations.map((destination) => (
              <article
                key={destination.id}
                className={`hotel-customer__masonry-card ${destination.size === "large" ? "is-large" : "is-small"
                  }`}
                style={{ backgroundImage: destination.image, cursor: "pointer" }}
                onClick={() =>
                  navigate(
                    `/mua-sam/khach-san?${buildHotelSearchQuery({
                      ...activeSearchState,
                      view: "results",
                      destination: destination.name,
                      destinationSubtitle: destination.subtitle,
                    })}`,
                  )
                }
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
