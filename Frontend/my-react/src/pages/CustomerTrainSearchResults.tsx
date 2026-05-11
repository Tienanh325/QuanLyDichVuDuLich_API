import { useEffect, useMemo, useState } from "react";
import "../assets/css/CustomerTrainSearchResults.css";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, ChevronUp, Clock, Filter, Wifi, Wind, Utensils, SlidersHorizontal } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */
type SeatClass = "Ngồi mềm" | "Ngồi cứng" | "Nằm mềm" | "Nằm cứng";
type Operator = "SE" | "TN" | "SN";
type TimeSlot = "Sáng sớm" | "Buổi sáng" | "Buổi chiều" | "Buổi tối";

interface TrainTicket {
  id: string;
  trainCode: string;
  operator: Operator;
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  seatClass: SeatClass;
  price: number;
  seatsLeft: number;
  amenities: string[];
}

interface TrainFilters {
  seatClasses: SeatClass[];
  operators: Operator[];
  timeSlots: TimeSlot[];
}

/* ─── Mock API ───────────────────────────────────────────────── */
function fetchTrainResults(from: string, to: string, _date?: string): Promise<TrainTicket[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1", trainCode: "SE1", operator: "SE",
          from: from || "Hà Nội", to: to || "TP. HCM",
          departTime: "06:00", arriveTime: "30:00", duration: "30 giờ 00 phút",
          seatClass: "Nằm mềm", price: 850000, seatsLeft: 12,
          amenities: ["wifi", "food", "ac"],
        },
        {
          id: "2", trainCode: "SE3", operator: "SE",
          from: from || "Hà Nội", to: to || "TP. HCM",
          departTime: "19:30", arriveTime: "25:30", duration: "30 giờ 00 phút",
          seatClass: "Nằm mềm", price: 780000, seatsLeft: 5,
          amenities: ["ac", "food"],
        },
        {
          id: "3", trainCode: "TN5", operator: "TN",
          from: from || "Hà Nội", to: to || "TP. HCM",
          departTime: "09:00", arriveTime: "35:00", duration: "26 giờ 00 phút",
          seatClass: "Ngồi mềm", price: 450000, seatsLeft: 30,
          amenities: ["ac"],
        },
        {
          id: "4", trainCode: "SE5", operator: "SE",
          from: from || "Hà Nội", to: to || "TP. HCM",
          departTime: "14:00", arriveTime: "44:00", duration: "30 giờ 00 phút",
          seatClass: "Nằm cứng", price: 620000, seatsLeft: 18,
          amenities: ["food", "ac"],
        },
        {
          id: "5", trainCode: "SN1", operator: "SN",
          from: from || "Hà Nội", to: to || "TP. HCM",
          departTime: "22:00", arriveTime: "52:00", duration: "30 giờ 00 phút",
          seatClass: "Ngồi cứng", price: 320000, seatsLeft: 50,
          amenities: [],
        },
      ]);
    }, 900);
  });
}

const amenityIcons: Record<string, { icon: React.ElementType; label: string }> = {
  wifi: { icon: Wifi, label: "Wi-Fi" },
  food: { icon: Utensils, label: "Bữa ăn" },
  ac: { icon: Wind, label: "Điều hòa" },
};

const ALL_SEAT_CLASSES: SeatClass[] = ["Ngồi mềm", "Ngồi cứng", "Nằm mềm", "Nằm cứng"];
const ALL_OPERATORS: Operator[] = ["SE", "TN", "SN"];
const ALL_TIME_SLOTS: TimeSlot[] = ["Sáng sớm", "Buổi sáng", "Buổi chiều", "Buổi tối"];

type SortKey = "price_asc" | "price_desc" | "depart_asc" | "duration_asc" | "duration_desc";

function getTimeSlot(timeStr: string): TimeSlot {
  const [h] = timeStr.split(":").map(Number);
  if (h < 6) return "Sáng sớm";
  if (h < 12) return "Buổi sáng";
  if (h < 18) return "Buổi chiều";
  return "Buổi tối";
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function CustomerTrainSearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const fromCity = searchParams.get("from") || "Hà Nội";
  const toCity = searchParams.get("to") || "TP. HCM";
  const date = searchParams.get("date") || new Date().toISOString().slice(0, 10);

  const [tickets, setTickets] = useState<TrainTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TrainFilters>({ seatClasses: [], operators: [], timeSlots: [] });
  const [sortKey, setSortKey] = useState<SortKey>("price_asc");
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    seatClass: true, operator: true, time: true,
  });

  useEffect(() => {
    setLoading(true);
    fetchTrainResults(fromCity, toCity).then((data) => {
      setTickets(data);
      setLoading(false);
    });
  }, [fromCity, toCity, date]);

  function toggleFilter<T>(key: keyof TrainFilters, value: T) {
    setFilters((prev) => {
      const list = prev[key] as T[];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [key]: next };
    });
  }

  const displayedTickets = useMemo(() => {
    let result = [...tickets];
    if (filters.seatClasses.length > 0) result = result.filter((t) => filters.seatClasses.includes(t.seatClass));
    if (filters.operators.length > 0) result = result.filter((t) => filters.operators.includes(t.operator));
    if (filters.timeSlots.length > 0) result = result.filter((t) => filters.timeSlots.includes(getTimeSlot(t.departTime)));

    result.sort((a, b) => {
      if (sortKey === "price_asc") return a.price - b.price;
      if (sortKey === "price_desc") return b.price - a.price;
      if (sortKey === "duration_asc" || sortKey === "duration_desc") {
        const getMinutes = (d: string) => {
          const parts = d.match(/(\d+)h\s*(\d+)m/);
          if (!parts) return 0;
          return parseInt(parts[1]) * 60 + parseInt(parts[2]);
        };
        return sortKey === "duration_asc" ? getMinutes(a.duration) - getMinutes(b.duration) : getMinutes(b.duration) - getMinutes(a.duration);
      }
      return a.departTime.localeCompare(b.departTime);
    });
    return result;
  }, [tickets, filters, sortKey]);

  function toggleSection(key: string) {
    setExpandedFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const formattedDate = new Date(date).toLocaleDateString("vi-VN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="ctsr-page">
      {/* Summary Bar */}
      <div className="ctsr-summary-bar">
        <div className="ctsr-summary-bar__container">
          <div className="ctsr-summary-bar__inner">
            <div>
              <div className="ctsr-summary-bar__route">
                <span>{fromCity}</span>
                <ArrowRight size={20} className="ctsr-summary-bar__arrow" />
                <span>{toCity}</span>
              </div>
              <p className="ctsr-summary-bar__meta">{formattedDate} · {displayedTickets.length} chuyến tàu</p>
            </div>
            <button onClick={() => navigate("/mua-sam/ve-tau")} className="ctsr-summary-bar__change-btn">
              Đổi tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className="ctsr-main">
        <div className="ctsr-layout">
          {/* Sidebar */}
          <aside className="ctsr-sidebar">
            <div className="ctsr-sidebar__inner">
              <div className="ctsr-sidebar__header">
                <SlidersHorizontal size={18} className="ctsr-sidebar__header-icon" />
                <span className="ctsr-sidebar__header-text">Bộ lọc</span>
              </div>

              {/* Seat Class */}
              <div className="ctsr-sidebar__section">
                <button onClick={() => toggleSection("seatClass")} className="ctsr-sidebar__toggle">
                  Hạng ghế
                  {expandedFilters.seatClass ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedFilters.seatClass && (
                  <div className="ctsr-sidebar__filter-content">
                    {ALL_SEAT_CLASSES.map((cls) => (
                      <label key={cls} className="ctsr-sidebar__checkbox-label">
                        <input
                          type="checkbox"
                          checked={filters.seatClasses.includes(cls)}
                          onChange={() => toggleFilter<SeatClass>("seatClasses", cls)}
                          className="ctsr-sidebar__checkbox"
                        />
                        {cls}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Operator */}
              <div className="ctsr-sidebar__section">
                <button onClick={() => toggleSection("operator")} className="ctsr-sidebar__toggle">
                  Đơn vị vận chuyển
                  {expandedFilters.operator ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedFilters.operator && (
                  <div className="ctsr-sidebar__filter-content">
                    {ALL_OPERATORS.map((op) => (
                      <label key={op} className="ctsr-sidebar__checkbox-label">
                        <input
                          type="checkbox"
                          checked={filters.operators.includes(op)}
                          onChange={() => toggleFilter<Operator>("operators", op)}
                          className="ctsr-sidebar__checkbox"
                        />
                        {op === "SE" ? "Tàu Thống Nhất (SE)" : op === "TN" ? "Tàu Nhanh (TN)" : "Tàu Chậm (SN)"}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Time Slot */}
              <div className="ctsr-sidebar__section">
                <button onClick={() => toggleSection("time")} className="ctsr-sidebar__toggle">
                  Giờ khởi hành
                  {expandedFilters.time ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedFilters.time && (
                  <div className="ctsr-sidebar__time-grid">
                    {ALL_TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => toggleFilter<TimeSlot>("timeSlots", slot)}
                        className={`ctsr-sidebar__time-btn ${filters.timeSlots.includes(slot) ? "ctsr-sidebar__time-btn--active" : ""}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="ctsr-results">
            {/* Sort Bar */}
            <div className="ctsr-sort-bar">
              <p className="ctsr-sort-bar__count">
                Đang hiển thị <span className="ctsr-sort-bar__count-number">{displayedTickets.length}</span> chuyến tàu
              </p>
              <div className="ctsr-sort-bar__controls">
                <Filter size={16} className="ctsr-sort-bar__filter-icon" />
                <span className="ctsr-sort-bar__label">SẮP XẾP THEO:</span>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as any)}
                  className="ctsr-sort-bar__select"
                >
                  <option value="price_desc">Giá: Cao → Thấp</option>
                  <option value="price_asc">Giá: Thấp → Cao</option>
                  <option value="duration_asc">Thời gian: Ngắn nhất</option>
                  <option value="duration_desc">Thời gian: Dài nhất</option>
                </select>
              </div>
            </div>

            {/* Cards */}
            {loading ? (
              <div className="ctsr-card-list">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="ctsr-skeleton">
                    <div className="ctsr-skeleton__bar ctsr-skeleton__bar--w1-3" />
                    <div className="ctsr-skeleton__bar ctsr-skeleton__bar--w2-3" />
                    <div className="ctsr-skeleton__bar ctsr-skeleton__bar--w1-2" />
                  </div>
                ))}
              </div>
            ) : displayedTickets.length === 0 ? (
              <div className="ctsr-empty">
                <p className="ctsr-empty__icon">🚆</p>
                <h3 className="ctsr-empty__title">Không tìm thấy chuyến tàu</h3>
                <p className="ctsr-empty__desc">Hãy thử thay đổi bộ lọc hoặc điều kiện tìm kiếm.</p>
              </div>
            ) : (
              <div className="ctsr-card-list">
                {displayedTickets.map((ticket) => (
                  <TrainCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── TrainCard ──────────────────────────────────────────────── */
function TrainCard({ ticket }: { ticket: TrainTicket }) {
  return (
    <div className="ctsr-card">
      <div className="ctsr-card__body">
        {/* Top row */}
        <div className="ctsr-card__top">
          <div className="ctsr-card__top-left">
            <div className="ctsr-card__train-code">{ticket.trainCode}</div>
            <div>
              <span className="ctsr-card__seat-badge">{ticket.seatClass}</span>
              <p className="ctsr-card__seats-left">{ticket.seatsLeft} chỗ còn lại</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="ctsr-card__price">{formatPrice(ticket.price)}</p>
            <p className="ctsr-card__price-unit">/ người</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="ctsr-card__timeline">
          <div className="ctsr-card__time-point">
            <p className="ctsr-card__time">{ticket.departTime}</p>
            <p className="ctsr-card__station">{ticket.from}</p>
          </div>

          <div className="ctsr-card__duration-wrap">
            <div className="ctsr-card__duration-info">
              <Clock size={12} />
              <span>{ticket.duration}</span>
            </div>
            <div className="ctsr-card__duration-line">
              <div className="ctsr-card__dot-start" />
              <div className="ctsr-card__line" />
              <ArrowRight size={14} className="ctsr-card__arrow-icon" />
            </div>
          </div>

          <div className="ctsr-card__time-point">
            <p className="ctsr-card__time">{ticket.arriveTime.replace(/(\d+):/, (_, h) => `${parseInt(h) % 24}:`)}</p>
            <p className="ctsr-card__station">{ticket.to}</p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="ctsr-card__bottom">
          <div className="ctsr-card__amenities">
            {ticket.amenities.map((key) => {
              const a = amenityIcons[key];
              if (!a) return null;
              const Icon = a.icon;
              return (
                <span key={key} className="ctsr-card__amenity">
                  <Icon size={14} className="ctsr-card__amenity-icon" />
                  {a.label}
                </span>
              );
            })}
            {ticket.amenities.length === 0 && (
              <span className="ctsr-card__no-amenity">Không có tiện ích bổ sung</span>
            )}
          </div>
          <button className="ctsr-card__book-btn">Chọn vé</button>
        </div>
      </div>
    </div>
  );
}
