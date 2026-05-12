import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Badge, Tooltip, Popover, Modal, message, Button, Descriptions } from 'antd';
import { BellOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import api from '../../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const TITLE_MAP: Record<string, string> = {
  '/ThongKe': 'thống kê',
  '/DichVu': 'dịch vụ',
  '/LoaiVe': 'loại vé',
  '/KhachSan': 'khách sạn',
  '/Tour': 'tour',
  '/Ve': 'vé',
  '/VeMayBay': 'vé máy bay',
  '/VeTauHoa': 'vé tàu hỏa',
  '/KhuyenMai': 'khuyến mãi',
  '/DanhGia': 'đánh giá',
  '/DonHang': 'đơn hàng',
  '/NhaCungCap': 'nhà cung cấp',
  '/KhachHang': 'khách hàng',
};


export default function HeaderBar() {
  const { pathname } = useLocation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const fetchPendingOrders = async () => {
    try {
      const res = await api.get('/api/admin/don-dat');
      let list = [];
      const data = res.data;
      if (Array.isArray(data)) list = data;
      else if (data && Array.isArray(data.data)) list = data.data;
      else if (data?.data && Array.isArray(data.data.data)) list = data.data.data;
      
      const pending = list.filter((item: any) => 
        String(item.trangThai).toUpperCase() === 'PENDING'
      );
      
      const notifs = pending.map((order: any) => ({
        id: `order_${order.maDon}`,
        avatar: `https://ui-avatars.com/api/?name=Order+${order.maDon}&background=e0f2fe&color=0369a1&bold=true`,
        title: 'Đơn hàng mới chờ duyệt',
        content: `Đơn hàng #${order.maDon} trị giá ${new Intl.NumberFormat('vi-VN').format(order.tongGia || 0)}đ đang chờ xác nhận.`,
        time: dayjs(order.ngayTao).fromNow(),
        isRead: false,
        rawOrder: order
      }));
      setNotifications(notifs);
    } catch (error) {
      console.error("Lỗi khi tải thông báo đơn hàng", error);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

  const title =
    Object.entries(TITLE_MAP).find(([p]) => pathname === `/admin${p}` || pathname.startsWith(`/admin${p}/`))?.[1] ||
    'thống kê';

  const handleNotificationClick = (n: any) => {
    // mark as read visually
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item));
    
    if (n.rawOrder) {
      setSelectedOrder(n.rawOrder);
      setIsModalOpen(true);
    }
  };

  const handleUpdateStatus = async (status: 'CONFIRMED' | 'CANCELLED') => {
    if (!selectedOrder) return;
    setProcessing(true);
    try {
      await api.patch(`/api/admin/don-dat/${selectedOrder.maDon}/trang-thai`, { trangThai: status });
      message.success(`Đã ${status === 'CONFIRMED' ? 'duyệt' : 'hủy'} đơn hàng #${selectedOrder.maDon}`);
      setIsModalOpen(false);
      fetchPendingOrders(); // refresh notifications
    } catch (error) {
      message.error("Có lỗi xảy ra, không thể cập nhật đơn hàng.");
    } finally {
      setProcessing(false);
    }
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
              onClick={() => handleNotificationClick(n)}
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
         <Popover
            content={popoverContent}
            trigger="click"
            placement="bottomRight"
            arrow={false}
            styles={{
              root: {
                borderRadius: 12,
                overflow: 'hidden'
              }
            }}
          >
            <Tooltip title="Thông báo hệ thống">
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

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18 }}>
            <div style={{ width: 4, height: 20, background: '#1890ff', borderRadius: 4 }} />
            Duyệt đơn hàng #{selectedOrder?.maDon}
          </div>
        }
        open={isModalOpen}
        onCancel={() => !processing && setIsModalOpen(false)}
        footer={[
          <Button 
            key="reject" 
            danger 
            icon={<CloseCircleOutlined />} 
            loading={processing}
            onClick={() => handleUpdateStatus('CANCELLED')}
          >
            Hủy đơn
          </Button>,
          <Button 
            key="approve" 
            type="primary" 
            icon={<CheckCircleOutlined />} 
            loading={processing}
            onClick={() => handleUpdateStatus('CONFIRMED')}
            style={{ background: '#10b981', borderColor: '#10b981' }}
          >
            Duyệt đơn
          </Button>
        ]}
      >
        {selectedOrder && (
          <div style={{ marginTop: 24, marginBottom: 8 }}>
            <Descriptions column={1} bordered size="small" labelStyle={{ width: 140, background: '#f8fafc', fontWeight: 600 }}>
              <Descriptions.Item label="Mã đơn hàng">#{selectedOrder.maDon}</Descriptions.Item>
              <Descriptions.Item label="Mã người dùng">User #{selectedOrder.maUser || selectedOrder.maNguoiDung}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">{dayjs(selectedOrder.ngayTao).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <span style={{ fontWeight: 700, color: '#ef4444', fontSize: 16 }}>
                  {new Intl.NumberFormat('vi-VN').format(selectedOrder.tongGia || 0)} đ
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái hiện tại">
                <Badge status="warning" text="Chờ duyệt (PENDING)" />
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: 16, padding: '12px 16px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 8, color: '#92400e' }}>
              <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Khi duyệt, khách hàng có thể tiến hành thanh toán cho đơn hàng này.
            </div>
          </div>
        )}
      </Modal>
    </header>
  );
}
