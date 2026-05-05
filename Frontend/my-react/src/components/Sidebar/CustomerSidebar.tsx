import { Link } from "react-router-dom";
import { Ticket, FileText, User, LogOut } from "lucide-react";
import { getCurrentSession, clearCurrentSession } from "../../utils/auth";
import "../../assets/css/CustomerTransactions.css"; // Reuse sidebar styles

const userMock = {
  name: "Anh Dương",
  provider: "Google",
  membership: "Bronze Priority",
};

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#7d5918" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export interface CustomerSidebarProps {
  activeKey: "transactions" | "profile" | "bookings";
}

export default function CustomerSidebar({ activeKey }: CustomerSidebarProps) {
  const session = getCurrentSession();
  const userName = session?.fullName || userMock.name;

  // Lấy 2 chữ cái đầu
  const avatarText = userName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="transactions-sidebar profile-sidebar">
      {/* Thông tin user */}
      <div className="user-card">
        <div className="user-card-avatar">{avatarText}</div>
        <div className="user-card-info">
          <h3 className="name">{userName}</h3>
          <div className="provider">{userMock.provider}</div>
        </div>
      </div>

      {/* Membership */}
      <div className="membership-card">
        <div style={{ background: "#fff", borderRadius: "50%", padding: 4, display: "flex" }}>
          <StarIcon />
        </div>
        <span>Bạn là thành viên {userMock.membership}</span>
      </div>

      {/* Menu */}
      <div className="menu-sidebar">
        <ul className="menu-list">
          <Link to="/mua-sam/dat-cho-cua-toi" style={{ textDecoration: "none", color: "inherit" }}>
            <li className={`menu-item ${activeKey === "bookings" ? "active" : ""}`}>
              <Ticket size={20} />
              Đặt chỗ của tôi
            </li>
          </Link>
          
          <Link to="/mua-sam/giao-dich" style={{ textDecoration: "none", color: "inherit" }}>
            <li className={`menu-item ${activeKey === "transactions" ? "active" : ""}`}>
              <FileText size={20} />
              Danh sách giao dịch
            </li>
          </Link>
          
          <div className="menu-divider" />
          
          <Link to="/mua-sam/tai-khoan" style={{ textDecoration: "none", color: "inherit" }}>
            <li className={`menu-item ${activeKey === "profile" ? "active" : ""}`}>
              <User size={20} />
              Tài khoản
            </li>
          </Link>
          
          <li
            className="menu-item"
            onClick={() => {
              clearCurrentSession();
              window.location.href = "/dang-nhap";
            }}
          >
            <LogOut size={20} />
            Đăng xuất
          </li>
        </ul>
      </div>
    </div>
  );
}
