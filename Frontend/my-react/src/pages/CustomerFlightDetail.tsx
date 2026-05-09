import React from 'react';
import { ArrowRight, Plane, Briefcase, Shield, XCircle, Calendar, Info, CheckCircle } from 'lucide-react';

const CustomerFlightDetail = () => {
  return (
    <div className="bg-[#F5F7FA] min-h-screen font-sans text-gray-800 flex flex-col pt-[120px]">
      {/* Main Content Wrapper */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 pb-12">
        
        {/* B. Page Title Section */}
        <div className="py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chi tiết chuyến bay</h1>
          <div className="flex items-center text-gray-500 font-medium">
            <span>TP. Hồ Chí Minh (SGN)</span>
            <ArrowRight className="w-4 h-4 mx-2" />
            <span>Hà Nội (HAN)</span>
          </div>
        </div>

        {/* C. Main Content Layout (2 Columns) */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* D. Left Column (Flight Details) - ~65% */}
          <div className="lg:w-[65%] space-y-6">
            
            {/* Main Flight Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Top Row */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <Plane className="w-6 h-6 text-blue-600 transform -rotate-45" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-900">Vietnam Airlines</div>
                    <div className="text-sm text-gray-500 font-medium">VN 210 • Phổ thông</div>
                  </div>
                </div>
                <div className="bg-blue-50 text-[#0194F3] text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100 tracking-wide uppercase">
                  Siêu Tiết Kiệm
                </div>
              </div>

              {/* Timeline Row */}
              <div className="flex items-center justify-between">
                {/* Departure */}
                <div className="text-center w-1/4">
                  <div className="text-3xl font-bold text-gray-900">08:00</div>
                  <div className="font-bold text-gray-700 mt-1">SGN</div>
                  <div className="text-xs text-gray-500 mt-1">Sân bay Tân Sơn Nhất</div>
                </div>

                {/* Duration & Line */}
                <div className="flex-1 flex flex-col items-center px-4 relative">
                  <div className="text-sm font-medium text-gray-500 mb-2 bg-white px-2 z-10">2h 10m</div>
                  <div className="w-full h-[2px] bg-gray-200 relative flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 absolute left-0"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 absolute right-0"></div>
                    <div className="bg-white px-2 absolute z-10">
                      <Plane className="w-5 h-5 text-[#0194F3]" />
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-[#0194F3] mt-2">Bay thẳng</div>
                </div>

                {/* Arrival */}
                <div className="text-center w-1/4">
                  <div className="text-3xl font-bold text-gray-900">10:10</div>
                  <div className="font-bold text-gray-700 mt-1">HAN</div>
                  <div className="text-xs text-gray-500 mt-1">Sân bay Nội Bài</div>
                </div>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Card 1: Hành lý & Tiện ích */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
                <div className="flex items-center space-x-3 mb-4">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                  <h3 className="font-bold text-gray-900">Hành lý & Tiện ích</h3>
                </div>
                <div className="space-y-3 flex-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hành lý xách tay</span>
                    <span className="font-semibold text-gray-800">12kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hành lý ký gửi</span>
                    <span className="font-semibold text-gray-800">23kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Suất ăn</span>
                    <span className="font-semibold text-[#0194F3]">Có sẵn</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Giải trí</span>
                    <span className="font-semibold text-gray-800">Màn hình riêng</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Điều kiện vé */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <h3 className="font-bold text-gray-900">Điều kiện vé</h3>
                </div>
                <div className="space-y-4 flex-1 text-sm">
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-800">Không hoàn tiền</div>
                      <div className="text-gray-500 text-xs mt-0.5">Vé không áp dụng chính sách hoàn hủy.</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-[#0194F3] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-800">Đổi ngày bay</div>
                      <div className="text-gray-500 text-xs mt-0.5">Có thu phí và chênh lệch giá vé (nếu có).</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Notice Box */}
            <div className="bg-gray-100/50 rounded-xl p-4 flex items-start space-x-3 border border-gray-200">
              <Info className="w-5 h-5 text-[#0194F3] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Giá vé đã bao gồm các loại thuế và phí dịch vụ. Vui lòng kiểm tra kỹ thông tin hành khách, ngày giờ bay và điều kiện hành lý trước khi tiến hành thanh toán.
              </p>
            </div>

          </div>

          {/* E. Right Column (Sticky Cost Summary) - ~35% */}
          <div className="lg:w-[35%] relative">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 flex flex-col">
                
                <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt chi phí</h2>
                
                {/* Breakdown */}
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Vietnam Airlines (x1)</span>
                    <span className="font-semibold text-gray-800">1.850.000 VND</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Thuế & Phí sân bay</span>
                    <span className="font-semibold text-gray-800">420.000 VND</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 mb-6"></div>

                {/* Total */}
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Tổng cộng</div>
                    <div className="text-xs text-gray-500 mt-1 font-medium">Đã bao gồm thuế, phí</div>
                  </div>
                  <div className="text-3xl font-bold text-[#C04A15] tracking-tight">
                    2.270.000 VND
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full bg-[#0194F3] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 text-lg mb-4 flex items-center justify-center">
                  Chọn chuyến bay này <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* F. Suggestions Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gợi ý cho chuyến đi Hà Nội</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* Suggestion Card 1 */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Phố Cổ Hà Nội" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                <div className="text-xs font-bold tracking-widest text-white/80 mb-1">KHÁM PHÁ</div>
                <div className="text-xl font-bold">Phố Cổ Hà Nội</div>
              </div>
            </div>

            {/* Suggestion Card 2 */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Tour Hạ Long 2N1Đ" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                <div className="text-xs font-bold tracking-widest text-white/80 mb-1">TRẢI NGHIỆM</div>
                <div className="text-xl font-bold">Tour Hạ Long 2N1Đ</div>
              </div>
            </div>

            {/* Suggestion Card 3 */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Khách sạn 5 sao" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                <div className="text-xs font-bold tracking-widest text-white/80 mb-1">NGHỈ DƯỠNG</div>
                <div className="text-xl font-bold">Khách sạn 5 sao</div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default CustomerFlightDetail;
