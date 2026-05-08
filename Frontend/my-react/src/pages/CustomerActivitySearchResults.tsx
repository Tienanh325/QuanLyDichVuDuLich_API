import { useState } from "react";
import { 
  MapPin, 
  Star, 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  CheckCircle2
} from "lucide-react";

// --- Mock Data ---
const ACTIVITY_RESULTS = [
  {
    id: "a1",
    title: "Vé VinWonders Phú Quốc - Công viên chủ đề lớn nhất Việt Nam",
    location: "Gành Dầu",
    category: "Công viên giải trí",
    isBestSeller: true,
    rating: 4.8,
    reviews: "2.4k",
    highlight: "Xác nhận tức thì",
    highlightIcon: Zap,
    originalPrice: 950000,
    price: 880000,
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "a2",
    title: "Tour Đảo Ngọc Phú Quốc: Lặn ngắm san hô & Câu cá (Bao ăn trưa)",
    location: "An Thới",
    category: "Tour đảo",
    isBestSeller: false,
    rating: 4.9,
    reviews: "1.2k",
    highlight: "Tour 1 ngày",
    highlightIcon: CheckCircle2,
    originalPrice: 1200000,
    price: 950000,
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "a3",
    title: "Vé cáp treo Hòn Thơm & Công viên nước Aquatopia Phú Quốc",
    location: "Hòn Thơm",
    category: "Tham quan",
    isBestSeller: true,
    rating: 4.7,
    reviews: "3.5k",
    highlight: "Xác nhận tức thì",
    highlightIcon: Zap,
    originalPrice: 600000,
    price: 540000,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "a4",
    title: "Trải nghiệm Tắm bùn Galina Phú Quốc Mudbath & Spa",
    location: "Dương Đông",
    category: "Spa & Làm đẹp",
    isBestSeller: false,
    rating: 4.6,
    reviews: "850",
    highlight: "Hủy miễn phí",
    highlightIcon: CheckCircle2,
    originalPrice: null,
    price: 420000,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800"
  }
];

export default function CustomerActivitySearchResults() {
  const [activeSort, setActiveSort] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [priceRange, setPriceRange] = useState(2500000);

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* STEP 1: Page Title Area */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#003580] mb-2 tracking-tight">Hoạt động tại Phú Quốc</h1>
          <div className="flex items-center text-gray-500 font-medium">
            <MapPin size={16} className="mr-1.5" />
            Kiên Giang, Việt Nam &bull; 142 hoạt động tìm thấy
          </div>
        </div>

        {/* STEP 2: Main Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* STEP 3: Left Sidebar (Filters) */}
          <aside className="w-full lg:w-1/4 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <span className="font-bold text-gray-800 tracking-wide">BỘ LỌC</span>
                <button className="text-sm font-semibold text-[#0194f3] hover:text-[#0052b3] transition-colors">
                  Đặt lại
                </button>
              </div>

              {/* Section 1 - Danh mục */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">DANH MỤC</h3>
                <div className="space-y-3 text-sm">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 accent-[#0194f3] rounded border-gray-300" defaultChecked />
                    <span className="text-[#0194f3] font-semibold">Tất cả</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 accent-[#0194f3] rounded border-gray-300" />
                    <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Tour</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 accent-[#0194f3] rounded border-gray-300" />
                    <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Công viên giải trí</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 accent-[#0194f3] rounded border-gray-300" />
                    <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Thể thao dưới nước</span>
                  </label>
                </div>
              </div>

              {/* Section 2 - Khoảng giá */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">KHOẢNG GIÁ</h3>
                <div className="px-1">
                  <input 
                    type="range" 
                    min="0" 
                    max="5000000" 
                    step="100000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0194f3]"
                  />
                  <div className="flex items-center justify-between mt-3 text-xs font-semibold text-gray-500">
                    <span>0đ</span>
                    <span className="text-[#0194f3] font-bold">{priceRange.toLocaleString('vi-VN')}đ</span>
                    <span>5.000.000đ+</span>
                  </div>
                </div>
              </div>

              {/* Section 3 - Xếp hạng */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm">XẾP HẠNG</h3>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={22} 
                      className={star <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                    />
                  ))}
                  <span className="ml-2 font-bold text-gray-700 text-sm">4+</span>
                </div>
              </div>

            </div>
          </aside>

          {/* Right Column (Results Area) */}
          <div className="w-full lg:w-3/4 flex flex-col">
            
            {/* STEP 4: Right Column - Top Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveSort('popular')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    activeSort === 'popular' 
                      ? 'bg-white border border-gray-200 text-gray-800 shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  Phổ biến nhất
                </button>
                <button 
                  onClick={() => setActiveSort('price')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    activeSort === 'price' 
                      ? 'bg-white border border-gray-200 text-gray-800 shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  Giá thấp nhất
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-50 text-[#0194f3]' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-50 text-[#0194f3]' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* STEP 5: Right Column - Activity Cards (List View) */}
            <div className="space-y-5 mb-10 flex-1">
              {ACTIVITY_RESULTS.map((activity) => {
                const Icon = activity.highlightIcon;
                return (
                  <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow group h-auto md:h-56">
                    
                    {/* Left Side (Image) */}
                    <div className="w-full md:w-[35%] relative h-48 md:h-full flex-shrink-0">
                      <img 
                        src={activity.image} 
                        alt={activity.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {activity.category}
                      </div>
                      {activity.isBestSeller && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                          Bán chạy
                        </div>
                      )}
                    </div>

                    {/* Right Side (Content) */}
                    <div className="flex-1 p-5 flex flex-col justify-between relative">
                      
                      {/* Top Content */}
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-tight mb-2 hover:text-[#0194f3] transition-colors cursor-pointer line-clamp-2">
                          {activity.title}
                        </h2>
                        
                        <div className="flex items-center gap-1.5 mb-3">
                          <Star size={16} className="fill-amber-400 text-amber-400" />
                          <span className="font-bold text-gray-800 text-sm">{activity.rating}</span>
                          <span className="text-gray-400 text-sm">({activity.reviews} đánh giá)</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                          <Icon size={16} className="text-[#0194f3]" />
                          {activity.highlight}
                        </div>
                      </div>

                      {/* Bottom Right Pricing */}
                      <div className="mt-4 md:mt-0 flex flex-col md:items-end justify-end self-end w-full md:w-auto">
                        <div className="text-right mb-3">
                          {activity.originalPrice && (
                            <div className="text-sm text-gray-400 line-through mb-0.5">
                              {activity.originalPrice.toLocaleString('vi-VN')} VND
                            </div>
                          )}
                          <div className="text-2xl font-black text-[#0194f3]">
                            {activity.price.toLocaleString('vi-VN')} VND
                          </div>
                        </div>
                        <button className="w-full md:w-auto bg-[#0194f3] hover:bg-[#007ce8] text-white font-bold py-2.5 px-8 rounded-lg transition-colors">
                          Đặt ngay
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* STEP 6: Pagination */}
            <div className="flex items-center justify-center gap-1.5 mt-auto">
              <button className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-400 border border-gray-200 cursor-not-allowed hover:bg-gray-50 transition-colors">
                <ChevronLeft size={20} />
              </button>
              
              <button className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white bg-[#0194f3] shadow-sm">
                1
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                3
              </button>
              
              <span className="w-10 h-10 flex items-center justify-center text-gray-400 font-bold">...</span>
              
              <button className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                12
              </button>
              
              <button className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
