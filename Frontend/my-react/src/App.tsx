import AppRouter from './routes';

function App() {
  return <AppRouter />;
}

export default App;
// import React, { useState } from 'react';
// import { Avatar, Dropdown } from 'antd';
// import logo from './assets/images/thuonghieu.jpg';
// import {
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   LaptopOutlined,
//   UserOutlined,
//   NotificationOutlined,
//   LogoutOutlined, 
// } from '@ant-design/icons';
// import type { MenuProps } from 'antd';
// import { Button, Layout, Menu, theme } from 'antd';

// const { Header, Content, Sider } = Layout;

// const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
//   (icon, index) => {
//     const key = String(index + 1);

//     return {
//       key: `sub${key}`,
//       icon: React.createElement(icon),
//       label: `subnav ${key}`,
//       children: Array.from({ length: 4 }).map((_, j) => {
//         const subKey = index * 4 + j + 1;
//         return {
//           key: subKey,
//           label: `option${subKey}`,
//         };
//       }),
//     };
//   },
// );
// const userMenu = [
//   {
//     key: 'profile',
//     label: 'Thông tin cá nhân',
//   },
//   {
//     key: 'logout',
//     icon: <LogoutOutlined />,
//     label: 'Đăng xuất',
//   },
// ];
// const App: React.FC = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

//   return (
//     <Layout style={{ minWidth: '100vh' }}>
//       <Sider
//         trigger={null}
//         collapsible
//         collapsed={collapsed}
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           height: '100vh',
//           background: '#fff' // ❗ bỏ màu đen
//         }}
//       >
//         {/* LOGO */}
//         <div
//           style={{
//             height: 64,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             borderBottom: '1px solid #f0f0f0'
//           }}
//         >
//           <img
//             src={logo}
//             alt="logo"
//             style={{ objectFit: 'cover', width: '100%', height: '100%' }}
//           />
//         </div>

//         {/* MENU */}
//         <Menu
//           mode="inline"
//           defaultSelectedKeys={['1']}
//           defaultOpenKeys={['sub1']}
//           style={{
//             flex: 1,     
//             overflow: 'auto',
//             borderInlineEnd: 0
//           }}
//           items={items2}
//         />

//         {/* USER */}
//         <div
//           style={{
//             padding: 16,
//             borderTop: '1px solid #f0f0f0',
//             display: 'flex',
//             alignItems: 'center',
//             gap: 10,
//           }}
//         >
//           <Dropdown menu={{ items: userMenu }} placement="topRight">
//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 10,
//                 cursor: 'pointer',
//               }}
//             >
//               <Avatar size={40} icon={<UserOutlined />} />
//               {!collapsed && <span>Tiến Anh</span>}
//             </div>
//           </Dropdown>
//         </div>
//       </Sider>
//       <Layout>
//         <Header
//           style={{
//             padding: '0 16px',
//             background: colorBgContainer,
//             display: 'flex',
//             justifyContent: 'flex-start',
//             alignItems: 'center',
//           }}
//         >
//           <Button
//             type="text"
//             icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//             onClick={() => setCollapsed(!collapsed)}
//             style={{
//               fontSize: '18px',
//               width: 64,
//               height: 64,
//             }}
//           />
//         </Header>

//         {/* CONTENT */}
//         <Content
//           style={{
//             margin: '24px 16px',
//             padding: 24,
//             minHeight: 280,
//             background: colorBgContainer,
//             borderRadius: borderRadiusLG,
//           }}
//         >
//           Content
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default App;