import { useState, useMemo } from "react";
import "../assets/css/CustomerFlightSearchResults.css";
import {
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  ArrowRightLeft,
  Search,
  Filter,
  Check,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

// --- Mock Data ---
const FLIGHT_RESULTS = [
  {
    id: "f1",
    airline: "Vietnam Airlines",
    logo: "https://storage.googleapis.com/tripi-assets/flight/airlines/vn.png",
    departTime: "06:00",
    departStation: "SGN",
    arriveTime: "08:10",
    arriveStation: "HAN",
    duration: "2h 10m",
    stops: "Bay thẳng",
    originalPrice: 1500000,
    price: 1250000,
    promo: "Khuyến mãi cực hời"
  },
  {
    id: "f2",
    airline: "VietJet Air",
    logo: "https://storage.googleapis.com/tripi-assets/flight/airlines/vj.png",
    departTime: "05:45",
    departStation: "SGN",
    arriveTime: "07:50",
    arriveStation: "HAN",
    duration: "2h 05m",
    stops: "Bay thẳng",
    price: 850000,
  },
  {
    id: "f3",
    airline: "Bamboo Airways",
    logo: "https://storage.googleapis.com/tripi-assets/flight/airlines/qh.png",
    departTime: "07:30",
    departStation: "SGN",
    arriveTime: "09:45",
    arriveStation: "HAN",
    duration: "2h 15m",
    stops: "Bay thẳng",
    originalPrice: 1300000,
    price: 1100000,
  }
];

import type { FlightSearchState } from "../utils/flightSearch";

type CustomerFlightSearchResultsProps = {
  searchState: FlightSearchState;
  onStartNewSearch: () => void;
};

export default function CustomerFlightSearchResults({
  searchState,
  onStartNewSearch,
}: CustomerFlightSearchResultsProps) {
  const [activeSort, setActiveSort] = useState("cheapest");

  const formattedDate = searchState.departDate 
    ? new Date(searchState.departDate).toLocaleDateString("vi-VN", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : "Chưa chọn ngày";

  const sortedFlights = useMemo(() => {
    const result = [...FLIGHT_RESULTS];
    if (activeSort === "cheapest") {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (activeSort === "duration_asc") {
      result.sort((a, b) => {
        const getMinutes = (d: string) => {
          const parts = d.match(/(\d+)h\s*(\d+)m/);
          if (!parts) return 0;
          return parseInt(parts[1]) * 60 + parseInt(parts[2]);
        };
        return getMinutes(a.duration) - getMinutes(b.duration);
      });
    } else if (activeSort === "duration_desc") {
      result.sort((a, b) => {
        const getMinutes = (d: string) => {
          const parts = d.match(/(\d+)h\s*(\d+)m/);
          if (!parts) return 0;
          return parseInt(parts[1]) * 60 + parseInt(parts[2]);
        };
        return getMinutes(b.duration) - getMinutes(a.duration);
      });
    }
    return result;
  }, [activeSort]);

  return (
    <div className="cfsr-page">
      <div className="cfsr-hero">
        <div className="cfsr-hero__container">
          <h1 className="cfsr-hero__title">Kết quả tìm kiếm chuyến bay</h1>
        </div>
      </div>
      
      <div className="cfsr-search-wrap">
        <div className="cfsr-search-bar">
          <div className="cfsr-search-bar__fields">
            {/* From */}
            <div className="cfsr-search-bar__field">
              <span className="cfsr-search-bar__label">TỪ</span>
              <div className="cfsr-search-bar__value">
                <PlaneTakeoff size={18} className="cfsr-search-bar__icon" />
                {searchState.fromTitle || "SGN - TP HCM"}
              </div>
              <button className="cfsr-search-bar__swap-btn">
                <ArrowRightLeft size={16} className="cfsr-search-bar__swap-icon" />
              </button>
            </div>
            
            <div className="cfsr-search-bar__divider"></div>

            {/* To */}
            <div className="cfsr-search-bar__field cfsr-search-bar__field--pl">
              <span className="cfsr-search-bar__label">ĐẾN</span>
              <div className="cfsr-search-bar__value">
                <PlaneLanding size={18} className="cfsr-search-bar__icon" />
                {searchState.toTitle || "HAN - Hà Nội"}
              </div>
            </div>

            <div className="cfsr-search-bar__divider"></div>

            {/* Date */}
            <div className="cfsr-search-bar__field">
              <span className="cfsr-search-bar__label">NGÀY ĐI</span>
              <div className="cfsr-search-bar__value">
                <Calendar size={18} className="cfsr-search-bar__icon" />
                {formattedDate}
              </div>
            </div>

            <div className="cfsr-search-bar__divider"></div>
          </div>

          <div className="cfsr-search-bar__actions">
            <button onClick={onStartNewSearch} className="cfsr-search-bar__search-btn">
              <Search size={16} />
              Đổi tìm kiếm
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="cfsr-layout">
          <aside className="cfsr-sidebar">
            <div className="cfsr-sidebar__header">
              <h2 className="cfsr-sidebar__title">
                <Filter size={20} className="cfsr-sidebar__title-icon" />
                Bộ lọc
              </h2>
              <button className="cfsr-sidebar__clear">XÓA TẤT CẢ</button>
            </div>

            <div className="cfsr-sidebar__filters">
              {/* Filter 1 */}
              <div className="cfsr-sidebar__filter-card">
                <h3 className="cfsr-sidebar__filter-title">Số điểm dừng</h3>
                <div className="cfsr-sidebar__checkbox-list">
                  <label className="cfsr-sidebar__checkbox-label">
                    <div className="cfsr-sidebar__check-icon"><Check size={14} /></div>
                    <span className="cfsr-sidebar__checkbox-text">Bay thẳng</span>
                  </label>
                  <label className="cfsr-sidebar__checkbox-label">
                    <div className="cfsr-sidebar__uncheck-icon"></div>
                    <span className="cfsr-sidebar__checkbox-text">1 Điểm dừng</span>
                  </label>
                </div>
              </div>

              {/* Filter 2 */}
              <div className="cfsr-sidebar__filter-card">
                <h3 className="cfsr-sidebar__filter-title">Hãng hàng không</h3>
                <div className="cfsr-sidebar__checkbox-list">
                  <label className="cfsr-sidebar__checkbox-label cfsr-sidebar__checkbox-label--between">
                    <div className="cfsr-sidebar__checkbox-inner">
                      <div className="cfsr-sidebar__check-icon"><Check size={14} /></div>
                      <span className="cfsr-sidebar__checkbox-text">Vietnam Airlines</span>
                    </div>
                    <span className="cfsr-sidebar__checkbox-price">Từ 1.2M</span>
                  </label>
                  <label className="cfsr-sidebar__checkbox-label cfsr-sidebar__checkbox-label--between">
                    <div className="cfsr-sidebar__checkbox-inner">
                      <div className="cfsr-sidebar__check-icon"><Check size={14} /></div>
                      <span className="cfsr-sidebar__checkbox-text">VietJet Air</span>
                    </div>
                    <span className="cfsr-sidebar__checkbox-price">Từ 800K</span>
                  </label>
                  <label className="cfsr-sidebar__checkbox-label cfsr-sidebar__checkbox-label--between">
                    <div className="cfsr-sidebar__checkbox-inner">
                      <div className="cfsr-sidebar__check-icon"><Check size={14} /></div>
                      <span className="cfsr-sidebar__checkbox-text">Bamboo Airways</span>
                    </div>
                    <span className="cfsr-sidebar__checkbox-price">Từ 1.1M</span>
                  </label>
                </div>
              </div>

              {/* Filter 3 */}
              <div className="cfsr-sidebar__filter-card">
                <h3 className="cfsr-sidebar__filter-title">Giờ khởi hành</h3>
                <div className="cfsr-sidebar__time-grid">
                  <button className="cfsr-sidebar__time-btn">
                    <Moon size={16} className="cfsr-sidebar__time-icon" />
                    <span className="cfsr-sidebar__time-text">00:00 - 06:00</span>
                  </button>
                  <button className="cfsr-sidebar__time-btn cfsr-sidebar__time-btn--active">
                    <Sun size={16} className="cfsr-sidebar__time-icon" />
                    <span className="cfsr-sidebar__time-text">06:00 - 12:00</span>
                  </button>
                  <button className="cfsr-sidebar__time-btn">
                    <Sun size={16} className="cfsr-sidebar__time-icon" />
                    <span className="cfsr-sidebar__time-text">12:00 - 18:00</span>
                  </button>
                  <button className="cfsr-sidebar__time-btn">
                    <Moon size={16} className="cfsr-sidebar__time-icon" />
                    <span className="cfsr-sidebar__time-text">18:00 - 24:00</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="cfsr-results">
            {/* Sort Bar */}
            <div className="cfsr-sort-bar">
              <p className="cfsr-sort-bar__count">
                Đang hiển thị <span className="cfsr-sort-bar__count-number">{sortedFlights.length}</span> chuyến bay
              </p>
              <div className="cfsr-sort-bar__controls">
                <span className="cfsr-sort-bar__label">SẮP XẾP THEO:</span>
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value as any)}
                  className="cfsr-sort-bar__select"
                >
                  <option value="price_desc">Giá: Cao → Thấp</option>
                  <option value="cheapest">Giá: Thấp → Cao</option>
                  <option value="duration_asc">Thời gian: Ngắn nhất</option>
                  <option value="duration_desc">Thời gian: Dài nhất</option>
                </select>
              </div>
            </div>

            {/* Flight Cards */}
            <div className="cfsr-card-list">
              {sortedFlights.map((flight) => (
                <div key={flight.id} className="cfsr-card">
                  {flight.promo && (
                    <div className="cfsr-card__promo">{flight.promo}</div>
                  )}
                  
                  <div className="cfsr-card__row">
                    {/* Airline */}
                    <div className="cfsr-card__airline">
                      <div className="cfsr-card__airline-info">
                        <div className="cfsr-card__airline-logo">
                           <img src={flight.logo} alt={flight.airline} />
                        </div>
                        <span className="cfsr-card__airline-name">{flight.airline}</span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="cfsr-card__timeline">
                      <div style={{ textAlign: 'right' }}>
                        <div className="cfsr-card__time">{flight.departTime}</div>
                        <div className="cfsr-card__station">{flight.departStation}</div>
                      </div>
                      
                      <div className="cfsr-card__duration-line">
                        <span className="cfsr-card__duration-text">{flight.duration}</span>
                        <div className="cfsr-card__duration-bar">
                          <PlaneTakeoff size={14} className="cfsr-card__duration-icon" />
                        </div>
                        <span className="cfsr-card__stops">{flight.stops}</span>
                      </div>

                      <div style={{ textAlign: 'left' }}>
                        <div className="cfsr-card__time">{flight.arriveTime}</div>
                        <div className="cfsr-card__station">{flight.arriveStation}</div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="cfsr-card__pricing">
                      {flight.originalPrice && (
                        <span className="cfsr-card__old-price">
                          {flight.originalPrice.toLocaleString('vi-VN')} VND
                        </span>
                      )}
                      <span className="cfsr-card__price">
                        {flight.price.toLocaleString('vi-VN')} VND
                      </span>
                      <button className="cfsr-card__book-btn">Chọn</button>
                      <button className="cfsr-card__detail-link">Chi tiết chuyến bay</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="cfsr-pagination">
              <button className="cfsr-pagination__btn cfsr-pagination__btn--disabled">
                <ChevronLeft size={18} />
              </button>
              <button className="cfsr-pagination__btn cfsr-pagination__btn--active">1</button>
              <button className="cfsr-pagination__btn">2</button>
              <button className="cfsr-pagination__btn">3</button>
              <button className="cfsr-pagination__btn">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
