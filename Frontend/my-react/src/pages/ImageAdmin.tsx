import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Badge, Button, Card, Empty, Image, Input, Popconfirm, Select, Segmented, Space, Table, Tag, Typography, message } from "antd";
import type { TableProps } from "antd";
import { Image as ImageIcon, LayoutGrid, List, PencilLine, Trash2, UploadCloud } from "lucide-react";
import ImageGrid from "../components/ImageGrid";
import ImageModal from "../components/ImageModal";
import { useImages, useMutateImage } from "../hooks/useImages";
import type { ImageItem, ImageModalMode, ImageQueryParams, ImageSortField, SortOrder, ViewMode } from "../types/image";

const { Title, Text } = Typography;

const pageContainerStyle: CSSProperties = { padding: 24, background: "linear-gradient(180deg, #f7f8fc 0%, #f2f4f8 100%)", minHeight: "100%" };
const cardStyle: CSSProperties = { borderRadius: 20, border: "1px solid #eceef5", boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)" };
const statCardStyle: CSSProperties = { ...cardStyle, height: "100%", background: "#ffffff" };

const sortOptions: { label: string; value: ImageSortField }[] = [
  { label: "Ngày tạo", value: "ngayTao" },
  { label: "Alt text", value: "altText" },
  { label: "Thứ tự", value: "thuTu" },
];

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleDateString("vi-VN");
}

export default function ImageAdmin() {
  const [searchText, setSearchText] = useState("");
  const [avatarOnly, setAvatarOnly] = useState(false);
  const [sortBy, setSortBy] = useState<ImageSortField>("ngayTao");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ImageModalMode>("url");
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);

  const queryParams = useMemo<ImageQueryParams>(() => ({
    isAvatar: avatarOnly ? 1 : undefined,
    search: searchText.trim() || undefined,
  }), [avatarOnly, searchText]);

  const { data = [], isLoading, isFetching, refetch } = useImages(queryParams);
  const mutations = useMutateImage();

  const stats = useMemo(() => ({
    total: data.length,
    avatar: data.filter((item) => item.isAvatar === 1).length,
    normal: data.filter((item) => item.isAvatar === 0).length,
    selected: selectedIds.length,
  }), [data, selectedIds]);

  const openCreateUrl = () => {
    setEditingImage(null);
    setModalMode("url");
    setModalOpen(true);
  };

  const openUpload = () => {
    setEditingImage(null);
    setModalMode("upload");
    setModalOpen(true);
  };

  const openEdit = (item: ImageItem) => {
    setEditingImage(item);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleToggleSelect = (id: number, selected: boolean) => {
    setSelectedIds((current) => selected ? Array.from(new Set([...current, id])) : current.filter((item) => item !== id));
  };

  const handleDelete = async (item: ImageItem) => {
    await mutations.deleteImageAsync(item.maHinhAnh);
    setSelectedIds((current) => current.filter((id) => id !== item.maHinhAnh));
    message.success("Đã xóa hình ảnh.");
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    await mutations.deleteImagesAsync(selectedIds);
    setSelectedIds([]);
    message.success(`Đã xóa ${selectedIds.length} hình ảnh.`);
  };

  const columns: TableProps<ImageItem>["columns"] = [
    {
      title: "Ảnh",
      dataIndex: "urlAnh",
      key: "urlAnh",
      width: 120,
      render: (value: string, record) => <Image src={value} alt={record.altText ?? "Ảnh dịch vụ"} width={72} height={54} style={{ objectFit: "cover", borderRadius: 8 }} />,
    },
    {
      title: "Alt text",
      dataIndex: "altText",
      key: "altText",
      sorter: true,
      sortOrder: sortBy === "altText" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
      render: (value: string | null) => <Text>{value || "--"}</Text>,
    },
    { title: "Avatar", dataIndex: "isAvatar", key: "isAvatar", width: 110, render: (value: 0 | 1) => value === 1 ? <Tag color="gold">Avatar</Tag> : <Tag>Ảnh phụ</Tag> },
    {
      title: "Thứ tự",
      dataIndex: "thuTu",
      key: "thuTu",
      width: 110,
      sorter: true,
      sortOrder: sortBy === "thuTu" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngayTao",
      key: "ngayTao",
      width: 140,
      sorter: true,
      sortOrder: sortBy === "ngayTao" ? (sortOrder === "asc" ? "ascend" : "descend") : null,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      width: 130,
      render: (_value, record) => (
        <Space>
          <Button type="text" icon={<PencilLine size={16} color="#7c3aed" />} onClick={() => openEdit(record)} />
          <Popconfirm title="Xóa hình ảnh?" description="Bạn có chắc muốn xóa hình ảnh này?" okText="Xóa" cancelText="Hủy" onConfirm={() => void handleDelete(record)}>
            <Button type="text" danger icon={<Trash2 size={16} color="#ef4444" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange: TableProps<ImageItem>["onChange"] = (_pagination, _filters, sorter) => {
    if (Array.isArray(sorter)) return;
    const field = sorter.field;
    if (field === "ngayTao" || field === "altText" || field === "thuTu") {
      setSortBy(field);
      setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    }
  };

  return (
    <div style={pageContainerStyle}>
      <Space orientation="vertical" size={20} style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <Title level={3} style={{ margin: 0, color: "#182338" }}>Quản lý hình ảnh</Title>
            <Text style={{ color: "#7d869c" }}>Quản lý thư viện ảnh dịch vụ, avatar, thứ tự hiển thị và mô tả ảnh.</Text>
          </div>
          <Space wrap>
            <Button icon={<ImageIcon size={16} />} onClick={openCreateUrl}>Thêm URL</Button>
            <Button type="primary" icon={<UploadCloud size={16} />} onClick={openUpload} style={{ background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)", borderColor: "#7c3aed" }}>Upload ảnh</Button>
          </Space>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <Card style={statCardStyle}><Space align="start"><Badge color="#7c3aed" /><div><Text type="secondary">Tổng ảnh</Text><Title level={3} style={{ margin: "4px 0 0" }}>{stats.total}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#f59e0b" /><div><Text type="secondary">Ảnh avatar</Text><Title level={3} style={{ margin: "4px 0 0" }}>{stats.avatar}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#2563eb" /><div><Text type="secondary">Ảnh phụ</Text><Title level={3} style={{ margin: "4px 0 0" }}>{stats.normal}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#16a34a" /><div><Text type="secondary">Đã chọn</Text><Title level={3} style={{ margin: "4px 0 0" }}>{stats.selected}</Title></div></Space></Card>
        </div>

        <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
          <Space orientation="vertical" size={16} style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <Title level={4} style={{ margin: 0, color: "#1f2a44" }}>Danh sách hình ảnh</Title>
                <Text style={{ color: "#7d869c" }}>Có {data.length} ảnh đang hiển thị.</Text>
              </div>
              <Space wrap>
                <Input allowClear placeholder="Tìm alt text..." value={searchText} onChange={(event) => setSearchText(event.target.value)} style={{ width: 220 }} />
                <Select value={avatarOnly ? "avatar" : "all"} style={{ width: 150 }} onChange={(value) => setAvatarOnly(value === "avatar")} options={[{ label: "Tất cả ảnh", value: "all" }, { label: "Chỉ avatar", value: "avatar" }]} />
                <Select value={sortBy} style={{ width: 140 }} onChange={(value) => setSortBy(value)} options={sortOptions} />
                <Segmented value={sortOrder} onChange={(value) => setSortOrder(value as SortOrder)} options={[{ label: "Tăng", value: "asc" }, { label: "Giảm", value: "desc" }]} />
                <Segmented value={viewMode} onChange={(value) => setViewMode(value as ViewMode)} options={[{ label: <LayoutGrid size={16} />, value: "grid" }, { label: <List size={16} />, value: "list" }]} />
                <Popconfirm title="Xóa nhiều ảnh?" description={`Bạn có chắc muốn xóa ${selectedIds.length} ảnh đã chọn?`} okText="Xóa" cancelText="Hủy" disabled={selectedIds.length === 0} onConfirm={() => void handleBulkDelete()}>
                  <Button danger disabled={selectedIds.length === 0 || mutations.isBulkDeleting}>Xóa đã chọn</Button>
                </Popconfirm>
                <Button onClick={() => void refetch()} loading={isFetching}>Làm mới</Button>
              </Space>
            </div>

            {viewMode === "grid" ? (
              <ImageGrid images={data} selectedIds={selectedIds} loading={isLoading} onToggleSelect={handleToggleSelect} onEdit={openEdit} onDelete={(item) => void handleDelete(item)} />
            ) : (
              <Table<ImageItem>
                rowKey="maHinhAnh"
                columns={columns}
                dataSource={data}
                loading={isLoading}
                onChange={handleTableChange}
                rowSelection={{
                  selectedRowKeys: selectedIds,
                  onChange: (keys) => setSelectedIds(keys.map((key) => Number(key))),
                }}
                locale={{ emptyText: <Empty description="Chưa có hình ảnh phù hợp" /> }}
                pagination={{ pageSize: 12, showSizeChanger: false }}
                scroll={{ x: 980 }}
              />
            )}
          </Space>
        </Card>
      </Space>

      <ImageModal
        open={modalOpen}
        mode={modalMode}
        editingImage={editingImage}
        loading={mutations.isCreatingUrl || mutations.isUploading || mutations.isUpdating}
        onClose={() => setModalOpen(false)}
        onCreateUrl={async (payload) => {
          const result = await mutations.createFromUrlAsync(payload);
          message.success("Đã thêm hình ảnh bằng URL.");
          return result;
        }}
        onUploadFile={async (payload) => {
          const result = await mutations.uploadFileAsync(payload);
          message.success("Đã upload hình ảnh.");
          return result;
        }}
        onUpdate={async (id, payload) => {
          const result = await mutations.updateImageAsync(id, payload);
          message.success("Đã cập nhật hình ảnh.");
          return result;
        }}
      />
    </div>
  );
}
