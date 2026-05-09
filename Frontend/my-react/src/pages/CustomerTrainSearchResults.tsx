import { useEffect, useMemo, useState } from "react";
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
function fetchTrainResults(from: string, to: string, date: string): Promise<TrainTicket[]> {
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

type SortKey = "price_asc" | "price_desc" | "depart_asc";

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
    fetchTrainResults(fromCity, toCity, date).then((data) => {
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

    if (filters.seatClasses.length > 0) {
      result = result.filter((t) => filters.seatClasses.includes(t.seatClass));
    }
    if (filters.operators.length > 0) {
      result = result.filter((t) => filters.operators.includes(t.operator));
    }
    if (filters.timeSlots.length > 0) {
      result = result.filter((t) => filters.timeSlots.includes(getTimeSlot(t.departTime)));
    }

    result.sort((a, b) => {
      if (sortKey === "price_asc") return a.price - b.price;
      if (sortKey === "price_desc") return b.price - a.price;
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
    <div className="min-h-screen bg-gray-50 pt-[120px]">
      {/* ── Top Summary Bar ──────────────────────────────────────── */}
      <div className="bg-[#003580] text-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div>
              <div className="flex items-center gap-3 text-xl font-bold">
                <span>{fromCity}</span>
                <ArrowRight size={20} className="text-orange-400" />
                <span>{toCity}</span>
              </div>
              <p className="text-blue-200 text-sm mt-1">{formattedDate} · {displayedTickets.length} chuyến tàu</p>
            </div>
            <button
              onClick={() => navigate("/mua-sam/ve-tau")}
              className="bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
            >
              Đổi tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          {/* ── Sidebar Filters ──────────────────────────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <SlidersHorizontal size={18} className="text-[#003580]" />
                <span className="font-bold text-gray-800">Bộ lọc</span>
              </div>

              {/* Seat Class */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection("seatClass")}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Hạng ghế
                  {expandedFilters.seatClass ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedFilters.seatClass && (
                  <div className="px-5 pb-4 space-y-2">
                    {ALL_SEAT_CLASSES.map((cls) => (
                      <label key={cls} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={filters.seatClasses.includes(cls)}
                          onChange={() => toggleFilter<SeatClass>("seatClasses", cls)}
                          className="accent-orange-500 w-4 h-4 rounded"
                        />
                        {cls}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Operator */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection("operator")}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Đơn vị vận chuyển
                  {expandedFilters.operator ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedFilters.operator && (
                  <div className="px-5 pb-4 space-y-2">
                    {ALL_OPERATORS.map((op) => (
                      <label key={op} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={filters.operators.includes(op)}
                          onChange={() => toggleFilter<Operator>("operators", op)}
                          className="accent-orange-500 w-4 h-4 rounded"
                        />
                        {op === "SE" ? "Tàu Thống Nhất (SE)" : op === "TN" ? "Tàu Nhanh (TN)" : "Tàu Chậm (SN)"}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Time Slot */}
              <div>
                <button
                  onClick={() => toggleSection("time")}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Giờ khởi hành
                  {expandedFilters.time ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedFilters.time && (
                  <div className="px-5 pb-4 grid grid-cols-2 gap-2">
                    {ALL_TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => toggleFilter<TimeSlot>("timeSlots", slot)}
                        className={`text-xs px-2 py-2 rounded-lg border font-medium transition-all ${
                          filters.timeSlots.includes(slot)
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-400"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* ── Results List ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Hiển thị <strong className="text-gray-800">{displayedTickets.length}</strong> chuyến tàu
              </p>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400 lg:hidden" />
                <label className="text-sm text-gray-500">Sắp xếp:</label>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="price_asc">Giá: Thấp → Cao</option>
                  <option value="price_desc">Giá: Cao → Thấp</option>
                  <option value="depart_asc">Giờ khởi hành sớm nhất</option>
                </select>
              </div>
            </div>

            {/* Cards */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : displayedTickets.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <p className="text-5xl mb-4">🚆</p>
                <h3 className="font-bold text-gray-700 text-lg mb-2">Không tìm thấy chuyến tàu</h3>
                <p className="text-gray-500 text-sm">Hãy thử thay đổi bộ lọc hoặc điều kiện tìm kiếm.</p>
              </div>
            ) : (
              <div className="space-y-4">
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        {/* Top row */}
        <div className="flex flex-wrap items-start gap-4 justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#003580] text-white font-bold text-lg px-4 py-2 rounded-xl">
              {ticket.trainCode}
            </div>
            <div>
              <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                {ticket.seatClass}
              </span>
              <p className="text-xs text-gray-400 mt-1">{ticket.seatsLeft} chỗ còn lại</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-orange-500">{formatPrice(ticket.price)}</p>
            <p className="text-xs text-gray-400">/ người</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{ticket.departTime}</p>
            <p className="text-sm text-gray-500 mt-0.5">{ticket.from}</p>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
              <Clock size={12} />
              <span>{ticket.duration}</span>
            </div>
            <div className="w-full flex items-center">
              <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
              <div className="flex-1 h-px bg-gradient-to-r from-orange-400 to-blue-400 mx-1" />
              <ArrowRight size={14} className="text-blue-500 flex-shrink-0" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{ticket.arriveTime.replace(/(\d+):/, (_, h) => `${parseInt(h) % 24}:`)}</p>
            <p className="text-sm text-gray-500 mt-0.5">{ticket.to}</p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {ticket.amenities.map((key) => {
              const a = amenityIcons[key];
              if (!a) return null;
              const Icon = a.icon;
              return (
                <span key={key} className="flex items-center gap-1 text-xs text-gray-500">
                  <Icon size={14} className="text-blue-500" />
                  {a.label}
                </span>
              );
            })}
            {ticket.amenities.length === 0 && (
              <span className="text-xs text-gray-400 italic">Không có tiện ích bổ sung</span>
            )}
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
            Chọn vé
          </button>
        </div>
      </div>
    </div>
  );
}
