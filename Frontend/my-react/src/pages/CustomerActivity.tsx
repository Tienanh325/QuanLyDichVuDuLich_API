import { useState } from 'react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatVnd } from '../utils/money';
import { 
  MapPin, 
  Search, 
  Heart, 
  Flame, 
  Users, 
  TreePine, 
  Ticket,
  ChevronRight,
  ArrowRight,
  Tent,
  Sparkles,
  Scissors,
  Palette
} from 'lucide-react';

import baibienImage from "../assets/images/baibien.jpg";
import "../assets/css/CustomerActivity.css";
import { getPublicTours } from '../services/tourService';

const images = {
  hero: baibienImage,
  onsen: baibienImage,
  vinwonders: baibienImage,
  dalat: baibienImage,
  food: baibienImage,
  friends: baibienImage
};

type ActivityCardItem = {
  maTour?: number | string;
  id?: number | string;
  tenTour?: string | null;
  title?: string;
  diaDiem?: string | null;
  viTri?: string | null;
  location?: string;
  giaGoc?: number | null;
  oldPrice?: string;
  giaKhuyenMai?: number | null;
  giaTour?: number | null;
  newPrice?: string;
  avatar?: string | null;
  image?: string;
  badgeIcon?: ComponentType;
  isBestSeller?: boolean | number;
  badgeColor?: string;
  highlight?: string | null;
  badge?: string;
};

const categories = [
  { id: 1, name: "Công viên giải trí", icon: Tent, gradient: "from-blue-500 to-cyan-400" },
  { id: 2, name: "Tour du lịch", icon: Sparkles, gradient: "from-orange-500 to-pink-500" },
  { id: 3, name: "Làm đẹp & Spa", icon: Scissors, gradient: "from-purple-500 to-pink-400" },
  { id: 4, name: "Workshop", icon: Palette, gradient: "from-emerald-400 to-teal-500" }
];

const recommended = [
  {
    id: 1,
    title: "Onsen Nhật Bản",
    location: "Tokyo, Nhật Bản",
    oldPrice: "1.200.000",
    newPrice: "850.000",
    image: images.onsen,
    badge: "Bán chạy nhất",
    badgeIcon: Flame,
    badgeColor: "bg-orange-500"
  },
  {
    id: 2,
    title: "VinWonders Phú Quốc",
    location: "Phú Quốc, Việt Nam",
    oldPrice: "950.000",
    newPrice: "750.000",
    image: images.vinwonders,
    badge: "Gia đình",
    badgeIcon: Users,
    badgeColor: "bg-blue-500"
  },
  {
    id: 3,
    title: "Tour săn mây Đà Lạt",
    location: "Đà Lạt, Việt Nam",
    oldPrice: "550.000",
    newPrice: "400.000",
    image: images.dalat,
    badge: "Thiên nhiên",
    badgeIcon: TreePine,
    badgeColor: "bg-emerald-500"
  }
];

export default function CustomerActivity() {
  const [activitySearch, setActivitySearch] = useState("");
  const navigate = useNavigate();
  const { data: tourResponse } = useQuery({
    queryKey: ["activity-landing-tours"],
    queryFn: () => getPublicTours({ limit: 3 }),
  });
  const activityCards = tourResponse?.data ?? [];

  function handleSearch() {
    navigate(`/mua-sam/ket-qua-hoat-dong?q=${encodeURIComponent(activitySearch)}`);
  }

  return (
    <div className="ca-page">
      <section className="ca-hero">
        <div className="customer-shell__container">
          <div 
            className="ca-hero__inner"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(8, 24, 45, 0) 20%, rgba(8, 24, 45, 0.85) 100%), url(${baibienImage})`,
            }}
          >
            <div className="ca-hero__copy">
              <h1 className="ca-hero__title">
                Du lịch
              </h1>
              <p className="ca-hero__subtitle">
                Khám phá vé tham quan, tour, show diễn và tiện ích du lịch trong cùng một nơi.
              </p>
            </div>
          </div>

          {/* SEARCH PANEL FLOATING */}
          <section className="ca-search">
            <div className="ca-search__container">
              <div className="ca-search__fields">
                {/* Địa điểm */}
                <div className="ca-search__field-wrapper">
                  <label className="ca-search__field-label">CHỌN ĐỊA ĐIỂM DU LỊCH :</label>
                  <div className="ca-search__field">
                    <MapPin className="ca-search__field-icon" />
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm địa điểm hoặc hoạt động" 
                      className="ca-search__field-input"
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                    />
                  </div>
                </div>

                {/* Nút tìm kiếm */}
                <button className="ca-search__submit-btn" onClick={handleSearch}>
                  <Search size={24} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="ca-categories">
        <div className="customer-shell__container">
          <div className="ca-categories__header">
            <h3 className="ca-section-eyebrow">KHÁM PHÁ</h3>
            <h2 className="ca-section-title">Danh mục vui chơi</h2>
          </div>
          
          <div className="ca-categories__grid">
            {categories.map((cat) => (
              <div key={cat.id} className="ca-category-card">
                <div className={`ca-category-card__icon bg-gradient-to-br ${cat.gradient}`}>
                  <cat.icon />
                </div>
                <span className="ca-category-card__name">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOMMENDED SECTION */}
      <section className="ca-recommended">
        <div className="customer-shell__container">
          <div className="ca-recommended__header">
            <div className="ca-recommended__header-text">
              <h2>Đề xuất dành riêng cho bạn</h2>
              <p>Trải nghiệm những hoạt động được yêu thích nhất</p>
            </div>
            <a href="#" className="ca-recommended__more">
              Xem thêm <ChevronRight />
            </a>
          </div>

          <div className="ca-recommended__grid">
            {(activityCards.length > 0 ? activityCards : recommended).map((item: ActivityCardItem) => {
              const id = item.maTour ?? item.id;
              const title = item.tenTour ?? item.title;
              const location = item.diaDiem ?? item.viTri ?? item.location;
              const oldPrice = item.giaGoc ? formatVnd(item.giaGoc) : item.oldPrice;
              const newPrice = formatVnd(item.giaKhuyenMai ?? item.giaTour ?? String(item.newPrice).replace(/\D/g, ''));
              const image = item.avatar ?? item.image;
              const BadgeIcon = item.badgeIcon ?? (item.isBestSeller ? Flame : Ticket);
              return (
              <div key={id} className="ca-activity-card" onClick={() => navigate(`/mua-sam/hoat-dong-vui-choi/${id}`)} style={{ cursor: 'pointer' }}>
                <div className="ca-activity-card__media">
                  <img src={image} alt={title} />
                  <span className={`ca-activity-card__badge ${item.badgeColor ?? 'bg-blue-500'}`}>
                    <BadgeIcon />
                    {item.highlight ?? item.badge ?? 'Tour'}
                  </span>
                </div>

                <div className="ca-activity-card__body">
                  <div className="ca-activity-card__meta">
                    <span className="ca-activity-card__location"><MapPin />{location}</span>
                    <button className="ca-activity-card__wishlist" onClick={(event) => event.stopPropagation()}><Heart /></button>
                  </div>
                  <h3 className="ca-activity-card__title">{title}</h3>
                  <div className="ca-activity-card__pricing">
                    {oldPrice ? <span className="ca-activity-card__old-price">{oldPrice}</span> : null}
                    <div className="ca-activity-card__new-price"><span>{newPrice}</span></div>
                  </div>
                </div>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* PROMOTION SECTION */}
      <section className="ca-promotions">
        <div className="customer-shell__container">
          <h2 className="ca-promotions__eyebrow">
            ƯU ĐÃI ĐỘC QUYỀN
          </h2>
          
          <div className="ca-promotions__grid">
            {/* Banner Trái */}
            <div className="ca-promo-banner ca-promo-banner--blue">
              <Ticket className="ca-promo-banner__icon-bg" />
              
              <div className="ca-promo-banner__content">
                <span className="ca-promo-banner__tag">VOUCHER 20%</span>
                <h3 className="ca-promo-banner__title">Siêu sale mùa hè</h3>
                <p className="ca-promo-banner__desc">Giảm ngay cho tất cả vé tham quan và công viên.</p>
              </div>
              
              <button className="ca-promo-banner__btn">
                Lấy mã ngay
              </button>
            </div>

            {/* Banner Phải */}
            <div className="ca-promo-banner ca-promo-banner--orange">
              <Sparkles className="ca-promo-banner__icon-bg" />
              
              <div className="ca-promo-banner__content">
                <span className="ca-promo-banner__tag">DEAL CUỐI TUẦN</span>
                <h3 className="ca-promo-banner__title">Cuối tuần xả hơi</h3>
                <p className="ca-promo-banner__desc">Cùng gia đình tận hưởng tour nghỉ dưỡng ngắn ngày.</p>
              </div>
              
              <button className="ca-promo-banner__btn">
                Xem chi tiết <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="ca-newsletter">
        <div className="customer-shell__container">
          <div className="ca-newsletter__inner">
            
            <div className="ca-newsletter__copy">
              <h2 className="ca-newsletter__title">
                Đăng ký để nhận ưu đãi sớm nhất
              </h2>
              <p className="ca-newsletter__desc">
                Để lại email để không bỏ lỡ những deal du lịch tốt nhất từ hệ thống của chúng tôi.
              </p>
              
              <div className="ca-newsletter__form">
                <input 
                  type="email" 
                  placeholder="Nhập địa chỉ email của bạn"
                  className="ca-newsletter__email"
                />
                <button className="ca-newsletter__submit">
                  Đăng ký
                </button>
              </div>
            </div>

            <div className="ca-newsletter__images">
              <div className="ca-newsletter__img-wrap ca-newsletter__img-wrap--top">
                <img src={images.food} alt="Lifestyle" />
              </div>
              <div className="ca-newsletter__img-wrap ca-newsletter__img-wrap--bottom">
                <img src={images.friends} alt="Travel" />
              </div>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}
