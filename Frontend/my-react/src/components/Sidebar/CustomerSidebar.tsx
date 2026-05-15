import { Link } from "react-router-dom";
import { Ticket, FileText, User, LogOut } from "lucide-react";
import { getCurrentSession, clearCurrentSession } from "../../utils/auth";
import "../../assets/css/CustomerTransactions.css"; // Reuse sidebar styles

const userMock = {
  name: "Anh Dương",
  provider: "Google",
};


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
