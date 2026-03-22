import { Layout, Menu } from 'antd';
// import {
//   LaptopOutlined,
//   UserOutlined,
//   NotificationOutlined
// } from '@ant-design/icons';
// import React from 'react';
// import type { MenuProps } from 'antd';
import Logo from '../Logo/thuonghieu';
import UserDropdown from '../User/user';
import { useNavigate } from 'react-router-dom';
import { DashboardOutlined } from '@ant-design/icons';

const items = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
];
// const items: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
//   (icon, index) => {
//     const key = String(index + 1);
//     return {
//       key: `sub${key}`,
//       icon: React.createElement(icon),
//       label: `subnav ${key}`,
//       children: Array.from({ length: 4 }).map((_, j) => ({
//         key: index * 4 + j + 1,
//         label: `option${index * 4 + j + 1}`,
//       })),
//     };
//   }
// ); 
const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
    const navigate = useNavigate();
    const { Sider } = Layout;
  return (
    <Sider
      collapsed={collapsed}
      trigger={null}
      collapsible
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#fff'
      }}
    >
      <Logo />

      <Menu
        // mode="inline"
        // defaultSelectedKeys={['1']}
        // defaultOpenKeys={['sub1']}
        // style={{ flex: 1, overflow: 'auto' }}
        // items={items}
        onClick={(e) => navigate(e.key)}
        items={items}
      />

      <UserDropdown collapsed={collapsed} />
    </Sider>
  );
};

export default Sidebar;