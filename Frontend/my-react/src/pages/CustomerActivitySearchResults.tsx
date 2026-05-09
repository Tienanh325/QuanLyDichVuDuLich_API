import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/css/CustomerActivitySearchResults.css";
import {
  MapPin,
  Star,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckCircle2,
  Edit2
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
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "Phú Quốc";

  const [activeSort, setActiveSort] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [priceRange, setPriceRange] = useState(2500000);

  const sortedActivities = useMemo(() => {
    const result = [...ACTIVITY_RESULTS];
    if (activeSort === "price") {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (activeSort === "popular") {
      result.sort((a, b) => Number(b.reviews) - Number(a.reviews));
    }
    return result;
  }, [activeSort]);

  return (
    <div className="casr-page">
      <div className="casr-container">

        {/* STEP 1: Search Summary Bar */}
        <div className="casr-search-bar">
          <div className="casr-search-bar__fields">
            <div className="casr-search-bar__field">
              <span className="casr-search-bar__label">Điểm đến</span>
              <div className="casr-search-bar__value">
                <MapPin size={20} className="casr-search-bar__icon" />
                <span>{searchQuery}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/mua-sam/hoat-dong-vui-choi")}
            className="casr-search-bar__change-btn"
          >
            <Edit2 size={18} />
            Thay đổi
          </button>
        </div>

        {/* STEP 2: Main Layout Grid */}
        <div className="casr-layout">

          {/* STEP 3: Left Sidebar (Filters) */}
          <aside className="casr-sidebar">
            <div className="casr-sidebar__inner">

              {/* Header */}
              <div className="casr-sidebar__header">
                <span className="casr-sidebar__title">BỘ LỌC</span>
                <button className="casr-sidebar__reset">Đặt lại</button>
              </div>

              {/* Section 1 - Danh mục */}
              <div className="casr-sidebar__section">
                <h3 className="casr-sidebar__section-title">DANH MỤC</h3>
                <div className="casr-sidebar__checkbox-list">
                  <label className="casr-sidebar__checkbox-label">
                    <input type="checkbox" className="casr-sidebar__checkbox" defaultChecked />
                    <span className="casr-sidebar__checkbox-text--active">Tất cả</span>
                  </label>
                  <label className="casr-sidebar__checkbox-label">
                    <input type="checkbox" className="casr-sidebar__checkbox" />
                    <span className="casr-sidebar__checkbox-text">Tour</span>
                  </label>
                  <label className="casr-sidebar__checkbox-label">
                    <input type="checkbox" className="casr-sidebar__checkbox" />
                    <span className="casr-sidebar__checkbox-text">Công viên giải trí</span>
                  </label>
                  <label className="casr-sidebar__checkbox-label">
                    <input type="checkbox" className="casr-sidebar__checkbox" />
                    <span className="casr-sidebar__checkbox-text">Thể thao dưới nước</span>
                  </label>
                </div>
              </div>

              {/* Section 2 - Khoảng giá */}
              <div className="casr-sidebar__section">
                <h3 className="casr-sidebar__section-title">KHOẢNG GIÁ</h3>
                <div className="casr-sidebar__slider-wrap">
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="100000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="casr-sidebar__slider"
                  />
                  <div className="casr-sidebar__slider-labels">
                    <span>0đ</span>
                    <span className="casr-sidebar__slider-value">{priceRange.toLocaleString('vi-VN')}đ</span>
                    <span>5.000.000đ+</span>
                  </div>
                </div>
              </div>

              {/* Section 3 - Xếp hạng */}
              <div>
                <h3 className="casr-sidebar__section-title">XẾP HẠNG</h3>
                <div className="casr-sidebar__rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={22}
                      className={star <= 4 ? "casr-sidebar__rating-star--filled" : "casr-sidebar__rating-star--empty"}
                    />
                  ))}
                  <span className="casr-sidebar__rating-text">4+</span>
                </div>
              </div>

            </div>
          </aside>

          {/* Right Column (Results Area) */}
          <div className="casr-results">

            {/* STEP 4: Sort Bar & View Mode */}
            <div className="casr-sort-bar">
              <p className="casr-sort-bar__count">
                Đang hiển thị <span className="casr-sort-bar__count-number">{sortedActivities.length}</span> hoạt động
              </p>
              
              <div className="casr-sort-bar__controls">
                <span className="casr-sort-bar__label">SẮP XẾP THEO:</span>
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  className="casr-sort-bar__select"
                >
                  <option value="popular">Phổ biến nhất</option>
                  <option value="price">Giá thấp nhất</option>
                  <option value="price_desc">Giá cao nhất</option>
                </select>

                <div className="casr-sort-bar__view-toggle">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`casr-sort-bar__view-btn ${viewMode === 'grid' ? 'casr-sort-bar__view-btn--active' : ''}`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`casr-sort-bar__view-btn ${viewMode === 'list' ? 'casr-sort-bar__view-btn--active' : ''}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 5: Activity Cards */}
            <div className="casr-card-list">
              {sortedActivities.map((activity) => {
                const Icon = activity.highlightIcon;
                return (
                  <div key={activity.id} className="casr-card">

                    {/* Left Side (Image) */}
                    <div className="casr-card__image-wrap">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="casr-card__image"
                      />
                      <div className="casr-card__badge">
                        {activity.category}
                      </div>
                      {activity.isBestSeller && (
                        <div className="casr-card__badge--bestseller">
                          Bán chạy
                        </div>
                      )}
                    </div>

                    {/* Right Side (Content) */}
                    <div className="casr-card__content">
                      <div>
                        <div className="casr-card__header">
                          <div className="casr-card__header-left">
                            <h2 className="casr-card__title">
                              {activity.title}
                            </h2>
                            <div className="casr-card__location">
                              <MapPin size={14} className="casr-card__location-icon" />
                              {activity.location}, Việt Nam
                            </div>

                            <div className="casr-card__stars">
                              <div className="casr-card__stars-icons">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    size={14} 
                                    className={star <= Math.floor(activity.rating) ? "casr-card__star--filled" : "casr-card__star--empty"} 
                                  />
                                ))}
                              </div>
                              <span className="casr-card__rating-value">{activity.rating}</span>
                            </div>
                          </div>

                          <div>
                            <span className="casr-card__review-link">Chưa có đánh giá</span>
                          </div>
                        </div>

                        <div className="casr-card__highlight">
                          <Icon size={16} className="casr-card__highlight-icon" />
                          {activity.highlight}
                        </div>
                      </div>

                      {/* Bottom Right Pricing */}
                      <div className="casr-card__pricing">
                        <div className="casr-card__price-wrap">
                          {activity.originalPrice && (
                            <div className="casr-card__old-price">
                              {activity.originalPrice.toLocaleString('vi-VN')} VND
                            </div>
                          )}
                          <div className="casr-card__price">
                            {activity.price.toLocaleString('vi-VN')} VND
                          </div>
                        </div>
                        <button className="casr-card__book-btn">
                          Đặt ngay
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* STEP 6: Pagination */}
            <div className="casr-pagination">
              <button className="casr-pagination__btn casr-pagination__btn--disabled">
                <ChevronLeft size={20} />
              </button>

              <button className="casr-pagination__btn casr-pagination__btn--active">
                1
              </button>
              <button className="casr-pagination__btn">
                2
              </button>
              <button className="casr-pagination__btn">
                3
              </button>

              <span className="casr-pagination__dots">...</span>

              <button className="casr-pagination__btn">
                12
              </button>

              <button className="casr-pagination__btn">
                <ChevronRight size={20} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
