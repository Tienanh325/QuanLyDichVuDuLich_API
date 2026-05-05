import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Info,
  SlidersHorizontal,
  ScrollText,
} from "lucide-react";
import { Spin } from "antd";
import "../assets/css/CustomerTransactions.css";
import { getMyOrders, type DonDatDetail } from "../services/donDatService";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";

const filtersMock = ["90 ngày qua", "Tháng 4 2026", "Tháng 3 2026", "Ngày tùy chọn"];


function EmptyState() {
  return (
    <div className="empty-state">
      <div style={{ color: "#d2dbe0" }}>
        <ScrollText size={120} strokeWidth={1} />
      </div>
      <div className="empty-state-content">
        <h3>Không tìm thấy giao dịch</h3>
        <p>
          Bạn có thể xem thông tin giao dịch mới tại đây. Các giao dịch cũ sẽ được hiển thị trong{" "}
          <Link to="/mua-sam">Đặt chỗ của tôi</Link>
        </p>
        <button className="btn-primary" onClick={() => window.location.href = '/mua-sam'}>Tạo giao dịch mới</button>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function CustomerTransactions() {
  const [activeFilter, setActiveFilter] = useState("90 ngày qua");
  const [transactions, setTransactions] = useState<DonDatDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const res = await getMyOrders({ limit: 50 });
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải giao dịch:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatVnd(n: number) {
    return n.toLocaleString("vi-VN") + " VND";
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div className="transactions-page">
      <div className="transactions-container">
        <CustomerSidebar activeKey="transactions" />

        <div className="transactions-content">
          {/* Header Info */}
          <div className="header-info">
            <Info size={24} className="header-info-icon" />
            <p>
              Xem tất cả vé máy bay và phiếu thanh toán trong{" "}
              <Link to="/mua-sam">Đặt chỗ của tôi</Link>
            </p>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            {filtersMock.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
            <button className="filter-setting-btn">
              <SlidersHorizontal size={16} />
              Bộ lọc
            </button>
          </div>

          {/* Data area */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Spin size="large" />
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="transaction-list">
              {transactions.map((trans) => {
                const isPaid = trans.trangThai === "DA_THANH_TOAN";
                const isCanceled = trans.trangThai === "DA_HUY";
                const tagClass = isPaid ? "tag-success" : isCanceled ? "tag-canceled" : "tag-pending";
                const tagLabel = isPaid ? "Đã thanh toán" : isCanceled ? "Đã hủy" : "Chờ thanh toán";

                return (
                  <div key={trans.maDon} className="transaction-card">
                    <div className="trans-main">
                      <div className="trans-meta">Mã giao dịch: {trans.maDon} • {formatDate(trans.ngayTao)}</div>
                      <h4>{trans.chiTietDon?.[0]?.tenDichVu || "Dịch vụ Traveloka"}</h4>
                      <div className="trans-meta">Số lượng: {trans.chiTietDon?.[0]?.soLuong || 1}</div>
                      <span className={`trans-tag ${tagClass}`}>{tagLabel}</span>
                    </div>
                    <div className="trans-right">
                      <div className="trans-price">{formatVnd(trans.tongGia)}</div>
                      <Link to={`/mua-sam/thanh-toan-dat-cho`} style={{ color: "#0194f3", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
