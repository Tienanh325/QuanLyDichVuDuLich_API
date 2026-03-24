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
import { MapPinned, PencilLine, Plus, RefreshCw, Search, Trash2 } from "lucide-react";

const { Title, Text } = Typography;
const { TextArea } = Input;

type TourStatus = "active" | "upcoming" | "soldout";

interface DichVuOption {
  maDichVu: number;
  ten: string;
}

interface TourItem {
  maTour: number;
  maDichVu: number;
  ten: string;
  viTri: string;
  thoiGian: string;
  gia: number;
  ngayBatDau: string;
  soLuong: number;
  moTa: string;
  danhGia: number;
}

interface TourFormValues {
  maDichVu: number;
  ten: string;
  viTri: string;
  thoiGian: string;
  gia: number;
  ngayBatDau: Dayjs;
  soLuong: number;
  moTa: string;
  danhGia: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const TOUR_API_PATH = import.meta.env.VITE_TOUR_API_PATH ?? "/api/tour";
const DICH_VU_API_PATH = import.meta.env.VITE_DICH_VU_API_PATH ?? "/api/dich-vu";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const mockDichVu: DichVuOption[] = [
  { maDichVu: 101, ten: "Tour Đà Lạt 3N2Đ" },
  { maDichVu: 102, ten: "Tour Phú Quốc 4N3Đ" },
  { maDichVu: 103, ten: "Tour Sa Pa săn mây" },
];

const mockTours: TourItem[] = [
  {
    maTour: 1,
    maDichVu: 101,
    ten: "Đà Lạt Nghỉ Dưỡng",
    viTri: "Đà Lạt",
    thoiGian: "3 ngày 2 đêm",
    gia: 2890000,
    ngayBatDau: "2026-04-05",
    soLuong: 24,
    moTa: "Tour tham quan thành phố hoa, lịch trình nhẹ nhàng cho gia đình.",
    danhGia: 4.7,
  },
  {
    maTour: 2,
    maDichVu: 102,
    ten: "Phú Quốc Cao Cấp",
    viTri: "Phú Quốc",
    thoiGian: "4 ngày 3 đêm",
    gia: 4590000,
    ngayBatDau: "2026-04-20",
    soLuong: 12,
    moTa: "Nghỉ dưỡng biển, cano đảo, khách sạn 4 sao.",
    danhGia: 4.9,
  },
  {
    maTour: 3,
    maDichVu: 103,
    ten: "Sa Pa Săn Mây",
    viTri: "Lào Cai",
    thoiGian: "2 ngày 2 đêm",
    gia: 1990000,
    ngayBatDau: "2026-03-28",
    soLuong: 0,
    moTa: "Trải nghiệm núi rừng, bản làng và cáp treo Fansipan.",
    danhGia: 4.5,
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

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (typeof payload === "object" && payload !== null) {
    const record = payload as { data?: unknown; items?: unknown };
    if (Array.isArray(record.data)) {
      return record.data;
    }
    if (Array.isArray(record.items)) {
      return record.items;
    }
  }

  return [];
}

function normalizeTour(input: unknown, index: number): TourItem {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;

  return {
    maTour: Number(raw.maTour ?? raw.id ?? index + 1),
    maDichVu: Number(raw.maDichVu ?? raw.serviceId ?? 0),
    ten: String(raw.ten ?? raw.name ?? `Tour ${index + 1}`),
    viTri: String(raw.viTri ?? raw.location ?? ""),
    thoiGian: String(raw.thoiGian ?? raw.duration ?? ""),
    gia: Number(raw.gia ?? raw.price ?? 0),
    ngayBatDau: String(raw.ngayBatDau ?? raw.startDate ?? dayjs().format("YYYY-MM-DD")),
    soLuong: Number(raw.soLuong ?? raw.quantity ?? 0),
    moTa: String(raw.moTa ?? raw.description ?? ""),
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

async function fetchTours(): Promise<TourItem[]> {
  const response = await apiClient.get(TOUR_API_PATH);
  return extractArray(response.data).map(normalizeTour);
}

async function fetchDichVuOptions(): Promise<DichVuOption[]> {
  const response = await apiClient.get(DICH_VU_API_PATH);
  return extractArray(response.data).map(normalizeDichVu);
}

async function createTour(item: TourItem): Promise<TourItem> {
  const response = await apiClient.post(TOUR_API_PATH, item);
  return normalizeTour(response.data, 0);
}

async function updateTour(item: TourItem): Promise<TourItem> {
  const response = await apiClient.put(`${TOUR_API_PATH}/${item.maTour}`, item);
  return normalizeTour(response.data, 0);
}

async function deleteTour(id: number): Promise<void> {
  await apiClient.delete(`${TOUR_API_PATH}/${id}`);
}

function inferTourStatus(item: TourItem): TourStatus {
  if (item.soLuong <= 0) {
    return "soldout";
  }
  if (dayjs(item.ngayBatDau).isAfter(dayjs(), "day")) {
    return "upcoming";
  }
  return "active";
}

function getStatusMeta(status: TourStatus): { label: string; color: string } {
  switch (status) {
    case "active":
      return { label: "Đang mở bán", color: "green" };
    case "upcoming":
      return { label: "Sắp khởi hành", color: "blue" };
    default:
      return { label: "Hết chỗ", color: "red" };
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

export default function Tour() {
  const [form] = Form.useForm<TourFormValues>();
  const [data, setData] = useState<TourItem[]>([]);
  const [dichVuOptions, setDichVuOptions] = useState<DichVuOption[]>(mockDichVu);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TourItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<TourStatus | "all">("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const loadTours = async () => {
    setLoading(true);

    try {
      const [tours, services] = await Promise.all([
        fetchTours(),
        fetchDichVuOptions().catch(() => mockDichVu),
      ]);

      setDichVuOptions(services.length > 0 ? services : mockDichVu);
      setData(tours.length > 0 ? tours : mockTours);
      setIsUsingMockData(tours.length === 0);

      if (tours.length === 0) {
        message.info("API chưa trả dữ liệu tour, đang hiển thị dữ liệu mẫu.");
      }
    } catch (error) {
      setDichVuOptions(mockDichVu);
      setData(mockTours);
      setIsUsingMockData(true);

      if (axios.isAxiosError(error)) {
        message.warning(`Không kết nối được API ${API_BASE_URL}${TOUR_API_PATH}. Đang dùng dữ liệu mẫu.`);
      } else {
        message.warning("Có lỗi khi tải dữ liệu tour. Đang dùng dữ liệu mẫu.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTours();
  }, []);

  const locationOptions = useMemo(
    () => ["all", ...Array.from(new Set(data.map((item) => item.viTri)))],
    [data],
  );

  const dichVuMap = useMemo(
    () => new Map(dichVuOptions.map((item) => [item.maDichVu, item.ten])),
    [dichVuOptions],
  );

  const filteredData = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return data.filter((item) => {
      const status = inferTourStatus(item);
      const serviceName = dichVuMap.get(item.maDichVu)?.toLowerCase() ?? "";
      const matchesSearch =
        keyword.length === 0 ||
        String(item.maTour).includes(keyword) ||
        item.ten.toLowerCase().includes(keyword) ||
        item.viTri.toLowerCase().includes(keyword) ||
        item.moTa.toLowerCase().includes(keyword) ||
        serviceName.includes(keyword);
      const matchesStatus = filterStatus === "all" || status === filterStatus;
      const matchesLocation = filterLocation === "all" || item.viTri === filterLocation;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [data, dichVuMap, filterLocation, filterStatus, searchText]);

  const stats = useMemo(() => {
    const active = data.filter((item) => inferTourStatus(item) === "active").length;
    const upcoming = data.filter((item) => inferTourStatus(item) === "upcoming").length;
    const soldout = data.filter((item) => inferTourStatus(item) === "soldout").length;

    return {
      total: data.length,
      active,
      upcoming,
      soldout,
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
      gia: 1000000,
      soLuong: 20,
      danhGia: 4.5,
      ngayBatDau: dayjs().add(7, "day"),
    });
    setModalOpen(true);
  };

  const openEditModal = (item: TourItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      maDichVu: item.maDichVu,
      ten: item.ten,
      viTri: item.viTri,
      thoiGian: item.thoiGian,
      gia: item.gia,
      ngayBatDau: dayjs(item.ngayBatDau),
      soLuong: item.soLuong,
      moTa: item.moTa,
      danhGia: item.danhGia,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item: TourItem) => {
    const previous = data;
    setData((current) => current.filter((entry) => entry.maTour !== item.maTour));

    if (isUsingMockData) {
      message.success(`Đã xoá tour ${item.ten} trên dữ liệu mẫu.`);
      return;
    }

    try {
      await deleteTour(item.maTour);
      message.success(`Đã xoá tour ${item.ten}.`);
    } catch {
      setData(previous);
      message.error("Xoá không thành công, dữ liệu đã được hoàn lại.");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const payload: TourItem = {
        maTour: editingItem?.maTour ?? Date.now(),
        maDichVu: values.maDichVu,
        ten: values.ten.trim(),
        viTri: values.viTri.trim(),
        thoiGian: values.thoiGian.trim(),
        gia: values.gia,
        ngayBatDau: values.ngayBatDau.format("YYYY-MM-DD"),
        soLuong: values.soLuong,
        moTa: values.moTa.trim(),
        danhGia: values.danhGia,
      };

      if (isUsingMockData) {
        setData((current) =>
          editingItem
            ? current.map((item) => (item.maTour === editingItem.maTour ? payload : item))
            : [payload, ...current],
        );
        message.success(editingItem ? "Đã cập nhật tour trên dữ liệu mẫu." : "Đã thêm tour trên dữ liệu mẫu.");
        setModalOpen(false);
        resetForm();
        return;
      }

      if (editingItem) {
        const updated = await updateTour(payload);
        setData((current) =>
          current.map((item) => (item.maTour === editingItem.maTour ? updated : item)),
        );
        message.success("Cập nhật tour thành công.");
      } else {
        const created = await createTour(payload);
        setData((current) => [created, ...current]);
        message.success("Thêm tour thành công.");
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

  const columns: TableProps<TourItem>["columns"] = [
    {
      title: "Tour",
      key: "tour",
      render: (_value, record) => (
        <div>
          <div style={{ fontWeight: 700, color: "#1f2a44" }}>{record.ten}</div>
          <Text style={{ color: "#7d869c", fontSize: 13 }}>Mã tour: {record.maTour}</Text>
        </div>
      ),
    },
    {
      title: "Điểm đến",
      key: "destination",
      render: (_value, record) => (
        <Space size={6}>
          <MapPinned size={15} color="#2563eb" />
          <Text>{record.viTri}</Text>
        </Space>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_value, record) => (
        <div>
          <div style={{ color: "#55607a", fontSize: 13 }}>{record.thoiGian}</div>
          <div style={{ color: "#7d869c", fontSize: 12 }}>Khởi hành: {formatDate(record.ngayBatDau)}</div>
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
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
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
        const meta = getStatusMeta(inferTourStatus(record));
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_value, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<PencilLine size={16} color="#7c3aed" />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Xoá tour?"
            description={`Bạn có chắc muốn xoá ${record.ten}?`}
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => void handleDelete(record)}
          >
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
            <Title level={3} style={{ margin: 0, color: "#182338" }}>
              Quản lý tour
            </Title>
            <Text style={{ color: "#7d869c" }}>
              Quản lý lịch khởi hành, giá bán, số lượng chỗ và đánh giá tour cho trang admin.
            </Text>
          </div>

          <Space wrap>
            <Tag color={isUsingMockData ? "gold" : "green"} style={{ padding: "6px 10px" }}>
              {isUsingMockData ? "Đang hiển thị dữ liệu mẫu" : `API: ${API_BASE_URL}${TOUR_API_PATH}`}
            </Tag>
            <Button icon={<RefreshCw size={16} />} onClick={() => void loadTours()}>
              Tải lại
            </Button>
          </Space>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#7c3aed" />
              <div>
                <Text style={{ color: "#7d869c" }}>Tổng tour</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.total}</Title>
              </div>
            </Space>
          </Card>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#16a34a" />
              <div>
                <Text style={{ color: "#7d869c" }}>Đang mở bán</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.active}</Title>
              </div>
            </Space>
          </Card>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#2563eb" />
              <div>
                <Text style={{ color: "#7d869c" }}>Sắp khởi hành</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.upcoming}</Title>
              </div>
            </Space>
          </Card>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#ef4444" />
              <div>
                <Text style={{ color: "#7d869c" }}>Hết chỗ</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.soldout}</Title>
              </div>
            </Space>
          </Card>
        </div>

        <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <Title level={4} style={{ margin: 0, color: "#1f2a44" }}>Danh sách tour</Title>
                <Text style={{ color: "#7d869c" }}>Có {filteredData.length} tour đang hiển thị trong bảng.</Text>
              </div>

              <Space wrap>
                <Input
                  allowClear
                  prefix={<Search size={16} color="#94a3b8" />}
                  placeholder="Tìm tên tour, vị trí, dịch vụ..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  style={{ width: 260 }}
                />
                <Select
                  value={filterLocation}
                  style={{ width: 160 }}
                  onChange={(value) => setFilterLocation(value)}
                  options={locationOptions.map((item) => ({
                    label: item === "all" ? "Tất cả vị trí" : item,
                    value: item,
                  }))}
                />
                <Select
                  value={filterStatus}
                  style={{ width: 160 }}
                  onChange={(value) => setFilterStatus(value)}
                  options={[
                    { label: "Tất cả trạng thái", value: "all" },
                    { label: "Đang mở bán", value: "active" },
                    { label: "Sắp khởi hành", value: "upcoming" },
                    { label: "Hết chỗ", value: "soldout" },
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

            <Table<TourItem>
              rowKey="maTour"
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              pagination={{
                pageSize: 6,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} tour`,
              }}
              scroll={{ x: 1280 }}
            />
          </Space>
        </Card>
      </Space>

      <Modal
        title={editingItem ? "Cập nhật tour" : "Thêm tour"}
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
        <Form<TourFormValues> form={form} layout="vertical">
          <Form.Item label="Dịch vụ" name="maDichVu" rules={[{ required: true, message: "Chọn dịch vụ." }]}>
            <Select
              options={dichVuOptions.map((item) => ({
                label: `${item.ten} (#${item.maDichVu})`,
                value: item.maDichVu,
              }))}
            />
          </Form.Item>
          <Form.Item label="Tên tour" name="ten" rules={[{ required: true, message: "Nhập tên tour." }]}>
            <Input />
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <Form.Item label="Vị trí" name="viTri" rules={[{ required: true, message: "Nhập vị trí." }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Thời gian" name="thoiGian" rules={[{ required: true, message: "Nhập thời gian." }]}>
              <Input placeholder="Ví dụ: 3 ngày 2 đêm" />
            </Form.Item>
            <Form.Item label="Giá" name="gia" rules={[{ required: true, message: "Nhập giá." }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Ngày bắt đầu" name="ngayBatDau" rules={[{ required: true, message: "Chọn ngày bắt đầu." }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item label="Số lượng" name="soLuong" rules={[{ required: true, message: "Nhập số lượng." }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Đánh giá" name="danhGia" rules={[{ required: true, message: "Nhập đánh giá." }]}>
              <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <Form.Item label="Mô tả" name="moTa" rules={[{ required: true, message: "Nhập mô tả." }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
