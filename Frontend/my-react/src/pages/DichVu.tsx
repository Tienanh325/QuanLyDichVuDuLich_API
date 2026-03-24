// import { useEffect, useMemo, useState } from "react";
// import type { CSSProperties } from "react";
// import axios from "axios";
// import {
//   Badge,
//   Button,
//   Card,
//   Form,
//   Input,
//   InputNumber,
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
// const { TextArea } = Input;

// type ServiceStatus = "active" | "inactive";

// interface SupplierOption {
//   maNhaCungCap: number;
//   ten: string;
// }

// interface ServiceItem {
//   maDichVu: number;
//   ten: string;
//   moTa: string;
//   gia: number;
//   loaiDichVu: string;
//   maNhaCungCap: number;
//   trangThai: ServiceStatus;
// }

// interface ServiceFormValues {
//   ten: string;
//   moTa: string;
//   gia: number;
//   loaiDichVu: string;
//   maNhaCungCap: number;
//   trangThai: ServiceStatus;
// }

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
// const SERVICE_API_PATH = import.meta.env.VITE_DICH_VU_API_PATH ?? "/api/dich-vu";
// const SUPPLIER_API_PATH = import.meta.env.VITE_NHA_CUNG_CAP_API_PATH ?? "/api/nha-cung-cap";

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
// });

// const mockSuppliers: SupplierOption[] = [
//   { maNhaCungCap: 1, ten: "Công ty Vé Việt" },
//   { maNhaCungCap: 2, ten: "Travel Hub" },
//   { maNhaCungCap: 3, ten: "Resort Booking" },
// ];

// const mockServices: ServiceItem[] = [
//   { maDichVu: 101, ten: "Tour Đà Lạt 3N2Đ", moTa: "Tour nghỉ dưỡng cuối tuần dành cho nhóm gia đình.", gia: 2890000, loaiDichVu: "Tour", maNhaCungCap: 2, trangThai: "active" },
//   { maDichVu: 102, ten: "Phòng Deluxe biển", moTa: "Phòng 2 khách, bao gồm buffet sáng.", gia: 1590000, loaiDichVu: "Khách sạn", maNhaCungCap: 3, trangThai: "active" },
//   { maDichVu: 103, ten: "Vé máy bay Hà Nội - Đà Nẵng", moTa: "Hạng phổ thông linh hoạt.", gia: 1290000, loaiDichVu: "Vé máy bay", maNhaCungCap: 1, trangThai: "inactive" },
// ];

// const currencyFormatter = new Intl.NumberFormat("vi-VN");

// function formatCurrency(value: number): string {
//   return `${currencyFormatter.format(value)} đ`;
// }

// function normalizeStatus(value: unknown): ServiceStatus {
//   const status = String(value ?? "").toLowerCase();
//   return status.includes("inactive") || status.includes("ngung") ? "inactive" : "active";
// }

// function normalizeService(input: unknown, index: number): ServiceItem {
//   const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
//   return {
//     maDichVu: Number(raw.maDichVu ?? raw.id ?? index + 1),
//     ten: String(raw.ten ?? raw.name ?? `Dịch vụ ${index + 1}`),
//     moTa: String(raw.moTa ?? raw.description ?? ""),
//     gia: Number(raw.gia ?? raw.price ?? 0),
//     loaiDichVu: String(raw.loaiDichVu ?? raw.type ?? "Khác"),
//     maNhaCungCap: Number(raw.maNhaCungCap ?? raw.supplierId ?? 0),
//     trangThai: normalizeStatus(raw.trangThai ?? raw.status),
//   };
// }

// function normalizeSupplier(input: unknown, index: number): SupplierOption {
//   const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
//   return {
//     maNhaCungCap: Number(raw.maNhaCungCap ?? raw.id ?? index + 1),
//     ten: String(raw.ten ?? raw.name ?? `Nhà cung cấp ${index + 1}`),
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

// async function fetchServices(): Promise<ServiceItem[]> {
//   const response = await apiClient.get(SERVICE_API_PATH);
//   return extractArray(response.data).map(normalizeService);
// }

// async function fetchSuppliers(): Promise<SupplierOption[]> {
//   const response = await apiClient.get(SUPPLIER_API_PATH);
//   return extractArray(response.data).map(normalizeSupplier);
// }

// async function createService(item: ServiceItem): Promise<ServiceItem> {
//   const response = await apiClient.post(SERVICE_API_PATH, item);
//   return normalizeService(response.data, 0);
// }

// async function updateService(item: ServiceItem): Promise<ServiceItem> {
//   const response = await apiClient.put(`${SERVICE_API_PATH}/${item.maDichVu}`, item);
//   return normalizeService(response.data, 0);
// }

// async function deleteService(id: number): Promise<void> {
//   await apiClient.delete(`${SERVICE_API_PATH}/${id}`);
// }

// function getStatusMeta(status: ServiceStatus): { label: string; color: string } {
//   return status === "active" ? { label: "Đang mở bán", color: "green" } : { label: "Tạm ngưng", color: "red" };
// }

// const pageContainerStyle: CSSProperties = { padding: 24, background: "linear-gradient(180deg, #f7f8fc 0%, #f2f4f8 100%)", minHeight: "100%" };
// const cardStyle: CSSProperties = { borderRadius: 20, border: "1px solid #eceef5", boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)" };
// const statCardStyle: CSSProperties = { ...cardStyle, height: "100%", background: "#ffffff" };

// export default function DichVu() {
//   const [form] = Form.useForm<ServiceFormValues>();
//   const [data, setData] = useState<ServiceItem[]>([]);
//   const [suppliers, setSuppliers] = useState<SupplierOption[]>(mockSuppliers);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
//   const [searchText, setSearchText] = useState("");
//   const [filterStatus, setFilterStatus] = useState<ServiceStatus | "all">("all");
//   const [filterType, setFilterType] = useState<string>("all");
//   const [isUsingMockData, setIsUsingMockData] = useState(false);

//   const loadServices = async () => {
//     setLoading(true);
//     try {
//       const [services, supplierData] = await Promise.all([fetchServices(), fetchSuppliers().catch(() => mockSuppliers)]);
//       setSuppliers(supplierData.length > 0 ? supplierData : mockSuppliers);
//       setData(services.length > 0 ? services : mockServices);
//       setIsUsingMockData(services.length === 0);
//       if (services.length === 0) message.info("API chưa trả dữ liệu dịch vụ, đang hiển thị dữ liệu mẫu.");
//     } catch (error) {
//       setSuppliers(mockSuppliers);
//       setData(mockServices);
//       setIsUsingMockData(true);
//       if (axios.isAxiosError(error)) {
//         message.warning(`Không kết nối được API ${API_BASE_URL}${SERVICE_API_PATH}. Đang dùng dữ liệu mẫu.`);
//       } else {
//         message.warning("Có lỗi khi tải dữ liệu dịch vụ. Đang dùng dữ liệu mẫu.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     void loadServices();
//   }, []);

//   const typeOptions = useMemo(() => ["all", ...Array.from(new Set(data.map((item) => item.loaiDichVu)))], [data]);
//   const supplierMap = useMemo(() => new Map(suppliers.map((item) => [item.maNhaCungCap, item.ten])), [suppliers]);

//   const filteredData = useMemo(() => {
//     const keyword = searchText.trim().toLowerCase();
//     return data.filter((item) => {
//       const supplierName = supplierMap.get(item.maNhaCungCap)?.toLowerCase() ?? "";
//       const matchesSearch =
//         keyword.length === 0 ||
//         String(item.maDichVu).includes(keyword) ||
//         item.ten.toLowerCase().includes(keyword) ||
//         item.moTa.toLowerCase().includes(keyword) ||
//         supplierName.includes(keyword);
//       const matchesStatus = filterStatus === "all" || item.trangThai === filterStatus;
//       const matchesType = filterType === "all" || item.loaiDichVu === filterType;
//       return matchesSearch && matchesStatus && matchesType;
//     });
//   }, [data, filterStatus, filterType, searchText, supplierMap]);

//   const stats = useMemo(() => {
//     const active = data.filter((item) => item.trangThai === "active").length;
//     const inactive = data.filter((item) => item.trangThai === "inactive").length;
//     return { total: data.length, active, inactive, suppliers: new Set(data.map((item) => item.maNhaCungCap)).size };
//   }, [data]);

//   const resetForm = () => {
//     form.resetFields();
//     setEditingItem(null);
//   };

//   const openCreateModal = () => {
//     resetForm();
//     form.setFieldsValue({ loaiDichVu: "Tour", maNhaCungCap: suppliers[0]?.maNhaCungCap, trangThai: "active", gia: 1000000 });
//     setModalOpen(true);
//   };

//   const openEditModal = (item: ServiceItem) => {
//     setEditingItem(item);
//     form.setFieldsValue({ ten: item.ten, moTa: item.moTa, gia: item.gia, loaiDichVu: item.loaiDichVu, maNhaCungCap: item.maNhaCungCap, trangThai: item.trangThai });
//     setModalOpen(true);
//   };

//   const handleDelete = async (item: ServiceItem) => {
//     const previous = data;
//     setData((current) => current.filter((entry) => entry.maDichVu !== item.maDichVu));
//     if (isUsingMockData) {
//       message.success(`Đã xoá dịch vụ ${item.ten} trên dữ liệu mẫu.`);
//       return;
//     }
//     try {
//       await deleteService(item.maDichVu);
//       message.success(`Đã xoá dịch vụ ${item.ten}.`);
//     } catch {
//       setData(previous);
//       message.error("Xoá không thành công, dữ liệu đã được hoàn lại.");
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();
//       setSubmitting(true);
//       const payload: ServiceItem = {
//         maDichVu: editingItem?.maDichVu ?? Date.now(),
//         ten: values.ten.trim(),
//         moTa: values.moTa.trim(),
//         gia: values.gia,
//         loaiDichVu: values.loaiDichVu,
//         maNhaCungCap: values.maNhaCungCap,
//         trangThai: values.trangThai,
//       };
//       if (isUsingMockData) {
//         setData((current) => editingItem ? current.map((item) => (item.maDichVu === editingItem.maDichVu ? payload : item)) : [payload, ...current]);
//         message.success(editingItem ? "Đã cập nhật dịch vụ trên dữ liệu mẫu." : "Đã thêm dịch vụ trên dữ liệu mẫu.");
//         setModalOpen(false);
//         resetForm();
//         return;
//       }
//       if (editingItem) {
//         const updated = await updateService(payload);
//         setData((current) => current.map((item) => (item.maDichVu === editingItem.maDichVu ? updated : item)));
//         message.success("Cập nhật dịch vụ thành công.");
//       } else {
//         const created = await createService(payload);
//         setData((current) => [created, ...current]);
//         message.success("Thêm dịch vụ thành công.");
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

//   const columns: TableProps<ServiceItem>["columns"] = [
//     { title: "Dịch vụ", key: "ten", render: (_value, record) => <div><div style={{ fontWeight: 700, color: "#1f2a44" }}>{record.ten}</div><Text style={{ color: "#7d869c", fontSize: 13 }}>Mã DV: {record.maDichVu}</Text></div> },
//     { title: "Mô tả", dataIndex: "moTa", key: "moTa", render: (value: string) => <Text style={{ color: "#55607a" }}>{value}</Text> },
//     { title: "Giá", dataIndex: "gia", key: "gia", render: (value: number) => <Text strong>{formatCurrency(value)}</Text> },
//     { title: "Loại dịch vụ", dataIndex: "loaiDichVu", key: "loaiDichVu", render: (value: string) => <Tag color="blue">{value}</Tag> },
//     { title: "Nhà cung cấp", dataIndex: "maNhaCungCap", key: "maNhaCungCap", render: (value: number) => supplierMap.get(value) ?? `NCC #${value}` },
//     { title: "Trạng thái", dataIndex: "trangThai", key: "trangThai", render: (status: ServiceStatus) => { const meta = getStatusMeta(status); return <Tag color={meta.color}>{meta.label}</Tag>; } },
//     {
//       title: "Thao tác",
//       key: "actions",
//       align: "center",
//       render: (_value, record) => (
//         <Space size="middle">
//           <Button type="text" icon={<PencilLine size={16} color="#7c3aed" />} onClick={() => openEditModal(record)} />
//           <Popconfirm title="Xoá dịch vụ?" description={`Bạn có chắc muốn xoá ${record.ten}?`} okText="Xoá" cancelText="Huỷ" onConfirm={() => void handleDelete(record)}>
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
//             <Title level={3} style={{ margin: 0, color: "#182338" }}>Quản lý dịch vụ</Title>
//             <Text style={{ color: "#7d869c" }}>Quản lý danh mục dịch vụ, giá bán, loại dịch vụ và liên kết nhà cung cấp.</Text>
//           </div>
//           <Space wrap>
//             <Tag color={isUsingMockData ? "gold" : "green"} style={{ padding: "6px 10px" }}>{isUsingMockData ? "Đang hiển thị dữ liệu mẫu" : `API: ${API_BASE_URL}${SERVICE_API_PATH}`}</Tag>
//             <Button icon={<RefreshCw size={16} />} onClick={() => void loadServices()}>Tải lại</Button>
//           </Space>
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
//           <Card style={statCardStyle}><Space align="start"><Badge color="#7c3aed" /><div><Text style={{ color: "#7d869c" }}>Tổng dịch vụ</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.total}</Title></div></Space></Card>
//           <Card style={statCardStyle}><Space align="start"><Badge color="#16a34a" /><div><Text style={{ color: "#7d869c" }}>Đang mở bán</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.active}</Title></div></Space></Card>
//           <Card style={statCardStyle}><Space align="start"><Badge color="#ef4444" /><div><Text style={{ color: "#7d869c" }}>Tạm ngưng</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.inactive}</Title></div></Space></Card>
//           <Card style={statCardStyle}><Space align="start"><Badge color="#2563eb" /><div><Text style={{ color: "#7d869c" }}>Nhà cung cấp</Text><Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.suppliers}</Title></div></Space></Card>
//         </div>

//         <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
//           <Space direction="vertical" size={16} style={{ width: "100%" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
//               <div>
//                 <Title level={4} style={{ margin: 0, color: "#1f2a44" }}>Danh sách dịch vụ</Title>
//                 <Text style={{ color: "#7d869c" }}>Có {filteredData.length} dịch vụ đang hiển thị trong bảng.</Text>
//               </div>
//               <Space wrap>
//                 <Input allowClear prefix={<Search size={16} color="#94a3b8" />} placeholder="Tìm tên, mô tả, nhà cung cấp..." value={searchText} onChange={(event) => setSearchText(event.target.value)} style={{ width: 260 }} />
//                 <Select value={filterType} style={{ width: 170 }} onChange={(value) => setFilterType(value)} options={typeOptions.map((item) => ({ label: item === "all" ? "Tất cả loại dịch vụ" : item, value: item }))} />
//                 <Select value={filterStatus} style={{ width: 150 }} onChange={(value) => setFilterStatus(value)} options={[{ label: "Tất cả trạng thái", value: "all" }, { label: "Đang mở bán", value: "active" }, { label: "Tạm ngưng", value: "inactive" }]} />
//                 <Button type="primary" icon={<Plus size={16} />} style={{ background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)", borderColor: "#7c3aed" }} onClick={openCreateModal}>Thêm mới</Button>
//               </Space>
//             </div>
//             <Table<ServiceItem> rowKey="maDichVu" columns={columns} dataSource={filteredData} loading={loading} pagination={{ pageSize: 6, showSizeChanger: false, showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} dịch vụ` }} scroll={{ x: 1200 }} />
//           </Space>
//         </Card>
//       </Space>

//       <Modal title={editingItem ? "Cập nhật dịch vụ" : "Thêm dịch vụ"} open={modalOpen} onOk={() => void handleSubmit()} onCancel={() => { setModalOpen(false); resetForm(); }} okText={editingItem ? "Lưu thay đổi" : "Tạo mới"} cancelText="Huỷ" confirmLoading={submitting}>
//         <Form<ServiceFormValues> form={form} layout="vertical">
//           <Form.Item label="Tên dịch vụ" name="ten" rules={[{ required: true, message: "Nhập tên dịch vụ." }]}><Input /></Form.Item>
//           <Form.Item label="Mô tả" name="moTa" rules={[{ required: true, message: "Nhập mô tả." }]}><TextArea rows={3} /></Form.Item>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
//             <Form.Item label="Giá" name="gia" rules={[{ required: true, message: "Nhập giá." }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
//             <Form.Item label="Loại dịch vụ" name="loaiDichVu" rules={[{ required: true, message: "Chọn loại dịch vụ." }]}><Select options={[{ label: "Tour", value: "Tour" }, { label: "Khách sạn", value: "Khách sạn" }, { label: "Vé máy bay", value: "Vé máy bay" }, { label: "Vé tàu", value: "Vé tàu" }, { label: "Vé vui chơi", value: "Vé vui chơi" }]} /></Form.Item>
//             <Form.Item label="Nhà cung cấp" name="maNhaCungCap" rules={[{ required: true, message: "Chọn nhà cung cấp." }]}><Select options={suppliers.map((item) => ({ label: `${item.ten} (#${item.maNhaCungCap})`, value: item.maNhaCungCap }))} /></Form.Item>
//             <Form.Item label="Trạng thái" name="trangThai" rules={[{ required: true, message: "Chọn trạng thái." }]}><Select options={[{ label: "Đang mở bán", value: "active" }, { label: "Tạm ngưng", value: "inactive" }]} /></Form.Item>
//           </div>
//         </Form>
//       </Modal>
//     </div>
//   );
// }
