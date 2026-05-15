import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  BadgePercent,
  ChevronDown,
  LogOut,
  PlaneTakeoff,
  ReceiptText,
  User,
} from "lucide-react";
import { clearCurrentSession, getCurrentSession } from "../../utils/auth";
import { readBookingInfo } from "../../utils/bookingStorage";
import "../../assets/css/CustomerHeader.css";

const customerMenuItems = [
  {
    id: "profile",
    label: "Chỉnh sửa hồ sơ",
    description: "Cập nhật thông tin tài khoản và ưu đãi cá nhân.",
    icon: User,
    href: "/mua-sam/tai-khoan",
  },
  {
    id: "transactions",
    label: "Danh sách giao dịch",
    description: "Xem nhanh các thanh toán và lịch sử đơn hàng gần đây.",
    icon: ReceiptText,
    href: "/mua-sam/giao-dich",
  },
  {
    id: "bookings",
    label: "Đặt chỗ của tôi",
    description: "Quản lý và xem lại tất cả các dịch vụ đã đặt.",
    icon: PlaneTakeoff,
    href: "/mua-sam/dat-cho-cua-toi",
  },
  {
    id: "promotions",
    label: "Khuyến mãi",
    description: "Mở ngay các deal đang nổi bật dành cho khách hàng.",
    icon: BadgePercent,
    href: "/mua-sam/giao-dich",
  },
] as const;

const categoryLinks = [
  { id: "hotel", label: "Khách sạn", to: "/mua-sam/khach-san", activePaths: ["/mua-sam/khach-san", "/mua-sam/ket-qua-khach-san"] },
  { id: "flight", label: "Vé máy bay", to: "/mua-sam/ve-may-bay", activePaths: ["/mua-sam/ve-may-bay", "/mua-sam/ket-qua-ve-may-bay", "/mua-sam/chi-tiet-chuyen-bay"] },
  { id: "train", label: "Vé tàu", to: "/mua-sam/ve-tau", activePaths: ["/mua-sam/ve-tau", "/mua-sam/ket-qua-tau", "/mua-sam/chi-tiet-tau"] },
  { id: "activity", label: "Tour & Hoạt động", to: "/mua-sam/hoat-dong-vui-choi", activePaths: ["/mua-sam/hoat-dong-vui-choi", "/mua-sam/ket-qua-hoat-dong"] },
] as const;

function getCheckoutCategoryId() {
  const booking = readBookingInfo();
  switch (booking?.serviceType) {
    case 'flight':
      return 'flight';
    case 'train':
      return 'train';
    case 'tour':
    case 'activity':
      return 'activity';
    default:
      return 'hotel';
  }
}

function isCheckoutPath(pathname: string) {
  return pathname === '/mua-sam/thanh-toan-khach-san'
    || pathname === '/mua-sam/thanh-toan-dat-cho'
    || pathname === '/mua-sam/thanh-toan-thanh-cong'
    || pathname === '/mua-sam/checkout'
    || pathname === '/mua-sam/thanh-toan'
    || pathname === '/mua-sam/hoan-tat';
}

function isPathActive(link: typeof categoryLinks[number], pathname: string) {
  if (link.activePaths.some((activePath) => pathname === activePath || pathname.startsWith(`${activePath}/`))) {
    return true;
  }
  if (isCheckoutPath(pathname)) {
    return link.id === getCheckoutCategoryId();
  }
  return false;
}

function isLightThemePath(pathname: string) {
  return pathname === '/mua-sam/khach-san'
    || pathname === '/mua-sam/hoat-dong-vui-choi'
    || pathname === '/mua-sam/ve-may-bay'
    || pathname === '/mua-sam/ve-tau'
    || pathname === '/mua-sam/ket-qua-tau'
    || pathname === '/mua-sam/ket-qua-hoat-dong'
    || pathname.startsWith('/mua-sam/khach-san/')
    || pathname.startsWith('/mua-sam/hoat-dong-vui-choi/')
    || pathname.startsWith('/mua-sam/chi-tiet-chuyen-bay/')
    || pathname.startsWith('/mua-sam/chi-tiet-tau/')
    || isCheckoutPath(pathname)
    || pathname === '/mua-sam/giao-dich'
    || pathname === '/mua-sam/tai-khoan'
    || pathname === '/mua-sam/dat-cho-cua-toi';
}

function isDetailThemePath(pathname: string) {
  return pathname.startsWith('/mua-sam/khach-san/')
    || pathname.startsWith('/mua-sam/hoat-dong-vui-choi/')
    || pathname.startsWith('/mua-sam/chi-tiet-chuyen-bay/')
    || pathname.startsWith('/mua-sam/chi-tiet-tau/')
    || isCheckoutPath(pathname)
    || pathname === '/mua-sam/giao-dich'
    || pathname === '/mua-sam/tai-khoan'
    || pathname === '/mua-sam/dat-cho-cua-toi';
}

function getCategoryAccentClass(categoryId: string) {
  switch (categoryId) {
    case 'flight':
      return 'is-flight';
    case 'train':
      return 'is-train';
    case 'activity':
      return 'is-activity';
    default:
      return 'is-hotel';
  }
}

function getCurrentCategoryId(pathname: string) {
  const matched = categoryLinks.find((link) => isPathActive(link, pathname));
  return matched?.id ?? 'hotel';
}

function getCurrentCategoryLabel(pathname: string) {
  const matched = categoryLinks.find((link) => isPathActive(link, pathname));
  return matched?.label ?? 'Đặt chỗ';
}

function getCurrentCategoryPath(pathname: string) {
  const matched = categoryLinks.find((link) => isPathActive(link, pathname));
  return matched?.to ?? '/mua-sam/khach-san';
}

function getCurrentCategoryInfo(pathname: string) {
  const id = getCurrentCategoryId(pathname);
  return {
    id,
    label: getCurrentCategoryLabel(pathname),
    to: getCurrentCategoryPath(pathname),
    accentClass: getCategoryAccentClass(id),
  };
}

function getSuccessOrderLabel(serviceType?: string) {
  switch (serviceType) {
    case 'flight':
      return 'Mã đặt vé';
    case 'train':
      return 'Mã đặt chỗ';
    case 'tour':
    case 'activity':
      return 'Mã đặt hoạt động';
    default:
      return 'Mã đặt phòng';
  }
}

function getSuccessMessage(serviceType?: string) {
  switch (serviceType) {
    case 'flight':
      return 'Cảm ơn bạn đã đặt vé. Thông tin chi tiết đã được gửi đến email của bạn. Quý khách vui lòng kiểm tra hộp thư đến hoặc thư rác.';
    case 'train':
      return 'Cảm ơn bạn đã đặt vé tàu. Thông tin hành trình đã được gửi đến email của bạn. Quý khách vui lòng kiểm tra hộp thư đến hoặc thư rác.';
    case 'tour':
    case 'activity':
      return 'Cảm ơn bạn đã đặt hoạt động. Xác nhận chi tiết đã được gửi đến email của bạn. Quý khách vui lòng kiểm tra hộp thư đến hoặc thư rác.';
    default:
      return 'Cảm ơn bạn đã đặt chỗ. Thông tin chi tiết đã được gửi đến email của bạn. Quý khách vui lòng kiểm tra hộp thư đến hoặc thư rác.';
  }
}

function getSuccessActionLabel(serviceType?: string) {
  switch (serviceType) {
    case 'flight':
      return 'Xem vé điện tử';
    case 'train':
      return 'Xem vé tàu';
    case 'tour':
    case 'activity':
      return 'Xem phiếu xác nhận';
    default:
      return 'Xem phiếu đặt chỗ';
  }
}

function getSuccessTitle(serviceType?: string) {
  switch (serviceType) {
    case 'flight':
      return 'Thanh toán vé máy bay thành công!';
    case 'train':
      return 'Thanh toán vé tàu thành công!';
    case 'tour':
    case 'activity':
      return 'Thanh toán hoạt động thành công!';
    default:
      return 'Thanh toán thành công!';
  }
}

function getCheckoutPageTitle(serviceType?: string) {
  switch (serviceType) {
    case 'flight':
      return 'Thông tin hành khách';
    case 'train':
      return 'Thông tin hành khách';
    case 'tour':
    case 'activity':
      return 'Thông tin người tham gia';
    default:
      return 'Thông tin khách hàng';
  }
}

function getContactGuestLabel(serviceType?: string) {
  switch (serviceType) {
    case 'flight':
    case 'train':
      return 'Tôi là hành khách';
    case 'tour':
    case 'activity':
      return 'Tôi là người tham gia';
    default:
      return 'Tôi là khách lưu trú';
  }
}

function getContactNameLabel(serviceType?: string) {
  switch (serviceType) {
    case 'flight':
    case 'train':
      return 'Họ và tên (như trên giấy tờ tùy thân)';
    default:
      return 'Họ và tên (như trên CCCD/Hộ chiếu)';
  }
}

function getContactNameHint(serviceType?: string) {
  switch (serviceType) {
    case 'flight':
      return 'Vui lòng nhập đúng tên để khớp thông tin làm thủ tục chuyến bay.';
    case 'train':
      return 'Vui lòng nhập đúng tên để khớp thông tin vé tàu.';
    case 'tour':
    case 'activity':
      return 'Vui lòng nhập đúng tên để nhà cung cấp xác nhận danh sách tham gia.';
    default:
      return 'Vui lòng nhập tên đúng định dạng để nhận diện tại quầy.';
  }
}

function getSuccessHeroBadge(serviceType?: string) {
  switch (serviceType) {
    case 'flight':
      return 'VÉ ĐÃ XÁC NHẬN';
    case 'train':
      return 'CHỖ ĐÃ XÁC NHẬN';
    case 'tour':
    case 'activity':
      return 'LỊCH TRÌNH ĐÃ XÁC NHẬN';
    default:
      return 'XÁC NHẬN NGAY';
  }
}

function getServiceHeroImage(serviceType?: string) {
  return serviceType;
}


export default function HeaderCustomer() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getCurrentSession();
  const isCustomerSession = session?.role === "customer";
  const currentCategory = getCurrentCategoryInfo(location.pathname);
  const isHotelPage = isLightThemePath(location.pathname);
  const isHotelDetailPage = isDetailThemePath(location.pathname);
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
    <header className={["customer-header", isHeaderScrolled ? "is-scrolled" : "", (isHotelPage || isHotelDetailPage) ? "is-light-theme" : "", isHotelDetailPage ? "is-detail-page" : ""].filter(Boolean).join(" ")}>
      <div className="customer-header__surface">
        <div className="customer-shell__container customer-header__surface-inner">
          <div className="customer-header__row">
            <div className="customer-header__brand">
              <Link to="/mua-sam" className="customer-header__brand-text">
                Travel
              </Link>
            </div>

            <div className="customer-header__group">
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
                        </div>
                        <div className="customer-header__menu-list">
                          {customerMenuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                              <Link
                                key={item.id}
                                to={item.href}
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
                              </Link>
                            );
                          })}
                        </div>

                        <button type="button" className="customer-header__menu-logout" onClick={handleLogout}>
                          <LogOut size={18} />
                          Đăng xuất
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <Link to="/dang-nhap" className="customer-header__button customer-header__button--light">
                      Đăng nhập
                    </Link>
                    <Link to="/dang-ky" className="customer-header__button customer-header__button--primary">
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <nav className={`customer-header__categories ${currentCategory.accentClass}`}>
            {categoryLinks.map((item) => {
              const isActive = isPathActive(item, location.pathname);

              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={isActive ? "customer-header__category-link is-active" : "customer-header__category-link"}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
