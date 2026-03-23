import { useLocation } from 'react-router-dom';
const TITLE_MAP: Record<string, string> = {
  '/dashboard': 'Bảng điều khiển',
  '/categories': 'Danh mục',
  '/products': 'Sản phẩm',
  '/discounts': 'Khuyến mãi',
  '/coupons': 'Phiếu giảm giá',
  '/orders': 'Đơn hàng',
  '/customers': 'Khách hàng',
  '/settings': 'Cài đặt',
};

export default function HeaderBar() {
  const { pathname } = useLocation();
  console.log('HeaderBar pathname:', pathname);
  const title =
  Object.entries(TITLE_MAP).find(([p]) =>
    pathname === p || pathname.startsWith(p + '/')
  )?.[1] || 'Bảng điều khiển';
  return (
    <header style={{ padding: '16px 24px', borderBottom: '1px solid #e6edf3', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700 }}>{title}</div>
        <div>
          <input
            placeholder="Tìm kiếm..."
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}
          />
        </div>
      </div>
    </header>
  );
}
