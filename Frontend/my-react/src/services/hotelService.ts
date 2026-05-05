import api from './api';


// ─── Types ──────────────────────────────────────────────────────────────────

export interface LoaiPhong {
  maLoaiPhong: number;
  maKhachSan: number;
  tenLoaiPhong: string;
  giaPhong: number;
  sucChua: string;           // VARCHAR(100) trong DB, vd: "2 người lớn"
  soLuongPhongTrong: number;
}

export interface HinhAnh {
  maHinhAnh: number;
  maDichVu: number;
  urlAnh: string;
  isAvatar: boolean;
}

export interface DanhGiaStats {
  diemTrungBinh: number | null;
  soLuongDanhGia: number;
}

export interface KhachSanDetail {
  maKhachSan: number;
  maDichVu: number;
  viTri: string;
  ten: string;
  moTa: string;
  trangThai: number;
  tenNhaCungCap: string;
  loaiPhong: LoaiPhong[];
  hinhAnh: HinhAnh[];
  danhGia: DanhGiaStats;
}

export interface KhachSanListItem {
  maKhachSan: number;
  maDichVu: number;
  viTri: string;
  ten: string;
  moTa: string;
  tenNhaCungCap: string;
  avatar: string | null;
  giaTuKhoang: number | null;
}

export interface KhachSanListResponse {
  data: KhachSanListItem[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateDonDatPayload {
  maKhuyenMai?: number | null;
  chiTietList: {
    maDichVu: number;
    maPhanLoaiDichVu?: number | null;
    soLuong: number;
    giaTaiThoiDiemMua: number;
    ngayBatDauSuDung?: string | null;
    ngayKetThucSuDung?: string | null;
  }[];
}

export interface DonDatResponse {
  maDon: number;
  maUser: number;
  tongGia: number;
  trangThai: string;
  chiTietDon: unknown[];
}

export interface CreateThanhToanPayload {
  maDon: number;
  phuongThuc: 'VNPAY' | 'MOMO' | 'COD' | 'BANK_TRANSFER' | 'WALLET'; // Giá trị backend chấp nhận
  soTien: number;
  ghiChu?: string;
  maGiaoDichNgoai?: string;
}

// ─── Public APIs (Không cần token) ─────────────────────────────────────────

/** Lấy danh sách khách sạn công khai (customer browse) */
export async function getPublicHotels(params?: {
  page?: number;
  limit?: number;
  search?: string;
  viTri?: string;
}): Promise<KhachSanListResponse> {
  const response = await api.get<{ status: string; data: KhachSanListResponse }>(
    '/api/khach-san',
    { params },
  );
  return response.data.data;
}

/** Lấy chi tiết 1 khách sạn theo id (public) */
export async function getPublicHotelById(id: number | string): Promise<KhachSanDetail> {
  const response = await api.get<{ status: string; data: KhachSanDetail }>(
    `/api/khach-san/${id}`,
  );
  return response.data.data;
}

// ─── Authenticated Customer APIs ────────────────────────────────────────────

/** Tạo đơn đặt phòng khách sạn (cần đăng nhập) */
export async function createDonDat(payload: CreateDonDatPayload): Promise<DonDatResponse> {
  const response = await api.post<{ status: string; data: DonDatResponse }>(
    '/api/don-dat',
    payload,
  );
  return response.data.data;
}

/** Tạo thanh toán (cần đăng nhập) */
export async function createThanhToan(payload: CreateThanhToanPayload): Promise<unknown> {
  const response = await api.post('/api/thanh-toan', payload);
  return response.data;
}

// ─── Admin APIs ──────────────────────────────────────────────────────────────

/** Admin: Lấy danh sách khách sạn */
export async function adminGetHotels(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<KhachSanListResponse> {
  const response = await api.get<{ status: string; data: KhachSanListResponse }>(
    '/api/admin/khach-san',
    { params },
  );
  return response.data.data;
}

/** Admin: Lấy chi tiết 1 khách sạn */
export async function adminGetHotelById(id: number): Promise<KhachSanDetail> {
  const response = await api.get<{ status: string; data: KhachSanDetail }>(
    `/api/admin/khach-san/${id}`,
  );
  return response.data.data;
}

/** Admin: Tạo khách sạn mới */
export async function adminCreateHotel(data: { maDichVu: number; viTri: string }): Promise<unknown> {
  const response = await api.post('/api/admin/khach-san', data);
  return response.data;
}

/** Admin: Cập nhật khách sạn */
export async function adminUpdateHotel(id: number, data: { viTri: string }): Promise<unknown> {
  const response = await api.put(`/api/admin/khach-san/${id}`, data);
  return response.data;
}

/** Admin: Xóa khách sạn */
export async function adminDeleteHotel(id: number): Promise<void> {
  await api.delete(`/api/admin/khach-san/${id}`);
}

/** Admin: Lấy danh sách loại phòng của khách sạn */
export async function adminGetLoaiPhong(khachSanId: number): Promise<LoaiPhong[]> {
  const response = await api.get<{ status: string; data: LoaiPhong[] }>(
    `/api/admin/khach-san/${khachSanId}/loai-phong`,
  );
  return response.data.data;
}

/** Admin: Thêm loại phòng */
export async function adminCreateLoaiPhong(
  khachSanId: number,
  data: { tenLoaiPhong: string; giaPhong: number; sucChua: string; soLuongPhongTrong: number },
): Promise<LoaiPhong> {
  const response = await api.post<{ status: string; data: LoaiPhong }>(
    `/api/admin/khach-san/${khachSanId}/loai-phong`,
    data,
  );
  return response.data.data;
}

/** Admin: Cập nhật loại phòng */
export async function adminUpdateLoaiPhong(
  khachSanId: number,
  phongId: number,
  data: { tenLoaiPhong: string; giaPhong: number; sucChua: string; soLuongPhongTrong: number },
): Promise<void> {
  await api.put(`/api/admin/khach-san/${khachSanId}/loai-phong/${phongId}`, data);
}

/** Admin: Xóa loại phòng */
export async function adminDeleteLoaiPhong(khachSanId: number, phongId: number): Promise<void> {
  await api.delete(`/api/admin/khach-san/${khachSanId}/loai-phong/${phongId}`);
}

/** Admin: Lấy danh sách dịch vụ */
export async function adminGetDichVu(): Promise<{ maDichVu: number; ten: string }[]> {
  const response = await api.get<{ status: string; data: { data?: unknown[]; items?: unknown[] } | unknown[] }>(
    '/api/admin/dich-vu',
  );
  const raw = response.data.data;
  const arr = Array.isArray(raw) ? raw : (raw as { data?: unknown[] }).data ?? [];
  return (arr as { maDichVu: number; ten: string }[]);
}
