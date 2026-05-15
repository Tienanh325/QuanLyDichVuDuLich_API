import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CreditCard,
  Landmark,
  Wallet,
  CheckCircle2,
  HelpCircle,
  CalendarDays,
  Moon,
  BedDouble,
  Lock,
  Loader2,
} from "lucide-react";
import "../assets/css/paymentkhachsan.css";
import hotelHeroImg from "../assets/images/hotel_hero_city.png";
import { createThanhToan } from "../services/hotelService";
import { formatDate, formatVnd, readBookingInfo } from "../utils/bookingStorage";
import type { StoredBookingInfo } from "../utils/bookingStorage";

const PAYMENT_METHOD_MAP: Record<string, string> = {
  credit_card: "VNPAY",
  bank_transfer: "BANK_TRANSFER",
  e_wallet: "MOMO",
};

function StepProgress() {
  return (
    <div className="payment-step-progress">
      <div className="payment-step-item">
        <div className="payment-step-circle" style={{ backgroundColor: "#e6f4ea", color: "#1e8e3e" }}>
          <CheckCircle2 size={16} />
        </div>
        <div className="payment-step-label">Thông tin khách hàng</div>
      </div>
      <div className="payment-step-line active-line" style={{ backgroundColor: "#01579b", height: "2px" }} />
      <div className="payment-step-item active">
        <div className="payment-step-circle">2</div>
        <div className="payment-step-label">Thanh toán</div>
      </div>
      <div className="payment-step-line" />
      <div className="payment-step-item">
        <div className="payment-step-circle">3</div>
        <div className="payment-step-label">Hoàn tất</div>
      </div>
    </div>
  );
}

function PaymentMethod({
  activeMethod,
  onMethodChange,
}: {
  activeMethod: string;
  onMethodChange: (m: string) => void;
}) {
  return (
    <>
      <div className="payment-section-title">Phương thức thanh toán</div>

      <div className="payment-methods">
        {[
          { key: "credit_card", icon: <CreditCard size={24} className="payment-method-icon" />, title: "Thẻ tín dụng", desc: "Visa, Mastercard, JCB" },
          { key: "bank_transfer", icon: <Landmark size={24} className="payment-method-icon" />, title: "Chuyển khoản", desc: "Tất cả ngân hàng nội địa" },
          { key: "e_wallet", icon: <Wallet size={24} className="payment-method-icon" />, title: "Ví điện tử", desc: "MoMo, ZaloPay, ShopeePay" },
        ].map(({ key, icon, title, desc }) => (
          <div
            key={key}
            className={`payment-method-card ${activeMethod === key ? "active" : ""}`}
            onClick={() => onMethodChange(key)}
          >
            {activeMethod === key && <CheckCircle2 size={18} className="payment-method-check" />}
            {icon}
            <div className="payment-method-title">{title}</div>
            <div className="payment-method-desc">{desc}</div>
          </div>
        ))}
      </div>

      {activeMethod === "credit_card" && (
        <div className="payment-card-form">
          <div className="payment-form-row">
            <div className="payment-form-group">
              <label className="payment-form-label">Số thẻ</label>
              <input type="text" className="payment-form-input" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="payment-form-group">
              <label className="payment-form-label">Tên trên thẻ</label>
              <input type="text" className="payment-form-input" placeholder="NGUYEN VAN A" />
            </div>
          </div>
          <div className="payment-form-row">
            <div className="payment-form-group">
              <label className="payment-form-label">Ngày hết hạn</label>
              <input type="text" className="payment-form-input" placeholder="MM / YY" />
            </div>
            <div className="payment-form-group">
              <label className="payment-form-label">CVV/CVC</label>
              <div style={{ position: "relative" }}>
                <input type="text" className="payment-form-input" placeholder="***" />
                <HelpCircle size={18} color="#9eaab6" style={{ position: "absolute", right: 16, top: 16 }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function getPaymentTitle(serviceType?: string) {
  switch (serviceType) {
    case "flight":
      return "Thanh toán vé máy bay";
    case "train":
      return "Thanh toán vé tàu";
    case "tour":
      return "Thanh toán tour & hoạt động";
    default:
      return "Thanh toán đặt chỗ";
  }
}

function getSummaryMeta(info: StoredBookingInfo | null) {
  const total = info?.tongGia ?? 0;
  const baseAmount = info?.baseAmount ?? (info?.giaPhong && info?.nights && info?.rooms ? info.giaPhong * info.nights * Number(info.rooms) : Math.round(total / 1.1));
  const taxFee = info?.taxFee ?? Math.max(0, total - baseAmount);

  switch (info?.serviceType) {
    case "flight":
      return {
        detailLabel: "Thông tin hành trình",
        detailValue: info?.secondaryDetail ?? "1 hành khách",
        serviceLabel: "Hạng vé",
        serviceValue: info?.subtitle ?? info?.serviceLabel ?? "—",
        quantityLabel: info?.quantityLabel ?? "Vé máy bay (x1)",
        baseAmount,
        taxFee,
      };
    case "train":
      return {
        detailLabel: "Thông tin chuyến tàu",
        detailValue: info?.secondaryDetail ?? "—",
        serviceLabel: "Ghế / loại vé",
        serviceValue: info?.subtitle ?? info?.serviceLabel ?? "—",
        quantityLabel: info?.quantityLabel ?? "Vé tàu",
        baseAmount,
        taxFee,
      };
    case "tour":
      return {
        detailLabel: "Thông tin hoạt động",
        detailValue: info?.secondaryDetail ?? "—",
        serviceLabel: "Điểm đến",
        serviceValue: info?.subtitle ?? info?.serviceLabel ?? "—",
        quantityLabel: info?.quantityLabel ?? "Tour",
        baseAmount,
        taxFee,
      };
    default:
      return {
        detailLabel: "Chi tiết đặt chỗ",
        detailValue: info?.secondaryDetail ?? (info?.nights ? `${info.nights} đêm (${info.rooms ?? 1} phòng, ${info.adults ?? 1} khách)` : "—"),
        serviceLabel: "Dịch vụ",
        serviceValue: info?.subtitle ?? info?.serviceLabel ?? "—",
        quantityLabel: info?.quantityLabel ?? `Giá dịch vụ (${info?.nights ?? 1} đêm)`,
        baseAmount,
        taxFee,
      };
  }
}

function BookingSummary({ info, onPay, isLoading }: { info: StoredBookingInfo | null; onPay: () => void; isLoading: boolean }) {
  const total = info?.tongGia ?? 0;
  const summaryMeta = getSummaryMeta(info);

  return (
    <div>
      <div className="payment-summary-card">
        <div className="payment-hotel-hero">
          <img src={hotelHeroImg} alt="Service Hero" />
          <div className="payment-hotel-hero-overlay">
            <div className="payment-hotel-type">{info?.serviceLabel ?? "Đặt chỗ"}</div>
            <h3 className="payment-hotel-name">{info?.title ?? info?.serviceName ?? "Đặt chỗ"}</h3>
          </div>
        </div>

        <div className="payment-booking-details">
          <div className="payment-detail-row">
            <CalendarDays size={20} className="payment-detail-icon" />
            <div className="payment-detail-content">
              <span className="payment-detail-label">Ngày sử dụng</span>
              <span className="payment-detail-value">{info?.primaryDetail ?? (info ? formatDate(info.startDate ?? info.checkIn) : "—")}</span>
            </div>
          </div>

          <div className="payment-detail-row">
            <Moon size={20} className="payment-detail-icon" />
            <div className="payment-detail-content">
              <span className="payment-detail-label">{summaryMeta.detailLabel}</span>
              <span className="payment-detail-value">{summaryMeta.detailValue}</span>
            </div>
          </div>

          <div className="payment-detail-row">
            <BedDouble size={20} className="payment-detail-icon" />
            <div className="payment-detail-content">
              <span className="payment-detail-label">{summaryMeta.serviceLabel}</span>
              <span className="payment-detail-value">{summaryMeta.serviceValue}</span>
            </div>
          </div>
        </div>

        <div className="payment-price-section">
          <div className="payment-price-title">Chi tiết giá</div>

          <div className="payment-price-row">
            <span className="payment-price-label">{summaryMeta.quantityLabel}</span>
            <span className="payment-price-value">{formatVnd(summaryMeta.baseAmount)}</span>
          </div>

          <div className="payment-price-row">
            <span className="payment-price-label">Thuế và phí dịch vụ (10%)</span>
            <span className="payment-price-value">{formatVnd(summaryMeta.taxFee)}</span>
          </div>

          <div className="payment-total-divider" />

          <div className="payment-total-row">
            <span className="payment-total-label">Tổng cộng</span>
            <span className="payment-total-value">{formatVnd(total)}</span>
          </div>
        </div>
      </div>

      {info?.maDon ? (
        <div style={{ marginBottom: 12, padding: "10px 16px", background: "#f0f9ff", borderRadius: 10, fontSize: 13, color: "#0369a1" }}>
          Mã đặt chỗ: <strong>#{info.maDon}</strong>
        </div>
      ) : null}

      <button
        type="button"
        className="payment-btn"
        onClick={onPay}
        disabled={isLoading}
        style={{ opacity: isLoading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Đang xử lý...
          </>
        ) : (
          <>
            <Lock size={18} /> Thanh toán an toàn
          </>
        )}
      </button>

      <div className="payment-terms">
        Bằng cách nhấn nút, bạn đồng ý với <a href="#">Điều khoản &amp; Chính sách</a> của chúng tôi.
      </div>
    </div>
  );
}

export default function PaymentKhachSan() {
  const navigate = useNavigate();
  const [activeMethod, setActiveMethod] = useState("credit_card");
  const [bookingInfo, setBookingInfo] = useState<StoredBookingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setBookingInfo(readBookingInfo());
  }, []);

  async function handlePayment() {
    if (!bookingInfo?.maDon) {
      setErrorMsg("Không tìm thấy thông tin đơn hàng. Vui lòng quay lại và thực hiện lại.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const total = bookingInfo.tongGia ?? 0;

    try {
      await createThanhToan({
        maDon: bookingInfo.maDon,
        phuongThuc: (PAYMENT_METHOD_MAP[activeMethod] as "VNPAY" | "MOMO" | "COD" | "BANK_TRANSFER" | "WALLET") ?? "VNPAY",
        soTien: total,
        ghiChu: `Thanh toán ${bookingInfo.serviceLabel.toLowerCase()} ${bookingInfo.subtitle ?? bookingInfo.title}`,
      });

      const paidBookingInfo = { ...bookingInfo, tongGia: total, baseAmount: bookingInfo.baseAmount, taxFee: bookingInfo.taxFee };
      localStorage.setItem("travelhub_booking_info", JSON.stringify(paidBookingInfo));

      navigate("/mua-sam/hoan-tat", {
        state: paidBookingInfo,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra khi thanh toán.";
      if (String(msg).includes("401") || String(msg).includes("token")) {
        navigate("/dang-nhap");
        return;
      }
      setErrorMsg(`Thanh toán thất bại: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <StepProgress />

        <div className="payment-layout">
          <div className="payment-left">
            <h1 className="payment-title">{getPaymentTitle(bookingInfo?.serviceType)}</h1>

            <div className="payment-security-box">
              <ShieldCheck size={24} className="payment-security-icon" />
              <div className="payment-security-content">
                <h4>Thanh toán an toàn &amp; bảo mật</h4>
                <p>Dữ liệu của bạn được mã hóa hoàn toàn bằng công nghệ SSL tiên tiến.</p>
              </div>
            </div>

            <PaymentMethod activeMethod={activeMethod} onMethodChange={setActiveMethod} />

            <div>
              <div className="payment-section-title">Thông tin hóa đơn</div>
              <div className="payment-billing-info">
                <label className="payment-checkbox-wrap">
                  <input type="checkbox" />
                  <div className="payment-checkbox-content">
                    <span className="payment-checkbox-label">Tôi muốn xuất hóa đơn giá trị gia tăng (VAT) cho doanh nghiệp</span>
                    <span className="payment-checkbox-note">Thông tin sẽ được gửi qua email sau khi hoàn tất thanh toán.</span>
                  </div>
                </label>
              </div>
            </div>

            {errorMsg && (
              <div style={{ background: "#fff1f2", color: "#be123c", padding: "12px 16px", borderRadius: 10, marginTop: 16, fontSize: 14 }}>
                {errorMsg}
              </div>
            )}
          </div>

          <div className="payment-right">
            <BookingSummary info={bookingInfo} onPay={() => void handlePayment()} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
