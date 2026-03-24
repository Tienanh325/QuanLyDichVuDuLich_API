import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import axios from "axios";
import {
  Badge,
  Button,
  Card,
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
import { BedDouble, MapPinned, PencilLine, Plus, RefreshCw, Search, Trash2 } from "lucide-react";

const { Title, Text } = Typography;
const { TextArea } = Input;

type HotelStatus = "available" | "limited" | "full";

interface DichVuOption {
  maDichVu: number;
  ten: string;
}

interface HotelItem {
  maKhachSan: number;
  maDichVu: number;
  ten: string;
  viTri: string;
  danhGia: number;
  gia: number;
  phongTrong: number;
  moTa: string;
  LoaiPhong: string;
}

interface HotelFormValues {
  maDichVu: number;
  ten: string;
  viTri: string;
  danhGia: number;
  gia: number;
  phongTrong: number;
  moTa: string;
  LoaiPhong: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const HOTEL_API_PATH = import.meta.env.VITE_KHACH_SAN_API_PATH ?? "/api/khach-san";
const DICH_VU_API_PATH = import.meta.env.VITE_DICH_VU_API_PATH ?? "/api/dich-vu";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const mockDichVu: DichVuOption[] = [
  { maDichVu: 101, ten: "Lưu trú cao cấp" },
  { maDichVu: 102, ten: "Resort biển" },
  { maDichVu: 103, ten: "Khách sạn trung tâm" },
];

const mockHotels: HotelItem[] = [
  {
    maKhachSan: 1,
    maDichVu: 101,
    ten: "M Village Riverside",
    viTri: "Quận 1, TP.HCM",
    danhGia: 4.7,
    gia: 1890000,
    phongTrong: 12,
    moTa: "Khách sạn phong cách hiện đại, gần trung tâm, phù hợp khách công tác.",
    LoaiPhong: "Deluxe",
  },
  {
    maKhachSan: 2,
    maDichVu: 102,
    ten: "Ocean Pearl Resort",
    viTri: "Phú Quốc",
    danhGia: 4.9,
    gia: 3290000,
    phongTrong: 4,
    moTa: "Resort sát biển với hồ bơi riêng và buffet sáng.",
    LoaiPhong: "Villa",
  },
  {
    maKhachSan: 3,
    maDichVu: 103,
    ten: "Da Nang Harbor Hotel",
    viTri: "Đà Nẵng",
    danhGia: 4.3,
    gia: 1290000,
    phongTrong: 0,
    moTa: "Khách sạn 3 sao gần cầu Rồng, thích hợp nghỉ ngắn ngày.",
    LoaiPhong: "Standard",
  },
];

const currencyFormatter = new Intl.NumberFormat("vi-VN");

function formatCurrency(value: number): string {
  return `${currencyFormatter.format(value)} đ`;
}

function inferStatus(item: Pick<HotelItem, "phongTrong">): HotelStatus {
  if (item.phongTrong <= 0) {
    return "full";
  }
  if (item.phongTrong <= 5) {
    return "limited";
  }
  return "available";
}

function getStatusMeta(status: HotelStatus): { label: string; color: string } {
  switch (status) {
    case "available":
      return { label: "Còn phòng", color: "green" };
    case "limited":
      return { label: "Sắp hết phòng", color: "gold" };
    default:
      return { label: "Hết phòng", color: "red" };
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

function normalizeHotel(input: unknown, index: number): HotelItem {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    maKhachSan: Number(raw.maKhachSan ?? raw.id ?? index + 1),
    maDichVu: Number(raw.maDichVu ?? raw.serviceId ?? 0),
    ten: String(raw.ten ?? raw.name ?? `Khách sạn ${index + 1}`),
    viTri: String(raw.viTri ?? raw.location ?? ""),
    danhGia: Number(raw.danhGia ?? raw.rating ?? 0),
    gia: Number(raw.gia ?? raw.price ?? 0),
    phongTrong: Number(raw.phongTrong ?? raw.availableRooms ?? 0),
    moTa: String(raw.moTa ?? raw.description ?? ""),
    LoaiPhong: String(raw.LoaiPhong ?? raw.loaiPhong ?? raw.roomType ?? "Standard"),
  };
}

function normalizeDichVu(input: unknown, index: number): DichVuOption {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    maDichVu: Number(raw.maDichVu ?? raw.id ?? index + 1),
    ten: String(raw.ten ?? raw.name ?? `Dịch vụ ${index + 1}`),
  };
}

async function fetchHotels(): Promise<HotelItem[]> {
  const response = await apiClient.get(HOTEL_API_PATH);
  return extractArray(response.data).map(normalizeHotel);
}

async function fetchDichVuOptions(): Promise<DichVuOption[]> {
  const response = await apiClient.get(DICH_VU_API_PATH);
  return extractArray(response.data).map(normalizeDichVu);
}

async function createHotel(item: HotelItem): Promise<HotelItem> {
  const response = await apiClient.post(HOTEL_API_PATH, item);
  return normalizeHotel(response.data, 0);
}

async function updateHotel(item: HotelItem): Promise<HotelItem> {
  const response = await apiClient.put(`${HOTEL_API_PATH}/${item.maKhachSan}`, item);
  return normalizeHotel(response.data, 0);
}

async function deleteHotel(id: number): Promise<void> {
  await apiClient.delete(`${HOTEL_API_PATH}/${id}`);
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

export default function KhachSan() {
  const [form] = Form.useForm<HotelFormValues>();
  const [data, setData] = useState<HotelItem[]>([]);
  const [dichVuOptions, setDichVuOptions] = useState<DichVuOption[]>(mockDichVu);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HotelItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<HotelStatus | "all">("all");
  const [filterRoomType, setFilterRoomType] = useState<string>("all");
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const loadHotels = async () => {
    setLoading(true);

    try {
      const [hotels, services] = await Promise.all([
        fetchHotels(),
        fetchDichVuOptions().catch(() => mockDichVu),
      ]);
      setDichVuOptions(services.length > 0 ? services : mockDichVu);
      setData(hotels.length > 0 ? hotels : mockHotels);
      setIsUsingMockData(hotels.length === 0);

      if (hotels.length === 0) {
        message.info("API chưa trả dữ liệu khách sạn, đang hiển thị dữ liệu mẫu.");
      }
    } catch (error) {
      setDichVuOptions(mockDichVu);
      setData(mockHotels);
      setIsUsingMockData(true);

      if (axios.isAxiosError(error)) {
        message.warning(`Không kết nối được API ${API_BASE_URL}${HOTEL_API_PATH}. Đang dùng dữ liệu mẫu.`);
      } else {
        message.warning("Có lỗi khi tải dữ liệu khách sạn. Đang dùng dữ liệu mẫu.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHotels();
  }, []);

  const roomTypeOptions = useMemo(
    () => ["all", ...Array.from(new Set(data.map((item) => item.LoaiPhong)))],
    [data],
  );

  const dichVuMap = useMemo(
    () => new Map(dichVuOptions.map((item) => [item.maDichVu, item.ten])),
    [dichVuOptions],
  );

  const filteredData = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    return data.filter((item) => {
      const serviceName = dichVuMap.get(item.maDichVu)?.toLowerCase() ?? "";
      const matchesSearch =
        keyword.length === 0 ||
        String(item.maKhachSan).includes(keyword) ||
        item.ten.toLowerCase().includes(keyword) ||
        item.viTri.toLowerCase().includes(keyword) ||
        item.moTa.toLowerCase().includes(keyword) ||
        serviceName.includes(keyword);
      const matchesStatus = filterStatus === "all" || inferStatus(item) === filterStatus;
      const matchesRoomType = filterRoomType === "all" || item.LoaiPhong === filterRoomType;
      return matchesSearch && matchesStatus && matchesRoomType;
    });
  }, [data, dichVuMap, filterRoomType, filterStatus, searchText]);

  const stats = useMemo(() => {
    const available = data.filter((item) => inferStatus(item) === "available").length;
    const limited = data.filter((item) => inferStatus(item) === "limited").length;
    const full = data.filter((item) => inferStatus(item) === "full").length;
    return {
      total: data.length,
      available,
      limited,
      full,
    };
  }, [data]);

  const resetForm = () => {
    form.resetFields();
    setEditingItem(null);
  };

  const openCreateModal = () => {
    resetForm();
    form.setFieldsValue({
      maDichVu: dichVuOptions[0]?.maDichVu,
      danhGia: 4.5,
      gia: 1500000,
      phongTrong: 10,
      LoaiPhong: "Deluxe",
    });
    setModalOpen(true);
  };

  const openEditModal = (item: HotelItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      maDichVu: item.maDichVu,
      ten: item.ten,
      viTri: item.viTri,
      danhGia: item.danhGia,
      gia: item.gia,
      phongTrong: item.phongTrong,
      moTa: item.moTa,
      LoaiPhong: item.LoaiPhong,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item: HotelItem) => {
    const previous = data;
    setData((current) => current.filter((entry) => entry.maKhachSan !== item.maKhachSan));

    if (isUsingMockData) {
      message.success(`Đã xoá khách sạn ${item.ten} trên dữ liệu mẫu.`);
      return;
    }

    try {
      await deleteHotel(item.maKhachSan);
      message.success(`Đã xoá khách sạn ${item.ten}.`);
    } catch {
      setData(previous);
      message.error("Xoá không thành công, dữ liệu đã được hoàn lại.");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const payload: HotelItem = {
        maKhachSan: editingItem?.maKhachSan ?? Date.now(),
        maDichVu: values.maDichVu,
        ten: values.ten.trim(),
        viTri: values.viTri.trim(),
        danhGia: values.danhGia,
        gia: values.gia,
        phongTrong: values.phongTrong,
        moTa: values.moTa.trim(),
        LoaiPhong: values.LoaiPhong,
      };

      if (isUsingMockData) {
        setData((current) =>
          editingItem
            ? current.map((item) => (item.maKhachSan === editingItem.maKhachSan ? payload : item))
            : [payload, ...current],
        );
        message.success(editingItem ? "Đã cập nhật khách sạn trên dữ liệu mẫu." : "Đã thêm khách sạn trên dữ liệu mẫu.");
        setModalOpen(false);
        resetForm();
        return;
      }

      if (editingItem) {
        const updated = await updateHotel(payload);
        setData((current) =>
          current.map((item) => (item.maKhachSan === editingItem.maKhachSan ? updated : item)),
        );
        message.success("Cập nhật khách sạn thành công.");
      } else {
        const created = await createHotel(payload);
        setData((current) => [created, ...current]);
        message.success("Thêm khách sạn thành công.");
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

  const columns: TableProps<HotelItem>["columns"] = [
    {
      title: "Khách sạn",
      key: "hotel",
      render: (_value, record) => (
        <div>
          <div style={{ fontWeight: 700, color: "#1f2a44" }}>{record.ten}</div>
          <Text style={{ color: "#7d869c", fontSize: 13 }}>Mã KS: {record.maKhachSan}</Text>
        </div>
      ),
    },
    {
      title: "Vị trí",
      key: "location",
      render: (_value, record) => (
        <Space size={6}>
          <MapPinned size={15} color="#2563eb" />
          <Text>{record.viTri}</Text>
        </Space>
      ),
    },
    {
      title: "Loại phòng",
      dataIndex: "LoaiPhong",
      key: "LoaiPhong",
      render: (value: string) => (
        <Space size={6}>
          <BedDouble size={15} color="#7c3aed" />
          <Text>{value}</Text>
        </Space>
      ),
    },
    {
      title: "Giá",
      dataIndex: "gia",
      key: "gia",
      render: (value: number) => <Text strong>{formatCurrency(value)}</Text>,
    },
    {
      title: "Phòng trống",
      dataIndex: "phongTrong",
      key: "phongTrong",
      render: (value: number) => <Tag color={value > 0 ? "cyan" : "red"}>{value}</Tag>,
    },
    {
      title: "Dịch vụ",
      dataIndex: "maDichVu",
      key: "maDichVu",
      render: (value: number) => dichVuMap.get(value) ?? `Dịch vụ #${value}`,
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
          <Popconfirm title="Xoá khách sạn?" description={`Bạn có chắc muốn xoá ${record.ten}?`} okText="Xoá" cancelText="Huỷ" onConfirm={() => void handleDelete(record)}>
            <Button type="text" danger icon={<Trash2 size={16} color="#ef4444" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={pageContainerStyle}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <Title level={3} style={{ margin: 0, color: "#182338" }}>Quản lý khách sạn</Title>
            <Text style={{ color: "#7d869c" }}>
              Quản lý khách sạn, giá phòng, loại phòng, số lượng phòng trống và đánh giá.
            </Text>
          </div>

          <Space wrap>
            <Tag color={isUsingMockData ? "gold" : "green"} style={{ padding: "6px 10px" }}>
              {isUsingMockData ? "Đang hiển thị dữ liệu mẫu" : `API: ${API_BASE_URL}${HOTEL_API_PATH}`}
            </Tag>
            <Button icon={<RefreshCw size={16} />} onClick={() => void loadHotels()}>Tải lại</Button>
          </Space>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <Card style={statCardStyle}><Space align="start"><Badge color="#7c3aed" /><div><Text style={{ color: "#7d869c" }}>Tổng khách sạn</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.total}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#16a34a" /><div><Text style={{ color: "#7d869c" }}>Còn phòng</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.available}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#eab308" /><div><Text style={{ color: "#7d869c" }}>Sắp hết phòng</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.limited}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#ef4444" /><div><Text style={{ color: "#7d869c" }}>Hết phòng</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.full}</Title></div></Space></Card>
        </div>

        <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <Title level={4} style={{ margin: 0, color: "#1f2a44" }}>Danh sách khách sạn</Title>
                <Text style={{ color: "#7d869c" }}>Có {filteredData.length} khách sạn đang hiển thị trong bảng.</Text>
              </div>

              <Space wrap>
                <Input
                  allowClear
                  prefix={<Search size={16} color="#94a3b8" />}
                  placeholder="Tìm tên, vị trí, mô tả..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  style={{ width: 260 }}
                />
                <Select
                  value={filterRoomType}
                  style={{ width: 170 }}
                  onChange={(value) => setFilterRoomType(value)}
                  options={roomTypeOptions.map((item) => ({
                    label: item === "all" ? "Tất cả loại phòng" : item,
                    value: item,
                  }))}
                />
                <Select
                  value={filterStatus}
                  style={{ width: 170 }}
                  onChange={(value) => setFilterStatus(value)}
                  options={[
                    { label: "Tất cả trạng thái", value: "all" },
                    { label: "Còn phòng", value: "available" },
                    { label: "Sắp hết phòng", value: "limited" },
                    { label: "Hết phòng", value: "full" },
                  ]}
                />
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)", borderColor: "#7c3aed" }}
                  onClick={openCreateModal}
                >
                  Thêm mới
                </Button>
              </Space>
            </div>

            <Table<HotelItem>
              rowKey="maKhachSan"
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              pagination={{
                pageSize: 6,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} khách sạn`,
              }}
              scroll={{ x: 1280 }}
            />
          </Space>
        </Card>
      </Space>

      <Modal
        title={editingItem ? "Cập nhật khách sạn" : "Thêm khách sạn"}
        open={modalOpen}
        onOk={() => void handleSubmit()}
        onCancel={() => {
          setModalOpen(false);
          resetForm();
        }}
        okText={editingItem ? "Lưu thay đổi" : "Tạo mới"}
        cancelText="Huỷ"
        confirmLoading={submitting}
      >
        <Form<HotelFormValues> form={form} layout="vertical">
          <Form.Item label="Dịch vụ" name="maDichVu" rules={[{ required: true, message: "Chọn dịch vụ." }]}>
            <Select options={dichVuOptions.map((item) => ({ label: `${item.ten} (#${item.maDichVu})`, value: item.maDichVu }))} />
          </Form.Item>
          <Form.Item label="Tên khách sạn" name="ten" rules={[{ required: true, message: "Nhập tên khách sạn." }]}><Input /></Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <Form.Item label="Vị trí" name="viTri" rules={[{ required: true, message: "Nhập vị trí." }]}><Input /></Form.Item>
            <Form.Item label="Loại phòng" name="LoaiPhong" rules={[{ required: true, message: "Chọn loại phòng." }]}>
              <Select options={[{ label: "Standard", value: "Standard" }, { label: "Superior", value: "Superior" }, { label: "Deluxe", value: "Deluxe" }, { label: "Suite", value: "Suite" }, { label: "Villa", value: "Villa" }]} />
            </Form.Item>
            <Form.Item label="Giá" name="gia" rules={[{ required: true, message: "Nhập giá." }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
            <Form.Item label="Phòng trống" name="phongTrong" rules={[{ required: true, message: "Nhập số phòng trống." }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
            <Form.Item label="Đánh giá" name="danhGia" rules={[{ required: true, message: "Nhập đánh giá." }]}><InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} /></Form.Item>
          </div>
          <Form.Item label="Mô tả" name="moTa" rules={[{ required: true, message: "Nhập mô tả." }]}><TextArea rows={4} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
