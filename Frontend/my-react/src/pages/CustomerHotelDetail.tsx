import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  Loader2,
} from "lucide-react";
import "../assets/css/CustomerHotelDetail.css";
import heroCityImg from "../assets/images/hotel_hero_city.png";
import hotelRoomImg from "../assets/images/hotel_room_deluxe.png";
import { getPublicHotelById, type KhachSanDetail, type LoaiPhong } from "../services/hotelService";

/* ─── Static Data ─────────────────────────────────────────────── */
const defaultAmenities = [
  { icon: Waves,           label: "Hồ bơi" },
  { icon: Sparkles,        label: "Spa" },
  { icon: Dumbbell,        label: "Phòng Gym" },
  { icon: UtensilsCrossed, label: "Nhà hàng" },
];

const defaultFaqs = [
  {
    q: "Khách sạn có cung cấp dịch vụ đưa đón sân bay không?",
    a: "Vui lòng liên hệ trực tiếp khách sạn để biết thêm thông tin về dịch vụ đưa đón.",
  },
  {
    q: "Giờ check-in và check-out là mấy giờ?",
    a: "Check-in từ 14:00, check-out trước 12:00 trưa.",
  },
  {
    q: "Giá phòng có bao gồm bữa sáng không?",
    a: "Tùy loại phòng và chính sách của khách sạn. Vui lòng xem chi tiết khi chọn phòng.",
  },
];

/* ─── Helper ────────────────────────────────────────────────── */
function formatVnd(n: number | string) {
  return "VND " + Number(n).toLocaleString("vi-VN");
}



/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function CustomerHotelDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hotel, setHotel] = useState<KhachSanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy params từ URL (truyền từ trang search)
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const adults = searchParams.get("adults") ?? "2";
  const rooms = searchParams.get("rooms") ?? "1";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getPublicHotelById(id)
      .then((data) => {
        setHotel(data);
      })
      .catch((err) => {
        console.error("Lỗi tải chi tiết khách sạn:", err);
        setError("Không thể tải thông tin khách sạn. Vui lòng thử lại.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  function toggleFaq(index: number) {
    setOpenFaq((prev) => (prev === index ? null : index));
  }

  function handleSelectRoom(room: LoaiPhong) {
    if (!hotel) return;
    const params = new URLSearchParams({
      khachSanId: String(hotel.maKhachSan),
      maDichVu: String(hotel.maDichVu),
      loaiPhongId: String(room.maLoaiPhong),
      tenLoaiPhong: room.tenLoaiPhong,
      giaPhong: String(room.giaPhong),
      checkIn,
      checkOut,
      adults,
      rooms,
      tenKhachSan: hotel.ten,
      viTri: hotel.viTri,
    });
    navigate(`/mua-sam/thanh-toan-khach-san?${params.toString()}`);
  }

  // ── Loading State ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="hd" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center", color: "#647b92" }}>
          <Loader2 size={48} style={{ animation: "spin 1s linear infinite", color: "#0194f3" }} />
          <p style={{ marginTop: 16 }}>Đang tải thông tin khách sạn...</p>
        </div>
      </div>
    );
  }

  // ── Error / Not Found ──────────────────────────────────────────
  if (error || !hotel) {
    return (
      <div className="hd" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#be123c", fontSize: 18 }}>{error ?? "Không tìm thấy khách sạn."}</p>
          <button type="button" onClick={() => navigate("/mua-sam/khach-san")} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 8, background: "#0194f3", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700 }}>
            Quay lại tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  const rawDiem = hotel.danhGia?.diemTrungBinh;
  const diemTrungBinh = rawDiem ? Number(rawDiem) : null;
  const soLuongDanhGia = hotel.danhGia?.soLuongDanhGia ?? 0;

  // Tìm giá thấp nhất từ loại phòng
  const minPrice = hotel.loaiPhong.length > 0
    ? Math.min(...hotel.loaiPhong.map((r) => r.giaPhong))
    : null;

  // Gallery images
  const galleryImages = hotel.hinhAnh.map((h) => h.urlAnh);
  const mainImage = galleryImages[0] ?? heroCityImg;
  const thumbImages = galleryImages.slice(1, 4);

  return (
    <div className="hd">
      {/* ── Breadcrumb ── */}
      <nav className="hd__breadcrumb" aria-label="breadcrumb">
        <div className="hd__breadcrumb-inner">
          <a href="/mua-sam">Trang chủ</a>
          <span className="hd__breadcrumb-sep">›</span>
          <a href="/mua-sam/khach-san">Khách sạn</a>
          <span className="hd__breadcrumb-sep">›</span>
          <span className="hd__breadcrumb-current">{hotel.ten}</span>
        </div>
      </nav>

      {/* ── Gallery ── */}
      <div className="hd__gallery">
        <div className="hd__container">
          <div className="hd__gallery-grid">
            <div className="hd__gallery-main">
              <img src={mainImage} alt={hotel.ten} onError={(e) => { (e.target as HTMLImageElement).src = heroCityImg; }} />
            </div>

            {[0, 1, 2].map((i) => (
              <div key={i} className={i === 2 ? "hd__gallery-thumb hd__gallery-thumb--overlay" : "hd__gallery-thumb"}>
                <img
                  src={thumbImages[i] ?? hotelRoomImg}
                  alt={`${hotel.ten} ảnh ${i + 2}`}
                  onError={(e) => { (e.target as HTMLImageElement).src = hotelRoomImg; }}
                />
              </div>
            ))}

            <button type="button" className="hd__gallery-see-all">
              <Images size={16} />
              Xem tất cả ảnh {galleryImages.length > 0 ? `(${galleryImages.length})` : ""}
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="hd__body">
        <div className="hd__container">
          <div className="hd__layout">
            {/* ══ LEFT COLUMN ══ */}
            <div>
              {/* Hotel Info Card */}
              <section className="hd__info">
                <div className="hd__badges">
                  <span className="hd__badge hd__badge--type">Khách sạn</span>
                  <div className="hd__stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} fill="#f5a623" stroke="none" className="hd__star-icon" />
                    ))}
                  </div>
                </div>

                <h1 className="hd__name">{hotel.ten}</h1>

                <div className="hd__address">
                  <MapPin size={15} className="hd__address-icon" />
                  <span>{hotel.viTri}</span>
                </div>

                {/* Rating bar */}
                <div className="hd__rating-bar">
                  <div className="hd__rating-score">
                    {diemTrungBinh ? diemTrungBinh.toFixed(1) : "N/A"}
                  </div>
                  <div className="hd__rating-bar-divider" />
                  <div>
                    <div className="hd__rating-label">
                      {diemTrungBinh && diemTrungBinh >= 4.5 ? "Xuất sắc" : diemTrungBinh && diemTrungBinh >= 4.0 ? "Rất tốt" : "Tốt"}
                    </div>
                    <div className="hd__rating-count">Dựa trên {soLuongDanhGia} đánh giá</div>
                  </div>
                </div>

                {/* Description */}
                {hotel.moTa && (
                  <div className="hd__desc">
                    <p>{hotel.moTa}</p>
                  </div>
                )}

                <hr className="hd__divider" />

                {/* Amenities */}
                <div className="hd__amenities-title">Tiện ích nổi bật</div>
                <div className="hd__amenities-grid">
                  {defaultAmenities.map(({ icon: Icon, label }) => (
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

                {hotel.loaiPhong.length === 0 ? (
                  <p style={{ color: "#647b92" }}>Hiện chưa có thông tin loại phòng. Vui lòng liên hệ khách sạn.</p>
                ) : (
                  hotel.loaiPhong.map((room) => (
                    <article key={room.maLoaiPhong} className="hd__room-card">
                      {room.soLuongPhongTrong > 0 && room.soLuongPhongTrong <= 3 && (
                        <span className="hd__room-badge">Còn {room.soLuongPhongTrong} phòng</span>
                      )}

                      <div className="hd__room-img-wrap">
                        <img src={hotelRoomImg} alt={room.tenLoaiPhong} className="hd__room-img" />
                      </div>

                      <div className="hd__room-body">
                        <div>
                          <h3 className="hd__room-name">{room.tenLoaiPhong}</h3>

                          <div className="hd__room-meta">
                            <span className="hd__room-meta-item">
                              <Maximize2 size={14} />
                              Sức chứa: {room.sucChua || "—"}
                            </span>
                            <span className="hd__room-meta-item">
                              <BedDouble size={14} />
                              Giường đôi
                            </span>
                            <span className="hd__room-meta-item">
                              <Eye size={14} />
                              {room.soLuongPhongTrong > 0 ? `Còn ${room.soLuongPhongTrong} phòng` : "Hết phòng"}
                            </span>
                          </div>

                          <div className="hd__room-perks">
                            {[{ icon: Wifi, label: "Wifi miễn phí" }, { icon: Coffee, label: "Nước uống" }, { icon: Wind, label: "Điều hòa" }].map(({ icon: PerkIcon, label }) => (
                              <span key={label} className="hd__room-perk">
                                <PerkIcon size={13} />
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="hd__room-footer">
                          <div className="hd__room-price-group">
                            <div className="hd__room-price">
                              {formatVnd(room.giaPhong)}
                              <small> / đêm</small>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="hd__room-select-btn"
                            disabled={room.soLuongPhongTrong <= 0}
                            onClick={() => handleSelectRoom(room)}
                          >
                            {room.soLuongPhongTrong > 0 ? "Chọn phòng" : "Hết phòng"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </section>

              {/* ── FAQ ── */}
              <section className="hd__faq-section" id="faq">
                <h2 className="hd__section-title">Câu hỏi thường gặp</h2>
                <div className="hd__faq-list">
                  {defaultFaqs.map((item, idx) => (
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

            {/* ══ SIDEBAR ══ */}
            <aside className="hd__sidebar">
              {/* Booking Box */}
              <div className="hd__booking-box">
                <div className="hd__booking-label">Giá tốt nhất từ</div>
                <div className="hd__booking-price">
                  {minPrice ? formatVnd(minPrice) : "Liên hệ"}
                  {minPrice && <span> VND / đêm</span>}
                </div>

                <div className="hd__booking-fields">
                  <div className="hd__booking-row">
                    <div className="hd__booking-field">
                      <div className="hd__booking-field-label">Nhận phòng</div>
                      <div className="hd__booking-field-value">{checkIn || "Chưa chọn"}</div>
                    </div>
                    <div className="hd__booking-field">
                      <div className="hd__booking-field-label">Trả phòng</div>
                      <div className="hd__booking-field-value">{checkOut || "Chưa chọn"}</div>
                    </div>
                  </div>
                  <div className="hd__booking-field">
                    <div className="hd__booking-field-label">Khách & Phòng</div>
                    <div className="hd__booking-field-value">{adults} người lớn · {rooms} phòng</div>
                  </div>
                </div>

                <button
                  type="button"
                  className="hd__booking-btn"
                  disabled={hotel.loaiPhong.length === 0}
                  onClick={() => hotel.loaiPhong[0] && handleSelectRoom(hotel.loaiPhong[0])}
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
                <div className="hd__map-placeholder" role="img" aria-label="Bản đồ vị trí khách sạn">
                  <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="38" stroke="#a8c7f8" strokeWidth="2" />
                    <circle cx="40" cy="40" r="10" fill="#1a73e8" />
                    <line x1="40" y1="2" x2="40" y2="26" stroke="#a8c7f8" strokeWidth="1.5" />
                    <line x1="40" y1="54" x2="40" y2="78" stroke="#a8c7f8" strokeWidth="1.5" />
                    <line x1="2" y1="40" x2="26" y2="40" stroke="#a8c7f8" strokeWidth="1.5" />
                    <line x1="54" y1="40" x2="78" y2="40" stroke="#a8c7f8" strokeWidth="1.5" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 600, color: "#1a73e8", fontSize: 13 }}>{hotel.viTri}</div>
                    <div style={{ color: "#9eaab6", fontSize: 12 }}>{hotel.tenNhaCungCap}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="hd__map-btn"
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(hotel.viTri)}`, "_blank")}
                >
                  <ExternalLink size={14} />
                  Xem trên Google Maps
                </button>
              </div>

              {/* Trust Block */}
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #edf1f5", padding: "16px 18px", boxShadow: "0 2px 10px rgba(30,50,80,0.05)" }}>
                {["Xác nhận đặt phòng ngay lập tức", "Bảo mật thông tin khách hàng", "Hỗ trợ 24/7 qua chat & điện thoại", "Không thu phí ẩn"].map((text) => (
                  <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, fontSize: 13, color: "#3a4a5c" }}>
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
