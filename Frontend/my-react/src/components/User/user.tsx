import { Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { clearCurrentSession, getCurrentSession } from '../../utils/auth';

type Props = {
  collapsed: boolean;
};

const UserDropdown = ({ collapsed }: Props) => {
  const navigate = useNavigate();
  const currentSession = getCurrentSession();

  const userMenu: MenuProps = {
    items: [
      { key: 'profile', label: 'Thong tin ca nhan' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Dang xuat' },
    ],
    onClick: ({ key }) => {
      if (key === 'logout') {
        clearCurrentSession();
        navigate('/dang-nhap');
      }
    },
  };

  return (
    <div
      style={{
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
    >
      <Dropdown menu={userMenu} placement="topRight">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%',
          }}
        >
          <Avatar size={40} icon={<UserOutlined />} />
          {!collapsed && <span>{currentSession?.fullName ?? 'Tai khoan'}</span>}
        </div>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;
