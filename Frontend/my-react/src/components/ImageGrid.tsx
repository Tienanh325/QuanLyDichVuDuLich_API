import { Card, Checkbox, Col, Empty, Image, Popconfirm, Row, Space, Tag, Typography, Button } from "antd";
import { PencilLine, Trash2 } from "lucide-react";
import type { ImageItem } from "../types/image";

const { Text } = Typography;

interface ImageGridProps {
  images: ImageItem[];
  selectedIds: number[];
  loading?: boolean;
  onToggleSelect: (id: number, selected: boolean) => void;
  onEdit: (image: ImageItem) => void;
  onDelete: (image: ImageItem) => void;
}


export default function ImageGrid({ images, selectedIds, loading, onToggleSelect, onEdit, onDelete }: ImageGridProps) {
  if (!loading && images.length === 0) {
    return <Empty description="Chưa có hình ảnh phù hợp" />;
  }

  return (
    <Row gutter={[16, 16]}>
      {images.map((item) => (
        <Col key={item.maHinhAnh} xs={24} sm={12} lg={8} xl={6}>
          <Card
            className="motion-admin-image-card"
            hoverable
            styles={{ body: { padding: 14 } }}
            cover={
              <div style={{ height: 180, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                <Checkbox checked={selectedIds.includes(item.maHinhAnh)} onChange={(event) => onToggleSelect(item.maHinhAnh, event.target.checked)} style={{ position: "absolute", top: 10, left: 10, zIndex: 1, background: "#fff", borderRadius: 4 }} />
                <Image src={item.urlAnh} alt={item.altText ?? "Ảnh"} style={{ maxHeight: 180, objectFit: "cover" }} />
              </div>
            }
          >
            <Space orientation="vertical" size={8} style={{ width: "100%" }}>
              <Space wrap>
                <Tag>#{item.maHinhAnh}</Tag>
              </Space>
              <Text strong ellipsis={{ tooltip: item.altText ?? "Không có alt text" }}>{item.altText || "Không có alt text"}</Text>
              <Text type="secondary">Thứ tự: {item.thuTu}</Text>
              <Text type="secondary">Thứ tự: {item.thuTu}</Text>
              <Space style={{ justifyContent: "flex-end", width: "100%" }}>
                <Button type="text" icon={<PencilLine size={16} color="#7c3aed" />} onClick={() => onEdit(item)} />
                <Popconfirm title="Xóa hình ảnh?" description="Bạn có chắc muốn xóa hình ảnh này?" okText="Xóa" cancelText="Hủy" onConfirm={() => onDelete(item)}>
                  <Button type="text" danger icon={<Trash2 size={16} color="#ef4444" />} />
                </Popconfirm>
              </Space>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
