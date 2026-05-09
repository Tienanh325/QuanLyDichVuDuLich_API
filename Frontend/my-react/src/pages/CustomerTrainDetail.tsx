import { useState } from 'react';
import "../assets/css/CustomerTrainDetail.css";
import { Train, Wifi, Snowflake, Utensils, Plug, Calendar, Bed, CheckSquare, Square } from 'lucide-react';

interface Seat {
  id: string;
  number: string;
  status: 'available' | 'booked';
}

interface Cabin {
  id: string;
  name: string;
  seats: Seat[];
}

const CustomerTrainDetail = () => {
  const initialCabins: Cabin[] = Array.from({ length: 6 }, (_, cabinIndex) => ({
    id: `cabin-${cabinIndex + 1}`,
    name: `KHOANG ${cabinIndex + 1}`,
    seats: Array.from({ length: 4 }, (_, seatIndex) => {
      const seatNumber = (cabinIndex * 4 + seatIndex + 1).toString().padStart(2, '0');
      const isBooked = (cabinIndex === 0 && seatIndex === 2) || (cabinIndex === 2 && seatIndex === 0) || (cabinIndex === 4 && seatIndex === 3);
      return {
        id: `seat-${seatNumber}`,
        number: seatNumber,
        status: isBooked ? 'booked' : 'available',
      };
    }),
  }));

  const [cabins] = useState<Cabin[]>(initialCabins);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const basePrice = 1250000;

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    setSelectedSeats((prev) => 
      prev.includes(seat.id) 
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id]
    );
  };

  const totalPrice = selectedSeats.length * basePrice;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  return (
    <div className="ctd-page">
      {/* Hero Banner */}
      <div className="ctd-hero">
        <img 
          src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Train Landscape" 
          className="ctd-hero__image"
        />
        <div className="ctd-hero__overlay"></div>
        <div className="ctd-hero__content">
          <div className="ctd-hero__content-inner">
            <div className="ctd-hero__badges">
              <span className="ctd-hero__badge ctd-hero__badge--primary">TÀU THỐNG NHẤT</span>
              <span className="ctd-hero__badge ctd-hero__badge--dark">MÃ CHUYẾN: SE1</span>
            </div>
            <h1 className="ctd-hero__title">Hành trình Di sản: Hà Nội - Đà Nẵng</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="ctd-main">
        
        {/* Left Column */}
        <div className="ctd-main__left">
          
          {/* Schedule */}
          <div className="ctd-card">
            <h2 className="ctd-card__title">Lịch trình chuyến đi</h2>
            <div className="ctd-schedule">
              <div className="ctd-schedule__point">
                <div className="ctd-schedule__time">22:15</div>
                <div className="ctd-schedule__station">Ga Hà Nội</div>
                <div className="ctd-schedule__date">23 Th5, 2024</div>
              </div>
              
              <div className="ctd-schedule__line-wrap">
                <div className="ctd-schedule__duration">15 Giờ 45 Phút</div>
                <div className="ctd-schedule__line">
                  <div className="ctd-schedule__dot ctd-schedule__dot--left"></div>
                  <div className="ctd-schedule__dot ctd-schedule__dot--right"></div>
                  <div className="ctd-schedule__icon-wrap">
                    <Train style={{ width: '1.25rem', height: '1.25rem' }} />
                  </div>
                </div>
                <div className="ctd-schedule__type">Chuyến đi thẳng</div>
              </div>

              <div className="ctd-schedule__point">
                <div className="ctd-schedule__time ctd-schedule__time--arrive">14:00</div>
                <div className="ctd-schedule__station">Ga Đà Nẵng</div>
                <div className="ctd-schedule__date">24 Th5, 2024</div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="ctd-card">
            <h2 className="ctd-card__title">Tiện ích trên tàu</h2>
            <div className="ctd-amenities-grid">
              <div className="ctd-amenity">
                <Wifi className="ctd-amenity__icon" />
                <span className="ctd-amenity__label">Wi-Fi Miễn Phí</span>
              </div>
              <div className="ctd-amenity">
                <Snowflake className="ctd-amenity__icon" />
                <span className="ctd-amenity__label">Điều Hòa</span>
              </div>
              <div className="ctd-amenity">
                <Utensils className="ctd-amenity__icon" />
                <span className="ctd-amenity__label">Căn Tin</span>
              </div>
              <div className="ctd-amenity">
                <Plug className="ctd-amenity__icon" />
                <span className="ctd-amenity__label">Ổ Cắm Điện</span>
              </div>
            </div>
          </div>

          {/* Seat Map */}
          <div className="ctd-card">
            <div className="ctd-seatmap__header">
              <h2 className="ctd-seatmap__title">Toa số 5: Giường nằm khoang 4</h2>
              <div className="ctd-seatmap__legend">
                <div className="ctd-seatmap__legend-item"><Square style={{ width: '1rem', height: '1rem', color: '#d1d5db', fill: '#e5e7eb' }} className="ctd-seatmap__legend-icon" /> Đã đặt</div>
                <div className="ctd-seatmap__legend-item"><Square style={{ width: '1rem', height: '1rem', color: '#0194F3' }} className="ctd-seatmap__legend-icon" /> Còn trống</div>
                <div className="ctd-seatmap__legend-item"><CheckSquare style={{ width: '1rem', height: '1rem', color: '#0194F3', fill: '#eff6ff' }} className="ctd-seatmap__legend-icon" /> Đang chọn</div>
              </div>
            </div>

            <div className="ctd-seatmap">
              <div className="ctd-seatmap__train">
                {/* Train Head */}
                <div className="ctd-seatmap__head">
                  <div className="ctd-seatmap__head-stripe"></div>
                  <div className="ctd-seatmap__head-inner"></div>
                </div>

                {/* Cabins */}
                {cabins.map((cabin) => (
                  <div key={cabin.id} className="ctd-seatmap__cabin">
                    <div className="ctd-seatmap__cabin-name">{cabin.name}</div>
                    <div className="ctd-seatmap__cabin-grid">
                      {cabin.seats.map((seat) => {
                        const isSelected = selectedSeats.includes(seat.id);
                        let seatClass = "ctd-seatmap__seat ";
                        if (seat.status === 'booked') seatClass += "ctd-seatmap__seat--booked";
                        else if (isSelected) seatClass += "ctd-seatmap__seat--selected";
                        else seatClass += "ctd-seatmap__seat--available";

                        return (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === 'booked'}
                            className={seatClass}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Train Tail */}
                <div className="ctd-seatmap__tail">
                   <div className="ctd-seatmap__tail-stripe"></div>
                </div>
              </div>
            </div>
            <p className="ctd-seatmap__note">
              * Sơ đồ chỉ mang tính chất minh họa. Các giường số lẻ (01, 03) là giường tầng 1.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="ctd-main__right">
          <div className="ctd-booking-widget">
            
            <div className="ctd-booking__header">
              <div className="ctd-booking__price-label">GIÁ TỪ</div>
              <div className="ctd-booking__price">1.250.000 VND</div>
              <div className="ctd-booking__price-unit">/ khách / lượt</div>
            </div>

            <div className="ctd-booking__form">
              <div className="ctd-booking__fields">
                <div>
                  <label className="ctd-booking__field-label">LOẠI CHỖ</label>
                  <div className="ctd-booking__field-box">
                    <Bed className="ctd-booking__field-icon" />
                    <span className="ctd-booking__field-value">Giường nằm khoang 4</span>
                  </div>
                </div>
                <div>
                  <label className="ctd-booking__field-label">NGÀY ĐI</label>
                  <div className="ctd-booking__field-box">
                    <Calendar className="ctd-booking__field-icon" />
                    <span className="ctd-booking__field-value">Thứ 6, 24 Tháng 5, 2024</span>
                  </div>
                </div>
              </div>

              <div className="ctd-booking__breakdown">
                <div className="ctd-booking__row">
                  <span className="ctd-booking__row-label">Hành khách ({selectedSeats.length}x)</span>
                  <span className="ctd-booking__row-value">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="ctd-booking__row">
                  <span className="ctd-booking__row-label">Thuế & phí</span>
                  <span className="ctd-booking__row-value--free">Miễn phí</span>
                </div>
              </div>

              <div className="ctd-booking__divider"></div>

              <div className="ctd-booking__total">
                <span className="ctd-booking__total-label">Tổng cộng</span>
                <span className="ctd-booking__total-price">
                  {selectedSeats.length > 0 ? formatCurrency(totalPrice) : '0 VND'}
                </span>
              </div>

              <button 
                disabled={selectedSeats.length === 0}
                className={`ctd-booking__cta ${selectedSeats.length > 0 ? 'ctd-booking__cta--active' : 'ctd-booking__cta--disabled'}`}
              >
                ĐẶT VÉ NGAY
              </button>
              
              <p className="ctd-booking__guarantee">
                Đảm bảo hoàn tiền 100% khi hủy trước 24h
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Gallery Section */}
      <div className="ctd-gallery">
        <h2 className="ctd-gallery__title">
          <span className="ctd-gallery__title-bar"></span>
          Hình ảnh toa tàu & Dịch vụ
        </h2>
        <div className="ctd-gallery__grid">
          <img src="https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Inside Train" className="ctd-gallery__image" />
          <img src="https://images.unsplash.com/photo-1533230623300-bc10af20f7f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Train Window" className="ctd-gallery__image" />
          <img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Train View" className="ctd-gallery__image" />
        </div>
      </div>
      
    </div>
  );
};

export default CustomerTrainDetail;
