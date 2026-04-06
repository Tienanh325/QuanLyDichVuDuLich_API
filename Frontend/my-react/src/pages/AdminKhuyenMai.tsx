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
import {
  PencilLine,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type DiscountKind = "fixed" | "percent";
type VoucherStatus = "active" | "scheduled" | "expired";

interface VoucherItem {
  id: string;
  code: string;
  description: string;
  discountType: DiscountKind;
  discountValue: number;
  minimumOrder: number;
  maximumDiscount?: number | null;
  usedCount: number;
  startDate: string;
  endDate?: string | null;
  status: VoucherStatus;
}

interface VoucherFormValues {
  code: string;
  description: string;
  discountType: DiscountKind;
  discountValue: number;
  minimumOrder: number;
  maximumDiscount?: number | null;
  dateRange: [Dayjs, Dayjs];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const VOUCHER_API_PATH = import.meta.env.VITE_KHUYEN_MAI_API_PATH ?? "/api/khuyen-mai";
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const mockVouchers: VoucherItem[] = [
  {
    id: "1",
    code: "SAYHIBANMOI",
    description: "Giảm 30K đơn hàng online đầu tiên",
    discountType: "fixed",
    discountValue: 30000,
    minimumOrder: 100000,
    maximumDiscount: null,
    usedCount: 0,
    startDate: "2025-05-21",
    endDate: null,
    status: "active",
  },
  {
    id: "2",
    code: "MEYEU",
    description: "Giảm 10% tối đa 50K đơn Online 399K",
    discountType: "percent",
    discountValue: 10,
    minimumOrder: 399000,
    maximumDiscount: 50000,
    usedCount: 0,
    startDate: "2025-05-21",
    endDate: null,
    status: "active",
  },
  {
    id: "3",
    code: "AHAHA",
    description: "Giảm giá ahaha",
    discountType: "percent",
    discountValue: 10,
    minimumOrder: 100000,
    maximumDiscount: 20000,
    usedCount: 0,
    startDate: "2025-05-21",
    endDate: null,
    status: "active",
  },
  {
    id: "4",
    code: "AIHII",
    description: "string",
    discountType: "percent",
    discountValue: 20,
    minimumOrder: 100000,
    maximumDiscount: 50000,
    usedCount: 10,
    startDate: "2025-04-14",
    endDate: "2025-04-20",
    status: "expired",
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

function inferStatus(startDate: string, endDate?: string | null): VoucherStatus {
  const today = dayjs().startOf("day");
  const start = dayjs(startDate).startOf("day");
  const end = endDate ? dayjs(endDate).startOf("day") : null;

  if (start.isAfter(today)) {
    return "scheduled";
  }

  if (end && end.isBefore(today)) {
    return "expired";
  }

  return "active";
}

function normalizeVoucher(input: unknown, index: number): VoucherItem {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;

  const startDate = String(
    raw.startDate ?? raw.ngayBatDau ?? raw.validFrom ?? dayjs().format("YYYY-MM-DD"),
  );
  const endDateValue = raw.endDate ?? raw.ngayKetThuc ?? raw.validTo;
  const endDate = endDateValue ? String(endDateValue) : null;

  const discountTypeValue = String(
    raw.discountType ?? raw.loaiGiaTri ?? raw.type ?? "fixed",
  ).toLowerCase();
  const discountType: DiscountKind =
    discountTypeValue === "percent" || discountTypeValue === "phan_tram" || discountTypeValue === "percentage"
      ? "percent"
      : "fixed";

  const explicitStatus = String(raw.status ?? raw.trangThai ?? "").toLowerCase();
  let status: VoucherStatus | null = null;

  if (explicitStatus.includes("active") || explicitStatus.includes("hoat")) {
    status = "active";
  } else if (explicitStatus.includes("schedule") || explicitStatus.includes("sap")) {
    status = "scheduled";
  } else if (explicitStatus.includes("expire") || explicitStatus.includes("het")) {
    status = "expired";
  }

  return {
    id: String(raw.id ?? raw.maKhuyenMai ?? raw.code ?? index + 1),
    code: String(raw.code ?? raw.maKhuyenMai ?? `KM${index + 1}`),
    description: String(raw.description ?? raw.moTa ?? raw.ten ?? "Chưa có mô tả"),
    discountType,
    discountValue: Number(raw.discountValue ?? raw.giamGia ?? raw.giaTri ?? 0),
    minimumOrder: Number(raw.minimumOrder ?? raw.dieuKienToiThieu ?? raw.minOrder ?? 0),
    maximumDiscount:
      raw.maximumDiscount === null || raw.maximumDiscount === undefined || raw.maximumDiscount === ""
        ? null
        : Number(raw.maximumDiscount ?? raw.giamToiDa ?? raw.maxDiscount ?? 0),
    usedCount: Number(raw.usedCount ?? raw.soLanDaDung ?? raw.used ?? 0),
    startDate,
    endDate,
    status: status ?? inferStatus(startDate, endDate),
  };
}

async function fetchVouchers(): Promise<VoucherItem[]> {
  const response = await apiClient.get(VOUCHER_API_PATH);
  const payload = response.data as unknown;

  if (Array.isArray(payload)) {
    return payload.map(normalizeVoucher);
  }

  if (typeof payload === "object" && payload !== null) {
    const nestedData = (payload as { data?: unknown }).data;
    const nestedItems = (payload as { items?: unknown }).items;

    if (Array.isArray(nestedData)) {
      return nestedData.map(normalizeVoucher);
    }

    if (Array.isArray(nestedItems)) {
      return nestedItems.map(normalizeVoucher);
    }
  }

  return [];
}

async function createVoucher(voucher: VoucherItem): Promise<VoucherItem> {
  const response = await apiClient.post(VOUCHER_API_PATH, voucher);
  return normalizeVoucher(response.data, 0);
}

async function updateVoucher(voucher: VoucherItem): Promise<VoucherItem> {
  const response = await apiClient.put(`${VOUCHER_API_PATH}/${voucher.id}`, voucher);
  return normalizeVoucher(response.data, 0);
}

async function deleteVoucher(id: string): Promise<void> {
  await apiClient.delete(`${VOUCHER_API_PATH}/${id}`);
}

function getStatusMeta(status: VoucherStatus): { label: string; color: string } {
  switch (status) {
    case "active":
      return { label: "Đang hoạt động", color: "green" };
    case "scheduled":
      return { label: "Sắp diễn ra", color: "blue" };
    case "expired":
      return { label: "Chưa hoạt động/Hết hạn", color: "gold" };
    default:
      return { label: "Không xác định", color: "default" };
  }
}

function getDiscountLabel(item: VoucherItem): string {
  if (item.discountType === "percent") {
    return `${item.discountValue}%`;
  }

  return formatCurrency(item.discountValue);
}

function getConditionLines(item: VoucherItem): string[] {
  const maxDiscountText =
    item.discountType === "percent" && item.maximumDiscount
      ? `Giảm tối đa: ${formatCurrency(item.maximumDiscount)}`
      : "Không giới hạn giảm tối đa";

  return [
    `Đơn tối thiểu: ${formatCurrency(item.minimumOrder)}`,
    maxDiscountText,
    `Đã dùng: ${item.usedCount} lần`,
  ];
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

export default function AdminKhuyenMai() {
  const [form] = Form.useForm<VoucherFormValues>();
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<VoucherItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<DiscountKind | "all">("all");
  const [filterStatus, setFilterStatus] = useState<VoucherStatus | "all">("all");
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const loadVouchers = async () => {
    setLoading(true);

    try {
      const data = await fetchVouchers();
      setVouchers(data.length > 0 ? data : mockVouchers);
      setIsUsingMockData(data.length === 0);

      if (data.length === 0) {
        message.info("API chưa trả dữ liệu, đang hiển thị dữ liệu mẫu để bạn kiểm tra giao diện.");
      }
    } catch (error) {
      setVouchers(mockVouchers);
      setIsUsingMockData(true);

      if (axios.isAxiosError(error)) {
        message.warning(
          `Không kết nối được API ${API_BASE_URL}${VOUCHER_API_PATH}. Đang dùng dữ liệu mẫu.`,
        );
      } else {
        message.warning("Có lỗi khi tải dữ liệu khuyến mãi. Đang dùng dữ liệu mẫu.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadVouchers();
  }, []);

  const filteredVouchers = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return vouchers.filter((item) => {
      const matchesSearch =
        keyword.length === 0 ||
        item.code.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);
      const matchesType = filterType === "all" || item.discountType === filterType;
      const matchesStatus = filterStatus === "all" || item.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [filterStatus, filterType, searchText, vouchers]);

  const stats = useMemo(() => {
    const activeCount = vouchers.filter((item) => item.status === "active").length;
    const scheduledCount = vouchers.filter((item) => item.status === "scheduled").length;
    const expiredCount = vouchers.filter((item) => item.status === "expired").length;

    return {
      total: vouchers.length,
      active: activeCount,
      scheduled: scheduledCount,
      expired: expiredCount,
    };
  }, [vouchers]);

  const resetForm = () => {
    form.resetFields();
    setEditingVoucher(null);
  };

  const openCreateModal = () => {
    resetForm();
    form.setFieldsValue({
      discountType: "fixed",
      discountValue: 30000,
      minimumOrder: 100000,
      maximumDiscount: null,
      dateRange: [dayjs(), dayjs().add(7, "day")],
    });
    setModalOpen(true);
  };

  const openEditModal = (voucher: VoucherItem) => {
    setEditingVoucher(voucher);
    form.setFieldsValue({
      code: voucher.code,
      description: voucher.description,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      minimumOrder: voucher.minimumOrder,
      maximumDiscount: voucher.maximumDiscount ?? null,
      dateRange: [
        dayjs(voucher.startDate),
        dayjs(voucher.endDate ?? voucher.startDate),
      ],
    });
    setModalOpen(true);
  };

  const handleDelete = async (voucher: VoucherItem) => {
    const previous = vouchers;

    setVouchers((current) => current.filter((item) => item.id !== voucher.id));

    if (isUsingMockData) {
      message.success(`Đã xoá mã ${voucher.code} trên dữ liệu mẫu.`);
      return;
    }

    try {
      await deleteVoucher(voucher.id);
      message.success(`Đã xoá mã ${voucher.code}.`);
    } catch {
      setVouchers(previous);
      message.error("Xoá không thành công, dữ liệu đã được hoàn lại.");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const voucher: VoucherItem = {
        id: editingVoucher?.id ?? `${Date.now()}`,
        code: values.code.trim().toUpperCase(),
        description: values.description.trim(),
        discountType: values.discountType,
        discountValue: values.discountValue,
        minimumOrder: values.minimumOrder,
        maximumDiscount:
          values.discountType === "percent" ? (values.maximumDiscount ?? null) : null,
        usedCount: editingVoucher?.usedCount ?? 0,
        startDate: values.dateRange[0].format("YYYY-MM-DD"),
        endDate: values.dateRange[1].format("YYYY-MM-DD"),
        status: inferStatus(
          values.dateRange[0].format("YYYY-MM-DD"),
          values.dateRange[1].format("YYYY-MM-DD"),
        ),
      };

      if (isUsingMockData) {
        setVouchers((current) =>
          editingVoucher
            ? current.map((item) => (item.id === editingVoucher.id ? voucher : item))
            : [voucher, ...current],
        );
        message.success(
          editingVoucher
            ? "Đã cập nhật mã khuyến mãi trên dữ liệu mẫu."
            : "Đã thêm mã khuyến mãi trên dữ liệu mẫu.",
        );
        setModalOpen(false);
        resetForm();
        return;
      }

      if (editingVoucher) {
        const updated = await updateVoucher(voucher);
        setVouchers((current) =>
          current.map((item) => (item.id === editingVoucher.id ? updated : item)),
        );
        message.success("Cập nhật khuyến mãi thành công.");
      } else {
        const created = await createVoucher(voucher);
        setVouchers((current) => [created, ...current]);
        message.success("Thêm khuyến mãi thành công.");
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

  const columns: TableProps<VoucherItem>["columns"] = [
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
      render: (_value, record) => (
        <div>
          <div style={{ fontWeight: 700, color: "#1f2a44" }}>{record.code}</div>
          <Text style={{ color: "#7d869c", fontSize: 13 }}>{record.description}</Text>
        </div>
      ),
    },
    {
      title: "Loại & giá trị",
      key: "discount",
      render: (_value, record) => (
        <div>
          <div style={{ color: "#7d869c", fontSize: 13 }}>
            {record.discountType === "fixed" ? "Cố định (VND)" : "Phần trăm (%)"}
          </div>
          <div style={{ fontWeight: 700, color: "#1f2a44" }}>{getDiscountLabel(record)}</div>
        </div>
      ),
    },
    {
      title: "Điều kiện",
      key: "conditions",
      render: (_value, record) => (
        <div>
          {getConditionLines(record).map((line) => (
            <div key={line} style={{ color: "#55607a", fontSize: 13, lineHeight: 1.6 }}>
              {line}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_value, record) => (
        <div>
          <div style={{ color: "#55607a", fontSize: 13 }}>Từ: {formatDate(record.startDate)}</div>
          <div style={{ color: "#55607a", fontSize: 13 }}>
            Đến: {record.endDate ? formatDate(record.endDate) : "--"}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: VoucherStatus) => {
        const meta = getStatusMeta(status);
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
            aria-label={`Sửa ${record.code}`}
            icon={<PencilLine size={16} color="#7c3aed" />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Xoá mã giảm giá?"
            description={`Bạn có chắc muốn xoá ${record.code}?`}
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => void handleDelete(record)}
          >
            <Button
              type="text"
              danger
              aria-label={`Xoá ${record.code}`}
              icon={<Trash2 size={16} color="#ef4444" />}
            />
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
              Quản lý mã giảm giá
            </Title>
            <Text style={{ color: "#7d869c" }}>
              Theo dõi trạng thái voucher và kiểm tra nhanh dữ liệu từ API.
            </Text>
          </div>

          <Space wrap>
            <Tag color={isUsingMockData ? "gold" : "green"} style={{ padding: "6px 10px" }}>
              {isUsingMockData
                ? "Đang hiển thị dữ liệu mẫu"
                : `API: ${API_BASE_URL}${VOUCHER_API_PATH}`}
            </Tag>
            <Button icon={<RefreshCw size={16} />} onClick={() => void loadVouchers()}>
              Tải lại
            </Button>
          </Space>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#7c3aed" />
              <div>
                <Text style={{ color: "#7d869c" }}>Tổng mã</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>
                  {stats.total}
                </Title>
              </div>
            </Space>
          </Card>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#16a34a" />
              <div>
                <Text style={{ color: "#7d869c" }}>Đang hoạt động</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>
                  {stats.active}
                </Title>
              </div>
            </Space>
          </Card>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#2563eb" />
              <div>
                <Text style={{ color: "#7d869c" }}>Sắp diễn ra</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>
                  {stats.scheduled}
                </Title>
              </div>
            </Space>
          </Card>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#f59e0b" />
              <div>
                <Text style={{ color: "#7d869c" }}>Hết hạn</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>
                  {stats.expired}
                </Title>
              </div>
            </Space>
          </Card>
        </div>

        <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
          <Space
            direction="vertical"
            size={16}
            style={{ width: "100%" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <Title level={4} style={{ margin: 0, color: "#1f2a44" }}>
                  Danh sách mã giảm giá
                </Title>
                <Text style={{ color: "#7d869c" }}>
                  Có {filteredVouchers.length} mã đang hiển thị trong bảng.
                </Text>
              </div>

              <Space wrap>
                <Input
                  allowClear
                  prefix={<Search size={16} color="#94a3b8" />}
                  placeholder="Tìm kiếm mã giảm giá..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  style={{ width: 240 }}
                />
                <Select
                  value={filterType}
                  style={{ width: 150 }}
                  onChange={(value) => setFilterType(value)}
                  options={[
                    { label: "Tất cả loại KM", value: "all" },
                    { label: "Cố định", value: "fixed" },
                    { label: "Phần trăm", value: "percent" },
                  ]}
                />
                <Select
                  value={filterStatus}
                  style={{ width: 170 }}
                  onChange={(value) => setFilterStatus(value)}
                  options={[
                    { label: "Tất cả trạng thái", value: "all" },
                    { label: "Đang hoạt động", value: "active" },
                    { label: "Sắp diễn ra", value: "scheduled" },
                    { label: "Hết hạn", value: "expired" },
                  ]}
                />
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)",
                    borderColor: "#7c3aed",
                  }}
                  onClick={openCreateModal}
                >
                  Thêm mới
                </Button>
              </Space>
            </div>

            <Table<VoucherItem>
              rowKey="id"
              columns={columns}
              dataSource={filteredVouchers}
              loading={loading}
              pagination={{
                pageSize: 6,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} mã`,
              }}
              scroll={{ x: 960 }}
            />
          </Space>
        </Card>
      </Space>

      <Modal
        title={editingVoucher ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá"}
        open={modalOpen}
        onOk={() => void handleSubmit()}
        onCancel={() => {
          setModalOpen(false);
          resetForm();
        }}
        okText={editingVoucher ? "Lưu thay đổi" : "Tạo mã"}
        cancelText="Huỷ"
        confirmLoading={submitting}
      >
        <Form<VoucherFormValues> form={form} layout="vertical">
          <Form.Item
            label="Mã giảm giá"
            name="code"
            rules={[
              { required: true, message: "Nhập mã giảm giá." },
              { min: 4, message: "Mã nên có ít nhất 4 ký tự." },
            ]}
          >
            <Input placeholder="Ví dụ: SAYHIBANMOI" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Nhập mô tả ngắn cho mã giảm giá." }]}
          >
            <Input placeholder="Ví dụ: Giảm 30K đơn hàng online đầu tiên" />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <Form.Item
              label="Loại giá trị"
              name="discountType"
              rules={[{ required: true, message: "Chọn loại giảm giá." }]}
            >
              <Select
                options={[
                  { label: "Cố định (VND)", value: "fixed" },
                  { label: "Phần trăm (%)", value: "percent" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Giá trị giảm"
              name="discountValue"
              rules={[{ required: true, message: "Nhập giá trị giảm." }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Đơn tối thiểu"
              name="minimumOrder"
              rules={[{ required: true, message: "Nhập điều kiện đơn tối thiểu." }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Giảm tối đa" name="maximumDiscount">
              <InputNumber min={0} style={{ width: "100%" }} placeholder="Chỉ dùng cho giảm theo %" />
            </Form.Item>
          </div>

          <Form.Item
            label="Thời gian áp dụng"
            name="dateRange"
            rules={[{ required: true, message: "Chọn thời gian áp dụng." }]}
          >
            <RangePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
