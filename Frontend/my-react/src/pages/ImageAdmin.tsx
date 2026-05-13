import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Badge, Button, Card, Empty, Image, Input, Popconfirm, Segmented, Space, Table, Typography, message } from "antd";
import type { TableProps } from "antd";
import { Image as ImageIcon, LayoutGrid, List, PencilLine, Trash2, UploadCloud } from "lucide-react";
import ImageGrid from "../components/ImageGrid";
import ImageModal from "../components/ImageModal";
import { useImages, useMutateImage } from "../hooks/useImages";
import type { ImageItem, ImageModalMode, ImageQueryParams, ViewMode } from "../types/image";

const { Title, Text } = Typography;

const pageContainerStyle: CSSProperties = { padding: 24, background: "linear-gradient(180deg, #f7f8fc 0%, #f2f4f8 100%)", minHeight: "100%" };
const cardStyle: CSSProperties = { borderRadius: 20, border: "1px solid #eceef5", boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)" };
const statCardStyle: CSSProperties = { ...cardStyle, height: "100%", background: "#ffffff" };


export default function ImageAdmin() {
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ImageModalMode>("url");
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);

  const queryParams = useMemo<ImageQueryParams>(() => ({
    search: searchText.trim() || undefined,
  }), [searchText]);

  const { data = [], isLoading, isFetching, refetch } = useImages(queryParams);
  const mutations = useMutateImage();

  const stats = useMemo(() => ({
    fromUrl: data.filter((item) => !item.urlAnh.startsWith("/uploads/")).length,
    fromDevice: data.filter((item) => item.urlAnh.startsWith("/uploads/")).length,
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

  const handleTableChange: TableProps<ImageItem>["onChange"] = () => {};


  return (
    <div style={pageContainerStyle}>
      <Space orientation="vertical" size={20} style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <Title level={3} style={{ margin: 0, color: "#182338" }}>Quản lý hình ảnh</Title>
            <Text style={{ color: "#7d869c" }}>Quản lý thư viện ảnh và mô tả ảnh.</Text>
          </div>
          <Space wrap>
            <Button icon={<ImageIcon size={16} />} onClick={openCreateUrl}>Thêm URL</Button>
            <Button type="primary" icon={<UploadCloud size={16} />} onClick={openUpload} style={{ background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)", borderColor: "#7c3aed" }}>Upload ảnh</Button>
          </Space>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <Card style={statCardStyle}><Space align="start"><Badge color="#7c3aed" /><div><Text type="secondary">Tổng ảnh từ URL</Text><Title level={3} style={{ margin: "4px 0 0" }}>{stats.fromUrl}</Title></div></Space></Card>
          <Card style={statCardStyle}><Space align="start"><Badge color="#2563eb" /><div><Text type="secondary">Tổng ảnh từ máy</Text><Title level={3} style={{ margin: "4px 0 0" }}>{stats.fromDevice}</Title></div></Space></Card>
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
