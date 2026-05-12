import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
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
  Tabs,
  Typography,
  message,
} from "antd";
import type { TableProps } from "antd";
import { BedDouble, MapPinned, PencilLine, Plus, RefreshCw, Search, Trash2, Home } from "lucide-react";
import api from "../services/api";
import axios from "axios";
import * as adminApi from "../services/adminService";

const { Title, Text } = Typography;

interface DichVuOption {
  maDichVu: number;
  ten: string;
}

interface HotelItem {
  maKhachSan: number;
  maDichVu: number;
  tenKhachSan: string;
  tenDichVu: string;
  viTri: string;
  moTa: string;
  giaTuKhoang: number;
}

interface RoomItem {
  maLoaiPhong: number;
  maKhachSan: number;
  tenLoaiPhong: string;
  giaPhong: number;
  sucChua: string;
  soLuongPhongTrong: number;
}

interface HotelFormValues {
  maDichVu: number;
  ten: string;
  viTri: string;
}

interface RoomFormValues {
  tenLoaiPhong: string;
  giaPhong: number;
  sucChua: string;
  soLuongPhongTrong: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";
const HOTEL_API_PATH = "/api/admin/khach-san";
const DICH_VU_API_PATH = "/api/admin/dich-vu";

const currencyFormatter = new Intl.NumberFormat("vi-VN");

function formatCurrency(value: number): string {
  return `${currencyFormatter.format(value)} đ`;
}

function normalizeHotel(input: unknown): HotelItem {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    maKhachSan: Number(raw.maKhachSan ?? raw.id ?? 0),
    maDichVu: Number(raw.maDichVu ?? raw.serviceId ?? 0),
    tenKhachSan: String(raw.tenKhachSan ?? raw.ten ?? raw.tenDichVu ?? ""),
    tenDichVu: String(raw.tenDichVu ?? ""),
    viTri: String(raw.viTri ?? raw.location ?? ""),
    moTa: String(raw.moTa ?? raw.description ?? ""),
    giaTuKhoang: Number(raw.giaTuKhoang ?? raw.gia ?? 0),
  };
}

function normalizeRoom(input: unknown): RoomItem {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    maLoaiPhong: Number(raw.maLoaiPhong ?? 0),
    maKhachSan: Number(raw.maKhachSan ?? 0),
    tenLoaiPhong: String(raw.tenLoaiPhong ?? ""),
    giaPhong: Number(raw.giaPhong ?? 0),
    sucChua: String(raw.sucChua ?? "2 người lớn"),
    soLuongPhongTrong: Number(raw.soLuongPhongTrong ?? 0),
  };
}

function normalizeDichVu(input: unknown, index: number): DichVuOption {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    maDichVu: Number(raw.maDichVu ?? raw.id ?? index + 1),
    ten: String(raw.ten ?? raw.name ?? `Dịch vụ ${index + 1}`),
  };
}

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  if (typeof payload !== "object" || payload === null) return [];

  const outer = payload as Record<string, unknown>;
  const data = outer.data;
  if (Array.isArray(data)) return data;

  if (typeof data === "object" && data !== null) {
    const nested = data as Record<string, unknown>;
    if (Array.isArray(nested.data)) return nested.data;
    if (Array.isArray(nested.items)) return nested.items;
  }

  if (Array.isArray(outer.items)) return outer.items;

  return [];
}

function getApiErrorMessage(error: unknown, action: string): string {
  if (!axios.isAxiosError(error)) {
    return `Có lỗi khi ${action}.`;
  }

  const status = error.response?.status;
  const serverMessage = (error.response?.data as { message?: string } | undefined)?.message;

  if (status === 401) {
    return "Phiên đăng nhập đã hết hạn hoặc chưa có token admin. Vui lòng đăng nhập lại bằng tài khoản admin trong database.";
  }
  if (status === 403) {
    return "Tài khoản hiện tại không có quyền ADMIN để truy cập API này.";
  }
  if (status) {
    return serverMessage ? `API trả về lỗi ${status}: ${serverMessage}` : `API trả về lỗi ${status} khi ${action}.`;
  }

  return `Không kết nối được API khi ${action}. Kiểm tra backend ${API_BASE_URL} đã chạy chưa.`;
}

// APIs
async function fetchHotels(): Promise<HotelItem[]> {
  const response = await api.get(HOTEL_API_PATH, { params: { limit: 1000 } });
  return extractArray(response.data).map((hotel) => normalizeHotel(hotel));
}

async function fetchDichVuOptions(): Promise<DichVuOption[]> {
  const response = await api.get(DICH_VU_API_PATH, { params: { limit: 1000 } });
  return extractArray(response.data).map(normalizeDichVu);
}

async function createHotel(item: HotelFormValues): Promise<HotelItem> {
  const response = await api.post<{ status: string; data: unknown }>(HOTEL_API_PATH, item);
  return normalizeHotel(response.data.data);
}

async function updateHotel(id: number, item: HotelFormValues): Promise<void> {
  await api.put(`${HOTEL_API_PATH}/${id}`, item);
}

async function deleteHotel(id: number): Promise<void> {
  await api.delete(`${HOTEL_API_PATH}/${id}`);
}

async function fetchRooms(maKhachSan: number): Promise<RoomItem[]> {
  const response = await api.get(`${HOTEL_API_PATH}/${maKhachSan}/loai-phong`);
  return extractArray(response.data).map(normalizeRoom);
}

async function createRoom(maKhachSan: number, item: RoomFormValues): Promise<RoomItem> {
  const response = await api.post<{ status: string; data: unknown }>(`${HOTEL_API_PATH}/${maKhachSan}/loai-phong`, item);
  return normalizeRoom(response.data.data);
}

async function updateRoom(maKhachSan: number, maLoaiPhong: number, item: RoomFormValues): Promise<void> {
  await api.put(`${HOTEL_API_PATH}/${maKhachSan}/loai-phong/${maLoaiPhong}`, item);
}

async function deleteRoom(maKhachSan: number, maLoaiPhong: number): Promise<void> {
  await api.delete(`${HOTEL_API_PATH}/${maKhachSan}/loai-phong/${maLoaiPhong}`);
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

export default function AdminKhachSan() {
  const [form] = Form.useForm<HotelFormValues>();
  const [data, setData] = useState<HotelItem[]>([]);
  const [dichVuOptions, setDichVuOptions] = useState<DichVuOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HotelItem | null>(null);
  const [searchText, setSearchText] = useState("");

  // Room Management State
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState<HotelItem | null>(null);
  const [roomsData, setRoomsData] = useState<RoomItem[]>([]);
  const [hotelAmenities, setHotelAmenities] = useState<adminApi.TienIchItem[]>([]);
  const [hotelFaq, setHotelFaq] = useState<adminApi.KhachSanFAQItem[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [roomForm] = Form.useForm<RoomFormValues>();
  const [editingRoom, setEditingRoom] = useState<RoomItem | null>(null);
  const [roomFormVisible, setRoomFormVisible] = useState(false);
  const [submittingRoom, setSubmittingRoom] = useState(false);
  const [amenityForm] = Form.useForm<Partial<adminApi.TienIchItem>>();
  const [amenityFormVisible, setAmenityFormVisible] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<adminApi.TienIchItem | null>(null);
  const [submittingAmenity, setSubmittingAmenity] = useState(false);
  const [faqForm] = Form.useForm<Partial<adminApi.KhachSanFAQItem>>();
  const [faqFormVisible, setFaqFormVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState<adminApi.KhachSanFAQItem | null>(null);
  const [submittingFaq, setSubmittingFaq] = useState(false);

  const loadHotels = async () => {
    setLoading(true);

    try {
      const [hotels, services] = await Promise.all([
        fetchHotels(),
        fetchDichVuOptions().catch(() => []),
      ]);
      setDichVuOptions(services);
      setData(hotels);
    } catch (error) {
      message.warning(getApiErrorMessage(error, "lấy danh sách khách sạn"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHotels();
  }, []);

  const dichVuMap = useMemo(
    () => new Map(dichVuOptions.map((item) => [item.maDichVu, item.ten])),
    [dichVuOptions],
  );

  const filteredData = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    return data.filter((item) => {
      const serviceName = dichVuMap.get(item.maDichVu)?.toLowerCase() ?? "";
      return (
        keyword.length === 0 ||
        String(item.maKhachSan).includes(keyword) ||
        item.tenKhachSan.toLowerCase().includes(keyword) ||
        item.tenDichVu.toLowerCase().includes(keyword) ||
        item.viTri.toLowerCase().includes(keyword) ||
        serviceName.includes(keyword)
      );
    });
  }, [data, dichVuMap, searchText]);

  const stats = useMemo(() => {
    return {
      total: data.length,
      available: data.filter((h) => h.giaTuKhoang > 0).length,
      limited: 0,
      full: data.filter((h) => h.giaTuKhoang === 0).length,
    };
  }, [data]);

  // HOTEL ACTIONS
  const openCreateModal = () => {
    form.resetFields();
    setEditingItem(null);
    if (dichVuOptions.length > 0) {
      form.setFieldsValue({ maDichVu: dichVuOptions[0].maDichVu });
    }
    setModalOpen(true);
  };

  const openEditModal = (item: HotelItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      maDichVu: item.maDichVu,
      ten: item.tenKhachSan,
      viTri: item.viTri,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item: HotelItem) => {
    try {
      await deleteHotel(item.maKhachSan);
      setData((current) => current.filter((entry) => entry.maKhachSan !== item.maKhachSan));
      message.success(`Đã xoá khách sạn ${item.tenKhachSan}.`);
    } catch {
      message.error("Xoá không thành công.");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (editingItem) {
        await updateHotel(editingItem.maKhachSan, values);
        message.success("Cập nhật khách sạn thành công.");
        void loadHotels();
      } else {
        await createHotel(values);
        message.success("Thêm khách sạn thành công.");
        void loadHotels();
      }

      setModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error("Không lưu được dữ liệu lên API.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ROOM ACTIONS
  const handleManageRooms = async (hotel: HotelItem) => {
    setSelectedHotelForRooms(hotel);
    setRoomModalOpen(true);
    setRoomFormVisible(false);
    setLoadingRooms(true);

    try {
      const [rooms, amenities, faq] = await Promise.all([
        fetchRooms(hotel.maKhachSan),
        adminApi.adminGetKhachSanTienIch(hotel.maKhachSan),
        adminApi.adminGetKhachSanFAQ(hotel.maKhachSan),
      ]);
      setRoomsData(rooms);
      setHotelAmenities(amenities);
      setHotelFaq(faq);
    } catch {
      message.error("Không tải được dữ liệu quản lý khách sạn.");
      setRoomsData([]);
      setHotelAmenities([]);
      setHotelFaq([]);
    } finally {
      setLoadingRooms(false);
    }
  };

  const openCreateRoom = () => {
    setEditingRoom(null);
    roomForm.resetFields();
    roomForm.setFieldsValue({
      giaPhong: 1000000,
      soLuongPhongTrong: 5,
      sucChua: "2 người lớn"
    });
    setRoomFormVisible(true);
  };

  const openEditRoom = (room: RoomItem) => {
    setEditingRoom(room);
    roomForm.setFieldsValue({
      tenLoaiPhong: room.tenLoaiPhong,
      giaPhong: room.giaPhong,
      sucChua: room.sucChua,
      soLuongPhongTrong: room.soLuongPhongTrong,
    });
    setRoomFormVisible(true);
  };

  const handleDeleteRoom = async (room: RoomItem) => {
    if (!selectedHotelForRooms) return;

    try {
      await deleteRoom(selectedHotelForRooms.maKhachSan, room.maLoaiPhong);
      setRoomsData((curr) => curr.filter((r) => r.maLoaiPhong !== room.maLoaiPhong));
      message.success("Đã xoá loại phòng.");
    } catch {
      message.error("Xoá loại phòng thất bại.");
    }
  };

  const handleSubmitRoom = async () => {
    if (!selectedHotelForRooms) return;

    try {
      const values = await roomForm.validateFields();
      setSubmittingRoom(true);

      if (editingRoom) {
        await updateRoom(selectedHotelForRooms.maKhachSan, editingRoom.maLoaiPhong, values);
        message.success("Cập nhật loại phòng thành công.");
      } else {
        await createRoom(selectedHotelForRooms.maKhachSan, values);
        message.success("Thêm loại phòng thành công.");
      }
      
      const rooms = await fetchRooms(selectedHotelForRooms.maKhachSan);
      setRoomsData(rooms);
      setRoomFormVisible(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error("Không lưu được dữ liệu lên API.");
      }
    } finally {
      setSubmittingRoom(false);
    }
  };

  const openCreateAmenity = () => {
    setEditingAmenity(null);
    amenityForm.setFieldsValue({ tenTienIch: "", icon: "", loaiTienIch: "KHACH_SAN", trangThai: 1 });
    setAmenityFormVisible(true);
  };

  const openEditAmenity = (item: adminApi.TienIchItem) => {
    setEditingAmenity(item);
    amenityForm.setFieldsValue(item);
    setAmenityFormVisible(true);
  };

  const handleSubmitAmenity = async () => {
    if (!selectedHotelForRooms) return;
    const values = await amenityForm.validateFields();
    setSubmittingAmenity(true);
    try {
      if (editingAmenity) {
        await adminApi.adminUpdateTienIch(editingAmenity.maTienIch, values);
      } else {
        const response = await adminApi.adminCreateTienIch({ ...values, loaiTienIch: "KHACH_SAN" });
        const newId = Number(response?.data?.maTienIch ?? response?.maTienIch ?? 0);
        if (newId > 0) {
          await adminApi.adminUpdateKhachSanTienIch(selectedHotelForRooms.maKhachSan, [...hotelAmenities.map((item) => item.maTienIch), newId]);
        }
      }
      setHotelAmenities(await adminApi.adminGetKhachSanTienIch(selectedHotelForRooms.maKhachSan));
      setAmenityFormVisible(false);
      message.success(editingAmenity ? "Đã cập nhật tiện ích." : "Đã thêm tiện ích.");
    } catch {
      message.error("Không lưu được tiện ích.");
    } finally {
      setSubmittingAmenity(false);
    }
  };

  const handleDeleteAmenity = async (item: adminApi.TienIchItem) => {
    if (!selectedHotelForRooms) return;
    try {
      await adminApi.adminDeleteTienIch(item.maTienIch);
      setHotelAmenities((current) => current.filter((entry) => entry.maTienIch !== item.maTienIch));
      message.success("Đã xoá tiện ích.");
    } catch {
      message.error("Xoá tiện ích thất bại.");
    }
  };

  const openCreateFaq = () => {
    setEditingFaq(null);
    faqForm.setFieldsValue({ cauHoi: "", cauTraLoi: "", thuTu: hotelFaq.length + 1 });
    setFaqFormVisible(true);
  };

  const openEditFaq = (item: adminApi.KhachSanFAQItem) => {
    setEditingFaq(item);
    faqForm.setFieldsValue(item);
    setFaqFormVisible(true);
  };

  const handleSubmitFaq = async () => {
    if (!selectedHotelForRooms) return;
    const values = await faqForm.validateFields();
    setSubmittingFaq(true);
    try {
      if (editingFaq) {
        await adminApi.adminUpdateKhachSanFAQ(selectedHotelForRooms.maKhachSan, editingFaq.maFAQ, values);
      } else {
        await adminApi.adminCreateKhachSanFAQ(selectedHotelForRooms.maKhachSan, values);
      }
      setHotelFaq(await adminApi.adminGetKhachSanFAQ(selectedHotelForRooms.maKhachSan));
      setFaqFormVisible(false);
      message.success(editingFaq ? "Đã cập nhật FAQ." : "Đã thêm FAQ.");
    } catch {
      message.error("Không lưu được FAQ.");
    } finally {
      setSubmittingFaq(false);
    }
  };

  const handleDeleteFaq = async (item: adminApi.KhachSanFAQItem) => {
    if (!selectedHotelForRooms) return;
    try {
      await adminApi.adminDeleteKhachSanFAQ(selectedHotelForRooms.maKhachSan, item.maFAQ);
      setHotelFaq((current) => current.filter((entry) => entry.maFAQ !== item.maFAQ));
      message.success("Đã xoá FAQ.");
    } catch {
      message.error("Xoá FAQ thất bại.");
    }
  };

  // COLUMNS
  const columns: TableProps<HotelItem>["columns"] = [
    {
      title: "Khách sạn",
      key: "khachsan",
      render: (_value, record) => (
        <div>
          <div style={{ fontWeight: 700, color: "#1f2a44" }}>{record.tenKhachSan}</div>
          <Text style={{ color: "#7d869c", fontSize: 13 }}>Mã KS: {record.maKhachSan}</Text>
        </div>
      ),
    },
    {
      title: "Dịch vụ",
      key: "dichvu",
      render: (_value, record) => {
        const tenDV = record.tenDichVu || dichVuMap.get(record.maDichVu) || `Dịch vụ #${record.maDichVu}`;
        return (
          <div>
            <div style={{ fontWeight: 700, color: "#1f2a44" }}>{tenDV}</div>
            <Text style={{ color: "#7d869c", fontSize: 13 }}>Mã DV: {record.maDichVu}</Text>
          </div>
        );
      },
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
      title: "Giá từ khoảng",
      key: "gia",
      render: (_value, record) => (
        <Text strong color="#16a34a">
          {record.giaTuKhoang > 0 ? formatCurrency(record.giaTuKhoang) : "Chưa có phòng"}
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_value, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            ghost 
            icon={<Home size={16} />} 
            onClick={() => void handleManageRooms(record)}
          >
            Quản lý phòng
          </Button>
          <Button type="text" icon={<PencilLine size={16} color="#7c3aed" />} onClick={() => openEditModal(record)} />
          <Popconfirm title="Xoá khách sạn?" description={`Bạn có chắc muốn xoá khách sạn này?`} okText="Xoá" cancelText="Huỷ" onConfirm={() => void handleDelete(record)}>
            <Button type="text" danger icon={<Trash2 size={16} color="#ef4444" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const roomColumns: TableProps<RoomItem>["columns"] = [
    { title: "Tên loại phòng", dataIndex: "tenLoaiPhong", key: "tenLoaiPhong", render: (val: string) => <Text strong>{val}</Text> },
    { title: "Sức chứa", dataIndex: "sucChua", key: "sucChua" },
    { title: "Giá phòng", dataIndex: "giaPhong", key: "giaPhong", render: (val: number) => <Text style={{ color: "#7c3aed" }}>{formatCurrency(val)}</Text> },
    { title: "Phòng trống", dataIndex: "soLuongPhongTrong", key: "soLuongPhongTrong", render: (val: number) => <Tag color={val > 0 ? "green" : "red"}>{val} phòng</Tag> },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_: unknown, record: RoomItem) => (
        <Space>
          <Button type="text" icon={<PencilLine size={16} color="#2563eb" />} onClick={() => openEditRoom(record)} />
          <Popconfirm title="Xoá phòng này?" okText="Xoá" cancelText="Huỷ" onConfirm={() => void handleDeleteRoom(record)}>
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={pageContainerStyle}>
      <Space orientation="vertical" size={20} style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <Title level={3} style={{ margin: 0, color: "#182338" }}>Quản lý khách sạn</Title>
            <Text style={{ color: "#7d869c" }}>
              Quản lý danh sách khách sạn và các loại phòng, giá phòng.
            </Text>
          </div>

          <Space wrap>
            <Tag color="green" style={{ padding: "6px 10px" }}>
              {`API: ${API_BASE_URL}/api/admin/khach-san`}
            </Tag>
            <Button icon={<RefreshCw size={16} />} onClick={() => void loadHotels()}>Tải lại</Button>
          </Space>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <Card style={statCardStyle}><Space align="start"><Badge color="#7c3aed" /><div><Text style={{ color: "#7d869c" }}>Tổng khách sạn</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.total}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#16a34a" /><div><Text style={{ color: "#7d869c" }}>Có phòng</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.available}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#eab308" /><div><Text style={{ color: "#7d869c" }}>Sắp hết phòng</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.limited}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#ef4444" /><div><Text style={{ color: "#7d869c" }}>Chưa có phòng</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.full}</Title></div></Space></Card>
        </div>

        <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
          <Space orientation="vertical" size={16} style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <Title level={4} style={{ margin: 0, color: "#1f2a44" }}>Danh sách khách sạn</Title>
                <Text style={{ color: "#7d869c" }}>Có {filteredData.length} khách sạn đang hiển thị.</Text>
              </div>

              <Space wrap>
                <Input
                  allowClear
                  prefix={<Search size={16} color="#94a3b8" />}
                  placeholder="Tìm tên, vị trí..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  style={{ width: 260 }}
                />
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)", borderColor: "#7c3aed" }}
                  onClick={openCreateModal}
                >
                  Thêm khách sạn
                </Button>
              </Space>
            </div>

            <Table<HotelItem>
              rowKey="maKhachSan"
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              pagination={{
                pageSize: 8,
                showSizeChanger: false,
              }}
              scroll={{ x: 1000 }}
            />
          </Space>
        </Card>
      </Space>

      {/* Modal Quản lý Khách sạn */}
      <Modal
        title={editingItem ? "Sửa thông tin Khách sạn" : "Thêm Khách sạn mới"}
        open={modalOpen}
        onOk={() => void handleSubmit()}
        onCancel={() => setModalOpen(false)}
        okText={editingItem ? "Lưu thay đổi" : "Tạo mới"}
        cancelText="Huỷ"
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form<HotelFormValues> form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Dịch vụ" name="maDichVu" rules={[{ required: true, message: "Chọn dịch vụ." }]}>
            <Select 
              showSearch 
              filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
              options={dichVuOptions.map((item) => ({ label: `${item.ten} (#${item.maDichVu})`, value: item.maDichVu }))} 
            />
          </Form.Item>
          <Form.Item label="Tên khách sạn" name="ten" rules={[{ required: true, message: "Nhập tên khách sạn." }]}><Input placeholder="VD: Khách sạn Mường Thanh" /></Form.Item>
          <Form.Item label="Vị trí (Địa chỉ)" name="viTri" rules={[{ required: true, message: "Nhập vị trí." }]}><Input placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM" /></Form.Item>
        </Form>
      </Modal>

      {/* Modal Quản lý Phòng */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BedDouble size={20} color="#7c3aed" />
            <span>Quản lý phòng - {selectedHotelForRooms?.tenKhachSan}</span>
          </div>
        }
        open={roomModalOpen}
        onCancel={() => setRoomModalOpen(false)}
        width={800}
        footer={null}
        destroyOnClose
      >
        <Tabs
          items={[
            {
              key: "rooms",
              label: "Loại phòng",
              children: !roomFormVisible ? (
                <Space orientation="vertical" size={16} style={{ width: "100%", marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" icon={<Plus size={16} />} onClick={openCreateRoom}>Thêm loại phòng</Button>
                  </div>
                  <Table<RoomItem>
                    rowKey="maLoaiPhong"
                    columns={roomColumns}
                    dataSource={roomsData}
                    loading={loadingRooms}
                    pagination={false}
                    bordered
                  />
                </Space>
              ) : (
                <div style={{ marginTop: 16 }}>
                  <Title level={5} style={{ marginBottom: 16 }}>{editingRoom ? "Sửa loại phòng" : "Thêm loại phòng mới"}</Title>
                  <Form<RoomFormValues> form={roomForm} layout="vertical">
                    <Form.Item label="Tên loại phòng" name="tenLoaiPhong" rules={[{ required: true, message: "Nhập tên loại phòng." }]}><Input placeholder="VD: Standard, Deluxe" /></Form.Item>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                      <Form.Item label="Giá phòng (VNĐ)" name="giaPhong" rules={[{ required: true, message: "Nhập giá phòng." }]}><InputNumber min={0} style={{ width: "100%" }} formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} /></Form.Item>
                      <Form.Item label="Sức chứa" name="sucChua" rules={[{ required: true, message: "Nhập sức chứa." }]}><Input placeholder="VD: 2 người lớn, 1 trẻ em" /></Form.Item>
                      <Form.Item label="Số lượng phòng trống" name="soLuongPhongTrong" rules={[{ required: true, message: "Nhập số lượng phòng trống." }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
                    </div>
                    <Space style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                      <Button onClick={() => setRoomFormVisible(false)}>Huỷ</Button>
                      <Button type="primary" loading={submittingRoom} onClick={() => void handleSubmitRoom()}>Lưu phòng</Button>
                    </Space>
                  </Form>
                </div>
              ),
            },
            {
              key: "amenities",
              label: "Tiện ích khách sạn",
              children: amenityFormVisible ? (
                <div style={{ marginTop: 16 }}>
                  <Title level={5}>{editingAmenity ? "Sửa tiện ích" : "Thêm tiện ích"}</Title>
                  <Form form={amenityForm} layout="vertical">
                    <Form.Item label="Tên tiện ích" name="tenTienIch" rules={[{ required: true, message: "Nhập tên tiện ích." }]}><Input /></Form.Item>
                    <Form.Item label="Icon" name="icon"><Input /></Form.Item>
                    <Form.Item label="Trạng thái" name="trangThai"><Select options={[{ label: "Bật", value: 1 }, { label: "Tắt", value: 0 }]} /></Form.Item>
                    <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button onClick={() => setAmenityFormVisible(false)}>Huỷ</Button>
                      <Button type="primary" loading={submittingAmenity} onClick={() => void handleSubmitAmenity()}>Lưu tiện ích</Button>
                    </Space>
                  </Form>
                </div>
              ) : (
                <Space orientation="vertical" size={16} style={{ width: "100%", marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" icon={<Plus size={16} />} onClick={openCreateAmenity}>Thêm tiện ích</Button>
                  </div>
                  <Table<adminApi.TienIchItem>
                    rowKey="maTienIch"
                    dataSource={hotelAmenities}
                    loading={loadingRooms}
                    pagination={false}
                    columns={[
                      { title: "Tên tiện ích", dataIndex: "tenTienIch" },
                      { title: "Icon", dataIndex: "icon" },
                      { title: "Loại", dataIndex: "loaiTienIch", render: (value: string) => <Tag>{value}</Tag> },
                      {
                        title: "Thao tác",
                        align: "center",
                        render: (_: unknown, record: adminApi.TienIchItem) => (
                          <Space>
                            <Button type="text" icon={<PencilLine size={16} color="#2563eb" />} onClick={() => openEditAmenity(record)} />
                            <Popconfirm title="Xoá tiện ích?" okText="Xoá" cancelText="Huỷ" onConfirm={() => void handleDeleteAmenity(record)}>
                              <Button type="text" danger icon={<Trash2 size={16} />} />
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
              key: "faq",
              label: "FAQ",
              children: faqFormVisible ? (
                <div style={{ marginTop: 16 }}>
                  <Title level={5}>{editingFaq ? "Sửa FAQ" : "Thêm FAQ"}</Title>
                  <Form form={faqForm} layout="vertical">
                    <Form.Item label="Câu hỏi" name="cauHoi" rules={[{ required: true, message: "Nhập câu hỏi." }]}><Input.TextArea rows={2} /></Form.Item>
                    <Form.Item label="Câu trả lời" name="cauTraLoi" rules={[{ required: true, message: "Nhập câu trả lời." }]}><Input.TextArea rows={3} /></Form.Item>
                    <Form.Item label="Thứ tự" name="thuTu" rules={[{ required: true, message: "Nhập thứ tự." }]}><InputNumber min={1} style={{ width: "100%" }} /></Form.Item>
                    <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button onClick={() => setFaqFormVisible(false)}>Huỷ</Button>
                      <Button type="primary" loading={submittingFaq} onClick={() => void handleSubmitFaq()}>Lưu</Button>
                    </Space>
                  </Form>
                </div>
              ) : (
                <Space orientation="vertical" size={16} style={{ width: "100%", marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" icon={<Plus size={16} />} onClick={openCreateFaq}>Thêm FAQ</Button>
                  </div>
                  <Table<adminApi.KhachSanFAQItem>
                    rowKey="maFAQ"
                    dataSource={hotelFaq}
                    loading={loadingRooms}
                    pagination={false}
                    columns={[
                      { title: "Câu hỏi", dataIndex: "cauHoi" },
                      { title: "Câu trả lời", dataIndex: "cauTraLoi" },
                      { title: "Thứ tự", dataIndex: "thuTu" },
                      {
                        title: "Thao tác",
                        align: "center",
                        render: (_: unknown, record: adminApi.KhachSanFAQItem) => (
                          <Space>
                            <Button type="text" icon={<PencilLine size={16} color="#2563eb" />} onClick={() => openEditFaq(record)} />
                            <Popconfirm title="Xoá FAQ?" okText="Xoá" cancelText="Huỷ" onConfirm={() => void handleDeleteFaq(record)}>
                              <Button type="text" danger icon={<Trash2 size={16} />} />
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
    </div>
  );
}
