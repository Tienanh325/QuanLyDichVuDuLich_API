import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  BedDouble,
  CircleDollarSign,
  Loader2,
  MessageSquareText,
  Package,
  Plane,
  Star,
  Ticket,
  TrainFront,
  Users,
} from "lucide-react";
import { adminGetThongKe, adminGetDoanhThu } from "../services/adminService";
import type { ThongKeOverview, DoanhThuThang } from "../services/adminService";

const moneyFormatter = new Intl.NumberFormat("vi-VN");
const numberFormatter = new Intl.NumberFormat("vi-VN");
type ChartValue = number | string | ReadonlyArray<number | string> | undefined;
type ChartName = number | string | undefined;


const categoryMix = [
  { name: "Tour", value: 31, color: "#2563eb" },
  { name: "Khach san", value: 24, color: "#7c3aed" },
  { name: "Ve may bay", value: 21, color: "#0f766e" },
  { name: "Ve tau hoa", value: 11, color: "#f59e0b" },
  { name: "Khu vui choi", value: 13, color: "#ef4444" },
];

const servicePerformance = [
  { name: "Tour", revenue: 1520000000, margin: 28 },
  { name: "Khach san", revenue: 1180000000, margin: 22 },
  { name: "Ve may bay", revenue: 980000000, margin: 14 },
  { name: "Ve tau hoa", revenue: 410000000, margin: 12 },
  { name: "Khu vui choi", revenue: 730000000, margin: 19 },
];

const operationalAlerts = [
  {
    title: "Kiểm tra đánh giá tiêu cực",
    detail: "Theo dõi và xử lý review không tốt kịp thời để giữ uy tín.",
    tone: "#ef4444",
  },
  {
    title: "Theo dõi công suất dịch vụ",
    detail: "Kiểm tra các tour và khách sạn sắp hết chỗ trong tuần tới.",
    tone: "#f59e0b",
  },
  {
    title: "Tối ưu tỉ lệ chuyển đổi",
    detail: "Cải thiện trải nghiệm thanh toán để giảm tỉ lệ bỏ giỏ hàng.",
    tone: "#7c3aed",
  },
];

function dashboardCardStyle(accent: string): CSSProperties {
  return {
    background: "#fff",
    borderRadius: 22,
    padding: 20,
    border: "1px solid #e9edf5",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.05)",
    position: "relative",
    overflow: "hidden",
    minHeight: 150,
    backgroundImage: `radial-gradient(circle at top right, ${accent}12, transparent 42%)`,
  };
}

const sectionCardStyle: CSSProperties = {
  background: "#fff",
  borderRadius: 24,
  padding: 22,
  border: "1px solid #e9edf5",
  boxShadow: "0 20px 44px rgba(15, 23, 42, 0.06)",
  minWidth: 0,
};

const pageStyle: CSSProperties = {
  padding: 24,
  background: "linear-gradient(180deg, #f7f9fc 0%, #eef3f8 100%)",
  minHeight: "100%",
};

const twoColumnSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 18,
};

function formatMoney(value: number): string {
  return `${moneyFormatter.format(value)} đ`;
}

function toNumber(value: ChartValue): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (Array.isArray(value)) {
    const firstValue = value[0];
    return typeof firstValue === "number" ? firstValue : Number(firstValue ?? 0);
  }

  return 0;
}

function formatTrendTooltip(value: ChartValue, name: ChartName): [string, string] {
  const numericValue = toNumber(value);
  const label =
    name === "revenue" ? "Doanh thu" : name === "orders" ? "Don hang" : "Nguoi dung";

  return [
    name === "revenue" ? formatMoney(numericValue) : numberFormatter.format(numericValue),
    label,
  ];
}

function formatPercentTooltip(value: ChartValue): [string, string] {
  return [`${toNumber(value)}%`, "Ty trong"];
}

function formatPerformanceTooltip(value: ChartValue, name: ChartName): [string, string] {
  const numericValue = toNumber(value);

  return [
    name === "revenue" ? formatMoney(numericValue) : `${numericValue}%`,
    name === "revenue" ? "Doanh thu" : "Bien loi nhuan",
  ];
}

export default function AdminThongKe() {
  const [overview, setOverview] = useState<ThongKeOverview | null>(null);
  const [doanhThu, setDoanhThu] = useState<DoanhThuThang[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([adminGetThongKe(), adminGetDoanhThu(new Date().getFullYear())])
      .then(([ov, dt]) => {
        setOverview(ov);
        setDoanhThu(dt);
      })
      .catch((err) => console.error("Lỗi tải thống kê:", err))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = overview
    ? [
        {
          title: "Doanh thu tổng",
          value: `${moneyFormatter.format(Math.round((overview.tongDoanhThu ?? 0) / 1_000_000))} tr`,
          change: "Tổng tất cả thời gian",
          note: `Hôm nay: ${moneyFormatter.format(Math.round((overview.doanhThuHomNay ?? 0) / 1000))} nghìn`,
          icon: <CircleDollarSign size={22} color="#2563eb" />,
          accent: "#2563eb",
        },
        {
          title: "Đơn đặt",
          value: numberFormatter.format(overview.tongDonDat ?? 0),
          change: `${overview.donDangCho ?? 0} đang chờ`,
          note: `Hôm nay: ${overview.donHomNay ?? 0} đơn mới`,
          icon: <Package size={22} color="#7c3aed" />,
          accent: "#7c3aed",
        },
        {
          title: "Khách hàng",
          value: numberFormatter.format(overview.tongKhachHang ?? 0),
          change: `${overview.tongAdmin ?? 0} admin`,
          note: `${overview.tongNhaCungCap ?? 0} nhà cung cấp`,
          icon: <Users size={22} color="#16a34a" />,
          accent: "#16a34a",
        },
        {
          title: "Dịch vụ",
          value: numberFormatter.format(overview.tongDichVu ?? 0),
          change: `${overview.tongTour ?? 0} tour · ${overview.tongKhachSan ?? 0} khách sạn`,
          note: `${overview.tongVeConTrong ?? 0} vé còn trống`,
          icon: <Star size={22} color="#f59e0b" />,
          accent: "#f59e0b",
        },
      ]
    : [];

  const revenueTrend = doanhThu.length > 0
    ? doanhThu.map((item) => ({
        label: `T${item.thang}/${String(item.nam).slice(-2)}`,
        revenue: Number(item.tongDoanhThu) || 0,
        orders: item.soGiaoDich,
      }))
    : [
        { label: "T1", revenue: 0, orders: 0 },
        { label: "T2", revenue: 0, orders: 0 },
        { label: "T3", revenue: 0, orders: 0 },
      ];

  // Dữ liệu top sản phẩm (minh họa — có thể thay bằng API /api/admin/thong-ke topDichVu)
  const topProducts = [
    { name: "Tour Đà Lạt 3N2D", category: "Tour", revenue: 382000000, bookings: 114, growth: "+21%" },
    { name: "Combo Phú Quốc Resort", category: "Khách sạn", revenue: 341000000, bookings: 78, growth: "+16%" },
    { name: "Vé máy bay HN-SGN", category: "Vé máy bay", revenue: 296000000, bookings: 162, growth: "+11%" },
    { name: "Vé Sun World", category: "Khu vui chơi", revenue: 214000000, bookings: 205, growth: "+9%" },
  ];

  // Chỉ số hành vi người dùng (minh họa)
  const audienceInsights = [
    { label: "Tổng khách hàng", value: numberFormatter.format(overview?.tongKhachHang ?? 0), note: "Tài khoản đã đăng ký" },
    { label: "Nhà cung cấp", value: numberFormatter.format(overview?.tongNhaCungCap ?? 0), note: "Đang hợp tác" },
    { label: "Đơn hàng hôm nay", value: numberFormatter.format(overview?.donHomNay ?? 0), note: "Đơn mới trong ngày" },
    { label: "Đơn đang chờ xử lý", value: numberFormatter.format(overview?.donDangCho ?? 0), note: "Cần xác nhận" },
  ];

  if (loading) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <Loader2 size={40} style={{ animation: "spin 1s linear infinite", color: "#2563eb" }} />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {kpiCards.map((card) => (
            <div key={card.title} style={dashboardCardStyle(card.accent)}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ color: "#6f7f99", fontSize: 13 }}>{card.title}</div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: "#16233b", marginTop: 10 }}>
                    {card.value}
                  </div>
                </div>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    display: "grid",
                    placeItems: "center",
                    background: `${card.accent}14`,
                  }}
                >
                  {card.icon}
                </div>
              </div>
              <div style={{ marginTop: 16, color: "#16a34a", fontSize: 13, fontWeight: 700 }}>
                {card.change}
              </div>
              <div style={{ marginTop: 6, color: "#70809b", fontSize: 13 }}>{card.note}</div>
            </div>
          ))}
        </section>

        <section style={twoColumnSectionStyle}>
          <div style={sectionCardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 20, color: "#16233b" }}>
                  Xu huong doanh thu va don dat
                </div>
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "#eefaf2",
                  color: "#15803d",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Tang 18.4% so voi ky truoc
              </div>
            </div>

            <div style={{ width: "100%", height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9edf5" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => `${Math.round(value / 1000000)}tr`}
                  />
                  <Tooltip
                    formatter={formatTrendTooltip}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="revenue"
                    stroke="#2563eb"
                    fill="url(#revenueFill)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...sectionCardStyle, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#16233b" }}>
                Co cau doanh thu theo nhom
              </div>
            </div>
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryMix}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={3}
                  >
                    {categoryMix.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatPercentTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {categoryMix.map((item) => (
                <div
                  key={item.name}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: item.color,
                        display: "inline-block",
                      }}
                    />
                    <span style={{ color: "#4a5a74" }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: "#16233b" }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={twoColumnSectionStyle}>
          <div style={sectionCardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 20, color: "#16233b" }}>
                  Hieu suat theo nhom dich vu
                </div>
              </div>
            </div>

            <div style={{ width: "100%", height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={servicePerformance} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9edf5" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => `${Math.round(value / 1000000)}tr`}
                  />
                  <Tooltip
                    formatter={formatPerformanceTooltip}
                  />
                  <Bar dataKey="revenue" name="revenue" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...sectionCardStyle, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#16233b" }}>
                Canh bao van hanh
              </div>
            </div>
            {operationalAlerts.map((alert) => (
              <div
                key={alert.title}
                style={{
                  padding: 16,
                  borderRadius: 18,
                  border: "1px solid #edf1f7",
                  background: "#fbfcfe",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: `${alert.tone}16`,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <AlertTriangle size={18} color={alert.tone} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#16233b" }}>{alert.title}</div>
                    <div style={{ color: "#70809b", marginTop: 6, lineHeight: 1.6 }}>
                      {alert.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={twoColumnSectionStyle}>
          <div style={sectionCardStyle}>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#16233b", marginBottom: 16 }}>
              San pham / dich vu dang keo tang truong
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {topProducts.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    padding: 14,
                    borderRadius: 18,
                    background: "#fbfcfe",
                    border: "1px solid #edf1f7",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "#16233b" }}>{item.name}</div>
                    <div style={{ color: "#70809b", fontSize: 13, marginTop: 4 }}>
                      {item.category} • {item.bookings} dat cho
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "#16233b" }}>{formatMoney(item.revenue)}</div>
                    <div style={{ color: "#16a34a", fontSize: 13, marginTop: 4 }}>{item.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={sectionCardStyle}>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#16233b", marginBottom: 16 }}>
              Chi so hanh vi nguoi dung
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
              }}
            >
              {audienceInsights.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    background: "#fbfcfe",
                    border: "1px solid #edf1f7",
                  }}
                >
                  <div style={{ color: "#70809b", fontSize: 13 }}>{item.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#16233b", marginTop: 10 }}>
                    {item.value}
                  </div>
                  <div style={{ color: "#70809b", fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <div style={sectionCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Plane size={18} color="#2563eb" />
              <div style={{ fontWeight: 800, color: "#16233b" }}>Ve may bay</div>
            </div>
            <div style={{ color: "#70809b", lineHeight: 1.65 }}>
              Nhom nay co ty le dat cho cao, nhung bien loi nhuan thap. Nen tap trung upsell combo va bao hiem.
            </div>
          </div>

          <div style={sectionCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <TrainFront size={18} color="#7c3aed" />
              <div style={{ fontWeight: 800, color: "#16233b" }}>Ve tau hoa</div>
            </div>
            <div style={{ color: "#70809b", lineHeight: 1.65 }}>
              Review tieu cuc dang tap trung tai day. Can cai thien thong tin cho ngoi, thoi gian va quy trinh ho tro.
            </div>
          </div>

          <div style={sectionCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <BedDouble size={18} color="#16a34a" />
              <div style={{ fontWeight: 800, color: "#16233b" }}>Khach san</div>
            </div>
            <div style={{ color: "#70809b", lineHeight: 1.65 }}>
              Bien loi nhuan tot va gia tri don cao. Nen uu tien mo rong nha cung cap va bundle voi tour.
            </div>
          </div>

          <div style={sectionCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Ticket size={18} color="#ef4444" />
              <div style={{ fontWeight: 800, color: "#16233b" }}>Khu vui choi</div>
            </div>
            <div style={{ color: "#70809b", lineHeight: 1.65 }}>
              Ty le dat cho on dinh, phu hop de chay chien dich gia dinh va combo dip cuoi tuan.
            </div>
          </div>

          <div style={sectionCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <MessageSquareText size={18} color="#f59e0b" />
              <div style={{ fontWeight: 800, color: "#16233b" }}>Danh gia</div>
            </div>
            <div style={{ color: "#70809b", lineHeight: 1.65 }}>
              Muc nay giup admin biet noi dung nao dang keo trust xuong de uu tien cham soc khach hang va moderation.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
