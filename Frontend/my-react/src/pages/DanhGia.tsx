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
import { MessageSquareText, PencilLine, Plus, RefreshCw, Search, Star, Trash2 } from "lucide-react";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface ReviewItem {
  maDanhGia: number;
  maNguoiDung: number;
  maDichVu: number;
  soSao: number;
  binhLuan: string;
  ngayDanhGia: string;
}

interface ReviewFormValues {
  maNguoiDung: number;
  maDichVu: number;
  soSao: number;
  binhLuan: string;
  ngayDanhGia: Dayjs;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const REVIEW_API_PATH = import.meta.env.VITE_DANH_GIA_API_PATH ?? "/api/danh-gia";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const mockReviews: ReviewItem[] = [
  {
    maDanhGia: 1,
    maNguoiDung: 101,
    maDichVu: 201,
    soSao: 5,
    binhLuan: "Dich vu rat tot, lich trinh ro rang va nhan vien ho tro nhanh.",
    ngayDanhGia: "2026-03-20",
  },
  {
    maDanhGia: 2,
    maNguoiDung: 102,
    maDichVu: 305,
    soSao: 4,
    binhLuan: "Khach san sach se, vi tri dep, chi co buffet sang hoi it mon.",
    ngayDanhGia: "2026-03-21",
  },
  {
    maDanhGia: 3,
    maNguoiDung: 103,
    maDichVu: 402,
    soSao: 2,
    binhLuan: "Can cai thien thoi gian phan hoi va quy trinh check-in.",
    ngayDanhGia: "2026-03-22",
  },
  {
    maDanhGia: 4,
    maNguoiDung: 104,
    maDichVu: 501,
    soSao: 3,
    binhLuan: "Trai nghiem on, nhung gia ve cuoi tuan hoi cao.",
    ngayDanhGia: "2026-03-23",
  },
];

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

function normalizeReview(input: unknown, index: number): ReviewItem {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    maDanhGia: Number(raw.maDanhGia ?? raw.id ?? index + 1),
    maNguoiDung: Number(raw.maNguoiDung ?? raw.userId ?? 0),
    maDichVu: Number(raw.maDichVu ?? raw.serviceId ?? 0),
    soSao: Number(raw.soSao ?? raw.rating ?? 0),
    binhLuan: String(raw.binhLuan ?? raw.comment ?? ""),
    ngayDanhGia: String(raw.ngayDanhGia ?? raw.reviewDate ?? dayjs().format("YYYY-MM-DD")),
  };
}

async function fetchReviews(): Promise<ReviewItem[]> {
  const response = await apiClient.get(REVIEW_API_PATH);
  return extractArray(response.data).map(normalizeReview);
}

async function createReview(item: ReviewItem): Promise<ReviewItem> {
  const response = await apiClient.post(REVIEW_API_PATH, item);
  return normalizeReview(response.data, 0);
}

async function updateReview(item: ReviewItem): Promise<ReviewItem> {
  const response = await apiClient.put(`${REVIEW_API_PATH}/${item.maDanhGia}`, item);
  return normalizeReview(response.data, 0);
}

async function deleteReview(id: number): Promise<void> {
  await apiClient.delete(`${REVIEW_API_PATH}/${id}`);
}

function getReviewTone(stars: number): { label: string; color: string } {
  if (stars >= 4) {
    return { label: "Tich cuc", color: "green" };
  }
  if (stars === 3) {
    return { label: "Trung lap", color: "gold" };
  }
  return { label: "Can xu ly", color: "red" };
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

export default function DanhGia() {
  const [form] = Form.useForm<ReviewFormValues>();
  const [data, setData] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReviewItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStars, setFilterStars] = useState<number | "all">("all");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const loadReviews = async () => {
    setLoading(true);

    try {
      const reviews = await fetchReviews();
      setData(reviews.length > 0 ? reviews : mockReviews);
      setIsUsingMockData(reviews.length === 0);
      if (reviews.length === 0) {
        message.info("API chua tra du lieu danh gia, dang hien thi du lieu mau.");
      }
    } catch (error) {
      setData(mockReviews);
      setIsUsingMockData(true);
      if (axios.isAxiosError(error)) {
        message.warning(`Khong ket noi duoc API ${API_BASE_URL}${REVIEW_API_PATH}. Dang dung du lieu mau.`);
      } else {
        message.warning("Co loi khi tai du lieu danh gia. Dang dung du lieu mau.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  const filteredData = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return data.filter((item) => {
      const reviewDate = dayjs(item.ngayDanhGia);
      const startDate = dateRange?.[0] ?? null;
      const endDate = dateRange?.[1] ?? null;
      const matchesSearch =
        keyword.length === 0 ||
        String(item.maDanhGia).includes(keyword) ||
        String(item.maNguoiDung).includes(keyword) ||
        String(item.maDichVu).includes(keyword) ||
        item.binhLuan.toLowerCase().includes(keyword);
      const matchesStars = filterStars === "all" || item.soSao === filterStars;
      const matchesDate =
        !dateRange ||
        (!startDate && !endDate) ||
        ((!startDate || !reviewDate.isBefore(startDate, "day")) &&
          (!endDate || !reviewDate.isAfter(endDate, "day")));

      return matchesSearch && matchesStars && matchesDate;
    });
  }, [data, dateRange, filterStars, searchText]);

  const stats = useMemo(() => {
    const positive = data.filter((item) => item.soSao >= 4).length;
    const neutral = data.filter((item) => item.soSao === 3).length;
    const negative = data.filter((item) => item.soSao <= 2).length;
    const avg =
      data.length > 0 ? data.reduce((sum, item) => sum + item.soSao, 0) / data.length : 0;

    return {
      total: data.length,
      positive,
      neutral,
      negative,
      avg,
    };
  }, [data]);

  const resetForm = () => {
    form.resetFields();
    setEditingItem(null);
  };

  const openCreateModal = () => {
    resetForm();
    form.setFieldsValue({
      maNguoiDung: 100,
      maDichVu: 200,
      soSao: 5,
      ngayDanhGia: dayjs(),
    });
    setModalOpen(true);
  };

  const openEditModal = (item: ReviewItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      maNguoiDung: item.maNguoiDung,
      maDichVu: item.maDichVu,
      soSao: item.soSao,
      binhLuan: item.binhLuan,
      ngayDanhGia: dayjs(item.ngayDanhGia),
    });
    setModalOpen(true);
  };

  const handleDelete = async (item: ReviewItem) => {
    const previous = data;
    setData((current) => current.filter((entry) => entry.maDanhGia !== item.maDanhGia));

    if (isUsingMockData) {
      message.success(`Da xoa danh gia #${item.maDanhGia} tren du lieu mau.`);
      return;
    }

    try {
      await deleteReview(item.maDanhGia);
      message.success(`Da xoa danh gia #${item.maDanhGia}.`);
    } catch {
      setData(previous);
      message.error("Xoa khong thanh cong, du lieu da duoc hoan lai.");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const payload: ReviewItem = {
        maDanhGia: editingItem?.maDanhGia ?? Date.now(),
        maNguoiDung: values.maNguoiDung,
        maDichVu: values.maDichVu,
        soSao: values.soSao,
        binhLuan: values.binhLuan.trim(),
        ngayDanhGia: values.ngayDanhGia.format("YYYY-MM-DD"),
      };

      if (isUsingMockData) {
        setData((current) =>
          editingItem
            ? current.map((item) => (item.maDanhGia === editingItem.maDanhGia ? payload : item))
            : [payload, ...current],
        );
        message.success(editingItem ? "Da cap nhat danh gia tren du lieu mau." : "Da them danh gia tren du lieu mau.");
        setModalOpen(false);
        resetForm();
        return;
      }

      if (editingItem) {
        const updated = await updateReview(payload);
        setData((current) =>
          current.map((item) => (item.maDanhGia === editingItem.maDanhGia ? updated : item)),
        );
        message.success("Cap nhat danh gia thanh cong.");
      } else {
        const created = await createReview(payload);
        setData((current) => [created, ...current]);
        message.success("Them danh gia thanh cong.");
      }

      setModalOpen(false);
      resetForm();
    } catch (error) {
      if (!axios.isAxiosError(error) && !(error instanceof Error)) {
        return;
      }
      if (axios.isAxiosError(error)) {
        message.error("Khong luu duoc du lieu len API. Kiem tra endpoint hoac backend roi thu lai.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableProps<ReviewItem>["columns"] = [
    {
      title: "Danh gia",
      key: "review",
      render: (_value, record) => (
        <div>
          <div style={{ fontWeight: 700, color: "#1f2a44" }}>Danh gia #{record.maDanhGia}</div>
          <Text style={{ color: "#7d869c", fontSize: 13 }}>
            Nguoi dung: {record.maNguoiDung} | Dich vu: {record.maDichVu}
          </Text>
        </div>
      ),
    },
    {
      title: "Noi dung",
      dataIndex: "binhLuan",
      key: "binhLuan",
      render: (value: string) => (
        <div style={{ maxWidth: 380 }}>
          <Text style={{ color: "#55607a" }}>{value}</Text>
        </div>
      ),
    },
    {
      title: "So sao",
      dataIndex: "soSao",
      key: "soSao",
      render: (value: number) => (
        <Space size={6}>
          <Star size={15} color="#f59e0b" fill="#f59e0b" />
          <Text strong>{value}/5</Text>
        </Space>
      ),
    },
    {
      title: "Danh muc",
      key: "tone",
      render: (_value, record) => {
        const meta = getReviewTone(record.soSao);
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: "Ngay danh gia",
      dataIndex: "ngayDanhGia",
      key: "ngayDanhGia",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Thao tac",
      key: "actions",
      align: "center",
      render: (_value, record) => (
        <Space size="middle">
          <Button type="text" icon={<PencilLine size={16} color="#7c3aed" />} onClick={() => openEditModal(record)} />
          <Popconfirm title="Xoa danh gia?" description={`Ban co chac muon xoa danh gia #${record.maDanhGia}?`} okText="Xoa" cancelText="Huy" onConfirm={() => void handleDelete(record)}>
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
            <Title level={3} style={{ margin: 0, color: "#182338" }}>Quan ly danh gia</Title>
            <Text style={{ color: "#7d869c" }}>
              Theo doi chat luong phan hoi cua nguoi dung, loc review tieu cuc va xu ly noi dung nhanh cho trang admin.
            </Text>
          </div>

          <Space wrap>
            <Tag color={isUsingMockData ? "gold" : "green"} style={{ padding: "6px 10px" }}>
              {isUsingMockData ? "Dang hien thi du lieu mau" : `API: ${API_BASE_URL}${REVIEW_API_PATH}`}
            </Tag>
            <Button icon={<RefreshCw size={16} />} onClick={() => void loadReviews()}>Tai lai</Button>
          </Space>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <Card style={statCardStyle}><Space align="start"><Badge color="#7c3aed" /><div><Text style={{ color: "#7d869c" }}>Tong danh gia</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.total}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#16a34a" /><div><Text style={{ color: "#7d869c" }}>Tich cuc</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.positive}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#eab308" /><div><Text style={{ color: "#7d869c" }}>Trung lap</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.neutral}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#ef4444" /><div><Text style={{ color: "#7d869c" }}>Can xu ly</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.negative}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#2563eb" /><div><Text style={{ color: "#7d869c" }}>Diem trung binh</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.avg.toFixed(1)}</Title></div></Space></Card>
        </div>

        <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <Space size={8}>
                  <MessageSquareText size={18} color="#2563eb" />
                  <Title level={4} style={{ margin: 0, color: "#1f2a44" }}>Danh sach danh gia</Title>
                </Space>
                <Text style={{ color: "#7d869c" }}>Co {filteredData.length} danh gia dang hien thi trong bang.</Text>
              </div>

              <Space wrap>
                <Input
                  allowClear
                  prefix={<Search size={16} color="#94a3b8" />}
                  placeholder="Tim binh luan, ma nguoi dung, ma dich vu..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  style={{ width: 280 }}
                />
                <Select
                  value={filterStars}
                  style={{ width: 160 }}
                  onChange={(value) => setFilterStars(value)}
                  options={[
                    { label: "Tat ca so sao", value: "all" },
                    { label: "5 sao", value: 5 },
                    { label: "4 sao", value: 4 },
                    { label: "3 sao", value: 3 },
                    { label: "2 sao", value: 2 },
                    { label: "1 sao", value: 1 },
                  ]}
                />
                <RangePicker format="DD/MM/YYYY" value={dateRange} onChange={(value) => setDateRange(value)} />
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)", borderColor: "#7c3aed" }}
                  onClick={openCreateModal}
                >
                  Them moi
                </Button>
              </Space>
            </div>

            <Table<ReviewItem>
              rowKey="maDanhGia"
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              pagination={{
                pageSize: 6,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} danh gia`,
              }}
              scroll={{ x: 1180 }}
            />
          </Space>
        </Card>
      </Space>

      <Modal
        title={editingItem ? "Cap nhat danh gia" : "Them danh gia"}
        open={modalOpen}
        onOk={() => void handleSubmit()}
        onCancel={() => {
          setModalOpen(false);
          resetForm();
        }}
        okText={editingItem ? "Luu thay doi" : "Tao moi"}
        cancelText="Huy"
        confirmLoading={submitting}
      >
        <Form<ReviewFormValues> form={form} layout="vertical">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <Form.Item label="Ma nguoi dung" name="maNguoiDung" rules={[{ required: true, message: "Nhap ma nguoi dung." }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Ma dich vu" name="maDichVu" rules={[{ required: true, message: "Nhap ma dich vu." }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="So sao" name="soSao" rules={[{ required: true, message: "Nhap so sao." }]}>
              <Select
                options={[
                  { label: "1 sao", value: 1 },
                  { label: "2 sao", value: 2 },
                  { label: "3 sao", value: 3 },
                  { label: "4 sao", value: 4 },
                  { label: "5 sao", value: 5 },
                ]}
              />
            </Form.Item>
            <Form.Item label="Ngay danh gia" name="ngayDanhGia" rules={[{ required: true, message: "Chon ngay danh gia." }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </div>
          <Form.Item label="Binh luan" name="binhLuan" rules={[{ required: true, message: "Nhap binh luan." }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
