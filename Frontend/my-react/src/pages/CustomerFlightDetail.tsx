import "../assets/css/CustomerFlightDetail.css";
import { ArrowRight, Plane, Briefcase, Shield, XCircle, Calendar, Info } from 'lucide-react';

const CustomerFlightDetail = () => {
  return (
    <div className="cfd-page">
      <main className="cfd-main">
        
        {/* Title Section */}
        <div className="cfd-title-section">
          <h1 className="cfd-title">Chi tiết chuyến bay</h1>
          <div className="cfd-subtitle">
            <span>TP. Hồ Chí Minh (SGN)</span>
            <ArrowRight className="cfd-subtitle__arrow" />
            <span>Hà Nội (HAN)</span>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="cfd-layout">
          
          {/* Left Column */}
          <div className="cfd-layout__left">
            
            {/* Main Flight Card */}
            <div className="cfd-card">
              <div className="cfd-flight-header">
                <div className="cfd-flight-header__left">
                  <div className="cfd-flight-header__icon-wrap">
                    <Plane className="cfd-flight-header__icon" />
                  </div>
                  <div>
                    <div className="cfd-flight-header__airline">Vietnam Airlines</div>
                    <div className="cfd-flight-header__code">VN 210 • Phổ thông</div>
                  </div>
                </div>
                <div className="cfd-flight-header__badge">Siêu Tiết Kiệm</div>
              </div>

              {/* Timeline */}
              <div className="cfd-timeline">
                <div className="cfd-timeline__point">
                  <div className="cfd-timeline__time">08:00</div>
                  <div className="cfd-timeline__code">SGN</div>
                  <div className="cfd-timeline__airport">Sân bay Tân Sơn Nhất</div>
                </div>

                <div className="cfd-timeline__line-wrap">
                  <div className="cfd-timeline__duration">2h 10m</div>
                  <div className="cfd-timeline__line">
                    <div className="cfd-timeline__dot cfd-timeline__dot--left"></div>
                    <div className="cfd-timeline__dot cfd-timeline__dot--right"></div>
                    <div className="cfd-timeline__plane-icon">
                      <Plane style={{ width: '1.25rem', height: '1.25rem' }} />
                    </div>
                  </div>
                  <div className="cfd-timeline__type">Bay thẳng</div>
                </div>

                <div className="cfd-timeline__point">
                  <div className="cfd-timeline__time">10:10</div>
                  <div className="cfd-timeline__code">HAN</div>
                  <div className="cfd-timeline__airport">Sân bay Nội Bài</div>
                </div>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="cfd-info-grid">
              
              {/* Card 1 */}
              <div className="cfd-info-card">
                <div className="cfd-info-card__header">
                  <Briefcase className="cfd-info-card__icon" />
                  <h3 className="cfd-info-card__title">Hành lý & Tiện ích</h3>
                </div>
                <div className="cfd-info-card__list">
                  <div className="cfd-info-card__row">
                    <span className="cfd-info-card__label">Hành lý xách tay</span>
                    <span className="cfd-info-card__value">12kg</span>
                  </div>
                  <div className="cfd-info-card__row">
                    <span className="cfd-info-card__label">Hành lý ký gửi</span>
                    <span className="cfd-info-card__value">23kg</span>
                  </div>
                  <div className="cfd-info-card__row">
                    <span className="cfd-info-card__label">Suất ăn</span>
                    <span className="cfd-info-card__value--primary">Có sẵn</span>
                  </div>
                  <div className="cfd-info-card__row">
                    <span className="cfd-info-card__label">Giải trí</span>
                    <span className="cfd-info-card__value">Màn hình riêng</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="cfd-info-card">
                <div className="cfd-info-card__header">
                  <Shield className="cfd-info-card__icon" />
                  <h3 className="cfd-info-card__title">Điều kiện vé</h3>
                </div>
                <div className="cfd-info-card__policy">
                  <div className="cfd-info-card__policy-item">
                    <XCircle className="cfd-info-card__policy-icon cfd-info-card__policy-icon--danger" />
                    <div>
                      <div className="cfd-info-card__policy-title">Không hoàn tiền</div>
                      <div className="cfd-info-card__policy-desc">Vé không áp dụng chính sách hoàn hủy.</div>
                    </div>
                  </div>
                  <div className="cfd-info-card__policy-item">
                    <Calendar className="cfd-info-card__policy-icon cfd-info-card__policy-icon--primary" />
                    <div>
                      <div className="cfd-info-card__policy-title">Đổi ngày bay</div>
                      <div className="cfd-info-card__policy-desc">Có thu phí và chênh lệch giá vé (nếu có).</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Notice */}
            <div className="cfd-notice">
              <Info className="cfd-notice__icon" />
              <p className="cfd-notice__text">
                Giá vé đã bao gồm các loại thuế và phí dịch vụ. Vui lòng kiểm tra kỹ thông tin hành khách, ngày giờ bay và điều kiện hành lý trước khi tiến hành thanh toán.
              </p>
            </div>

          </div>

          {/* Right Column */}
          <div className="cfd-layout__right">
            <div className="cfd-cost-widget">
              <div className="cfd-cost-card">
                
                <h2 className="cfd-cost-card__title">Tóm tắt chi phí</h2>
                
                <div className="cfd-cost-card__breakdown">
                  <div className="cfd-cost-card__row">
                    <span className="cfd-cost-card__label">Vietnam Airlines (x1)</span>
                    <span className="cfd-cost-card__value">1.850.000 VND</span>
                  </div>
                  <div className="cfd-cost-card__row">
                    <span className="cfd-cost-card__label">Thuế & Phí sân bay</span>
                    <span className="cfd-cost-card__value">420.000 VND</span>
                  </div>
                </div>

                <div className="cfd-cost-card__divider"></div>

                <div className="cfd-cost-card__total">
                  <div>
                    <div className="cfd-cost-card__total-label">Tổng cộng</div>
                    <div className="cfd-cost-card__total-sub">Đã bao gồm thuế, phí</div>
                  </div>
                  <div className="cfd-cost-card__total-price">2.270.000 VND</div>
                </div>

                <button className="cfd-cost-card__cta">
                  Chọn chuyến bay này <ArrowRight className="cfd-cost-card__cta-icon" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Suggestions */}
        <div className="cfd-suggestions">
          <h2 className="cfd-suggestions__title">Gợi ý cho chuyến đi Hà Nội</h2>
          <div className="cfd-suggestions__grid">
            
            <div className="cfd-suggestion-card">
              <img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Phố Cổ Hà Nội" className="cfd-suggestion-card__image" />
              <div className="cfd-suggestion-card__overlay"></div>
              <div className="cfd-suggestion-card__content">
                <div className="cfd-suggestion-card__eyebrow">KHÁM PHÁ</div>
                <div className="cfd-suggestion-card__name">Phố Cổ Hà Nội</div>
              </div>
            </div>

            <div className="cfd-suggestion-card">
              <img src="https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Tour Hạ Long 2N1Đ" className="cfd-suggestion-card__image" />
              <div className="cfd-suggestion-card__overlay"></div>
              <div className="cfd-suggestion-card__content">
                <div className="cfd-suggestion-card__eyebrow">TRẢI NGHIỆM</div>
                <div className="cfd-suggestion-card__name">Tour Hạ Long 2N1Đ</div>
              </div>
            </div>

            <div className="cfd-suggestion-card">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Khách sạn 5 sao" className="cfd-suggestion-card__image" />
              <div className="cfd-suggestion-card__overlay"></div>
              <div className="cfd-suggestion-card__content">
                <div className="cfd-suggestion-card__eyebrow">NGHỈ DƯỠNG</div>
                <div className="cfd-suggestion-card__name">Khách sạn 5 sao</div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default CustomerFlightDetail;
