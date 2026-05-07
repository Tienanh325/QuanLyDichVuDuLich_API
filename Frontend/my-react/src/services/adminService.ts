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

export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
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
