import type { CSSProperties } from "react";
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
  ArrowUpRight,
  BedDouble,
  CircleDollarSign,
  MessageSquareText,
  Package,
  Plane,
  Star,
  Ticket,
  TrainFront,
  Users,
} from "lucide-react";

const moneyFormatter = new Intl.NumberFormat("vi-VN");
const numberFormatter = new Intl.NumberFormat("vi-VN");
type ChartValue = number | string | ReadonlyArray<number | string> | undefined;
type ChartName = number | string | undefined;

const kpiCards = [
  {
    title: "Doanh thu 30 ngay",
    value: "4.82 ty",
    change: "+18.4%",
    note: "Tang nho nhom tour va ve may bay",
    icon: <CircleDollarSign size={22} color="#2563eb" />,
    accent: "#2563eb",
  },
  {
    title: "Don dat thanh cong",
    value: "1,284",
    change: "+12.1%",
    note: "Ty le thanh cong 86.3%",
    icon: <Package size={22} color="#7c3aed" />,
    accent: "#7c3aed",
  },
  {
    title: "Nguoi dung hoat dong",
    value: "8,942",
    change: "+9.7%",
    note: "2,146 nguoi dung quay lai",
    icon: <Users size={22} color="#16a34a" />,
    accent: "#16a34a",
  },
  {
    title: "Danh gia trung binh",
    value: "4.6/5",
    change: "+0.2",
    note: "Can xu ly 27 review tieu cuc",
    icon: <Star size={22} color="#f59e0b" />,
    accent: "#f59e0b",
  },
];

const revenueTrend = [
  { label: "T2", revenue: 280000000, orders: 180, users: 920 },
  { label: "T3", revenue: 345000000, orders: 230, users: 1100 },
  { label: "T4", revenue: 398000000, orders: 265, users: 1240 },
  { label: "T5", revenue: 452000000, orders: 310, users: 1450 },
  { label: "T6", revenue: 509000000, orders: 350, users: 1580 },
  { label: "T7", revenue: 548000000, orders: 374, users: 1710 },
  { label: "T8", revenue: 612000000, orders: 421, users: 1895 },
];

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

const topProducts = [
  { name: "Tour Da Lat 3N2D", category: "Tour", revenue: 382000000, bookings: 114, growth: "+21%" },
  { name: "Combo Phu Quoc Resort", category: "Khach san", revenue: 341000000, bookings: 78, growth: "+16%" },
  { name: "Ve may bay HN-SGN", category: "Ve may bay", revenue: 296000000, bookings: 162, growth: "+11%" },
  { name: "Ve Sun World", category: "Khu vui choi", revenue: 214000000, bookings: 205, growth: "+9%" },
];

const operationalAlerts = [
  {
    title: "27 danh gia tieu cuc can xu ly",
    detail: "Tap trung o nhom khach san va ve tau hoa trong 7 ngay qua.",
    tone: "#ef4444",
  },
  {
    title: "8 dich vu sap het cong suat",
    detail: "Nhieu nhat la 3 tour cuoi tuan va 2 khach san bien dip le.",
    tone: "#f59e0b",
  },
  {
    title: "Ty le bo gio hang 14.2%",
    detail: "Can toi uu trang thanh toan va uu dai cho nguoi dung moi.",
    tone: "#7c3aed",
  },
];

const audienceInsights = [
  { label: "Nguoi dung moi", value: "2,318", note: "Chiem 26% tong traffic" },
  { label: "Nguoi dung quay lai", value: "2,146", note: "Ty le dat cho cao hon 1.8x" },
  { label: "Ty le chuyen doi", value: "4.9%", note: "Tang 0.7 diem so voi thang truoc" },
  { label: "Gia tri don trung binh", value: "3.75 tr", note: "Nen day combo de tang AOV" },
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
  return (
    <div style={pageStyle}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <section
          style={{
            ...sectionCardStyle,
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 55%, rgba(255,255,255,1) 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 760 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "#eef4ff",
                  color: "#2563eb",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                <ArrowUpRight size={14} />
                Tong quan tang truong nen tang du lich
              </div>
              <h1
                style={{
                  margin: "16px 0 10px",
                  fontSize: 34,
                  lineHeight: 1.12,
                  color: "#16233b",
                }}
              >
                Dashboard thong ke giup admin biet nen dau tu vao dich vu nao, nhom nguoi dung nao va diem nghen nao can xu ly.
              </h1>
              <p style={{ margin: 0, color: "#60708b", fontSize: 16, lineHeight: 1.65 }}>
                Trang nay uu tien cac chi so can thiet de phat trien web dich vu du lich:
                doanh thu, don hang, chat luong danh gia, nhom dich vu tang truong,
                dau hieu roi bo va cac muc can canh bao.
              </p>
            </div>

            <div
              style={{
                minWidth: 260,
                maxWidth: 320,
                width: "100%",
                padding: 18,
                borderRadius: 20,
                background: "#ffffff",
                border: "1px solid #e6ecf5",
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
              }}
            >
              <div style={{ fontSize: 13, color: "#70809b", marginBottom: 10 }}>
                Muc tieu thang nay
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#16233b" }}>
                5.5 ty
              </div>
              <div style={{ color: "#16a34a", fontWeight: 700, marginTop: 6 }}>
                Dat 87.6% ke hoach
              </div>
              <div style={{ color: "#70809b", fontSize: 13, marginTop: 10 }}>
                Neu giu toc do hien tai, co the vuot KPI trong 6-8 ngay cuoi thang.
              </div>
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
                <div style={{ color: "#70809b", marginTop: 4 }}>
                  Theo doi da tang truong de quyet dinh nen day khuyen mai hay mo rong nguon cung.
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
              <div style={{ color: "#70809b", marginTop: 4 }}>
                Giup admin biet nen uu tien mo rong nhom dich vu nao.
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
                <div style={{ color: "#70809b", marginTop: 4 }}>
                  So sanh doanh thu va bien loi nhuan de uu tien ngan sach marketing.
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
              <div style={{ color: "#70809b", marginTop: 4 }}>
                Cac diem admin nen xu ly de giu tang truong ben vung.
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
