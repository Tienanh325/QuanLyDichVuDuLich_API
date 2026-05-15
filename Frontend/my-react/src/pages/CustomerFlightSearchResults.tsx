import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clampPage, getPageItems, getPaginationState } from "../utils/pagination";
import { formatVnd } from "../utils/money";
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
import { searchMayBay, tinhThoiGianBay, formatGio, type VeMayBayResult } from "../services/veService";
import type { FlightSearchState } from "../utils/flightSearch";

type FlightResult = {
  id: string;
  airline: string;
  logo?: string | null;
  departTime: string;
  departStation: string;
  arriveTime: string;
  arriveStation: string;
  duration: string;
  stops: string;
  originalPrice?: number | null;
  price: number;
  promo?: string | null;
};

function mapFlight(row: VeMayBayResult): FlightResult {
  return {
    id: String(row.maVe),
    airline: row.hangHangKhong || row.tenNhaCungCap || "Hãng bay",
    departTime: formatGio(row.thoiGianKhoiHanh),
    departStation: row.diemKhoiHanh,
    arriveTime: formatGio(row.thoiGianDen),
    arriveStation: row.diemDen,
    duration: tinhThoiGianBay(row.thoiGianKhoiHanh, row.thoiGianDen),
    stops: "Bay thẳng",
    price: Number(row.giaThapNhat ?? 0),
    promo: row.tenDichVu,
  };
}

type CustomerFlightSearchResultsProps = {
  searchState: FlightSearchState;
  onStartNewSearch: () => void;
};

export default function CustomerFlightSearchResults({
  searchState,
  onStartNewSearch,
}: CustomerFlightSearchResultsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = clampPage(searchParams.get("page"));
  const pageSize = 5;
  const selectedStops = searchParams.get("soDiemDung");
  const selectedAirline = searchParams.get("hangHangKhong") ?? "";
  type FlightSortKey = "price_desc" | "cheapest" | "duration_asc" | "duration_desc";
  const [activeSort, setActiveSort] = useState<FlightSortKey>("cheapest");
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const pagination = getPaginationState(currentPage, pageSize, totalRecords);

  function navigateWithFilters(updates: Record<string, string | number | null>, page = 1) {
    const next = new URLSearchParams(location.search);
    next.set("page", String(page));
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") next.delete(key);
      else next.set(key, String(value));
    });
    navigate(`${location.pathname}?${next.toString()}`);
  }

  function goToPage(page: number) {
    navigateWithFilters({}, page);
  }

  useEffect(() => {
    queueMicrotask(() => setLoading(true));
    searchMayBay({
      diemKhoiHanh: searchState.fromTitle || undefined,
      diemDen: searchState.toTitle || undefined,
      ngayKhoiHanh: searchState.departDate || undefined,
      page: currentPage,
      limit: pageSize,
      hangHangKhong: selectedAirline || undefined,
      soDiemDung: selectedStops ? Number(selectedStops) : undefined,
    })
      .then((response) => {
        setFlights(response.data.map(mapFlight));
        setTotalRecords(response.totalRecords);
      })
      .catch(() => {
        setFlights([]);
        setTotalRecords(0);
      })
      .finally(() => setLoading(false));
  }, [currentPage, searchState.fromTitle, searchState.toTitle, searchState.departDate, selectedAirline, selectedStops]);

  const formattedDate = searchState.departDate
    ? new Date(searchState.departDate).toLocaleDateString("vi-VN", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : "Chưa chọn ngày";

  const sortedFlights = useMemo(() => {
    const result = [...flights];
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
  }, [activeSort, flights]);

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
              <button className="cfsr-sidebar__clear" onClick={() => navigateWithFilters({ soDiemDung: null, hangHangKhong: null })}>XÓA TẤT CẢ</button>
            </div>

            <div className="cfsr-sidebar__filters">
              {/* Filter 1 */}
              <div className="cfsr-sidebar__filter-card">
                <h3 className="cfsr-sidebar__filter-title">Số điểm dừng</h3>
                <div className="cfsr-sidebar__checkbox-list">
                  <button className="cfsr-sidebar__checkbox-label" onClick={() => navigateWithFilters({ soDiemDung: selectedStops === "0" ? null : 0 })}>
                    {selectedStops === "0" ? <div className="cfsr-sidebar__check-icon"><Check size={14} /></div> : <div className="cfsr-sidebar__uncheck-icon"></div>}
                    <span className="cfsr-sidebar__checkbox-text">Bay thẳng</span>
                  </button>
                  <button className="cfsr-sidebar__checkbox-label" onClick={() => navigateWithFilters({ soDiemDung: selectedStops === "1" ? null : 1 })}>
                    {selectedStops === "1" ? <div className="cfsr-sidebar__check-icon"><Check size={14} /></div> : <div className="cfsr-sidebar__uncheck-icon"></div>}
                    <span className="cfsr-sidebar__checkbox-text">1 Điểm dừng</span>
                  </button>
                </div>
              </div>

              {/* Filter 2 */}
              <div className="cfsr-sidebar__filter-card">
                <h3 className="cfsr-sidebar__filter-title">Hãng hàng không</h3>
                <div className="cfsr-sidebar__checkbox-list">
                  {["Vietnam Airlines", "VietJet Air", "Bamboo Airways"].map((airline) => (
                    <button
                      key={airline}
                      className="cfsr-sidebar__checkbox-label cfsr-sidebar__checkbox-label--between"
                      onClick={() => navigateWithFilters({ hangHangKhong: selectedAirline === airline ? null : airline })}
                    >
                      <div className="cfsr-sidebar__checkbox-inner">
                        {selectedAirline === airline ? <div className="cfsr-sidebar__check-icon"><Check size={14} /></div> : <div className="cfsr-sidebar__uncheck-icon"></div>}
                        <span className="cfsr-sidebar__checkbox-text">{airline}</span>
                      </div>
                    </button>
                  ))}
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
                Đang hiển thị <span className="cfsr-sort-bar__count-number">{pagination.from}-{pagination.to}</span> / {pagination.totalItems} chuyến bay
              </p>
              <div className="cfsr-sort-bar__controls">
                <span className="cfsr-sort-bar__label">SẮP XẾP THEO:</span>
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value as FlightSortKey)}
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
              {loading ? (
                <div className="cfsr-card">Đang tải chuyến bay...</div>
              ) : sortedFlights.length === 0 ? (
                <div className="cfsr-card">Không tìm thấy chuyến bay phù hợp.</div>
              ) : sortedFlights.map((flight) => (
                <div key={flight.id} className="cfsr-card">
                  {flight.promo && (
                    <div className="cfsr-card__promo">{flight.promo}</div>
                  )}
                  
                  <div className="cfsr-card__row">
                    {/* Airline */}
                    <div className="cfsr-card__airline">
                      <div className="cfsr-card__airline-info">
                        <div className="cfsr-card__airline-logo">
                           {flight.logo ? <img src={flight.logo} alt={flight.airline} /> : <PlaneTakeoff size={20} />}
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
                          {formatVnd(flight.originalPrice)}
                        </span>
                      )}
                      <span className="cfsr-card__price">
                        {formatVnd(flight.price)}
                      </span>
                      <button className="cfsr-card__book-btn" onClick={() => navigate(`/mua-sam/chi-tiet-chuyen-bay/${flight.id}`)}>Chọn</button>
                      <button className="cfsr-card__detail-link" onClick={() => navigate(`/mua-sam/chi-tiet-chuyen-bay/${flight.id}`)}>Chi tiết chuyến bay</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="cfsr-pagination">
              <button
                className={`cfsr-pagination__btn ${!pagination.hasPrev ? "cfsr-pagination__btn--disabled" : ""}`}
                disabled={!pagination.hasPrev}
                onClick={() => goToPage(pagination.currentPage - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              {getPageItems(pagination.currentPage, pagination.totalPages).map((item, index) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${index}`} className="cfsr-pagination__dots">...</span>
                ) : (
                  <button
                    key={item}
                    className={`cfsr-pagination__btn ${item === pagination.currentPage ? "cfsr-pagination__btn--active" : ""}`}
                    onClick={() => goToPage(item)}
                  >
                    {item}
                  </button>
                ),
              )}
              <button
                className={`cfsr-pagination__btn ${!pagination.hasNext ? "cfsr-pagination__btn--disabled" : ""}`}
                disabled={!pagination.hasNext}
                onClick={() => goToPage(pagination.currentPage + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
