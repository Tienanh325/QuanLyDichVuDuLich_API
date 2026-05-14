import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import api from "../services/api";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { Badge, Button, Card, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, Tabs, Typography, message } from "antd";
import type { TableProps } from "antd";
import { MapPinned, PencilLine, Plus, Search, TrainFront, Trash2 } from "lucide-react";
import * as veApi from "../services/veService";

const { Title, Text } = Typography;
const TRAIN_API = "/api/admin/ve/tau-hoa";

interface TrainItem {
  maVe: number;
  hangTau: string;
  nhaVanHanh?: string | null;
  soHieuChuyenTau: string;
  diemKhoiHanh: string;
  gaKhoiHanh?: string | null;
  diemDen: string;
  gaDen?: string | null;
  thoiGianKhoiHanh: string;
  thoiGianDen?: string | null;
  thoiLuongPhut?: number | null;
  loaiChoMacDinh?: string | null;
  chinhSachHoan?: string | null;
}

interface TrainFormValues {
  hangTau: string;
  nhaVanHanh?: string | null;
  soHieuChuyenTau: string;
  diemKhoiHanh: string;
  gaKhoiHanh?: string | null;
  diemDen: string;
  gaDen?: string | null;
  thoiGianKhoiHanh: Dayjs;
  thoiGianDen?: Dayjs | null;
  thoiLuongPhut?: number | null;
  loaiChoMacDinh?: string | null;
  chinhSachHoan?: string | null;
}

type TicketStatus = "available" | "upcoming" | "soldout";

const mockData: TrainItem[] = [
  {
    maVe: 2001,
    hangTau: "Đường sắt Việt Nam",
    nhaVanHanh: "VNR",
    soHieuChuyenTau: "SE1",
    diemKhoiHanh: "Hà Nội",
    gaKhoiHanh: "Ga Hà Nội",
    diemDen: "Đà Nẵng",
    gaDen: "Ga Đà Nẵng",
    thoiGianKhoiHanh: dayjs().add(5, "day").hour(19).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss"),
    thoiGianDen: dayjs().add(6, "day").hour(7).minute(30).second(0).format("YYYY-MM-DDTHH:mm:ss"),
    thoiLuongPhut: 690,
    loaiChoMacDinh: "Giường nằm",
    chinhSachHoan: "Hoàn tiền theo quy định",
  },
  {
    maVe: 2002,
    hangTau: "Đường sắt Việt Nam",
    nhaVanHanh: "VNR",
    soHieuChuyenTau: "SE3",
    diemKhoiHanh: "TP.HCM",
    gaKhoiHanh: "Ga Sài Gòn",
    diemDen: "Nha Trang",
    gaDen: "Ga Nha Trang",
    thoiGianKhoiHanh: dayjs().add(3, "day").hour(20).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss"),
    thoiGianDen: dayjs().add(4, "day").hour(5).minute(30).second(0).format("YYYY-MM-DDTHH:mm:ss"),
    thoiLuongPhut: 570,
    loaiChoMacDinh: "Ghế mềm",
    chinhSachHoan: "Hoàn tiền theo quy định",
  },
];

const fmtDate = (v?: string | null) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "--");

function inferStatus(item: Pick<TrainItem, "thoiGianKhoiHanh" | "thoiGianDen">): TicketStatus {
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

function normalize(raw: Record<string, unknown>, idx: number): TrainItem {
  return {
    maVe: Number(raw.maVe ?? raw.id ?? idx + 1),
    hangTau: String(raw.hangTau ?? raw.airline ?? raw.brand ?? ""),
    nhaVanHanh: raw.nhaVanHanh ? String(raw.nhaVanHanh) : null,
    soHieuChuyenTau: String(raw.soHieuChuyenTau ?? raw.trainNo ?? ""),
    diemKhoiHanh: String(raw.diemKhoiHanh ?? raw.departurePoint ?? ""),
    gaKhoiHanh: raw.gaKhoiHanh ? String(raw.gaKhoiHanh) : null,
    diemDen: String(raw.diemDen ?? raw.destination ?? ""),
    gaDen: raw.gaDen ? String(raw.gaDen) : null,
    thoiGianKhoiHanh: String(raw.thoiGianKhoiHanh ?? raw.departureTime ?? dayjs().format("YYYY-MM-DDTHH:mm:ss")),
    thoiGianDen: raw.thoiGianDen ? String(raw.thoiGianDen) : null,
    thoiLuongPhut: raw.thoiLuongPhut == null ? null : Number(raw.thoiLuongPhut),
    loaiChoMacDinh: raw.loaiChoMacDinh ? String(raw.loaiChoMacDinh) : null,
    chinhSachHoan: raw.chinhSachHoan ? String(raw.chinhSachHoan) : null,
  };
}

const cs: CSSProperties = { borderRadius: 20, border: "1px solid #eceef5", boxShadow: "0 18px 45px rgba(15,23,42,0.06)" };
const scs: CSSProperties = { ...cs, height: "100%", background: "#fff" };
const pcs: CSSProperties = { padding: 24, background: "linear-gradient(180deg,#f7f8fc 0%,#f2f4f8 100%)", minHeight: "100%" };

export default function AdminVeTauHoa() {
  const [form] = Form.useForm<TrainFormValues>();
  const [data, setData] = useState<TrainItem[]>(mockData);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TrainItem | null>(null);
  const [search, setSearch] = useState("");
  const [filterSt, setFilterSt] = useState<TicketStatus | "all">("all");
  const [isMock, setIsMock] = useState(true);
  const [manageOpen, setManageOpen] = useState(false);
  const [managing, setManaging] = useState<TrainItem | null>(null);
  const [childLoading, setChildLoading] = useState(false);
  const [priceRows, setPriceRows] = useState<veApi.GiaVe[]>([]);
  const [amenityRows, setAmenityRows] = useState<veApi.VeTienIchItem[]>([]);
  const [khoangRows, setKhoangRows] = useState<veApi.VeTauKhoangItem[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const tickets = await api.get(TRAIN_API, { params: { limit: 1000 } }).then(r => extractArray(r.data).map((x, i) => normalize(x as Record<string, unknown>, i)));
      setData(tickets.length > 0 ? tickets : mockData);
      setIsMock(tickets.length === 0);
      if (tickets.length === 0) message.info("API chưa trả dữ liệu, đang hiển thị dữ liệu mẫu.");
    } catch (e) {
      setData(mockData);
      setIsMock(true);
      message.warning(axios.isAxiosError(e) ? `Không kết nối được API ${TRAIN_API}.` : "Lỗi tải dữ liệu vé tàu hoả.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return data.filter(it => {
      const ms = kw.length === 0 || String(it.maVe).includes(kw) || it.hangTau.toLowerCase().includes(kw) || it.soHieuChuyenTau.toLowerCase().includes(kw) || it.diemKhoiHanh.toLowerCase().includes(kw) || it.diemDen.toLowerCase().includes(kw);
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

  const openManage = async (item: TrainItem) => {
    setManaging(item); setManageOpen(true); setChildLoading(true);
    try {
      const [prices, amenities, khoang] = await Promise.all([
        veApi.getGiaVe(item.maVe), veApi.adminGetVeTienIch(item.maVe), veApi.adminGetVeTauKhoang(item.maVe),
      ]);
      setPriceRows(prices); setAmenityRows(amenities); setKhoangRows(khoang);
    } catch {
      message.error("Không tải được dữ liệu quản lý.");
      setPriceRows([]); setAmenityRows([]); setKhoangRows([]);
    } finally {
      setChildLoading(false);
    }
  };

  const reset = () => { form.resetFields(); setEditing(null); };
  const openCreate = () => {
    reset();
    form.setFieldsValue({
      hangTau: "Đường sắt Việt Nam",
      nhaVanHanh: "VNR",
      soHieuChuyenTau: `TR${Date.now().toString().slice(-4)}`,
      diemKhoiHanh: "Hà Nội",
      gaKhoiHanh: "Ga Hà Nội",
      diemDen: "Đà Nẵng",
      gaDen: "Ga Đà Nẵng",
      thoiGianKhoiHanh: dayjs().add(3, "day").hour(19).minute(0).second(0),
      thoiGianDen: dayjs().add(4, "day").hour(7).minute(30).second(0),
      thoiLuongPhut: 690,
      loaiChoMacDinh: "Giường nằm",
      chinhSachHoan: "Hoàn tiền theo quy định",
    });
    setModalOpen(true);
  };
  const openEdit = (it: TrainItem) => { setEditing(it); form.setFieldsValue({ ...it, thoiGianKhoiHanh: dayjs(it.thoiGianKhoiHanh), thoiGianDen: it.thoiGianDen ? dayjs(it.thoiGianDen) : null }); setModalOpen(true); };

  const handleDelete = async (it: TrainItem) => {
    const prev = data; setData(c => c.filter(e => e.maVe !== it.maVe));
    if (isMock) { message.success(`Đã xoá ${it.soHieuChuyenTau} (mẫu).`); return; }
    try { await api.delete(`${TRAIN_API}/${it.maVe}`); message.success(`Đã xoá ${it.soHieuChuyenTau}.`); }
    catch { setData(prev); message.error("Xoá không thành công."); }
  };

  const handleSubmit = async () => {
    try {
      const v = await form.validateFields();
      setSubmitting(true);
      const payload: TrainItem = {
        maVe: editing?.maVe ?? Date.now(),
        hangTau: v.hangTau.trim(),
        nhaVanHanh: v.nhaVanHanh?.trim() || null,
        soHieuChuyenTau: v.soHieuChuyenTau.trim(),
        diemKhoiHanh: v.diemKhoiHanh.trim(),
        gaKhoiHanh: v.gaKhoiHanh?.trim() || null,
        diemDen: v.diemDen.trim(),
        gaDen: v.gaDen?.trim() || null,
        thoiGianKhoiHanh: v.thoiGianKhoiHanh.format("YYYY-MM-DDTHH:mm:ss"),
        thoiGianDen: v.thoiGianDen ? v.thoiGianDen.format("YYYY-MM-DDTHH:mm:ss") : null,
        thoiLuongPhut: v.thoiLuongPhut ?? null,
        loaiChoMacDinh: v.loaiChoMacDinh?.trim() || null,
        chinhSachHoan: v.chinhSachHoan?.trim() || null,
      };

      if (isMock) {
        setData(c => editing ? c.map(i => i.maVe === editing.maVe ? payload : i) : [payload, ...c]);
        message.success(editing ? "Cập nhật (mẫu)." : "Thêm (mẫu).");
        setModalOpen(false);
        reset();
        return;
      }

      if (editing) {
        const r = await api.put(`${TRAIN_API}/${payload.maVe}`, payload);
        const u = normalize((r.data?.data ?? r.data) as Record<string, unknown>, 0);
        setData(c => c.map(i => i.maVe === editing.maVe ? u : i));
        message.success("Cập nhật thành công.");
      } else {
        const r = await api.post(TRAIN_API, payload);
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

  const columns: TableProps<TrainItem>["columns"] = [
    { title: "Tên vé", key: "ten", render: (_, r) => <div><div style={{ fontWeight: 700, color: "#1f2a44" }}>{r.hangTau}</div><Text style={{ color: "#7d869c", fontSize: 13 }}>Mã vé: {r.maVe}</Text></div> },
    { title: "Chuyến tàu", key: "train", render: (_, r) => <div><div style={{ fontWeight: 600 }}>{r.soHieuChuyenTau}</div><div style={{ color: "#7d869c", fontSize: 13 }}>{r.nhaVanHanh ?? "--"}</div></div> },
    { title: "Hành trình", key: "route", render: (_, r) => <div><Space size={6}><MapPinned size={14} color="#2563eb" /><Text>{r.diemKhoiHanh}</Text></Space><div style={{ color: "#7d869c", fontSize: 13, marginTop: 4 }}>Đến: {r.diemDen}</div></div> },
    { title: "Ga", key: "station", render: (_, r) => <div><div style={{ color: "#1f2a44", fontWeight: 600 }}>{r.gaKhoiHanh ?? "--"}</div><div style={{ color: "#7d869c", fontSize: 12 }}>{r.gaDen ?? "--"}</div></div> },
    { title: "Khởi hành", key: "date", render: (_, r) => <div><div style={{ color: "#1f2a44", fontWeight: 600 }}>{fmtDate(r.thoiGianKhoiHanh)}</div><div style={{ color: "#7d869c", fontSize: 12 }}>{r.thoiGianDen ? fmtDate(r.thoiGianDen) : "--"}</div></div> },
    { title: "Thời lượng", dataIndex: "thoiLuongPhut", key: "duration", render: (v: number | null | undefined) => v ? `${v} phút` : "--" },
    { title: "Loại chỗ", dataIndex: "loaiChoMacDinh", key: "seat", render: (v?: string | null) => v ?? "--" },
    { title: "Chính sách", dataIndex: "chinhSachHoan", key: "policy", render: (v?: string | null) => v ?? "--" },
    { title: "Trạng thái", key: "st", render: (_, r) => { const m = getStatusMeta(inferStatus(r)); return <Tag color={m.color}>{m.label}</Tag>; } },
    { title: "Thao tác", key: "act", align: "center", render: (_, r) => <Space size="middle"><Button size="small" onClick={() => void openManage(r)}>Quản lý</Button><Button type="text" icon={<PencilLine size={16} color="#7c3aed" />} onClick={() => openEdit(r)} /><Popconfirm title="Xoá vé?" description={`Xoá ${r.soHieuChuyenTau}?`} okText="Xoá" cancelText="Huỷ" onConfirm={() => void handleDelete(r)}><Button type="text" danger icon={<Trash2 size={16} color="#ef4444" />} /></Popconfirm></Space> },
  ];

  return (
    <div style={pcs}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div><Title level={3} style={{ margin: 0, color: "#182338" }}>Quản lý vé tàu hoả</Title><Text style={{ color: "#7d869c" }}>Dữ liệu theo bảng VeTauHoa.</Text></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <Card style={scs}><Space align="start"><Badge color="#7c3aed" /><div><Text style={{ color: "#7d869c" }}>Tổng vé</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.total}</Title></div></Space></Card>
          <Card style={scs}><Space align="start"><Badge color="#16a34a" /><div><Text style={{ color: "#7d869c" }}>Còn chỗ</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.available}</Title></div></Space></Card>
          <Card style={scs}><Space align="start"><Badge color="#2563eb" /><div><Text style={{ color: "#7d869c" }}>Sắp khởi hành</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.upcoming}</Title></div></Space></Card>
          <Card style={scs}><Space align="start"><Badge color="#ef4444" /><div><Text style={{ color: "#7d869c" }}>Hết chỗ</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.soldout}</Title></div></Space></Card>
        </div>
        <Card style={cs} styles={{ body: { padding: 20 } }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div><Space size={8}><TrainFront size={18} color="#2563eb" /><Title level={4} style={{ margin: 0, color: "#1f2a44" }}>Danh sách vé tàu hoả</Title></Space><Text style={{ color: "#7d869c" }}>Có {filtered.length} vé đang hiển thị.</Text></div>
              <Space wrap>
                <Input allowClear prefix={<Search size={16} color="#94a3b8" />} placeholder="Tìm tên vé, hành trình, hãng..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260 }} />
                <Select value={filterSt} style={{ width: 170 }} onChange={(v: TicketStatus | "all") => setFilterSt(v)} options={[{ label: "Tất cả", value: "all" }, { label: "Còn chỗ", value: "available" }, { label: "Sắp khởi hành", value: "upcoming" }, { label: "Hết chỗ", value: "soldout" }]} />
                <Button type="primary" icon={<Plus size={16} />} style={{ background: "linear-gradient(135deg,#7c3aed 0%,#9333ea 100%)", borderColor: "#7c3aed" }} onClick={openCreate}>Thêm mới</Button>
              </Space>
            </div>
            <Table<TrainItem> rowKey="maVe" columns={columns} dataSource={filtered} loading={loading} pagination={{ pageSize: 10, showSizeChanger: false }} scroll={{ x: 1280 }} />
          </div>
        </Card>
      </div>

      <Modal title={editing ? "Cập nhật vé tàu" : "Thêm vé tàu"} open={modalOpen} onOk={() => void handleSubmit()} onCancel={() => { setModalOpen(false); reset(); }} okText={editing ? "Lưu" : "Tạo mới"} cancelText="Huỷ" confirmLoading={submitting} width={900}>
        <Form<TrainFormValues> form={form} layout="vertical">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item label="Hãng tàu" name="hangTau" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Nhà vận hành" name="nhaVanHanh"><Input /></Form.Item>
            <Form.Item label="Số hiệu chuyến tàu" name="soHieuChuyenTau" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Điểm khởi hành" name="diemKhoiHanh" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Ga khởi hành" name="gaKhoiHanh"><Input /></Form.Item>
            <Form.Item label="Điểm đến" name="diemDen" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Ga đến" name="gaDen"><Input /></Form.Item>
            <Form.Item label="Thời gian khởi hành" name="thoiGianKhoiHanh" rules={[{ required: true }]}><DatePicker showTime style={{ width: "100%" }} format="DD/MM/YYYY HH:mm" /></Form.Item>
            <Form.Item label="Thời gian đến" name="thoiGianDen"><DatePicker showTime style={{ width: "100%" }} format="DD/MM/YYYY HH:mm" /></Form.Item>
            <Form.Item label="Thời lượng (phút)" name="thoiLuongPhut"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
            <Form.Item label="Loại chỗ mặc định" name="loaiChoMacDinh"><Input /></Form.Item>
            <Form.Item label="Chính sách hoàn" name="chinhSachHoan"><Input.TextArea rows={3} /></Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal title={managing ? `Quản lý: ${managing.soHieuChuyenTau}` : "Quản lý vé"} open={manageOpen} onCancel={() => setManageOpen(false)} footer={null} width={1000}>
        <Tabs items={[
          { key: "prices", label: "Bảng giá", children: <Table<veApi.GiaVe> rowKey="maGiaVe" loading={childLoading} dataSource={priceRows} pagination={false} columns={[{ title: "Loại vé", dataIndex: "tenLoaiVe" }, { title: "Giá", dataIndex: "gia", render: (v: number) => fmt(Number(v || 0)) }, { title: "Giá gốc", dataIndex: "giaGoc", render: (v: number) => v ? fmt(Number(v)) : "--" }, { title: "Số chỗ", dataIndex: "soChoTrong" }, { title: "Thuế phí", dataIndex: "thuePhi", render: (v: number) => fmt(Number(v || 0)) }]} /> },
          { key: "amenities", label: "Tiện ích", children: <Table<veApi.VeTienIchItem> rowKey="maTienIch" loading={childLoading} dataSource={amenityRows} pagination={false} columns={[{ title: "Tên tiện ích", dataIndex: "tenTienIch" }, { title: "Icon", dataIndex: "icon" }, { title: "Loại", dataIndex: "loaiTienIch", render: (v: string) => <Tag>{v}</Tag> }]} /> },
          { key: "khoang", label: "Khoang tàu", children: <Table<veApi.VeTauKhoangItem> rowKey="maKhoang" loading={childLoading} dataSource={khoangRows} pagination={false} columns={[{ title: "Tên khoang", dataIndex: "tenKhoang" }, { title: "Toa", dataIndex: "toaSo" }, { title: "Loại chỗ", dataIndex: "loaiCho" }, { title: "Thứ tự", dataIndex: "thuTu" }]} /> },
        ]} />
      </Modal>
    </div>
  );
}
