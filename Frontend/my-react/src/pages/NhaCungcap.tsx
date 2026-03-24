// import { useEffect, useMemo, useState } from "react";
// import type { CSSProperties } from "react";
// import axios from "axios";
// import {
//   Badge,
//   Button,
//   Card,
//   Form,
//   Input,
//   Modal,
//   Popconfirm,
//   Select,
//   Space,
//   Table,
//   Tag,
//   Typography,
//   message,
// } from "antd";
// import type { TableProps } from "antd";
// import { PencilLine, Plus, RefreshCw, Search, Trash2 } from "lucide-react";

// const { Title, Text } = Typography;

// type SupplierStatus = "active" | "inactive";

// interface SupplierItem {
//   maNhaCungCap: number;
//   ten: string;
//   email: string;
//   soDienThoai: string;
//   diaChi: string;
//   loai: string;
//   trangThai: SupplierStatus;
// }

// interface SupplierFormValues {
//   ten: string;
//   email: string;
//   soDienThoai: string;
//   diaChi: string;
//   loai: string;
//   trangThai: SupplierStatus;
// }

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
// const SUPPLIER_API_PATH = import.meta.env.VITE_NHA_CUNG_CAP_API_PATH ?? "/api/nha-cung-cap";

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
// });

// const mockSuppliers: SupplierItem[] = [
//   { maNhaCungCap: 1, ten: "Công ty Vé Việt", email: "contact@veviet.vn", soDienThoai: "0901234567", diaChi: "Quận 1, TP.HCM", loai: "Vé máy bay", trangThai: "active" },
//   { maNhaCungCap: 2, ten: "Travel Hub", email: "sales@travelhub.vn", soDienThoai: "0912345678", diaChi: "Hà Nội", loai: "Tour", trangThai: "active" },
//   { maNhaCungCap: 3, ten: "Resort Booking", email: "hello@resortbooking.vn", soDienThoai: "0987654321", diaChi: "Đà Nẵng", loai: "Khách sạn", trangThai: "inactive" },
// ];

// function normalizeStatus(value: unknown): SupplierStatus {
//   const status = String(value ?? "").toLowerCase();
//   return status.includes("inactive") || status.includes("ngung") ? "inactive" : "active";
// }

// function normalizeSupplier(input: unknown, index: number): SupplierItem {
//   const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
//   return {
//     maNhaCungCap: Number(raw.maNhaCungCap ?? raw.id ?? index + 1),
//     ten: String(raw.ten ?? raw.name ?? `Nhà cung cấp ${index + 1}`),
//     email: String(raw.email ?? ""),
//     soDienThoai: String(raw.soDienThoai ?? raw.phone ?? ""),
//     diaChi: String(raw.diaChi ?? raw.address ?? ""),
//     loai: String(raw.loai ?? raw.type ?? "Khác"),
//     trangThai: normalizeStatus(raw.trangThai ?? raw.status),
//   };
// }

// function extractArray(payload: unknown): unknown[] {
//   if (Array.isArray(payload)) return payload;
//   if (typeof payload === "object" && payload !== null) {
//     const data = payload as { data?: unknown; items?: unknown };
//     if (Array.isArray(data.data)) return data.data;
//     if (Array.isArray(data.items)) return data.items;
//   }
//   return [];
// }

// async function fetchSuppliers(): Promise<SupplierItem[]> {
//   const response = await apiClient.get(SUPPLIER_API_PATH);
//   return extractArray(response.data).map(normalizeSupplier);
// }

// async function createSupplier(item: SupplierItem): Promise<SupplierItem> {
//   const response = await apiClient.post(SUPPLIER_API_PATH, item);
//   return normalizeSupplier(response.data, 0);
// }

// async function updateSupplier(item: SupplierItem): Promise<SupplierItem> {
//   const response = await apiClient.put(`${SUPPLIER_API_PATH}/${item.maNhaCungCap}`, item);
//   return normalizeSupplier(response.data, 0);
// }

// async function deleteSupplier(id: number): Promise<void> {
//   await apiClient.delete(`${SUPPLIER_API_PATH}/${id}`);
// }

// function getStatusMeta(status: SupplierStatus): { label: string; color: string } {
//   return status === "active" ? { label: "Đang hoạt động", color: "green" } : { label: "Ngừng hoạt động", color: "red" };
// }

// const pageContainerStyle: CSSProperties = { padding: 24, background: "linear-gradient(180deg, #f7f8fc 0%, #f2f4f8 100%)", minHeight: "100%" };
// const cardStyle: CSSProperties = { borderRadius: 20, border: "1px solid #eceef5", boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)" };
// const statCardStyle: CSSProperties = { ...cardStyle, height: "100%", background: "#ffffff" };

// export default function NhaCungCap() {
//   const [form] = Form.useForm<SupplierFormValues>();
//   const [data, setData] = useState<SupplierItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<SupplierItem | null>(null);
//   const [searchText, setSearchText] = useState("");
//   const [filterStatus, setFilterStatus] = useState<SupplierStatus | "all">("all");
//   const [filterType, setFilterType] = useState<string>("all");
//   const [isUsingMockData, setIsUsingMockData] = useState(false);

//   const loadSuppliers = async () => {
//     setLoading(true);
//     try {
//       const items = await fetchSuppliers();
//       setData(items.length > 0 ? items : mockSuppliers);
//       setIsUsingMockData(items.length === 0);
//       if (items.length === 0) message.info("API chưa trả dữ liệu nhà cung cấp, đang hiển thị dữ liệu mẫu.");
//     } catch (error) {
//       setData(mockSuppliers);
//       setIsUsingMockData(true);
//       if (axios.isAxiosError(error)) {
//         message.warning(`Không kết nối được API ${API_BASE_URL}${SUPPLIER_API_PATH}. Đang dùng dữ liệu mẫu.`);
//       } else {
//         message.warning("Có lỗi khi tải dữ liệu nhà cung cấp. Đang dùng dữ liệu mẫu.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     void loadSuppliers();
//   }, []);

//   const typeOptions = useMemo(() => ["all", ...Array.from(new Set(data.map((item) => item.loai)))], [data]);

//   const filteredData = useMemo(() => {
//     const keyword = searchText.trim().toLowerCase();
//     return data.filter((item) => {
//       const matchesSearch =
//         keyword.length === 0 ||
//         String(item.maNhaCungCap).includes(keyword) ||
//         item.ten.toLowerCase().includes(keyword) ||
//         item.email.toLowerCase().includes(keyword) ||
//         item.soDienThoai.toLowerCase().includes(keyword);
//       const matchesStatus = filterStatus === "all" || item.trangThai === filterStatus;
//       const matchesType = filterType === "all" || item.loai === filterType;
//       return matchesSearch && matchesStatus && matchesType;
//     });
//   }, [data, filterStatus, filterType, searchText]);

//   const stats = useMemo(() => {
//     const active = data.filter((item) => item.trangThai === "active").length;
//     const inactive = data.filter((item) => item.trangThai === "inactive").length;
//     return { total: data.length, active, inactive, categories: new Set(data.map((item) => item.loai)).size };
//   }, [data]);

//   const resetForm = () => {
//     form.resetFields();
//     setEditingItem(null);
//   };

//   const openCreateModal = () => {
//     resetForm();
//     form.setFieldsValue({ loai: "Tour", trangThai: "active" });
//     setModalOpen(true);
//   };

//   const openEditModal = (item: SupplierItem) => {
//     setEditingItem(item);
//     form.setFieldsValue({ ten: item.ten, email: item.email, soDienThoai: item.soDienThoai, diaChi: item.diaChi, loai: item.loai, trangThai: item.trangThai });
//     setModalOpen(true);
//   };

//   const handleDelete = async (item: SupplierItem) => {
//     const previous = data;
//     setData((current) => current.filter((entry) => entry.maNhaCungCap !== item.maNhaCungCap));
//     if (isUsingMockData) {
//       message.success(`Đã xoá ${item.ten} trên dữ liệu mẫu.`);
//       return;
//     }
//     try {
//       await deleteSupplier(item.maNhaCungCap);
//       message.success(`Đã xoá ${item.ten}.`);
//     } catch {
//       setData(previous);
//       message.error("Xoá không thành công, dữ liệu đã được hoàn lại.");
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();
//       setSubmitting(true);
//       const payload: SupplierItem = {
//         maNhaCungCap: editingItem?.maNhaCungCap ?? Date.now(),
//         ten: values.ten.trim(),
//         email: values.email.trim(),
//         soDienThoai: values.soDienThoai.trim(),
//         diaChi: values.diaChi.trim(),
//         loai: values.loai,
//         trangThai: values.trangThai,
//       };
//       if (isUsingMockData) {
//         setData((current) => editingItem ? current.map((item) => (item.maNhaCungCap === editingItem.maNhaCungCap ? payload : item)) : [payload, ...current]);
//         message.success(editingItem ? "Đã cập nhật nhà cung cấp trên dữ liệu mẫu." : "Đã thêm nhà cung cấp trên dữ liệu mẫu.");
//         setModalOpen(false);
//         resetForm();
//         return;
//       }
//       if (editingItem) {
//         const updated = await updateSupplier(payload);
//         setData((current) => current.map((item) => (item.maNhaCungCap === editingItem.maNhaCungCap ? updated : item)));
//         message.success("Cập nhật nhà cung cấp thành công.");
//       } else {
//         const created = await createSupplier(payload);
//         setData((current) => [created, ...current]);
//         message.success("Thêm nhà cung cấp thành công.");
//       }
//       setModalOpen(false);
//       resetForm();
//     } catch (error) {
//       if (!axios.isAxiosError(error) && !(error instanceof Error)) return;
//       if (axios.isAxiosError(error)) {
//         message.error("Không lưu được dữ liệu lên API. Kiểm tra endpoint hoặc backend rồi thử lại.");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const columns: TableProps<SupplierItem>["columns"] = [
//     { title: "Nhà cung cấp", key: "ten", render: (_value, record) => <div><div style={{ fontWeight: 700, color: "#1f2a44" }}>{record.ten}</div><Text style={{ color: "#7d869c", fontSize: 13 }}>Mã NCC: {record.maNhaCungCap}</Text></div> },
//     { title: "Liên hệ", key: "contact", render: (_value, record) => <div><div style={{ color: "#55607a", fontSize: 13 }}>{record.email}</div><div style={{ color: "#55607a", fontSize: 13 }}>{record.soDienThoai}</div></div> },
//     { title: "Địa chỉ", dataIndex: "diaChi", key: "diaChi" },
//     { title: "Loại", dataIndex: "loai", key: "loai", render: (value: string) => <Tag color="blue">{value}</Tag> },
//     { title: "Trạng thái", dataIndex: "trangThai", key: "trangThai", render: (status: SupplierStatus) => { const meta = getStatusMeta(status); return <Tag color={meta.color}>{meta.label}</Tag>; } },
//     {
//       title: "Thao tác",
//       key: "actions",
//       align: "center",
//       render: (_value, record) => (
//         <Space size="middle">
//           <Button type="text" icon={<PencilLine size={16} color="#7c3aed" />} onClick={() => openEditModal(record)} />
//           <Popconfirm title="Xoá nhà cung cấp?" description={`Bạn có chắc muốn xoá ${record.ten}?`} okText="Xoá" cancelText="Huỷ" onConfirm={() => void handleDelete(record)}>
//             <Button type="text" danger icon={<Trash2 size={16} color="#ef4444" />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div style={pageContainerStyle}>
//       <Space direction="vertical" size={20} style={{ width: "100%" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
//           <div>
//             <Title level={3} style={{ margin: 0, color: "#182338" }}>Quản lý nhà cung cấp</Title>
//             <Text style={{ color: "#7d869c" }}>Theo dõi danh sách nhà cung cấp dịch vụ, trạng thái hợp tác và thông tin liên hệ.</Text>
//           </div>
//           <Space wrap>
//             <Tag color={isUsingMockData ? "gold" : "green"} style={{ padding: "6px 10px" }}>{isUsingMockData ? "Đang hiển thị dữ liệu mẫu" : `API: ${API_BASE_URL}${SUPPLIER_API_PATH}`}</Tag>
//             <Button icon={<RefreshCw size={16} />} onClick={() => void loadSuppliers()}>Tải lại</Button>
//           </Space>
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
//           <Card style={statCardStyle}><Space align="start"><Badge color="#7c3aed" /><div><Text style={{ color: "#7d869c" }}>Tổng NCC</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.total}</Title></div></Space></Card>
//           <Card style={statCardStyle}><Space align="start"><Badge color="#16a34a" /><div><Text style={{ color: "#7d869c" }}>Đang hoạt động</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.active}</Title></div></Space></Card>
//           <Card style={statCardStyle}><Space align="start"><Badge color="#ef4444" /><div><Text style={{ color: "#7d869c" }}>Ngừng hoạt động</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.inactive}</Title></div></Space></Card>
//           <Card style={statCardStyle}><Space align="start"><Badge color="#2563eb" /><div><Text style={{ color: "#7d869c" }}>Loại dịch vụ</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.categories}</Title></div></Space></Card>
//         </div>

//         <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
//           <Space direction="vertical" size={16} style={{ width: "100%" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
//               <div>
//                 <Title level={4} style={{ margin: 0, color: "#1f2a44" }}>Danh sách nhà cung cấp</Title>
//                 <Text style={{ color: "#7d869c" }}>Có {filteredData.length} nhà cung cấp đang hiển thị trong bảng.</Text>
//               </div>
//               <Space wrap>
//                 <Input allowClear prefix={<Search size={16} color="#94a3b8" />} placeholder="Tìm tên, email, số điện thoại..." value={searchText} onChange={(event) => setSearchText(event.target.value)} style={{ width: 260 }} />
//                 <Select value={filterType} style={{ width: 160 }} onChange={(value) => setFilterType(value)} options={typeOptions.map((item) => ({ label: item === "all" ? "Tất cả loại" : item, value: item }))} />
//                 <Select value={filterStatus} style={{ width: 170 }} onChange={(value) => setFilterStatus(value)} options={[{ label: "Tất cả trạng thái", value: "all" }, { label: "Đang hoạt động", value: "active" }, { label: "Ngừng hoạt động", value: "inactive" }]} />
//                 <Button type="primary" icon={<Plus size={16} />} style={{ background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)", borderColor: "#7c3aed" }} onClick={openCreateModal}>Thêm mới</Button>
//               </Space>
//             </div>
//             <Table<SupplierItem> rowKey="maNhaCungCap" columns={columns} dataSource={filteredData} loading={loading} pagination={{ pageSize: 6, showSizeChanger: false, showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} nhà cung cấp` }} scroll={{ x: 1100 }} />
//           </Space>
//         </Card>
//       </Space>

//       <Modal title={editingItem ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp"} open={modalOpen} onOk={() => void handleSubmit()} onCancel={() => { setModalOpen(false); resetForm(); }} okText={editingItem ? "Lưu thay đổi" : "Tạo mới"} cancelText="Huỷ" confirmLoading={submitting}>
//         <Form<SupplierFormValues> form={form} layout="vertical">
//           <Form.Item label="Tên nhà cung cấp" name="ten" rules={[{ required: true, message: "Nhập tên nhà cung cấp." }]}><Input /></Form.Item>
//           <Form.Item label="Email" name="email" rules={[{ required: true, message: "Nhập email." }]}><Input /></Form.Item>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
//             <Form.Item label="Số điện thoại" name="soDienThoai" rules={[{ required: true, message: "Nhập số điện thoại." }]}><Input /></Form.Item>
//             <Form.Item label="Loại" name="loai" rules={[{ required: true, message: "Chọn loại." }]}><Select options={[{ label: "Tour", value: "Tour" }, { label: "Khách sạn", value: "Khách sạn" }, { label: "Vé máy bay", value: "Vé máy bay" }, { label: "Vé tàu", value: "Vé tàu" }, { label: "Vé vui chơi", value: "Vé vui chơi" }]} /></Form.Item>
//           </div>
//           <Form.Item label="Địa chỉ" name="diaChi" rules={[{ required: true, message: "Nhập địa chỉ." }]}><Input /></Form.Item>
//           <Form.Item label="Trạng thái" name="trangThai" rules={[{ required: true, message: "Chọn trạng thái." }]}><Select options={[{ label: "Đang hoạt động", value: "active" }, { label: "Ngừng hoạt động", value: "inactive" }]} /></Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// }
