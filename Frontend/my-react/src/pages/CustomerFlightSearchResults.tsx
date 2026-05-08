import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  User,
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
  const navigate = useNavigate();
  const [activeSort, setActiveSort] = useState("cheapest");

  const formattedDate = searchState.departDate 
    ? new Date(searchState.departDate).toLocaleDateString("vi-VN", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : "Chưa chọn ngày";

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-10">
      <div className="bg-[#003580] pt-6 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-6">Kết quả tìm kiếm chuyến bay</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 -mt-14 relative z-10">
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between mb-8">
          <div className="flex flex-1 items-center gap-8">
            {/* Section 1 */}
            <div className="flex-1 relative">
              <span className="text-xs text-gray-500 font-medium mb-1 block">TỪ</span>
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <PlaneTakeoff size={18} className="text-[#003580]" />
                {searchState.fromTitle || "SGN - TP HCM"}
              </div>
              
              {/* Middle Icon */}
              <button className="absolute -right-6 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 transition-colors p-2 rounded-full border border-white z-10">
                <ArrowRightLeft size={16} className="text-gray-600" />
              </button>
            </div>
            
            {/* Divider */}
            <div className="w-[1px] h-10 bg-gray-200"></div>

            {/* Section 2 */}
            <div className="flex-1 pl-4">
              <span className="text-xs text-gray-500 font-medium mb-1 block">ĐẾN</span>
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <PlaneLanding size={18} className="text-[#003580]" />
                {searchState.toTitle || "HAN - Hà Nội"}
              </div>
            </div>

            {/* Divider */}
            <div className="w-[1px] h-10 bg-gray-200"></div>

            {/* Section 3 */}
            <div className="flex-1">
              <span className="text-xs text-gray-500 font-medium mb-1 block">NGÀY ĐI</span>
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <Calendar size={18} className="text-[#003580]" />
                {formattedDate}
              </div>
            </div>

            {/* Divider */}
            <div className="w-[1px] h-10 bg-gray-200"></div>

            {/* Section 4 */}
            <div className="flex-1">
              <span className="text-xs text-gray-500 font-medium mb-1 block">HÀNH KHÁCH</span>
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <User size={18} className="text-[#003580]" />
                {searchState.passengers} Hành khách
              </div>
            </div>
          </div>

          <div className="ml-8">
            <button 
              onClick={onStartNewSearch}
              className="bg-[#0052b3] hover:bg-[#003580] text-white font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            >
              <Search size={16} />
              Đổi tìm kiếm
            </button>
          </div>
        </div>

        {/* STEP 3: Main Layout & Left Sidebar */}
        <div className="flex gap-6">
          <aside className="w-1/4 hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Filter size={20} className="text-[#003580]" />
                Bộ lọc
              </h2>
              <button className="text-sm font-bold text-[#0194f3] hover:text-[#0052b3]">XÓA TẤT CẢ</button>
            </div>

            <div className="space-y-4">
              {/* Filter 1: Số điểm dừng */}
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">Số điểm dừng</h3>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded bg-[#0194f3] text-white flex items-center justify-center">
                      <Check size={14} />
                    </div>
                    <span className="text-gray-700 font-medium">Bay thẳng</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-[#0194f3]"></div>
                    <span className="text-gray-700">1 Điểm dừng</span>
                  </label>
                </div>
              </div>

              {/* Filter 2: Hãng hàng không */}
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">Hãng hàng không</h3>
                <div className="space-y-3 text-sm">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded bg-[#0194f3] text-white flex items-center justify-center">
                        <Check size={14} />
                      </div>
                      <span className="text-gray-700 font-medium">Vietnam Airlines</span>
                    </div>
                    <span className="text-gray-500">Từ 1.2M</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded bg-[#0194f3] text-white flex items-center justify-center">
                        <Check size={14} />
                      </div>
                      <span className="text-gray-700 font-medium">VietJet Air</span>
                    </div>
                    <span className="text-gray-500">Từ 800K</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded bg-[#0194f3] text-white flex items-center justify-center">
                        <Check size={14} />
                      </div>
                      <span className="text-gray-700 font-medium">Bamboo Airways</span>
                    </div>
                    <span className="text-gray-500">Từ 1.1M</span>
                  </label>
                </div>
              </div>

              {/* Filter 3: Giờ khởi hành */}
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">Giờ khởi hành</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex flex-col items-center justify-center py-2 px-1 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-gray-600 transition-colors">
                    <Moon size={16} className="mb-1" />
                    <span className="text-xs font-medium">00:00 - 06:00</span>
                  </button>
                  <button className="flex flex-col items-center justify-center py-2 px-1 rounded-lg border-2 border-[#0194f3] bg-[#e8f4fd] text-[#0194f3] transition-colors">
                    <Sun size={16} className="mb-1" />
                    <span className="text-xs font-bold">06:00 - 12:00</span>
                  </button>
                  <button className="flex flex-col items-center justify-center py-2 px-1 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-gray-600 transition-colors">
                    <Sun size={16} className="mb-1" />
                    <span className="text-xs font-medium">12:00 - 18:00</span>
                  </button>
                  <button className="flex flex-col items-center justify-center py-2 px-1 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-gray-600 transition-colors">
                    <Moon size={16} className="mb-1" />
                    <span className="text-xs font-medium">18:00 - 24:00</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* STEP 4 & 5: Right Column Results */}
          <div className="flex-1">
            {/* STEP 4: Top Sort Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden mb-6">
              <button 
                onClick={() => setActiveSort('cheapest')}
                className={`flex-1 py-3 px-4 border-r border-gray-100 flex flex-col items-center justify-center transition-colors ${activeSort === 'cheapest' ? 'border-b-4 border-b-[#0194f3] bg-blue-50/50' : 'hover:bg-gray-50'}`}
              >
                <span className={`text-sm font-semibold mb-1 ${activeSort === 'cheapest' ? 'text-gray-800' : 'text-gray-600'}`}>Giá rẻ nhất</span>
                <span className={`text-sm font-bold ${activeSort === 'cheapest' ? 'text-[#0194f3]' : 'text-gray-400'}`}>850.000 VND</span>
              </button>
              <button 
                onClick={() => setActiveSort('shortest')}
                className={`flex-1 py-3 px-4 border-r border-gray-100 flex flex-col items-center justify-center transition-colors ${activeSort === 'shortest' ? 'border-b-4 border-b-[#0194f3] bg-blue-50/50' : 'hover:bg-gray-50'}`}
              >
                <span className={`text-sm font-semibold mb-1 ${activeSort === 'shortest' ? 'text-gray-800' : 'text-gray-600'}`}>Thời gian ngắn nhất</span>
                <span className={`text-sm font-bold ${activeSort === 'shortest' ? 'text-[#0194f3]' : 'text-gray-400'}`}>2h 05m</span>
              </button>
              <button 
                onClick={() => setActiveSort('earliest')}
                className={`flex-1 py-3 px-4 flex flex-col items-center justify-center transition-colors ${activeSort === 'earliest' ? 'border-b-4 border-b-[#0194f3] bg-blue-50/50' : 'hover:bg-gray-50'}`}
              >
                <span className={`text-sm font-semibold mb-1 ${activeSort === 'earliest' ? 'text-gray-800' : 'text-gray-600'}`}>Khởi hành sớm nhất</span>
                <span className={`text-sm font-bold ${activeSort === 'earliest' ? 'text-[#0194f3]' : 'text-gray-400'}`}>05:45</span>
              </button>
            </div>

            {/* STEP 5: Flight Result Cards */}
            <div className="space-y-4 mb-8">
              {FLIGHT_RESULTS.map((flight) => (
                <div key={flight.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow relative">
                  {flight.promo && (
                    <div className="absolute -top-3 right-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                      {flight.promo}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    {/* Left: Airline */}
                    <div className="w-1/4 flex flex-col items-start gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-100 bg-white p-1">
                           <img src={flight.logo} alt={flight.airline} className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="font-bold text-gray-800">{flight.airline}</span>
                      </div>
                    </div>

                    {/* Center: Timeline */}
                    <div className="w-2/5 flex items-center justify-center px-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">{flight.departTime}</div>
                        <div className="text-sm font-semibold text-gray-500">{flight.departStation}</div>
                      </div>
                      
                      <div className="flex-1 px-4 flex flex-col items-center relative">
                        <span className="text-xs text-gray-500 font-medium mb-1">{flight.duration}</span>
                        <div className="w-full border-t-2 border-gray-300 border-dashed relative">
                          <PlaneTakeoff size={14} className="text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium mt-1">{flight.stops}</span>
                      </div>

                      <div className="text-left">
                        <div className="text-lg font-bold text-gray-800">{flight.arriveTime}</div>
                        <div className="text-sm font-semibold text-gray-500">{flight.arriveStation}</div>
                      </div>
                    </div>

                    {/* Right: Pricing & CTA */}
                    <div className="w-[35%] flex flex-col items-end justify-center pl-4 border-l border-gray-100">
                      {flight.originalPrice && (
                        <span className="text-sm text-gray-400 line-through mb-1">
                          {flight.originalPrice.toLocaleString('vi-VN')} VND
                        </span>
                      )}
                      <span className="text-xl font-black text-[#ff5e1f] mb-3">
                        {flight.price.toLocaleString('vi-VN')} VND
                      </span>
                      <button className="bg-[#0194f3] hover:bg-[#007ce8] text-white font-bold py-2.5 px-8 rounded-lg transition-colors w-full">
                        Chọn
                      </button>
                      <button className="text-sm font-semibold text-[#0194f3] mt-3 hover:underline">
                        Chi tiết chuyến bay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* STEP 6: Pagination */}
            <div className="flex items-center justify-center gap-2 mb-10">
              <button className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-400 border border-gray-200 cursor-not-allowed">
                <ChevronLeft size={18} />
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white bg-[#0194f3]">
                1
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50">
                2
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50">
                3
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Minimal */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
             {/* Text-based logo to avoid relying on external assets */}
            <div className="text-2xl font-black text-[#0194f3] tracking-tight mb-2">traveloka</div>
            <p className="text-sm text-gray-500">© 2024 Traveloka. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-[#0194f3]">Về Traveloka</a>
            <a href="#" className="hover:text-[#0194f3]">Cách đặt chỗ</a>
            <a href="#" className="hover:text-[#0194f3]">Trợ giúp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
