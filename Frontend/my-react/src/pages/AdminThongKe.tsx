import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
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
  Users,
} from "lucide-react";
import { adminGetDashboardStats } from "../services/adminService";
import type { DashboardStats } from "../services/adminService";

const moneyFormatter = new Intl.NumberFormat("vi-VN");
const numberFormatter = new Intl.NumberFormat("vi-VN");
type ChartValue = number | string | ReadonlyArray<number | string> | undefined;
type ChartName = number | string | undefined;

const serviceTypeMeta: Record<string, { label: string; color: string; icon: ReactNode }> = {
  TOUR: { label: "Tour", color: "#2563eb", icon: <Package size={18} color="#2563eb" /> },
  KHACH_SAN: { label: "Khách sạn", color: "#16a34a", icon: <BedDouble size={18} color="#16a34a" /> },
  VE: { label: "Vé", color: "#ef4444", icon: <Ticket size={18} color="#ef4444" /> },
  MAY_BAY: { label: "Vé máy bay", color: "#0f766e", icon: <Plane size={18} color="#0f766e" /> },
  TAU_HOA: { label: "Vé tàu hỏa", color: "#f59e0b", icon: <Ticket size={18} color="#f59e0b" /> },
  VUI_CHOI: { label: "Khu vui chơi", color: "#7c3aed", icon: <Ticket size={18} color="#7c3aed" /> },
};

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

function getServiceMeta(type: string) {
  return serviceTypeMeta[type] ?? {
    label: type || "Dịch vụ khác",
    color: "#64748b",
    icon: <Star size={18} color="#64748b" />,
  };
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
    name === "revenue" ? formatMoney(numericValue) : numberFormatter.format(numericValue),
    name === "revenue" ? "Doanh thu" : "Lượt đặt",
  ];
}

export default function AdminThongKe() {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setErrorMessage("");
    adminGetDashboardStats()
      .then((data) => {
        setDashboard(data);
      })
      .catch((err) => {
        console.error("Lỗi tải thống kê:", err);
        setErrorMessage("Không tải được dữ liệu thống kê từ API backend.");
      })
      .finally(() => setLoading(false));
  }, []);

  const overview = dashboard?.overview ?? null;
  const doanhThu = dashboard?.doanhThuTheoThang ?? [];

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

  const revenueTrend = useMemo(() => {
    if (doanhThu.length === 0) {
      return [
        { label: "T1", revenue: 0, orders: 0 },
        { label: "T2", revenue: 0, orders: 0 },
        { label: "T3", revenue: 0, orders: 0 },
      ];
    }

    return doanhThu.map((item) => ({
        label: `T${item.thang}/${String(item.nam).slice(-2)}`,
        revenue: Number(item.tongDoanhThu) || 0,
        orders: Number(item.soGiaoDich) || 0,
      }));
  }, [doanhThu]);

  const totalRevenueByType = useMemo(
    () => (dashboard?.dichVuTheLoai ?? []).reduce((sum, item) => sum + Number(item.doanhThu || 0), 0),
    [dashboard?.dichVuTheLoai],
  );

  const categoryMix = useMemo(() => {
    const rows = dashboard?.dichVuTheLoai ?? [];
    return rows.map((item) => {
      const meta = getServiceMeta(item.loaiDichVu);
      const revenue = Number(item.doanhThu || 0);
      return {
        name: meta.label,
        value: totalRevenueByType > 0 ? Math.round((revenue / totalRevenueByType) * 100) : 0,
        color: meta.color,
        revenue,
        bookings: Number(item.soLuotDat || 0),
      };
    });
  }, [dashboard?.dichVuTheLoai, totalRevenueByType]);

  const servicePerformance = useMemo(() => {
    return (dashboard?.dichVuTheLoai ?? []).map((item) => {
      const meta = getServiceMeta(item.loaiDichVu);
      return {
        name: meta.label,
        revenue: Number(item.doanhThu || 0),
        margin: Number(item.soLuotDat || 0),
      };
    });
  }, [dashboard?.dichVuTheLoai]);

  const operationalAlerts = dashboard?.canhBaoVanHanh ?? [];

  const topProducts = useMemo(() => {
    return (dashboard?.topDichVu ?? []).map((item, index) => {
      const meta = getServiceMeta(item.loaiDichVu);
      return {
        name: item.ten,
        category: meta.label,
        revenue: Number(item.doanhThu || 0),
        bookings: Number(item.soLuotDat || 0),
        growth: index === 0 ? "Top 1" : `Top ${index + 1}`,
      };
    });
  }, [dashboard?.topDichVu]);

  const audienceInsights = [
    { label: "Tổng khách hàng", value: numberFormatter.format(overview?.tongKhachHang ?? 0), note: "Tài khoản đã đăng ký" },
    { label: "Nhà cung cấp", value: numberFormatter.format(overview?.tongNhaCungCap ?? 0), note: "Đang hợp tác" },
    { label: "Đơn hàng hôm nay", value: numberFormatter.format(overview?.donHomNay ?? 0), note: "Đơn mới trong ngày" },
    { label: "Đơn đang chờ xử lý", value: numberFormatter.format(overview?.donDangCho ?? 0), note: "Cần xác nhận" },
  ];

  const serviceInsights = useMemo(() => {
    return (dashboard?.dichVuTheLoai ?? []).map((item) => {
      const meta = getServiceMeta(item.loaiDichVu);
      return {
        label: meta.label,
        icon: meta.icon,
        color: meta.color,
        detail: `${numberFormatter.format(Number(item.soLuong || 0))} dịch vụ đang hoạt động, ${numberFormatter.format(Number(item.soLuotDat || 0))} lượt đặt, doanh thu ${formatMoney(Number(item.doanhThu || 0))}.`,
      };
    });
  }, [dashboard?.dichVuTheLoai]);

  const revenueChangeLabel = useMemo(() => {
    const nonZeroRows = revenueTrend.filter((item) => item.revenue > 0);
    if (nonZeroRows.length < 2) return "Chưa đủ dữ liệu kỳ trước";

    const current = nonZeroRows[nonZeroRows.length - 1].revenue;
    const previous = nonZeroRows[nonZeroRows.length - 2].revenue;
    if (previous === 0) return "Chưa đủ dữ liệu kỳ trước";

    const percent = ((current - previous) / previous) * 100;
    const prefix = percent >= 0 ? "Tăng" : "Giảm";
    return `${prefix} ${Math.abs(percent).toFixed(1)}% so với kỳ trước`;
  }, [revenueTrend]);

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
        {errorMessage && (
          <div style={{ ...sectionCardStyle, color: "#b91c1c", background: "#fff7f7" }}>
            {errorMessage}
          </div>
        )}

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
                {revenueChangeLabel}
              </div>
            </div>

            <div style={{ width: "100%", height: 340 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
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
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
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
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
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
          {serviceInsights.map((item) => (
            <div key={item.label} style={sectionCardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                {item.icon}
                <div style={{ fontWeight: 800, color: "#16233b" }}>{item.label}</div>
              </div>
              <div style={{ color: "#70809b", lineHeight: 1.65 }}>
                {item.detail}
              </div>
            </div>
          ))}

          <div style={sectionCardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <MessageSquareText size={18} color="#f59e0b" />
              <div style={{ fontWeight: 800, color: "#16233b" }}>Danh gia</div>
            </div>
            <div style={{ color: "#70809b", lineHeight: 1.65 }}>
              Dữ liệu cảnh báo đánh giá được lấy từ API thống kê theo các review 2 sao trở xuống trong 30 ngày gần nhất.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
