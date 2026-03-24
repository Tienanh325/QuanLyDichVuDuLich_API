import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import axios from "axios";
import {
  Avatar,
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
  Typography,
  message,
} from "antd";
import type { TableProps } from "antd";
import { PencilLine, Plus, RefreshCw, Search, Trash2, UserRound } from "lucide-react";

const { Title, Text } = Typography;

type UserLinkStatus = "linked" | "unlinked";

interface UserItem {
  maNguoiDung: number;
  ten: string;
  sdt: string;
  email: string;
  accID: number | null;
}

interface UserFormValues {
  ten: string;
  sdt: string;
  email: string;
  accID: number | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const USER_API_PATH = import.meta.env.VITE_NGUOI_DUNG_API_PATH ?? "/api/nguoi-dung";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const mockUsers: UserItem[] = [
  { maNguoiDung: 1, ten: "Nguyen Minh Anh", sdt: "0901234567", email: "minhanh@gmail.com", accID: 101 },
  { maNguoiDung: 2, ten: "Tran Gia Bao", sdt: "0912345678", email: "giabao@gmail.com", accID: 205 },
  { maNguoiDung: 3, ten: "Le Thu Ha", sdt: "0988881234", email: "thuha@gmail.com", accID: null },
  { maNguoiDung: 4, ten: "Pham Quoc Huy", sdt: "0977654321", email: "quochuy@gmail.com", accID: 330 },
];

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (typeof payload === "object" && payload !== null) {
    const data = payload as { data?: unknown; items?: unknown };
    if (Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data.items)) {
      return data.items;
    }
  }
  return [];
}

function normalizeUser(input: unknown, index: number): UserItem {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const accValue = raw.accID ?? raw.accountId ?? raw.accId;

  return {
    maNguoiDung: Number(raw.maNguoiDung ?? raw.id ?? index + 1),
    ten: String(raw.ten ?? raw.name ?? `Nguoi dung ${index + 1}`),
    sdt: String(raw.sdt ?? raw.soDienThoai ?? raw.phone ?? ""),
    email: String(raw.email ?? ""),
    accID:
      accValue === null || accValue === undefined || accValue === ""
        ? null
        : Number(accValue),
  };
}

async function fetchUsers(): Promise<UserItem[]> {
  const response = await apiClient.get(USER_API_PATH);
  return extractArray(response.data).map(normalizeUser);
}

async function createUser(item: UserItem): Promise<UserItem> {
  const response = await apiClient.post(USER_API_PATH, item);
  return normalizeUser(response.data, 0);
}

async function updateUser(item: UserItem): Promise<UserItem> {
  const response = await apiClient.put(`${USER_API_PATH}/${item.maNguoiDung}`, item);
  return normalizeUser(response.data, 0);
}

async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`${USER_API_PATH}/${id}`);
}

function getLinkStatus(user: UserItem): UserLinkStatus {
  return user.accID && user.accID > 0 ? "linked" : "unlinked";
}

function getStatusMeta(status: UserLinkStatus): { label: string; color: string } {
  return status === "linked"
    ? { label: "Da lien ket tai khoan", color: "green" }
    : { label: "Chua lien ket", color: "gold" };
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
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

export default function KhachHang() {
  const [form] = Form.useForm<UserFormValues>();
  const [data, setData] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<UserLinkStatus | "all">("all");
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const loadUsers = async () => {
    setLoading(true);

    try {
      const users = await fetchUsers();
      setData(users.length > 0 ? users : mockUsers);
      setIsUsingMockData(users.length === 0);

      if (users.length === 0) {
        message.info("API chua tra du lieu nguoi dung, dang hien thi du lieu mau.");
      }
    } catch (error) {
      setData(mockUsers);
      setIsUsingMockData(true);

      if (axios.isAxiosError(error)) {
        message.warning(`Khong ket noi duoc API ${API_BASE_URL}${USER_API_PATH}. Dang dung du lieu mau.`);
      } else {
        message.warning("Co loi khi tai du lieu nguoi dung. Dang dung du lieu mau.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredData = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return data.filter((item) => {
      const matchesSearch =
        keyword.length === 0 ||
        String(item.maNguoiDung).includes(keyword) ||
        item.ten.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.sdt.toLowerCase().includes(keyword);
      const matchesStatus = filterStatus === "all" || getLinkStatus(item) === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [data, filterStatus, searchText]);

  const stats = useMemo(() => {
    const linked = data.filter((item) => getLinkStatus(item) === "linked").length;
    const unlinked = data.filter((item) => getLinkStatus(item) === "unlinked").length;
    return {
      total: data.length,
      linked,
      unlinked,
      withEmail: data.filter((item) => item.email.trim().length > 0).length,
    };
  }, [data]);

  const resetForm = () => {
    form.resetFields();
    setEditingItem(null);
  };

  const openCreateModal = () => {
    resetForm();
    form.setFieldsValue({
      accID: null,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: UserItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      ten: item.ten,
      sdt: item.sdt,
      email: item.email,
      accID: item.accID,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item: UserItem) => {
    const previous = data;
    setData((current) => current.filter((entry) => entry.maNguoiDung !== item.maNguoiDung));

    if (isUsingMockData) {
      message.success(`Da xoa nguoi dung ${item.ten} tren du lieu mau.`);
      return;
    }

    try {
      await deleteUser(item.maNguoiDung);
      message.success(`Da xoa nguoi dung ${item.ten}.`);
    } catch {
      setData(previous);
      message.error("Xoa khong thanh cong, du lieu da duoc hoan lai.");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const payload: UserItem = {
        maNguoiDung: editingItem?.maNguoiDung ?? Date.now(),
        ten: values.ten.trim(),
        sdt: values.sdt.trim(),
        email: values.email.trim(),
        accID:
          values.accID === null || values.accID === undefined || values.accID === 0
            ? null
            : values.accID,
      };

      if (isUsingMockData) {
        setData((current) =>
          editingItem
            ? current.map((item) => (item.maNguoiDung === editingItem.maNguoiDung ? payload : item))
            : [payload, ...current],
        );
        message.success(editingItem ? "Da cap nhat nguoi dung tren du lieu mau." : "Da them nguoi dung tren du lieu mau.");
        setModalOpen(false);
        resetForm();
        return;
      }

      if (editingItem) {
        const updated = await updateUser(payload);
        setData((current) =>
          current.map((item) => (item.maNguoiDung === editingItem.maNguoiDung ? updated : item)),
        );
        message.success("Cap nhat nguoi dung thanh cong.");
      } else {
        const created = await createUser(payload);
        setData((current) => [created, ...current]);
        message.success("Them nguoi dung thanh cong.");
      }

      setModalOpen(false);
      resetForm();
    } catch (error) {
      if (!axios.isAxiosError(error) && !(error instanceof Error)) {
        return;
      }
      if (axios.isAxiosError(error)) {
        message.error("Khong luu duoc du lieu len API. Kiem tra endpoint hoac backend roi thu lai.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableProps<UserItem>["columns"] = [
    {
      title: "Nguoi dung",
      key: "profile",
      render: (_value, record) => (
        <Space size={12}>
          <Avatar style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }}>
            {getInitials(record.ten)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 700, color: "#1f2a44" }}>{record.ten}</div>
            <Text style={{ color: "#7d869c", fontSize: 13 }}>Ma nguoi dung: {record.maNguoiDung}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Lien he",
      key: "contact",
      render: (_value, record) => (
        <div>
          <div style={{ color: "#55607a", fontSize: 13 }}>{record.email || "--"}</div>
          <div style={{ color: "#55607a", fontSize: 13 }}>{record.sdt || "--"}</div>
        </div>
      ),
    },
    {
      title: "Tai khoan",
      dataIndex: "accID",
      key: "accID",
      render: (value: number | null) =>
        value ? <Tag color="blue">accID: {value}</Tag> : <Tag>Chua co accID</Tag>,
    },
    {
      title: "Trang thai",
      key: "status",
      render: (_value, record) => {
        const meta = getStatusMeta(getLinkStatus(record));
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: "Thao tac",
      key: "actions",
      align: "center",
      render: (_value, record) => (
        <Space size="middle">
          <Button type="text" icon={<PencilLine size={16} color="#7c3aed" />} onClick={() => openEditModal(record)} />
          <Popconfirm title="Xoa nguoi dung?" description={`Ban co chac muon xoa ${record.ten}?`} okText="Xoa" cancelText="Huy" onConfirm={() => void handleDelete(record)}>
            <Button type="text" danger icon={<Trash2 size={16} color="#ef4444" />} />
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
            <Title level={3} style={{ margin: 0, color: "#182338" }}>Quan ly nguoi dung</Title>
            <Text style={{ color: "#7d869c" }}>
              Giao dien theo kieu cac web lon: uu tien tim kiem nhanh, trang thai lien ket tai khoan va thong tin lien he ro rang.
            </Text>
          </div>

          <Space wrap>
            <Tag color={isUsingMockData ? "gold" : "green"} style={{ padding: "6px 10px" }}>
              {isUsingMockData ? "Dang hien thi du lieu mau" : `API: ${API_BASE_URL}${USER_API_PATH}`}
            </Tag>
            <Button icon={<RefreshCw size={16} />} onClick={() => void loadUsers()}>Tai lai</Button>
          </Space>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#7c3aed" />
              <div>
                <Text style={{ color: "#7d869c" }}>Tong nguoi dung</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.total}</Title>
              </div>
            </Space>
          </Card>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#16a34a" />
              <div>
                <Text style={{ color: "#7d869c" }}>Da lien ket</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.linked}</Title>
              </div>
            </Space>
          </Card>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#eab308" />
              <div>
                <Text style={{ color: "#7d869c" }}>Chua lien ket</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.unlinked}</Title>
              </div>
            </Space>
          </Card>
          <Card style={statCardStyle}>
            <Space align="start">
              <Badge color="#2563eb" />
              <div>
                <Text style={{ color: "#7d869c" }}>Co email</Text>
                <Title level={3} style={{ margin: "4px 0 0", color: "#182338" }}>{stats.withEmail}</Title>
              </div>
            </Space>
          </Card>
        </div>

        <Card style={cardStyle} styles={{ body: { padding: 20 } }}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <Space size={8}>
                  <UserRound size={18} color="#2563eb" />
                  <Title level={4} style={{ margin: 0, color: "#1f2a44" }}>Danh sach nguoi dung</Title>
                </Space>
                <Text style={{ color: "#7d869c" }}>Co {filteredData.length} nguoi dung dang hien thi trong bang.</Text>
              </div>

              <Space wrap>
                <Input
                  allowClear
                  prefix={<Search size={16} color="#94a3b8" />}
                  placeholder="Tim ten, email, so dien thoai..."
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  style={{ width: 260 }}
                />
                <Select
                  value={filterStatus}
                  style={{ width: 180 }}
                  onChange={(value) => setFilterStatus(value)}
                  options={[
                    { label: "Tat ca trang thai", value: "all" },
                    { label: "Da lien ket tai khoan", value: "linked" },
                    { label: "Chua lien ket", value: "unlinked" },
                  ]}
                />
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)", borderColor: "#7c3aed" }}
                  onClick={openCreateModal}
                >
                  Them moi
                </Button>
              </Space>
            </div>

            <Table<UserItem>
              rowKey="maNguoiDung"
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              pagination={{
                pageSize: 6,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} nguoi dung`,
              }}
              scroll={{ x: 980 }}
            />
          </Space>
        </Card>
      </Space>

      <Modal
        title={editingItem ? "Cap nhat nguoi dung" : "Them nguoi dung"}
        open={modalOpen}
        onOk={() => void handleSubmit()}
        onCancel={() => {
          setModalOpen(false);
          resetForm();
        }}
        okText={editingItem ? "Luu thay doi" : "Tao moi"}
        cancelText="Huy"
        confirmLoading={submitting}
      >
        <Form<UserFormValues> form={form} layout="vertical">
          <Form.Item label="Ten" name="ten" rules={[{ required: true, message: "Nhap ten nguoi dung." }]}>
            <Input />
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <Form.Item label="So dien thoai" name="sdt" rules={[{ required: true, message: "Nhap so dien thoai." }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Nhap email." }]}>
              <Input />
            </Form.Item>
          </div>
          <Form.Item label="accID" name="accID">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="De trong neu chua lien ket" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
