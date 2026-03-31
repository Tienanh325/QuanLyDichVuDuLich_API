import { useState } from "react";
import { Link } from "react-router-dom";
import baibienImage from "../assets/images/baibien.jpg";
import {
  BedDouble,
  Train,
  CalendarDays,
  CarFront,
  CircleDollarSign,
  Grid2x2,
  MapPinned,
  PlaneTakeoff,
  Search,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";
import { getCurrentSession } from "../utils/auth";
import "../assets/css/MuaSamKhachHang.css";

type ServiceId = "hotel" | "flight" | "bus" | "airport" | "car" | "activity" | "other";

const serviceTabs: Array<{
  id: ServiceId;
  label: string;
  icon: typeof BedDouble;
}> = [
  { id: "hotel", label: "Khách sạn", icon: BedDouble },
  { id: "flight", label: "Vé máy bay", icon: PlaneTakeoff },
  { id: "bus", label: "Vé tàu", icon: Train },
  { id: "airport", label: "Đưa đón sân bay", icon: MapPinned },
  { id: "car", label: "Cho thuê xe", icon: CarFront },
  { id: "activity", label: "Hoạt động & Vui chơi", icon: Ticket },
  { id: "other", label: "Khác", icon: Grid2x2 },
];

const quickActions = [
  {
    title: "Deal tot tren app",
    body: "Mo rong xuong block banner, ma giam gia, va khuyen mai theo diem den.",
  },
  {
    title: "Kham pha y tuong chuyen bay",
    body: "Goi y chang pho bien de fill nhanh form tim kiem.",
  },
  {
    title: "Canh bao gia",
    body: "Dat luong thong bao gia re va uu dai trong tuan.",
  },
];

export default function MuaSamKhachHang() {
  const session = getCurrentSession();
  const [activeTab, setActiveTab] = useState<ServiceId>("flight");
  const [tripMode, setTripMode] = useState<"single" | "multi">("single");

  return (
    <div className="travel-home">
      <section className="travel-home__hero"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(7, 24, 43, 0.18) 0%, rgba(7, 24, 43, 0.54) 100%), url(${baibienImage})`,
          }}>
        <div className="travel-home__overlay" />

        <div
          className="travel-home__container"
        >

          <header className="travel-home__header">
            <div className="travel-home__header-row">
              <div className="travel-brand" >
                <div className="travel-brand__text"style={{padding: "0 16px"}}>traveloka</div>
              </div>

              <div className="travel-home__header-group">
                <nav className="travel-home__top-links">
                  <a href="#uu-dai">Khuyến mãi</a>
                  <a href="#uu-dai">Hợp tác với chúng tôi</a>
                  <a href="#uu-dai">Hỗ trợ</a>
                  <a href="#uu-dai">Đặt cho của tôi</a>
                </nav>

                <div className="travel-home__auth">
                  <Link to="/dang-nhap" className="travel-home__button travel-home__button--light">
                    Dăng Nhập
                  </Link>
                  <Link to="/dang-ky" className="travel-home__button travel-home__button--primary">
                    Dăng ký
                  </Link>
                </div>
              </div>
            </div>

            <nav className="travel-home__category-row">
              <a href="#uu-dai">Khách sạn</a>
              <a href="#tim-kiem">Vé máy bay</a>
              <a href="#uu-dai">Vé tàu</a>
              <a href="#uu-dai">Đưa đón sân bay</a>
              <a href="#uu-dai">Cho thuê xe</a>
              <a href="#uu-dai">Hoạt động & Vui chơi</a>
              <a href="#uu-dai">More</a>
            </nav>
          </header>

          <div className="travel-home__headline">
            <div className="travel-home__welcome">
              <ShieldCheck size={16} />
              Xin chao {session?.fullName ?? "ban"}
            </div>
            <h1>App du lich hang dau, mot cham di bat cu dau</h1>
          </div>

          <section className="travel-search" id="tim-kiem">
            <div className="travel-search__services">
              {serviceTabs.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === activeTab;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={isActive ? "travel-service is-active" : "travel-service"}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="travel-search__panel">
              <div className="travel-search__toolbar">
                <div className="travel-search__modes">
                  <button
                    type="button"
                    className={tripMode === "single" ? "travel-chip is-active" : "travel-chip"}
                    onClick={() => setTripMode("single")}
                  >
                    Mot chieu / Khu hoi
                  </button>
                  <button
                    type="button"
                    className={tripMode === "multi" ? "travel-chip is-active" : "travel-chip"}
                    onClick={() => setTripMode("multi")}
                  >
                    Nhieu thanh pho
                  </button>
                </div>

                <div className="travel-search__meta">
                  <div className="travel-meta-box">
                    <Users size={18} />
                    <span>1 Nguoi lon, 0 Tre em, 0 Em be</span>
                  </div>
                  <div className="travel-meta-box">
                    <Ticket size={18} />
                    <span>Pho thong</span>
                  </div>
                </div>
              </div>

              <div className="travel-search__fields">
                <label className="travel-field travel-field--location">
                  <span>Tu</span>
                  <strong>TP HCM (SGN)</strong>
                  <small>San bay Tan Son Nhat</small>
                </label>

                <div className="travel-switch" aria-hidden="true">
                  ⇄
                </div>

                <label className="travel-field travel-field--location">
                  <span>Den</span>
                  <strong>Bangkok (BKKA)</strong>
                  <small>Tat ca san bay</small>
                </label>

                <div className="travel-date-group">
                  <label className="travel-field travel-field--date">
                    <span>Ngay khoi hanh</span>
                    <strong>1 thg 4 2026</strong>
                    <small>
                      <CalendarDays size={14} />
                      Linh hoat doi lich
                    </small>
                  </label>

                  <label className="travel-field travel-field--date travel-field--muted">
                    <span>Khu hoi</span>
                    <strong>3 thg 4 2026</strong>
                    <small>
                      <CalendarDays size={14} />
                      Chon them neu can
                    </small>
                  </label>
                </div>

                <button type="button" className="travel-search__submit" aria-label="Tim kiem">
                  <Search size={24} />
                </button>
              </div>

              <div className="travel-search__footer">
                <div className="travel-search__footer-title">Tim kiem</div>
                <div className="travel-search__footer-links">
                  <a href="#uu-dai">
                    <CircleDollarSign size={16} />
                    Kham pha y tuong chuyen bay
                  </a>
                  <a href="#uu-dai">
                    <CircleDollarSign size={16} />
                    Canh bao gia
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="travel-home__deals" id="uu-dai">
        <div className="travel-home__container">
          <div className="travel-home__deals-header">
            <div>
              <div className="travel-home__eyebrow">Trang chu khach hang</div>
              <h2>Phan ben duoi de tiep tuc mo rong banner, deal va san pham du lich</h2>
            </div>
            <p>
              Bố cục này giữ đúng tinh thần ảnh mẫu: hero lớn phía trên, nội dung thương mại ở
              dưới, dễ nối thêm API và component thực tế sau này.
            </p>
          </div>

          <div className="travel-home__deal-grid">
            {quickActions.map((item) => (
              <article key={item.title} className="travel-home__deal-card">
                <div className="travel-home__deal-badge">{item.title}</div>
                <p>{item.body}</p>
                <button type="button">Xem them</button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
