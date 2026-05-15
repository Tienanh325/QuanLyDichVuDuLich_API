import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../assets/css/CustomerActivityDetail.css";
import { MapPin, Star, Share2, Heart, Check, X, Calendar, Users } from 'lucide-react';
import { getTourById, type TourDetail } from '../services/tourService';
import ReviewSection from '../components/ReviewSection';

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1596522354195-e83ae3a4c514?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

const CustomerActivityDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestCount, setGuestCount] = useState<number>(2);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getTourById(id).then(setTour).catch(() => setTour(null)).finally(() => setLoading(false));
  }, [id]);

  const price = Number(tour?.giaKhuyenMai || tour?.giaTour || 0);
  const originalPrice = tour?.giaGoc;
  const totalPrice = price * guestCount;
  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

  if (loading) return <div className="bg-[#F5F7FA] min-h-screen font-sans text-gray-800 pt-[120px]"><main className="max-w-7xl mx-auto px-4 py-6">Đang tải hoạt động...</main></div>;
  if (!tour) return <div className="bg-[#F5F7FA] min-h-screen font-sans text-gray-800 pt-[120px]"><main className="max-w-7xl mx-auto px-4 py-6">Không tìm thấy hoạt động.</main></div>;

  return (
    <div className="bg-[#F5F7FA] min-h-screen font-sans text-gray-800 pt-[120px]">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-sm text-gray-500 mb-6 font-medium">
          Trang chủ &gt; {tour.diaDiem || tour.viTri || 'Việt Nam'} &gt; <span className="text-gray-800">{tour.tenTour || tour.ten}</span>
        </div>

        <div className="cad-motion-title flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{tour.tenTour || tour.ten}</h1>
            <div className="flex items-center flex-wrap gap-4 text-sm">
              <div className="flex items-center text-orange-500 font-semibold bg-orange-50 px-2.5 py-1 rounded-md">
                <Star className="w-4 h-4 fill-current mr-1.5" />
                {Number(tour.diemDanhGia || tour.danhGia?.diemTrungBinh || 0).toFixed(1)} <span className="text-gray-500 font-normal ml-1">({tour.soLuotDanhGia || tour.danhGia?.soLuongDanhGia || 0} đánh giá)</span>
              </div>
              <div className="flex items-center text-gray-500"><MapPin className="w-4 h-4 mr-1.5" />{tour.diaDiem || tour.viTri || 'Việt Nam'}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm bg-white"><Share2 className="w-5 h-5" /></button>
            <button className="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm bg-white"><Heart className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="cad-motion-gallery grid grid-cols-12 gap-2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden mt-6 shadow-sm">
          <div className="col-span-12 md:col-span-8 h-full"><img src={tour.avatar || tour.hinhAnh?.[0]?.urlAnh || PLACEHOLDER_IMAGE} alt={tour.tenTour || tour.ten} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" /></div>
          <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-2 h-full hidden md:grid">
            <img src={tour.avatar || PLACEHOLDER_IMAGE} alt={tour.tenTour || tour.ten} className="w-full h-full object-cover" />
            <img src={PLACEHOLDER_IMAGE} alt={tour.diaDiem || 'Tour'} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="lg:w-[65%] space-y-10">
            <section className="cad-motion-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><span className="w-1.5 h-6 bg-[#0194F3] rounded-full mr-3 inline-block"></span>Mô tả hoạt động</h2>
              <p className="text-gray-600 leading-relaxed">{tour.moTaHoatDong || tour.moTa || 'Thông tin hoạt động đang được cập nhật.'}</p>
            </section>

            <section className="cad-motion-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><span className="w-1.5 h-6 bg-[#0194F3] rounded-full mr-3 inline-block"></span>Thông tin chuyến đi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div><b>Thời gian:</b> {tour.thoiGian || 'Đang cập nhật'}</div>
                <div><b>Khởi hành:</b> {tour.viTriKhoiHanh || 'Đang cập nhật'}</div>
                <div><b>Số khách:</b> {tour.soLuongKhach || 0}</div>
                <div><b>Highlight:</b> {tour.highlight || 'Tour & hoạt động'}</div>
              </div>
            </section>

            <section className="cad-motion-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><span className="w-1.5 h-6 bg-[#0194F3] rounded-full mr-3 inline-block"></span>Dịch vụ bao gồm & chính sách</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div><h3 className="font-semibold text-gray-800 mb-4 flex items-center text-lg"><span className="bg-green-100 p-1 rounded-full mr-2"><Check className="w-4 h-4 text-green-600" /></span>Bao gồm</h3><ul className="space-y-3 text-gray-600"><li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /> Dịch vụ theo mô tả tour</li><li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /> Hỗ trợ đặt chỗ nhanh</li></ul></div>
                <div><h3 className="font-semibold text-gray-800 mb-4 flex items-center text-lg"><span className="bg-red-100 p-1 rounded-full mr-2"><X className="w-4 h-4 text-red-600" /></span>Chính sách</h3><ul className="space-y-3 text-gray-600"><li className="flex items-start"><X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" /> {tour.chinhSachHuy || 'Theo chính sách nhà cung cấp'}</li></ul></div>
              </div>
            </section>
          </div>

          <div className="lg:w-[35%] relative">
            <div className="cad-motion-booking sticky top-24 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
              <div className="mb-6"><div className="text-gray-500 text-sm font-medium mb-1">Giá từ</div><div className="flex items-end space-x-3"><div className="text-3xl font-bold text-[#0194F3]">{formatCurrency(price)}</div>{originalPrice ? <div className="text-gray-400 line-through text-sm mb-1.5">{formatCurrency(originalPrice)}</div> : null}</div></div>
              <div className="space-y-3 mb-6">
                <div className="w-full border border-gray-200 rounded-xl p-3.5 flex items-center hover:border-[#0194F3] transition-colors cursor-pointer group"><div className="bg-blue-50 p-2 rounded-lg text-[#0194F3] mr-4 group-hover:bg-[#0194F3] group-hover:text-white transition-colors"><Calendar className="w-5 h-5" /></div><div><div className="text-xs text-gray-500 font-medium">Ngày khởi hành</div><div className="font-semibold text-gray-900">{tour.ngayBatDau ? new Date(tour.ngayBatDau).toLocaleDateString('vi-VN') : 'Linh hoạt'}</div></div></div>
                <div className="w-full border border-gray-200 rounded-xl p-3.5 flex items-center justify-between hover:border-[#0194F3] transition-colors"><div className="flex items-center"><div className="bg-blue-50 p-2 rounded-lg text-[#0194F3] mr-4"><Users className="w-5 h-5" /></div><div><div className="text-xs text-gray-500 font-medium">Khách hàng</div><div className="font-semibold text-gray-900">{guestCount} Người lớn</div></div></div><div className="flex items-center space-x-2"><button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50" onClick={() => setGuestCount(Math.max(1, guestCount - 1))} disabled={guestCount <= 1}>-</button><span className="font-semibold w-4 text-center">{guestCount}</span><button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#0194F3] hover:bg-blue-50" onClick={() => setGuestCount(guestCount + 1)}>+</button></div></div>
              </div>
              <div className="border-t border-gray-100 pt-5 mb-6"><div className="flex justify-between items-center"><span className="font-semibold text-gray-800">Tổng cộng</span><span className="text-2xl font-bold text-[#0194F3]">{formatCurrency(totalPrice)}</span></div></div>
              <button className="w-full bg-[#0194F3] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">Đặt ngay bây giờ</button>
              <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center"><Check className="w-3.5 h-3.5 mr-1 text-green-500" /> {tour.xacNhanTucThi ? 'Xác nhận tức thì.' : 'Xác nhận theo nhà cung cấp.'} Không phí ẩn.</p>
            </div>
          </div>
        </div>
        <ReviewSection maDichVu={tour.maDichVu} serviceName={tour.tenTour || tour.ten || 'tour'} serviceType="tour" />
      </main>
    </div>
  );
};

export default CustomerActivityDetail;
