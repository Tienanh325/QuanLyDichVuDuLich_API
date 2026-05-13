import { useEffect, useState } from "react";
import type { UploadFile } from "antd";
import { Form, Input, InputNumber, Modal, Segmented, Upload, Typography, Image, Space } from "antd";
import { UploadCloud } from "lucide-react";
import type { ImageFormValues, ImageItem, ImageModalMode, ImageUpdatePayload, ImageUploadPayload, ImageUrlPayload } from "../types/image";

const { Text } = Typography;

interface ImageModalProps {
  open: boolean;
  mode: ImageModalMode;
  editingImage: ImageItem | null;
  loading: boolean;
  onClose: () => void;
  onCreateUrl: (payload: ImageUrlPayload) => Promise<ImageItem>;
  onUploadFile: (payload: ImageUploadPayload) => Promise<ImageItem>;
  onUpdate: (id: number, payload: ImageUpdatePayload) => Promise<ImageItem>;
}

export default function ImageModal({ open, mode, editingImage, loading, onClose, onCreateUrl, onUploadFile, onUpdate }: ImageModalProps) {
  const [form] = Form.useForm<ImageFormValues>();
  const [flow, setFlow] = useState<"url" | "upload">(mode === "upload" ? "upload" : "url");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const watchedUrl = Form.useWatch("urlAnh", form);

  const isEdit = mode === "edit" && editingImage !== null;

  useEffect(() => {
    if (!open) return;
    setFlow(mode === "upload" ? "upload" : "url");
    setFileList([]);
    setPreviewUrl("");
    if (editingImage) {
      form.setFieldsValue({
        urlAnh: editingImage.urlAnh,
        altText: editingImage.altText ?? "",
        thuTu: editingImage.thuTu,
      });
      setPreviewUrl(editingImage.urlAnh);
    } else {
      form.resetFields();
      form.setFieldsValue({ thuTu: 0 });
    }
  }, [editingImage, form, mode, open]);

  useEffect(() => {
    if (isEdit || flow === "url") {
      setPreviewUrl(typeof watchedUrl === "string" ? watchedUrl.trim() : "");
    }
  }, [flow, isEdit, watchedUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const title = isEdit ? "Cập nhật hình ảnh" : flow === "upload" ? "Upload hình ảnh" : "Thêm hình ảnh bằng URL";

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const altText = values.altText?.trim() || null;
      const thuTu = Number(values.thuTu ?? 0);

      if (isEdit && editingImage) {
        const urlAnh = values.urlAnh?.trim();
        if (!urlAnh) return;
        await onUpdate(editingImage.maHinhAnh, { urlAnh, altText, thuTu });
        onClose();
        return;
      }

      if (flow === "url") {
        const urlAnh = values.urlAnh?.trim();
        if (!urlAnh) return;
        await onCreateUrl({ urlAnh, altText, thuTu });
        onClose();
        return;
      }

      const file = fileList[0]?.originFileObj;
      if (!file) return;
      await onUploadFile({ file, altText, isAvatar, thuTu });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={() => void handleSubmit()}
      onCancel={onClose}
      okText={isEdit ? "Lưu thay đổi" : "Tạo mới"}
      cancelText="Hủy"
      confirmLoading={loading}
      width={760}
      destroyOnHidden
    >
      <Space orientation="vertical" size={16} style={{ width: "100%" }}>
        {!isEdit && (
          <Segmented
            value={flow}
            onChange={(value) => {
              setFlow(value as "url" | "upload");
              setFileList([]);
              setPreviewUrl("");
              form.setFieldValue("urlAnh", undefined);
            }}
            options={[
              { label: "Chèn URL", value: "url" },
              { label: "Upload file", value: "upload" },
            ]}
          />
        )}

        <Alert type="info" title="Bật Avatar nếu ảnh này là ảnh đại diện." showIcon />

        <Form<ImageFormValues> form={form} layout="vertical">
          <Form.Item label="Thứ tự" name="thuTu">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          {(isEdit || flow === "url") && (
            <Form.Item label="URL ảnh" name="urlAnh" rules={[{ required: true, message: "Nhập URL ảnh." }, { type: "url", message: "URL ảnh không hợp lệ." }]}>
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>
          )}

          {!isEdit && flow === "upload" && (
            <Form.Item label="File ảnh" required validateStatus={fileList.length === 0 ? undefined : "success"}>
              <Upload
                accept="image/*"
                maxCount={1}
                fileList={fileList}
                beforeUpload={() => false}
                onChange={({ fileList: nextList }) => {
                  setFileList(nextList);
                  const file = nextList[0]?.originFileObj;
                  if (file) {
                    const nextUrl = URL.createObjectURL(file);
                    setPreviewUrl((current) => {
                      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
                      return nextUrl;
                    });
                  } else {
                    setPreviewUrl("");
                  }
                }}
              >
                <div style={{ border: "1px dashed #cbd5e1", borderRadius: 12, padding: 24, textAlign: "center", cursor: "pointer" }}>
                  <UploadCloud size={28} color="#7c3aed" />
                  <div style={{ marginTop: 8 }}>Chọn ảnh từ máy tính</div>
                </div>
              </Upload>
            </Form.Item>
          )}

          <Form.Item label="Alt text" name="altText">
            <Input placeholder="Mô tả ngắn cho ảnh" />
          </Form.Item>

          <Form.Item label="Đặt làm avatar" name="isAvatar" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>

        <div>
          <Text strong>Preview</Text>
          <div style={{ marginTop: 8, minHeight: 220, border: "1px solid #e5e7eb", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", overflow: "hidden" }}>
            {previewUrl ? <Image src={previewUrl} alt="Preview" style={{ maxHeight: 260, objectFit: "contain" }} /> : <Text type="secondary">Chưa có ảnh preview</Text>}
          </div>
        </div>
      </Space>
    </Modal>
  );
}
