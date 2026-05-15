import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Spin, message } from "antd";
import axios from "axios";
import "../assets/css/CustomerTransactions.css";
import "../assets/css/CustomerProfile.css";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";
import {
  changeMyPassword,
  getMyProfile,
  type CustomerProfile as CustomerProfileDto,
  updateMyProfile,
} from "../services/customerProfileService";
import { updateCurrentSession } from "../utils/auth";

type ProfileFormValues = {
  ten: string;
  gioiTinh?: "Nam" | "Nữ" | "Khác";
  day?: number;
  month?: number;
  year?: number;
  thanhPho?: string;
  email?: string;
  sdt?: string;
};

type PasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const days = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
const months = Array.from({ length: 12 }, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => ({ label: `${currentYear - i}`, value: currentYear - i }));

function parseNgaySinh(ngaySinh?: string | null) {
  if (!ngaySinh) {
    return { day: undefined, month: undefined, year: undefined };
  }

  const date = new Date(ngaySinh);
  if (Number.isNaN(date.getTime())) {
    return { day: undefined, month: undefined, year: undefined };
  }

  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  };
}

function buildNgaySinh(values: ProfileFormValues) {
  if (!values.day || !values.month || !values.year) {
    return null;
  }

  const isoDate = new Date(Date.UTC(values.year, values.month - 1, values.day));
  if (
    isoDate.getUTCFullYear() !== values.year ||
    isoDate.getUTCMonth() !== values.month - 1 ||
    isoDate.getUTCDate() !== values.day
  ) {
    return null;
  }

  return isoDate.toISOString().slice(0, 10);
}

function toProfileFormValues(profile: CustomerProfileDto): ProfileFormValues {
  const { day, month, year } = parseNgaySinh(profile.ngaySinh);
  return {
    ten: profile.ten ?? "",
    gioiTinh: profile.gioiTinh ?? undefined,
    day,
    month,
    year,
    thanhPho: profile.thanhPho ?? "",
    email: profile.email ?? "",
    sdt: profile.sdt ?? "",
  };
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

function PersonalInfoSection({
  initialValues,
  username,
  loading,
  onSubmit,
}: {
  initialValues: ProfileFormValues | null;
  username: string;
  loading: boolean;
  onSubmit: (values: ProfileFormValues, form: ReturnType<typeof Form.useForm<ProfileFormValues>>[0]) => Promise<boolean>;
}) {
  const [form] = Form.useForm<ProfileFormValues>();
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!initialValues) {
      return;
    }
    form.setFieldsValue(initialValues);
    setIsChanged(false);
  }, [form, initialValues]);

  const handleReset = () => {
    if (!initialValues) {
      return;
    }
    form.setFieldsValue(initialValues);
    setIsChanged(false);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      const values = form.getFieldsValue(true) as ProfileFormValues;
      const validValues = await form.validateFields();
      const finalValues = { ...values, ...validValues };
      (window as Window & { __profileSaveProbe?: unknown }).__profileSaveProbe = {
        phase: "before-submit",
        values: finalValues,
      };
      const ok = await onSubmit(finalValues, form);
      (window as Window & { __profileSaveProbe?: unknown }).__profileSaveProbe = {
        phase: ok ? "saved" : "rejected",
        values: finalValues,
      };
      if (ok) {
        setIsChanged(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-card">
      <h3 className="profile-card-title">Dữ liệu cá nhân</h3>
      <p className="profile-card-subtext">Thông tin này dùng để tự động điền thông tin hành khách.</p>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => setIsChanged(true)}
        requiredMark={false}
        disabled={loading}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label={<span style={{ fontWeight: 600 }}>Tên đăng nhập</span>}>
              <Input size="large" value={username} disabled />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<span style={{ fontWeight: 600 }}>Tên đầy đủ</span>}
          name="ten"
          rules={[{ required: true, message: "Vui lòng nhập tên đầy đủ" }]}
        >
          <Input size="large" />
        </Form.Item>
        <div className="form-hint" style={{ marginTop: "-16px", marginBottom: "24px" }}>
          Tên phải giống trên CCCD/Hộ chiếu
        </div>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label={<span style={{ fontWeight: 600 }}>Giới tính</span>} name="gioiTinh">
              <Select
                size="large"
                allowClear
                options={[
                  { label: "Nam", value: "Nam" },
                  { label: "Nữ", value: "Nữ" },
                  { label: "Khác", value: "Khác" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={<span style={{ fontWeight: 600 }}>Ngày sinh</span>} style={{ marginBottom: 0 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="day">
                <Select size="large" placeholder="Ngày" options={days} allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="month">
                <Select size="large" placeholder="Tháng" options={months} allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="year">
                <Select size="large" placeholder="Năm" options={years} allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label={<span style={{ fontWeight: 600 }}>Thành phố cư trú</span>} name="thanhPho">
          <Input size="large" placeholder="Ví dụ: Hà Nội" />
        </Form.Item>

        <h3 className="profile-card-title" style={{ marginTop: 8 }}>Thông tin liên hệ</h3>
        <p className="profile-card-subtext">Email và số điện thoại dùng để nhận thông báo và hỗ trợ đặt chỗ.</p>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Email</span>}
              name="email"
              rules={[{ type: "email", message: "Email không hợp lệ" }]}
            >
              <Input size="large" placeholder="you@example.com" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={<span style={{ fontWeight: 600 }}>Số di động</span>} name="sdt">
              <Input size="large" placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: "flex", gap: "12px", marginTop: "32px", justifyContent: "flex-end" }}>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Có lẽ để sau
          </button>
          <Button type="primary" className="btn-primary" disabled={!isChanged || isSaving} onClick={() => void handleSaveClick()}>
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

function PasswordSecuritySection({ onSubmit }: { onSubmit: (values: PasswordFormValues) => Promise<void> }) {
  const [form] = Form.useForm<PasswordFormValues>();
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFinish = async (values: PasswordFormValues) => {
    setIsSaving(true);
    try {
      await onSubmit(values);
      form.resetFields();
      setIsChanged(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePasswordClick = async () => {
    const values = await form.validateFields();
    await handleFinish(values);
  };

  return (
    <div className="profile-card">
      <h3 className="profile-card-title">Mật khẩu & Bảo mật</h3>
      <p className="profile-card-subtext">Đổi mật khẩu để tăng độ an toàn cho tài khoản của bạn.</p>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => setIsChanged(true)}
        onFinish={handleFinish}
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Mật khẩu hiện tại</span>}
              name="oldPassword"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
            >
              <Input.Password size="large" autoComplete="current-password" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Mật khẩu mới</span>}
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 6, message: "Mật khẩu mới phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password size="large" autoComplete="new-password" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Xác nhận mật khẩu mới</span>}
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Xác nhận mật khẩu không khớp"));
                  },
                }),
              ]}
            >
              <Input.Password size="large" autoComplete="new-password" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" className="btn-primary" disabled={!isChanged || isSaving} onClick={() => void handleChangePasswordClick()}>
            {isSaving ? "Đang cập nhật..." : "Đổi mật khẩu"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default function CustomerProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CustomerProfileDto | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (error) {
        void messageApi.error(getApiErrorMessage(error, "Không tải được thông tin tài khoản."));
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [messageApi]);

  const initialValues = useMemo(() => (profile ? toProfileFormValues(profile) : null), [profile]);

  const handleProfileSubmit = async (
    values: ProfileFormValues,
    form: ReturnType<typeof Form.useForm<ProfileFormValues>>[0],
  ): Promise<boolean> => {
    const someDateSelected = values.day || values.month || values.year;
    const ngaySinh = buildNgaySinh(values);

    if (someDateSelected && !ngaySinh) {
      void messageApi.error("Ngày sinh không hợp lệ.");
      return false;
    }

    const payload = {
      ten: values.ten.trim(),
      email: values.email?.trim() || null,
      sdt: values.sdt?.trim() || null,
      gioiTinh: values.gioiTinh ?? null,
      ngaySinh,
      thanhPho: values.thanhPho?.trim() || null,
    };

    try {
      await updateMyProfile(payload);
      const nextProfile = profile
        ? { ...profile, ...payload }
        : {
            maUser: 0,
            username: "",
            vaiTro: "CUSTOMER",
            trangThai: true,
            ...payload,
          };
      setProfile(nextProfile);
      updateCurrentSession({ fullName: payload.ten, email: payload.email ?? "" });
      form.setFieldsValue(toProfileFormValues(nextProfile));
      void messageApi.success("Cập nhật thông tin thành công.");
      return true;
    } catch (error) {
      void messageApi.error(getApiErrorMessage(error, "Không thể cập nhật thông tin."));
      return false;
    }
  };

  const handlePasswordSubmit = async (values: PasswordFormValues) => {
    try {
      await changeMyPassword({ oldPassword: values.oldPassword, newPassword: values.newPassword });
      void messageApi.success("Đổi mật khẩu thành công.");
    } catch (error) {
      void messageApi.error(getApiErrorMessage(error, "Không thể đổi mật khẩu."));
    }
  };

  return (
    <div className="profile-page transactions-page">
      {contextHolder}
      <div className="profile-container transactions-container">
        <CustomerSidebar activeKey="profile" />

        <div className="profile-content transactions-content">
          <h2 className="profile-title">Cài đặt</h2>
          {loading ? (
            <div className="profile-card" style={{ display: "grid", placeItems: "center", minHeight: 240 }}>
              <Spin size="large" />
            </div>
          ) : profile ? (
            <>
              <PersonalInfoSection
                initialValues={initialValues}
                username={profile.username}
                loading={loading}
                onSubmit={handleProfileSubmit}
              />
              <PasswordSecuritySection onSubmit={handlePasswordSubmit} />
            </>
          ) : (
            <div className="profile-card">
              <h3 className="profile-card-title">Không tải được dữ liệu</h3>
              <p className="profile-card-subtext">Vui lòng tải lại trang hoặc đăng nhập lại.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
