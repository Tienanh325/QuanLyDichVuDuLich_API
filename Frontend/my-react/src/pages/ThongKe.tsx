import StatCard from '../components/ui/StatCard';
import SalesChart from '../components/ui/SalesChart';
import TopProducts from '../components/ui/TopProducts';
import { DollarSign, ShoppingBag, Users, ShoppingCart } from 'lucide-react';

export default function ThongKe() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard title="Total Revenue" value="2.369.395.104 đ" change="▲ 3343.9% so với tháng trước" icon={<DollarSign size={28} />} />
        <StatCard title="Total Orders" value="239" change="▲ 895% so với tháng trước" icon={<ShoppingBag size={28} />} />
        <StatCard title="Total Customers" value="100" change="▲ 1900.0% so với tháng trước" icon={<Users size={28} />} />
        <StatCard title="Abandoned Carts" value="16" icon={<ShoppingCart size={28} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', padding: 16, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Sales Overview</h2>
            <select style={{ padding: '6px 10px', borderRadius: 8 }}>
              <option>This Year</option>
            </select>
          </div>
          <SalesChart />
        </div>

        <div style={{ background: '#fff', padding: 16, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Top Products</h2>
            <select style={{ padding: '6px 10px', borderRadius: 8 }}>
              <option>This Month</option>
            </select>
          </div>
          <TopProducts />
        </div>
      </div>
    </div>
  );
}
