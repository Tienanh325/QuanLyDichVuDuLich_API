import { useLocation } from 'react-router-dom';

const TITLE_MAP: Record<string, string> = {
  '/ThongKe': 'Thong ke',
  '/DichVu': 'Dich vu',
  '/LoaiVe': 'Loai ve',
  '/KhachSan': 'Khach san',
  '/Tour': 'Tour',
  '/Ve': 'Ve',
  '/VeMayBay': 'Ve may bay',
  '/VeTauHoa': 'Ve tau hoa',
  '/VeKhuVuiChoi': 'Ve khu vui choi',
  '/KhuyenMai': 'Khuyen mai',
  '/DanhGia': 'Danh gia',
  '/DonHang': 'Don hang',
  '/NhaCungCap': 'Nha cung cap',
  '/KhachHang': 'Khach hang',
};

export default function HeaderBar() {
  const { pathname } = useLocation();
  const title =
    Object.entries(TITLE_MAP).find(([p]) => pathname === p || pathname.startsWith(p + '/'))?.[1] ||
    'Thong ke';

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
        <input
          placeholder="Tim kiem..."
          style={{
            width: 'min(280px, 30vw)',
            minWidth: 180,
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            outline: 'none',
          }}
        />
      </div>
    </header>
  );
}
