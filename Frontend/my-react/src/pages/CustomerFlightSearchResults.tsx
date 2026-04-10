import { useLayoutEffect, useMemo, useState, useRef } from "react";
import { flushSync } from "react-dom";
import {
  ArrowRight,
  BellRing,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  PlaneTakeoff,
  Search,
  Sparkles,
  Star,
  Wifi,
} from "lucide-react";
import type { FlightSearchState } from "../utils/flightSearch";
import {
  addFlightDays,
  extractAirportCode,
  formatCurrencyVnd,
  formatFlightDateChip,
  formatFlightDateMeta,
} from "../utils/flightSearch";

type TimeSlotId = "lateNight" | "morning" | "afternoon" | "evening";
type SortKey = "recommended" | "price" | "duration";

type CustomerFlightSearchResultsProps = {
  searchState: FlightSearchState;
  onStartNewSearch: () => void;
};

type FlightResult = {
  id: string;
  airline: string;
  departTime: string;
  arriveTime: string;
  durationMinutes: number;
  stops: number;
  baggage: string;
  basePrice: number;
  priceStep: number;
  promoTags: string[];
  badges: string[];
  score: number;
  arrivalAirport?: string;
  hasWifi?: boolean;
};

type DecoratedFlightResult = FlightResult & {
  price: number;
  fromCode: string;
  toCode: string;
};

const resultPromos = [
  {
    code: "BAYHOLIDAYDNA",
    title: "Giảm thêm đến 300K",
    body: "Áp dụng cho một số hành trình quốc tế đang có giá tốt trong tuần.",
  },
  {
    code: "TVLKBANMOI",
    title: "Mã mới giảm thêm 50K",
    body: "Dùng được cho khách mới đặt vé máy bay lần đầu trên website.",
  },
  {
    code: "FLYTOGO",
    title: "Ưu đãi nhóm từ 3 khách",
    body: "Phù hợp với chuyến đi gia đình hoặc lịch trình cùng bạn bè.",
  },
] as const;

const timeSlotOptions: Array<{
  id: TimeSlotId;
  label: string;
  rangeLabel: string;
  startHour: number;
  endHour: number;
}> = [
  { id: "lateNight", label: "Đêm đến sáng", rangeLabel: "00:00 - 06:00", startHour: 0, endHour: 6 },
  { id: "morning", label: "Sáng đến trưa", rangeLabel: "06:00 - 12:00", startHour: 6, endHour: 12 },
  { id: "afternoon", label: "Trưa đến tối", rangeLabel: "12:00 - 18:00", startHour: 12, endHour: 18 },
  { id: "evening", label: "Tối đến đêm", rangeLabel: "18:00 - 24:00", startHour: 18, endHour: 24 },
];

const sortOptions: Array<{ id: SortKey; label: string }> = [
  { id: "recommended", label: "Ưu tiên bay thẳng" },
  { id: "price", label: "Giá thấp nhất" },
  { id: "duration", label: "Thời gian ngắn nhất" },
];

const baseResults: FlightResult[] = [
  {
    id: "vietjet-air",
    airline: "VietJet Air",
    departTime: "17:15",
    arriveTime: "18:45",
    durationMinutes: 90,
    stops: 0,
    baggage: "0kg hành lý",
    basePrice: 2720302,
    priceStep: 25000,
    promoTags: ["TVLKBANMOI giảm thêm 50K", "BAYHOLIDAYDNA giảm đến 300K"],
    badges: ["Chi tiết", "Đổi lịch", "Khuyến mãi"],
    score: 98,
  },
  {
    id: "vietravel-airlines",
    airline: "Vietravel Airlines",
    departTime: "11:50",
    arriveTime: "13:25",
    durationMinutes: 95,
    stops: 0,
    baggage: "0kg hành lý",
    basePrice: 2233250,
    priceStep: 0,
    promoTags: ["TVLKBANMOI giảm thêm 50K", "BAYHOLIDAYDNA giảm đến 300K"],
    badges: ["Chi tiết", "Lợi ích đi kèm", "Hoàn vé"],
    score: 96,
  },
  {
    id: "thai-airasia",
    airline: "Thai AirAsia",
    departTime: "21:35",
    arriveTime: "23:05",
    durationMinutes: 90,
    stops: 0,
    baggage: "0kg hành lý",
    basePrice: 2381525,
    priceStep: 18000,
    promoTags: ["Flash deal đêm", "Hoàn 30K ví điện tử"],
    badges: ["Chi tiết", "Đổi lịch", "Wi-Fi"],
    score: 94,
    arrivalAirport: "DMK",
    hasWifi: true,
  },
  {
    id: "bangkok-airways",
    airline: "Bangkok Airways",
    departTime: "08:20",
    arriveTime: "11:05",
    durationMinutes: 165,
    stops: 1,
    baggage: "20kg hành lý",
    basePrice: 2686223,
    priceStep: 32000,
    promoTags: ["Hỗ trợ đổi lịch linh hoạt"],
    badges: ["Chi tiết", "Lợi ích đi kèm", "Hành lý ký gửi"],
    score: 88,
  },
  {
    id: "cathay-pacific",
    airline: "Cathay Pacific",
    departTime: "13:10",
    arriveTime: "17:05",
    durationMinutes: 235,
    stops: 1,
    baggage: "25kg hành lý",
    basePrice: 3126040,
    priceStep: 45000,
    promoTags: ["Tặng điểm thành viên"],
    badges: ["Chi tiết", "Hoàn vé", "Suất ăn"],
    score: 84,
  },
];

function parseTimeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

function formatDuration(durationMinutes: number) {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function isInTimeSlot(timeValue: string, slotId: TimeSlotId) {
  const minutes = parseTimeToMinutes(timeValue);
  const hour = minutes / 60;
  const slot = timeSlotOptions.find((item) => item.id === slotId);

  if (!slot) {
    return true;
  }

  return hour >= slot.startHour && hour < slot.endHour;
}

function getTripTypeLabel(tripType: FlightSearchState["tripType"]) {
  if (tripType === "oneWay") {
    return "Một chiều";
  }

  if (tripType === "multiCity") {
    return "Nhiều thành phố";
  }

  return "Khứ hồi";
}

export default function CustomerFlightSearchResults({
  searchState,
  onStartNewSearch,
}: CustomerFlightSearchResultsProps) {
  const [selectedDate, setSelectedDate] = useState(searchState.departDate);
  const [sortBy, setSortBy] = useState<SortKey>("recommended");
  const [selectedStops, setSelectedStops] = useState<number[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [departureSlots, setDepartureSlots] = useState<TimeSlotId[]>([]);
  const [arrivalSlots, setArrivalSlots] = useState<TimeSlotId[]>([]);
  const [maxDurationHours, setMaxDurationHours] = useState(37);
  
  const lastSearchKeyRef = useRef(
    `${searchState.departDate}-${searchState.fromTitle}-${searchState.toTitle}`
  );

  useLayoutEffect(() => {
    const currentSearchKey = `${searchState.departDate}-${searchState.fromTitle}-${searchState.toTitle}`;
    if (currentSearchKey !== lastSearchKeyRef.current) {
      lastSearchKeyRef.current = currentSearchKey;
      flushSync(() => {
        setSelectedDate(searchState.departDate);
        setSortBy("recommended");
        setSelectedStops([]);
        setSelectedAirlines([]);
        setDepartureSlots([]);
        setArrivalSlots([]);
        setMaxDurationHours(37);
      });
    }
  }, [searchState.departDate, searchState.fromTitle, searchState.toTitle]);

  const dayOptions = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => {
        const dateValue = addFlightDays(searchState.departDate, index);
        const lowestPrice = Math.min(...baseResults.map((item) => item.basePrice + item.priceStep * index));

        return {
          id: dateValue,
          label: formatFlightDateChip(dateValue),
          price: formatCurrencyVnd(lowestPrice),
        };
      }),
    [searchState.departDate]
  );

  const selectedDateIndex = Math.max(dayOptions.findIndex((item) => item.id === selectedDate), 0);

  const allResults = useMemo(() => {
    const fromCode = extractAirportCode(searchState.fromTitle) || "SGN";
    const fallbackArrivalCode = extractAirportCode(searchState.toTitle) || "BKK";

    return baseResults.map<DecoratedFlightResult>((item) => ({
      ...item,
      price: item.basePrice + item.priceStep * selectedDateIndex,
      fromCode,
      toCode: item.arrivalAirport || fallbackArrivalCode,
    }));
  }, [searchState.fromTitle, searchState.toTitle, selectedDateIndex]);

  const airlinePriceMap = useMemo(() => {
    const nextMap = new Map<string, number>();

    allResults.forEach((item) => {
      const currentPrice = nextMap.get(item.airline);

      if (currentPrice === undefined || item.price < currentPrice) {
        nextMap.set(item.airline, item.price);
      }
    });

    return nextMap;
  }, [allResults]);

  const stopPriceMap = useMemo(() => {
    const directPrices = allResults.filter((item) => item.stops === 0).map((item) => item.price);
    const oneStopPrices = allResults.filter((item) => item.stops === 1).map((item) => item.price);

    return {
      direct: directPrices.length ? Math.min(...directPrices) : null,
      oneStop: oneStopPrices.length ? Math.min(...oneStopPrices) : null,
    };
  }, [allResults]);

  const filteredResults = useMemo(
    () =>
      allResults.filter((item) => {
        const matchesStops = selectedStops.length === 0 || selectedStops.includes(item.stops);
        const matchesAirline = selectedAirlines.length === 0 || selectedAirlines.includes(item.airline);
        const matchesDeparture =
          departureSlots.length === 0 || departureSlots.some((slotId) => isInTimeSlot(item.departTime, slotId));
        const matchesArrival =
          arrivalSlots.length === 0 || arrivalSlots.some((slotId) => isInTimeSlot(item.arriveTime, slotId));
        const matchesDuration = item.durationMinutes <= maxDurationHours * 60;

        return matchesStops && matchesAirline && matchesDeparture && matchesArrival && matchesDuration;
      }),
    [allResults, arrivalSlots, departureSlots, maxDurationHours, selectedAirlines, selectedStops]
  );

  const featuredResult = useMemo(() => {
    const nextResults = [...filteredResults].sort((leftItem, rightItem) => {
      if (rightItem.score !== leftItem.score) {
        return rightItem.score - leftItem.score;
      }

      if (leftItem.stops !== rightItem.stops) {
        return leftItem.stops - rightItem.stops;
      }

      return leftItem.price - rightItem.price;
    });

    return nextResults[0];
  }, [filteredResults]);

  const listResults = useMemo(() => {
    const nextResults = [...filteredResults].sort((leftItem, rightItem) => {
      if (sortBy === "price") {
        return leftItem.price - rightItem.price;
      }

      if (sortBy === "duration") {
        return leftItem.durationMinutes - rightItem.durationMinutes;
      }

      if (rightItem.score !== leftItem.score) {
        return rightItem.score - leftItem.score;
      }

      if (leftItem.stops !== rightItem.stops) {
        return leftItem.stops - rightItem.stops;
      }

      return leftItem.price - rightItem.price;
    });

    return nextResults.filter((item) => item.id !== featuredResult?.id);
  }, [featuredResult, filteredResults, sortBy]);

  const lowestPrice = filteredResults.length ? Math.min(...filteredResults.map((item) => item.price)) : null;
  const shortestDuration = filteredResults.length
    ? Math.min(...filteredResults.map((item) => item.durationMinutes))
    : null;
  const summaryMeta = [
    formatFlightDateMeta(selectedDate),
    searchState.passengers,
    searchState.cabinClass,
    getTripTypeLabel(searchState.tripType),
  ].join(" | ");

  function toggleStops(stopValue: number) {
    setSelectedStops((currentValue) =>
      currentValue.includes(stopValue)
        ? currentValue.filter((item) => item !== stopValue)
        : [...currentValue, stopValue]
    );
  }

  function toggleAirline(airline: string) {
    setSelectedAirlines((currentValue) =>
      currentValue.includes(airline)
        ? currentValue.filter((item) => item !== airline)
        : [...currentValue, airline]
    );
  }

  function toggleDepartureSlot(slotId: TimeSlotId) {
    setDepartureSlots((currentValue) =>
      currentValue.includes(slotId)
        ? currentValue.filter((item) => item !== slotId)
        : [...currentValue, slotId]
    );
  }

  function toggleArrivalSlot(slotId: TimeSlotId) {
    setArrivalSlots((currentValue) =>
      currentValue.includes(slotId)
        ? currentValue.filter((item) => item !== slotId)
        : [...currentValue, slotId]
    );
  }

  function resetFilters() {
    setSortBy("recommended");
    setSelectedStops([]);
    setSelectedAirlines([]);
    setDepartureSlots([]);
    setArrivalSlots([]);
    setMaxDurationHours(37);
  }

  function moveSelectedDate(direction: -1 | 1) {
    const nextIndex = Math.min(Math.max(selectedDateIndex + direction, 0), dayOptions.length - 1);
    setSelectedDate(dayOptions[nextIndex].id);
  }

  function renderTicket(result: DecoratedFlightResult, isFeatured = false) {
    return (
      <article
        key={result.id}
        className={isFeatured ? "flight-results__ticket is-featured" : "flight-results__ticket"}
      >
        {isFeatured ? (
          <div className="flight-results__ticket-badge">
            <Star size={14} />
            Chuyến bay tốt nhất cho bạn
          </div>
        ) : null}

        <div className="flight-results__ticket-main">
          <div className="flight-results__ticket-airline">
            <div>
              <strong>{result.airline}</strong>
              <div className="flight-results__ticket-meta">{result.baggage}</div>
            </div>
            {result.hasWifi ? (
              <span className="flight-results__ticket-utility">
                <Wifi size={14} />
                Wi-Fi
              </span>
            ) : null}
          </div>

          <div className="flight-results__ticket-journey">
            <div className="flight-results__ticket-column">
              <strong>{result.departTime}</strong>
              <span>{result.fromCode}</span>
            </div>

            <div className="flight-results__ticket-path">
              <span>{formatDuration(result.durationMinutes)}</span>
              <small>{result.stops === 0 ? "Bay thẳng" : `${result.stops} điểm dừng`}</small>
            </div>

            <div className="flight-results__ticket-column">
              <strong>{result.arriveTime}</strong>
              <span>{result.toCode}</span>
            </div>
          </div>

          <div className="flight-results__ticket-price">
            <strong>{formatCurrencyVnd(result.price)}</strong>
            <span>/khách</span>
          </div>
        </div>

        <div className="flight-results__ticket-tags">
          {result.promoTags.map((item) => (
            <span key={item} className="flight-results__ticket-tag">
              {item}
            </span>
          ))}
        </div>

        <div className="flight-results__ticket-footer">
          <div className="flight-results__ticket-links">
            {result.badges.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <button type="button" className="flight-results__select-button">
            Chọn
          </button>
        </div>
      </article>
    );
  }

  return (
    <section className="flight-results" id="tim-kiem">
      <div className="customer-shell__container">
        <div className="flight-results__topbar">
          <div>
            <span className="flight-results__eyebrow">Kết quả tìm kiếm vé máy bay</span>
            <strong className="flight-results__title">{`${searchState.fromTitle} → ${searchState.toTitle}`}</strong>
            <p className="flight-results__subtitle">{summaryMeta}</p>
          </div>

          <button type="button" className="flight-results__new-search" onClick={onStartNewSearch}>
            <Search size={16} />
            Tìm kiếm mới
          </button>
        </div>

        <div className="flight-results__hero-grid">
          <aside className="flight-results__promo-panel" id="uu-dai">
            <div className="flight-results__promo-head">
              <span>Khuyến mãi</span>
              <strong>3 mã nên dùng ngay</strong>
            </div>

            <div className="flight-results__promo-list">
              {resultPromos.map((item) => (
                <article key={item.code} className="flight-results__promo-card">
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                  <div className="flight-results__promo-footer">
                    <span>{item.code}</span>
                    <button type="button">Sao chép</button>
                  </div>
                </article>
              ))}
            </div>
          </aside>

          <div className="flight-results__hero-main">
            <div className="flight-results__summary-card">
              <div className="flight-results__summary-copy">
                <span>Hành trình đang chọn</span>
                <strong>{`${searchState.fromTitle} → ${searchState.toTitle}`}</strong>
                <p>{summaryMeta}</p>
              </div>

              <div className="flight-results__summary-actions">
                <button
                  type="button"
                  className="flight-results__summary-action"
                  onClick={onStartNewSearch}
                  aria-label="Tìm kiếm mới"
                >
                  <Search size={18} />
                </button>
                <button type="button" className="flight-results__summary-action" aria-label="Theo dõi giá">
                  <BellRing size={18} />
                </button>
              </div>

              <div className="flight-results__summary-plane">
                <PlaneTakeoff size={54} />
              </div>
            </div>

            <div className="flight-results__calendar-row">
              <button
                type="button"
                className="flight-results__calendar-nav"
                onClick={() => moveSelectedDate(-1)}
                disabled={selectedDateIndex === 0}
                aria-label="Ngày trước"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flight-results__calendar-track">
                {dayOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      item.id === selectedDate
                        ? "flight-results__calendar-day is-active"
                        : "flight-results__calendar-day"
                    }
                    onClick={() => setSelectedDate(item.id)}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.price}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="flight-results__calendar-nav"
                onClick={() => moveSelectedDate(1)}
                disabled={selectedDateIndex === dayOptions.length - 1}
                aria-label="Ngày sau"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flight-results__pill-row">
              <div className="flight-results__pill">
                <Sparkles size={16} />
                TVLKBANMOI giảm thêm 50K cho khách mới
              </div>
              <div className="flight-results__pill">
                <CircleDollarSign size={16} />
                Mừng đại lễ, thêm deal đẹp cho chặng phổ biến
              </div>
              <div className="flight-results__pill">
                <BellRing size={16} />
                Bật cảnh báo giá để không bỏ lỡ vé tốt
              </div>
            </div>

            <div className="flight-results__insights">
              <article className="flight-results__insight-card">
                <span>Giá thấp nhất</span>
                <strong>{lowestPrice ? formatCurrencyVnd(lowestPrice) : "Không có dữ liệu"}</strong>
              </article>

              <article className="flight-results__insight-card">
                <span>Thời gian bay ngắn nhất</span>
                <strong>{shortestDuration ? formatDuration(shortestDuration) : "Không có dữ liệu"}</strong>
              </article>

              <label className="flight-results__sort-box">
                <span>Ưu tiên</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortKey)}>
                  {sortOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="flight-results__content">
          <aside className="flight-results__filters">
            <div className="flight-results__filter-head">
              <strong>Bộ lọc</strong>
              <button type="button" onClick={resetFilters}>
                Đặt lại
              </button>
            </div>

            <section className="flight-results__filter-group">
              <div className="flight-results__filter-group-head">Số điểm dừng</div>
              <div className="flight-results__check-list">
                <label className="flight-results__check-row">
                  <input type="checkbox" checked={selectedStops.includes(0)} onChange={() => toggleStops(0)} />
                  <span className="flight-results__check-copy">
                    <strong>Bay thẳng</strong>
                    <small>{stopPriceMap.direct ? formatCurrencyVnd(stopPriceMap.direct) : "Đang cập nhật"}</small>
                  </span>
                </label>
                <label className="flight-results__check-row">
                  <input type="checkbox" checked={selectedStops.includes(1)} onChange={() => toggleStops(1)} />
                  <span className="flight-results__check-copy">
                    <strong>1 điểm dừng</strong>
                    <small>{stopPriceMap.oneStop ? formatCurrencyVnd(stopPriceMap.oneStop) : "Đang cập nhật"}</small>
                  </span>
                </label>
              </div>
            </section>

            <section className="flight-results__filter-group">
              <div className="flight-results__filter-group-head">Hãng hàng không</div>
              <div className="flight-results__check-list">
                {Array.from(airlinePriceMap.entries()).map(([airline, price]) => (
                  <label key={airline} className="flight-results__check-row">
                    <input
                      type="checkbox"
                      checked={selectedAirlines.includes(airline)}
                      onChange={() => toggleAirline(airline)}
                    />
                    <span className="flight-results__check-copy">
                      <strong>{airline}</strong>
                      <small>{formatCurrencyVnd(price)}</small>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="flight-results__filter-group">
              <div className="flight-results__filter-group-head">Giờ cất cánh</div>
              <div className="flight-results__time-grid">
                {timeSlotOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      departureSlots.includes(item.id)
                        ? "flight-results__time-chip is-active"
                        : "flight-results__time-chip"
                    }
                    onClick={() => toggleDepartureSlot(item.id)}
                  >
                    <span>{item.label}</span>
                    <strong>{item.rangeLabel}</strong>
                  </button>
                ))}
              </div>
            </section>

            <section className="flight-results__filter-group">
              <div className="flight-results__filter-group-head">Giờ hạ cánh</div>
              <div className="flight-results__time-grid">
                {timeSlotOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      arrivalSlots.includes(item.id)
                        ? "flight-results__time-chip is-active"
                        : "flight-results__time-chip"
                    }
                    onClick={() => toggleArrivalSlot(item.id)}
                  >
                    <span>{item.label}</span>
                    <strong>{item.rangeLabel}</strong>
                  </button>
                ))}
              </div>
            </section>

            <section className="flight-results__filter-group">
              <div className="flight-results__range-head">
                <strong>Thời gian bay</strong>
                <span>{`0h - ${maxDurationHours}h`}</span>
              </div>
              <input
                type="range"
                min={1}
                max={37}
                value={maxDurationHours}
                onChange={(event) => setMaxDurationHours(Number(event.target.value))}
                className="flight-results__range-input"
              />
            </section>

            <button type="button" className="flight-results__placeholder-toggle">
              Tiện ích
              <ChevronDown size={18} />
            </button>
            <button type="button" className="flight-results__placeholder-toggle">
              Ưu đãi đặc biệt
              <ChevronDown size={18} />
            </button>
            <button type="button" className="flight-results__placeholder-toggle">
              Vé đặc biệt
              <ChevronDown size={18} />
            </button>
          </aside>

          <div className="flight-results__section">
            <div className="flight-results__section-title">
              <span>Lựa chọn nổi bật</span>
              <strong>Chuyến bay phù hợp nhất cho tìm kiếm của bạn</strong>
            </div>

            {featuredResult ? renderTicket(featuredResult, true) : null}

            <div className="flight-results__section-title flight-results__section-title--compact">
              <span>Tất cả chuyến bay</span>
              <strong>{`${filteredResults.length} lựa chọn đang khả dụng`}</strong>
            </div>

            {filteredResults.length === 0 ? (
              <article className="flight-results__empty">
                <strong>Không tìm thấy chuyến bay phù hợp với bộ lọc hiện tại</strong>
                <p>Thử bỏ bớt bộ lọc hoặc quay lại tạo tìm kiếm mới để xem thêm lựa chọn.</p>
                <button type="button" className="flight-results__new-search" onClick={resetFilters}>
                  Bỏ bộ lọc
                </button>
              </article>
            ) : (
              <>
                {listResults.map((item, index) => (
                  <div key={item.id}>
                    {renderTicket(item)}
                    {index === 1 ? (
                      <article className="flight-results__alert-card" id="faq">
                        <div className="flight-results__alert-copy">
                          <strong>Là người đầu tiên biết khi giá giảm!</strong>
                          <p>Bật thông báo giá và chúng tôi sẽ báo ngay khi chặng bay này có mức giá tốt hơn.</p>
                          <button type="button" className="flight-results__alert-link">
                            Bật thông báo ngay
                            <ArrowRight size={14} />
                          </button>
                        </div>

                        <div className="flight-results__alert-orb">
                          <Clock3 size={28} />
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
