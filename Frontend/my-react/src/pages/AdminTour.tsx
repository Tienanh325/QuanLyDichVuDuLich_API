import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import api from "../services/api";
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
  Tabs,
  Typography,
  message,
} from "antd";
import type { TableProps } from "antd";
import { MapPinned, PencilLine, Plus, Search, Trash2 } from "lucide-react";
import * as adminApi from "../services/adminService";

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
  giaGoc?: number;
  giaKhuyenMai?: number;
  ngayBatDau: string;
  soLuong: number;
  moTa: string;
  danhGia: number;
  soLuotDanhGia?: number;
  diaDiem?: string;
  viTriKhoiHanh?: string;
  highlight?: string;
  chinhSachHuy?: string;
  isBestSeller?: boolean;
  xacNhanTucThi?: boolean;
}

interface TourFormValues {
  maDichVu: number;
  ten: string;
  viTri: string;
  thoiGian: string;
  gia: number;
  giaGoc?: number;
  giaKhuyenMai?: number;
  ngayBatDau: Dayjs;
  soLuong: number;
  moTa: string;
  danhGia: number;
  soLuotDanhGia?: number;
  diaDiem?: string;
  viTriKhoiHanh?: string;
  highlight?: string;
  chinhSachHuy?: string;
  isBestSeller?: boolean;
  xacNhanTucThi?: boolean;
}

interface GoiDichVuItem {
  maGoi: number;
  tenGoi: string;
  moTaGoi?: string;
  giaGoi: number;
  giaGoc?: number;
  soKhachToiThieu: number;
  soKhachToiDa?: number;
  trangThai: number;
  thuTu: number;
}

interface TourMucDichVuItem {
  maMuc: number;
  loaiMuc: adminApi.TourMucLoai;
  noiDung: string;
  thuTu: number;
}

interface LichTrinhTourItem {
  maLichTrinh: number;
  thoiGian: string;
  tieuDe: string;
  chiTiet?: string;
  thuTu: number;
}

interface TourLichKhoiHanhItem {
  maLichKhoiHanh: number;
  ngayKhoiHanh: string;
  gioKhoiHanh?: string;
  soChoToiDa: number;
  soChoConLai: number;
  trangThai: 'OPEN' | 'FULL' | 'CANCELLED' | 'CLOSED';
}

interface TourReviewHienThiItem {
  maReviewHienThi: number;
  tenKhach: string;
  avatar?: string;
  soSao: number;
  noiDung: string;
  thuTu: number;
}


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";
const TOUR_API_PATH = import.meta.env.VITE_TOUR_API_PATH ?? "/api/admin/tour";
const DICH_VU_API_PATH = import.meta.env.VITE_DICH_VU_API_PATH ?? "/api/admin/dich-vu";



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
  if (Array.isArray(payload)) return payload;
  if (typeof payload === "object" && payload !== null) {
    // Backend: { status, data: { data: [...], totalRecords, ... } }
    const outer = payload as Record<string, unknown>;
    const inner = outer.data;
    if (Array.isArray(inner)) return inner;
    if (typeof inner === "object" && inner !== null) {
      const nested = (inner as Record<string, unknown>).data;
      if (Array.isArray(nested)) return nested;
      const items = (inner as Record<string, unknown>).items;
      if (Array.isArray(items)) return items;
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
    // Backend: giaTour field
    gia: Number(raw.gia ?? raw.giaTour ?? raw.giaKhuyenMai ?? raw.price ?? 0),
    giaGoc: Number(raw.giaGoc ?? raw.originalPrice ?? 0),
    giaKhuyenMai: Number(raw.giaKhuyenMai ?? raw.gia ?? raw.giaTour ?? raw.price ?? 0),
    ngayBatDau: String(raw.ngayBatDau ?? raw.startDate ?? dayjs().format("YYYY-MM-DD")),
    // Backend: soLuongKhach field
    soLuong: Number(raw.soLuong ?? raw.soLuongKhach ?? raw.quantity ?? 0),
    moTa: String(raw.moTa ?? raw.moTaHoatDong ?? raw.description ?? ""),
    danhGia: Number(raw.danhGia ?? raw.diemDanhGia ?? raw.rating ?? 0),
    soLuotDanhGia: Number(raw.soLuotDanhGia ?? raw.reviews ?? 0),
    diaDiem: String(raw.diaDiem ?? raw.locationName ?? ""),
    viTriKhoiHanh: String(raw.viTriKhoiHanh ?? raw.departureLocation ?? ""),
    highlight: String(raw.highlight ?? ""),
    chinhSachHuy: String(raw.chinhSachHuy ?? ""),
    isBestSeller: Boolean(raw.isBestSeller ?? false),
    xacNhanTucThi: Boolean(raw.xacNhanTucThi ?? false),
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
  const response = await api.get(TOUR_API_PATH, { params: { limit: 1000 } });
  return extractArray(response.data).map(normalizeTour);
}

async function fetchDichVuOptions(): Promise<DichVuOption[]> {
  const response = await api.get(DICH_VU_API_PATH);
  return extractArray(response.data).map(normalizeDichVu);
}

async function createTour(item: TourItem): Promise<TourItem> {
  const response = await api.post(TOUR_API_PATH, item);
  return normalizeTour(response.data?.data ?? response.data, 0);
}

async function updateTour(item: TourItem): Promise<TourItem> {
  const response = await api.put(`${TOUR_API_PATH}/${item.maTour}`, item);
  return normalizeTour(response.data?.data ?? response.data, 0);
}

async function deleteTour(id: number): Promise<void> {
  await api.delete(`${TOUR_API_PATH}/${id}`);
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

export default function AdminTour() {
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

  // Child management modal
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [currentTour, setCurrentTour] = useState<TourItem | null>(null);
  const [activeChildTab, setActiveChildTab] = useState<string>("goi");
  const [childLoading, setChildLoading] = useState(false);
  const [goiList, setGoiList] = useState<GoiDichVuItem[]>([]);
  const [mucList, setMucList] = useState<TourMucDichVuItem[]>([]);
  const [lichTrinhList, setLichTrinhList] = useState<LichTrinhTourItem[]>([]);
  const [lichKhoiHanhList, setLichKhoiHanhList] = useState<TourLichKhoiHanhItem[]>([]);
  const [reviewList, setReviewList] = useState<TourReviewHienThiItem[]>([]);

  // Child CRUD state
  const [goiFormVisible, setGoiFormVisible] = useState(false);
  const [editingGoi, setEditingGoi] = useState<GoiDichVuItem | null>(null);
  const [submittingGoi, setSubmittingGoi] = useState(false);
  const [mucFormVisible, setMucFormVisible] = useState(false);
  const [editingMuc, setEditingMuc] = useState<TourMucDichVuItem | null>(null);
  const [submittingMuc, setSubmittingMuc] = useState(false);
  const [lichTrinhFormVisible, setLichTrinhFormVisible] = useState(false);
  const [editingLichTrinh, setEditingLichTrinh] = useState<LichTrinhTourItem | null>(null);
  const [submittingLichTrinh, setSubmittingLichTrinh] = useState(false);
  const [lichKhoiHanhFormVisible, setLichKhoiHanhFormVisible] = useState(false);
  const [editingLichKhoiHanh, setEditingLichKhoiHanh] = useState<TourLichKhoiHanhItem | null>(null);
  const [submittingLichKhoiHanh, setSubmittingLichKhoiHanh] = useState(false);
  const [reviewFormVisible, setReviewFormVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<TourReviewHienThiItem | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [goiForm] = Form.useForm<Partial<GoiDichVuItem>>();
  const [mucForm] = Form.useForm<Partial<TourMucDichVuItem>>();
  const [lichTrinhForm] = Form.useForm<Partial<LichTrinhTourItem>>();
  const [lichKhoiHanhForm] = Form.useForm<Omit<Partial<TourLichKhoiHanhItem>, "ngayKhoiHanh"> & { ngayKhoiHanh?: Dayjs }>();
  const [reviewForm] = Form.useForm<Partial<TourReviewHienThiItem>>();

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

  const loadTourChildren = async (tour: TourItem) => {
    setChildLoading(true);
    try {
      const [goi, muc, lichTrinh, lichKhoiHanh, reviews] = await Promise.all([
        adminApi.adminGetTourChild<GoiDichVuItem>(tour.maTour, "goi-dich-vu"),
        adminApi.adminGetTourChild<TourMucDichVuItem>(tour.maTour, "muc-dich-vu"),
        adminApi.adminGetTourChild<LichTrinhTourItem>(tour.maTour, "lich-trinh"),
        adminApi.adminGetTourChild<TourLichKhoiHanhItem>(tour.maTour, "lich-khoi-hanh"),
        adminApi.adminGetTourChild<TourReviewHienThiItem>(tour.maTour, "review-hien-thi"),
      ]);
      setGoiList(goi);
      setMucList(muc);
      setLichTrinhList(lichTrinh);
      setLichKhoiHanhList(lichKhoiHanh);
      setReviewList(reviews);
    } catch {
      message.error("Không tải được dữ liệu chi tiết tour.");
    } finally {
      setChildLoading(false);
    }
  };

  const openManageModal = (tour: TourItem) => {
    setCurrentTour(tour);
    setActiveChildTab("goi");
    setManageModalOpen(true);
    void loadTourChildren(tour);
  };

  const refreshChildren = async () => {
    if (currentTour) {
      await loadTourChildren(currentTour);
    }
  };

  const openCreateGoi = () => {
    setEditingGoi(null);
    goiForm.setFieldsValue({ tenGoi: "", moTaGoi: "", giaGoi: 0, giaGoc: 0, soKhachToiThieu: 1, trangThai: 1, thuTu: goiList.length + 1 });
    setGoiFormVisible(true);
  };

  const openEditGoi = (item: GoiDichVuItem) => {
    setEditingGoi(item);
    goiForm.setFieldsValue(item);
    setGoiFormVisible(true);
  };

  const handleSubmitGoi = async () => {
    if (!currentTour) return;
    const values = await goiForm.validateFields();
    setSubmittingGoi(true);
    try {
      if (editingGoi) {
        await adminApi.adminUpdateTourChild<GoiDichVuItem>(currentTour.maTour, "goi-dich-vu", editingGoi.maGoi, values);
      } else {
        await adminApi.adminCreateTourChild<GoiDichVuItem>(currentTour.maTour, "goi-dich-vu", values);
      }
      message.success(editingGoi ? "Đã cập nhật gói dịch vụ." : "Đã thêm gói dịch vụ.");
      setGoiFormVisible(false);
      await refreshChildren();
    } catch {
      message.error("Không lưu được gói dịch vụ.");
    } finally {
      setSubmittingGoi(false);
    }
  };

  const handleDeleteGoi = async (item: GoiDichVuItem) => {
    if (!currentTour) return;
    try {
      await adminApi.adminDeleteTourChild(currentTour.maTour, "goi-dich-vu", item.maGoi);
      setGoiList((current) => current.filter((entry) => entry.maGoi !== item.maGoi));
      message.success("Đã xoá gói dịch vụ.");
    } catch {
      message.error("Xoá gói dịch vụ thất bại.");
    }
  };

  const openCreateMuc = () => {
    setEditingMuc(null);
    mucForm.setFieldsValue({ loaiMuc: "BAO_GOM", noiDung: "", thuTu: mucList.length + 1 });
    setMucFormVisible(true);
  };

  const openEditMuc = (item: TourMucDichVuItem) => {
    setEditingMuc(item);
    mucForm.setFieldsValue(item);
    setMucFormVisible(true);
  };

  const handleSubmitMuc = async () => {
    if (!currentTour) return;
    const values = await mucForm.validateFields();
    setSubmittingMuc(true);
    try {
      if (editingMuc) {
        await adminApi.adminUpdateTourChild<TourMucDichVuItem>(currentTour.maTour, "muc-dich-vu", editingMuc.maMuc, values);
      } else {
        await adminApi.adminCreateTourChild<TourMucDichVuItem>(currentTour.maTour, "muc-dich-vu", values);
      }
      message.success(editingMuc ? "Đã cập nhật mục dịch vụ." : "Đã thêm mục dịch vụ.");
      setMucFormVisible(false);
      await refreshChildren();
    } catch {
      message.error("Không lưu được mục dịch vụ.");
    } finally {
      setSubmittingMuc(false);
    }
  };

  const handleDeleteMuc = async (item: TourMucDichVuItem) => {
    if (!currentTour) return;
    try {
      await adminApi.adminDeleteTourChild(currentTour.maTour, "muc-dich-vu", item.maMuc);
      setMucList((current) => current.filter((entry) => entry.maMuc !== item.maMuc));
      message.success("Đã xoá mục dịch vụ.");
    } catch {
      message.error("Xoá mục dịch vụ thất bại.");
    }
  };

  const openCreateLichTrinh = () => {
    setEditingLichTrinh(null);
    lichTrinhForm.setFieldsValue({ thoiGian: "", tieuDe: "", chiTiet: "", thuTu: lichTrinhList.length + 1 });
    setLichTrinhFormVisible(true);
  };

  const openEditLichTrinh = (item: LichTrinhTourItem) => {
    setEditingLichTrinh(item);
    lichTrinhForm.setFieldsValue(item);
    setLichTrinhFormVisible(true);
  };

  const handleSubmitLichTrinh = async () => {
    if (!currentTour) return;
    const values = await lichTrinhForm.validateFields();
    setSubmittingLichTrinh(true);
    try {
      if (editingLichTrinh) {
        await adminApi.adminUpdateTourChild<LichTrinhTourItem>(currentTour.maTour, "lich-trinh", editingLichTrinh.maLichTrinh, values);
      } else {
        await adminApi.adminCreateTourChild<LichTrinhTourItem>(currentTour.maTour, "lich-trinh", values);
      }
      message.success(editingLichTrinh ? "Đã cập nhật lịch trình." : "Đã thêm lịch trình.");
      setLichTrinhFormVisible(false);
      await refreshChildren();
    } catch {
      message.error("Không lưu được lịch trình.");
    } finally {
      setSubmittingLichTrinh(false);
    }
  };

  const handleDeleteLichTrinh = async (item: LichTrinhTourItem) => {
    if (!currentTour) return;
    try {
      await adminApi.adminDeleteTourChild(currentTour.maTour, "lich-trinh", item.maLichTrinh);
      setLichTrinhList((current) => current.filter((entry) => entry.maLichTrinh !== item.maLichTrinh));
      message.success("Đã xoá lịch trình.");
    } catch {
      message.error("Xoá lịch trình thất bại.");
    }
  };

  const openCreateLichKhoiHanh = () => {
    setEditingLichKhoiHanh(null);
    lichKhoiHanhForm.setFieldsValue({ ngayKhoiHanh: dayjs().add(7, "day"), gioKhoiHanh: "08:00", soChoToiDa: 20, soChoConLai: 20, trangThai: "OPEN" });
    setLichKhoiHanhFormVisible(true);
  };

  const openEditLichKhoiHanh = (item: TourLichKhoiHanhItem) => {
    setEditingLichKhoiHanh(item);
    lichKhoiHanhForm.setFieldsValue({ ...item, ngayKhoiHanh: dayjs(item.ngayKhoiHanh) });
    setLichKhoiHanhFormVisible(true);
  };

  const handleSubmitLichKhoiHanh = async () => {
    if (!currentTour) return;
    const values = await lichKhoiHanhForm.validateFields();
    const payload = { ...values, ngayKhoiHanh: values.ngayKhoiHanh?.format("YYYY-MM-DD") };
    setSubmittingLichKhoiHanh(true);
    try {
      if (editingLichKhoiHanh) {
        await adminApi.adminUpdateTourChild<TourLichKhoiHanhItem>(currentTour.maTour, "lich-khoi-hanh", editingLichKhoiHanh.maLichKhoiHanh, payload);
      } else {
        await adminApi.adminCreateTourChild<TourLichKhoiHanhItem>(currentTour.maTour, "lich-khoi-hanh", payload);
      }
      message.success(editingLichKhoiHanh ? "Đã cập nhật lịch khởi hành." : "Đã thêm lịch khởi hành.");
      setLichKhoiHanhFormVisible(false);
      await refreshChildren();
    } catch {
      message.error("Không lưu được lịch khởi hành.");
    } finally {
      setSubmittingLichKhoiHanh(false);
    }
  };

  const handleDeleteLichKhoiHanh = async (item: TourLichKhoiHanhItem) => {
    if (!currentTour) return;
    try {
      await adminApi.adminDeleteTourChild(currentTour.maTour, "lich-khoi-hanh", item.maLichKhoiHanh);
      setLichKhoiHanhList((current) => current.filter((entry) => entry.maLichKhoiHanh !== item.maLichKhoiHanh));
      message.success("Đã xoá lịch khởi hành.");
    } catch {
      message.error("Xoá lịch khởi hành thất bại.");
    }
  };

  const openCreateReview = () => {
    setEditingReview(null);
    reviewForm.setFieldsValue({ tenKhach: "", avatar: "", soSao: 5, noiDung: "", thuTu: reviewList.length + 1 });
    setReviewFormVisible(true);
  };

  const openEditReview = (item: TourReviewHienThiItem) => {
    setEditingReview(item);
    reviewForm.setFieldsValue(item);
    setReviewFormVisible(true);
  };

  const handleSubmitReview = async () => {
    if (!currentTour) return;
    const values = await reviewForm.validateFields();
    setSubmittingReview(true);
    try {
      if (editingReview) {
        await adminApi.adminUpdateTourChild<TourReviewHienThiItem>(currentTour.maTour, "review-hien-thi", editingReview.maReviewHienThi, values);
      } else {
        await adminApi.adminCreateTourChild<TourReviewHienThiItem>(currentTour.maTour, "review-hien-thi", values);
      }
      message.success(editingReview ? "Đã cập nhật review." : "Đã thêm review.");
      setReviewFormVisible(false);
      await refreshChildren();
    } catch {
      message.error("Không lưu được review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (item: TourReviewHienThiItem) => {
    if (!currentTour) return;
    try {
      await adminApi.adminDeleteTourChild(currentTour.maTour, "review-hien-thi", item.maReviewHienThi);
      setReviewList((current) => current.filter((entry) => entry.maReviewHienThi !== item.maReviewHienThi));
      message.success("Đã xoá review.");
    } catch {
      message.error("Xoá review thất bại.");
    }
  };

  const resetForm = () => {
    form.resetFields();
    setEditingItem(null);
  };

  const openCreateModal = () => {
    resetForm();
    form.setFieldsValue({
      maDichVu: dichVuOptions[0]?.maDichVu,
      gia: 1000000,
      giaGoc: 1200000,
      giaKhuyenMai: 1000000,
      soLuong: 20,
      danhGia: 4.5,
      soLuotDanhGia: 0,
      ngayBatDau: dayjs().add(7, "day"),
      isBestSeller: false,
      xacNhanTucThi: true,
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
      giaGoc: item.giaGoc,
      giaKhuyenMai: item.giaKhuyenMai,
      ngayBatDau: dayjs(item.ngayBatDau),
      soLuong: item.soLuong,
      moTa: item.moTa,
      danhGia: item.danhGia,
      soLuotDanhGia: item.soLuotDanhGia,
      diaDiem: item.diaDiem,
      viTriKhoiHanh: item.viTriKhoiHanh,
      highlight: item.highlight,
      chinhSachHuy: item.chinhSachHuy,
      isBestSeller: item.isBestSeller,
      xacNhanTucThi: item.xacNhanTucThi,
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
          <Button size="small" onClick={() => openManageModal(record)}>
            Quản lý
          </Button>
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
      <Space orientation="vertical" size={20} style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <Title level={3} style={{ margin: 0, color: "#182338" }}>
              Quản lý tour
            </Title>
            <Text style={{ color: "#7d869c" }}>
              Quản lý lịch khởi hành, giá bán, số lượng chỗ và đánh giá tour cho trang admin.
            </Text>
          </div>

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
          <Space orientation="vertical" size={16} style={{ width: "100%" }}>
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
                pageSize: 10,
                showSizeChanger: false
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

      <Modal
        title={currentTour ? `Quản lý chi tiết: ${currentTour.ten}` : "Quản lý chi tiết tour"}
        open={manageModalOpen}
        onCancel={() => setManageModalOpen(false)}
        footer={null}
        width={1100}
      >
        <Tabs
          activeKey={activeChildTab}
          onChange={setActiveChildTab}
          items={[
            {
              key: "goi",
              label: "Gói dịch vụ",
              children: (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  {goiFormVisible ? (
                    <Card size="small" title={editingGoi ? "Sửa gói dịch vụ" : "Thêm gói dịch vụ"}>
                      <Form form={goiForm} layout="vertical">
                        <Form.Item name="tenGoi" label="Tên gói" rules={[{ required: true, message: "Nhập tên gói" }]}>
                          <Input />
                        </Form.Item>
                        <Form.Item name="moTaGoi" label="Mô tả">
                          <Input.TextArea rows={2} />
                        </Form.Item>
                        <Form.Item name="giaGoi" label="Giá gói" rules={[{ required: true, message: "Nhập giá" }]}>
                          <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name="giaGoc" label="Giá gốc (tùy chọn)">
                          <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                          <Form.Item name="soKhachToiThieu" label="Số khách tối thiểu" rules={[{ required: true, message: "Bắt buộc" }]}>
                            <InputNumber min={1} style={{ width: "100%" }} />
                          </Form.Item>
                          <Form.Item name="soKhachToiDa" label="Số khách tối đa">
                            <InputNumber min={0} style={{ width: "100%" }} />
                          </Form.Item>
                          <Form.Item name="thuTu" label="Thứ tự" rules={[{ required: true, message: "Bắt buộc" }]}>
                            <InputNumber min={1} style={{ width: "100%" }} />
                          </Form.Item>
                        </div>
                        <Form.Item name="trangThai" label="Trạng thái">
                          <Select options={[{ label: "Bật", value: 1 }, { label: "Tắt", value: 0 }]} />
                        </Form.Item>
                        <Form.Item>
                          <Space>
                            <Button onClick={() => setGoiFormVisible(false)}>Huỷ</Button>
                            <Button type="primary" loading={submittingGoi} onClick={() => void handleSubmitGoi()}>Lưu</Button>
                          </Space>
                        </Form.Item>
                      </Form>
                    </Card>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" size="small" icon={<Plus size={16} />} onClick={openCreateGoi}>Thêm gói</Button>
                      </div>
                      <Table<GoiDichVuItem>
                        rowKey="maGoi"
                        loading={childLoading}
                        dataSource={goiList}
                        pagination={false}
                        size="small"
                        columns={[
                          { title: "Tên gói", dataIndex: "tenGoi" },
                          { title: "Mô tả", dataIndex: "moTaGoi" },
                          { title: "Giá", dataIndex: "giaGoi", render: (value: number) => formatCurrency(Number(value || 0)) },
                          { title: "Khách", render: (_, record) => `${record.soKhachToiThieu || 1}${record.soKhachToiDa ? ` - ${record.soKhachToiDa}` : "+"}` },
                          { title: "Thứ tự", dataIndex: "thuTu" },
                          { title: "Trạng thái", dataIndex: "trangThai", render: (value: number) => <Tag color={value ? "green" : "red"}>{value ? "Bật" : "Tắt"}</Tag> },
                          {
                            title: "Thao tác",
                            render: (_: unknown, record: GoiDichVuItem) => (
                              <Space>
                                <Button size="small" type="text" icon={<PencilLine size={14} color="#2563eb" />} onClick={() => openEditGoi(record)} />
                                <Popconfirm title="Xoá gói?" onConfirm={() => void handleDeleteGoi(record)} okText="Xoá" cancelText="Huỷ">
                                  <Button size="small" type="text" danger icon={<Trash2 size={14} />} />
                                </Popconfirm>
                              </Space>
                            ),
                          },
                        ]}
                      />
                    </>
                  )}
                </Space>
              ),
            },
            {
              key: "muc",
              label: "Mục dịch vụ",
              children: (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" size="small" icon={<Plus size={16} />} onClick={openCreateMuc}>Thêm mục</Button>
                  </div>
                  <Table<TourMucDichVuItem>
                    rowKey="maMuc"
                    loading={childLoading}
                    dataSource={mucList}
                    pagination={false}
                    size="small"
                    columns={[
                      { title: "Loại", dataIndex: "loaiMuc", render: (value: string) => <Tag>{value}</Tag> },
                      { title: "Nội dung", dataIndex: "noiDung" },
                      { title: "Thứ tự", dataIndex: "thuTu" },
                      {
                        title: "Thao tác",
                        render: (_: unknown, record: TourMucDichVuItem) => (
                          <Space>
                            <Button size="small" type="text" icon={<PencilLine size={14} color="#2563eb" />} onClick={() => openEditMuc(record)} />
                            <Popconfirm title="Xoá mục?" onConfirm={() => void handleDeleteMuc(record)} okText="Xoá" cancelText="Huỷ">
                              <Button size="small" type="text" danger icon={<Trash2 size={14} />} />
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                  />
                </Space>
              ),
            },
            {
              key: "lich-trinh",
              label: "Lịch trình",
              children: (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" size="small" icon={<Plus size={16} />} onClick={openCreateLichTrinh}>Thêm lịch trình</Button>
                  </div>
                  <Table<LichTrinhTourItem>
                    rowKey="maLichTrinh"
                    loading={childLoading}
                    dataSource={lichTrinhList}
                    pagination={false}
                    size="small"
                    columns={[
                      { title: "Thời gian", dataIndex: "thoiGian" },
                      { title: "Tiêu đề", dataIndex: "tieuDe" },
                      { title: "Chi tiết", dataIndex: "chiTiet" },
                      { title: "Thứ tự", dataIndex: "thuTu" },
                      {
                        title: "Thao tác",
                        render: (_: unknown, record: LichTrinhTourItem) => (
                          <Space>
                            <Button size="small" type="text" icon={<PencilLine size={14} color="#2563eb" />} onClick={() => openEditLichTrinh(record)} />
                            <Popconfirm title="Xoá lịch trình?" onConfirm={() => void handleDeleteLichTrinh(record)} okText="Xoá" cancelText="Huỷ">
                              <Button size="small" type="text" danger icon={<Trash2 size={14} />} />
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                  />
                </Space>
              ),
            },
            {
              key: "khoi-hanh",
              label: "Lịch khởi hành",
              children: (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" size="small" icon={<Plus size={16} />} onClick={openCreateLichKhoiHanh}>Thêm lịch khởi hành</Button>
                  </div>
                  <Table<TourLichKhoiHanhItem>
                    rowKey="maLichKhoiHanh"
                    loading={childLoading}
                    dataSource={lichKhoiHanhList}
                    pagination={false}
                    size="small"
                    columns={[
                      { title: "Ngày", dataIndex: "ngayKhoiHanh", render: (value: string) => formatDate(value) },
                      { title: "Giờ", dataIndex: "gioKhoiHanh" },
                      { title: "Tối đa", dataIndex: "soChoToiDa" },
                      { title: "Còn lại", dataIndex: "soChoConLai" },
                      { title: "Trạng thái", dataIndex: "trangThai", render: (value: string) => <Tag>{value}</Tag> },
                      {
                        title: "Thao tác",
                        render: (_: unknown, record: TourLichKhoiHanhItem) => (
                          <Space>
                            <Button size="small" type="text" icon={<PencilLine size={14} color="#2563eb" />} onClick={() => openEditLichKhoiHanh(record)} />
                            <Popconfirm title="Xoá lịch khởi hành?" onConfirm={() => void handleDeleteLichKhoiHanh(record)} okText="Xoá" cancelText="Huỷ">
                              <Button size="small" type="text" danger icon={<Trash2 size={14} />} />
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                  />
                </Space>
              ),
            },
            {
              key: "review",
              label: "Review hiển thị",
              children: (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" size="small" icon={<Plus size={16} />} onClick={openCreateReview}>Thêm review</Button>
                  </div>
                  <Table<TourReviewHienThiItem>
                    rowKey="maReviewHienThi"
                    loading={childLoading}
                    dataSource={reviewList}
                    pagination={false}
                    size="small"
                    columns={[
                      { title: "Khách", dataIndex: "tenKhach" },
                      { title: "Sao", dataIndex: "soSao", render: (value: number) => <Tag color="gold">{value}/5</Tag> },
                      { title: "Nội dung", dataIndex: "noiDung" },
                      { title: "Thứ tự", dataIndex: "thuTu" },
                      {
                        title: "Thao tác",
                        render: (_: unknown, record: TourReviewHienThiItem) => (
                          <Space>
                            <Button size="small" type="text" icon={<PencilLine size={14} color="#2563eb" />} onClick={() => openEditReview(record)} />
                            <Popconfirm title="Xoá review?" onConfirm={() => void handleDeleteReview(record)} okText="Xoá" cancelText="Huỷ">
                              <Button size="small" type="text" danger icon={<Trash2 size={14} />} />
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                  />
                </Space>
              ),
            },
          ]}
        />
      </Modal>

      <Modal title={editingMuc ? "Sửa mục dịch vụ" : "Thêm mục dịch vụ"} open={mucFormVisible} onCancel={() => setMucFormVisible(false)} onOk={() => void handleSubmitMuc()} confirmLoading={submittingMuc} okText="Lưu" cancelText="Huỷ">
        <Form form={mucForm} layout="vertical">
          <Form.Item name="loaiMuc" label="Loại" rules={[{ required: true, message: "Chọn loại" }]}><Select options={["BAO_GOM", "KHONG_BAO_GOM", "LUU_Y", "CHINH_SACH"].map((value) => ({ label: value, value }))} /></Form.Item>
          <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true, message: "Nhập nội dung" }]}><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="thuTu" label="Thứ tự" rules={[{ required: true, message: "Nhập thứ tự" }]}><InputNumber min={1} style={{ width: "100%" }} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={editingLichTrinh ? "Sửa lịch trình" : "Thêm lịch trình"} open={lichTrinhFormVisible} onCancel={() => setLichTrinhFormVisible(false)} onOk={() => void handleSubmitLichTrinh()} confirmLoading={submittingLichTrinh} okText="Lưu" cancelText="Huỷ">
        <Form form={lichTrinhForm} layout="vertical">
          <Form.Item name="thoiGian" label="Thời gian" rules={[{ required: true, message: "Nhập thời gian" }]}><Input placeholder="08:00" /></Form.Item>
          <Form.Item name="tieuDe" label="Tiêu đề" rules={[{ required: true, message: "Nhập tiêu đề" }]}><Input /></Form.Item>
          <Form.Item name="chiTiet" label="Chi tiết"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="thuTu" label="Thứ tự" rules={[{ required: true, message: "Nhập thứ tự" }]}><InputNumber min={1} style={{ width: "100%" }} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={editingLichKhoiHanh ? "Sửa lịch khởi hành" : "Thêm lịch khởi hành"} open={lichKhoiHanhFormVisible} onCancel={() => setLichKhoiHanhFormVisible(false)} onOk={() => void handleSubmitLichKhoiHanh()} confirmLoading={submittingLichKhoiHanh} okText="Lưu" cancelText="Huỷ">
        <Form form={lichKhoiHanhForm} layout="vertical">
          <Form.Item name="ngayKhoiHanh" label="Ngày khởi hành" rules={[{ required: true, message: "Chọn ngày" }]}><DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" /></Form.Item>
          <Form.Item name="gioKhoiHanh" label="Giờ khởi hành"><Input placeholder="08:00" /></Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="soChoToiDa" label="Số chỗ tối đa" rules={[{ required: true, message: "Nhập số chỗ" }]}><InputNumber min={1} style={{ width: "100%" }} /></Form.Item>
            <Form.Item name="soChoConLai" label="Số chỗ còn lại" rules={[{ required: true, message: "Nhập số chỗ" }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          </div>
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái" }]}><Select options={["OPEN", "FULL", "CANCELLED", "CLOSED"].map((value) => ({ label: value, value }))} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={editingReview ? "Sửa review" : "Thêm review"} open={reviewFormVisible} onCancel={() => setReviewFormVisible(false)} onOk={() => void handleSubmitReview()} confirmLoading={submittingReview} okText="Lưu" cancelText="Huỷ">
        <Form form={reviewForm} layout="vertical">
          <Form.Item name="tenKhach" label="Tên khách" rules={[{ required: true, message: "Nhập tên khách" }]}><Input /></Form.Item>
          <Form.Item name="avatar" label="Avatar URL"><Input /></Form.Item>
          <Form.Item name="soSao" label="Số sao" rules={[{ required: true, message: "Nhập số sao" }]}><InputNumber min={1} max={5} style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true, message: "Nhập nội dung" }]}><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="thuTu" label="Thứ tự" rules={[{ required: true, message: "Nhập thứ tự" }]}><InputNumber min={1} style={{ width: "100%" }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
