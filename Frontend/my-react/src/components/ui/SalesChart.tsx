// src/components/ui/SalesChart.tsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { TooltipProps } from 'recharts';

const data = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 400000 },
  { name: 'Mar', value: 800000 },
  { name: 'Apr', value: 1500000 },
  { name: 'May', value: 2500000 },
  { name: 'Jun', value: 3500000 },
];

// Định nghĩa kiểu cho một entry trong payload (không dùng `any`)
type PayloadEntry = {
  name?: string;
  value?: number | string | readonly (number | string)[];
  payload?: unknown;
};

// Mở rộng TooltipProps để chắc chắn payload có dạng mong muốn
type MyTooltipProps = TooltipProps<number, string> & {
  payload?: PayloadEntry[] | null;
  label?: string;
};

function CustomTooltip({ active, payload, label }: MyTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  // Lấy entry đầu tiên (nếu bạn có nhiều series, có thể lặp payload)
  const entry = payload[0] as PayloadEntry | undefined;
  const rawValue = entry?.value;

  // Xử lý khi value là mảng hoặc number/string
  const num = Array.isArray(rawValue)
    ? Number(rawValue[0] ?? 0)
    : Number(rawValue ?? 0);

  return (
    <div style={{
      background: '#fff',
      padding: 8,
      borderRadius: 6,
      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
      minWidth: 120
    }}>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{num.toLocaleString()} đ</div>
    </div>
  );
}

export default function SalesChart() {
  return (
    <div style={{ width: '100%', height: 320, minHeight: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value: number) => `${value.toLocaleString()} đ`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#c4b5fd" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
