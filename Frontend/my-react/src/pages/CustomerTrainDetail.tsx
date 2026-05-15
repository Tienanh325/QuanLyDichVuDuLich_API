import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../assets/css/CustomerTrainDetail.css";
import { Train, Wifi, Snowflake, Utensils, Plug, Calendar, Bed, CheckSquare, Square } from 'lucide-react';
import { formatGio, formatNgay, formatVnd, getVeById, type VeDetail } from '../services/veService';
import ReviewSection from '../components/ReviewSection';

interface Seat { id: string; number: string; status: 'available' | 'booked'; }
interface Cabin { id: string; name: string; seats: Seat[]; }

type TrainDetailData = {
  hangTau?: string;
  nhaVanHanh?: string;
  soHieuChuyenTau?: string;
  diemKhoiHanh?: string;
  gaKhoiHanh?: string;
  diemDen?: string;
  gaDen?: string;
  thoiGianKhoiHanh?: string;
  thoiGianDen?: string;
  thoiLuongPhut?: number;
  loaiChoMacDinh?: string;
  chinhSachHoan?: string;
};

const CustomerTrainDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ticket, setTicket] = useState<VeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    queueMicrotask(() => setLoading(true));
    getVeById(id).then(setTicket).catch(() => setTicket(null)).finally(() => setLoading(false));
  }, [id]);

  const detail = (ticket?.chiTiet ?? {}) as TrainDetailData;
  const basePrice = Number(ticket?.bảngGia?.[0]?.gia ?? 0);
  const cabins: Cabin[] = useMemo(() => Array.from({ length: 6 }, (_, cabinIndex) => ({
    id: `cabin-${cabinIndex + 1}`,
    name: `KHOANG ${cabinIndex + 1}`,
    seats: Array.from({ length: 4 }, (_, seatIndex) => {
      const seatNumber = (cabinIndex * 4 + seatIndex + 1).toString().padStart(2, '0');
      const isBooked = (cabinIndex + seatIndex) % 5 === 2;
      return { id: `seat-${seatNumber}`, number: seatNumber, status: isBooked ? 'booked' : 'available' };
    }),
  })), []);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    setSelectedSeats((prev) => prev.includes(seat.id) ? prev.filter((seatId) => seatId !== seat.id) : [...prev, seat.id]);
  };

  const totalPrice = selectedSeats.length * basePrice;
  const duration = detail.thoiLuongPhut ? `${Math.floor(detail.thoiLuongPhut / 60)} giờ ${detail.thoiLuongPhut % 60} phút` : 'Đang cập nhật';
  const checkoutParams = new URLSearchParams({
    serviceType: 'train',
    serviceLabel: 'Vé tàu',
    maDichVu: String(ticket?.maDichVu ?? ticket?.maVe ?? ''),
    maPhanLoaiDichVu: String(ticket?.maVe ?? ''),
    serviceName: detail.soHieuChuyenTau || ticket?.tenDichVu || 'Chuyến tàu',
    title: `${detail.diemKhoiHanh || 'Điểm đi'} → ${detail.diemDen || 'Điểm đến'}`,
    subtitle: selectedSeats.length ? `Ghế ${selectedSeats.join(', ')}` : (detail.loaiChoMacDinh || ticket?.bảngGia?.[0]?.tenLoaiVe || 'Vé tàu'),
    primaryDetail: detail.thoiGianKhoiHanh ? new Date(detail.thoiGianKhoiHanh).toLocaleDateString('vi-VN') : 'Ngày đi chưa cập nhật',
    secondaryDetail: `${duration} • ${selectedSeats.length} hành khách`,
    quantityLabel: `Vé tàu (${selectedSeats.length} ghế)`,
    price: String(totalPrice),
    unitPrice: String(basePrice),
    quantity: String(selectedSeats.length),
    startDate: detail.thoiGianKhoiHanh || '',
    endDate: detail.thoiGianDen || '',
  });

  if (loading) return <div className="ctd-page"><main className="ctd-main">Đang tải chi tiết tàu...</main></div>;
  if (!ticket) return <div className="ctd-page"><main className="ctd-main">Không tìm thấy chuyến tàu.</main></div>;

  return (
    <div className="ctd-page">
      <div className="ctd-hero">
        <img src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Train Landscape" className="ctd-hero__image" />
        <div className="ctd-hero__overlay"></div>
        <div className="ctd-hero__content"><div className="ctd-hero__content-inner"><div className="ctd-hero__badges"><span className="ctd-hero__badge ctd-hero__badge--primary">{detail.nhaVanHanh || ticket.tenNhaCungCap || 'TÀU HỎA'}</span><span className="ctd-hero__badge ctd-hero__badge--dark">MÃ CHUYẾN: {detail.soHieuChuyenTau || detail.hangTau || ticket.maVe}</span></div><h1 className="ctd-hero__title">{detail.diemKhoiHanh || 'Điểm đi'} - {detail.diemDen || 'Điểm đến'}</h1></div></div>
      </div>

      <main className="ctd-main">
        <div className="ctd-main__left">
          <div className="ctd-card">
            <h2 className="ctd-card__title">Lịch trình chuyến đi</h2>
            <div className="ctd-schedule">
              <div className="ctd-schedule__point"><div className="ctd-schedule__time">{formatGio(detail.thoiGianKhoiHanh || '')}</div><div className="ctd-schedule__station">{detail.gaKhoiHanh || detail.diemKhoiHanh}</div><div className="ctd-schedule__date">{formatNgay(detail.thoiGianKhoiHanh || '')}</div></div>
              <div className="ctd-schedule__line-wrap"><div className="ctd-schedule__duration">{duration}</div><div className="ctd-schedule__line"><div className="ctd-schedule__dot ctd-schedule__dot--left"></div><div className="ctd-schedule__dot ctd-schedule__dot--right"></div><div className="ctd-schedule__icon-wrap"><Train style={{ width: '1.25rem', height: '1.25rem' }} /></div></div><div className="ctd-schedule__type">Chuyến đi thẳng</div></div>
              <div className="ctd-schedule__point"><div className="ctd-schedule__time ctd-schedule__time--arrive">{formatGio(detail.thoiGianDen || '')}</div><div className="ctd-schedule__station">{detail.gaDen || detail.diemDen}</div><div className="ctd-schedule__date">{formatNgay(detail.thoiGianDen || '')}</div></div>
            </div>
          </div>

          <div className="ctd-card"><h2 className="ctd-card__title">Tiện ích trên tàu</h2><div className="ctd-amenities-grid"><div className="ctd-amenity"><Wifi className="ctd-amenity__icon" /><span className="ctd-amenity__label">Wi-Fi</span></div><div className="ctd-amenity"><Snowflake className="ctd-amenity__icon" /><span className="ctd-amenity__label">Điều hòa</span></div><div className="ctd-amenity"><Utensils className="ctd-amenity__icon" /><span className="ctd-amenity__label">Căn tin</span></div><div className="ctd-amenity"><Plug className="ctd-amenity__icon" /><span className="ctd-amenity__label">Ổ cắm điện</span></div></div></div>

          <div className="ctd-card">
            <div className="ctd-seatmap__header"><h2 className="ctd-seatmap__title">{detail.loaiChoMacDinh || ticket.bảngGia?.[0]?.tenLoaiVe || 'Sơ đồ chỗ'}</h2><div className="ctd-seatmap__legend"><div className="ctd-seatmap__legend-item"><Square style={{ width: '1rem', height: '1rem', color: '#d1d5db', fill: '#e5e7eb' }} className="ctd-seatmap__legend-icon" /> Đã đặt</div><div className="ctd-seatmap__legend-item"><Square style={{ width: '1rem', height: '1rem', color: '#0194F3' }} className="ctd-seatmap__legend-icon" /> Còn trống</div><div className="ctd-seatmap__legend-item"><CheckSquare style={{ width: '1rem', height: '1rem', color: '#0194F3', fill: '#eff6ff' }} className="ctd-seatmap__legend-icon" /> Đang chọn</div></div></div>
            <div className="ctd-seatmap"><div className="ctd-seatmap__train"><div className="ctd-seatmap__head"><div className="ctd-seatmap__head-stripe"></div><div className="ctd-seatmap__head-inner"></div></div>{cabins.map((cabin) => (<div key={cabin.id} className="ctd-seatmap__cabin"><div className="ctd-seatmap__cabin-name">{cabin.name}</div><div className="ctd-seatmap__cabin-grid">{cabin.seats.map((seat) => { const isSelected = selectedSeats.includes(seat.id); let seatClass = "ctd-seatmap__seat "; if (seat.status === 'booked') seatClass += "ctd-seatmap__seat--booked"; else if (isSelected) seatClass += "ctd-seatmap__seat--selected"; else seatClass += "ctd-seatmap__seat--available"; return <button key={seat.id} onClick={() => handleSeatClick(seat)} disabled={seat.status === 'booked'} className={seatClass}>{seat.number}</button>; })}</div></div>))}<div className="ctd-seatmap__tail"><div className="ctd-seatmap__tail-stripe"></div></div></div></div>
            <p className="ctd-seatmap__note">* Sơ đồ chỉ mang tính chất minh họa. Dữ liệu chuyến tàu lấy từ cơ sở dữ liệu.</p>
          </div>
        </div>

        <div className="ctd-main__right"><div className="ctd-booking-widget"><div className="ctd-booking__header"><div className="ctd-booking__price-label">GIÁ TỪ</div><div className="ctd-booking__price">{formatVnd(basePrice)}</div><div className="ctd-booking__price-unit">/ khách / lượt</div></div><div className="ctd-booking__form"><div className="ctd-booking__fields"><div><label className="ctd-booking__field-label">LOẠI CHỖ</label><div className="ctd-booking__field-box"><Bed className="ctd-booking__field-icon" /><span className="ctd-booking__field-value">{detail.loaiChoMacDinh || ticket.bảngGia?.[0]?.tenLoaiVe || 'Chỗ ngồi'}</span></div></div><div><label className="ctd-booking__field-label">NGÀY ĐI</label><div className="ctd-booking__field-box"><Calendar className="ctd-booking__field-icon" /><span className="ctd-booking__field-value">{formatNgay(detail.thoiGianKhoiHanh || '')}</span></div></div></div><div className="ctd-booking__breakdown"><div className="ctd-booking__row"><span className="ctd-booking__row-label">Hành khách ({selectedSeats.length}x)</span><span className="ctd-booking__row-value">{formatVnd(totalPrice)}</span></div><div className="ctd-booking__row"><span className="ctd-booking__row-label">Chính sách hoàn</span><span className="ctd-booking__row-value--free">{detail.chinhSachHoan || 'Theo nhà cung cấp'}</span></div></div><div className="ctd-booking__divider"></div><div className="ctd-booking__total"><span className="ctd-booking__total-label">Tổng cộng</span><span className="ctd-booking__total-price">{selectedSeats.length > 0 ? formatVnd(totalPrice) : '0 VND'}</span></div><button disabled={selectedSeats.length === 0} className={`ctd-booking__cta ${selectedSeats.length > 0 ? 'ctd-booking__cta--active' : 'ctd-booking__cta--disabled'}`} onClick={() => navigate(`/mua-sam/thanh-toan-khach-san?${checkoutParams.toString()}`)}>ĐẶT VÉ NGAY</button><p className="ctd-booking__guarantee">{detail.chinhSachHoan || 'Đảm bảo theo chính sách nhà cung cấp'}</p></div></div></div>
      </main>
      <main className="ctd-review-main"><ReviewSection maDichVu={ticket.maDichVu ?? ticket.maVe} serviceName={ticket.tenDichVu || detail.soHieuChuyenTau || 'chuyến tàu'} serviceType="train" /></main>
    </div>
  );
};

export default CustomerTrainDetail;
