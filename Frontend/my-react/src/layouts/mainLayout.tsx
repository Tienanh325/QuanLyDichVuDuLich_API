import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../components/Sidebar/SidebarAdmin';
import HeaderBar from '../components/Header/HeaderBar';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex' }}>
      <SidebarAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column'}}>
        <HeaderBar />
        <main style={{  background:'#ededed' }}>
          <Outlet />
        </main> 
      </div>
    </div>
  );
}
