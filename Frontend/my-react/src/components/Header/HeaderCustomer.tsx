import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgePercent,
  Bell,
  ChevronDown,
  CreditCard,
  LogOut,
  PlaneTakeoff,
  ReceiptText,
  User,
} from "lucide-react";
import baibienImage from "../../assets/images/baibien.jpg";
import { clearCurrentSession, getCurrentSession } from "../../utils/auth";
import "../../assets/css/HeaderCustomer.css";

const customerMenuItems = [
  {
    id: "profile",
    label: "Chỉnh sửa hồ sơ",
    description: "Cập nhật thông tin tài khoản và ưu đãi cá nhân.",
    icon: User,
    href: "#uu-dai",
  },
  {
    id: "cards",
    label: "Thẻ của tôi",
    description: "Quản lý voucher, thẻ thành viên và quyền lợi đã lưu.",
    icon: CreditCard,
    href: "#uu-dai",
  },
  {
    id: "transactions",
    label: "Danh sách giao dịch",
    description: "Xem nhanh các thanh toán và lịch sử đơn hàng gần đây.",
    icon: ReceiptText,
    href: "#uu-dai",
  },
  {
    id: "bookings",
    label: "Đặt chỗ của tôi",
    description: "Quay lại khu tìm kiếm để tiếp tục đặt dịch vụ.",
    icon: PlaneTakeoff,
    href: "#tim-kiem",
  },
  {
    id: "notifications",
    label: "Thông báo giá vé máy bay",
    description: "Theo dõi chặng yêu thích để nhận mức giá tốt hơn.",
    icon: Bell,
    href: "#tim-kiem",
  },
  {
    id: "promotions",
    label: "Khuyến mãi",
    description: "Mở ngay các deal đang nổi bật dành cho khách hàng.",
    icon: BadgePercent,
    href: "#uu-dai",
  },
] as const;

export default function HeaderCustomer() {
  const navigate = useNavigate();
  const session = getCurrentSession();
  const isCustomerSession = session?.role === "customer";
  const customerInitials =
    session?.fullName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((item) => item[0]?.toUpperCase())
      .join("") ?? "KH";
  const customerMenuRef = useRef<HTMLDivElement | null>(null);
  const [isCustomerMenuOpen, setIsCustomerMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsHeaderScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isCustomerMenuOpen) {
      return undefined;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!customerMenuRef.current?.contains(event.target as Node)) {
        setIsCustomerMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCustomerMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCustomerMenuOpen]);

  function handleLogout() {
    clearCurrentSession();
    setIsCustomerMenuOpen(false);
    navigate("/dang-nhap", { replace: true });
  }

  return (
    <section
      className="customer-hero"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(7, 24, 43, 0.28) 0%, rgba(7, 24, 43, 0.56) 100%), url(${baibienImage})`,
      }}
    >
      <div className="customer-hero__overlay" />

      <header className={isHeaderScrolled ? "customer-header is-scrolled" : "customer-header"}>
        <div className="customer-header__surface">
          <div className="customer-shell__container customer-header__surface-inner">
            <div className="customer-header__row">
              <div className="customer-header__brand">
                <Link to="/mua-sam" className="customer-header__brand-text">
                  traveloka
                </Link>
              </div>

              <div className="customer-header__group">
                <nav className="customer-header__top-links">
                  <a href="#uu-dai">Khuyến mãi</a>
                  <a href="#uu-dai">Hợp tác với chúng tôi</a>
                  <a href="#uu-dai">Hỗ trợ</a>
                  <a href="#uu-dai">Đặt chỗ của tôi</a>
                </nav>

                <div className="customer-header__auth">
                  {isCustomerSession ? (
                    <div className="customer-header__menu" ref={customerMenuRef}>
                      <button
                        type="button"
                        className="customer-header__menu-trigger"
                        onClick={() => setIsCustomerMenuOpen((currentValue) => !currentValue)}
                        aria-haspopup="menu"
                        aria-expanded={isCustomerMenuOpen}
                      >
                        <span className="customer-header__menu-avatar">{customerInitials}</span>
                        <span className="customer-header__menu-identity">
                          <strong>{session.fullName}</strong>
                          <small>0 điểm</small>
                        </span>
                        <ChevronDown
                          size={16}
                          className={
                            isCustomerMenuOpen
                              ? "customer-header__menu-chevron is-open"
                              : "customer-header__menu-chevron"
                          }
                        />
                      </button>

                      {isCustomerMenuOpen ? (
                        <div className="customer-header__menu-panel" role="menu">
                          <div className="customer-header__menu-hero">
                            <div className="customer-header__menu-copy">
                              <strong>{session.fullName}</strong>
                              <span>{session.email}</span>
                            </div>
                            <div className="customer-header__menu-badge">Thành viên Bronze Priority</div>
                          </div>

                          <div className="customer-header__menu-points">
                            <span className="customer-header__menu-points-label">TravelHub+</span>
                            <strong>0 điểm</strong>
                          </div>

                          <div className="customer-header__menu-list">
                            {customerMenuItems.map((item) => {
                              const Icon = item.icon;

                              return (
                                <a
                                  key={item.id}
                                  href={item.href}
                                  className="customer-header__menu-item"
                                  role="menuitem"
                                  onClick={() => setIsCustomerMenuOpen(false)}
                                >
                                  <span className="customer-header__menu-item-icon">
                                    <Icon size={18} />
                                  </span>
                                  <span className="customer-header__menu-item-copy">
                                    <strong>{item.label}</strong>
                                    <small>{item.description}</small>
                                  </span>
                                </a>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            className="customer-header__menu-logout"
                            onClick={handleLogout}
                          >
                            <LogOut size={18} />
                            Đăng xuất
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <Link
                        to="/dang-nhap"
                        className="customer-header__button customer-header__button--light"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/dang-ky"
                        className="customer-header__button customer-header__button--primary"
                      >
                        Đăng ký
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            <nav className="customer-header__categories">
              <a href="#uu-dai">Khách sạn</a>
              <a href="#tim-kiem">Vé máy bay</a>
              <a href="#uu-dai">Vé xe khách</a>
              <a href="#uu-dai">Đưa đón sân bay</a>
              <a href="#uu-dai">Cho thuê xe</a>
              <a href="#uu-dai">Hoạt động & Vui chơi</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="customer-shell__container customer-hero__container" />
    </section>
  );
}
