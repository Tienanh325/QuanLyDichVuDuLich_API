import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
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

function toggleArrayValue<T extends string | number>(
  value: T,
  currentArray: T[],
  onUpdate: (newArray: T[]) => void
) {
  onUpdate(
    currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
  );
}

type FilterState = {
  sortBy: SortKey;
  priceMode: string;
  selectedPopularTags: HotelTagId[];
  selectedDistricts: string[];
  selectedTypes: HotelTypeId[];
  selectedAmenities: HotelAmenityId[];
  selectedStars: number[];
  maxPrice: number;
};

const defaultFilterState: FilterState = {
  sortBy: "recommended",
  priceMode: "nightly",
  selectedPopularTags: [],
  selectedDistricts: [],
  selectedTypes: [],
  selectedAmenities: [],
  selectedStars: [],
  maxPrice: 900000,
};

export default function CustomerHotelSearchResults({
  searchState,
  onStartNewSearch,
}: CustomerHotelSearchResultsProps) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);

  const filteredHotels = useMemo(
    () =>
      hotelProperties.filter((item) => {
        const matchesPopular =
          filters.selectedPopularTags.length === 0 || filters.selectedPopularTags.every((tag) => item.tagIds.includes(tag));
        const matchesDistrict =
          filters.selectedDistricts.length === 0 || filters.selectedDistricts.includes(item.districtKey);
        const matchesType = filters.selectedTypes.length === 0 || filters.selectedTypes.includes(item.propertyTypeKey);
        const matchesAmenities =
          filters.selectedAmenities.length === 0 || filters.selectedAmenities.every((amenityId) => item.amenityIds.includes(amenityId));
        const matchesStars = filters.selectedStars.length === 0 || filters.selectedStars.includes(item.stars);
        const matchesPrice = item.nightlyPrice <= filters.maxPrice;

        return matchesPopular && matchesDistrict && matchesType && matchesAmenities && matchesStars && matchesPrice;
      }),
    [filters],
  );

  const sortedHotels = useMemo(() => {
    const nextHotels = [...filteredHotels];

    nextHotels.sort((leftItem, rightItem) => {
      if (filters.sortBy === "price") {
        return leftItem.nightlyPrice - rightItem.nightlyPrice;
      }

      if (filters.sortBy === "rating") {
        return rightItem.rating - leftItem.rating;
      }

      if (rightItem.rating !== leftItem.rating) {
        return rightItem.rating - leftItem.rating;
      }

      return leftItem.nightlyPrice - rightItem.nightlyPrice;
    });

    return nextHotels;
  }, [filteredHotels, filters.sortBy]);

  const featuredHotel = sortedHotels[0];
  const listHotels = sortedHotels.filter((item) => item.id !== featuredHotel?.id);
  const lowestPrice = sortedHotels.length ? Math.min(...sortedHotels.map((item) => item.nightlyPrice)) : null;
  const topRating = sortedHotels.length ? Math.max(...sortedHotels.map((item) => item.rating)) : null;
  const staySummary = formatHotelDateRange(searchState.checkInDate, searchState.checkOutDate);
  const guestSummary = formatHotelGuestSummary(searchState.adults, searchState.children, searchState.rooms);
  const nights = calculateHotelNights(searchState.checkInDate, searchState.checkOutDate);

  function resetFilters() {
    setFilters(defaultFilterState);
  }

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
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
            <strong>{formatCurrencyVnd(filters.priceMode === "nightly" ? item.nightlyPrice : item.totalPrice)}</strong>
            <p>
              {filters.priceMode === "nightly"
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
                <span>{formatCurrencyVnd(filters.maxPrice)}</span>
              </div>
              <input
                type="range"
                min={200000}
                max={900000}
                step={25000}
                value={filters.maxPrice}
                onChange={(event) => updateFilter("maxPrice", Number(event.target.value))}
                className="hotel-results__range-input"
              />
              <input
                type="range"
                min={200000}
                max={900000}
                step={25000}
                value={filters.maxPrice}
                onChange={(event) => updateFilter("maxPrice", Number(event.target.value))}
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
                      checked={filters.selectedPopularTags.includes(item.id)}
                      onChange={() => toggleArrayValue(item.id, filters.selectedPopularTags, (value) => updateFilter("selectedPopularTags", value))}
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
                      checked={filters.selectedDistricts.includes(item.id)}
                      onChange={() => toggleArrayValue(item.id, filters.selectedDistricts, (value) => updateFilter("selectedDistricts", value))}
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
                      checked={filters.selectedTypes.includes(item.id)}
                      onChange={() => toggleArrayValue(item.id, filters.selectedTypes, (value) => updateFilter("selectedTypes", value))}
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
                      checked={filters.selectedStars.includes(item)}
                      onChange={() => toggleArrayValue(item, filters.selectedStars, (value) => updateFilter("selectedStars", value))}
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
                      checked={filters.selectedAmenities.includes(item.id)}
                      onChange={() => toggleArrayValue(item.id, filters.selectedAmenities, (value) => updateFilter("selectedAmenities", value))}
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
                  <select value={filters.sortBy} onChange={(event) => updateFilter("sortBy", event.target.value as SortKey)}>
                    {sortOptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="hotel-results__select-wrap">
                  <CircleDollarSign size={14} />
                  <select value={filters.priceMode} onChange={(event) => updateFilter("priceMode", event.target.value)}>
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
