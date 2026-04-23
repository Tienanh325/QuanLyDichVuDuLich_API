import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Badge, Tooltip, Popover } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const TITLE_MAP: Record<string, string> = {
  '/ThongKe': 'thống kê',
  '/DichVu': 'dịch vụ',
  '/LoaiVe': 'loại vé',
  '/KhachSan': 'khách sạn',
  '/Tour': 'tour',
  '/Ve': 'vé',
  '/VeMayBay': 'vé máy bay',
  '/VeTauHoa': 'vé tàu hỏa',
  '/VeKhuVuiChoi': 'vé khu vui chơi',
  '/KhuyenMai': 'khuyến mãi',
  '/DanhGia': 'đánh giá',
  '/DonHang': 'đơn hàng',
  '/NhaCungCap': 'nhà cung cấp',
  '/KhachHang': 'khách hàng',
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    avatar: 'https://i.pravatar.cc/150?img=11',
    title: 'Hệ thống',
    content: 'Dịch vụ máy chủ đang được bảo trì',
    time: '13 giờ trước',
    isRead: false,
  },
  {
    id: 2,
    avatar: 'https://i.pravatar.cc/150?img=12',
    title: 'Cảnh báo',
    content: 'Có 5 đơn hàng đang chờ xử lý quá hạn',
    time: '16 giờ trước',
    isRead: false,
  },
  {
    id: 3,
    avatar: 'https://i.pravatar.cc/150?img=13',
    title: 'Khách hàng',
    content: 'Nguyễn Văn A vừa đánh giá 1 sao',
    time: '18 giờ trước',
    isRead: false,
  },
  {
    id: 4,
    avatar: 'https://i.pravatar.cc/150?img=14',
    title: 'Hệ thống',
    content: 'Đã hoàn tất sao lưu dữ liệu ngày hôm nay',
    time: '22 giờ trước',
    isRead: true,
  }
];

export default function HeaderBar() {
  const { pathname } = useLocation();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

  const title =
    Object.entries(TITLE_MAP).find(([p]) => pathname === p || pathname.startsWith(p + '/'))?.[1] ||
    'thống kê';

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const popoverContent = (
    <div style={{ width: 400, maxHeight: 500, display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden' }}>
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
      <div style={{ padding: '16px 24px 8px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Thông báo</h3>
      </div>
      
      <div style={{ display: 'flex', gap: 10, padding: '0 24px 12px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div 
          style={{ 
            padding: '6px 16px', 
            borderRadius: 20, 
            cursor: 'pointer',
            background: filter === 'all' ? '#e6f7ff' : 'transparent',
            color: filter === 'all' ? '#1890ff' : '#000',
            fontWeight: filter === 'all' ? 600 : 500,
            transition: 'all 0.2s'
          }}
          onClick={() => setFilter('all')}
        >
          Tất cả
        </div>
        <div 
          style={{ 
            padding: '6px 16px', 
            borderRadius: 20, 
            cursor: 'pointer',
            background: filter === 'unread' ? '#e6f7ff' : 'transparent',
            color: filter === 'unread' ? '#1890ff' : '#000',
            fontWeight: filter === 'unread' ? 600 : 500,
            transition: 'all 0.2s'
          }}
          onClick={() => setFilter('unread')}
        >
          Chưa đọc
        </div>
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', maxHeight: 400 }}>
        {filteredNotifications.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: '#999' }}>Không có thông báo nào</div>
        ) : (
          filteredNotifications.map(n => (
            <div 
              key={n.id} 
              onClick={() => markAsRead(n.id)}
              style={{ 
                display: 'flex', 
                gap: 12, 
                padding: '12px 24px', 
                cursor: 'pointer',
                background: n.isRead ? '#dcfce7' : '#fee2e2',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background 0.3s'
              }}
            >
              <img src={n.avatar} alt="avatar" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                  {n.title}
                </div>
                <div style={{ color: '#475569', fontSize: 14, marginBottom: 4 }}>
                  {n.content}
                </div>
                <div style={{ color: '#1890ff', fontSize: 13, fontWeight: 500 }}>
                  {n.time}
                </div>
              </div>
              {!n.isRead && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <header
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid #e6edf3',
        background: '#fff',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18, whiteSpace: 'nowrap', textTransform: 'capitalize' }}>{title}</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Popover content={popoverContent} trigger="click" placement="bottomRight" arrow={false} overlayInnerStyle={{ padding: 0, borderRadius: 12, overflow: 'hidden' }}>
            <Tooltip title="Thông báo dịch vụ">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 8, borderRadius: '50%', transition: 'background 0.2s' }} 
                   onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                   onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Badge count={unreadCount} size="small" style={{ backgroundColor: '#ef4444' }}>
                  <BellOutlined style={{ fontSize: 20, color: '#475569' }} />
                </Badge>
              </div>
            </Tooltip>
          </Popover>
        </div>
      </div>
    </header>
  );
}
