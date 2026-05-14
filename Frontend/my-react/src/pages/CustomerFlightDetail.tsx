import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../assets/css/CustomerFlightDetail.css";
import { ArrowRight, Plane, Briefcase, Shield, XCircle, Calendar, Info } from 'lucide-react';
import { formatGio, formatVnd, getVeById, tinhThoiGianBay, type VeDetail } from '../services/veService';

type FlightDetailData = {
  hangHangKhong?: string;
  soHieuChuyenBay?: string;
  hangVe?: string;
  goiGia?: string;
  diemKhoiHanh?: string;
  maSanBayDi?: string;
  tenSanBayDi?: string;
  diemDen?: string;
  maSanBayDen?: string;
  tenSanBayDen?: string;
  thoiGianKhoiHanh?: string;
  thoiGianDen?: string;
  hanhLyXachTay?: string;
  hanhLyKyGui?: string;
  suatAn?: string;
  giaiTri?: string;
  dieuKienVe?: string;
  thuePhiSanBay?: number;
};

const CustomerFlightDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState<VeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getVeById(id)
      .then(setTicket)
      .catch(() => setTicket(null))
      .finally(() => setLoading(false));
  }, [id]);

  const detail = (ticket?.chiTiet ?? {}) as FlightDetailData;
  const basePrice = useMemo(() => ticket?.bảngGia?.[0]?.gia ?? 0, [ticket]);
  const tax = Number(detail.thuePhiSanBay ?? ticket?.bảngGia?.[0]?.soChoTrong ?? 0);
  const total = basePrice + tax;

  if (loading) return <div className="cfd-page"><main className="cfd-main">Đang tải chi tiết chuyến bay...</main></div>;
  if (!ticket) return <div className="cfd-page"><main className="cfd-main">Không tìm thấy chuyến bay.</main></div>;

  return (
    <div className="cfd-page">
      <main className="cfd-main">
        <div className="cfd-title-section">
          <h1 className="cfd-title">Chi tiết chuyến bay</h1>
          <div className="cfd-subtitle">
            <span>{detail.diemKhoiHanh || 'Điểm đi'}</span>
            <ArrowRight className="cfd-subtitle__arrow" />
            <span>{detail.diemDen || 'Điểm đến'}</span>
          </div>
        </div>

        <div className="cfd-layout">
          <div className="cfd-layout__left">
            <div className="cfd-card">
              <div className="cfd-flight-header">
                <div className="cfd-flight-header__left">
                  <div className="cfd-flight-header__icon-wrap"><Plane className="cfd-flight-header__icon" /></div>
                  <div>
                    <div className="cfd-flight-header__airline">{detail.hangHangKhong || ticket.tenNhaCungCap || 'Hãng bay'}</div>
                    <div className="cfd-flight-header__code">{detail.soHieuChuyenBay || ticket.tenDichVu} • {detail.hangVe || 'Phổ thông'}</div>
                  </div>
                </div>
                <div className="cfd-flight-header__badge">{detail.goiGia || ticket.trangThai}</div>
              </div>

              <div className="cfd-timeline">
                <div className="cfd-timeline__point">
                  <div className="cfd-timeline__time">{formatGio(detail.thoiGianKhoiHanh || '')}</div>
                  <div className="cfd-timeline__code">{detail.maSanBayDi || detail.diemKhoiHanh}</div>
                  <div className="cfd-timeline__airport">{detail.tenSanBayDi || detail.diemKhoiHanh}</div>
                </div>
                <div className="cfd-timeline__line-wrap">
                  <div className="cfd-timeline__duration">{tinhThoiGianBay(detail.thoiGianKhoiHanh || '', detail.thoiGianDen || '')}</div>
                  <div className="cfd-timeline__line"><div className="cfd-timeline__dot cfd-timeline__dot--left"></div><div className="cfd-timeline__dot cfd-timeline__dot--right"></div><div className="cfd-timeline__plane-icon"><Plane style={{ width: '1.25rem', height: '1.25rem' }} /></div></div>
                  <div className="cfd-timeline__type">Bay thẳng</div>
                </div>
                <div className="cfd-timeline__point">
                  <div className="cfd-timeline__time">{formatGio(detail.thoiGianDen || '')}</div>
                  <div className="cfd-timeline__code">{detail.maSanBayDen || detail.diemDen}</div>
                  <div className="cfd-timeline__airport">{detail.tenSanBayDen || detail.diemDen}</div>
                </div>
              </div>
            </div>

            <div className="cfd-info-grid">
              <div className="cfd-info-card">
                <div className="cfd-info-card__header"><Briefcase className="cfd-info-card__icon" /><h3 className="cfd-info-card__title">Hành lý & Tiện ích</h3></div>
                <div className="cfd-info-card__list">
                  <div className="cfd-info-card__row"><span className="cfd-info-card__label">Hành lý xách tay</span><span className="cfd-info-card__value">{detail.hanhLyXachTay || 'Liên hệ'}</span></div>
                  <div className="cfd-info-card__row"><span className="cfd-info-card__label">Hành lý ký gửi</span><span className="cfd-info-card__value">{detail.hanhLyKyGui || 'Liên hệ'}</span></div>
                  <div className="cfd-info-card__row"><span className="cfd-info-card__label">Suất ăn</span><span className="cfd-info-card__value--primary">{detail.suatAn || 'Liên hệ'}</span></div>
                  <div className="cfd-info-card__row"><span className="cfd-info-card__label">Giải trí</span><span className="cfd-info-card__value">{detail.giaiTri || 'Liên hệ'}</span></div>
                </div>
              </div>
              <div className="cfd-info-card">
                <div className="cfd-info-card__header"><Shield className="cfd-info-card__icon" /><h3 className="cfd-info-card__title">Điều kiện vé</h3></div>
                <div className="cfd-info-card__policy">
                  <div className="cfd-info-card__policy-item"><XCircle className="cfd-info-card__policy-icon cfd-info-card__policy-icon--danger" /><div><div className="cfd-info-card__policy-title">Chính sách vé</div><div className="cfd-info-card__policy-desc">{detail.dieuKienVe || 'Theo điều kiện của nhà cung cấp.'}</div></div></div>
                  <div className="cfd-info-card__policy-item"><Calendar className="cfd-info-card__policy-icon cfd-info-card__policy-icon--primary" /><div><div className="cfd-info-card__policy-title">Ngày bay</div><div className="cfd-info-card__policy-desc">{detail.thoiGianKhoiHanh ? new Date(detail.thoiGianKhoiHanh).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</div></div></div>
                </div>
              </div>
            </div>

            <div className="cfd-notice"><Info className="cfd-notice__icon" /><p className="cfd-notice__text">Giá vé lấy từ cơ sở dữ liệu, đã hiển thị theo bảng giá hiện tại của vé.</p></div>
          </div>

          <div className="cfd-layout__right">
            <div className="cfd-cost-widget"><div className="cfd-cost-card">
              <h2 className="cfd-cost-card__title">Tóm tắt chi phí</h2>
              <div className="cfd-cost-card__breakdown">
                <div className="cfd-cost-card__row"><span className="cfd-cost-card__label">{detail.hangHangKhong || ticket.tenDichVu} (x1)</span><span className="cfd-cost-card__value">{formatVnd(basePrice)}</span></div>
                <div className="cfd-cost-card__row"><span className="cfd-cost-card__label">Thuế & Phí sân bay</span><span className="cfd-cost-card__value">{formatVnd(tax)}</span></div>
              </div>
              <div className="cfd-cost-card__divider"></div>
              <div className="cfd-cost-card__total"><div><div className="cfd-cost-card__total-label">Tổng cộng</div><div className="cfd-cost-card__total-sub">Đã bao gồm thuế, phí</div></div><div className="cfd-cost-card__total-price">{formatVnd(total)}</div></div>
              <button className="cfd-cost-card__cta">Chọn chuyến bay này <ArrowRight className="cfd-cost-card__cta-icon" /></button>
            </div></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerFlightDetail;
