import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Empty,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { TableProps } from "antd";
import { Download, ReceiptText, RefreshCw, Search } from "lucide-react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled";
type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

interface DonDatRow {
  maDon: number;
  maNguoiDung: number;
  tongGia: number;
  trangThai: OrderStatus;
  ngayTao: string;
}

interface ChiTietDonRow {
  maChiTiet: number;
  maDon: number;
  maDichVu: number;
  soLuong: number;
  gia: number;
}

interface ThanhToanRow {
  maThanhToan: number;
  maDon: number;
  soTien: number;
  phuongThuc: string;
  trangThai: PaymentStatus;
  ngayThanhToan: string;
}

interface InvoiceRow {
  maDon: number;
  maNguoiDung: number;
  tongGia: number;
  trangThai: OrderStatus;
  ngayTao: string;
  thanhToan?: ThanhToanRow | null;
  chiTiet: ChiTietDonRow[];
  tongSoLuong: number;
  tongDichVu: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const DON_DAT_API_PATH = import.meta.env.VITE_DON_DAT_API_PATH ?? "/api/don-dat";
const CHI_TIET_DON_API_PATH = import.meta.env.VITE_CHI_TIET_DON_API_PATH ?? "/api/chi-tiet-don";
const THANH_TOAN_API_PATH = import.meta.env.VITE_THANH_TOAN_API_PATH ?? "/api/thanh-toan";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const mockDonDat: DonDatRow[] = [
  { maDon: 1001, maNguoiDung: 12, tongGia: 2450000, trangThai: "completed", ngayTao: "2026-03-18" },
  { maDon: 1002, maNguoiDung: 15, tongGia: 1750000, trangThai: "confirmed", ngayTao: "2026-03-20" },
  { maDon: 1003, maNguoiDung: 21, tongGia: 980000, trangThai: "pending", ngayTao: "2026-03-22" },
  { maDon: 1004, maNguoiDung: 8, tongGia: 3150000, trangThai: "cancelled", ngayTao: "2026-03-23" },
];

const mockChiTietDon: ChiTietDonRow[] = [
  { maChiTiet: 1, maDon: 1001, maDichVu: 201, soLuong: 2, gia: 850000 },
  { maChiTiet: 2, maDon: 1001, maDichVu: 305, soLuong: 1, gia: 750000 },
  { maChiTiet: 3, maDon: 1002, maDichVu: 120, soLuong: 1, gia: 1200000 },
  { maChiTiet: 4, maDon: 1002, maDichVu: 121, soLuong: 1, gia: 550000 },
  { maChiTiet: 5, maDon: 1003, maDichVu: 402, soLuong: 2, gia: 490000 },
  { maChiTiet: 6, maDon: 1004, maDichVu: 501, soLuong: 3, gia: 1050000 },
];

const mockThanhToan: ThanhToanRow[] = [
  { maThanhToan: 9001, maDon: 1001, soTien: 2450000, phuongThuc: "VNPay", trangThai: "paid", ngayThanhToan: "2026-03-18" },
  { maThanhToan: 9002, maDon: 1002, soTien: 1750000, phuongThuc: "Chuyển khoản", trangThai: "paid", ngayThanhToan: "2026-03-20" },
  { maThanhToan: 9003, maDon: 1003, soTien: 980000, phuongThuc: "Tiền mặt", trangThai: "pending", ngayThanhToan: "2026-03-22" },
  { maThanhToan: 9004, maDon: 1004, soTien: 3150000, phuongThuc: "Momo", trangThai: "failed", ngayThanhToan: "2026-03-23" },
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

function normalizeOrderStatus(value: unknown): OrderStatus {
  const status = String(value ?? "").toLowerCase();
  if (status.includes("complete") || status.includes("hoan")) {
    return "completed";
  }
  if (status.includes("confirm") || status.includes("xac")) {
    return "confirmed";
  }
  if (status.includes("cancel") || status.includes("huy")) {
    return "cancelled";
  }
  return "pending";
}

function normalizePaymentStatus(value: unknown): PaymentStatus {
  const status = String(value ?? "").toLowerCase();
  if (status.includes("paid") || status.includes("thanhcong") || status.includes("da")) {
    return "paid";
  }
  if (status.includes("fail") || status.includes("thatbai")) {
    return "failed";
  }
  if (status.includes("refund") || status.includes("hoan")) {
    return "refunded";
  }
  return "pending";
}

function normalizeDonDat(input: unknown, index: number): DonDatRow {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    maDon: Number(raw.maDon ?? raw.id ?? index + 1),
    maNguoiDung: Number(raw.maNguoiDung ?? raw.userId ?? 0),
    tongGia: Number(raw.tongGia ?? raw.totalPrice ?? 0),
    trangThai: normalizeOrderStatus(raw.trangThai ?? raw.status),
    ngayTao: String(raw.ngayTao ?? raw.createdAt ?? dayjs().format("YYYY-MM-DD")),
  };
}

function normalizeChiTietDon(input: unknown, index: number): ChiTietDonRow {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    maChiTiet: Number(raw.maChiTiet ?? raw.id ?? index + 1),
    maDon: Number(raw.maDon ?? raw.orderId ?? 0),
    maDichVu: Number(raw.maDichVu ?? raw.serviceId ?? 0),
    soLuong: Number(raw.soLuong ?? raw.quantity ?? 0),
    gia: Number(raw.gia ?? raw.price ?? 0),
  };
}

function normalizeThanhToan(input: unknown, index: number): ThanhToanRow {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    maThanhToan: Number(raw.maThanhToan ?? raw.id ?? index + 1),
    maDon: Number(raw.maDon ?? raw.orderId ?? 0),
    soTien: Number(raw.soTien ?? raw.amount ?? 0),
    phuongThuc: String(raw.phuongThuc ?? raw.method ?? "Chưa xác định"),
    trangThai: normalizePaymentStatus(raw.trangThai ?? raw.status),
    ngayThanhToan: String(raw.ngayThanhToan ?? raw.paymentDate ?? dayjs().format("YYYY-MM-DD")),
  };
}

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (typeof payload === "object" && payload !== null) {
    const record = payload as { data?: unknown; items?: unknown; result?: unknown };
    if (Array.isArray(record.data)) {
      return record.data;
    }
    if (Array.isArray(record.items)) {
      return record.items;
    }
    if (Array.isArray(record.result)) {
      return record.result;
    }
  }

  return [];
}

function mergeInvoices(
  donDatList: DonDatRow[],
  chiTietList: ChiTietDonRow[],
  thanhToanList: ThanhToanRow[],
): InvoiceRow[] {
  return donDatList.map((don) => {
    const chiTiet = chiTietList.filter((item) => item.maDon === don.maDon);
    const thanhToan = thanhToanList.find((item) => item.maDon === don.maDon) ?? null;

    return {
      ...don,
      chiTiet,
      thanhToan,
      tongSoLuong: chiTiet.reduce((sum, item) => sum + item.soLuong, 0),
      tongDichVu: chiTiet.length,
    };
  });
}

async function fetchInvoices(): Promise<InvoiceRow[]> {
  const [donDatResponse, chiTietResponse, thanhToanResponse] = await Promise.all([
    apiClient.get(DON_DAT_API_PATH),
    apiClient.get(CHI_TIET_DON_API_PATH),
    apiClient.get(THANH_TOAN_API_PATH),
  ]);

  const donDat = extractArray(donDatResponse.data).map(normalizeDonDat);
  const chiTietDon = extractArray(chiTietResponse.data).map(normalizeChiTietDon);
  const thanhToan = extractArray(thanhToanResponse.data).map(normalizeThanhToan);

  return mergeInvoices(donDat, chiTietDon, thanhToan);
}

function getOrderStatusMeta(status: OrderStatus): { label: string; color: string } {
  switch (status) {
    case "completed":
      return { label: "Hoàn thành", color: "green" };
    case "confirmed":
      return { label: "Đã xác nhận", color: "blue" };
    case "cancelled":
      return { label: "Đã huỷ", color: "red" };
    default:
      return { label: "Chờ xử lý", color: "gold" };
  }
}

function getPaymentStatusMeta(status?: PaymentStatus): { label: string; color: string } {
  switch (status) {
    case "paid":
      return { label: "Đã thanh toán", color: "green" };
    case "failed":
      return { label: "Thanh toán lỗi", color: "red" };
    case "refunded":
      return { label: "Đã hoàn tiền", color: "purple" };
    default:
      return { label: "Chờ thanh toán", color: "gold" };
  }
}

function buildCsvContent(rows: InvoiceRow[]): string {
  const headers = [
    "MaDon",
    "MaNguoiDung",
    "TongGia",
    "TrangThaiDon",
    "NgayTao",
    "SoDichVu",
    "TongSoLuong",
    "MaThanhToan",
    "SoTienThanhToan",
    "PhuongThuc",
    "TrangThaiThanhToan",
    "NgayThanhToan",
  ];

  const lines = rows.map((row) =>
    [
      row.maDon,
      row.maNguoiDung,
      row.tongGia,
      row.trangThai,
      row.ngayTao,
      row.tongDichVu,
      row.tongSoLuong,
      row.thanhToan?.maThanhToan ?? "",
      row.thanhToan?.soTien ?? "",
      row.thanhToan?.phuongThuc ?? "",
      row.thanhToan?.trangThai ?? "",
      row.thanhToan?.ngayThanhToan ?? "",
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );

  return `\uFEFF${headers.join(",")}\n${lines.join("\n")}`;
}

function downloadExcelCompatibleFile(rows: InvoiceRow[]): void {
  const content = buildCsvContent(rows);
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hoa-don-${dayjs().format("YYYY-MM-DD-HH-mm")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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

export default function DonHang() {
  const [data, setData] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | "all">("all");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const loadInvoices = async () => {
    setLoading(true);

    try {
      const invoices = await fetchInvoices();

      if (invoices.length > 0) {
        setData(invoices);
        setIsUsingMockData(false);
      } else {
        setData(mergeInvoices(mockDonDat, mockChiTietDon, mockThanhToan));
        setIsUsingMockData(true);
        message.info("API chưa trả dữ liệu hóa đơn, đang hiển thị dữ liệu mẫu để bạn kiểm tra.");
      }
    } catch (error) {
      setData(mergeInvoices(mockDonDat, mockChiTietDon, mockThanhToan));
      setIsUsingMockData(true);

      if (axios.isAxiosError(error)) {
        message.warning(
          `Không kết nối được API ${API_BASE_URL}. Đang dùng dữ liệu mẫu cho quản lý hóa đơn.`,
        );
      } else {
        message.warning("Có lỗi khi tải dữ liệu hóa đơn. Đang dùng dữ liệu mẫu.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInvoices();
  }, []);

  const filteredData = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return data.filter((item) => {
      const matchesKeyword =
        keyword.length === 0 ||
        String(item.maDon).includes(keyword) ||
        String(item.maNguoiDung).includes(keyword) ||
        item.thanhToan?.phuongThuc.toLowerCase().includes(keyword) === true;

      const matchesOrderStatus =
        orderStatusFilter === "all" || item.trangThai === orderStatusFilter;

      const paymentStatus = item.thanhToan?.trangThai ?? "pending";
      const matchesPaymentStatus =
        paymentStatusFilter === "all" || paymentStatus === paymentStatusFilter;

      const orderDate = dayjs(item.ngayTao);
      const startDate = dateRange?.[0] ?? null;
      const endDate = dateRange?.[1] ?? null;
      const matchesDate =
        !dateRange ||
        (!startDate && !endDate) ||
        ((!startDate || !orderDate.isBefore(startDate, "day")) &&
          (!endDate || !orderDate.isAfter(endDate, "day")));

      return matchesKeyword && matchesOrderStatus && matchesPaymentStatus && matchesDate;
    });
  }, [data, dateRange, orderStatusFilter, paymentStatusFilter, searchText]);

  const stats = useMemo(() => {
    const doanhThu = filteredData.reduce((sum, item) => sum + item.tongGia, 0);
    const paid = filteredData.filter((item) => item.thanhToan?.trangThai === "paid").length;
    const pending = filteredData.filter((item) => item.trangThai === "pending").length;
    const cancelled = filteredData.filter((item) => item.trangThai === "cancelled").length;

    return {
      total: filteredData.length,
      revenue: doanhThu,
      paid,
      pending,
      cancelled,
    };
  }, [filteredData]);

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      message.warning("Không có dữ liệu để xuất.");
      return;
    }

    downloadExcelCompatibleFile(filteredData);
    message.success("Đã xuất file Excel-compatible (.csv).");
  };

  const columns: TableProps<InvoiceRow>["columns"] = [
    {
      title: "Mã đơn",
      dataIndex: "maDon",
      key: "maDon",
      fixed: "left",
      width: 110,
      render: (value: number) => <Text strong style={{ color: "#1f2a44" }}>#{value}</Text>,
    },
    {
      title: "Người dùng",
      dataIndex: "maNguoiDung",
      key: "maNguoiDung",
      width: 120,
      render: (value: number) => <Text>ID {value}</Text>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngayTao",
      key: "ngayTao",
      width: 130,
      render: (value: string) => <Text>{formatDate(value)}</Text>,
    },
    {
      title: "Dịch vụ",
      key: "dichvu",
      width: 120,
      render: (_value, record) => (
        <div>
          <div style={{ fontWeight: 600, color: "#1f2a44" }}>{record.tongDichVu} dịch vụ</div>
          <Text style={{ fontSize: 12, color: "#7d869c" }}>{record.tongSoLuong} sản phẩm</Text>
        </div>
      ),
    },
    {
      title: "Tổng giá",
      dataIndex: "tongGia",
      key: "tongGia",
      width: 150,
      render: (value: number) => <Text strong>{formatCurrency(value)}</Text>,
    },
    {
      title: "Trạng thái đơn",
      dataIndex: "trangThai",
      key: "trangThai",
      width: 140,
      render: (status: OrderStatus) => {
        const meta = getOrderStatusMeta(status);
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: "Thanh toán",
      key: "thanhtoan",
      width: 220,
      render: (_value, record) => {
        const paymentMeta = getPaymentStatusMeta(record.thanhToan?.trangThai);
        return (
          <div>
            <div style={{ fontWeight: 600, color: "#1f2a44" }}>
              {record.thanhToan?.phuongThuc ?? "Chưa có thanh toán"}
            </div>
            <Tag color={paymentMeta.color} style={{ marginTop: 4 }}>
              {paymentMeta.label}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Số tiền TT",
      key: "soTienThanhToan",
      width: 150,
      render: (_value, record) => (
        <Text>{record.thanhToan ? formatCurrency(record.thanhToan.soTien) : "--"}</Text>
      ),
    },
  ];

  return (
    <div style={pageContainerStyle}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <Title level={3} style={{ margin: 0, color: "#182338" }}>
              Quản lý hóa đơn
            </Title>
            <Text style={{ color: "#7d869c" }}>
              Theo dõi đơn đặt, chi tiết đơn và thanh toán theo logic của các website quản lý hóa đơn hiện nay.
            </Text>
          </div>

          <Space wrap>
            <Tag color={isUsingMockData ? "gold" : "green"} style={{ padding: "6px 10px" }}>
              {isUsingMockData ? "Đang hiển thị dữ liệu mẫu" : `API: ${API_BASE_URL}`}
            </Tag>
            <Button icon={<RefreshCw size={16} />} onClick={() => void loadInvoices()}>
              Tải lại
            </Button>
            <Button type="primary" icon={<Download size={16} />} onClick={handleExportExcel}>
              Xuất Excel
            </Button>
          </Space>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 16,
          }}
        >
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#7c3aed" />
              <div>
                <Text style={{ color: "#7d869c" }}>Tổng hóa đơn</Text>
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
                <Text style={{ color: "#7d869c" }}>Doanh thu lọc được</Text>
                <Title level={4} style={{ margin: "4px 0 0", color: "#182338" }}>
                  {formatCurrency(stats.revenue)}
                </Title>
              </div>
            </Space>
          </Card>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#2563eb" />
              <div>
                <Text style={{ color: "#7d869c" }}>Đã thanh toán</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>
                  {stats.paid}
                </Title>
              </div>
            </Space>
          </Card>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#eab308" />
              <div>
                <Text style={{ color: "#7d869c" }}>Chờ xử lý</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>
                  {stats.pending}
                </Title>
              </div>
            </Space>
          </Card>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#ef4444" />
              <div>
                <Text style={{ color: "#7d869c" }}>Đã huỷ</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>
                  {stats.cancelled}
                </Title>
              </div>
            </Space>
          </Card>
        </div>

        <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <Title level={4} style={{ margin: 0, color: "#1f2a44" }}>
                  Danh sách hóa đơn
                </Title>
                <Text style={{ color: "#7d869c" }}>
                  Mở rộng từng dòng để xem chi tiết đơn và bản ghi thanh toán tương ứng.
                </Text>
              </div>

              <Space wrap>
                <Input
                  allowClear
                  prefix={<Search size={16} color="#94a3b8" />}
                  placeholder="Tìm mã đơn, mã người dùng, phương thức..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  style={{ width: 280 }}
                />
                <Select
                  value={orderStatusFilter}
                  style={{ width: 160 }}
                  onChange={(value) => setOrderStatusFilter(value)}
                  options={[
                    { label: "Tất cả trạng thái đơn", value: "all" },
                    { label: "Chờ xử lý", value: "pending" },
                    { label: "Đã xác nhận", value: "confirmed" },
                    { label: "Hoàn thành", value: "completed" },
                    { label: "Đã huỷ", value: "cancelled" },
                  ]}
                />
                <Select
                  value={paymentStatusFilter}
                  style={{ width: 180 }}
                  onChange={(value) => setPaymentStatusFilter(value)}
                  options={[
                    { label: "Tất cả thanh toán", value: "all" },
                    { label: "Đã thanh toán", value: "paid" },
                    { label: "Chờ thanh toán", value: "pending" },
                    { label: "Thanh toán lỗi", value: "failed" },
                    { label: "Đã hoàn tiền", value: "refunded" },
                  ]}
                />
                <RangePicker
                  format="DD/MM/YYYY"
                  value={dateRange}
                  onChange={(value) => setDateRange(value)}
                />
              </Space>
            </div>

            <Table<InvoiceRow>
              rowKey="maDon"
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              locale={{
                emptyText: <Empty description="Chưa có hóa đơn phù hợp" />,
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(280px, 1.2fr) minmax(260px, 0.8fr)",
                      gap: 16,
                    }}
                  >
                    <Card
                      size="small"
                      title={
                        <Space>
                          <ReceiptText size={16} />
                          <span>Chi tiết đơn #{record.maDon}</span>
                        </Space>
                      }
                    >
                      <Table<ChiTietDonRow>
                        rowKey="maChiTiet"
                        size="small"
                        pagination={false}
                        dataSource={record.chiTiet}
                        locale={{ emptyText: "Không có chi tiết đơn" }}
                        columns={[
                          { title: "Mã chi tiết", dataIndex: "maChiTiet", key: "maChiTiet", width: 110 },
                          { title: "Mã dịch vụ", dataIndex: "maDichVu", key: "maDichVu", width: 110 },
                          { title: "Số lượng", dataIndex: "soLuong", key: "soLuong", width: 90 },
                          {
                            title: "Giá",
                            dataIndex: "gia",
                            key: "gia",
                            render: (value: number) => formatCurrency(value),
                          },
                        ]}
                      />
                    </Card>

                    <Card size="small" title="Thông tin thanh toán">
                      {record.thanhToan ? (
                        <Descriptions column={1} size="small" labelStyle={{ width: 130 }}>
                          <Descriptions.Item label="Mã thanh toán">
                            {record.thanhToan.maThanhToan}
                          </Descriptions.Item>
                          <Descriptions.Item label="Phương thức">
                            {record.thanhToan.phuongThuc}
                          </Descriptions.Item>
                          <Descriptions.Item label="Số tiền">
                            {formatCurrency(record.thanhToan.soTien)}
                          </Descriptions.Item>
                          <Descriptions.Item label="Trạng thái">
                            <Tag color={getPaymentStatusMeta(record.thanhToan.trangThai).color}>
                              {getPaymentStatusMeta(record.thanhToan.trangThai).label}
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label="Ngày thanh toán">
                            {formatDate(record.thanhToan.ngayThanhToan)}
                          </Descriptions.Item>
                        </Descriptions>
                      ) : (
                        <Empty description="Chưa có bản ghi thanh toán" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}
                    </Card>
                  </div>
                ),
              }}
              pagination={{
                pageSize: 6,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} hóa đơn`,
              }}
              scroll={{ x: 1200 }}
            />
          </Space>
        </Card>
      </Space>
    </div>
  );
}
