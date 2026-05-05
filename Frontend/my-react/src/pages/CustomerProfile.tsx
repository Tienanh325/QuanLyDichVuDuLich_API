import { useState, useEffect } from "react";

import { Form, Input, Select, Tabs, Row, Col } from "antd";
import {
  Plus,
} from "lucide-react";
import "../assets/css/CustomerTransactions.css"; // Reuse sidebar styles
import "../assets/css/CustomerProfile.css"; // Specific profile styles
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";

// --- MOCK DATA ---
const userMock = {
  name: "Anh Dương",
  provider: "Google",
  gender: "Nam",
  dob: {
    day: 3,
    month: "Tháng 2",
    year: 2005,
  },
  city: "",
  email: ["cuccut2k55@gmail.com"],
  phone: [],
};

// Generate days, months, years for selects
const days = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
const months = Array.from({ length: 12 }, (_, i) => ({ label: `Tháng ${i + 1}`, value: `Tháng ${i + 1}` }));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => ({ label: `${currentYear - i}`, value: currentYear - i }));

function PersonalInfoForm() {
  const [form] = Form.useForm();
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      name: userMock.name,
      gender: userMock.gender,
      day: userMock.dob.day,
      month: userMock.dob.month,
      year: userMock.dob.year,
      city: userMock.city,
    });
  }, [form]);

  const handleValuesChange = () => {
    setIsChanged(true);
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
    setIsChanged(false); // Reset after save
  };

  return (
    <div className="profile-card">
      <h3 className="profile-card-title">Dữ liệu cá nhân</h3>
      <p className="profile-card-subtext">Thông tin này dùng để tự động điền thông tin hành khách.</p>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          label={<span style={{ fontWeight: 600 }}>Tên đầy đủ</span>}
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên đầy đủ" }]}
        >
          <Input size="large" />
        </Form.Item>
        <div className="form-hint" style={{ marginTop: "-16px", marginBottom: "24px" }}>
          Tên phải giống trên CCCD/Hộ chiếu
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={<span style={{ fontWeight: 600 }}>Giới tính</span>} name="gender">
              <Select size="large" options={[{ label: "Nam", value: "Nam" }, { label: "Nữ", value: "Nữ" }, { label: "Khác", value: "Khác" }]} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={<span style={{ fontWeight: 600 }}>Ngày sinh</span>} style={{ marginBottom: 0 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="day">
                <Select size="large" placeholder="Ngày" options={days} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="month">
                <Select size="large" placeholder="Tháng" options={months} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="year">
                <Select size="large" placeholder="Năm" options={years} />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label={<span style={{ fontWeight: 600 }}>Thành phố cư trú</span>} name="city">
          <Input size="large" placeholder="Ví dụ: Hà Nội" />
        </Form.Item>

        <div style={{ display: "flex", gap: "12px", marginTop: "32px", justifyContent: "flex-end" }}>
          <button type="button" className="btn-secondary" onClick={() => form.resetFields()}>
            Có lẽ để sau
          </button>
          <button type="submit" className="btn-primary" disabled={!isChanged}>
            Lưu
          </button>
        </div>
      </Form>
    </div>
  );
}

function EmailSection() {
  return (
    <div className="profile-card">
      <h3 className="profile-card-title">Email</h3>
      <p className="profile-card-subtext">Chỉ có thể sử dụng tối đa 3 email</p>

      {userMock.email.map((email) => (
        <div key={email} className="contact-item">
          <div className="contact-item-val">{email}</div>
          <div className="contact-item-tag">Nơi nhận thông báo</div>
        </div>
      ))}

      {userMock.email.length < 3 && (
        <button className="btn-add">
          <Plus size={16} /> Thêm email
        </button>
      )}
    </div>
  );
}

function PhoneSection() {
  return (
    <div className="profile-card">
      <h3 className="profile-card-title">Số di động</h3>
      <p className="profile-card-subtext">Chỉ có thể sử dụng tối đa 3 số di động</p>

      {userMock.phone.length === 0 ? (
        <button className="btn-add">
          <Plus size={16} /> Thêm số di động
        </button>
      ) : (
        userMock.phone.map((phone, idx) => (
          <div key={idx} className="contact-item">
            <div className="contact-item-val">{phone}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default function CustomerProfile() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tabItems = [
    {
      key: "info",
      label: "Thông tin tài khoản",
      children: (
        <>
          <PersonalInfoForm />
          <EmailSection />
          <PhoneSection />
        </>
      ),
    },
    {
      key: "security",
      label: "Mật khẩu & Bảo mật",
      children: (
        <div className="profile-card">
          <h3 className="profile-card-title">Thiết lập mật khẩu</h3>
          <p className="profile-card-subtext">Bảo vệ tài khoản của bạn bằng mật khẩu mạnh.</p>
          {/* Placeholder for future implementation */}
          <button className="btn-secondary">Đổi mật khẩu</button>
        </div>
      ),
    },
  ];

  return (
    <div className="profile-page transactions-page">
      <div className="profile-container transactions-container">
        <CustomerSidebar activeKey="profile" />

        <div className="profile-content transactions-content">
          <h2 className="profile-title">Cài đặt</h2>
          <Tabs defaultActiveKey="info" items={tabItems} className="profile-tabs" />
        </div>
      </div>
    </div>
  );
}
