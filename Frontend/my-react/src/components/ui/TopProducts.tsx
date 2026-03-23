const items = [
  { name: 'Vé máy bay 1', qty: 120, revenue: 35160000 },
  { name: 'Vé máy bay 2', qty: 100, revenue: 25000000 },
  { name: 'Vé máy bay 3', qty: 90, revenue: 7182000 },
  { name: 'Vé máy bay 4', qty: 80, revenue: 11040000 },
  { name: 'Vé máy bay 15', qty: 60, revenue: 5500000 },
];

export default function TopProducts() {
  return (
    <div>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((it, idx) => (
          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{it.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{it.qty} sales</div>
            </div>
            <div style={{ fontWeight: 700 }}>{it.revenue.toLocaleString()} đ</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
