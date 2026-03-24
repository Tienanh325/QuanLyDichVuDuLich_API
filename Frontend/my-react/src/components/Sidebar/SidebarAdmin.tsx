import { useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlane,
  faMapLocationDot,
  faTicket,
  faTrain,
  faGamepad
} from '@fortawesome/free-solid-svg-icons';
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  UserOutlined,
  HomeOutlined,
  BankOutlined,
  StarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  InsertRowAboveOutlined 
} from '@ant-design/icons';
import ThuongHieu from '../../assets/images/thuonghieu.jpg';
import UserDropdown from '../User/user';

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

export default function SidebarAdmin({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const handleCloseSubmenu = () => {
    setOpenVe(null);
  };
  // ✅ route state
  const isVeRoute = location.pathname.includes('/Ve');

  // ✅ user control (null = chưa click)
  const [openVe, setOpenVe] = useState<boolean | null>(null);

  // ✅ logic mở menu chuẩn
  const isOpenVe = openVe === null ? isVeRoute : openVe;

  // style chung
  const linkStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    minHeight: 44,
    padding: collapsed ? '10px 0' : '10px 12px',
    borderRadius: 12,
    color: isActive ? '#8b5cf6' : '#64748b',
    background: isActive ? 'rgba(139, 92, 246, 0.10)' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s',
    gap: collapsed ? 0 : 10,
    fontSize: 15,
    fontWeight: isActive ? 600 : 500,
    overflow: 'hidden'
  });

  const faStyle = { fontSize: 16, width: 16 };

  return (
    <aside
      style={{
        width: collapsed ? 80 : 260,
        minWidth: collapsed ? 80 : 260,
        flexShrink: 0,
        transition: 'width 0.2s ease',
        background: '#ffffff',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        borderRight: '1px solid #eef2f7',
        overflow: 'hidden'
      }}
    >
      {/* HEADER */}
      <div
        style={{
          height: 60,
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'space-between',
          marginBottom: 10
        }}
      >
        {!collapsed && (
          <img src={ThuongHieu} alt="logo" style={{ width: '80%', height: 60 }} />
        )}

        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{ cursor: 'pointer', fontSize: 20 }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>

      {/* MENU */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: 4 }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <NavLink to="/Thongke" onClick={handleCloseSubmenu} style={({ isActive }) => linkStyle(isActive)}>
            <DashboardOutlined />
            {!collapsed && <span>Thống kê</span>}
          </NavLink>

          <NavLink to="/DichVu" onClick={handleCloseSubmenu} style={({ isActive }) => linkStyle(isActive)}>
            <InsertRowAboveOutlined />
            {!collapsed && <span>Dịch vụ</span>}
          </NavLink>

          <NavLink to="/LoaiVe" onClick={handleCloseSubmenu}style={({ isActive }) => linkStyle(isActive)}>
            <AppstoreOutlined />
            {!collapsed && <span>Loại vé</span>}
          </NavLink>

          <NavLink to="/KhachSan" onClick={handleCloseSubmenu} style={({ isActive }) => linkStyle(isActive)}>
            <HomeOutlined />
            {!collapsed && <span>Khách sạn</span>}
          </NavLink>

          <NavLink to="/Tour" onClick={handleCloseSubmenu} style={({ isActive }) => linkStyle(isActive)}>
            <FontAwesomeIcon icon={faMapLocationDot} style={faStyle} />
            {!collapsed && <span>Tour</span>}
          </NavLink>

          <div>
            <div
              onClick={() => {
                setOpenVe(prev =>
                  prev === null ? !isVeRoute : !prev
                );
                navigate('/Ve');
              }}
              style={{
                ...linkStyle(isVeRoute),
                cursor: 'pointer',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FontAwesomeIcon icon={faTicket} style={faStyle} />
                {!collapsed && <span>Vé</span>}
              </div>

              {!collapsed && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenVe(prev =>
                      prev === null ? !isVeRoute : !prev
                    );
                  }}
                  style={{
                    transform: isOpenVe ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: '0.2s'
                  }}
                >
                  ▶
                </span>
              )}
            </div>
            <div
              style={{
                maxHeight: isOpenVe && !collapsed ? '500px' : '0px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                marginLeft: collapsed ? 0 : 20
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6}}>

                <NavLink to="/VeMayBay"  style={({ isActive }) => linkStyle(isActive)}>
                  <FontAwesomeIcon icon={faPlane} style={faStyle} />
                  {!collapsed && <span>Vé máy bay</span>}
                </NavLink>

                <NavLink to="/VeTauHoa" style={({ isActive }) => linkStyle(isActive)}>
                  <FontAwesomeIcon icon={faTrain} style={faStyle} />
                  {!collapsed && <span>Vé tàu hỏa</span>}
                </NavLink>

                <NavLink to="/VeKhuVuiChoi" style={({ isActive }) => linkStyle(isActive)}>
                  <FontAwesomeIcon icon={faGamepad} style={faStyle} />
                  {!collapsed && <span>Vé khu vui chơi</span>}
                </NavLink>

              </div>
            </div>
          </div>

          <NavLink to="/KhuyenMai" onClick={handleCloseSubmenu} style={({ isActive }) => linkStyle(isActive)}>
            <TagsOutlined />
            {!collapsed && <span>Khuyến mãi</span>}
          </NavLink>

          <NavLink to="/DanhGia" onClick={handleCloseSubmenu} style={({ isActive }) => linkStyle(isActive)}>
            <StarOutlined />
            {!collapsed && <span>Đánh giá</span>}
          </NavLink>

          <NavLink to="/DonHang" onClick={handleCloseSubmenu} style={({ isActive }) => linkStyle(isActive)}>
            <ShoppingCartOutlined />
            {!collapsed && <span>Đơn hàng</span>}
          </NavLink>

          <NavLink to="/NhaCungCap" onClick={handleCloseSubmenu} style={({ isActive }) => linkStyle(isActive)}>
            <BankOutlined />
            {!collapsed && <span>Nhà cung cấp</span>}
          </NavLink>

          <NavLink to="/KhachHang" onClick={handleCloseSubmenu} style={({ isActive }) => linkStyle(isActive)}>
            <UserOutlined />
            {!collapsed && <span>Khách hàng</span>}
          </NavLink>

        </nav>
      </div>

      {/* USER */}
      <UserDropdown collapsed={collapsed} />
    </aside>
  );
}
