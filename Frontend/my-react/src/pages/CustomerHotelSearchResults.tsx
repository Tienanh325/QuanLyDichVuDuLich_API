import { useState, useEffect, useCallback, useMemo } from "react";
import "../assets/css/CustomerHotelSearchResults.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Slider, Pagination, Rate, Row, Col, Typography, Tag, Space, Spin, Empty } from "antd";
import { Edit2, Map, MapPin, Star } from "lucide-react";
import { type HotelSearchState, formatHotelDateRange, formatHotelGuestSummary } from "../utils/hotelSearch";
import { formatVnd } from "../utils/money";
import { clampPage, getPaginationState } from "../utils/pagination";
import { getPublicHotels, type KhachSanListItem } from "../services/hotelService";

function formatCurrencyVnd(value: number): string {
  return formatVnd(value);
}


const { Title, Text } = Typography;

type CustomerHotelSearchResultsProps = {
  searchState: HotelSearchState;
  onStartNewSearch: () => void;
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

function getHotelRatingLabel(rating: number | null): string {
  if (!rating) return "Chưa có đánh giá";
  if (rating >= 4.5) return "Xuất sắc";
  if (rating >= 4.0) return "Rất tốt";
  if (rating >= 3.5) return "Tốt";
  return "Bình thường";
}

export default function CustomerHotelSearchResults({
  searchState,
  onStartNewSearch,
}: CustomerHotelSearchResultsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const currentPage = clampPage(searchParams.get("page"));
  const selectedStars = useMemo(() => searchParams.get("soSao")?.split(",").filter(Boolean) ?? [], [searchParams]);
  const [hotels, setHotels] = useState<KhachSanListItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20_000_000]);
  const [sortKey, setSortKey] = useState("price_desc");
  const pageSize = 5;
  const pagination = getPaginationState(currentPage, pageSize, totalRecords);

  function navigateWithFilters(updates: Record<string, string | number | null>, page = 1) {
    const next = new URLSearchParams(location.search);
    next.set("page", String(page));
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") next.delete(key);
      else next.set(key, String(value));
    });
    navigate(`${location.pathname}?${next.toString()}`);
  }

  function handlePageChange(page: number) {
    navigateWithFilters({}, page);
  }

  function toggleStar(star: number) {
    const nextStars = selectedStars.includes(String(star))
      ? selectedStars.filter((item) => item !== String(star))
      : [...selectedStars, String(star)];
    navigateWithFilters({ soSao: nextStars.join(",") || null });
  }

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getPublicHotels({
        page: currentPage,
        limit: pageSize,
        viTri: searchState.destination || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        soSao: selectedStars.join(",") || undefined,
      });
      setHotels(result.data);
      setTotalRecords(result.totalRecords);
    } catch (err) {
      console.error("Lỗi tải danh sách khách sạn:", err);
      setHotels([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, priceRange, searchState.destination, selectedStars]);

  useEffect(() => {
    void fetchHotels();
  }, [fetchHotels]);

  const sortedHotels = useMemo(() => {
    const result = [...hotels];
    if (sortKey === "price_asc") {
      result.sort((a, b) => (a.giaTuKhoang || 0) - (b.giaTuKhoang || 0));
    } else if (sortKey === "price_desc") {
      result.sort((a, b) => (b.giaTuKhoang || 0) - (a.giaTuKhoang || 0));
    }
    // "Điểm đánh giá" logic could be added here if rating data was available in ListItem
    return result;
  }, [hotels, sortKey]);

  return (
    <div style={{ backgroundColor: "#f5f7fa", padding: "170px 0", minHeight: "100vh" }}>
      <div className="customer-shell__container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>

        {/* Thanh Tìm Kiếm (Search Bar) */}
        <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} styles={{ body: { padding: "16px 24px" } }}>
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
                  {formatHotelGuestSummary(searchState.guests)}
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
              extra={<Button type="link" style={{ padding: 0, fontWeight: 600, color: "#0194f3" }} onClick={() => { setPriceRange([0, 20_000_000]); navigateWithFilters({ minPrice: null, maxPrice: null, soSao: null }); }}>Đặt lại</Button>}
              style={{ borderRadius: 12, marginBottom: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              {/* Phạm vi giá */}
              <div style={{ marginBottom: 28 }}>
                <Text strong style={{ fontSize: 15, color: "#17324d" }}>Phạm vi giá</Text>
                <Slider
                  range
                  value={priceRange}
                  onChange={(val) => setPriceRange(val as [number, number])}
                  onChangeComplete={(val) => navigateWithFilters({ minPrice: (val as [number, number])[0], maxPrice: (val as [number, number])[1] })}
                  max={20_000_000}
                  step={100_000}
                  tooltip={{ formatter: (value) => value ? formatCurrencyVnd(value) : "0 VN?" }}
                />
                <Row justify="space-between" style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>{formatCurrencyVnd(priceRange[0])}</Text>
                  <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>{formatCurrencyVnd(priceRange[1])}+</Text>
                </Row>
              </div>

              {/* Hạng sao */}
              <div style={{ marginBottom: 28 }}>
                <Text strong style={{ fontSize: 15, color: "#17324d", display: "block", marginBottom: 12 }}>Hạng sao</Text>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Button
                      key={star}
                      onClick={() => toggleStar(star)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        borderRadius: 8,
                        borderColor: selectedStars.includes(String(star)) ? "#0194f3" : "#d9d9d9",
                        backgroundColor: selectedStars.includes(String(star)) ? "#e6f4ff" : "#fff"
                      }}
                    >
                      {star} <Star size={14} fill="#fadb14" color="#fadb14" />
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Xem trên bản đồ */}
            <Card
              styles={{ body: { padding: 0 } }}
              style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", position: "relative", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              <div style={{ height: 140, backgroundColor: "#e5e7eb", backgroundSize: "cover", backgroundPosition: "center" }} />
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
              <Text strong style={{ fontSize: 16, color: "#17324d" }}>
                Đang hiển thị <span style={{ color: "#0194f3" }}>{pagination.from}-{pagination.to}</span> / {pagination.totalItems} khách sạn
              </Text>
              <Space align="center" size="middle">
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>Sắp xếp theo:</Text>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#0194f3] font-semibold text-[#17324d]"
                >
                  <option value="price_desc">Giá: Cao → Thấp</option>
                  <option value="price_asc">Giá: Thấp → Cao</option>
                  <option value="rating_desc">Điểm đánh giá</option>
                </select>
              </Space>
            </Row>

            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <Spin size="large" description="Đang tìm kiếm khách sạn..." />
              </div>
            ) : hotels.length === 0 ? (
              <Empty description={<span>Không tìm thấy khách sạn nào cho điểm đến <strong>{searchState.destination}</strong>.<br/>Thử tìm kiếm với từ khóa khác.</span>} />
            ) : (
              <>
                {sortedHotels.map((hotel, index) => (
                  <Card
                    key={hotel.maKhachSan}
                    styles={{ body: { padding: 0 } }}
                    style={{ borderRadius: 16, marginBottom: 20, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}
                  >
                    <Row style={{ minHeight: 220 }}>
                      {/* Ảnh khách sạn */}
                      <Col span={8} style={{ position: "relative" }}>
                        <img
                          src={hotel.avatar ?? PLACEHOLDER_IMAGE}
                          alt={hotel.ten}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                        />
                        {index === 0 && (
                          <div style={{ position: "absolute", top: 12, left: 12 }}>
                            <Tag color="#ff5e1f" style={{ borderRadius: 4, fontWeight: 700, border: "none", padding: "4px 10px", fontSize: 12 }}>
                              Ưu đãi đặc biệt
                            </Tag>
                          </div>
                        )}
                      </Col>

                      {/* Nội dung khách sạn */}
                      <Col span={16} style={{ padding: "20px 24px", display: "flex", flexDirection: "column" }}>
                        <Row justify="space-between" align="top">
                          <Col span={18}>
                            <Rate disabled defaultValue={4} style={{ fontSize: 14, color: "#fadb14", marginBottom: 8 }} />
                            <Title level={4} style={{ margin: "0 0 8px", color: "#17324d", fontSize: 22 }}>{hotel.ten}</Title>
                            <Space style={{ color: "#647b92", fontSize: 14, marginBottom: 16 }}>
                              <MapPin size={16} color="#0194f3" /> {hotel.viTri || hotel.tenNhaCungCap}
                            </Space>
                            {hotel.moTa && (
                              <div style={{ color: "#647b92", fontSize: 13, lineHeight: 1.5, marginBottom: 8, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                {hotel.moTa}
                              </div>
                            )}
                          </Col>

                          <Col span={6} style={{ textAlign: "right" }}>
                            <div style={{ color: "#0194f3", fontWeight: 800, fontSize: 15 }}>
                              {getHotelRatingLabel(null)}
                            </div>
                          </Col>
                        </Row>

                        {/* Phần giá và Nút chọn */}
                        <div style={{ marginTop: "auto", paddingTop: 16, display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ color: "#ff5e1f", fontSize: 26, fontWeight: 900, lineHeight: 1 }}>
                              {hotel.giaTuKhoang
                                ? formatCurrencyVnd(hotel.giaTuKhoang)
                                : "Liên hệ"}
                            </div>
                            <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 6, fontWeight: 500 }}>
                              {hotel.giaTuKhoang ? "mỗi đêm, chưa gồm thuế" : "để biết giá"}
                            </Text>
                            <Button
                              type="primary"
                              onClick={() => navigate(`/mua-sam/khach-san/${hotel.maKhachSan}?checkIn=${searchState.checkInDate}&checkOut=${searchState.checkOutDate}&guests=${searchState.guests}`)}
                              style={{
                                marginTop: 16, height: 44, padding: "0 32px",
                                borderRadius: 8, fontWeight: 700, fontSize: 16,
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
                    onChange={(page) => handlePageChange(page)}
                    total={pagination.totalItems}
                    pageSize={pagination.pageSize}
                    showSizeChanger={false}
                  />
                </Row>
              </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}
