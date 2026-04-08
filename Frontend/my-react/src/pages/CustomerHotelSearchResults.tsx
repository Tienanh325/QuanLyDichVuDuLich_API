import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  BedDouble,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Coffee,
  MapPinned,
  Mountain,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  TicketPercent,
  Users,
} from "lucide-react";
import baibienImage from "../assets/images/baibien.jpg";
import thuongHieuImage from "../assets/images/thuonghieu.jpg";
import { formatCurrencyVnd } from "../utils/flightSearch";

export type HotelSearchState = {
  view: "landing" | "results";
  destination: string;
  destinationSubtitle: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  rooms: number;
};

export const defaultHotelSearchState: HotelSearchState = {
  view: "landing",
  destination: "Đà Lạt",
  destinationSubtitle: "Lâm Đồng, Việt Nam",
  checkInDate: "2026-04-09",
  checkOutDate: "2026-04-10",
  adults: 2,
  children: 0,
  rooms: 1,
};

type CustomerHotelSearchResultsProps = {
  searchState: HotelSearchState;
  onStartNewSearch: () => void;
};

type SortKey = "recommended" | "price" | "rating";
type HotelTagId = "sale" | "breakfast" | "family" | "freeCancel";
type HotelAmenityId = "breakfast" | "airport" | "family" | "parking" | "mountain" | "balcony";
type HotelTypeId = "hotel" | "apartment" | "villa";

type HotelResult = {
  id: string;
  name: string;
  subtitle?: string;
  district: string;
  districtKey: string;
  rating: number;
  reviews: string;
  propertyType: string;
  propertyTypeKey: HotelTypeId;
  stars: number;
  nightlyPrice: number;
  totalPrice: number;
  originalPrice?: number;
  highlight: string;
  reward: string;
  amenities: string[];
  amenityIds: HotelAmenityId[];
  benefits: string[];
  promoTags: string[];
  tagIds: HotelTagId[];
  gallery: string[];
};

const sortOptions: Array<{ id: SortKey; label: string }> = [
  { id: "recommended", label: "Độ phổ biến" },
  { id: "price", label: "Giá thấp nhất" },
  { id: "rating", label: "Đánh giá cao nhất" },
];

const popularTagOptions: Array<{ id: HotelTagId; label: string }> = [
  { id: "sale", label: "Sale lễ" },
  { id: "breakfast", label: "Có bữa sáng" },
  { id: "family", label: "Phù hợp gia đình" },
  { id: "freeCancel", label: "Miễn phí hủy phòng" },
];

const districtOptions = [
  { id: "ward1", label: "Phường 1" },
  { id: "ward3", label: "Phường 3" },
  { id: "ward4", label: "Phường 4" },
  { id: "ward6", label: "Phường 6" },
];

const amenityOptions: Array<{ id: HotelAmenityId; label: string }> = [
  { id: "breakfast", label: "Bữa sáng" },
  { id: "airport", label: "Đưa đón sân bay" },
  { id: "family", label: "Phòng gia đình" },
  { id: "parking", label: "Chỗ đậu xe" },
  { id: "mountain", label: "View núi" },
  { id: "balcony", label: "Ban công" },
];

const typeOptions: Array<{ id: HotelTypeId; label: string }> = [
  { id: "hotel", label: "Khách sạn" },
  { id: "apartment", label: "Căn hộ" },
  { id: "villa", label: "Villa" },
];

const hotelCollections = [
  {
    title: "Khách sạn được đánh giá hàng đầu",
    price: 2415584,
    image: baibienImage,
  },
  {
    title: "Khách sạn hướng núi",
    price: 340274,
    image: thuongHieuImage,
  },
  {
    title: "Popular picks cuối tuần",
    price: 184350,
    image: baibienImage,
  },
];

const hotelResults: HotelResult[] = [
  {
    id: "the-grace",
    name: "The Grace Hotel Dalat",
    district: "Phường 1",
    districtKey: "ward1",
    rating: 8.8,
    reviews: "(1,9N đánh giá)",
    propertyType: "Khách sạn",
    propertyTypeKey: "hotel",
    stars: 4,
    nightlyPrice: 308778,
    totalPrice: 356638,
    originalPrice: 315152,
    highlight: "Sale lễ",
    reward: "1.248 Xu",
    amenities: ["Nhà hàng", "Bữa sáng", "Khu trung tâm"],
    amenityIds: ["breakfast"],
    benefits: ["Miễn phí hủy phòng", "Thanh toán tại khách sạn"],
    promoTags: ["Mã KSLEVN giảm đến 300K", "Ưu đãi phòng cuối tuần"],
    tagIds: ["sale", "breakfast"],
    gallery: [baibienImage, thuongHieuImage, baibienImage, thuongHieuImage],
  },
  {
    id: "nature",
    name: "Nature Hotel - Le Hong Phong",
    district: "Phường 4",
    districtKey: "ward4",
    rating: 8.7,
    reviews: "(76 đánh giá)",
    propertyType: "Khách sạn",
    propertyTypeKey: "hotel",
    stars: 4,
    nightlyPrice: 342436,
    totalPrice: 389951,
    highlight: "View núi",
    reward: "1.365 Xu",
    amenities: ["Khu vui chơi trẻ em", "Cho thuê xe hơi", "Trung tâm thể dục"],
    amenityIds: ["family", "parking", "mountain"],
    benefits: ["Miễn phí hủy phòng", "Không thanh toán ngay"],
    promoTags: ["Mã KSLEVN giảm đến 300K"],
    tagIds: ["family", "freeCancel"],
    gallery: [thuongHieuImage, baibienImage, thuongHieuImage, baibienImage],
  },
  {
    id: "lata",
    name: "LATA Hotel & Apartments",
    district: "Phường 6",
    districtKey: "ward6",
    rating: 9.6,
    reviews: "(634 đánh giá)",
    propertyType: "Căn hộ",
    propertyTypeKey: "apartment",
    stars: 4,
    nightlyPrice: 441558,
    totalPrice: 510000,
    highlight: "Vị trí tốt",
    reward: "1.640 Xu",
    amenities: ["Nhà bếp mini", "Sân hiên", "Khu vực ngoài trời"],
    amenityIds: ["balcony", "family"],
    benefits: ["Miễn phí hủy phòng", "Không thanh toán ngay"],
    promoTags: ["Mã KSLEVN giảm đến 300K", "Ưu đãi chốt sớm"],
    tagIds: ["freeCancel"],
    gallery: [baibienImage, thuongHieuImage, baibienImage, thuongHieuImage],
  },
  {
    id: "bazan",
    name: "Khách sạn Bazan Hotel",
    subtitle: "(Bazan Hotel)",
    district: "Phường 3",
    districtKey: "ward3",
    rating: 9,
    reviews: "(50 đánh giá)",
    propertyType: "Khách sạn",
    propertyTypeKey: "hotel",
    stars: 4,
    nightlyPrice: 234545,
    totalPrice: 270900,
    highlight: "Sale lễ",
    reward: "1.180 Xu",
    amenities: ["Đón khách tại ga tàu", "Giữ trẻ", "Cho thuê xe hơi"],
    amenityIds: ["parking", "family"],
    benefits: ["Miễn phí hủy phòng", "Không thanh toán ngay"],
    promoTags: ["Mã KSLEVN giảm đến 300K", "Một số phòng có Extra Benefit"],
    tagIds: ["sale", "family", "freeCancel"],
    gallery: [thuongHieuImage, baibienImage, thuongHieuImage, baibienImage],
  },
  {
    id: "luxe",
    name: "The Luxe Hotel Dalat",
    district: "Phường 3",
    districtKey: "ward3",
    rating: 8.5,
    reviews: "(1,4N đánh giá)",
    propertyType: "Khách sạn",
    propertyTypeKey: "hotel",
    stars: 4,
    nightlyPrice: 405800,
    totalPrice: 541066,
    originalPrice: 541066,
    highlight: "View núi",
    reward: "1.640 Xu",
    amenities: ["Sân thượng", "Sân hiên", "Ban công"],
    amenityIds: ["mountain", "balcony"],
    benefits: ["Chỉ còn 5 phòng giá này"],
    promoTags: ["Mã KSLEVN giảm đến 300K"],
    tagIds: ["sale"],
    gallery: [baibienImage, thuongHieuImage, baibienImage, thuongHieuImage],
  },
  {
    id: "lapaix",
    name: "La Paix Dalat",
    district: "Phường 3",
    districtKey: "ward3",
    rating: 8.2,
    reviews: "(167 đánh giá)",
    propertyType: "Villa",
    propertyTypeKey: "villa",
    stars: 4,
    nightlyPrice: 749729,
    totalPrice: 850062,
    originalPrice: 999638,
    highlight: "Cho gia đình",
    reward: "2.975 Xu",
    amenities: ["Biệt thự riêng", "Bữa sáng", "Khu vườn"],
    amenityIds: ["family", "breakfast", "balcony"],
    benefits: ["Miễn phí hủy phòng", "Không thanh toán ngay"],
    promoTags: ["Mã KSLEVN giảm đến 300K"],
    tagIds: ["family", "breakfast", "freeCancel"],
    gallery: [thuongHieuImage, baibienImage, thuongHieuImage, baibienImage],
  },
];

function clampCount(value: number, minimum: number) {
  return Number.isFinite(value) ? Math.max(minimum, Math.floor(value)) : minimum;
}

function toHotelDate(dateString: string) {
  const parsedDate = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date(`${defaultHotelSearchState.checkInDate}T00:00:00`);
  }

  return parsedDate;
}

export function toHotelQueryDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function hotelQueryDateToDate(dateString: string) {
  return toHotelDate(dateString);
}

export function parseHotelSearchParams(searchParams: URLSearchParams): HotelSearchState {
  const adults = clampCount(Number(searchParams.get("adults")), defaultHotelSearchState.adults);
  const children = clampCount(Number(searchParams.get("children")), 0);
  const rooms = clampCount(Number(searchParams.get("rooms")), defaultHotelSearchState.rooms);

  return {
    view: searchParams.get("view") === "results" ? "results" : "landing",
    destination: searchParams.get("destination") || defaultHotelSearchState.destination,
    destinationSubtitle: searchParams.get("destinationSub") || defaultHotelSearchState.destinationSubtitle,
    checkInDate: searchParams.get("checkIn") || defaultHotelSearchState.checkInDate,
    checkOutDate: searchParams.get("checkOut") || defaultHotelSearchState.checkOutDate,
    adults,
    children,
    rooms,
  };
}

export function buildHotelSearchQuery(overrides: Partial<HotelSearchState>) {
  const nextState = {
    ...defaultHotelSearchState,
    ...overrides,
  };
  const searchParams = new URLSearchParams();

  searchParams.set("view", nextState.view);
  searchParams.set("destination", nextState.destination);
  searchParams.set("destinationSub", nextState.destinationSubtitle);
  searchParams.set("checkIn", nextState.checkInDate);
  searchParams.set("checkOut", nextState.checkOutDate);
  searchParams.set("adults", String(nextState.adults));
  searchParams.set("children", String(nextState.children));
  searchParams.set("rooms", String(nextState.rooms));

  return searchParams.toString();
}

export function calculateHotelNights(checkInDate: string, checkOutDate: string) {
  const startDate = toHotelDate(checkInDate);
  const endDate = toHotelDate(checkOutDate);
  const difference = endDate.getTime() - startDate.getTime();

  return Math.max(1, Math.round(difference / (1000 * 60 * 60 * 24)));
}

function formatHotelMonthDayLabel(dateString: string) {
  const date = toHotelDate(dateString);

  return `${String(date.getDate()).padStart(2, "0")} thg ${date.getMonth() + 1}`;
}

export function formatHotelDateRange(checkInDate: string, checkOutDate: string) {
  const nights = calculateHotelNights(checkInDate, checkOutDate);

  return `${formatHotelMonthDayLabel(checkInDate)} - ${formatHotelMonthDayLabel(checkOutDate)}, ${nights} đêm`;
}

export function formatHotelGuestSummary(adults: number, children: number, rooms: number) {
  return `${adults} người lớn, ${children} trẻ em, ${rooms} phòng`;
}

function getRatingLabel(rating: number) {
  if (rating >= 9) {
    return "Xuất sắc";
  }

  if (rating >= 8.5) {
    return "Rất tốt";
  }

  return "Tốt";
}

function renderStars(stars: number) {
  return Array.from({ length: stars }, (_, index) => <Star key={`${stars}-${index}`} size={12} fill="currentColor" />);
}

export default function CustomerHotelSearchResults({
  searchState,
  onStartNewSearch,
}: CustomerHotelSearchResultsProps) {
  const [sortBy, setSortBy] = useState<SortKey>("recommended");
  const [priceMode, setPriceMode] = useState("nightly");
  const [selectedPopularTags, setSelectedPopularTags] = useState<HotelTagId[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<HotelTypeId[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<HotelAmenityId[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState(900000);

  useEffect(() => {
    setSortBy("recommended");
    setPriceMode("nightly");
    setSelectedPopularTags([]);
    setSelectedDistricts([]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSelectedStars([]);
    setMaxPrice(900000);
  }, [searchState.checkInDate, searchState.checkOutDate, searchState.destination]);

  const filteredHotels = useMemo(
    () =>
      hotelResults.filter((item) => {
        const matchesPopular =
          selectedPopularTags.length === 0 || selectedPopularTags.every((tag) => item.tagIds.includes(tag));
        const matchesDistrict =
          selectedDistricts.length === 0 || selectedDistricts.includes(item.districtKey);
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.propertyTypeKey);
        const matchesAmenities =
          selectedAmenities.length === 0 || selectedAmenities.every((itemId) => item.amenityIds.includes(itemId));
        const matchesStars = selectedStars.length === 0 || selectedStars.includes(item.stars);
        const matchesPrice = item.nightlyPrice <= maxPrice;

        return matchesPopular && matchesDistrict && matchesType && matchesAmenities && matchesStars && matchesPrice;
      }),
    [maxPrice, selectedAmenities, selectedDistricts, selectedPopularTags, selectedStars, selectedTypes]
  );

  const sortedHotels = useMemo(() => {
    const nextHotels = [...filteredHotels];

    nextHotels.sort((leftItem, rightItem) => {
      if (sortBy === "price") {
        return leftItem.nightlyPrice - rightItem.nightlyPrice;
      }

      if (sortBy === "rating") {
        return rightItem.rating - leftItem.rating;
      }

      if (rightItem.rating !== leftItem.rating) {
        return rightItem.rating - leftItem.rating;
      }

      return leftItem.nightlyPrice - rightItem.nightlyPrice;
    });

    return nextHotels;
  }, [filteredHotels, sortBy]);

  const featuredHotel = sortedHotels[0];
  const listHotels = sortedHotels.filter((item) => item.id !== featuredHotel?.id);
  const lowestPrice = sortedHotels.length ? Math.min(...sortedHotels.map((item) => item.nightlyPrice)) : null;
  const topRating = sortedHotels.length ? Math.max(...sortedHotels.map((item) => item.rating)) : null;
  const staySummary = formatHotelDateRange(searchState.checkInDate, searchState.checkOutDate);
  const guestSummary = formatHotelGuestSummary(searchState.adults, searchState.children, searchState.rooms);

  function toggleArrayValue<T extends string | number>(
    value: T,
    setValue: Dispatch<SetStateAction<T[]>>
  ) {
    setValue((currentValue) =>
      currentValue.includes(value)
        ? currentValue.filter((item) => item !== value)
        : [...currentValue, value]
    );
  }

  function resetFilters() {
    setSortBy("recommended");
    setPriceMode("nightly");
    setSelectedPopularTags([]);
    setSelectedDistricts([]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSelectedStars([]);
    setMaxPrice(900000);
  }

  function renderHotelCard(item: HotelResult, isFeatured = false) {
    return (
      <article key={item.id} className={isFeatured ? "hotel-results__card is-featured" : "hotel-results__card"}>
        {isFeatured ? <div className="hotel-results__card-ribbon">Lựa chọn nổi bật cho tìm kiếm này</div> : null}

        <div className="hotel-results__card-media">
          <div
            className="hotel-results__card-main-image"
            style={{ backgroundImage: `linear-gradient(180deg, rgba(9, 24, 45, 0.06) 0%, rgba(9, 24, 45, 0.3) 100%), url(${item.gallery[0]})` }}
          />
          <div className="hotel-results__card-thumbs">
            {item.gallery.slice(1).map((image, index) => (
              <div
                key={`${item.id}-${index}`}
                className={index === 2 ? "hotel-results__card-thumb hotel-results__card-thumb--overlay" : "hotel-results__card-thumb"}
                style={{ backgroundImage: `linear-gradient(180deg, rgba(8, 22, 44, 0.1) 0%, rgba(8, 22, 44, 0.52) 100%), url(${image})` }}
              >
                {index === 2 ? <span>Xem ảnh</span> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="hotel-results__card-body">
          <div className="hotel-results__card-copy">
            <div className="hotel-results__card-head">
              <div>
                <h3>{item.name}</h3>
                {item.subtitle ? <p className="hotel-results__card-subtitle">{item.subtitle}</p> : null}
                <div className="hotel-results__card-property">
                  <span className="hotel-results__property-chip">
                    <BedDouble size={14} />
                    {item.propertyType}
                  </span>
                  <span className="hotel-results__stars">{renderStars(item.stars)}</span>
                </div>
                <div className="hotel-results__card-location">
                  <MapPinned size={14} />
                  {item.district}, {searchState.destination}
                </div>
              </div>

              <div className="hotel-results__score">
                <strong>{`${item.rating.toFixed(1)}/10`}</strong>
                <span>{getRatingLabel(item.rating)}</span>
                <small>{item.reviews}</small>
              </div>
            </div>

            <div className="hotel-results__amenities">
              {item.amenities.map((amenity) => (
                <span key={amenity} className="hotel-results__amenity">
                  {amenity}
                </span>
              ))}
            </div>

            <div className="hotel-results__benefits">
              {item.benefits.map((benefit) => (
                <span key={benefit} className="hotel-results__benefit">
                  <ShieldCheck size={14} />
                  {benefit}
                </span>
              ))}
            </div>

            <div className="hotel-results__promo-strip">
              <span className="hotel-results__reward">{item.reward}</span>
              {item.promoTags.map((promo) => (
                <span key={promo} className="hotel-results__promo-tag">
                  {promo}
                </span>
              ))}
            </div>
          </div>

          <div className="hotel-results__price-panel">
            <span className="hotel-results__highlight">{item.highlight}</span>
            {item.originalPrice ? <small className="hotel-results__old-price">{formatCurrencyVnd(item.originalPrice)}</small> : null}
            <strong>{formatCurrencyVnd(item.nightlyPrice)}</strong>
            <p>{`Tổng ${formatCurrencyVnd(item.totalPrice)} cho ${searchState.rooms} phòng`}</p>
            <button type="button" className="hotel-results__select-button">
              Chọn phòng
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <section className="hotel-results" id="tim-kiem">
      <div className="customer-shell__container">
        <div className="hotel-results__topbar">
          <div className="hotel-results__summary-fields">
            <div className="hotel-results__summary-field">
              <span>Điểm đến</span>
              <strong>{searchState.destination}</strong>
              <small>{searchState.destinationSubtitle}</small>
            </div>
            <div className="hotel-results__summary-field">
              <span>Thời gian ở</span>
              <strong>{staySummary}</strong>
              <small>{`${calculateHotelNights(searchState.checkInDate, searchState.checkOutDate)} đêm`}</small>
            </div>
            <div className="hotel-results__summary-field">
              <span>Khách và phòng</span>
              <strong>{guestSummary}</strong>
              <small>Giá hiển thị cho mỗi đêm</small>
            </div>
          </div>

          <button type="button" className="hotel-results__search-button" onClick={onStartNewSearch}>
            <Search size={18} />
            Tìm kiếm mới
          </button>
        </div>

        <div className="hotel-results__hero-grid">
          <aside className="hotel-results__map-card">
            <span className="hotel-results__map-chip">
              <MapPinned size={14} />
              Bản đồ khu vực
            </span>
            <strong>{searchState.destination}</strong>
            <p>{`Gợi ý nổi bật cho ${searchState.destinationSubtitle}`}</p>
            <button type="button">Xem trên bản đồ</button>
          </aside>

          <div className="hotel-results__hero-main">
            <div className="hotel-results__headline-card">
              <div>
                <span>Kết quả tìm kiếm khách sạn</span>
                <strong>{`${searchState.destination} đang có ưu đãi tốt`}</strong>
                <p>Hiển thị các khách sạn, căn hộ và villa phù hợp cho hành trình hiện tại.</p>
              </div>
              <div className="hotel-results__headline-icon">
                <BedDouble size={42} />
              </div>
            </div>

            <div className="hotel-results__pill-row">
              <div className="hotel-results__pill">
                <TicketPercent size={16} />
                Mã KSLEVN giảm đến 300K cho đơn đủ điều kiện
              </div>
              <div className="hotel-results__pill">
                <Coffee size={16} />
                Nhiều chỗ ở có bữa sáng và check-in linh hoạt
              </div>
              <div className="hotel-results__pill">
                <Sparkles size={16} />
                Ưu tiên nơi lưu trú được khách đánh giá tốt gần trung tâm
              </div>
            </div>

            <div className="hotel-results__insights">
              <article className="hotel-results__insight-card">
                <span>Giá thấp nhất</span>
                <strong>{lowestPrice ? formatCurrencyVnd(lowestPrice) : "Không có dữ liệu"}</strong>
              </article>
              <article className="hotel-results__insight-card">
                <span>Điểm đánh giá cao nhất</span>
                <strong>{topRating ? `${topRating.toFixed(1)}/10` : "Không có dữ liệu"}</strong>
              </article>
              <article className="hotel-results__insight-card">
                <span>Số gợi ý nổi bật</span>
                <strong>{`${sortedHotels.length} nơi lưu trú`}</strong>
              </article>
            </div>
          </div>
        </div>

        <div className="hotel-results__content">
          <aside className="hotel-results__filters">
            <div className="hotel-results__filter-head">
              <strong>Bộ lọc</strong>
              <button type="button" onClick={resetFilters}>
                Đặt lại
              </button>
            </div>

            <section className="hotel-results__filter-card">
              <div className="hotel-results__filter-card-head">
                <strong>Khoảng giá</strong>
                <span>{formatCurrencyVnd(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={200000}
                max={900000}
                step={25000}
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="hotel-results__range-input"
              />
              <div className="hotel-results__range-meta">
                <span>200.000 VND</span>
                <span>900.000 VND</span>
              </div>
            </section>

            <section className="hotel-results__filter-card">
              <div className="hotel-results__filter-card-head">
                <strong>Lọc phổ biến</strong>
                <ChevronDown size={16} />
              </div>
              <div className="hotel-results__check-list">
                {popularTagOptions.map((item) => (
                  <label key={item.id} className="hotel-results__check-row">
                    <input
                      type="checkbox"
                      checked={selectedPopularTags.includes(item.id)}
                      onChange={() => toggleArrayValue(item.id, setSelectedPopularTags)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="hotel-results__filter-card">
              <div className="hotel-results__filter-card-head">
                <strong>Khu vực</strong>
                <ChevronDown size={16} />
              </div>
              <div className="hotel-results__check-list">
                {districtOptions.map((item) => (
                  <label key={item.id} className="hotel-results__check-row">
                    <input
                      type="checkbox"
                      checked={selectedDistricts.includes(item.id)}
                      onChange={() => toggleArrayValue(item.id, setSelectedDistricts)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="hotel-results__filter-card">
              <div className="hotel-results__filter-card-head">
                <strong>Loại hình lưu trú</strong>
                <ChevronDown size={16} />
              </div>
              <div className="hotel-results__check-list">
                {typeOptions.map((item) => (
                  <label key={item.id} className="hotel-results__check-row">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(item.id)}
                      onChange={() => toggleArrayValue(item.id, setSelectedTypes)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="hotel-results__filter-card">
              <div className="hotel-results__filter-card-head">
                <strong>Đánh giá sao</strong>
                <ChevronDown size={16} />
              </div>
              <div className="hotel-results__check-list">
                {[5, 4, 3].map((item) => (
                  <label key={item} className="hotel-results__check-row">
                    <input
                      type="checkbox"
                      checked={selectedStars.includes(item)}
                      onChange={() => toggleArrayValue(item, setSelectedStars)}
                    />
                    <span>{`${item} sao trở lên`}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="hotel-results__filter-card">
              <div className="hotel-results__filter-card-head">
                <strong>Tiện nghi nổi bật</strong>
                <ChevronDown size={16} />
              </div>
              <div className="hotel-results__check-list">
                {amenityOptions.map((item) => (
                  <label key={item.id} className="hotel-results__check-row">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(item.id)}
                      onChange={() => toggleArrayValue(item.id, setSelectedAmenities)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </section>
          </aside>

          <div className="hotel-results__list-column">
            <div className="hotel-results__list-head">
              <div>
                <span>{searchState.destination}</span>
                <strong>{`${sortedHotels.length} nơi lưu trú phù hợp với tìm kiếm này`}</strong>
              </div>

              <div className="hotel-results__list-controls">
                <label className="hotel-results__select-wrap">
                  <SlidersHorizontal size={14} />
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortKey)}>
                    {sortOptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="hotel-results__select-wrap">
                  <CircleDollarSign size={14} />
                  <select value={priceMode} onChange={(event) => setPriceMode(event.target.value)}>
                    <option value="nightly">Mỗi phòng mỗi đêm</option>
                    <option value="total">Tổng giá cho kỳ ở</option>
                  </select>
                </label>
              </div>
            </div>

            {featuredHotel ? renderHotelCard(featuredHotel, true) : null}

            {sortedHotels.length === 0 ? (
              <article className="hotel-results__empty">
                <strong>Không có nơi lưu trú phù hợp với bộ lọc hiện tại</strong>
                <p>Thử nới bộ lọc giá, khu vực hoặc loại hình để xem thêm gợi ý khác.</p>
                <button type="button" className="hotel-results__search-button" onClick={resetFilters}>
                  Bỏ bộ lọc
                </button>
              </article>
            ) : (
              <>
                {listHotels.map((item, index) => (
                  <div key={item.id}>
                    {renderHotelCard(item)}
                    {index === 1 ? (
                      <article className="hotel-results__collection-card">
                        <div className="hotel-results__collection-copy">
                          <span>Popular Picks</span>
                          <strong>Gợi ý thêm cho chuyến đi của bạn</strong>
                          <p>Các nhóm chỗ ở được khách quan tâm nhiều trong cùng khu vực tìm kiếm.</p>
                        </div>
                        <div className="hotel-results__collection-grid">
                          {hotelCollections.map((collection) => (
                            <article key={collection.title} className="hotel-results__mini-card">
                              <div
                                className="hotel-results__mini-card-image"
                                style={{ backgroundImage: `linear-gradient(180deg, rgba(7, 24, 46, 0.12) 0%, rgba(7, 24, 46, 0.58) 100%), url(${collection.image})` }}
                              />
                              <strong>{collection.title}</strong>
                              <span>{formatCurrencyVnd(collection.price)}</span>
                            </article>
                          ))}
                        </div>
                      </article>
                    ) : null}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
