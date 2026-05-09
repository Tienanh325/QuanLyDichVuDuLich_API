import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentSession } from '../utils/auth';
import SidebarAdmin from '../components/Sidebar/SidebarAdmin';
import HeaderBar from '../components/Header/HeaderBar';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      navigate('/dang-nhap', { state: { from: location.pathname }, replace: true });
    } else if (session.role !== 'admin') {
      navigate('/mua-sam', { replace: true });
    }
  }, [navigate, location]);

  const session = getCurrentSession();
  if (!session || session.role !== 'admin') {
    return null;
  }

  return (
    <div className="app-root" style={{ height: '100vh', display: 'flex', width: '100%', overflow: 'hidden' }}>
      <SidebarAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <HeaderBar />
        <main style={{ flex: 1, minWidth: 0, overflow: 'auto', background:'#ededed' }}>
          <Outlet />
        </main> 
      </div>
    </div>
  );
}
