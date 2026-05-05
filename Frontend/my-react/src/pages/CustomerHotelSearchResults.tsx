import { useState } from "react";
import { Card, Button, Slider, Checkbox, Pagination, Rate, Row, Col, Typography, Tag, Space } from "antd";
import { Edit2, Map, MapPin, Star } from "lucide-react";
import { type HotelSearchState, formatHotelDateRange, formatHotelGuestSummary } from "../utils/hotelSearch";
import { hotelProperties } from "../utils/hotelBooking";
import { formatCurrencyVnd } from "../utils/flightSearch";

const { Title, Text } = Typography;

type CustomerHotelSearchResultsProps = {
  searchState: HotelSearchState;
  onStartNewSearch: () => void;
};

export default function CustomerHotelSearchResults({
  searchState,
  onStartNewSearch,
}: CustomerHotelSearchResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Sử dụng dữ liệu khách sạn có sẵn từ utils
  const hotels = hotelProperties;

  return (
    <div style={{ backgroundColor: "#f5f7fa", padding: "170px 0", minHeight: "100vh" }}>
      <div className="customer-shell__container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        
        {/* Thanh Tìm Kiếm (Search Bar) */}
        <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} bodyStyle={{ padding: "16px 24px" }}>
          <Row align="middle" justify="space-between">
            <Space size={48}>
              <div>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                  ĐIỂM ĐẾN
                </Text>
                <div style={{ fontSize: 16, fontWeight: 500, color: "#17324d" }}>
                  {searchState.destination}
                </div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                  NGÀY NHẬN PHÒNG
                </Text>
                <div style={{ fontSize: 16, fontWeight: 500, color: "#17324d" }}>
                  {formatHotelDateRange(searchState.checkInDate, searchState.checkOutDate)}
                </div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                  KHÁCH & PHÒNG
                </Text>
                <div style={{ fontSize: 16, fontWeight: 500, color: "#17324d" }}>
                  {formatHotelGuestSummary(searchState.adults, searchState.children, searchState.rooms)}
                </div>
              </div>
            </Space>
            <Button 
              type="text" 
              icon={<Edit2 size={16} />} 
              onClick={onStartNewSearch} 
              style={{ fontWeight: 600, color: "#0194f3" }}
            >
              Thay đổi
            </Button>
          </Row>
        </Card>

        <Row gutter={24}>
          {/* Cột trái (Sidebar Filter) */}
          <Col span={6}>
            <Card 
              title={<span style={{ fontWeight: 800, fontSize: 16, color: "#17324d" }}>Bộ lọc</span>} 
              extra={<Button type="link" style={{ padding: 0, fontWeight: 600, color: "#0194f3" }}>Đặt lại</Button>} 
              style={{ borderRadius: 12, marginBottom: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              {/* Phạm vi giá */}
              <div style={{ marginBottom: 28 }}>
                <Text strong style={{ fontSize: 15, color: "#17324d" }}>Phạm vi giá</Text>
                <Slider 
                  range 
                  defaultValue={[0, 20000000]} 
                  max={20000000} 
                  step={100000} 
                  tooltip={{ formatter: (value) => value ? formatCurrencyVnd(value) : "0 VND" }}
                />
                <Row justify="space-between" style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>0 VND</Text>
                  <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>20.000.000+ VND</Text>
                </Row>
              </div>
              
              {/* Hạng sao */}
              <div style={{ marginBottom: 28 }}>
                <Text strong style={{ fontSize: 15, color: "#17324d", display: "block", marginBottom: 12 }}>Hạng sao</Text>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Button 
                      key={star} 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        gap: 6,
                        borderRadius: 8,
                        borderColor: star === 3 ? "#0194f3" : "#d9d9d9",
                        backgroundColor: star === 3 ? "#e6f4ff" : "#fff"
                      }}
                    >
                      {star} <Star size={14} fill="#fadb14" color="#fadb14" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tiện ích */}
              <div style={{ marginBottom: 28 }}>
                <Text strong style={{ fontSize: 15, color: "#17324d", display: "block", marginBottom: 12 }}>Tiện ích</Text>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Checkbox>Hồ bơi</Checkbox>
                  <Checkbox defaultChecked>Wi-Fi miễn phí</Checkbox>
                  <Checkbox>Bữa sáng miễn phí</Checkbox>
                  <Checkbox>Phòng Gym</Checkbox>
                </div>
              </div>

              {/* Khu vực */}
              <div>
                <Text strong style={{ fontSize: 15, color: "#17324d", display: "block", marginBottom: 12 }}>Khu vực</Text>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Checkbox defaultChecked>Quận 1</Checkbox>
                  <Checkbox>Quận 3</Checkbox>
                  <Checkbox>Quận 7</Checkbox>
                </div>
              </div>
            </Card>

            {/* Xem trên bản đồ */}
            <Card 
              bodyStyle={{ padding: 0 }} 
              style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", position: "relative", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              <div style={{ height: 140, backgroundColor: "#e5e7eb", backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=Ho+Chi+Minh+City&zoom=13&size=400x400&maptype=roadmap')", backgroundSize: "cover", backgroundPosition: "center" }}>
              </div>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" }}>
                <Button icon={<Map size={16} />} style={{ fontWeight: 700, borderRadius: 20, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                  Xem trên bản đồ
                </Button>
              </div>
            </Card>
          </Col>

          {/* Cột phải (Danh sách khách sạn) */}
          <Col span={18}>
            <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 16, color: "#17324d" }}>Đang hiển thị <span style={{ color: "#0194f3" }}>{hotels.length}</span> khách sạn</Text>
              <Space align="center" size="middle">
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>Sắp xếp theo:</Text>
                <Space>
                  <Button type="primary" shape="round" style={{ fontWeight: 600, backgroundColor: "#e6f4ff", color: "#0194f3", border: "none" }}>Đề xuất</Button>
                  <Button shape="round" style={{ fontWeight: 600, color: "#17324d" }}>Giá thấp nhất</Button>
                  <Button shape="round" style={{ fontWeight: 600, color: "#17324d" }}>Điểm đánh giá</Button>
                </Space>
              </Space>
            </Row>

            {hotels.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((hotel, index) => (
              <Card 
                key={hotel.id}
                bodyStyle={{ padding: 0 }} 
                style={{ borderRadius: 16, marginBottom: 20, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}
              >
                <Row style={{ minHeight: 220 }}>
                  {/* Ảnh khách sạn */}
                  <Col span={8} style={{ position: "relative" }}>
                    <img 
                      src={hotel.gallery?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={hotel.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {/* Tag nổi bật */}
                    {index === 0 && (
                      <div style={{ position: "absolute", top: 12, left: 12 }}>
                        <Tag color="#ff5e1f" style={{ borderRadius: 4, fontWeight: 700, border: "none", padding: "4px 10px", fontSize: 12 }}>
                          Ưu đãi đặc biệt
                        </Tag>
                      </div>
                    )}
                    {index === 1 && (
                      <div style={{ position: "absolute", top: 12, left: 12 }}>
                        <Tag color="#0194f3" style={{ borderRadius: 4, fontWeight: 700, border: "none", padding: "4px 10px", fontSize: 12 }}>
                          Được yêu thích nhất
                        </Tag>
                      </div>
                    )}
                  </Col>
                  
                  {/* Nội dung khách sạn */}
                  <Col span={16} style={{ padding: "20px 24px", display: "flex", flexDirection: "column" }}>
                    <Row justify="space-between" align="top">
                      <Col span={18}>
                        <Rate disabled defaultValue={hotel.stars} style={{ fontSize: 14, color: "#fadb14", marginBottom: 8 }} />
                        <Title level={4} style={{ margin: "0 0 8px", color: "#17324d", fontSize: 22 }}>{hotel.name}</Title>
                        <Space style={{ color: "#647b92", fontSize: 14, marginBottom: 16 }}>
                          <MapPin size={16} color="#0194f3" /> {hotel.address || hotel.district}
                        </Space>
                        
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 24px", color: "#647b92", fontSize: 13 }}>
                          {hotel.amenities?.slice(0, 4).map(amenity => (
                            <Space key={amenity} size={6}>
                              <span style={{ color: "#8b9cad" }}>•</span> <Text style={{ color: "#647b92", fontWeight: 500 }}>{amenity}</Text>
                            </Space>
                          ))}
                        </div>
                      </Col>
                      
                      <Col span={6} style={{ textAlign: "right" }}>
                        <Space align="start" size={12}>
                          <div style={{ textAlign: "right", marginTop: 2 }}>
                            <div style={{ color: "#0194f3", fontWeight: 800, fontSize: 15 }}>
                              {hotel.rating >= 9 ? "Tuyệt vời" : hotel.rating >= 8.5 ? "Rất tốt" : "Tốt"}
                            </div>
                            <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>{hotel.reviewCount} nhận xét</Text>
                          </div>
                          <div style={{ 
                            backgroundColor: "#0194f3", 
                            color: "white", 
                            fontWeight: 900, 
                            fontSize: 18, 
                            padding: "6px 10px", 
                            borderRadius: 10, 
                            borderBottomRightRadius: 0,
                            lineHeight: 1 
                          }}>
                            {hotel.rating.toFixed(1)}
                          </div>
                        </Space>
                      </Col>
                    </Row>

                    {/* Phần giá và Nút chọn */}
                    <div style={{ marginTop: "auto", paddingTop: 16, display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
                      <div style={{ textAlign: "right" }}>
                        {hotel.originalPrice ? (
                          <Text delete type="secondary" style={{ fontSize: 14, display: "block", marginBottom: 2, fontWeight: 500 }}>
                            {formatCurrencyVnd(hotel.originalPrice)}
                          </Text>
                        ) : <div style={{ height: 22 }}></div>}
                        <div style={{ color: "#ff5e1f", fontSize: 26, fontWeight: 900, lineHeight: 1 }}>
                          {formatCurrencyVnd(hotel.nightlyPrice)}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 6, fontWeight: 500 }}>bao gồm thuế và phí</Text>
                        <Button 
                          type="primary" 
                          style={{ 
                            marginTop: 16, 
                            height: 44, 
                            padding: "0 32px", 
                            borderRadius: 8, 
                            fontWeight: 700, 
                            fontSize: 16,
                            backgroundColor: "#0194f3"
                          }}
                        >
                          Chọn phòng
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}

            <Row justify="center" style={{ marginTop: 32, marginBottom: 40 }}>
              <Pagination 
                current={currentPage} 
                onChange={setCurrentPage} 
                total={hotels.length} 
                pageSize={pageSize} 
                showSizeChanger={false}
              />
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}
