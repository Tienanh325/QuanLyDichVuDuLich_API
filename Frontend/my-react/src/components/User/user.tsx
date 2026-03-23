import { Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const userMenu: MenuProps['items'] = [
  { key: 'profile', label: 'Thông tin cá nhân' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
];

type Props = {
  collapsed: boolean;
};

const UserDropdown = ({ collapsed }: Props) => {
  return (
    <div
      style={{
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: collapsed ? 'center' : 'flex-start'
      }}
    >
      <Dropdown menu={{ items: userMenu }} placement="topRight">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%'
          }}
        >
          <Avatar size={40} icon={<UserOutlined />} />

          {/* 🔥 ẨN TÊN KHI COLLAPSE */}
          {!collapsed && <span>Tiến Anh</span>}
        </div>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;