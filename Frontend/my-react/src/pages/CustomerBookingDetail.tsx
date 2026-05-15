import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Download,
  Hash,
  MapPin,
  Printer,
  ReceiptText,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { Spin } from "antd";
import html2pdf from "html2pdf.js";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";
import { getMyOrderById, type DonDatDetail } from "../services/donDatService";
import { formatDate, formatVnd } from "../utils/bookingStorage";
import "../assets/css/CustomerBookings.css";

function formatRange(start?: string | null, end?: string | null) {
  if (start && end) return `${formatDate(start)} → ${formatDate(end)}`;
  return formatDate(start ?? end ?? undefined);
}

function getOrderStatusLabel(status: string) {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "COMPLETED") return "Hoàn tất";
  if (["CANCELLED", "DA_HUY"].includes(normalized)) return "Đã hủy";
  if (["PAID", "DA_THANH_TOAN"].includes(normalized)) return "Đã thanh toán";
  return "Chờ xác nhận";
}

function getPaymentStatusLabel(status: string) {
  const normalized = String(status || "").toUpperCase();
  if (["PAID", "DA_THANH_TOAN", "COMPLETED"].includes(normalized)) return "Thanh toán thành công";
  if (["FAILED", "THAT_BAI"].includes(normalized)) return "Thanh toán thất bại";
  if (["REFUNDED", "HOAN_TIEN"].includes(normalized)) return "Đã hoàn tiền";
  return "Chưa thanh toán";
}

export default function CustomerBookingDetail() {
  const { maDon } = useParams();
  const voucherRef = useRef<HTMLDivElement | null>(null);
  const [booking, setBooking] = useState<DonDatDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    void fetchBookingDetail();
  }, [maDon]);

  async function fetchBookingDetail() {
    if (!maDon) return;

    try {
      setLoading(true);
      const data = await getMyOrderById(Number(maDon));
      setBooking(data);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết phiếu:", error);
      setBooking(null);
    } finally {
      setLoading(false);
    }
  }

  const bookingSummary = useMemo(() => {
    const items = booking?.chiTietDon ?? [];
    const payments = booking?.lichSuThanhToan ?? [];
    const firstItem = items[0];
    const latestPayment = payments[0];
    const totalQuantity = items.reduce((sum, item) => sum + Number(item.soLuong || 0), 0);
    const serviceTypes = Array.from(new Set(items.map((item) => item.loaiDichVu).filter(Boolean)));

    const subTotal = items.reduce((sum, item) => sum + Number(item.soLuong) * Number(item.giaTaiThoiDiemMua), 0);
    const feeAmount = Math.max(0, Number(booking?.tongGia || 0) - subTotal);

    return {
      items,
      payments,
      firstItem,
      latestPayment,
      totalQuantity,
      totalServices: items.length,
      subTotal,
      feeAmount,
      serviceLabel: serviceTypes.join(" • ") || firstItem?.loaiDichVu || "Dịch vụ",
      title: firstItem?.tenDichVu || "Phiếu thanh toán điện tử",
      detailDate: firstItem ? formatRange(firstItem.ngayBatDauSuDung, firstItem.ngayKetThucSuDung) : "Chưa xác nhận",
      orderStatus: getOrderStatusLabel(booking?.trangThai || ""),
      paymentStatus: getPaymentStatusLabel(latestPayment?.trangThai || booking?.trangThai || ""),
      paymentMethod: latestPayment?.phuongThuc || "Chưa có thông tin",
      paymentDate: latestPayment?.ngayThanhToan ? formatDate(latestPayment.ngayThanhToan) : "Chưa thanh toán",
    };
  }, [booking]);

  function handlePrint() {
    window.print();
  }

  async function handleDownloadPdf() {
    if (!voucherRef.current || !booking) return;

    try {
      setDownloadingPdf(true);
      await html2pdf()
        .set({
          margin: 10,
          filename: `phieu-thanh-toan-${booking.maDon}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(voucherRef.current)
        .save();
    } catch (error) {
      console.error("Lỗi khi tải PDF:", error);
    } finally {
      setDownloadingPdf(false);
    }
  }

  return (
    <div className="bookings-page booking-detail-page">
      <div className="bookings-container booking-detail-container">
        <div className="booking-detail-sidebar print-hidden">
          <CustomerSidebar activeKey="bookings" />
        </div>

        <div className="bookings-content booking-detail-content">
          <div className="bookings-section">
            <div className="booking-detail-topbar print-hidden">
              <div>
                <h2 className="bookings-section-title">Chi tiết vé điện tử & phiếu thanh toán</h2>
                <p className="booking-detail-subtitle">Xem đầy đủ thông tin đơn hàng, dịch vụ, trạng thái và chứng từ thanh toán.</p>
              </div>
              {booking && (
                <div className="booking-detail-actions">
                  <button type="button" className="booking-ticket-secondary booking-detail-action-btn" onClick={handlePrint}>
                    <Printer size={16} />
                    In phiếu
                  </button>
                  <button type="button" className="booking-ticket-primary booking-detail-action-btn" onClick={() => void handleDownloadPdf()} disabled={downloadingPdf}>
                    <Download size={16} />
                    {downloadingPdf ? "Đang tạo PDF..." : "Tải PDF"}
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="bookings-card" style={{ textAlign: "center", padding: "48px 24px" }}>
                <Spin size="large" />
              </div>
            ) : !booking ? (
              <div className="bookings-card">Không tìm thấy phiếu thanh toán.</div>
            ) : (
              <div ref={voucherRef} className="booking-detail-voucher">
                <div className="booking-detail-hero booking-ticket-card">
                  <div className="booking-ticket-header booking-detail-hero-header">
                    <div>
                      <span className="booking-ticket-badge">{bookingSummary.serviceLabel}</span>
                      <h3>{bookingSummary.title}</h3>
                      <p>{bookingSummary.totalServices} dịch vụ • {bookingSummary.totalQuantity} số lượng</p>
                    </div>
                    <div className="booking-ticket-code">
                      <span>Mã đặt chỗ</span>
                      <strong>#{booking.maDon}</strong>
                    </div>
                  </div>

                  <div className="booking-ticket-body booking-detail-hero-body">
                    <div className="booking-ticket-main">
                      <div className="booking-ticket-qr booking-detail-ticket-mark">
                        <Ticket size={44} />
                        <span>VÉ ĐIỆN TỬ</span>
                      </div>
                      <div className="booking-ticket-status">{bookingSummary.orderStatus}</div>
                    </div>

                    <div className="booking-ticket-details">
                      <div className="booking-ticket-row">
                        <CalendarDays size={18} />
                        <span>Thời gian</span>
                        <strong>{bookingSummary.detailDate}</strong>
                      </div>
                      <div className="booking-ticket-row">
                        <MapPin size={18} />
                        <span>Chi tiết</span>
                        <strong>{bookingSummary.totalServices} mục, {bookingSummary.totalQuantity} số lượng</strong>
                      </div>
                      <div className="booking-ticket-row">
                        <CreditCard size={18} />
                        <span>Thanh toán</span>
                        <strong>{formatVnd(booking.tongGia)}</strong>
                      </div>
                      <div className="booking-ticket-row">
                        <Hash size={18} />
                        <span>Loại vé</span>
                        <strong>{bookingSummary.serviceLabel}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="booking-detail-grid">
                  <div className="bookings-card booking-detail-section-card">
                    <div className="booking-detail-section-title">
                      <ReceiptText size={18} />
                      <span>Danh sách dịch vụ trong đơn</span>
                    </div>
                    <div className="booking-detail-table-wrap">
                      <table className="booking-detail-table">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Dịch vụ</th>
                            <th>Thời gian</th>
                            <th className="booking-detail-cell-right">Số lượng</th>
                            <th className="booking-detail-cell-right">Đơn giá</th>
                            <th className="booking-detail-cell-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingSummary.items.map((item, index) => (
                            <tr key={item.maChiTiet}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="booking-detail-table-service">
                                  <strong>{item.tenDichVu}</strong>
                                  <span>{item.loaiDichVu}</span>
                                </div>
                              </td>
                              <td>{formatRange(item.ngayBatDauSuDung, item.ngayKetThucSuDung)}</td>
                              <td className="booking-detail-cell-right">{item.soLuong}</td>
                              <td className="booking-detail-cell-right">{formatVnd(item.giaTaiThoiDiemMua)}</td>
                              <td className="booking-detail-cell-right">{formatVnd(Number(item.soLuong) * Number(item.giaTaiThoiDiemMua))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="booking-detail-table-total">
                      <span>Tổng số lượng</span>
                      <strong>{bookingSummary.totalQuantity}</strong>
                    </div>
                    <div className="booking-detail-invoice-summary">
                      <div className="booking-detail-invoice-row">
                        <span>Tạm tính</span>
                        <strong>{formatVnd(bookingSummary.subTotal)}</strong>
                      </div>
                      <div className="booking-detail-invoice-row">
                        <span>Thuế/phí</span>
                        <strong>{formatVnd(bookingSummary.feeAmount)}</strong>
                      </div>
                      <div className="booking-detail-invoice-row booking-detail-invoice-row-total">
                        <span>Tổng cộng</span>
                        <strong>{formatVnd(booking.tongGia)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="booking-detail-side-stack">
                    <div className="bookings-card booking-detail-section-card">
                      <div className="booking-detail-section-title">
                        <CircleDollarSign size={18} />
                        <span>Tổng quan thanh toán</span>
                      </div>
                      <div className="booking-detail-summary-list">
                        <div className="booking-detail-summary-row">
                          <span>Trạng thái đơn</span>
                          <strong>{bookingSummary.orderStatus}</strong>
                        </div>
                        <div className="booking-detail-summary-row">
                          <span>Trạng thái thanh toán</span>
                          <strong>{bookingSummary.paymentStatus}</strong>
                        </div>
                        <div className="booking-detail-summary-row">
                          <span>Phương thức</span>
                          <strong>{bookingSummary.paymentMethod}</strong>
                        </div>
                        <div className="booking-detail-summary-row">
                          <span>Ngày thanh toán</span>
                          <strong>{bookingSummary.paymentDate}</strong>
                        </div>
                        <div className="booking-detail-summary-row booking-detail-summary-row-total">
                          <span>Tổng cộng</span>
                          <strong>{formatVnd(booking.tongGia)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="bookings-card booking-detail-section-card">
                      <div className="booking-detail-section-title">
                        <ShieldCheck size={18} />
                        <span>Lịch sử thanh toán</span>
                      </div>
                      <div className="booking-detail-payments">
                        {bookingSummary.payments.length > 0 ? bookingSummary.payments.map((payment) => (
                          <div key={payment.maThanhToan} className="booking-detail-payment-row">
                            <div>
                              <strong>{payment.phuongThuc}</strong>
                              <p>{formatDate(payment.ngayThanhToan)}</p>
                            </div>
                            <div className="booking-detail-payment-right">
                              <span>{getPaymentStatusLabel(payment.trangThai)}</span>
                              <strong>{formatVnd(payment.soTien)}</strong>
                            </div>
                          </div>
                        )) : (
                          <div className="booking-detail-empty-note">Chưa có giao dịch thanh toán nào được ghi nhận.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bookings-card booking-detail-footer-card">
                  <div className="booking-detail-footer-note">
                    Phiếu điện tử này được phát hành tự động từ hệ thống. Vui lòng mang theo mã đặt chỗ khi cần đối chiếu hoặc liên hệ hỗ trợ.
                  </div>
                </div>
              </div>
            )}

            <div className="booking-ticket-actions print-hidden">
              <Link to="/mua-sam/dat-cho-cua-toi" className="booking-ticket-secondary">Quay lại danh sách</Link>
              <Link to="/mua-sam/giao-dich" className="booking-ticket-primary">Lịch sử giao dịch</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
