import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  Waves,
  Sparkles,
  Dumbbell,
  UtensilsCrossed,
  Wifi,
  Coffee,
  Wind,
  Maximize2,
  BedDouble,
  Eye,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  Images,
  CheckCircle,
} from "lucide-react";
import "../assets/css/CustomerHotelDetail.css";
import heroCityImg from "../assets/images/hotel_hero_city.png";
import hotelRoomImg from "../assets/images/hotel_room_deluxe.png";
import hotelPoolImg from "../assets/images/hotel_pool.png";
import hotelVillaImg from "../assets/images/hotel_villa.png";

/* ─── Data ─────────────────────────────────────────────────────── */
const amenities = [
  { icon: Waves,           label: "Hồ bơi vô cực" },
  { icon: Sparkles,        label: "Spa sang trọng" },
  { icon: Dumbbell,        label: "Phòng Gym 24/7" },
  { icon: UtensilsCrossed, label: "Nhà hàng" },
];

const roomTypes = [
  {
    id: 1,
    name: "Phòng Deluxe hướng biển",
    badge: "Bán chạy nhất",
    image: hotelRoomImg,
    area: "45 m²",
    bed: "1 giường King",
    view: "Hướng biển",
    perks: [
      { icon: Wifi,    label: "Wifi miễn phí" },
      { icon: Coffee,  label: "Bao gồm ăn sáng" },
      { icon: Wind,    label: "Điều hòa" },
    ],
    priceOriginal: 4_200_000,
    price: 3_450_000,
  },
  {
    id: 2,
    name: "Villa trước biển có hồ bơi riêng",
    badge: null,
    image: hotelVillaImg,
    area: "120 m²",
    bed: "2 giường King",
    view: "Villa biển",
    perks: [
      { icon: Waves,         label: "Hồ bơi riêng" },
      { icon: UtensilsCrossed, label: "Quầy bar 24/7" },
      { icon: Wifi,          label: "Wifi tốc độ cao" },
    ],
    priceOriginal: null,
    price: 8_900_000,
  },
];

const reviews = [
  {
    id: 1,
    initial: "T",
    author: "Trần Minh",
    date: "Tháng 3/2025",
    stars: 5,
    text: "Tuyệt vời! Phòng rộng rãi, view biển cực đẹp. Nhân viên rất thân thiện và nhiệt tình. Bữa sáng rất phong phú. Sẽ quay lại lần sau!",
    hotel: "Đặt tại Phòng Deluxe hướng biển 03/2025",
  },
  {
    id: 2,
    initial: "L",
    author: "Lê Thị Hoa",
    date: "Tháng 4/2025",
    stars: 5,
    text: "Dịch vụ spa cực kỳ chuyên nghiệp. Hồ bơi vô cực view đẹp nhất tôi từng thấy. Đồ ăn ngon. Không gian rất sang trọng và đẳng cấp.",
    hotel: "Đặt tại Villa bãi biển 04/2025",
  },
];

const faqs = [
  {
    q: "Khách sạn có cung cấp dịch vụ đưa đón sân bay không?",
    a: "Có, khách sạn cung cấp dịch vụ đưa đón sân bay 24/7. Quý khách vui lòng đặt trước ít nhất 24 giờ để đảm bảo phương tiện. Phí dịch vụ: 350.000 VND/chiều.",
  },
  {
    q: "Giờ check-in và check-out là mấy giờ?",
    a: "Check-in từ 14:00, check-out trước 12:00 trưa. Quý khách có thể yêu cầu check-in sớm hoặc check-out muộn tùy thuộc vào tình trạng phòng (phụ phí áp dụng).",
  },
  {
    q: "Giá phòng có bao gồm bữa sáng không?",
    a: "Phòng Deluxe hướng biển bao gồm bữa sáng buffet cho 2 người. Villa có hồ bơi riêng không bao gồm bữa sáng (có thể thêm với giá 350.000 VND/người).",
  },
  {
    q: "Thú cưng có được phép vào khách sạn không?",
    a: "Rất tiếc, khách sạn không cho phép mang thú cưng vào khu vực lưu trú để đảm bảo trải nghiệm tốt nhất cho tất cả quý khách.",
  },
];

/* ─── Helper ────────────────────────────────────────────────────── */
function formatVnd(n: number) {
  return "VND " + n.toLocaleString("vi-VN");
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="hd__review-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={13} fill={i < count ? "#f5a623" : "none"} stroke="#f5a623" />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function CustomerHotelDetail() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function toggleFaq(index: number) {
    setOpenFaq((prev) => (prev === index ? null : index));
  }

  return (
    <div className="hd">
      {/* ── Breadcrumb ── */}
      <nav className="hd__breadcrumb" aria-label="breadcrumb">
        <div className="hd__breadcrumb-inner">
          <a href="/mua-sam">Trang chủ</a>
          <span className="hd__breadcrumb-sep">›</span>
          <a href="/mua-sam/khach-san">Khách sạn</a>
          <span className="hd__breadcrumb-sep">›</span>
          <span className="hd__breadcrumb-current">The Azure Serenity Resort &amp; Spa</span>
        </div>
      </nav>

      {/* ── Gallery ── */}
      <div className="hd__gallery">
        <div className="hd__container">
          <div className="hd__gallery-grid">
            {/* Main large image */}
            <div className="hd__gallery-main">
              <img src={heroCityImg} alt="Khách sạn Azure Serenity về đêm" />
            </div>

            {/* Thumbs */}
            <div className="hd__gallery-thumb">
              <img src={hotelRoomImg} alt="Phòng Deluxe" />
            </div>
            <div className="hd__gallery-thumb">
              <img src={hotelPoolImg} alt="Hồ bơi vô cực" />
            </div>
            <div className="hd__gallery-thumb hd__gallery-thumb--overlay">
              <img src={hotelVillaImg} alt="Villa bãi biển" />
            </div>

            {/* See all button */}
            <button type="button" className="hd__gallery-see-all">
              <Images size={16} />
              Xem tất cả ảnh
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="hd__body">
        <div className="hd__container">
          <div className="hd__layout">
            {/* ══ LEFT COLUMN ══════════════════════════════ */}
            <div>
              {/* Hotel Info Card */}
              <section className="hd__info">
                {/* Badge + Stars */}
                <div className="hd__badges">
                  <span className="hd__badge hd__badge--type">Resort &amp; Spa</span>
                  <div className="hd__stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} fill="#f5a623" stroke="none" className="hd__star-icon" />
                    ))}
                  </div>
                </div>

                <h1 className="hd__name">The Azure Serenity Resort &amp; Spa</h1>

                <div className="hd__address">
                  <MapPin size={15} className="hd__address-icon" />
                  <span>36 Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng, Việt Nam</span>
                </div>

                {/* Rating bar */}
                <div className="hd__rating-bar">
                  <div className="hd__rating-score">4.9</div>
                  <div className="hd__rating-bar-divider" />
                  <div>
                    <div className="hd__rating-label">Xuất sắc</div>
                    <div className="hd__rating-count">Dựa trên 1.240 đánh giá</div>
                  </div>
                  <div className="hd__rating-bar-divider" />
                  <div>
                    <div className="hd__rating-label">95%</div>
                    <div className="hd__rating-count">Khách hàng đề xuất</div>
                  </div>
                </div>

                {/* Description */}
                <div className="hd__desc">
                  <p>
                    The Azure Serenity Resort &amp; Spa là một trong những khu nghỉ dưỡng hàng đầu bên bờ biển Đà Nẵng,
                    nơi mang lại trải nghiệm nghỉ dưỡng hoàn hảo với thiên nhiên trong lành và dịch vụ đẳng cấp quốc tế.
                    Từ mỗi căn phòng, du khách có thể chiêm ngưỡng toàn cảnh biển xanh ngọc bích tuyệt đẹp.
                  </p>
                  <p>
                    Khu nghỉ dưỡng bao gồm hồ bơi vô cực nhìn ra Biển Đông, trung tâm spa cao cấp với các liệu trình
                    truyền thống Việt Nam và quốc tế, phòng gym hiện đại mở cửa 24/7 cùng nhà hàng phục vụ ẩm thực
                    Á-Âu đa dạng. Đây là điểm đến lý tưởng cho cả những chuyến nghỉ dưỡng lãng mạn lẫn kỳ nghỉ gia đình.
                  </p>
                  <p>
                    Với vị trí đắc địa chỉ cách bờ biển 50m, resort còn có khu vườn nhiệt đới xanh mát, các tiện ích
                    thể thao biển đa dạng và đội ngũ concierge nhiệt tình sẵn sàng hỗ trợ mọi nhu cầu của quý khách.
                  </p>
                </div>

                <hr className="hd__divider" />

                {/* Amenities */}
                <div className="hd__amenities-title">Tiện ích nổi bật</div>
                <div className="hd__amenities-grid">
                  {amenities.map(({ icon: Icon, label }) => (
                    <div key={label} className="hd__amenity">
                      <div className="hd__amenity-icon">
                        <Icon size={20} />
                      </div>
                      <span className="hd__amenity-label">{label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Rooms ── */}
              <section className="hd__rooms-section" id="phong">
                <h2 className="hd__section-title">Loại phòng hiện có</h2>

                {roomTypes.map((room) => (
                  <article key={room.id} className="hd__room-card">
                    {room.badge && (
                      <span className="hd__room-badge">{room.badge}</span>
                    )}

                    <div className="hd__room-img-wrap">
                      <img src={room.image} alt={room.name} className="hd__room-img" />
                    </div>

                    <div className="hd__room-body">
                      <div>
                        <h3 className="hd__room-name">{room.name}</h3>

                        <div className="hd__room-meta">
                          <span className="hd__room-meta-item">
                            <Maximize2 size={14} />
                            {room.area}
                          </span>
                          <span className="hd__room-meta-item">
                            <BedDouble size={14} />
                            {room.bed}
                          </span>
                          <span className="hd__room-meta-item">
                            <Eye size={14} />
                            {room.view}
                          </span>
                        </div>

                        <div className="hd__room-perks">
                          {room.perks.map(({ icon: PerkIcon, label }) => (
                            <span key={label} className="hd__room-perk">
                              <PerkIcon size={13} />
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="hd__room-footer">
                        <div className="hd__room-price-group">
                          {room.priceOriginal && (
                            <div className="hd__room-price-orig">{formatVnd(room.priceOriginal)}</div>
                          )}
                          <div className="hd__room-price">
                            {formatVnd(room.price)}
                            <small> / đêm</small>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          className="hd__room-select-btn"
                          onClick={() => navigate("/mua-sam/thanh-toan-khach-san")}
                        >
                          Chọn phòng
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              {/* ── Reviews ── */}
              <section className="hd__reviews-section" id="danh-gia">
                <div className="hd__reviews-header">
                  <div className="hd__section-title" style={{ margin: 0 }}>
                    Đánh giá từ khách hàng
                  </div>

                  <div className="hd__reviews-score-block">
                    <div className="hd__reviews-score">4.9 / 5</div>
                    <div>
                      <div className="hd__reviews-score-label">Xuất sắc</div>
                      <div className="hd__reviews-score-count">1.240 đánh giá</div>
                    </div>
                  </div>

                  <button type="button" className="hd__reviews-see-all">
                    Xem tất cả đánh giá →
                  </button>
                </div>

                <div className="hd__reviews-grid">
                  {reviews.map((r) => (
                    <div key={r.id} className="hd__review-card">
                      <div className="hd__review-top">
                        <div className="hd__review-avatar">{r.initial}</div>
                        <div>
                          <div className="hd__review-author">{r.author}</div>
                          <div className="hd__review-date">{r.date}</div>
                          <StarRow count={r.stars} />
                        </div>
                      </div>
                      <p className="hd__review-text">{r.text}</p>
                      <div style={{ marginTop: 10, fontSize: 11.5, color: "#9eaab6" }}>{r.hotel}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── FAQ ── */}
              <section className="hd__faq-section" id="faq">
                <h2 className="hd__section-title">Câu hỏi thường gặp</h2>
                <div className="hd__faq-list">
                  {faqs.map((item, idx) => (
                    <div
                      key={idx}
                      className={`hd__faq-item${openFaq === idx ? " hd__faq-item--open" : ""}`}
                    >
                      <button
                        type="button"
                        className="hd__faq-question"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={openFaq === idx}
                      >
                        {item.q}
                        <ChevronDown size={18} className="hd__faq-chevron" />
                      </button>
                      <div className="hd__faq-answer">{item.a}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ══ SIDEBAR ══════════════════════════════════ */}
            <aside className="hd__sidebar">
              {/* Booking Box */}
              <div className="hd__booking-box">
                <div className="hd__booking-label">Giá tốt nhất từ</div>
                <div className="hd__booking-original">4.200.000 VND</div>
                <div className="hd__booking-discount">Tiết kiệm 18%</div>
                <div className="hd__booking-price">
                  3.450.000 <span>VND / đêm</span>
                </div>

                <div className="hd__booking-fields">
                  <div className="hd__booking-row">
                    <div className="hd__booking-field">
                      <div className="hd__booking-field-label">Nhận phòng</div>
                      <div className="hd__booking-field-value">01 thg 6, 2025</div>
                    </div>
                    <div className="hd__booking-field">
                      <div className="hd__booking-field-label">Trả phòng</div>
                      <div className="hd__booking-field-value">04 thg 6, 2025</div>
                    </div>
                  </div>
                  <div className="hd__booking-field">
                    <div className="hd__booking-field-label">Khách &amp; Phòng</div>
                    <div className="hd__booking-field-value">2 người lớn · 1 phòng</div>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="hd__booking-btn"
                  onClick={() => navigate("/mua-sam/thanh-toan-khach-san")}
                >
                  Đặt phòng ngay
                </button>
                <div className="hd__booking-note">
                  <ShieldCheck size={13} />
                  Miễn phí hủy trước 48h
                </div>
              </div>

              {/* Map Box */}
              <div className="hd__map-box">
                <div className="hd__map-header">📍 Vị trí</div>
                <div
                  className="hd__map-placeholder"
                  role="img"
                  aria-label="Bản đồ vị trí khách sạn"
                >
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="40" cy="40" r="38" stroke="#a8c7f8" strokeWidth="2" />
                    <circle cx="40" cy="40" r="10" fill="#1a73e8" />
                    <line x1="40" y1="2" x2="40" y2="26" stroke="#a8c7f8" strokeWidth="1.5" />
                    <line x1="40" y1="54" x2="40" y2="78" stroke="#a8c7f8" strokeWidth="1.5" />
                    <line x1="2" y1="40" x2="26" y2="40" stroke="#a8c7f8" strokeWidth="1.5" />
                    <line x1="54" y1="40" x2="78" y2="40" stroke="#a8c7f8" strokeWidth="1.5" />
                    <path d="M20 20 Q 35 10 50 20" stroke="#c5d8fb" strokeWidth="1" fill="none" />
                    <path d="M20 60 Q 35 70 50 60" stroke="#c5d8fb" strokeWidth="1" fill="none" />
                    <path d="M60 20 Q 70 35 60 50" stroke="#c5d8fb" strokeWidth="1" fill="none" />
                    <path d="M20 20 Q 10 35 20 50" stroke="#c5d8fb" strokeWidth="1" fill="none" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 600, color: "#1a73e8", fontSize: 13 }}>Đà Nẵng, Việt Nam</div>
                    <div style={{ color: "#9eaab6", fontSize: 12 }}>36 Võ Nguyên Giáp, Sơn Trà</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="hd__map-btn"
                  onClick={() =>
                    window.open(
                      "https://maps.google.com/?q=The+Azure+Serenity+Resort+Da+Nang",
                      "_blank",
                    )
                  }
                >
                  <ExternalLink size={14} />
                  Xem trên Google Maps
                </button>
              </div>

              {/* Trust Block */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #edf1f5",
                  padding: "16px 18px",
                  boxShadow: "0 2px 10px rgba(30,50,80,0.05)",
                }}
              >
                {[
                  "Xác nhận đặt phòng ngay lập tức",
                  "Bảo mật thông tin khách hàng",
                  "Hỗ trợ 24/7 qua chat & điện thoại",
                  "Không thu phí ẩn",
                ].map((text) => (
                  <div
                    key={text}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      marginBottom: 10,
                      fontSize: 13,
                      color: "#3a4a5c",
                    }}
                  >
                    <CheckCircle size={15} style={{ color: "#2e7d32", flexShrink: 0, marginTop: 1 }} />
                    {text}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
