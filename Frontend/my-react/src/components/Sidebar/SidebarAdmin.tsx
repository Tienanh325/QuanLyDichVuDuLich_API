import { NavLink } from 'react-router-dom';
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  GiftOutlined,
  TagsOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import ThuongHieu from '../../assets/images/thuonghieu.jpg';
import UserDropdown from '../User/user';
type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};
export default function SidebarAdmin({ collapsed, setCollapsed }: SidebarProps) {
  const linkStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    padding: '10px 12px',
    borderRadius: 8,
    color: isActive ? '#8b5cf6' : '#64748b',
    textDecoration: 'none',
    transition: 'all 0.2s'
  });
  return (
    <aside
      style={{
        width: collapsed ? 80 : 260,
        transition: 'width 0.25s ease',
        background: '#ffffff',
        color: '#838383',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'relative'
      }}
    >
      <div
        style={{
          height: 60,
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'space-between',
          marginBottom: 10
        }}
      >
        {/* Logo */}
        {!collapsed && (
          <img src={ThuongHieu} alt="logo" style={{ width: '80%' , height:60}} />
        )}

        {/* Toggle */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{
            height: '100%',               
            aspectRatio: collapsed ? '1' : 'auto', 
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 20,
            color: '#64748b',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#8b5cf6')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
      {/* Menu */}
      <div style={{ flex: 1 }}>
        <nav style={{ display: 'flex',
          flexDirection: 'column',
          gap: 12
           }}>
          <NavLink to="/dashboard" style={({ isActive }) => linkStyle(isActive)}>
            <DashboardOutlined  />
            {!collapsed && <span style={{ marginLeft: 10 }}>Dashboard</span>}
          </NavLink>

          <NavLink to="/categories" style={({ isActive }) => linkStyle(isActive)}>
            <AppstoreOutlined />
            {!collapsed && <span style={{ marginLeft: 10 }}>Danh mục</span>}
          </NavLink>

          <NavLink to="/products" style={({ isActive }) => linkStyle(isActive)}>
            <ShoppingOutlined />
            {!collapsed && <span style={{ marginLeft: 10 }}>Sản phẩm</span>}
          </NavLink>

          <NavLink to="/discounts" style={({ isActive }) => linkStyle(isActive)}>
            <GiftOutlined />
            {!collapsed && <span style={{ marginLeft: 10 }}>Khuyến mãi</span>}
          </NavLink>

          <NavLink to="/coupons" style={({ isActive }) => linkStyle(isActive)}>
            <TagsOutlined />
            {!collapsed && <span style={{ marginLeft: 10 }}>Phiếu giảm giá</span>}
          </NavLink>

          <NavLink to="/orders" style={({ isActive }) => linkStyle(isActive)}>
            <FileTextOutlined />
            {!collapsed && <span style={{ marginLeft: 10 }}>Đơn hàng</span>}
          </NavLink>

          <NavLink to="/customers" style={({ isActive }) => linkStyle(isActive)}>
            <UserOutlined />
            {!collapsed && <span style={{ marginLeft: 10 }}>Khách hàng</span>}
          </NavLink>

          <NavLink to="/settings" style={({ isActive }) => linkStyle(isActive)}>
            <SettingOutlined />
            {!collapsed && <span style={{ marginLeft: 10 }}>Cài đặt</span>}
          </NavLink>
        </nav>
      </div>

      {/* User ở đáy */}
      <UserDropdown collapsed={collapsed} />
    </aside>
  );
}