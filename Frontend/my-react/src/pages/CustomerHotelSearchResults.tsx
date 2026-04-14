import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Coffee,
  MapPinned,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  TicketPercent,
  Users,
} from "lucide-react";
import "../assets/css/CustomerHotelFlow.css";
import {
  type HotelAmenityId,
  type HotelProperty,
  type HotelTagId,
  type HotelTypeId,
  hotelProperties,
} from "../utils/hotelBooking";
import {
  type HotelSearchState,
  buildHotelSearchQuery,
  calculateHotelNights,
  formatHotelDateRange,
  formatHotelGuestSummary,
} from "../utils/hotelSearch";
import { formatCurrencyVnd } from "../utils/flightSearch";

type CustomerHotelSearchResultsProps = {
  searchState: HotelSearchState;
  onStartNewSearch: () => void;
};

type SortKey = "recommended" | "price" | "rating";

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

function toggleArrayValue<T extends string | number>(value: T, setValue: Dispatch<SetStateAction<T[]>>) {
  setValue((currentValue) =>
    currentValue.includes(value) ? currentValue.filter((item) => item !== value) : [...currentValue, value],
  );
}

export default function CustomerHotelSearchResults({
  searchState,
  onStartNewSearch,
}: CustomerHotelSearchResultsProps) {
  const navigate = useNavigate();
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
      hotelProperties.filter((item) => {
        const matchesPopular =
          selectedPopularTags.length === 0 || selectedPopularTags.every((tag) => item.tagIds.includes(tag));
        const matchesDistrict =
          selectedDistricts.length === 0 || selectedDistricts.includes(item.districtKey);
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.propertyTypeKey);
        const matchesAmenities =
          selectedAmenities.length === 0 || selectedAmenities.every((amenityId) => item.amenityIds.includes(amenityId));
        const matchesStars = selectedStars.length === 0 || selectedStars.includes(item.stars);
        const matchesPrice = item.nightlyPrice <= maxPrice;

        return matchesPopular && matchesDistrict && matchesType && matchesAmenities && matchesStars && matchesPrice;
      }),
    [maxPrice, selectedAmenities, selectedDistricts, selectedPopularTags, selectedStars, selectedTypes],
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
  const nights = calculateHotelNights(searchState.checkInDate, searchState.checkOutDate);

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

  function handleSelectHotel(item: HotelProperty) {
    navigate(`/mua-sam/khach-san/${item.id}?${buildHotelSearchQuery({ ...searchState, view: "results" })}`);
  }

  function renderHotelCard(item: HotelProperty, isFeatured = false) {
    return (
      <article key={item.id} className={isFeatured ? "hotel-results__card is-featured" : "hotel-results__card"}>
        {isFeatured ? <div className="hotel-results__card-ribbon">Lựa chọn nổi bật cho tìm kiếm này</div> : null}

        <div className="hotel-results__card-media">
          <div
            className="hotel-results__card-main-image"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(9, 24, 45, 0.06) 0%, rgba(9, 24, 45, 0.3) 100%), url(${item.gallery[0]})`,
            }}
          />
          <div className="hotel-results__card-thumbs">
            {item.gallery.slice(1, 4).map((image, index) => (
              <div
                key={`${item.id}-${index}`}
                className={index === 2 ? "hotel-results__card-thumb hotel-results__card-thumb--overlay" : "hotel-results__card-thumb"}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(8, 22, 44, 0.1) 0%, rgba(8, 22, 44, 0.52) 100%), url(${image})`,
                }}
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
                <small>{`${item.reviewCount.toLocaleString("vi-VN")} đánh giá`}</small>
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
            <strong>{formatCurrencyVnd(priceMode === "nightly" ? item.nightlyPrice : item.totalPrice)}</strong>
            <p>
              {priceMode === "nightly"
                ? `Mỗi phòng mỗi đêm cho ${searchState.rooms} phòng`
                : `Tổng ${formatCurrencyVnd(item.totalPrice)} cho ${searchState.rooms} phòng`}
            </p>
            <button type="button" className="hotel-results__select-button" onClick={() => handleSelectHotel(item)}>
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
              <small>{`${nights} đêm`}</small>
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
                <p>Hiển thị khách sạn, căn hộ và villa phù hợp với hành trình hiện tại của bạn.</p>
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
                Ưu tiên nơi lưu trú được đánh giá tốt gần trung tâm
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
              listHotels.map((item) => renderHotelCard(item))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
