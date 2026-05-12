import api from './api';

// ─── Types ───────────────────────────────────────────────────────────────────

// Khớp với dashboard.model.js → getOverview() → overview[0]
export interface ThongKeOverview {
  tongKhachHang: number;
  tongAdmin: number;
  tongNhaCungCap: number;
  tongDichVu: number;
  tongTour: number;
  tongKhachSan: number;
  tongVeConTrong: number;
  tongDonDat: number;
  donDangCho: number;
  donHomNay: number;
  tongDoanhThu: number;
  doanhThuHomNay: number;
}

export interface ThanhToanThongKe {
  tongGiaoDich: number;
  tongDoanhThu: number;
  soGiaoDichPending: number;
  soGiaoDichThanhCong: number;
  soGiaoDichThatBai: number;
  giaoDichHomNay: number;
  doanhThuHomNay: number;
}

export interface DoanhThuThang {
  thang: number;
  nam: number;
  soGiaoDich: number;
  tongDoanhThu: number;
}

export interface DashboardLoaiDichVu {
  loaiDichVu: string;
  soLuong: number;
  soLuotDat: number;
  doanhThu: number;
}

export interface DashboardTopDichVu {
  maDichVu: number;
  ten: string;
  loaiDichVu: string;
  soLuotDat: number;
  doanhThu: number;
}

export interface DashboardCanhBao {
  title: string;
  detail: string;
  tone: string;
  value: number;
}

export interface DashboardDonGanDay {
  maDon: number;
  tongGia: number;
  trangThai: string;
  ngayTao: string;
  tenUser: string | null;
  emailUser: string | null;
}

export interface DashboardStats {
  overview: ThongKeOverview;
  doanhThuTheoThang: DoanhThuThang[];
  donGanDay: DashboardDonGanDay[];
  dichVuTheLoai: DashboardLoaiDichVu[];
  topDichVu: DashboardTopDichVu[];
  canhBaoVanHanh: DashboardCanhBao[];
}

export interface DonDatItem {
  maDon: number;
  maUser: number;
  tongGia: number;
  trangThai: string;
  ngayTao: string;
  tenUser: string;
  emailUser: string;
  sdtUser: string;
  tenKhuyenMai: string | null;
  giamGia: number | null;
}

export interface DanhMucHoatDongItem {
  maDanhMuc: number;
  tenDanhMuc: string;
  icon?: string | null;
  gradient?: string | null;
  moTa?: string | null;
  trangThai: number | boolean;
  thuTu: number;
}

export interface TienIchItem {
  maTienIch: number;
  tenTienIch: string;
  icon?: string | null;
  loaiTienIch: 'KHACH_SAN' | 'PHONG' | 'VE' | 'TOUR';
  trangThai: number | boolean;
}

export interface NewsletterItem {
  maDangKy: number;
  email: string;
  source?: string | null;
  trangThai: 'ACTIVE' | 'UNSUBSCRIBED';
  ngayTao: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

// ─── Cấu hình UI ─────────────────────────────────────────────────────────────

export async function adminGetDanhMucHoatDong(): Promise<DanhMucHoatDongItem[]> {
  const response = await api.get<{ status: string; data: DanhMucHoatDongItem[] }>('/api/admin/danh-muc-hoat-dong');
  return response.data.data ?? [];
}

export async function adminCreateDanhMucHoatDong(payload: Partial<DanhMucHoatDongItem>) {
  const response = await api.post('/api/admin/danh-muc-hoat-dong', payload);
  return response.data;
}

export async function adminUpdateDanhMucHoatDong(id: number, payload: Partial<DanhMucHoatDongItem>) {
  const response = await api.put(`/api/admin/danh-muc-hoat-dong/${id}`, payload);
  return response.data;
}

export async function adminDeleteDanhMucHoatDong(id: number) {
  const response = await api.delete(`/api/admin/danh-muc-hoat-dong/${id}`);
  return response.data;
}

export async function adminGetTienIch(params?: { loaiTienIch?: string }): Promise<TienIchItem[]> {
  const response = await api.get<{ status: string; data: TienIchItem[] }>('/api/admin/tien-ich', { params });
  return response.data.data ?? [];
}

export async function adminCreateTienIch(payload: Partial<TienIchItem>) {
  const response = await api.post('/api/admin/tien-ich', payload);
  return response.data;
}

export async function adminUpdateTienIch(id: number, payload: Partial<TienIchItem>) {
  const response = await api.put(`/api/admin/tien-ich/${id}`, payload);
  return response.data;
}

export async function adminDeleteTienIch(id: number) {
  const response = await api.delete(`/api/admin/tien-ich/${id}`);
  return response.data;
}

export async function adminGetNewsletter(params?: { status?: string; source?: string }): Promise<NewsletterItem[]> {
  const response = await api.get<{ status: string; data: NewsletterItem[] }>('/api/admin/newsletter', { params });
  return response.data.data ?? [];
}

export async function adminUpdateNewsletterStatus(id: number, trangThai: 'ACTIVE' | 'UNSUBSCRIBED') {
  const response = await api.patch(`/api/admin/newsletter/${id}/status`, { trangThai });
  return response.data;
}

export async function adminDeleteNewsletter(id: number) {
  const response = await api.delete(`/api/admin/newsletter/${id}`);
  return response.data;
}

// ─── Dashboard & Thống kê ────────────────────────────────────────────────────

/** Admin: Thống kê tổng quan — API trả về { data: { overview, doanhThuTheoThang, ... } } */
export async function adminGetDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<{ status: string; data: DashboardStats }>('/api/admin/thong-ke');
  return response.data.data;
}

export async function adminGetThongKe(): Promise<ThongKeOverview> {
  const data = await adminGetDashboardStats();
  return data.overview;
}

/** Admin: Thống kê tổng quan thanh toán */
export async function adminGetThanhToanThongKe(): Promise<ThanhToanThongKe> {
  const response = await api.get<{ status: string; data: ThanhToanThongKe }>(
    '/api/admin/thanh-toan/thong-ke',
  );
  return response.data.data;
}

/** Admin: Thống kê doanh thu theo tháng */
export async function adminGetDoanhThu(nam?: number): Promise<DoanhThuThang[]> {
  const response = await api.get<{ status: string; data: DoanhThuThang[] }>(
    '/api/admin/thanh-toan/doanh-thu',
    { params: nam ? { nam } : undefined },
  );
  return response.data.data ?? [];
}

// ─── Đơn Đặt ────────────────────────────────────────────────────────────────

/** Admin: Lấy danh sách đơn đặt */
export async function adminGetDonDat(params?: {
  page?: number;
  limit?: number;
  trangThai?: string;
  search?: string;
  maUser?: number;
}): Promise<PaginatedResponse<DonDatItem>> {
  const response = await api.get<{ status: string; data: PaginatedResponse<DonDatItem> }>(
    '/api/admin/don-dat',
    { params },
  );
  return response.data.data;
}

/** Admin: Lấy chi tiết đơn */
export async function adminGetDonDatById(id: number) {
  const response = await api.get(`/api/admin/don-dat/${id}`);
  return response.data.data;
}

/** Admin: Cập nhật trạng thái đơn */
export async function adminUpdateDonDatStatus(id: number, trangThai: string) {
  const response = await api.patch(`/api/admin/don-dat/${id}/trang-thai`, { trangThai });
  return response.data;
}

// ─── Thanh Toán ──────────────────────────────────────────────────────────────

/** Admin: Lấy danh sách thanh toán */
export async function adminGetThanhToan(params?: {
  page?: number;
  limit?: number;
  trangThai?: string;
  phuongThuc?: string;
  search?: string;
}) {
  const response = await api.get('/api/admin/thanh-toan', { params });
  return response.data.data;
}

/** Admin: Hoàn tiền */
export async function adminRefundThanhToan(id: number, loaiHoan: 'REFUNDED' | 'PARTIAL_REFUND') {
  const response = await api.patch(`/api/admin/thanh-toan/${id}/hoan-tien`, { loaiHoan });
  return response.data;
}

// ─── Người Dùng ──────────────────────────────────────────────────────────────

/** Admin: Lấy danh sách người dùng */
export async function adminGetUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  vaiTro?: string;
  status?: string;
}) {
  const response = await api.get('/api/admin/nguoi-dung', { params });
  return response.data.data;
}

/** Admin: Cập nhật trạng thái user */
export async function adminUpdateUserStatus(id: number, trangThai: boolean) {
  const response = await api.patch(`/api/admin/nguoi-dung/${id}/status`, { trangThai });
  return response.data;
}

/** Admin: Cập nhật vai trò user */
export async function adminUpdateUserRole(id: number, vaiTro: 'ADMIN' | 'CUSTOMER') {
  const response = await api.patch(`/api/admin/nguoi-dung/${id}/vai-tro`, { vaiTro });
  return response.data;
}

/** Admin: Xóa user */
export async function adminDeleteUser(id: number) {
  const response = await api.delete(`/api/admin/nguoi-dung/${id}`);
  return response.data;
}

// ─── Đánh Giá ───────────────────────────────────────────────────────────────

/** Admin: Lấy danh sách đánh giá */
export async function adminGetDanhGia(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const response = await api.get('/api/admin/danh-gia', { params });
  return response.data.data;
}

/** Admin: Xóa đánh giá */
export async function adminDeleteDanhGia(id: number) {
  const response = await api.delete(`/api/admin/danh-gia/${id}`);
  return response.data;
}

// ─── Khuyến Mãi ─────────────────────────────────────────────────────────────

/** Admin: Lấy danh sách khuyến mãi */
export async function adminGetKhuyenMai(params?: { page?: number; limit?: number }) {
  const response = await api.get('/api/admin/khuyen-mai', { params });
  return response.data.data;
}

/** Public: Kiểm tra mã khuyến mãi */
export async function validateKhuyenMai(id: number) {
  const response = await api.get(`/api/khuyen-mai/${id}/kiem-tra`);
  return response.data.data;
}

// ─── Tour child resources ─────────────────────────────────────────────────────
export type TourMucLoai = 'BAO_GOM' | 'KHONG_BAO_GOM' | 'LUU_Y' | 'CHINH_SACH';

const dataOf = <T>(response: { data: { data?: T } }) => response.data.data as T;

export async function adminGetTourChild<T>(tourId: number, resource: string): Promise<T[]> {
  const response = await api.get(`/api/admin/tour/${tourId}/${resource}`);
  return dataOf<T[]>(response) ?? [];
}

export async function adminCreateTourChild<T>(tourId: number, resource: string, payload: Partial<T>) {
  const response = await api.post(`/api/admin/tour/${tourId}/${resource}`, payload);
  return response.data;
}

export async function adminUpdateTourChild<T>(tourId: number, resource: string, childId: number, payload: Partial<T>) {
  const response = await api.put(`/api/admin/tour/${tourId}/${resource}/${childId}`, payload);
  return response.data;
}

export async function adminDeleteTourChild(tourId: number, resource: string, childId: number) {
  const response = await api.delete(`/api/admin/tour/${tourId}/${resource}/${childId}`);
  return response.data;
}

// ─── Hotel child resources ────────────────────────────────────────────────────
export async function adminGetKhachSanTienIch(hotelId: number): Promise<TienIchItem[]> {
  const response = await api.get(`/api/admin/khach-san/${hotelId}/tien-ich`);
  return dataOf<TienIchItem[]>(response) ?? [];
}

export async function adminUpdateKhachSanTienIch(hotelId: number, maTienIchList: number[]) {
  const response = await api.put(`/api/admin/khach-san/${hotelId}/tien-ich`, { maTienIchList });
  return response.data;
}

export async function adminGetLoaiPhongTienIch(hotelId: number, phongId: number): Promise<TienIchItem[]> {
  const response = await api.get(`/api/admin/khach-san/${hotelId}/loai-phong/${phongId}/tien-ich`);
  return dataOf<TienIchItem[]>(response) ?? [];
}

export async function adminUpdateLoaiPhongTienIch(hotelId: number, phongId: number, maTienIchList: number[]) {
  const response = await api.put(`/api/admin/khach-san/${hotelId}/loai-phong/${phongId}/tien-ich`, { maTienIchList });
  return response.data;
}

export interface KhachSanFAQItem {
  maFAQ: number;
  maKhachSan: number;
  cauHoi: string;
  cauTraLoi: string;
  thuTu: number;
}

export async function adminGetKhachSanFAQ(hotelId: number): Promise<KhachSanFAQItem[]> {
  const response = await api.get(`/api/admin/khach-san/${hotelId}/faq`);
  return dataOf<KhachSanFAQItem[]>(response) ?? [];
}

export async function adminCreateKhachSanFAQ(hotelId: number, payload: Partial<KhachSanFAQItem>) {
  const response = await api.post(`/api/admin/khach-san/${hotelId}/faq`, payload);
  return response.data;
}

export async function adminUpdateKhachSanFAQ(hotelId: number, faqId: number, payload: Partial<KhachSanFAQItem>) {
  const response = await api.put(`/api/admin/khach-san/${hotelId}/faq/${faqId}`, payload);
  return response.data;
}

export async function adminDeleteKhachSanFAQ(hotelId: number, faqId: number) {
  const response = await api.delete(`/api/admin/khach-san/${hotelId}/faq/${faqId}`);
  return response.data;
}
