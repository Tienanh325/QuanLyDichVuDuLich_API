import React, { useState } from 'react';
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
  // Mock Data: 6 Cabins, 4 seats each
  const initialCabins: Cabin[] = Array.from({ length: 6 }, (_, cabinIndex) => ({
    id: `cabin-${cabinIndex + 1}`,
    name: `KHOANG ${cabinIndex + 1}`,
    seats: Array.from({ length: 4 }, (_, seatIndex) => {
      const seatNumber = (cabinIndex * 4 + seatIndex + 1).toString().padStart(2, '0');
      // Randomly mock some booked seats (e.g., seat 3 in cabin 1, seat 1 in cabin 3)
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
    <div className="bg-[#F5F7FA] min-h-screen font-sans text-gray-800 pb-12 pt-[120px]">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[400px]">
        <img 
          src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Train Landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full pb-24 px-6">
          <div className="max-w-6xl mx-auto flex flex-col items-start">
            <div className="flex space-x-3 mb-4">
              <span className="bg-[#0194F3] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">TÀU THỐNG NHẤT</span>
              <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">MÃ CHUYẾN: SE1</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md">
              Hành trình Di sản: Hà Nội - Đà Nẵng
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 px-4 md:px-6 -mt-16 relative z-10">
        
        {/* Left Column (Details) - ~65% */}
        <div className="lg:w-[65%] space-y-6">
          
          {/* Lịch trình chi tiết */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Lịch trình chuyến đi</h2>
            <div className="flex items-center justify-between">
              <div className="text-center w-1/4">
                <div className="text-2xl font-bold text-[#0194F3]">22:15</div>
                <div className="font-semibold text-gray-800 mt-1">Ga Hà Nội</div>
                <div className="text-xs text-gray-500 mt-1">23 Th5, 2024</div>
              </div>
              
              <div className="flex-1 flex flex-col items-center px-4 relative">
                <div className="text-xs font-medium text-gray-500 mb-2 bg-white px-2 z-10">15 Giờ 45 Phút</div>
                <div className="w-full h-[2px] bg-gray-200 relative flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300 absolute left-0"></div>
                  <div className="w-2 h-2 rounded-full bg-[#0194F3] absolute right-0"></div>
                  <div className="bg-white p-2 rounded-full border-2 border-gray-200 absolute z-10 text-gray-400">
                    <Train className="w-5 h-5 text-[#0194F3]" />
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">Chuyến đi thẳng</div>
              </div>

              <div className="text-center w-1/4">
                <div className="text-2xl font-bold text-gray-800">14:00</div>
                <div className="font-semibold text-gray-800 mt-1">Ga Đà Nẵng</div>
                <div className="text-xs text-gray-500 mt-1">24 Th5, 2024</div>
              </div>
            </div>
          </div>

          {/* Tiện ích trên tàu */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tiện ích trên tàu</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50/50 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-blue-50">
                <Wifi className="w-6 h-6 text-[#0194F3] mb-2" />
                <span className="text-sm font-medium text-gray-700">Wi-Fi Miễn Phí</span>
              </div>
              <div className="bg-blue-50/50 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-blue-50">
                <Snowflake className="w-6 h-6 text-[#0194F3] mb-2" />
                <span className="text-sm font-medium text-gray-700">Điều Hòa</span>
              </div>
              <div className="bg-blue-50/50 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-blue-50">
                <Utensils className="w-6 h-6 text-[#0194F3] mb-2" />
                <span className="text-sm font-medium text-gray-700">Căn Tin</span>
              </div>
              <div className="bg-blue-50/50 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-blue-50">
                <Plug className="w-6 h-6 text-[#0194F3] mb-2" />
                <span className="text-sm font-medium text-gray-700">Ổ Cắm Điện</span>
              </div>
            </div>
          </div>

          {/* Sơ đồ toa tàu (Seat Map) */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-lg font-bold text-gray-900">Toa số 5: Giường nằm khoang 4</h2>
              <div className="flex items-center space-x-4 text-sm font-medium text-gray-600">
                <div className="flex items-center"><Square className="w-4 h-4 text-gray-300 fill-gray-200 mr-1.5" /> Đã đặt</div>
                <div className="flex items-center"><Square className="w-4 h-4 text-[#0194F3] mr-1.5" /> Còn trống</div>
                <div className="flex items-center"><CheckSquare className="w-4 h-4 text-[#0194F3] fill-blue-50 mr-1.5" /> Đang chọn</div>
              </div>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <div className="flex items-stretch min-w-max space-x-2">
                {/* Train Head/Door */}
                <div className="w-16 bg-gray-700 rounded-l-[40px] rounded-r-lg flex items-center justify-center relative shadow-inner">
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-gray-800"></div>
                  <div className="w-4 h-20 bg-gray-800/50 rounded-full"></div>
                </div>

                {/* Cabins */}
                {cabins.map((cabin) => (
                  <div key={cabin.id} className="border-2 border-gray-200 rounded-xl p-3 w-40 flex flex-col bg-gray-50/50">
                    <div className="text-center text-xs font-bold text-gray-500 mb-3 tracking-wider">{cabin.name}</div>
                    <div className="grid grid-cols-2 gap-3 flex-1 place-content-center">
                      {cabin.seats.map((seat) => {
                        const isSelected = selectedSeats.includes(seat.id);
                        return (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === 'booked'}
                            className={`
                              w-12 h-16 rounded-md flex items-center justify-center font-bold text-sm transition-all duration-200
                              ${seat.status === 'booked' 
                                ? 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed' 
                                : isSelected 
                                  ? 'bg-blue-50 text-[#0194F3] border-2 border-[#0194F3] shadow-inner transform scale-95' 
                                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#0194F3] hover:text-[#0194F3]'
                              }
                            `}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Train Tail */}
                <div className="w-8 bg-gray-700 rounded-r-xl relative shadow-inner">
                   <div className="absolute left-0 top-0 bottom-0 w-2 bg-gray-800"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 italic mt-4 text-center">
              * Sơ đồ chỉ mang tính chất minh họa. Các giường số lẻ (01, 03) là giường tầng 1.
            </p>
          </div>
        </div>

        {/* Right Column (Sticky Booking Widget) - ~35% */}
        <div className="lg:w-[35%] relative">
          <div className="sticky top-24 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
            
            {/* Top Header Block */}
            <div className="bg-[#015F96] p-6 text-white">
              <div className="text-xs font-medium text-blue-200 mb-1 tracking-wider">GIÁ TỪ</div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold">1.250.000 VND</span>
              </div>
              <div className="text-sm text-blue-100 mt-0.5">/ khách / lượt</div>
            </div>

            {/* Form Area */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block tracking-wider">LOẠI CHỖ</label>
                  <div className="border border-gray-300 rounded-lg p-3 flex items-center bg-gray-50">
                    <Bed className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-semibold text-gray-800">Giường nằm khoang 4</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block tracking-wider">NGÀY ĐI</label>
                  <div className="border border-gray-300 rounded-lg p-3 flex items-center bg-gray-50">
                    <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-semibold text-gray-800">Thứ 6, 24 Tháng 5, 2024</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4 mt-auto">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Hành khách ({selectedSeats.length}x)</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Thuế & phí</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 my-4"></div>

              {/* Total */}
              <div className="flex justify-between items-end mb-6">
                <span className="font-bold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-[#0194F3]">
                  {selectedSeats.length > 0 ? formatCurrency(totalPrice) : '0 VND'}
                </span>
              </div>

              {/* CTA */}
              <button 
                disabled={selectedSeats.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all ${
                  selectedSeats.length > 0 
                    ? 'bg-[#C04A15] hover:bg-[#a33e11] text-white hover:shadow-lg transform hover:-translate-y-0.5' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                ĐẶT VÉ NGAY
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-4">
                Đảm bảo hoàn tiền 100% khi hủy trước 24h
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Section (Hình ảnh toa tàu) */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-[#0194F3] rounded-full mr-3 inline-block"></span>
          Hình ảnh toa tàu & Dịch vụ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <img 
            src="https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Inside Train" 
            className="w-full aspect-video object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
          />
          <img 
            src="https://images.unsplash.com/photo-1533230623300-bc10af20f7f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Train Window" 
            className="w-full aspect-video object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
          />
          <img 
            src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Train View" 
            className="w-full aspect-video object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
          />
        </div>
      </div>
      
    </div>
  );
};

export default CustomerTrainDetail;
