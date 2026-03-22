import { Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const userMenu: MenuProps['items'] = [
  { key: 'profile', label: 'Thông tin cá nhân' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
];

const UserDropdown = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <div
      style={{
        padding: 16,
        borderTop: '1px solid #f0f0f0'
      }}
    >
      <Dropdown menu={{ items: userMenu }} placement="topRight">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer'
          }}
        >
          <Avatar size={40} icon={<UserOutlined />} />
          {!collapsed && <span>Tiến Anh</span>}
        </div>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;