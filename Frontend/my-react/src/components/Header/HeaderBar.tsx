import { useLocation } from 'react-router-dom';

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

export default function HeaderBar() {
  const { pathname } = useLocation();
  const title =
    Object.entries(TITLE_MAP).find(([p]) => pathname === p || pathname.startsWith(p + '/'))?.[1] ||
    'thống kê';
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
        <div style={{ fontWeight: 700, fontSize: 18, whiteSpace: 'nowrap' }}>{title}</div>
      </div>
    </header>
  );
}
