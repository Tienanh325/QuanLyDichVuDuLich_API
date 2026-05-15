import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import api from "../services/api";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { formatVnd } from "../utils/money";
import { Badge, Button, Card, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, Typography, message } from "antd";
import type { TableProps } from "antd";
import { MapPinned, PencilLine, Plane, Plus, Search, Trash2 } from "lucide-react";

const { Title, Text } = Typography;
const FLIGHT_API = "/api/admin/ve/may-bay";

interface FlightItem {
  maVe: number;
  hangHangKhong: string;
  logoHang?: string | null;
  soHieuChuyenBay: string;
  hangVe: string;
  goiGia?: string | null;
  diemKhoiHanh: string;
  maSanBayDi?: string | null;
  tenSanBayDi?: string | null;
  diemDen: string;
  maSanBayDen?: string | null;
  tenSanBayDen?: string | null;
  thoiGianKhoiHanh: string;
  thoiGianDen?: string | null;
  thoiLuongPhut?: number | null;
  soDiemDung: number;
  hanhLyXachTay?: string | null;
  hanhLyKyGui?: string | null;
  suatAn?: string | null;
  giaiTri?: string | null;
  dieuKienVe?: string | null;
  thuePhiSanBay: number;
}

interface FlightFormValues {
  hangHangKhong: string;
  logoHang?: string | null;
  soHieuChuyenBay: string;
  hangVe: string;
  goiGia?: string | null;
  diemKhoiHanh: string;
  maSanBayDi?: string | null;
  tenSanBayDi?: string | null;
  diemDen: string;
  maSanBayDen?: string | null;
  tenSanBayDen?: string | null;
  thoiGianKhoiHanh: Dayjs;
  thoiGianDen?: Dayjs | null;
  thoiLuongPhut?: number | null;
  soDiemDung: number;
  hanhLyXachTay?: string | null;
  hanhLyKyGui?: string | null;
  suatAn?: string | null;
  giaiTri?: string | null;
  dieuKienVe?: string | null;
  thuePhiSanBay: number;
}

type TicketStatus = "available" | "upcoming" | "soldout";

const mockData: FlightItem[] = [
  {
    maVe: 1001,
    hangHangKhong: "Vietnam Airlines",
    logoHang: null,
    soHieuChuyenBay: "VN1001",
    hangVe: "Phổ thông",
    goiGia: "Economy",
    diemKhoiHanh: "Hà Nội",
    maSanBayDi: "HAN",
    tenSanBayDi: "Nội Bài",
    diemDen: "TP.HCM",
    maSanBayDen: "SGN",
    tenSanBayDen: "Tân Sơn Nhất",
    thoiGianKhoiHanh: dayjs().add(2, "day").hour(8).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss"),
    thoiGianDen: dayjs().add(2, "day").hour(10).minute(15).second(0).format("YYYY-MM-DDTHH:mm:ss"),
    thoiLuongPhut: 135,
    soDiemDung: 0,
    hanhLyXachTay: "7kg",
    hanhLyKyGui: "20kg",
    suatAn: "Có",
    giaiTri: "Màn hình cá nhân",
    dieuKienVe: "Không hoàn/hủy",
    thuePhiSanBay: 120000,
  },
  {
    maVe: 1002,
    hangHangKhong: "VietJet Air",
    logoHang: null,
    soHieuChuyenBay: "VJ1002",
    hangVe: "Phổ thông",
    goiGia: "Promo",
    diemKhoiHanh: "Đà Nẵng",
    maSanBayDi: "DAD",
    tenSanBayDi: "Đà Nẵng",
    diemDen: "Phú Quốc",
    maSanBayDen: "PQC",
    tenSanBayDen: "Phú Quốc",
    thoiGianKhoiHanh: dayjs().subtract(1, "day").hour(13).minute(30).second(0).format("YYYY-MM-DDTHH:mm:ss"),
    thoiGianDen: dayjs().subtract(1, "day").hour(15).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss"),
    thoiLuongPhut: 90,
    soDiemDung: 0,
    hanhLyXachTay: "7kg",
    hanhLyKyGui: null,
    suatAn: null,
    giaiTri: null,
    dieuKienVe: "Hạng khuyến mãi",
    thuePhiSanBay: 98000,
  },
];

const fmt = formatVnd;
const fmtDate = (v?: string | null) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "--");

function inferStatus(item: Pick<FlightItem, "thoiGianKhoiHanh" | "thoiGianDen">): TicketStatus {
  if (dayjs(item.thoiGianKhoiHanh).isAfter(dayjs())) return "upcoming";
  if (item.thoiGianDen && dayjs(item.thoiGianDen).isBefore(dayjs()) && dayjs(item.thoiGianKhoiHanh).isBefore(dayjs())) return "soldout";
  return "available";
}

function getStatusMeta(s: TicketStatus) {
  return {
    available: { label: "Đang bán", color: "green" },
    upcoming: { label: "Sắp khởi hành", color: "blue" },
    soldout: { label: "Hết chỗ", color: "red" },
  }[s];
}

function extractArray(p: unknown): unknown[] {
  if (Array.isArray(p)) return p;
  if (typeof p === "object" && p !== null) {
    const o = p as Record<string, unknown>;
    const i = o.data;
    if (Array.isArray(i)) return i;
    if (typeof i === "object" && i !== null) {
      const n = (i as Record<string, unknown>).data;
      if (Array.isArray(n)) return n;
      const t = (i as Record<string, unknown>).items;
      if (Array.isArray(t)) return t;
    }
  }
  return [];
}

function normalize(raw: Record<string, unknown>, idx: number): FlightItem {
  const hangHangKhong = String(raw.hangHangKhong ?? raw.airline ?? raw.brand ?? raw.tenNhaCungCap ?? raw.tenDichVu ?? "");
  const soHieuChuyenBay = String(raw.soHieuChuyenBay ?? raw.flightNo ?? raw.soHieu ?? raw.tenVe ?? "");
  const diemKhoiHanh = String(raw.diemKhoiHanh ?? raw.departurePoint ?? raw.diembaydi ?? raw.noiDi ?? "");
  const diemDen = String(raw.diemDen ?? raw.destination ?? raw.diembayden ?? raw.noiDen ?? "");
  return {
    maVe: Number(raw.maVe ?? raw.id ?? raw.ma ?? idx + 1),
    hangHangKhong,
    logoHang: raw.logoHang ? String(raw.logoHang) : null,
    soHieuChuyenBay,
    hangVe: String(raw.hangVe ?? raw.ticketClass ?? raw.loaiVe ?? "Phổ thông"),
    goiGia: raw.goiGia ? String(raw.goiGia) : null,
    diemKhoiHanh,
    maSanBayDi: raw.maSanBayDi ? String(raw.maSanBayDi) : null,
    tenSanBayDi: raw.tenSanBayDi ? String(raw.tenSanBayDi) : null,
    diemDen,
    maSanBayDen: raw.maSanBayDen ? String(raw.maSanBayDen) : null,
    tenSanBayDen: raw.tenSanBayDen ? String(raw.tenSanBayDen) : null,
    thoiGianKhoiHanh: String(raw.thoiGianKhoiHanh ?? raw.departureTime ?? raw.ngayKhoiHanh ?? dayjs().format("YYYY-MM-DDTHH:mm:ss")),
    thoiGianDen: raw.thoiGianDen ? String(raw.thoiGianDen) : null,
    thoiLuongPhut: raw.thoiLuongPhut == null ? null : Number(raw.thoiLuongPhut),
    soDiemDung: Number(raw.soDiemDung ?? raw.soChoTrong ?? 0),
    hanhLyXachTay: raw.hanhLyXachTay ? String(raw.hanhLyXachTay) : null,
    hanhLyKyGui: raw.hanhLyKyGui ? String(raw.hanhLyKyGui) : null,
    suatAn: raw.suatAn ? String(raw.suatAn) : null,
    giaiTri: raw.giaiTri ? String(raw.giaiTri) : null,
    dieuKienVe: raw.dieuKienVe ? String(raw.dieuKienVe) : null,
    thuePhiSanBay: Number(raw.thuePhiSanBay ?? raw.gia ?? raw.price ?? 0),
  };
}

const cs: CSSProperties = { borderRadius: 20, border: "1px solid #eceef5", boxShadow: "0 18px 45px rgba(15,23,42,0.06)" };
const scs: CSSProperties = { ...cs, height: "100%", background: "#fff" };
const pcs: CSSProperties = { padding: 24, background: "linear-gradient(180deg,#f7f8fc 0%,#f2f4f8 100%)", minHeight: "100%" };

export default function AdminVeMayBay() {
  const [form] = Form.useForm<FlightFormValues>();
  const [data, setData] = useState<FlightItem[]>(mockData);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FlightItem | null>(null);
  const [search, setSearch] = useState("");
  const [filterSt, setFilterSt] = useState<TicketStatus | "all">("all");
  const [isMock, setIsMock] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const tickets = await api.get("/api/admin/ve", { params: { limit: 1000 } }).then(r => extractArray(r.data).map((x, i) => normalize(x as Record<string, unknown>, i)).filter((v: FlightItem) => [v.soHieuChuyenBay, v.hangHangKhong, v.diemKhoiHanh, v.diemDen].some(Boolean)));
      setData(tickets.length > 0 ? tickets : mockData);
      setIsMock(tickets.length === 0);
      if (tickets.length === 0) message.info("API chưa trả dữ liệu, đang hiển thị dữ liệu mẫu.");
    } catch (e) {
      setData(mockData);
      setIsMock(true);
      message.warning(axios.isAxiosError(e) ? `Không kết nối được API ${FLIGHT_API}.` : "Lỗi tải dữ liệu vé máy bay.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return data.filter(it => {
      const ms = kw.length === 0 || String(it.maVe).includes(kw) || it.hangHangKhong.toLowerCase().includes(kw) || it.soHieuChuyenBay.toLowerCase().includes(kw) || it.diemKhoiHanh.toLowerCase().includes(kw) || it.diemDen.toLowerCase().includes(kw);
      const mst = filterSt === "all" || inferStatus(it) === filterSt;
      return ms && mst;
    });
  }, [data, filterSt, search]);

  const stats = useMemo(() => ({
    total: data.length,
    available: data.filter(i => inferStatus(i) === "available").length,
    upcoming: data.filter(i => inferStatus(i) === "upcoming").length,
    soldout: data.filter(i => inferStatus(i) === "soldout").length,
  }), [data]);

  const reset = () => { form.resetFields(); setEditing(null); };
  const openCreate = () => {
    reset();
    form.setFieldsValue({
      hangHangKhong: "Vietnam Airlines",
      logoHang: null,
      soHieuChuyenBay: `VN${Date.now().toString().slice(-4)}`,
      hangVe: "Phổ thông",
      goiGia: "Economy",
      diemKhoiHanh: "Hà Nội",
      maSanBayDi: "HAN",
      tenSanBayDi: "Nội Bài",
      diemDen: "TP.HCM",
      maSanBayDen: "SGN",
      tenSanBayDen: "Tân Sơn Nhất",
      thoiGianKhoiHanh: dayjs().add(3, "day").hour(8).minute(0).second(0),
      thoiGianDen: dayjs().add(3, "day").hour(10).minute(15).second(0),
      thoiLuongPhut: 135,
      soDiemDung: 0,
      hanhLyXachTay: "7kg",
      hanhLyKyGui: "20kg",
      suatAn: "Có",
      giaiTri: "Màn hình cá nhân",
      dieuKienVe: "Không hoàn/hủy",
      thuePhiSanBay: 120000,
    });
    setModalOpen(true);
  };
  const openEdit = (it: FlightItem) => { setEditing(it); form.setFieldsValue({ ...it, thoiGianKhoiHanh: dayjs(it.thoiGianKhoiHanh), thoiGianDen: it.thoiGianDen ? dayjs(it.thoiGianDen) : null }); setModalOpen(true); };

  const handleDelete = async (it: FlightItem) => {
    const prev = data;
    setData(c => c.filter(e => e.maVe !== it.maVe));
    if (isMock) { message.success(`Đã xoá ${it.soHieuChuyenBay} (mẫu).`); return; }
    try {
      await api.delete(`${FLIGHT_API}/${it.maVe}`);
      message.success(`Đã xoá ${it.soHieuChuyenBay}.`);
    } catch {
      setData(prev);
      message.error("Xoá không thành công.");
    }
  };

  const handleSubmit = async () => {
    try {
      const v = await form.validateFields();
      setSubmitting(true);
      const payload: FlightItem = {
        maVe: editing?.maVe ?? Date.now(),
        hangHangKhong: v.hangHangKhong.trim(),
        logoHang: v.logoHang?.trim() || null,
        soHieuChuyenBay: v.soHieuChuyenBay.trim(),
        hangVe: v.hangVe.trim(),
        goiGia: v.goiGia?.trim() || null,
        diemKhoiHanh: v.diemKhoiHanh.trim(),
        maSanBayDi: v.maSanBayDi?.trim() || null,
        tenSanBayDi: v.tenSanBayDi?.trim() || null,
        diemDen: v.diemDen.trim(),
        maSanBayDen: v.maSanBayDen?.trim() || null,
        tenSanBayDen: v.tenSanBayDen?.trim() || null,
        thoiGianKhoiHanh: v.thoiGianKhoiHanh.format("YYYY-MM-DDTHH:mm:ss"),
        thoiGianDen: v.thoiGianDen ? v.thoiGianDen.format("YYYY-MM-DDTHH:mm:ss") : null,
        thoiLuongPhut: v.thoiLuongPhut ?? null,
        soDiemDung: v.soDiemDung,
        hanhLyXachTay: v.hanhLyXachTay?.trim() || null,
        hanhLyKyGui: v.hanhLyKyGui?.trim() || null,
        suatAn: v.suatAn?.trim() || null,
        giaiTri: v.giaiTri?.trim() || null,
        dieuKienVe: v.dieuKienVe?.trim() || null,
        thuePhiSanBay: v.thuePhiSanBay,
      };

      if (isMock) {
        setData(c => editing ? c.map(i => i.maVe === editing.maVe ? payload : i) : [payload, ...c]);
        message.success(editing ? "Cập nhật (mẫu)." : "Thêm (mẫu).");
        setModalOpen(false);
        reset();
        return;
      }

      if (editing) {
        const r = await api.put(`${FLIGHT_API}/${payload.maVe}`, payload);
        const u = normalize((r.data?.data ?? r.data) as Record<string, unknown>, 0);
        setData(c => c.map(i => i.maVe === editing.maVe ? u : i));
        message.success("Cập nhật thành công.");
      } else {
        const r = await api.post(FLIGHT_API, payload);
        const c = normalize((r.data?.data ?? r.data) as Record<string, unknown>, 0);
        setData(cur => [c, ...cur]);
        message.success("Thêm vé thành công.");
      }
      setModalOpen(false);
      reset();
    } catch (e) {
      if (axios.isAxiosError(e)) message.error("Lỗi API. Kiểm tra backend.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableProps<FlightItem>["columns"] = [
    {
      title: "Hãng",
      key: "airline",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 700, color: "#1f2a44" }}>{r.hangHangKhong}</div>
          <Text style={{ color: "#7d869c", fontSize: 13 }}>Mã vé: {r.maVe}</Text>
          {r.logoHang ? <div style={{ color: "#7d869c", fontSize: 12, marginTop: 2 }}>Logo: {r.logoHang}</div> : null}
        </div>
      ),
    },
    {
      title: "Chuyến bay",
      key: "flight",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.soHieuChuyenBay}</div>
          <div style={{ color: "#7d869c", fontSize: 13 }}>{r.hangVe}{r.goiGia ? ` • ${r.goiGia}` : ""}</div>
        </div>
      ),
    },
    {
      title: "Hành trình",
      key: "route",
      render: (_, r) => (
        <div>
          <Space size={6}><MapPinned size={14} color="#2563eb" /><Text>{r.diemKhoiHanh}</Text></Space>
          <div style={{ color: "#7d869c", fontSize: 13, marginTop: 4 }}>Đến: {r.diemDen}</div>
          <div style={{ color: "#7d869c", fontSize: 12, marginTop: 2 }}>{r.tenSanBayDi ?? "--"} → {r.tenSanBayDen ?? "--"}</div>
        </div>
      ),
    },
    {
      title: "Mã sân bay",
      key: "airport",
      render: (_, r) => <div style={{ color: "#1f2a44", fontSize: 13 }}>{r.maSanBayDi ?? "--"} → {r.maSanBayDen ?? "--"}</div>,
    },
    {
      title: "Khởi hành",
      key: "date",
      render: (_, r) => (
        <div>
          <div style={{ color: "#1f2a44", fontWeight: 600 }}>{fmtDate(r.thoiGianKhoiHanh)}</div>
          <div style={{ color: "#7d869c", fontSize: 12 }}>{r.thoiGianDen ? fmtDate(r.thoiGianDen) : "--"}</div>
        </div>
      ),
    },
    { title: "Thời lượng", dataIndex: "thoiLuongPhut", key: "duration", render: (v: number | null | undefined) => v ? `${v} phút` : "--" },
    { title: "Điểm dừng", dataIndex: "soDiemDung", key: "stop", render: (v: number) => <Tag color={v > 0 ? "orange" : "green"}>{v}</Tag> },
    { title: "Hành lý xách tay", dataIndex: "hanhLyXachTay", key: "carry", render: (v?: string | null) => v ?? "--" },
    { title: "Hành lý ký gửi", dataIndex: "hanhLyKyGui", key: "checked", render: (v?: string | null) => v ?? "--" },
    { title: "Suất ăn", dataIndex: "suatAn", key: "meal", render: (v?: string | null) => v ?? "--" },
    { title: "Giải trí", dataIndex: "giaiTri", key: "entertainment", render: (v?: string | null) => v ?? "--" },
    { title: "Điều kiện vé", dataIndex: "dieuKienVe", key: "conditions", render: (v?: string | null) => v ?? "--" },
    { title: "Thuế phí", dataIndex: "thuePhiSanBay", key: "tax", render: (v: number) => <Text strong>{fmt(v)}</Text> },
    { title: "Trạng thái", key: "st", render: (_, r) => { const m = getStatusMeta(inferStatus(r)); return <Tag color={m.color}>{m.label}</Tag>; } },
    { title: "Thao tác", key: "act", align: "center", render: (_, r) => <Space size="middle"><Button type="text" icon={<PencilLine size={16} color="#7c3aed" />} onClick={() => openEdit(r)} /><Popconfirm title="Xoá vé?" description={`Xoá ${r.soHieuChuyenBay}?`} okText="Xoá" cancelText="Huỷ" onConfirm={() => void handleDelete(r)}><Button type="text" danger icon={<Trash2 size={16} color="#ef4444" />} /></Popconfirm></Space> },
  ];

  return (
    <div style={pcs}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div><Title level={3} style={{ margin: 0, color: "#182338" }}>Quản lý vé máy bay</Title><Text style={{ color: "#7d869c" }}>Dữ liệu theo bảng VeMayBay.</Text></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <Card style={scs}><Space align="start"><Badge color="#7c3aed" /><div><Text style={{ color: "#7d869c" }}>Tổng vé</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.total}</Title></div></Space></Card>
          <Card style={scs}><Space align="start"><Badge color="#16a34a" /><div><Text style={{ color: "#7d869c" }}>Đang bán</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.available}</Title></div></Space></Card>
          <Card style={scs}><Space align="start"><Badge color="#2563eb" /><div><Text style={{ color: "#7d869c" }}>Sắp khởi hành</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.upcoming}</Title></div></Space></Card>
          <Card style={scs}><Space align="start"><Badge color="#ef4444" /><div><Text style={{ color: "#7d869c" }}>Hết chỗ</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.soldout}</Title></div></Space></Card>
        </div>

        <Card style={cs} styles={{ body: { padding: 20 } }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div><Space size={8}><Plane size={18} color="#2563eb" /><Title level={4} style={{ margin: 0, color: "#1f2a44" }}>Danh sách vé máy bay</Title></Space><Text style={{ color: "#7d869c" }}>Có {filtered.length} vé đang hiển thị.</Text></div>
              <Space wrap>
                <Input allowClear prefix={<Search size={16} color="#94a3b8" />} placeholder="Tìm hãng, số hiệu, hành trình..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260 }} />
                <Select
                  value={filterSt}
                  style={{ width: 170 }}
                  onChange={(v: TicketStatus | "all") => setFilterSt(v)}
                  options={[
                    { label: "Tất cả", value: "all" },
                    { label: "Đang bán", value: "available" },
                    { label: "Sắp khởi hành", value: "upcoming" },
                    { label: "Hết chỗ", value: "soldout" },
                  ]}
                />
                <Button type="primary" icon={<Plus size={16} />} style={{ background: "linear-gradient(135deg,#7c3aed 0%,#9333ea 100%)", borderColor: "#7c3aed" }} onClick={openCreate}>Thêm mới</Button>
              </Space>
            </div>
            <Table<FlightItem> rowKey="maVe" columns={columns} dataSource={filtered} loading={loading} pagination={{ pageSize: 10, showSizeChanger: false }} scroll={{ x: 1280 }} />
          </div>
        </Card>
      </div>

      <Modal title={editing ? "Cập nhật vé máy bay" : "Thêm vé máy bay"} open={modalOpen} onOk={() => void handleSubmit()} onCancel={() => { setModalOpen(false); reset(); }} okText={editing ? "Lưu" : "Tạo mới"} cancelText="Huỷ" confirmLoading={submitting} width={900}>
        <Form<FlightFormValues> form={form} layout="vertical">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item label="Hãng hàng không" name="hangHangKhong" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Logo hãng" name="logoHang"><Input /></Form.Item>
            <Form.Item label="Số hiệu chuyến bay" name="soHieuChuyenBay" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Hạng vé" name="hangVe" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Gói giá" name="goiGia"><Input /></Form.Item>
            <Form.Item label="Điểm khởi hành" name="diemKhoiHanh" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Mã sân bay đi" name="maSanBayDi"><Input /></Form.Item>
            <Form.Item label="Tên sân bay đi" name="tenSanBayDi"><Input /></Form.Item>
            <Form.Item label="Điểm đến" name="diemDen" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Mã sân bay đến" name="maSanBayDen"><Input /></Form.Item>
            <Form.Item label="Tên sân bay đến" name="tenSanBayDen"><Input /></Form.Item>
            <Form.Item label="Thời gian khởi hành" name="thoiGianKhoiHanh" rules={[{ required: true }]}><DatePicker showTime style={{ width: "100%" }} format="DD/MM/YYYY HH:mm" /></Form.Item>
            <Form.Item label="Thời gian đến" name="thoiGianDen"><DatePicker showTime style={{ width: "100%" }} format="DD/MM/YYYY HH:mm" /></Form.Item>
            <Form.Item label="Thời lượng (phút)" name="thoiLuongPhut"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
            <Form.Item label="Số điểm dừng" name="soDiemDung"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
            <Form.Item label="Hành lý xách tay" name="hanhLyXachTay"><Input /></Form.Item>
            <Form.Item label="Hành lý ký gửi" name="hanhLyKyGui"><Input /></Form.Item>
            <Form.Item label="Suất ăn" name="suatAn"><Input /></Form.Item>
            <Form.Item label="Giải trí" name="giaiTri"><Input /></Form.Item>
            <Form.Item label="Điều kiện vé" name="dieuKienVe"><Input.TextArea rows={3} /></Form.Item>
            <Form.Item label="Thuế phí sân bay" name="thuePhiSanBay" rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
