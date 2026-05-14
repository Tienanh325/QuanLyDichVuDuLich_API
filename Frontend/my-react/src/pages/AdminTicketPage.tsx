import { useMemo, useState } from "react";
import dayjs from "dayjs";
import type { CSSProperties } from "react";
import {
  Badge,
  Button,
  Card,
  Drawer,
  Modal,
  Select,
  Space,
  Table,
  Tabs,
  Typography,
} from "antd";
import { CircleDollarSign, Clock3, FileText, Filter, Plane, ShieldCheck, Ticket, Trash2 } from "lucide-react";

const { Title, Text } = Typography;

export type TicketCategory = "all" | "flight" | "train" | "park";
type TicketStatus = "available" | "upcoming" | "soldout" | "cancelled";
type TimeFilter = "today" | "7d" | "30d" | "custom";
type TicketType = "MAY_BAY" | "TAU_HOA" | "VUI_CHOI";

interface TicketItem {
  maVe: number;
  maDichVu: number;
  loaiVeCon: TicketType;
  trangThai: TicketStatus | string;
  tenHienThi: string;
  originalPrice: number;
  promo: string;
  ngayTao: string;
  ngayCapNhat: string;
  diemKhoiHanh: string;
  diemDen: string;
  ngayKhoiHanh: string;
  gia: number;
  soChoTrong: number;
  hang: string;
  LoaiVeID: number;
  TenVe: string;
  danhGia: number;
}
interface AdminTicketPageProps { category: TicketCategory; title: string; description: string; }

const currencyFormatter = new Intl.NumberFormat("vi-VN");
const formatCurrency = (value: number) => `${currencyFormatter.format(value)} đ`;
const inferStatus = (item: Pick<TicketItem, "trangThai" | "ngayKhoiHanh" | "soChoTrong">): TicketStatus => { const status = String(item.trangThai ?? "").toUpperCase(); if (status.includes("CANCEL")) return "cancelled"; if (item.soChoTrong <= 0 || status.includes("SOLD")) return "soldout"; if (dayjs(item.ngayKhoiHanh).isAfter(dayjs(), "day")) return "upcoming"; return "available"; };

export default function AdminTicketPage({ title, description }: AdminTicketPageProps) {
  const [data] = useState<TicketItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7d");
  const [editingItem] = useState<TicketItem | null>(null);
  const [managingTicket] = useState<TicketItem | null>(null);

  const scopedData = useMemo(() => data, [data]);
  const stats = useMemo(() => ({ total: scopedData.length, available: scopedData.filter((item) => inferStatus(item) === "available").length, soldout: scopedData.filter((item) => inferStatus(item) === "soldout").length, cancelled: scopedData.filter((item) => inferStatus(item) === "cancelled").length, sold: scopedData.length, revenue: 0, today: 12, week: 84, month: 310 }), [scopedData]);
  const reportRows = useMemo(() => [
    { label: "Vé máy bay", revenue: formatCurrency(124500000), cancelRate: "6.2%", completeRate: "91.8%" },
    { label: "Vé tàu hoả", revenue: formatCurrency(84500000), cancelRate: "3.1%", completeRate: "95.4%" },
  ], []);
  const topRoutes = useMemo(() => [
    { label: "Hà Nội → TP.HCM", type: "Máy bay", count: 182, revenue: formatCurrency(98000000) },
    { label: "Hà Nội → Đà Nẵng", type: "Tàu hoả", count: 140, revenue: formatCurrency(61000000) },
    { label: "Đà Nẵng → Phú Quốc", type: "Máy bay", count: 96, revenue: formatCurrency(52000000) },
    { label: "TP.HCM → Nha Trang", type: "Tàu hoả", count: 88, revenue: formatCurrency(42000000) },
  ], []);

  const cardStyle: CSSProperties = { borderRadius: 20, border: "1px solid #eceef5", boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)" };
  
  return (
    <div style={{ padding: 24, background: "linear-gradient(180deg, #f7f8fc 0%, #f2f4f8 100%)", minHeight: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div><Title level={3} style={{ margin: 0 }}>{title}</Title><Text type="secondary">{description} · {timeFilter}</Text></div>
          <Space wrap><Select value={timeFilter} onChange={setTimeFilter} style={{ width: 150 }} options={[{ value: "today", label: "Hôm nay" }, { value: "7d", label: "7 ngày" }, { value: "30d", label: "30 ngày" }, { value: "custom", label: "Custom" }]} /><Button icon={<Filter size={16} />}>Filter</Button></Space>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {[{ label: "Tổng vé đã bán", value: stats.sold, icon: <Ticket size={16} color="#7c3aed" /> }, { label: "Tổng doanh thu", value: formatCurrency(stats.revenue), icon: <CircleDollarSign size={16} color="#16a34a" /> }, { label: "Vé còn lại", value: stats.available, icon: <Badge color="#16a34a" /> }, { label: "Vé đã sử dụng", value: stats.sold, icon: <ShieldCheck size={16} color="#2563eb" /> }, { label: "Vé hủy", value: stats.cancelled, icon: <Trash2 size={16} color="#ef4444" /> }, { label: "Đặt mới", value: `${stats.today} / ${stats.week} / ${stats.month}`, icon: <Clock3 size={16} color="#f59e0b" /> }].map((item) => <Card key={item.label} style={{ ...cardStyle, background: "#fff" }}><Space align="start"><div>{item.icon}</div><div><Text type="secondary">{item.label}</Text><Title level={3} style={{ margin: "4px 0 0" }}>{item.value}</Title></div></Space></Card>)}</div>
        <>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 16 }}>
          <Card style={cardStyle}><Space direction="vertical" size={12} style={{ width: "100%" }}><Space><Plane size={18} color="#2563eb" /><Title level={4} style={{ margin: 0 }}>Dashboard tổng quan</Title></Space><div style={{ border: "1px dashed #dbe2ef", borderRadius: 16, minHeight: 180, display: "grid", placeItems: "center" }}>Biểu đồ doanh thu / thị phần</div></Space></Card>
          <Card style={cardStyle}><Space direction="vertical" size={12} style={{ width: "100%" }}><Space><FileText size={18} color="#7c3aed" /><Title level={4} style={{ margin: 0 }}>Báo cáo tổng hợp</Title></Space><Space wrap><Button type="primary">Export Excel</Button><Button>Export PDF</Button></Space><Table rowKey="label" pagination={false} size="small" dataSource={reportRows} columns={[{ title: "Loại vé", dataIndex: "label" }, { title: "Doanh thu", dataIndex: "revenue" }, { title: "Tỷ lệ hủy", dataIndex: "cancelRate" }, { title: "Tỷ lệ hoàn thành", dataIndex: "completeRate" }]} /><div style={{ borderTop: "1px solid #eef2f7", paddingTop: 12 }}><Text strong>Top tuyến phổ biến</Text><Table rowKey="label" pagination={false} size="small" dataSource={topRoutes} columns={[{ title: "Tuyến", dataIndex: "label" }, { title: "Loại", dataIndex: "type" }, { title: "Lượt bán", dataIndex: "count" }, { title: "Doanh thu", dataIndex: "revenue" }]} /></div></Space></Card>
        </div>
       </>
     </div>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} width={760} title={editingItem ? "Cập nhật vé" : "Thêm vé"}>
        <Tabs items={[{ key: "ticket", label: "Thông tin vé", children: <div /> }, { key: "detail", label: "Chi tiết loại vé", children: <div /> }, { key: "service", label: "Giá & tiện ích", children: <div /> }]} />
      </Drawer>
      <Modal open={manageOpen} onCancel={() => setManageOpen(false)} footer={null} width={1000} title={managingTicket ? `Quản lý vé: ${managingTicket.TenVe}` : "Quản lý vé"}>
        <Tabs items={[{ key: "overview", label: "Tổng quan", children: <div /> }, { key: "prices", label: "Bảng giá", children: <div /> }, { key: "amenities", label: "Tiện ích", children: <div /> }, { key: "khoang", label: "Khoang tàu", children: <div /> }]} />
      </Modal>
    </div>
  );
}
