import { useState } from 'react';
import "../assets/css/CustomerActivityDetail.css";
import { MapPin, Star, Share2, Heart, Check, X, Calendar, Users } from 'lucide-react';

const CustomerActivityDetail = () => {
  const [selectedPackage, setSelectedPackage] = useState<'standard' | 'premium'>('standard');
  const [guestCount, setGuestCount] = useState<number>(2);

  const prices = {
    standard: 850000,
    premium: 1250000,
  };

  const totalPrice = prices[selectedPackage] * guestCount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
  };

  const timelineSteps = [
    { time: '08:00', title: 'Đón khách', description: 'Xe và HDV đón quý khách tại khách sạn khu vực trung tâm Dương Đông.' },
    { time: '09:30', title: 'Check-in Cảng An Thới', description: 'Lên cano siêu tốc, bắt đầu hành trình khám phá 4 đảo đẹp nhất Phú Quốc.' },
    { time: '11:00', title: 'Lặn ngắm san hô (Snorkeling)', description: 'Tự do tắm biển và lặn ngắm rạn san hô tự nhiên tuyệt đẹp tại Hòn Gầm Ghì hoặc Hòn Buồm.' },
    { time: '12:30', title: 'Ăn trưa hải sản', description: 'Thưởng thức bữa trưa 8 món hải sản tươi sống tại nhà hàng trên đảo.' },
  ];

  const reviews = [
    {
      name: 'Nguyễn Thị Hoa',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      text: 'Trải nghiệm tuyệt vời! HDV rất nhiệt tình và chụp ảnh siêu có tâm. Cano mới, đi êm không bị say sóng. Đồ ăn trưa ngon miệng và phong phú.',
    },
    {
      name: 'Trần Văn Nam',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      text: 'Cảnh quan Phú Quốc thật sự rất đẹp. Được lặn ngắm san hô là trải nghiệm đáng nhớ nhất. Rất đáng đồng tiền bát gạo.',
    },
  ];

  return (
    <div className="bg-[#F5F7FA] min-h-screen font-sans text-gray-800 pt-[120px]">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-6 font-medium">
          Trang chủ &gt; Phú Quốc &gt; <span className="text-gray-800">Tour 4 Đảo Cano</span>
        </div>

        {/* Product Title Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Tour 4 Đảo Phú Quốc Bằng Cano</h1>
            <div className="flex items-center flex-wrap gap-4 text-sm">
              <div className="flex items-center text-orange-500 font-semibold bg-orange-50 px-2.5 py-1 rounded-md">
                <Star className="w-4 h-4 fill-current mr-1.5" />
                4.9 <span className="text-gray-500 font-normal ml-1">(1.2k+ đánh giá)</span>
              </div>
              <div className="flex items-center text-gray-500">
                <MapPin className="w-4 h-4 mr-1.5" />
                An Thới, Phú Quốc
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm bg-white">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm bg-white">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Image Gallery (Bento Grid) */}
        <div className="grid grid-cols-12 gap-2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden mt-6 shadow-sm">
          <div className="col-span-12 md:col-span-8 h-full">
            <img 
              src="https://images.unsplash.com/photo-1596522354195-e83ae3a4c514?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Canoe on beach" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
            />
          </div>
          <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-2 h-full hidden md:grid">
            <div className="grid grid-cols-2 gap-2 h-full">
              <img 
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Coral" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
              />
              <img 
                src="https://images.unsplash.com/photo-1610996152865-c3f25c77a834?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Beach view" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
              />
            </div>
            <div className="h-full">
              <img 
                src="https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Seafood" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Main Content Layout (2 Columns) */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          
          {/* Left Column (Content details) - 65% */}
          <div className="lg:w-[65%] space-y-10">
            
            {/* Mô tả hoạt động */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-[#0194F3] rounded-full mr-3 inline-block"></span>
                Mô tả hoạt động
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Khám phá vẻ đẹp hoang sơ và kỳ vĩ của thiên đường biển đảo Phú Quốc với hành trình Tour 4 Đảo bằng cano siêu tốc. 
                Bạn sẽ được đắm mình trong làn nước trong vắt, lặn ngắm những rạn san hô tự nhiên đa dạng sắc màu tại Hòn Gầm Ghì, 
                thư giãn trên bãi cát trắng mịn của Hòn Mây Rút, và thưởng thức hải sản tươi ngon mang đậm hương vị biển cả. 
                Một chuyến đi lý tưởng để nạp lại năng lượng và ghi lại những khoảnh khắc tuyệt đẹp cùng gia đình và bạn bè.
              </p>
            </section>

            {/* Lịch trình chi tiết */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-[#0194F3] rounded-full mr-3 inline-block"></span>
                Lịch trình chi tiết
              </h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="relative flex items-start group">
                    <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white border-4 border-blue-100 group-hover:border-blue-200 transition-colors z-10">
                      <span className="text-[#0194F3] font-bold text-sm">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="pl-14 md:pl-0 w-full flex flex-col md:flex-row md:items-center justify-between md:odd:flex-row-reverse group-hover:-translate-y-1 transition-transform duration-300">
                      <div className="md:w-[45%] bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm relative">
                        {/* Connecting arrow for larger screens */}
                        <div className="hidden md:block absolute top-5 w-4 h-4 bg-gray-50 border-t border-r border-gray-100 rotate-45 transform -translate-y-1/2 right-[-8.5px] md:group-odd:right-auto md:group-odd:left-[-8.5px] md:group-odd:-rotate-[135deg]"></div>
                        <div className="text-[#0194F3] font-bold mb-1">{step.time}</div>
                        <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bao gồm & Không bao gồm */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-[#0194F3] rounded-full mr-3 inline-block"></span>
                Dịch vụ bao gồm & Không bao gồm
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center text-lg">
                    <span className="bg-green-100 p-1 rounded-full mr-2">
                      <Check className="w-4 h-4 text-green-600" />
                    </span>
                    Bao gồm
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /> Xe đưa đón máy lạnh tại khách sạn</li>
                    <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /> Cano siêu tốc hiện đại</li>
                    <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /> Hướng dẫn viên địa phương nhiệt tình</li>
                    <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /> Bữa ăn trưa hải sản 8 món</li>
                    <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /> Dụng cụ lặn: áo phao, kính lặn, ống thở</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center text-lg">
                    <span className="bg-red-100 p-1 rounded-full mr-2">
                      <X className="w-4 h-4 text-red-600" />
                    </span>
                    Không bao gồm
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start"><X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" /> Chi phí cá nhân phát sinh</li>
                    <li className="flex items-start"><X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" /> Vé tham quan các khu du lịch khác</li>
                    <li className="flex items-start"><X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" /> Thuế VAT</li>
                    <li className="flex items-start"><X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" /> Tiền tip cho HDV và tài xế (không bắt buộc)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Vị trí khởi hành */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-[#0194F3] rounded-full mr-3 inline-block"></span>
                Vị trí khởi hành
              </h2>
              <div className="relative w-full h-[250px] rounded-xl overflow-hidden border border-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Map Placeholder" 
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 border border-gray-100 hover:scale-105 transition-transform cursor-pointer">
                    <div className="bg-blue-100 p-1.5 rounded-full">
                      <MapPin className="w-5 h-5 text-[#0194F3]" />
                    </div>
                    <span className="font-semibold text-gray-800">Cảng An Thới, Phú Quốc</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Đánh giá */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-end mb-6">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center">
                   <span className="w-1.5 h-6 bg-[#0194F3] rounded-full mr-3 inline-block"></span>
                   Đánh giá từ khách hàng
                 </h2>
                 <a href="#" className="text-[#0194F3] text-sm font-medium hover:underline">Xem tất cả</a>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {reviews.map((review, idx) => (
                   <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                     <div className="flex items-center space-x-3 mb-3">
                       <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                       <div>
                         <div className="font-semibold text-gray-900">{review.name}</div>
                         <div className="flex text-orange-500 mt-0.5">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} className="w-3.5 h-3.5 fill-current" />
                           ))}
                         </div>
                       </div>
                     </div>
                     <p className="text-gray-600 text-sm italic leading-relaxed">"{review.text}"</p>
                   </div>
                 ))}
               </div>
            </section>

          </div>

          {/* Right Column (Sticky Booking Widget) - 35% */}
          <div className="lg:w-[35%] relative">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
              
              {/* Price Header */}
              <div className="mb-6">
                <div className="text-gray-500 text-sm font-medium mb-1">Giá từ</div>
                <div className="flex items-end space-x-3">
                  <div className="text-3xl font-bold text-[#0194F3]">850.000đ</div>
                  <div className="text-gray-400 line-through text-sm mb-1.5">1.100.000đ</div>
                </div>
              </div>

              {/* Package Selection */}
              <div className="mb-6 space-y-3">
                <div className="text-sm font-bold text-gray-900 mb-2">Chọn gói dịch vụ</div>
                
                {/* Option 1 */}
                <div 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPackage === 'standard' ? 'border-[#0194F3] bg-[#0194F3]/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                  onClick={() => setSelectedPackage('standard')}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-gray-800">Standard Tour</div>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      {selectedPackage === 'standard' && <div className="w-2.5 h-2.5 bg-[#0194F3] rounded-full"></div>}
                    </div>
                  </div>
                  <div className="text-[#0194F3] font-medium mt-1">850.000đ <span className="text-gray-500 font-normal text-sm">/ khách</span></div>
                </div>

                {/* Option 2 */}
                <div 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPackage === 'premium' ? 'border-[#0194F3] bg-[#0194F3]/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                  onClick={() => setSelectedPackage('premium')}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-gray-800">Premium (Flycam + Clip)</div>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      {selectedPackage === 'premium' && <div className="w-2.5 h-2.5 bg-[#0194F3] rounded-full"></div>}
                    </div>
                  </div>
                  <div className="text-[#0194F3] font-medium mt-1">1.250.000đ <span className="text-gray-500 font-normal text-sm">/ khách</span></div>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-3 mb-6">
                <div className="w-full border border-gray-200 rounded-xl p-3.5 flex items-center hover:border-[#0194F3] transition-colors cursor-pointer group">
                  <div className="bg-blue-50 p-2 rounded-lg text-[#0194F3] mr-4 group-hover:bg-[#0194F3] group-hover:text-white transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Ngày khởi hành</div>
                    <div className="font-semibold text-gray-900">24 Th10, 2024</div>
                  </div>
                </div>

                <div className="w-full border border-gray-200 rounded-xl p-3.5 flex items-center justify-between hover:border-[#0194F3] transition-colors">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-lg text-[#0194F3] mr-4">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Khách hàng</div>
                      <div className="font-semibold text-gray-900">{guestCount} Người lớn</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      disabled={guestCount <= 1}
                    >
                      -
                    </button>
                    <span className="font-semibold w-4 text-center">{guestCount}</span>
                    <button 
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#0194F3] hover:bg-blue-50"
                      onClick={() => setGuestCount(guestCount + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Section */}
              <div className="border-t border-gray-100 pt-5 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Tổng cộng</span>
                  <span className="text-2xl font-bold text-[#0194F3]">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full bg-[#0194F3] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                Đặt ngay bây giờ
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 mr-1 text-green-500" /> Xác nhận tức thì. Không phí ẩn.
              </p>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default CustomerActivityDetail;
