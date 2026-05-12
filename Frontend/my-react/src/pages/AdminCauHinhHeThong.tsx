import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
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
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import type { TableProps } from "antd";
import { Plus, Search, Trash2, PencilLine } from "lucide-react";
import {
  adminCreateDanhMucHoatDong,
  adminCreateTienIch,
  adminDeleteDanhMucHoatDong,
  adminDeleteNewsletter,
  adminDeleteTienIch,
  adminGetDanhMucHoatDong,
  adminGetNewsletter,
  adminGetTienIch,
  adminUpdateDanhMucHoatDong,
  adminUpdateNewsletterStatus,
  adminUpdateTienIch,
  type DanhMucHoatDongItem,
  type NewsletterItem,
  type TienIchItem,
} from "../services/adminService";

const { Title, Text } = Typography;

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

const mockDanhMuc: DanhMucHoatDongItem[] = [
  { maDanhMuc: 1, tenDanhMuc: "Công viên giải trí", icon: "Tent", gradient: "from-blue-500 to-cyan-400", moTa: "Vé tham quan và công viên", trangThai: 1, thuTu: 1 },
  { maDanhMuc: 2, tenDanhMuc: "Tour du lịch", icon: "Sparkles", gradient: "from-orange-500 to-pink-500", moTa: "Tour trải nghiệm trong ngày", trangThai: 1, thuTu: 2 },
  { maDanhMuc: 3, tenDanhMuc: "Làm đẹp & Spa", icon: "Scissors", gradient: "from-purple-500 to-pink-400", moTa: "Spa và chăm sóc sức khỏe", trangThai: 1, thuTu: 3 },
];

const mockTienIch: TienIchItem[] = [
  { maTienIch: 1, tenTienIch: "Hồ bơi", icon: "Waves", loaiTienIch: "KHACH_SAN", trangThai: 1 },
  { maTienIch: 2, tenTienIch: "Wifi miễn phí", icon: "Wifi", loaiTienIch: "PHONG", trangThai: 1 },
  { maTienIch: 3, tenTienIch: "Bữa ăn", icon: "Utensils", loaiTienIch: "VE", trangThai: 1 },
  { maTienIch: 4, tenTienIch: "Hướng dẫn viên", icon: "User", loaiTienIch: "TOUR", trangThai: 1 },
];

const mockNewsletter: NewsletterItem[] = [
  { maDangKy: 1, email: "khachhang@example.com", source: "activity", trangThai: "ACTIVE", ngayTao: "2026-05-11" },
  { maDangKy: 2, email: "travel@example.com", source: "flight", trangThai: "UNSUBSCRIBED", ngayTao: "2026-05-10" },
];

function isActiveStatus(value: unknown): boolean {
  return value === true || value === 1 || value === "1" || value === "true" || value === "ACTIVE";
}

function renderBinaryStatus(value: unknown) {
  return isActiveStatus(value) ? <Tag color="green">Đang bật</Tag> : <Tag color="red">Đang tắt</Tag>;
}

function renderNewsletterStatus(value: NewsletterItem["trangThai"]) {
  return value === "ACTIVE" ? <Tag color="green">Đang nhận tin</Tag> : <Tag color="default">Đã hủy</Tag>;
}

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase();
}

export default function AdminCauHinhHeThong() {
  const [categoryData, setCategoryData] = useState<DanhMucHoatDongItem[]>([]);
  const [amenityData, setAmenityData] = useState<TienIchItem[]>([]);
  const [newsletterData, setNewsletterData] = useState<NewsletterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [amenityTypeFilter, setAmenityTypeFilter] = useState<string>("all");
  const [newsletterStatusFilter, setNewsletterStatusFilter] = useState<string>("all");

  const [categoryForm] = Form.useForm();
  const [amenityForm] = Form.useForm();
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [amenityModalOpen, setAmenityModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DanhMucHoatDongItem | null>(null);
  const [editingAmenity, setEditingAmenity] = useState<TienIchItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categories, amenities, newsletters] = await Promise.all([
        adminGetDanhMucHoatDong(),
        adminGetTienIch(),
        adminGetNewsletter(),
      ]);
      setCategoryData(categories);
      setAmenityData(amenities);
      setNewsletterData(newsletters);
      setIsUsingMockData(false);
    } catch (error) {
      setCategoryData(mockDanhMuc);
      setAmenityData(mockTienIch);
      setNewsletterData(mockNewsletter);
      setIsUsingMockData(true);
      message.warning("Không kết nối được API cấu hình UI. Đang hiển thị dữ liệu mẫu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredCategories = useMemo(() => {
    const keyword = normalizeKeyword(searchText);
    return categoryData.filter((item) =>
      !keyword ||
      item.tenDanhMuc.toLowerCase().includes(keyword) ||
      item.icon?.toLowerCase().includes(keyword) ||
      item.moTa?.toLowerCase().includes(keyword),
    );
  }, [categoryData, searchText]);

  const filteredAmenities = useMemo(() => {
    const keyword = normalizeKeyword(searchText);
    return amenityData.filter((item) => {
      const matchesKeyword = !keyword || item.tenTienIch.toLowerCase().includes(keyword) || item.icon?.toLowerCase().includes(keyword);
      const matchesType = amenityTypeFilter === "all" || item.loaiTienIch === amenityTypeFilter;
      return matchesKeyword && matchesType;
    });
  }, [amenityData, amenityTypeFilter, searchText]);

  const filteredNewsletter = useMemo(() => {
    const keyword = normalizeKeyword(searchText);
    return newsletterData.filter((item) => {
      const matchesKeyword = !keyword || item.email.toLowerCase().includes(keyword) || item.source?.toLowerCase().includes(keyword);
      const matchesStatus = newsletterStatusFilter === "all" || item.trangThai === newsletterStatusFilter;
      return matchesKeyword && matchesStatus;
    });
  }, [newsletterData, newsletterStatusFilter, searchText]);

  const stats = useMemo(() => ({
    categories: categoryData.length,
    amenities: amenityData.length,
    activeNewsletter: newsletterData.filter((item) => item.trangThai === "ACTIVE").length,
    mockMode: isUsingMockData ? 1 : 0,
  }), [amenityData.length, categoryData.length, isUsingMockData, newsletterData]);

  const openCategoryModal = (item?: DanhMucHoatDongItem) => {
    setEditingCategory(item ?? null);
    categoryForm.setFieldsValue(item ?? { trangThai: 1, thuTu: 0 });
    setCategoryModalOpen(true);
  };

  const openAmenityModal = (item?: TienIchItem) => {
    setEditingAmenity(item ?? null);
    amenityForm.setFieldsValue(item ?? { loaiTienIch: "KHACH_SAN", trangThai: 1 });
    setAmenityModalOpen(true);
  };

  const submitCategory = async () => {
    const values = await categoryForm.validateFields();
    setSubmitting(true);
    try {
      if (editingCategory) {
        await adminUpdateDanhMucHoatDong(editingCategory.maDanhMuc, values);
        message.success("Đã cập nhật danh mục hoạt động.");
      } else {
        await adminCreateDanhMucHoatDong(values);
        message.success("Đã tạo danh mục hoạt động.");
      }
      setCategoryModalOpen(false);
      categoryForm.resetFields();
      await loadData();
    } catch {
      message.error("Không thể lưu danh mục hoạt động.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitAmenity = async () => {
    const values = await amenityForm.validateFields();
    setSubmitting(true);
    try {
      if (editingAmenity) {
        await adminUpdateTienIch(editingAmenity.maTienIch, values);
        message.success("Đã cập nhật tiện ích.");
      } else {
        await adminCreateTienIch(values);
        message.success("Đã tạo tiện ích.");
      }
      setAmenityModalOpen(false);
      amenityForm.resetFields();
      await loadData();
    } catch {
      message.error("Không thể lưu tiện ích.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await adminDeleteDanhMucHoatDong(id);
      message.success("Đã xóa danh mục hoạt động.");
      await loadData();
    } catch {
      message.error("Không thể xóa danh mục hoạt động.");
    }
  };

  const deleteAmenity = async (id: number) => {
    try {
      await adminDeleteTienIch(id);
      message.success("Đã xóa tiện ích.");
      await loadData();
    } catch {
      message.error("Không thể xóa tiện ích.");
    }
  };

  const toggleNewsletter = async (item: NewsletterItem) => {
    try {
      await adminUpdateNewsletterStatus(item.maDangKy, item.trangThai === "ACTIVE" ? "UNSUBSCRIBED" : "ACTIVE");
      message.success("Đã cập nhật trạng thái nhận tin.");
      await loadData();
    } catch {
      message.error("Không thể cập nhật trạng thái nhận tin.");
    }
  };

  const deleteNewsletter = async (id: number) => {
    try {
      await adminDeleteNewsletter(id);
      message.success("Đã xóa đăng ký nhận tin.");
      await loadData();
    } catch {
      message.error("Không thể xóa đăng ký nhận tin.");
    }
  };

  const categoryColumns: TableProps<DanhMucHoatDongItem>["columns"] = [
    { title: "Mã", dataIndex: "maDanhMuc", width: 80, render: (value) => <Text strong>#{value}</Text> },
    { title: "Tên danh mục", dataIndex: "tenDanhMuc", render: (value, record) => <div><Text strong>{value}</Text><br /><Text type="secondary">{record.moTa || "Chưa có mô tả"}</Text></div> },
    { title: "Icon", dataIndex: "icon", width: 120, render: (value) => value || "--" },
    { title: "Gradient", dataIndex: "gradient", width: 220, render: (value) => <Text type="secondary">{value || "--"}</Text> },
    { title: "Thứ tự", dataIndex: "thuTu", width: 90 },
    { title: "Trạng thái", dataIndex: "trangThai", width: 130, render: renderBinaryStatus },
    {
      title: "Thao tác",
      key: "actions",
      width: 130,
      render: (_value, record) => (
        <Space>
          <Button icon={<PencilLine size={15} />} onClick={() => openCategoryModal(record)} />
          <Popconfirm title="Xóa danh mục này?" onConfirm={() => void deleteCategory(record.maDanhMuc)} okText="Xóa" cancelText="Hủy">
            <Button danger icon={<Trash2 size={15} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const amenityColumns: TableProps<TienIchItem>["columns"] = [
    { title: "Mã", dataIndex: "maTienIch", width: 80, render: (value) => <Text strong>#{value}</Text> },
    { title: "Tên tiện ích", dataIndex: "tenTienIch", render: (value, record) => <div><Text strong>{value}</Text><br /><Text type="secondary">Icon: {record.icon || "--"}</Text></div> },
    { title: "Loại", dataIndex: "loaiTienIch", width: 150, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "Trạng thái", dataIndex: "trangThai", width: 130, render: renderBinaryStatus },
    {
      title: "Thao tác",
      key: "actions",
      width: 130,
      render: (_value, record) => (
        <Space>
          <Button icon={<PencilLine size={15} />} onClick={() => openAmenityModal(record)} />
          <Popconfirm title="Xóa tiện ích này?" onConfirm={() => void deleteAmenity(record.maTienIch)} okText="Xóa" cancelText="Hủy">
            <Button danger icon={<Trash2 size={15} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const newsletterColumns: TableProps<NewsletterItem>["columns"] = [
    { title: "Mã", dataIndex: "maDangKy", width: 80, render: (value) => <Text strong>#{value}</Text> },
    { title: "Email", dataIndex: "email", render: (value) => <Text strong>{value}</Text> },
    { title: "Nguồn", dataIndex: "source", width: 140, render: (value) => value || "--" },
    { title: "Trạng thái", dataIndex: "trangThai", width: 150, render: renderNewsletterStatus },
    { title: "Ngày tạo", dataIndex: "ngayTao", width: 160, render: (value) => value ? new Date(value).toLocaleDateString("vi-VN") : "--" },
    {
      title: "Thao tác",
      key: "actions",
      width: 210,
      render: (_value, record) => (
        <Space>
          <Button onClick={() => void toggleNewsletter(record)}>{record.trangThai === "ACTIVE" ? "Hủy nhận" : "Kích hoạt"}</Button>
          <Popconfirm title="Xóa email này?" onConfirm={() => void deleteNewsletter(record.maDangKy)} okText="Xóa" cancelText="Hủy">
            <Button danger icon={<Trash2 size={15} />} />
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
            <Title level={3} style={{ margin: 0, color: "#182338" }}>Cấu hình giao diện</Title>
            <Text style={{ color: "#7d869c" }}>Quản lý danh mục hoạt động, tiện ích và danh sách đăng ký nhận tin theo schema UI.</Text>
          </div>
          <Space>
            <Tag color={isUsingMockData ? "gold" : "green"}>{isUsingMockData ? "Dữ liệu mẫu" : "API đang hoạt động"}</Tag>
          </Space>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <Card style={statCardStyle}><Text type="secondary">Danh mục</Text><Title level={3} style={{ margin: 0 }}>{stats.categories}</Title></Card>
          <Card style={statCardStyle}><Text type="secondary">Tiện ích</Text><Title level={3} style={{ margin: 0 }}>{stats.amenities}</Title></Card>
          <Card style={statCardStyle}><Text type="secondary">Email đang nhận tin</Text><Title level={3} style={{ margin: 0 }}>{stats.activeNewsletter}</Title></Card>
          <Card style={statCardStyle}><Text type="secondary">Chế độ dữ liệu</Text><Title level={4} style={{ margin: 0 }}>{stats.mockMode ? "Mẫu" : "API"}</Title></Card>
        </div>

        <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <Input
                allowClear
                prefix={<Search size={16} color="#94a3b8" />}
                placeholder="Tìm danh mục, tiện ích, email..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                style={{ width: 320 }}
              />
            </div>

            <Tabs
              items={[
                {
                  key: "categories",
                  label: "Danh mục hoạt động",
                  children: (
                    <Space direction="vertical" size={12} style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" icon={<Plus size={16} />} onClick={() => openCategoryModal()}>Thêm danh mục</Button>
                      </div>
                      <Table<DanhMucHoatDongItem> rowKey="maDanhMuc" columns={categoryColumns} dataSource={filteredCategories} loading={loading} pagination={{ pageSize: 10 }} scroll={{ x: 980 }} />
                    </Space>
                  ),
                },
                {
                  key: "amenities",
                  label: "Tiện ích",
                  children: (
                    <Space direction="vertical" size={12} style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <Select value={amenityTypeFilter} onChange={setAmenityTypeFilter} style={{ width: 220 }} options={[{ label: "Tất cả loại tiện ích", value: "all" }, { label: "Khách sạn", value: "KHACH_SAN" }, { label: "Phòng", value: "PHONG" }, { label: "Vé", value: "VE" }, { label: "Tour", value: "TOUR" }]} />
                        <Button type="primary" icon={<Plus size={16} />} onClick={() => openAmenityModal()}>Thêm tiện ích</Button>
                      </div>
                      <Table<TienIchItem> rowKey="maTienIch" columns={amenityColumns} dataSource={filteredAmenities} loading={loading} pagination={{ pageSize: 10 }} scroll={{ x: 760 }} />
                    </Space>
                  ),
                },
                {
                  key: "newsletter",
                  label: "Đăng ký nhận tin",
                  children: (
                    <Space direction="vertical" size={12} style={{ width: "100%" }}>
                      <Select value={newsletterStatusFilter} onChange={setNewsletterStatusFilter} style={{ width: 220 }} options={[{ label: "Tất cả trạng thái", value: "all" }, { label: "Đang nhận tin", value: "ACTIVE" }, { label: "Đã hủy", value: "UNSUBSCRIBED" }]} />
                      <Table<NewsletterItem> rowKey="maDangKy" columns={newsletterColumns} dataSource={filteredNewsletter} loading={loading} pagination={{ pageSize: 10 }} scroll={{ x: 860 }} />
                    </Space>
                  ),
                },
              ]}
            />
          </Space>
        </Card>
      </Space>

      <Modal title={editingCategory ? "Cập nhật danh mục" : "Thêm danh mục"} open={categoryModalOpen} onOk={() => void submitCategory()} confirmLoading={submitting} onCancel={() => setCategoryModalOpen(false)} okText="Lưu" cancelText="Hủy">
        <Form form={categoryForm} layout="vertical">
          <Form.Item name="tenDanhMuc" label="Tên danh mục" rules={[{ required: true, message: "Nhập tên danh mục" }]}><Input /></Form.Item>
          <Form.Item name="icon" label="Icon"><Input placeholder="Tent, Sparkles, Scissors..." /></Form.Item>
          <Form.Item name="gradient" label="Gradient"><Input placeholder="from-blue-500 to-cyan-400" /></Form.Item>
          <Form.Item name="moTa" label="Mô tả"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="thuTu" label="Thứ tự"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="trangThai" label="Trạng thái"><Select options={[{ label: "Đang bật", value: 1 }, { label: "Đang tắt", value: 0 }]} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={editingAmenity ? "Cập nhật tiện ích" : "Thêm tiện ích"} open={amenityModalOpen} onOk={() => void submitAmenity()} confirmLoading={submitting} onCancel={() => setAmenityModalOpen(false)} okText="Lưu" cancelText="Hủy">
        <Form form={amenityForm} layout="vertical">
          <Form.Item name="tenTienIch" label="Tên tiện ích" rules={[{ required: true, message: "Nhập tên tiện ích" }]}><Input /></Form.Item>
          <Form.Item name="icon" label="Icon"><Input placeholder="Wifi, Waves, Coffee..." /></Form.Item>
          <Form.Item name="loaiTienIch" label="Loại tiện ích" rules={[{ required: true, message: "Chọn loại tiện ích" }]}><Select options={[{ label: "Khách sạn", value: "KHACH_SAN" }, { label: "Phòng", value: "PHONG" }, { label: "Vé", value: "VE" }, { label: "Tour", value: "TOUR" }]} /></Form.Item>
          <Form.Item name="trangThai" label="Trạng thái"><Select options={[{ label: "Đang bật", value: 1 }, { label: "Đang tắt", value: 0 }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
