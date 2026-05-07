import { 
  MapPin, 
  Search, 
  ChevronDown, 
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

const images = {
  hero: baibienImage,
  onsen: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80",
  vinwonders: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80",
  dalat: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
  food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  friends: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?auto=format&fit=crop&w=800&q=80"
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
        </div>
      </section>

      {/* SEARCH PANEL FLOATING */}
      <section className="ca-search">
        <div className="customer-shell__container">
          <div className="ca-search__panel">
            <div className="ca-search__field">
              <MapPin className="ca-search__field-icon" />
              <div className="ca-search__field-body">
                <label className="ca-search__label">Chọn địa điểm du lịch :</label>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm địa điểm hoặc hoạt động" 
                  className="ca-search__input"
                />
              </div>
              <ChevronDown className="ca-search__chevron" />
            </div>
            
            <button className="ca-search__btn">
              <Search />
              <span>Tìm kiếm</span>
            </button>
          </div>
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
            {recommended.map((item) => (
              <div key={item.id} className="ca-activity-card">
                <div className="ca-activity-card__media">
                  <img 
                    src={item.image} 
                    alt={item.title}
                  />
                  <span className={`ca-activity-card__badge ${item.badgeColor}`}>
                    <item.badgeIcon />
                    {item.badge}
                  </span>
                </div>
                
                <div className="ca-activity-card__body">
                  <div className="ca-activity-card__meta">
                    <span className="ca-activity-card__location">
                      <MapPin />
                      {item.location}
                    </span>
                    <button className="ca-activity-card__wishlist">
                      <Heart />
                    </button>
                  </div>
                  
                  <h3 className="ca-activity-card__title">{item.title}</h3>
                  
                  <div className="ca-activity-card__pricing">
                    <span className="ca-activity-card__old-price">{item.oldPrice} VND</span>
                    <div className="ca-activity-card__new-price">
                      <span>{item.newPrice}</span>
                      <span>VND</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
