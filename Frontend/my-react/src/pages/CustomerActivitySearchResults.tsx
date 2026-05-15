import { useEffect, useMemo, useState } from "react";
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
import { getPublicTours, type TourListItem } from "../services/tourService";
import { clampPage, getPageItems, getPaginationState } from "../utils/pagination";
import { formatVnd } from "../utils/money";

type ActivityResult = {
  id: string;
  title: string;
  location: string;
  category: string;
  isBestSeller: boolean;
  rating: number;
  reviews: string;
  highlight: string;
  highlightIcon: typeof Zap;
  originalPrice: number | null;
  price: number;
  image: string;
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800";

function mapActivity(row: TourListItem): ActivityResult {
  return {
    id: String(row.maTour),
    title: row.tenTour || row.ten,
    location: row.diaDiem || row.viTri || "Việt Nam",
    category: row.thoiGian || "Tour",
    isBestSeller: Boolean(row.isBestSeller),
    rating: Number(row.diemDanhGia || 0),
    reviews: String(row.soLuotDanhGia || 0),
    highlight: row.highlight || (row.xacNhanTucThi ? "Xác nhận tức thì" : "Tour & hoạt động"),
    highlightIcon: row.xacNhanTucThi ? Zap : CheckCircle2,
    originalPrice: row.giaGoc,
    price: Number(row.giaKhuyenMai || row.giaTour || 0),
    image: row.avatar || PLACEHOLDER_IMAGE,
  };
}

export default function CustomerActivitySearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "Phú Quốc";
  const currentPage = clampPage(searchParams.get("page"));
  const pageSize = 5;
  const selectedCategory = searchParams.get("maDanhMuc") ?? "";
  const selectedMinRating = searchParams.get("minRating") ?? "";
  const bestSellerOnly = searchParams.get("isBestSeller") === "1";

  const [activeSort, setActiveSort] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [priceRange, setPriceRange] = useState(2500000);
  const [activities, setActivities] = useState<ActivityResult[]>([]);
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
    getPublicTours({
      search: searchQuery || undefined,
      page: currentPage,
      limit: pageSize,
      minPrice: 0,
      maxPrice: priceRange,
      maDanhMuc: selectedCategory ? Number(selectedCategory) : undefined,
      minRating: selectedMinRating ? Number(selectedMinRating) : undefined,
      isBestSeller: bestSellerOnly ? 1 : undefined,
    })
      .then((response) => {
        setActivities(response.data.map(mapActivity));
        setTotalRecords(response.totalRecords);
      })
      .catch(() => {
        setActivities([]);
        setTotalRecords(0);
      })
      .finally(() => setLoading(false));
  }, [bestSellerOnly, currentPage, priceRange, searchQuery, selectedCategory, selectedMinRating]);

  const sortedActivities = useMemo(() => {
    const result = [...activities];
    if (activeSort === "price") {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (activeSort === "popular") {
      result.sort((a, b) => Number(b.reviews) - Number(a.reviews));
    }
    return result;
  }, [activeSort, activities]);

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
                <button className="casr-sidebar__reset" onClick={() => navigateWithFilters({ maDanhMuc: null, minRating: null, isBestSeller: null })}>Đặt lại</button>
              </div>

              {/* Section 1 - Danh mục */}
              <div className="casr-sidebar__section">
                <h3 className="casr-sidebar__section-title">DANH MỤC</h3>
                <div className="casr-sidebar__checkbox-list">
                  <label className="casr-sidebar__checkbox-label">
                    <input type="checkbox" className="casr-sidebar__checkbox" checked={!selectedCategory} onChange={() => navigateWithFilters({ maDanhMuc: null })} />
                    <span className={!selectedCategory ? "casr-sidebar__checkbox-text--active" : "casr-sidebar__checkbox-text"}>Tất cả</span>
                  </label>
                  {[
                    [1, "Biển đảo"],
                    [2, "Núi rừng"],
                    [3, "Thành phố"],
                    [4, "Ẩm thực"],
                    [5, "Văn hóa"],
                  ].map(([id, label]) => (
                    <label key={id} className="casr-sidebar__checkbox-label">
                      <input
                        type="checkbox"
                        className="casr-sidebar__checkbox"
                        checked={selectedCategory === String(id)}
                        onChange={() => navigateWithFilters({ maDanhMuc: selectedCategory === String(id) ? null : id })}
                      />
                      <span className={selectedCategory === String(id) ? "casr-sidebar__checkbox-text--active" : "casr-sidebar__checkbox-text"}>{label}</span>
                    </label>
                  ))}
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
                    onMouseUp={() => navigateWithFilters({ maxPrice: priceRange })}
                    onTouchEnd={() => navigateWithFilters({ maxPrice: priceRange })}
                    className="casr-sidebar__slider"
                  />
                  <div className="casr-sidebar__slider-labels">
                    <span>0đ</span>
                    <span className="casr-sidebar__slider-value">{formatVnd(priceRange)}</span>
                    <span>5.000.000đ+</span>
                  </div>
                </div>
              </div>

              {/* Section 3 - Xếp hạng */}
              <div>
                <h3 className="casr-sidebar__section-title">XẾP HẠNG</h3>
                <div className="casr-sidebar__rating" onClick={() => navigateWithFilters({ minRating: selectedMinRating === "4" ? null : 4 })} style={{ cursor: "pointer" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={22}
                      className={star <= 4 ? "casr-sidebar__rating-star--filled" : "casr-sidebar__rating-star--empty"}
                    />
                  ))}
                  <span className="casr-sidebar__rating-text">4+</span>
                </div>
                <label className="casr-sidebar__checkbox-label" style={{ marginTop: 12 }}>
                  <input
                    type="checkbox"
                    className="casr-sidebar__checkbox"
                    checked={bestSellerOnly}
                    onChange={() => navigateWithFilters({ isBestSeller: bestSellerOnly ? null : 1 })}
                  />
                  <span className={bestSellerOnly ? "casr-sidebar__checkbox-text--active" : "casr-sidebar__checkbox-text"}>Bán chạy</span>
                </label>
              </div>

            </div>
          </aside>

          {/* Right Column (Results Area) */}
          <div className="casr-results">

            {/* STEP 4: Sort Bar & View Mode */}
            <div className="casr-sort-bar">
              <p className="casr-sort-bar__count">
                Đang hiển thị <span className="casr-sort-bar__count-number">{pagination.from}-{pagination.to}</span> / {pagination.totalItems} hoạt động
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
              {loading ? (
                <div className="casr-card">Đang tải hoạt động...</div>
              ) : sortedActivities.length === 0 ? (
                <div className="casr-card">Không tìm thấy hoạt động phù hợp.</div>
              ) : sortedActivities.map((activity) => {
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
                              {formatVnd(activity.originalPrice)}
                            </div>
                          )}
                          <div className="casr-card__price">
                            {formatVnd(activity.price)}
                          </div>
                        </div>
                        <button className="casr-card__book-btn" onClick={() => navigate(`/mua-sam/hoat-dong-vui-choi/${activity.id}`)}>
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
              <button
                className={`casr-pagination__btn ${!pagination.hasPrev ? "casr-pagination__btn--disabled" : ""}`}
                disabled={!pagination.hasPrev}
                onClick={() => goToPage(pagination.currentPage - 1)}
              >
                <ChevronLeft size={20} />
              </button>

              {getPageItems(pagination.currentPage, pagination.totalPages).map((item, index) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${index}`} className="casr-pagination__dots">...</span>
                ) : (
                  <button
                    key={item}
                    className={`casr-pagination__btn ${item === pagination.currentPage ? "casr-pagination__btn--active" : ""}`}
                    onClick={() => goToPage(item)}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                className={`casr-pagination__btn ${!pagination.hasNext ? "casr-pagination__btn--disabled" : ""}`}
                disabled={!pagination.hasNext}
                onClick={() => goToPage(pagination.currentPage + 1)}
              >
                <ChevronRight size={20} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
