import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { TableProps } from "antd";
import { MapPinned, PencilLine, Plane, Plus, RefreshCw, Search, Ticket, TrainFront, Trash2 } from "lucide-react";

const { Title, Text } = Typography;

export type TicketCategory = "all" | "flight" | "train" | "park";
type TicketStatus = "available" | "upcoming" | "soldout";

interface DichVuOption {
  maDichVu: number;
  ten: string;
}

interface TicketItem {
  maVe: number;
  maDichVu: number;
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

interface TicketFormValues {
  maDichVu: number;
  diemKhoiHanh: string;
  diemDen: string;
  ngayKhoiHanh: Dayjs;
  gia: number;
  soChoTrong: number;
  hang: string;
  LoaiVeID: number;
  TenVe: string;
  danhGia: number;
}

interface AdminTicketPageProps {
  category: TicketCategory;
  title: string;
  description: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const VE_API_PATH = import.meta.env.VITE_VE_API_PATH ?? "/api/ve";
const DICH_VU_API_PATH = import.meta.env.VITE_DICH_VU_API_PATH ?? "/api/dich-vu";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const mockDichVu: DichVuOption[] = [
  { maDichVu: 201, ten: "Vé máy bay nội địa" },
  { maDichVu: 202, ten: "Vé tàu hoả nhanh" },
  { maDichVu: 203, ten: "Vé công viên giải trí" },
];

const mockTickets: TicketItem[] = [
  {
    maVe: 1,
    maDichVu: 201,
    diemKhoiHanh: "Hà Nội",
    diemDen: "TP.HCM",
    ngayKhoiHanh: dayjs().add(2, "day").format("YYYY-MM-DD"),
    gia: 1890000,
    soChoTrong: 24,
    hang: "Vietnam Airlines",
    LoaiVeID: 1,
    TenVe: "Vé máy bay phổ thông",
    danhGia: 4.6,
  },
  {
    maVe: 2,
    maDichVu: 202,
    diemKhoiHanh: "Hà Nội",
    diemDen: "Đà Nẵng",
    ngayKhoiHanh: dayjs().add(5, "day").format("YYYY-MM-DD"),
    gia: 950000,
    soChoTrong: 48,
    hang: "Đường sắt Việt Nam",
    LoaiVeID: 2,
    TenVe: "Vé tàu hoả giường nằm",
    danhGia: 4.3,
  },
  {
    maVe: 3,
    maDichVu: 203,
    diemKhoiHanh: "Cổng chính",
    diemDen: "Khu trò chơi mạo hiểm",
    ngayKhoiHanh: dayjs().add(1, "day").format("YYYY-MM-DD"),
    gia: 650000,
    soChoTrong: 120,
    hang: "Sun World",
    LoaiVeID: 3,
    TenVe: "Vé khu vui chơi trọn gói",
    danhGia: 4.8,
  },
  {
    maVe: 4,
    maDichVu: 201,
    diemKhoiHanh: "Đà Nẵng",
    diemDen: "Phú Quốc",
    ngayKhoiHanh: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    gia: 2190000,
    soChoTrong: 0,
    hang: "VietJet Air",
    LoaiVeID: 1,
    TenVe: "Vé máy bay khuyến mãi",
    danhGia: 4.1,
  },
];

const currencyFormatter = new Intl.NumberFormat("vi-VN");

function formatCurrency(value: number): string {
  return `${currencyFormatter.format(value)} đ`;
}

function formatDate(value?: string | null): string {
  if (!value) {
    return "--";
  }
  return dayjs(value).format("DD/MM/YYYY");
}

function inferCategory(item: Pick<TicketItem, "TenVe" | "hang" | "maDichVu">): Exclude<TicketCategory, "all"> {
  const combined = `${item.TenVe} ${item.hang} ${item.maDichVu}`.toLowerCase();
  if (combined.includes("tàu") || combined.includes("tau") || combined.includes("đường sắt") || combined.includes("duong sat")) {
    return "train";
  }
  if (combined.includes("vui chơi") || combined.includes("khu") || combined.includes("park") || combined.includes("sun world")) {
    return "park";
  }
  return "flight";
}

function inferStatus(item: Pick<TicketItem, "ngayKhoiHanh" | "soChoTrong">): TicketStatus {
  if (item.soChoTrong <= 0) {
    return "soldout";
  }
  if (dayjs(item.ngayKhoiHanh).isAfter(dayjs(), "day")) {
    return "upcoming";
  }
  return "available";
}

function getStatusMeta(status: TicketStatus): { label: string; color: string } {
  switch (status) {
    case "available":
      return { label: "Còn chỗ", color: "green" };
    case "upcoming":
      return { label: "Sắp khởi hành", color: "blue" };
    default:
      return { label: "Hết chỗ", color: "red" };
  }
}

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (typeof payload === "object" && payload !== null) {
    const data = payload as { data?: unknown; items?: unknown };
    if (Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data.items)) {
      return data.items;
    }
  }
  return [];
}

function normalizeTicket(input: unknown, index: number): TicketItem {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    maVe: Number(raw.maVe ?? raw.id ?? index + 1),
    maDichVu: Number(raw.maDichVu ?? raw.serviceId ?? 0),
    diemKhoiHanh: String(raw.diemKhoiHanh ?? raw.departurePoint ?? ""),
    diemDen: String(raw.diemDen ?? raw.destination ?? ""),
    ngayKhoiHanh: String(raw.ngayKhoiHanh ?? raw.departureDate ?? dayjs().format("YYYY-MM-DD")),
    gia: Number(raw.gia ?? raw.price ?? 0),
    soChoTrong: Number(raw.soChoTrong ?? raw.availableSeats ?? 0),
    hang: String(raw.hang ?? raw.brand ?? ""),
    LoaiVeID: Number(raw.LoaiVeID ?? raw.loaiVeId ?? raw.ticketTypeId ?? 0),
    TenVe: String(raw.TenVe ?? raw.tenVe ?? raw.name ?? `Vé ${index + 1}`),
    danhGia: Number(raw.danhGia ?? raw.rating ?? 0),
  };
}

function normalizeDichVu(input: unknown, index: number): DichVuOption {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    maDichVu: Number(raw.maDichVu ?? raw.id ?? index + 1),
    ten: String(raw.ten ?? raw.name ?? `Dịch vụ ${index + 1}`),
  };
}

async function fetchTickets(): Promise<TicketItem[]> {
  const response = await apiClient.get(VE_API_PATH);
  return extractArray(response.data).map(normalizeTicket);
}

async function fetchDichVuOptions(): Promise<DichVuOption[]> {
  const response = await apiClient.get(DICH_VU_API_PATH);
  return extractArray(response.data).map(normalizeDichVu);
}

async function createTicket(item: TicketItem): Promise<TicketItem> {
  const response = await apiClient.post(VE_API_PATH, item);
  return normalizeTicket(response.data, 0);
}

async function updateTicket(item: TicketItem): Promise<TicketItem> {
  const response = await apiClient.put(`${VE_API_PATH}/${item.maVe}`, item);
  return normalizeTicket(response.data, 0);
}

async function deleteTicket(id: number): Promise<void> {
  await apiClient.delete(`${VE_API_PATH}/${id}`);
}

function getPageDefaults(category: TicketCategory): {
  tenVe: string;
  hang: string;
  diemKhoiHanh: string;
  diemDen: string;
} {
  switch (category) {
    case "flight":
      return {
        tenVe: "Vé máy bay phổ thông",
        hang: "Vietnam Airlines",
        diemKhoiHanh: "Hà Nội",
        diemDen: "TP.HCM",
      };
    case "train":
      return {
        tenVe: "Vé tàu hoả ghế mềm",
        hang: "Đường sắt Việt Nam",
        diemKhoiHanh: "Hà Nội",
        diemDen: "Đà Nẵng",
      };
    case "park":
      return {
        tenVe: "Vé khu vui chơi trọn gói",
        hang: "Sun World",
        diemKhoiHanh: "Cổng chính",
        diemDen: "Khu trò chơi trung tâm",
      };
    default:
      return {
        tenVe: "Vé dịch vụ",
        hang: "Đối tác du lịch",
        diemKhoiHanh: "Điểm A",
        diemDen: "Điểm B",
      };
  }
}

const pageContainerStyle: CSSProperties = {
  padding: 24,
  background: "linear-gradient(180deg, #f7f8fc 0%, #f2f4f8 100%)",
  minHeight: "100%",
};

const cardStyle: CSSProperties = {
  borderRadius: 20,
  border: "1px solid #eceef5",
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
};

const statCardStyle: CSSProperties = {
  ...cardStyle,
  height: "100%",
  background: "#ffffff",
};

export default function AdminTicketPage({ category, title, description }: AdminTicketPageProps) {
  const [form] = Form.useForm<TicketFormValues>();
  const [data, setData] = useState<TicketItem[]>([]);
  const [dichVuOptions, setDichVuOptions] = useState<DichVuOption[]>(mockDichVu);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TicketItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<TicketStatus | "all">("all");
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const [tickets, services] = await Promise.all([
        fetchTickets(),
        fetchDichVuOptions().catch(() => mockDichVu),
      ]);
      setDichVuOptions(services.length > 0 ? services : mockDichVu);
      setData(tickets.length > 0 ? tickets : mockTickets);
      setIsUsingMockData(tickets.length === 0);
      if (tickets.length === 0) {
        message.info("API chưa trả dữ liệu vé, đang hiển thị dữ liệu mẫu.");
      }
    } catch (error) {
      setDichVuOptions(mockDichVu);
      setData(mockTickets);
      setIsUsingMockData(true);
      if (axios.isAxiosError(error)) {
        message.warning(`Không kết nối được API ${API_BASE_URL}${VE_API_PATH}. Đang dùng dữ liệu mẫu.`);
      } else {
        message.warning("Có lỗi khi tải dữ liệu vé. Đang dùng dữ liệu mẫu.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTickets();
  }, []);

  const dichVuMap = useMemo(
    () => new Map(dichVuOptions.map((item) => [item.maDichVu, item.ten])),
    [dichVuOptions],
  );

  const filteredData = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    return data.filter((item) => {
      const itemCategory = inferCategory(item);
      const matchesCategory = category === "all" || itemCategory === category;
      const matchesKeyword =
        keyword.length === 0 ||
        String(item.maVe).includes(keyword) ||
        item.TenVe.toLowerCase().includes(keyword) ||
        item.diemKhoiHanh.toLowerCase().includes(keyword) ||
        item.diemDen.toLowerCase().includes(keyword) ||
        item.hang.toLowerCase().includes(keyword);
      const matchesStatus = filterStatus === "all" || inferStatus(item) === filterStatus;
      return matchesCategory && matchesKeyword && matchesStatus;
    });
  }, [category, data, filterStatus, searchText]);

  const stats = useMemo(() => {
    const scoped = data.filter((item) => category === "all" || inferCategory(item) === category);
    return {
      total: scoped.length,
      available: scoped.filter((item) => inferStatus(item) === "available").length,
      upcoming: scoped.filter((item) => inferStatus(item) === "upcoming").length,
      soldout: scoped.filter((item) => inferStatus(item) === "soldout").length,
    };
  }, [category, data]);

  const resetForm = () => {
    form.resetFields();
    setEditingItem(null);
  };

  const openCreateModal = () => {
    resetForm();
    const defaults = getPageDefaults(category);
    form.setFieldsValue({
      maDichVu: dichVuOptions[0]?.maDichVu,
      diemKhoiHanh: defaults.diemKhoiHanh,
      diemDen: defaults.diemDen,
      ngayKhoiHanh: dayjs().add(3, "day"),
      gia: 1000000,
      soChoTrong: 20,
      hang: defaults.hang,
      LoaiVeID: 1,
      TenVe: defaults.tenVe,
      danhGia: 4.5,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: TicketItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      maDichVu: item.maDichVu,
      diemKhoiHanh: item.diemKhoiHanh,
      diemDen: item.diemDen,
      ngayKhoiHanh: dayjs(item.ngayKhoiHanh),
      gia: item.gia,
      soChoTrong: item.soChoTrong,
      hang: item.hang,
      LoaiVeID: item.LoaiVeID,
      TenVe: item.TenVe,
      danhGia: item.danhGia,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item: TicketItem) => {
    const previous = data;
    setData((current) => current.filter((entry) => entry.maVe !== item.maVe));
    if (isUsingMockData) {
      message.success(`Đã xoá ${item.TenVe} trên dữ liệu mẫu.`);
      return;
    }
    try {
      await deleteTicket(item.maVe);
      message.success(`Đã xoá ${item.TenVe}.`);
    } catch {
      setData(previous);
      message.error("Xoá không thành công, dữ liệu đã được hoàn lại.");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const payload: TicketItem = {
        maVe: editingItem?.maVe ?? Date.now(),
        maDichVu: values.maDichVu,
        diemKhoiHanh: values.diemKhoiHanh.trim(),
        diemDen: values.diemDen.trim(),
        ngayKhoiHanh: values.ngayKhoiHanh.format("YYYY-MM-DD"),
        gia: values.gia,
        soChoTrong: values.soChoTrong,
        hang: values.hang.trim(),
        LoaiVeID: values.LoaiVeID,
        TenVe: values.TenVe.trim(),
        danhGia: values.danhGia,
      };

      if (isUsingMockData) {
        setData((current) =>
          editingItem
            ? current.map((item) => (item.maVe === editingItem.maVe ? payload : item))
            : [payload, ...current],
        );
        message.success(editingItem ? "Đã cập nhật vé trên dữ liệu mẫu." : "Đã thêm vé trên dữ liệu mẫu.");
        setModalOpen(false);
        resetForm();
        return;
      }

      if (editingItem) {
        const updated = await updateTicket(payload);
        setData((current) => current.map((item) => (item.maVe === editingItem.maVe ? updated : item)));
        message.success("Cập nhật vé thành công.");
      } else {
        const created = await createTicket(payload);
        setData((current) => [created, ...current]);
        message.success("Thêm vé thành công.");
      }

      setModalOpen(false);
      resetForm();
    } catch (error) {
      if (!axios.isAxiosError(error) && !(error instanceof Error)) {
        return;
      }
      if (axios.isAxiosError(error)) {
        message.error("Không lưu được dữ liệu lên API. Kiểm tra endpoint hoặc backend rồi thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableProps<TicketItem>["columns"] = [
    {
      title: "Tên vé",
      key: "TenVe",
      render: (_value, record) => (
        <div>
          <div style={{ fontWeight: 700, color: "#1f2a44" }}>{record.TenVe}</div>
          <Text style={{ color: "#7d869c", fontSize: 13 }}>Mã vé: {record.maVe}</Text>
        </div>
      ),
    },
    {
      title: "Hành trình",
      key: "route",
      render: (_value, record) => (
        <div>
          <Space size={6}>
            <MapPinned size={14} color="#2563eb" />
            <Text>{record.diemKhoiHanh}</Text>
          </Space>
          <div style={{ color: "#7d869c", fontSize: 13, marginTop: 4 }}>Đến: {record.diemDen}</div>
        </div>
      ),
    },
    {
      title: "Khởi hành",
      key: "date",
      render: (_value, record) => (
        <div>
          <div style={{ color: "#1f2a44", fontWeight: 600 }}>{formatDate(record.ngayKhoiHanh)}</div>
          <div style={{ color: "#7d869c", fontSize: 12 }}>{record.hang}</div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "gia",
      key: "gia",
      render: (value: number) => <Text strong>{formatCurrency(value)}</Text>,
    },
    {
      title: "Chỗ trống",
      dataIndex: "soChoTrong",
      key: "soChoTrong",
      render: (value: number) => <Tag color={value > 0 ? "cyan" : "red"}>{value}</Tag>,
    },
    {
      title: "Loại vé",
      key: "LoaiVeID",
      render: (_value, record) => (
        <div>
          <div>ID: {record.LoaiVeID}</div>
          <div style={{ color: "#7d869c", fontSize: 12 }}>{dichVuMap.get(record.maDichVu) ?? `Dịch vụ #${record.maDichVu}`}</div>
        </div>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "danhGia",
      key: "danhGia",
      render: (value: number) => <Tag color="gold">{value.toFixed(1)} / 5</Tag>,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_value, record) => {
        const meta = getStatusMeta(inferStatus(record));
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_value, record) => (
        <Space size="middle">
          <Button type="text" icon={<PencilLine size={16} color="#7c3aed" />} onClick={() => openEditModal(record)} />
          <Popconfirm title="Xoá vé?" description={`Bạn có chắc muốn xoá ${record.TenVe}?`} okText="Xoá" cancelText="Huỷ" onConfirm={() => void handleDelete(record)}>
            <Button type="text" danger icon={<Trash2 size={16} color="#ef4444" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pageIcon =
    category === "flight" ? <Plane size={18} color="#2563eb" /> : category === "train" ? <TrainFront size={18} color="#2563eb" /> : <Ticket size={18} color="#2563eb" />;

  return (
    <div style={pageContainerStyle}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <Title level={3} style={{ margin: 0, color: "#182338" }}>{title}</Title>
            <Text style={{ color: "#7d869c" }}>{description}</Text>
          </div>
          <Space wrap>
            <Tag color={isUsingMockData ? "gold" : "green"} style={{ padding: "6px 10px" }}>
              {isUsingMockData ? "Đang hiển thị dữ liệu mẫu" : `API: ${API_BASE_URL}${VE_API_PATH}`}
            </Tag>
            <Button icon={<RefreshCw size={16} />} onClick={() => void loadTickets()}>Tải lại</Button>
          </Space>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <Card style={statCardStyle}><Space align="start"><Badge color="#7c3aed" /><div><Text style={{ color: "#7d869c" }}>Tổng vé</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.total}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#16a34a" /><div><Text style={{ color: "#7d869c" }}>Còn chỗ</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.available}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#2563eb" /><div><Text style={{ color: "#7d869c" }}>Sắp khởi hành</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.upcoming}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#ef4444" /><div><Text style={{ color: "#7d869c" }}>Hết chỗ</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.soldout}</Title></div></Space></Card>
        </div>

        <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <Space size={8}>
                  {pageIcon}
                  <Title level={4} style={{ margin: 0, color: "#1f2a44" }}>Danh sách vé</Title>
                </Space>
                <Text style={{ color: "#7d869c" }}>Có {filteredData.length} vé đang hiển thị trong bảng.</Text>
              </div>
              <Space wrap>
                <Input allowClear prefix={<Search size={16} color="#94a3b8" />} placeholder="Tìm tên vé, hành trình, hãng..." value={searchText} onChange={(event) => setSearchText(event.target.value)} style={{ width: 260 }} />
                <Select value={filterStatus} style={{ width: 170 }} onChange={(value) => setFilterStatus(value)} options={[{ label: "Tất cả trạng thái", value: "all" }, { label: "Còn chỗ", value: "available" }, { label: "Sắp khởi hành", value: "upcoming" }, { label: "Hết chỗ", value: "soldout" }]} />
                <Button type="primary" icon={<Plus size={16} />} style={{ background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)", borderColor: "#7c3aed" }} onClick={openCreateModal}>Thêm mới</Button>
              </Space>
            </div>

            <Table<TicketItem> rowKey="maVe" columns={columns} dataSource={filteredData} loading={loading} pagination={{ pageSize: 6, showSizeChanger: false, showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} vé` }} scroll={{ x: 1280 }} />
          </Space>
        </Card>
      </Space>

      <Modal title={editingItem ? "Cập nhật vé" : "Thêm vé"} open={modalOpen} onOk={() => void handleSubmit()} onCancel={() => { setModalOpen(false); resetForm(); }} okText={editingItem ? "Lưu thay đổi" : "Tạo mới"} cancelText="Huỷ" confirmLoading={submitting}>
        <Form<TicketFormValues> form={form} layout="vertical">
          <Form.Item label="Dịch vụ" name="maDichVu" rules={[{ required: true, message: "Chọn dịch vụ." }]}>
            <Select options={dichVuOptions.map((item) => ({ label: `${item.ten} (#${item.maDichVu})`, value: item.maDichVu }))} />
          </Form.Item>
          <Form.Item label="Tên vé" name="TenVe" rules={[{ required: true, message: "Nhập tên vé." }]}><Input /></Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <Form.Item label="Điểm khởi hành" name="diemKhoiHanh" rules={[{ required: true, message: "Nhập điểm khởi hành." }]}><Input /></Form.Item>
            <Form.Item label="Điểm đến" name="diemDen" rules={[{ required: true, message: "Nhập điểm đến." }]}><Input /></Form.Item>
            <Form.Item label="Ngày khởi hành" name="ngayKhoiHanh" rules={[{ required: true, message: "Chọn ngày khởi hành." }]}><DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" /></Form.Item>
            <Form.Item label="Giá" name="gia" rules={[{ required: true, message: "Nhập giá vé." }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
            <Form.Item label="Số chỗ trống" name="soChoTrong" rules={[{ required: true, message: "Nhập số chỗ trống." }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
            <Form.Item label="Hãng/Đơn vị" name="hang" rules={[{ required: true, message: "Nhập hãng hoặc đơn vị." }]}><Input /></Form.Item>
            <Form.Item label="LoaiVeID" name="LoaiVeID" rules={[{ required: true, message: "Nhập LoaiVeID." }]}><InputNumber min={1} style={{ width: "100%" }} /></Form.Item>
            <Form.Item label="Đánh giá" name="danhGia" rules={[{ required: true, message: "Nhập đánh giá." }]}><InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} /></Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
