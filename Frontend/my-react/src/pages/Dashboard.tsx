import { Card, Col, Row, Statistic } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const Dashboard = () => {
  return (
    <div>
      {/* TITLE */}
      <h2 style={{ marginBottom: 20 }}>Dashboard</h2>

      {/* STATISTICS */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đơn hàng"
              value={93}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={11280}
              prefix={<DollarOutlined />}
              suffix="₫"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lượt xem"
              value={9321}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* CONTENT */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} md={16}>
          <Card title="Biểu đồ doanh thu">
            <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              (Chart ở đây - có thể dùng recharts hoặc chart.js)
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Hoạt động gần đây">
            <ul>
              <li>Người dùng mới đăng ký</li>
              <li>Đơn hàng #123 đã thanh toán</li>
              <li>Cập nhật sản phẩm mới</li>
              <li>Admin đăng nhập</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;