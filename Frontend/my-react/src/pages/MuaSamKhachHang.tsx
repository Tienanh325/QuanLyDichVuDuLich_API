import { useState } from "react";
import {
  BedDouble,
  CalendarDays,
  CarFront,
  CircleDollarSign,
  MapPinned,
  PlaneTakeoff,
  Search,
  Ticket,
  Train,
  Users,
} from "lucide-react";
import "../assets/css/MuaSamKhachHang.css";

type ServiceId = "hotel" | "flight" | "bus" | "airport" | "car" | "activity";
type IconType = typeof Search;

const serviceTabs: Array<{
  id: ServiceId;
  label: string;
  icon: IconType;
}> = [
  { id: "hotel", label: "Khách sạn", icon: BedDouble },
  { id: "flight", label: "Vé máy bay", icon: PlaneTakeoff },
  { id: "bus", label: "Vé xe khách", icon: Train },
  { id: "airport", label: "Đưa đón sân bay", icon: MapPinned },
  { id: "car", label: "Cho thuê xe", icon: CarFront },
  { id: "activity", label: "Hoạt động & Vui chơi", icon: Ticket },
];

const quickActions = [
  {
    title: "Deal tốt trên app",
    body: "Mở rộng xuống block banner, mã giảm giá, và khuyến mãi theo điểm đến.",
  },
  {
    title: "Khám phá ý tưởng chuyến đi",
    body: "Gợi ý chặng phổ biến để điền nhanh form tìm kiếm theo nhu cầu khách hàng.",
  },
  {
    title: "Cảnh báo giá",
    body: "Đặt luồng thông báo giá rẻ và ưu đãi đang có trong tuần.",
  },
];

const hotelFilters = ["Tất cả", "Khách sạn", "Biệt thự", "Căn hộ"];
const carFilters = ["Tự lái", "Có tài xế"];
const flightModes = ["Một chiều / Khứ hồi", "Nhiều thành phố"];
const activityTags = [
  "Điểm tham quan",
  "Spa & Thư giãn",
  "Tour",
  "Thể thao giải trí",
  "Trò chơi & Hoạt động",
  "Phương tiện di chuyển",
  "Cần thiết cho du lịch",
  "Trải nghiệm ẩm thực",
];

type FieldCardProps = {
  label?: string;
  title: string;
  subtitle?: string;
  icon?: IconType;
  muted?: boolean;
  placeholder?: boolean;
  grow?: boolean;
};

function FieldCard({
  label,
  title,
  subtitle,
  icon: Icon,
  muted = false,
  placeholder = false,
  grow = false,
}: FieldCardProps) {
  const className = [
    "travel-field-card",
    muted ? "is-muted" : "",
    placeholder ? "is-placeholder" : "",
    grow ? "is-grow" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      {label ? <div className="travel-field-card__label">{label}</div> : null}

      <div className="travel-field-card__body">
        {Icon ? (
          <span className="travel-field-card__icon">
            <Icon size={22} />
          </span>
        ) : null}

        <div className="travel-field-card__copy">
          <strong>{title}</strong>
          {subtitle ? <small>{subtitle}</small> : null}
        </div>
      </div>
    </div>
  );
}

function SearchButton() {
  return (
    <button type="button" className="travel-search__submit" aria-label="Tìm kiếm">
      <Search size={26} />
    </button>
  );
}

export default function MuaSamKhachHang() {
  const [activeTab, setActiveTab] = useState<ServiceId>("flight");
  const [tripMode, setTripMode] = useState<"single" | "multi">("single");

  const renderPanel = () => {
    if (activeTab === "hotel") {
      return (
        <div className="travel-panel travel-panel--hotel">
          <div className="travel-subtabs">
            {hotelFilters.map((item, index) => (
              <button
                key={item}
                type="button"
                className={index === 0 ? "travel-chip is-active" : "travel-chip"}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="travel-form">
            <div className="travel-form__layout travel-form__layout--hotel">
              <FieldCard
                label="Thành phố, địa điểm hoặc tên khách sạn"
                title="Thành phố, khách sạn, điểm đến"
                icon={MapPinned}
                placeholder
              />
              <FieldCard
                label="Ngày nhận phòng và trả phòng"
                title="31 thg 3 2026 - 01 thg 4 2026"
                icon={CalendarDays}
              />
              <FieldCard label="Khách và Phòng" title="2 người lớn, 0 Trẻ em, 1 phòng" icon={Users} />
              <SearchButton />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "flight") {
      return (
        <div className="travel-panel travel-panel--flight">
          <div className="travel-subtabs">
            {flightModes.map((item, index) => (
              <button
                key={item}
                type="button"
                className={
                  (index === 0 && tripMode === "single") || (index === 1 && tripMode === "multi")
                    ? "travel-chip is-active"
                    : "travel-chip"
                }
                onClick={() => setTripMode(index === 0 ? "single" : "multi")}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="travel-form">
            <div className="travel-form__layout travel-form__layout--flight">
              <FieldCard
                label="Từ"
                title="TP HCM (SGN)"
                subtitle="Sân bay Tân Sơn Nhất"
                icon={PlaneTakeoff}
              />
              <div className="travel-field-switch" aria-hidden="true">
                ↻
              </div>
              <FieldCard label="Đến" title="Bangkok (BKKA)" subtitle="Tất cả sân bay" icon={PlaneTakeoff} />
              <FieldCard label="Ngày khởi hành" title="1 thg 4 2026" icon={CalendarDays} />
              <FieldCard label="Khứ hồi" title="3 thg 4 2026" icon={CalendarDays} muted />
              <SearchButton />
            </div>
          </div>

          <div className="travel-search__footer">
            <div className="travel-search__footer-title">Tìm kiếm</div>
            <div className="travel-search__footer-links">
              <a href="#uu-dai">
                <CircleDollarSign size={16} />
                Khám phá ý tưởng chuyến bay
              </a>
              <a href="#uu-dai">
                <CircleDollarSign size={16} />
                Cảnh báo giá
              </a>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "bus") {
      return (
        <div className="travel-panel travel-panel--bus">
          <div className="travel-form">
            <div className="travel-form__layout travel-form__layout--bus">
              <FieldCard label="Từ" title="Nhập thành phố, nhà ga hoặc bến xe" icon={Train} placeholder />
              <div className="travel-field-switch" aria-hidden="true">
                ↻
              </div>
              <FieldCard label="Đến" title="Nhập thành phố, nhà ga hoặc bến xe" icon={Train} placeholder />
              <FieldCard label="Ngày khởi hành" title="31 thg 3 2026" icon={CalendarDays} />
              <FieldCard label="Khứ hồi" title="2 thg 4 2026" icon={CalendarDays} muted placeholder />
              <FieldCard label="Số ghế" title="1 hành khách" icon={Users} />
              <SearchButton />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "airport") {
      return (
        <div className="travel-panel travel-panel--airport">
          <div className="travel-form">
            <div className="travel-form__layout travel-form__layout--airport">
              <FieldCard label="Từ sân bay" title="Ví dụ Sân bay quốc tế Narita" icon={PlaneTakeoff} placeholder />
              <div className="travel-field-switch" aria-hidden="true">
                ↻
              </div>
              <FieldCard
                label="Đến khu vực, địa chỉ, tòa nhà"
                title="Ví dụ Trung tâm mua sắm AEON Narita"
                icon={MapPinned}
                placeholder
              />
              <FieldCard label="Ngày đón" title="31 thg 3, 2026" icon={CalendarDays} />
              <FieldCard label="Giờ đón" title="17:10" icon={CircleDollarSign} />
              <SearchButton />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "car") {
      return (
        <div className="travel-panel travel-panel--car">
          <div className="travel-subtabs">
            {carFilters.map((item, index) => (
              <button
                key={item}
                type="button"
                className={index === 0 ? "travel-chip is-active" : "travel-chip"}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="travel-form">
            <div className="travel-form__layout travel-form__layout--car">
              <FieldCard label="Địa điểm thuê xe của bạn" title="Điền thành phố, sân bay" icon={MapPinned} placeholder />
              <FieldCard label="Ngày bắt đầu" title="2 thg 4, 2026" icon={CalendarDays} />
              <FieldCard label="Giờ bắt đầu" title="09:00" icon={CircleDollarSign} />
              <FieldCard label="Ngày kết thúc" title="4 thg 4, 2026" icon={CalendarDays} />
              <FieldCard label="Giờ kết thúc" title="09:00" icon={CircleDollarSign} />
              <SearchButton />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="travel-panel travel-panel--activity">
        <div className="travel-form">
          <div className="travel-activity-search">
            <div className="travel-activity-search__box">
              <Search size={24} />
              <span>Bạn có ý tưởng gì cho chuyến đi tiếp theo không?</span>
            </div>
            <button type="button" className="travel-activity-search__submit" aria-label="Tìm ý tưởng">
              <Search size={24} />
            </button>
            <button type="button" className="travel-activity-idea">
              <MapPinned size={22} />
              <span>Khám phá ý tưởng</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="travel-activity-caption">
          Hoặc chọn một danh mục để mở khóa trải nghiệm tiếp theo của bạn
        </div>

        <div className="travel-activity-tags">
          {activityTags.map((item) => (
            <button key={item} type="button" className="travel-activity-tag">
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="travel-home">
      <section className="travel-home__search-shell">
        <div className="customer-shell__container">
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

            {renderPanel()}
          </section>
        </div>
      </section>

      <section className="travel-home__deals" id="uu-dai">
        <div className="customer-shell__container">
          <div className="travel-home__deals-header">
            <div>
              <div className="travel-home__eyebrow">Trang chủ khách hàng</div>
              <h2>Phần bên dưới để tiếp tục mở rộng banner, deal và sản phẩm du lịch</h2>
            </div>
            <p>
              Bố cục này giữ đúng tinh thần ảnh mẫu: hero lớn phía trên, nội dung thương mại ở dưới,
              dễ nối thêm API và component thực tế sau này.
            </p>
          </div>

          <div className="travel-home__deal-grid">
            {quickActions.map((item) => (
              <article key={item.title} className="travel-home__deal-card">
                <div className="travel-home__deal-badge">{item.title}</div>
                <p>{item.body}</p>
                <button type="button">Xem thêm</button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
