import { useState } from "react";
import type { CSSProperties } from "react";
import {
  ChevronRight,
  Copy,
  Gift,
  Grid2x2,
  Landmark,
  MapPinned,
  Newspaper,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrainFront,
  Waves,
} from "lucide-react";
import baibienImage from "../assets/images/baibien.jpg";
import "../assets/css/CustomerActivity.css";

type CardItem = {
  title: string;
  location: string;
  price: string;
  image: string;
  badge?: string;
  meta?: string;
  oldPrice?: string;
};

type BannerItem = {
  title: string;
  subtitle: string;
  badge: string;
  image: string;
};

type ArticleItem = {
  title: string;
  meta: string;
  source: string;
  image: string;
};

type RecommendationColumn = {
  title: string;
  image: string;
  items: Array<{ title: string; meta: string; price: string; image: string }>;
};

const images = {
  sea: baibienImage,
  city: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
  temple: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
  mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  cruise: "https://images.unsplash.com/photo-1518623380242-d9924f1c0f0b?auto=format&fit=crop&w=1200&q=80",
  night: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  aquarium: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?auto=format&fit=crop&w=1200&q=80",
  transit: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
  mobile: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
} as const;

const heroDestinations = ["Chọn một điểm đến", "TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Phú Quốc", "Singapore"];
const quickLinks = [
  { id: "kham-pha", label: "Khám phá", icon: Sparkles },
  { id: "diem-tham-quan", label: "Điểm tham quan", icon: Landmark },
  { id: "tour-hoat-dong", label: "Tour & Hoạt động", icon: Waves },
  { id: "can-thiet", label: "Cần thiết cho du lịch", icon: ShieldCheck },
  { id: "tat-ca-hoat-dong", label: "Tất cả các hoạt động", icon: Grid2x2 },
] as const;
const couponTabs = ["Mã nội địa", "Mã quốc tế", "Du thuyền", "Thanh toán"];
const packageTabs = ["Thái Lan - Malaysia - Singapore", "Hàn Quốc - Nhật Bản - Đài Loan - Trung Quốc"];
const domesticTabs = ["Phú Quốc", "Nha Trang", "Đà Nẵng", "Đà Lạt", "Ninh Bình-Hạ Long", "Sa Pa-Hà Giang"];
const internationalTabs = ["Thái Lan", "Malaysia", "Bali", "Trung Quốc", "Đài Loan", "Úc", "Hàn Quốc", "Nhật Bản", "Pháp", "Mỹ"];

const couponCards = [
  { title: "[VINWONDERS] Giảm đến 2 triệu", description: "Giảm thêm đến 500K khi mua từ 2 triệu cho hoạt động nội địa.", code: "VINWONDERS26", badge: "Sắp hết mã" },
  { title: "Giảm đến 2 triệu | Sun World", description: "Ưu đãi cho nhóm bạn và gia đình vào dịp lễ, áp dụng toàn quốc.", code: "SUNWORLD", badge: "Sắp hết mã" },
  { title: "Giảm đến 300K | Vé vui chơi nội địa", description: "Đặt tối thiểu 2 triệu hoặc từ 6 vé để nhận mức giảm tốt hơn.", code: "VUILENVN", badge: "Hết mã" },
] as const;

const packageCards: CardItem[] = [
  { title: "Tour Thái Lan trọn gói (Bangkok, Pattaya) - 5N4Đ", location: "Đường Khao San", meta: "9.3/10 • 6,6K đánh giá", price: "7.990.000 VND", image: images.temple, badge: "Đường Khao San" },
  { title: "Tour Singapore và Malaysia trọn gói (Gardens by the Bay, Tháp đôi)", location: "Singapore", meta: "9.0/10 • 71 đánh giá", price: "12.690.000 VND", image: images.city, badge: "Singapore" },
];

const cruiseCards: CardItem[] = [
  { title: "Du thuyền Singapore 4N3Đ trên tàu Disney Adventure", location: "Vịnh Marina", meta: "9.7/10 • 11 đánh giá", price: "11.588.283 VND", image: images.cruise, badge: "Vịnh Marina" },
  { title: "Du thuyền Singapore 5N4Đ trên tàu Disney Adventure", location: "Vịnh Marina", meta: "8.8/10 • 21 đánh giá", price: "11.776.943 VND", image: images.night, badge: "Vịnh Marina" },
  { title: "Hành trình 3N2Đ trên du thuyền Genting Dream", location: "Singapore", meta: "8.8/10 • 26 đánh giá", price: "3.029.100 VND", image: images.city, badge: "Singapore" },
  { title: "Hành trình 4N3Đ trên du thuyền Genting Dream", location: "Singapore", meta: "9.6/10 • 19 đánh giá", price: "4.635.840 VND", image: images.sea, badge: "Singapore" },
];

const promoCards: BannerItem[] = [
  { title: "Mừng đại lễ, sale mê say", subtitle: "Mã giảm đến 2 triệu cho hoạt động biển và vui chơi gia đình.", badge: "Ưu đãi khủng tới 50%", image: images.sea },
  { title: "Du lịch Hàn Quốc", subtitle: "Sống trọn K-culture cùng deal tham quan và city pass tới 50%.", badge: "Traveloka Exclusive", image: images.night },
  { title: "Du lịch Malaysia", subtitle: "Khóa deal quốc tế giảm đến 50% cho dịp cao điểm tháng 4.", badge: "Đặt sớm lợi hơn", image: images.city },
];

const domesticCards: CardItem[] = [
  { title: "Khám phá 2 đảo, Sun World Hòn Thơm, bữa trưa buffet", location: "Xã Cửa Dương", meta: "8.8/10 • 42 đánh giá", oldPrice: "1.404.000 VND", price: "1.314.286 VND", image: images.sea, badge: "Xã Cửa Dương" },
  { title: "Tour 3 đảo bằng cano Nam Phú Quốc - 1 ngày", location: "Thị trấn Dương Đông", meta: "9.2/10 • 28 đánh giá", price: "722.222 VND", image: images.sea, badge: "Thị trấn Dương Đông" },
  { title: "Tour ngắm hoàng hôn và câu mực đêm trên đảo Phú Quốc", location: "Thị trấn Dương Đông", meta: "8.9/10 • 31 đánh giá", oldPrice: "388.889 VND", price: "275.132 VND", image: images.night, badge: "Thị trấn Dương Đông" },
  { title: "Tour khám phá 3 đảo bằng tàu tại Phú Quốc - 1 ngày", location: "Xã Hòn Thơm", meta: "8.6/10 • 17 đánh giá", oldPrice: "888.889 VND", price: "656.085 VND", image: images.cruise, badge: "Xã Hòn Thơm" },
  { title: "Khám phá 3 đảo Phú Quốc - tour 1 ngày của Rooty Trip", location: "Thị trấn Dương Đông", meta: "9.1/10 • 19 đánh giá", price: "540.000 VND", image: images.mountain, badge: "Thị trấn Dương Đông" },
];

const internationalCards: CardItem[] = [
  { title: "Tour trong ngày khám phá Phi Phi, Vịnh Maya, Đầm Pileh", location: "Cape Panwa", meta: "8.8/10 • 5,8K đánh giá", oldPrice: "2.820.732 VND", price: "1.611.847 VND", image: images.sea, badge: "Cape Panwa" },
  { title: "Quán cà phê nổi Tappia Pattaya", location: "Nam Pattaya", meta: "7.5/10 • 275 đánh giá", price: "322.978 VND", image: images.sea, badge: "Nam Pattaya" },
  { title: "Join tour VIP full day trip đến Phi Phi Island - Maya Bay", location: "Khlong Klua", meta: "8.8/10 • 65 đánh giá", price: "2.981.917 VND", image: images.sea, badge: "Khlong Klua" },
  { title: "Vé vào cửa công viên Tiger Park Pattaya", location: "Bãi biển Jomtien", meta: "8.6/10 • 16,3K đánh giá", price: "395.684 VND", image: images.mountain, badge: "Bãi biển Jomtien" },
  { title: "Phang Nga Bay sea cave canoeing và James Bond Island", location: "Ao Por", meta: "10.0/10 • 4 đánh giá", oldPrice: "1.610.235 VND", price: "1.288.672 VND", image: images.mountain, badge: "Ao Por" },
];

const essentialCards: CardItem[] = [
  { title: "Philippines eSIM by Xplori", location: "Đông Nam Á", meta: "10.0/10 • 8 đánh giá", price: "13.942 VND", image: images.mobile, badge: "Đông Nam Á" },
  { title: "eSIM 4G GoHub dùng tại Dubai (UAE)", location: "Dubai", meta: "4.0/10 • 1 đánh giá", price: "134.823 VND", image: images.mobile, badge: "Dubai" },
  { title: "eSIM for Singapore by Frewie", location: "Singapore", meta: "8.6/10 • 9 đánh giá", price: "140.217 VND", image: images.mobile, badge: "Singapore" },
  { title: "eSIM 4G GoHub dùng tại Thái Lan", location: "Đường Khao San", meta: "9.2/10 • 625 đánh giá", price: "27.108 VND", image: images.mobile, badge: "Đường Khao San" },
  { title: "eSIM Malaysia của Xplori", location: "Kuala Lipis", meta: "8.6/10 • 144 đánh giá", price: "16.046 VND", image: images.mobile, badge: "Kuala Lipis" },
];

const partners = [
  { name: "VinWonders", caption: "Thiên đường vui chơi", accent: "is-orange" },
  { name: "Sun World", caption: "Công viên giải trí", accent: "is-red" },
  { name: "Universal Studios", caption: "Trải nghiệm điện ảnh", accent: "is-blue" },
  { name: "LEGOLAND", caption: "Thế giới lego", accent: "is-yellow" },
  { name: "Disneyland", caption: "Biểu tượng giải trí", accent: "is-gold" },
  { name: "GoHub", caption: "eSIM & data", accent: "is-cyan" },
  { name: "SST Travel", caption: "Tour quốc tế", accent: "is-pink" },
  { name: "Sim2Go", caption: "SIM du lịch", accent: "is-lime" },
] as const;

const transportCards: CardItem[] = [
  { title: "The Vietage của Anantara", location: "Tam Thuận", price: "14.100.000 VND", image: images.night, badge: "Tam Thuận" },
  { title: "Xe riêng Đà Lạt - Cam Ranh", location: "Phường 9", price: "1.905.996 VND", image: images.city, badge: "Phường 9" },
  { title: "Dịch vụ Fast-Track sân bay kèm ưu tiên đưa đón", location: "Phường 15", meta: "8.6/10 • 3 đánh giá", price: "833.762 VND", image: images.transit, badge: "Phường 15" },
  { title: "Hanoi to Halong Bay / Halong Bay to Ninh Binh one-way", location: "Cát Linh", price: "453.644 VND", image: images.transit, badge: "Cát Linh" },
  { title: "Tàu Chapa Express giường nằm một chiều", location: "Trung tâm Sa Pa", price: "346.326 VND", image: images.transit, badge: "Trung tâm Sa Pa" },
];

const articleCards: ArticleItem[] = [
  { title: "Du lịch tháng 4 trong nước: đừng bỏ qua những thiên đường lý tưởng này!", meta: "Đọc trong khoảng 9 phút", source: "Traveloka VN", image: images.mountain },
  { title: "Khi nào là thời điểm tốt nhất để đặt vé máy bay?", meta: "Đọc trong khoảng 3 phút", source: "Travel Bestie", image: images.transit },
  { title: "Lễ hội pháo hoa Hàn Quốc 2026 tại Seoul & Busan có gì hot?", meta: "Đọc trong khoảng 3 phút", source: "Traveloka Xperience", image: images.night },
  { title: "Otaru Aquarium: thủy cung sống động sát bờ biển Nhật Bản", meta: "Đọc trong khoảng 3 phút", source: "Traveloka VN", image: images.aquarium },
];

const recommendationColumns: RecommendationColumn[] = [
  {
    title: "Khuyến nghị trong Việt Nam",
    image: images.sea,
    items: [
      { title: "Sun World Ba Den Mountain", meta: "Tây Ninh • 9.2 (20,6K đánh giá)", price: "250.000 VND", image: images.mountain },
      { title: "Vé VinWonders Cửa Hội", meta: "Nghệ An • 8.8 (5,2K đánh giá)", price: "100.000 VND", image: images.sea },
      { title: "Lotte World Aquarium | Hà Nội", meta: "Tây Hồ • 9.0 (2,8K đánh giá)", price: "189.594 VND", image: images.aquarium },
    ],
  },
  {
    title: "Khuyến nghị trong Thái Lan",
    image: images.temple,
    items: [
      { title: "SEA LIFE Bangkok Ocean World", meta: "Siam • 9.0 (29,3K đánh giá)", price: "112.023 VND", image: images.aquarium },
      { title: "4G eSIM for Thailand by GoHub", meta: "Pratunam • 9.0 (737 đánh giá)", price: "30.121 VND", image: images.mobile },
      { title: "Vé Safari World Bangkok", meta: "Bangkok • 8.7 (48,4K đánh giá)", price: "644.739 VND", image: images.mountain },
    ],
  },
  {
    title: "Khuyến nghị trong Singapore",
    image: images.city,
    items: [
      { title: "Universal Studios Singapore", meta: "Sentosa • 9.1 (124,9K đánh giá)", price: "512.691 VND", image: images.city },
      { title: "Gardens by the Bay", meta: "Vịnh Marina • 9.3 (160,6K đánh giá)", price: "205.076 VND", image: images.city },
      { title: "Vé vào cửa Thủy cung Singapore", meta: "Sentosa • 8.8 (8346 đánh giá)", price: "640.863 VND", image: images.aquarium },
    ],
  },
];

const guideLinks = [
  "Sống giàu trải nghiệm cùng Traveloka",
  "Tại sao nên đặt hoạt động du lịch với Traveloka?",
  "1. Hơn 32.000 hoạt động vui chơi toàn cầu",
  "2. Đặt trực tuyến, miễn xếp hàng",
  "3. Phương thức thanh toán đa dạng",
  "4. Traveloka Priority",
  "5. Dịch vụ chăm sóc khách hàng",
  "6. Ưu đãi mỗi ngày",
];

const reasons = [
  "Traveloka hợp tác với nhiều thương hiệu vui chơi nổi bật để bạn dễ chọn công viên giải trí, show diễn, city tour, thủy cung hay tour trong ngày.",
  "Vé điện tử giúp bạn đặt trước nhanh hơn và chủ động lịch trình tốt hơn, nhất là trong dịp lễ hoặc cuối tuần.",
  "Ngoài vé tham quan, bạn còn có thể gom eSIM, đưa đón sân bay, vé tàu hay fast-track sân bay trong cùng hành trình.",
  "Khuyến mãi được cập nhật thường xuyên để bạn chọn đúng hoạt động yêu thích mà vẫn giữ ngân sách hợp lý.",
];

function coverStyle(image: string, overlay = "linear-gradient(180deg, rgba(8, 24, 45, 0.08) 0%, rgba(8, 24, 45, 0.78) 100%)"): CSSProperties {
  return { backgroundImage: `${overlay}, url(${image})` };
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="activity-customer__section-head">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <button type="button" className="activity-customer__section-arrow" aria-label={`Xem thêm ${title}`}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function ShowcaseCard({ item }: { item: CardItem }) {
  return (
    <article className="activity-customer__experience-card">
      <div className="activity-customer__experience-thumb" style={coverStyle(item.image)}>
        {item.badge ? <span className="activity-customer__experience-badge">{item.badge}</span> : null}
      </div>
      <div className="activity-customer__experience-body">
        <div className="activity-customer__experience-location">{item.location}</div>
        <h3>{item.title}</h3>
        {item.meta ? <p>{item.meta}</p> : null}
        <div className="activity-customer__experience-price">
          {item.oldPrice ? <span>{item.oldPrice}</span> : null}
          <strong>{item.price}</strong>
        </div>
      </div>
    </article>
  );
}

function BannerCardView({ item }: { item: BannerItem }) {
  return (
    <article className="activity-customer__promo-card" style={coverStyle(item.image, "linear-gradient(180deg, rgba(26, 35, 73, 0.14) 0%, rgba(26, 35, 73, 0.46) 100%)")}>
      <span>{item.badge}</span>
      <strong>{item.title}</strong>
      <p>{item.subtitle}</p>
    </article>
  );
}

function ArticleCardView({ item }: { item: ArticleItem }) {
  return (
    <article className="activity-customer__article-card">
      <div className="activity-customer__article-thumb" style={coverStyle(item.image)} />
      <div className="activity-customer__article-body">
        <h3>{item.title}</h3>
        <p>{item.meta}</p>
        <span>{item.source}</span>
      </div>
    </article>
  );
}

function RecommendationCard({ column }: { column: RecommendationColumn }) {
  return (
    <article className="activity-customer__recommend-column">
      <div className="activity-customer__recommend-hero" style={coverStyle(column.image)}>
        <strong>{column.title}</strong>
      </div>
      <div className="activity-customer__recommend-list">
        {column.items.map((item) => (
          <article key={item.title} className="activity-customer__mini-card">
            <div className="activity-customer__mini-thumb" style={coverStyle(item.image, "linear-gradient(180deg, rgba(12, 32, 58, 0.06) 0%, rgba(12, 32, 58, 0.18) 100%)")} />
            <div className="activity-customer__mini-body">
              <h3>{item.title}</h3>
              <p>{item.meta}</p>
              <strong>Bắt đầu từ {item.price}</strong>
            </div>
          </article>
        ))}
      </div>
      <button type="button" className="activity-customer__recommend-button">Khám phá</button>
    </article>
  );
}

export default function CustomerActivity() {
  const [selectedDestination, setSelectedDestination] = useState(heroDestinations[0]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCouponTab, setSelectedCouponTab] = useState(couponTabs[0]);
  const [selectedPackageTab, setSelectedPackageTab] = useState(packageTabs[0]);
  const [selectedDomesticTab, setSelectedDomesticTab] = useState(domesticTabs[0]);
  const [selectedInternationalTab, setSelectedInternationalTab] = useState(internationalTabs[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSearch() {
    scrollToSection(searchValue.trim() ? "tat-ca-hoat-dong" : "kham-pha");
  }

  function handleCopy(code: string) {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(code);
    }

    setCopiedCode(code);
    window.setTimeout(() => {
      setCopiedCode((currentValue) => (currentValue === code ? null : currentValue));
    }, 1600);
  }

  return (
    <main className="activity-customer">
      <section
        className="activity-customer__hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(8, 18, 31, 0.42) 0%, rgba(8, 18, 31, 0.28) 22%, rgba(8, 18, 31, 0.82) 100%), linear-gradient(90deg, rgba(8, 18, 31, 0.3) 0%, rgba(8, 18, 31, 0.08) 100%), url(${baibienImage})`,
        }}
      >
        <div className="customer-shell__container">
          <div className="activity-customer__hero-copy">
            <span>Xperience</span>
            <h1>Du lịch</h1>

            <div className="activity-customer__hero-search">
              <label className="activity-customer__search-select">
                <MapPinned size={18} />
                <select value={selectedDestination} onChange={(event) => setSelectedDestination(event.target.value)}>
                  {heroDestinations.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="activity-customer__search-input">
                <Search size={18} />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Tìm kiếm địa điểm hoặc hoạt động"
                />
              </label>

              <button type="button" className="activity-customer__search-button" onClick={handleSearch}>
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="customer-shell__container">
        <nav className="activity-customer__shortcut-bar">
          {quickLinks.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                className={index === 0 ? "activity-customer__shortcut is-active" : "activity-customer__shortcut"}
                onClick={() => scrollToSection(item.id)}
              >
                <span className="activity-customer__shortcut-icon">
                  <Icon size={18} />
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <section className="activity-customer__section" id="kham-pha">
        <div className="customer-shell__container">
          <SectionHeader title="Thu thập mã ưu đãi Xperience" />
          <div className="activity-customer__tab-row">
            {couponTabs.map((item) => (
              <button
                key={item}
                type="button"
                className={item === selectedCouponTab ? "activity-customer__chip is-active" : "activity-customer__chip"}
                onClick={() => setSelectedCouponTab(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="activity-customer__coupon-grid">
            {couponCards.map((item) => (
              <article key={item.code} className="activity-customer__coupon-card">
                <span className="activity-customer__coupon-badge">{item.badge}</span>
                <div className="activity-customer__coupon-top">
                  <div className="activity-customer__coupon-icon">
                    <Gift size={18} />
                  </div>
                  <div className="activity-customer__coupon-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
                <div className="activity-customer__coupon-footer">
                  <div>
                    <small>Mã ưu đãi</small>
                    <strong>{item.code}</strong>
                  </div>
                  <button type="button" onClick={() => handleCopy(item.code)}>
                    <Copy size={14} />
                    {copiedCode === item.code ? "Đã chép" : "Copy"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="activity-customer__section" id="tour-hoat-dong">
        <div className="customer-shell__container">
          <SectionHeader title="Tour du lịch trọn gói" />
          <div className="activity-customer__tab-row">
            {packageTabs.map((item) => (
              <button
                key={item}
                type="button"
                className={item === selectedPackageTab ? "activity-customer__chip is-active" : "activity-customer__chip"}
                onClick={() => setSelectedPackageTab(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="activity-customer__showcase-grid activity-customer__showcase-grid--two">
            {packageCards.map((item) => (
              <ShowcaseCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="activity-customer__section" id="diem-tham-quan">
        <div className="customer-shell__container">
          <SectionHeader title="Tour du thuyền thế giới hấp dẫn" />
          <div className="activity-customer__showcase-grid">
            {cruiseCards.map((item) => (
              <ShowcaseCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="activity-customer__section">
        <div className="customer-shell__container" id="uu-dai-xperience">
          <SectionHeader title="Khuyến mãi Xperience hiện hành" subtitle="Tiết kiệm lớn với những ưu đãi đặc biệt giới hạn của chúng tôi" />
          <div className="activity-customer__promo-grid">
            {promoCards.map((item) => (
              <BannerCardView key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="activity-customer__section">
        <div className="customer-shell__container">
          <SectionHeader title="Tour du lịch 30/4 trong nước" />
          <div className="activity-customer__tab-row">
            {domesticTabs.map((item) => (
              <button
                key={item}
                type="button"
                className={item === selectedDomesticTab ? "activity-customer__chip is-active" : "activity-customer__chip"}
                onClick={() => setSelectedDomesticTab(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="activity-customer__showcase-grid activity-customer__showcase-grid--five">
            {domesticCards.map((item) => (
              <ShowcaseCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="activity-customer__section">
        <div className="customer-shell__container">
          <SectionHeader title="Tour du lịch 30/4 nước ngoài" />
          <div className="activity-customer__tab-row">
            {internationalTabs.map((item) => (
              <button
                key={item}
                type="button"
                className={item === selectedInternationalTab ? "activity-customer__chip is-active" : "activity-customer__chip"}
                onClick={() => setSelectedInternationalTab(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="activity-customer__showcase-grid activity-customer__showcase-grid--five">
            {internationalCards.map((item) => (
              <ShowcaseCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="activity-customer__section" id="can-thiet">
        <div className="customer-shell__container">
          <SectionHeader title="Cần thiết cho du lịch" />
          <div className="activity-customer__showcase-grid activity-customer__showcase-grid--five">
            {essentialCards.map((item) => (
              <ShowcaseCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="activity-customer__section">
        <div className="customer-shell__container" id="doi-tac">
          <SectionHeader title="Đối tác của Traveloka" />
          <div className="activity-customer__partner-grid">
            {partners.map((item) => (
              <article key={item.name} className="activity-customer__partner-card">
                <div className={`activity-customer__partner-logo ${item.accent}`}>{item.name}</div>
                <strong>{item.name}</strong>
                <span>{item.caption}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="activity-customer__section">
        <div className="customer-shell__container">
          <SectionHeader title="Vé Tàu Hỏa" />
          <div className="activity-customer__showcase-grid activity-customer__showcase-grid--five">
            {transportCards.map((item) => (
              <ShowcaseCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="activity-customer__section" id="bai-viet">
        <div className="customer-shell__container">
          <SectionHeader title="Các bài viết mới nhất" subtitle="Luôn nắm bắt những kinh nghiệm du lịch mới nhất" />
          <div className="activity-customer__article-grid">
            {articleCards.map((item) => (
              <ArticleCardView key={item.title} item={item} />
            ))}
          </div>
          <button type="button" className="activity-customer__text-link">
            <Newspaper size={16} />
            Đọc thêm các bài viết du lịch
          </button>
        </div>
      </section>

      <section className="activity-customer__section" id="tat-ca-hoat-dong">
        <div className="customer-shell__container">
          <SectionHeader title="Hoạt động tốt nhất cho chuyến đi của bạn" />
          <div className="activity-customer__recommend-grid">
            {recommendationColumns.map((item) => (
              <RecommendationCard key={item.title} column={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="activity-customer__section activity-customer__section--story">
        <div className="customer-shell__container">
          <div className="activity-customer__story-layout">
            <aside className="activity-customer__story-nav">
              <h3>Khám phá Traveloka</h3>
              <p>Sống giàu trải nghiệm cùng Traveloka</p>
              <ul>
                {guideLinks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>

            <div className="activity-customer__story-content">
              <h2>Sống giàu trải nghiệm cùng Traveloka</h2>
              <p>
                Du lịch không chỉ là đến một nơi mới mà còn là hành trình tận hưởng, khám phá và tích lũy những trải
                nghiệm đáng nhớ. Traveloka gom sẵn từ vé vui chơi, tour, eSIM cho đến các nhu cầu di chuyển để bạn
                hoàn thiện lịch trình trong một nơi.
              </p>
              <p>
                Bạn có thể chọn công viên giải trí, thủy cung, show diễn, du thuyền, city tour hay combo trọn gói
                theo đúng nhịp đi của mình. Trong các dịp cao điểm, việc đặt trước giúp chủ động hơn về thời gian,
                ngân sách và cả trải nghiệm tại điểm đến.
              </p>
              <h3>Tại sao nên đặt hoạt động du lịch với Traveloka?</h3>
              <div className="activity-customer__story-reasons">
                {reasons.map((item, index) => (
                  <article key={item} className="activity-customer__story-reason">
                    <strong>{index + 1}. Điểm nổi bật</strong>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
              <div className="activity-customer__story-note">
                <Ticket size={18} />
                <span>Đặt hoạt động trực tuyến, lưu vé điện tử trong tài khoản và quay lại nhanh từ thanh header khi cần.</span>
              </div>
              <div className="activity-customer__story-note">
                <TrainFront size={18} />
                <span>Gom luôn vé tàu, eSIM và fast-track sân bay để chuyến đi liền mạch hơn từ đầu đến cuối.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
