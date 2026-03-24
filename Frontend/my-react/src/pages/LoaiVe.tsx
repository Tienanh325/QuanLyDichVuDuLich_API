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

// type LoaiVeStatus = "active" | "inactive";

// interface LoaiVeItem {
//   LoaiVeID: string;
//   TenLoaiVe: string;
//   trangthai: LoaiVeStatus;
// }

// interface LoaiVeFormValues {
//   LoaiVeID: string;
//   TenLoaiVe: string;
//   trangthai: LoaiVeStatus;
// }

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
// const LOAI_VE_API_PATH = import.meta.env.VITE_LOAI_VE_API_PATH ?? "/api/loai-ve";
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
// });

// const mockLoaiVe: LoaiVeItem[] = [
//   { LoaiVeID: "LV001", TenLoaiVe: "Vé người lớn", trangthai: "active" },
//   { LoaiVeID: "LV002", TenLoaiVe: "Vé trẻ em", trangthai: "active" },
//   { LoaiVeID: "LV003", TenLoaiVe: "Vé VIP", trangthai: "inactive" },
//   { LoaiVeID: "LV004", TenLoaiVe: "Vé gia đình", trangthai: "active" },
// ];

// function normalizeLoaiVe(input: unknown, index: number): LoaiVeItem {
//   const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
//   const rawStatus = String(raw.trangthai ?? raw.status ?? "active").toLowerCase();

//   return {
//     LoaiVeID: String(raw.LoaiVeID ?? raw.loaiVeID ?? raw.id ?? `LV${index + 1}`),
//     TenLoaiVe: String(raw.TenLoaiVe ?? raw.tenLoaiVe ?? raw.name ?? `Loại vé ${index + 1}`),
//     trangthai:
//       rawStatus === "inactive" || rawStatus.includes("ngung") || rawStatus.includes("inActive".toLowerCase())
//         ? "inactive"
//         : "active",
//   };
// }

// async function fetchLoaiVe(): Promise<LoaiVeItem[]> {
//   const response = await apiClient.get(LOAI_VE_API_PATH);
//   const payload = response.data as unknown;

//   if (Array.isArray(payload)) {
//     return payload.map(normalizeLoaiVe);
//   }

//   if (typeof payload === "object" && payload !== null) {
//     const nestedData = (payload as { data?: unknown }).data;
//     const nestedItems = (payload as { items?: unknown }).items;

//     if (Array.isArray(nestedData)) {
//       return nestedData.map(normalizeLoaiVe);
//     }

//     if (Array.isArray(nestedItems)) {
//       return nestedItems.map(normalizeLoaiVe);
//     }
//   }

//   return [];
// }

// async function createLoaiVe(item: LoaiVeItem): Promise<LoaiVeItem> {
//   const response = await apiClient.post(LOAI_VE_API_PATH, item);
//   return normalizeLoaiVe(response.data, 0);
// }

// async function updateLoaiVe(item: LoaiVeItem): Promise<LoaiVeItem> {
//   const response = await apiClient.put(`${LOAI_VE_API_PATH}/${item.LoaiVeID}`, item);
//   return normalizeLoaiVe(response.data, 0);
// }

// async function deleteLoaiVe(id: string): Promise<void> {
//   await apiClient.delete(`${LOAI_VE_API_PATH}/${id}`);
// }

// function getStatusMeta(status: LoaiVeStatus): { label: string; color: string } {
//   if (status === "active") {
//     return { label: "Đang hoạt động", color: "green" };
//   }

//   return { label: "Ngừng hoạt động", color: "red" };
// }

// const pageContainerStyle: CSSProperties = {
//   padding: 24,
//   background: "linear-gradient(180deg, #f7f8fc 0%, #f2f4f8 100%)",
//   minHeight: "100%",
// };

// const cardStyle: CSSProperties = {
//   borderRadius: 20,
//   border: "1px solid #eceef5",
//   boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
// };

// const statCardStyle: CSSProperties = {
//   ...cardStyle,
//   height: "100%",
//   background: "#ffffff",
// };

// export default function LoaiVe() {
//   const [form] = Form.useForm<LoaiVeFormValues>();
//   const [data, setData] = useState<LoaiVeItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<LoaiVeItem | null>(null);
//   const [searchText, setSearchText] = useState("");
//   const [filterStatus, setFilterStatus] = useState<LoaiVeStatus | "all">("all");
//   const [isUsingMockData, setIsUsingMockData] = useState(false);

//   const loadLoaiVe = async () => {
//     setLoading(true);

//     try {
//       const items = await fetchLoaiVe();
//       setData(items.length > 0 ? items : mockLoaiVe);
//       setIsUsingMockData(items.length === 0);

//       if (items.length === 0) {
//         message.info("API chưa trả dữ liệu, đang hiển thị dữ liệu mẫu để bạn kiểm tra.");
//       }
//     } catch (error) {
//       setData(mockLoaiVe);
//       setIsUsingMockData(true);

//       if (axios.isAxiosError(error)) {
//         message.warning(`Không kết nối được API ${API_BASE_URL}${LOAI_VE_API_PATH}. Đang dùng dữ liệu mẫu.`);
//       } else {
//         message.warning("Có lỗi khi tải dữ liệu loại vé. Đang dùng dữ liệu mẫu.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     void loadLoaiVe();
//   }, []);

//   const filteredData = useMemo(() => {
//     const keyword = searchText.trim().toLowerCase();

//     return data.filter((item) => {
//       const matchesSearch =
//         keyword.length === 0 ||
//         item.LoaiVeID.toLowerCase().includes(keyword) ||
//         item.TenLoaiVe.toLowerCase().includes(keyword);
//       const matchesStatus = filterStatus === "all" || item.trangthai === filterStatus;

//       return matchesSearch && matchesStatus;
//     });
//   }, [data, filterStatus, searchText]);

//   const stats = useMemo(() => {
//     const active = data.filter((item) => item.trangthai === "active").length;
//     const inactive = data.filter((item) => item.trangthai === "inactive").length;

//     return {
//       total: data.length,
//       active,
//       inactive,
//     };
//   }, [data]);

//   const resetForm = () => {
//     form.resetFields();
//     setEditingItem(null);
//   };

//   const openCreateModal = () => {
//     resetForm();
//     form.setFieldsValue({
//       trangthai: "active",
//     });
//     setModalOpen(true);
//   };

//   const openEditModal = (item: LoaiVeItem) => {
//     setEditingItem(item);
//     form.setFieldsValue(item);
//     setModalOpen(true);
//   };

//   const handleDelete = async (item: LoaiVeItem) => {
//     const previous = data;
//     setData((current) => current.filter((entry) => entry.LoaiVeID !== item.LoaiVeID));

//     if (isUsingMockData) {
//       message.success(`Đã xoá loại vé ${item.TenLoaiVe} trên dữ liệu mẫu.`);
//       return;
//     }

//     try {
//       await deleteLoaiVe(item.LoaiVeID);
//       message.success(`Đã xoá loại vé ${item.TenLoaiVe}.`);
//     } catch {
//       setData(previous);
//       message.error("Xoá không thành công, dữ liệu đã được hoàn lại.");
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();
//       setSubmitting(true);

//       const payload: LoaiVeItem = {
//         LoaiVeID: values.LoaiVeID.trim().toUpperCase(),
//         TenLoaiVe: values.TenLoaiVe.trim(),
//         trangthai: values.trangthai,
//       };

//       if (isUsingMockData) {
//         setData((current) =>
//           editingItem
//             ? current.map((item) => (item.LoaiVeID === editingItem.LoaiVeID ? payload : item))
//             : [payload, ...current],
//         );
//         message.success(editingItem ? "Đã cập nhật loại vé trên dữ liệu mẫu." : "Đã thêm loại vé trên dữ liệu mẫu.");
//         setModalOpen(false);
//         resetForm();
//         return;
//       }

//       if (editingItem) {
//         const updated = await updateLoaiVe(payload);
//         setData((current) =>
//           current.map((item) => (item.LoaiVeID === editingItem.LoaiVeID ? updated : item)),
//         );
//         message.success("Cập nhật loại vé thành công.");
//       } else {
//         const created = await createLoaiVe(payload);
//         setData((current) => [created, ...current]);
//         message.success("Thêm loại vé thành công.");
//       }

//       setModalOpen(false);
//       resetForm();
//     } catch (error) {
//       if (!axios.isAxiosError(error) && !(error instanceof Error)) {
//         return;
//       }

//       if (axios.isAxiosError(error)) {
//         message.error("Không lưu được dữ liệu lên API. Kiểm tra endpoint hoặc backend rồi thử lại.");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const columns: TableProps<LoaiVeItem>["columns"] = [
//     {
//       title: "LoaiVeID",
//       dataIndex: "LoaiVeID",
//       key: "LoaiVeID",
//       render: (value: string) => <Text strong style={{ color: "#1f2a44" }}>{value}</Text>,
//     },
//     {
//       title: "TenLoaiVe",
//       dataIndex: "TenLoaiVe",
//       key: "TenLoaiVe",
//       render: (value: string) => <Text style={{ color: "#55607a" }}>{value}</Text>,
//     },
//     {
//       title: "trangthai",
//       dataIndex: "trangthai",
//       key: "trangthai",
//       render: (status: LoaiVeStatus) => {
//         const meta = getStatusMeta(status);
//         return <Tag color={meta.color}>{meta.label}</Tag>;
//       },
//     },
//     {
//       title: "Thao tác",
//       key: "actions",
//       align: "center",
//       render: (_value, record) => (
//         <Space size="middle">
//           <Button
//             type="text"
//             aria-label={`Sửa ${record.LoaiVeID}`}
//             icon={<PencilLine size={16} color="#7c3aed" />}
//             onClick={() => openEditModal(record)}
//           />
//           <Popconfirm
//             title="Xoá loại vé?"
//             description={`Bạn có chắc muốn xoá ${record.TenLoaiVe}?`}
//             okText="Xoá"
//             cancelText="Huỷ"
//             onConfirm={() => void handleDelete(record)}
//           >
//             <Button
//               type="text"
//               danger
//               aria-label={`Xoá ${record.LoaiVeID}`}
//               icon={<Trash2 size={16} color="#ef4444" />}
//             />
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
//             <Title level={3} style={{ margin: 0, color: "#182338" }}>
//               Quản lý loại vé
//             </Title>
//             <Text style={{ color: "#7d869c" }}>
//               Danh sách loại vé với 3 trường: LoaiVeID, TenLoaiVe, trangthai.
//             </Text>
//           </div>

//           <Space wrap>
//             <Tag color={isUsingMockData ? "gold" : "green"} style={{ padding: "6px 10px" }}>
//               {isUsingMockData ? "Đang hiển thị dữ liệu mẫu" : `API: ${API_BASE_URL}${LOAI_VE_API_PATH}`}
//             </Tag>
//             <Button icon={<RefreshCw size={16} />} onClick={() => void loadLoaiVe()}>
//               Tải lại
//             </Button>
//           </Space>
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//             gap: 16,
//           }}
//         >
//           <Card style={statCardStyle}>
//             <Space align="start">
//               <Badge color="#7c3aed" />
//               <div>
//                 <Text style={{ color: "#7d869c" }}>Tổng loại vé</Text>
//                 <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>
//                   {stats.total}
//                 </Title>
//               </div>
//             </Space>
//           </Card>
//           <Card style={statCardStyle}>
//             <Space align="start">
//               <Badge color="#16a34a" />
//               <div>
//                 <Text style={{ color: "#7d869c" }}>Đang hoạt động</Text>
//                 <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>
//                   {stats.active}
//                 </Title>
//               </div>
//             </Space>
//           </Card>
//           <Card style={statCardStyle}>
//             <Space align="start">
//               <Badge color="#ef4444" />
//               <div>
//                 <Text style={{ color: "#7d869c" }}>Ngừng hoạt động</Text>
//                 <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>
//                   {stats.inactive}
//                 </Title>
//               </div>
//             </Space>
//           </Card>
//         </div>

//         <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
//           <Space direction="vertical" size={16} style={{ width: "100%" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
//               <div>
//                 <Title level={4} style={{ margin: 0, color: "#1f2a44" }}>
//                   Danh sách loại vé
//                 </Title>
//                 <Text style={{ color: "#7d869c" }}>
//                   Có {filteredData.length} loại vé đang hiển thị trong bảng.
//                 </Text>
//               </div>

//               <Space wrap>
//                 <Input
//                   allowClear
//                   prefix={<Search size={16} color="#94a3b8" />}
//                   placeholder="Tìm kiếm loại vé..."
//                   value={searchText}
//                   onChange={(event) => setSearchText(event.target.value)}
//                   style={{ width: 240 }}
//                 />
//                 <Select
//                   value={filterStatus}
//                   style={{ width: 180 }}
//                   onChange={(value) => setFilterStatus(value)}
//                   options={[
//                     { label: "Tất cả trạng thái", value: "all" },
//                     { label: "Đang hoạt động", value: "active" },
//                     { label: "Ngừng hoạt động", value: "inactive" },
//                   ]}
//                 />
//                 <Button
//                   type="primary"
//                   icon={<Plus size={16} />}
//                   style={{
//                     background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)",
//                     borderColor: "#7c3aed",
//                   }}
//                   onClick={openCreateModal}
//                 >
//                   Thêm mới
//                 </Button>
//               </Space>
//             </div>

//             <Table<LoaiVeItem>
//               rowKey="LoaiVeID"
//               columns={columns}
//               dataSource={filteredData}
//               loading={loading}
//               pagination={{
//                 pageSize: 6,
//                 showSizeChanger: false,
//                 showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} loại vé`,
//               }}
//               scroll={{ x: 720 }}
//             />
//           </Space>
//         </Card>
//       </Space>

//       <Modal
//         title={editingItem ? "Cập nhật loại vé" : "Thêm loại vé"}
//         open={modalOpen}
//         onOk={() => void handleSubmit()}
//         onCancel={() => {
//           setModalOpen(false);
//           resetForm();
//         }}
//         okText={editingItem ? "Lưu thay đổi" : "Tạo mới"}
//         cancelText="Huỷ"
//         confirmLoading={submitting}
//       >
//         <Form<LoaiVeFormValues> form={form} layout="vertical">
//           <Form.Item
//             label="LoaiVeID"
//             name="LoaiVeID"
//             rules={[
//               { required: true, message: "Nhập LoaiVeID." },
//               { min: 3, message: "LoaiVeID nên có ít nhất 3 ký tự." },
//             ]}
//           >
//             <Input placeholder="Ví dụ: LV001" disabled={!!editingItem} />
//           </Form.Item>

//           <Form.Item
//             label="TenLoaiVe"
//             name="TenLoaiVe"
//             rules={[{ required: true, message: "Nhập TenLoaiVe." }]}
//           >
//             <Input placeholder="Ví dụ: Vé người lớn" />
//           </Form.Item>

//           <Form.Item
//             label="trangthai"
//             name="trangthai"
//             rules={[{ required: true, message: "Chọn trạng thái." }]}
//           >
//             <Select
//               options={[
//                 { label: "Đang hoạt động", value: "active" },
//                 { label: "Ngừng hoạt động", value: "inactive" },
//               ]}
//             />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// }
