import api from './api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LoaiVe {
  maLoaiVe: number;
  tenLoaiVe: string;
}

export interface GiaVe {
  maGiaVe: number;
  maVe: number;
  maLoaiVe: number;
  tenLoaiVe: string;
  gia: number;
  soChoTrong: number;
}

export interface VeMayBayResult {
  maVe: number;
  loaiVeCon: 'MAY_BAY';
  trangThai: string;
  hangHangKhong: string;
  soHieuChuyenBay: string;
  diemKhoiHanh: string;
  diemDen: string;
  thoiGianKhoiHanh: string;
  thoiGianDen: string;
  tenDichVu: string | null;
  tenNhaCungCap: string | null;
  giaThapNhat: number | null;
  tongSoCho: number | null;
}

export interface VeTauHoaResult {
  maVe: number;
  loaiVeCon: 'TAU_HOA';
  trangThai: string;
  hangTau: string;
  soHieuChuyenTau: string;
  diemKhoiHanh: string;
  diemDen: string;
  thoiGianKhoiHanh: string;
  thoiGianDen: string;
  tenDichVu: string | null;
  tenNhaCungCap: string | null;
  giaThapNhat: number | null;
  tongSoCho: number | null;
}

export interface VeDetail {
  maVe: number;
  maDichVu?: number;
  loaiVeCon: 'MAY_BAY' | 'TAU_HOA' | 'VUI_CHOI';
  trangThai: string;
  tenDichVu: string | null;
  moTa: string | null;
  tenNhaCungCap: string | null;
  chiTiet: Record<string, unknown> | null;
  bảngGia: GiaVe[];
}

// ─── Search Params ─────────────────────────────────────────────────────────

export interface VeSearchResponse<T> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize?: number;
}

export interface SearchMayBayParams {
  diemKhoiHanh?: string;
  diemDen?: string;
  ngayKhoiHanh?: string;
  page?: number;
  limit?: number;
  hangHangKhong?: string;
  soDiemDung?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface SearchTauHoaParams {
  diemKhoiHanh?: string;
  diemDen?: string;
  ngayKhoiHanh?: string;
  page?: number;
  limit?: number;
}

// ─── API Functions ──────────────────────────────────────────────────────────

/** Tìm kiếm vé máy bay (public) */
export async function searchMayBay(params?: SearchMayBayParams): Promise<VeSearchResponse<VeMayBayResult>> {
  const response = await api.get<{ status: string; data: VeSearchResponse<VeMayBayResult> | VeMayBayResult[] }>(
    '/api/ve/may-bay/tim-kiem',
    { params },
  );
  const data = response.data.data;
  return Array.isArray(data)
    ? { data, totalRecords: data.length, totalPages: 1, currentPage: 1, pageSize: data.length }
    : data;
}

/** Tìm kiếm vé tàu hỏa (public) */
export async function searchTauHoa(params?: SearchTauHoaParams): Promise<VeSearchResponse<VeTauHoaResult>> {
  const response = await api.get<{ status: string; data: VeSearchResponse<VeTauHoaResult> | VeTauHoaResult[] }>(
    '/api/ve/tau-hoa/tim-kiem',
    { params },
  );
  const data = response.data.data;
  return Array.isArray(data)
    ? { data, totalRecords: data.length, totalPages: 1, currentPage: 1, pageSize: data.length }
    : data;
}

/** Lấy chi tiết 1 vé (public) */
export async function getVeById(id: number | string): Promise<VeDetail> {
  const response = await api.get<{ status: string; data: VeDetail }>(`/api/ve/${id}`);
  return response.data.data;
}

/** Lấy danh sách loại vé (public - để show filter) */
export async function getLoaiVe(): Promise<LoaiVe[]> {
  const response = await api.get<{ status: string; data: LoaiVe[] }>('/api/loai-ve');
  return response.data.data ?? [];
}

/** Lấy bảng giá của vé */
export async function getGiaVe(maVe: number): Promise<GiaVe[]> {
  const response = await api.get<{ status: string; data: GiaVe[] }>(`/api/admin/ve/${maVe}/gia`);
  return response.data.data ?? [];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Tính thời gian bay */
export function tinhThoiGianBay(thoiGianKhoiHanh: string, thoiGianDen: string): string {
  const start = new Date(thoiGianKhoiHanh).getTime();
  const end = new Date(thoiGianDen).getTime();
  const diffMs = end - start;
  if (diffMs <= 0) return '--';
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}g${minutes > 0 ? ` ${minutes}p` : ''}`;
}

/** Format giờ từ datetime string */
export function formatGio(datetime: string): string {
  if (!datetime) return '--:--';
  const d = new Date(datetime);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/** Format ngày từ datetime string */
export function formatNgay(datetime: string): string {
  if (!datetime) return '--';
  const d = new Date(datetime);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Format VND */
export function formatVnd(value: number | null | undefined): string {
  if (value == null) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN').format(value) + ' VND';
}

// ─── Admin child resources ────────────────────────────────────────────────────
export interface VeTienIchItem {
  maTienIch: number;
  tenTienIch: string;
  icon?: string | null;
  loaiTienIch: string;
}

export interface VeTauKhoangItem {
  maKhoang: number;
  maVe: number;
  tenKhoang: string;
  toaSo?: string | null;
  loaiCho: string;
  thuTu: number;
}

export interface VeTauGheItem {
  maGhe: number;
  maKhoang: number;
  soGhe: string;
  trangThai: 'AVAILABLE' | 'BOOKED' | 'LOCKED';
  tang?: number | null;
  giaThem: number;
}

export async function adminGetVeTienIch(maVe: number): Promise<VeTienIchItem[]> {
  const response = await api.get<{ status: string; data: VeTienIchItem[] }>(`/api/admin/ve/${maVe}/tien-ich`);
  return response.data.data ?? [];
}

export async function adminUpdateVeTienIch(maVe: number, maTienIchList: number[]) {
  const response = await api.put(`/api/admin/ve/${maVe}/tien-ich`, { maTienIchList });
  return response.data;
}

export async function adminGetVeTauKhoang(maVe: number): Promise<VeTauKhoangItem[]> {
  const response = await api.get<{ status: string; data: VeTauKhoangItem[] }>(`/api/admin/ve/${maVe}/khoang`);
  return response.data.data ?? [];
}

export async function adminCreateVeTauKhoang(maVe: number, payload: Partial<VeTauKhoangItem>) {
  const response = await api.post(`/api/admin/ve/${maVe}/khoang`, payload);
  return response.data;
}

export async function adminUpdateVeTauKhoang(maVe: number, khoangId: number, payload: Partial<VeTauKhoangItem>) {
  const response = await api.put(`/api/admin/ve/${maVe}/khoang/${khoangId}`, payload);
  return response.data;
}

export async function adminDeleteVeTauKhoang(maVe: number, khoangId: number) {
  const response = await api.delete(`/api/admin/ve/${maVe}/khoang/${khoangId}`);
  return response.data;
}

export async function adminGetVeTauGhe(maVe: number, khoangId: number): Promise<VeTauGheItem[]> {
  const response = await api.get<{ status: string; data: VeTauGheItem[] }>(`/api/admin/ve/${maVe}/khoang/${khoangId}/ghe`);
  return response.data.data ?? [];
}

export async function adminCreateVeTauGhe(maVe: number, khoangId: number, payload: Partial<VeTauGheItem>) {
  const response = await api.post(`/api/admin/ve/${maVe}/khoang/${khoangId}/ghe`, payload);
  return response.data;
}

export async function adminUpdateVeTauGhe(maVe: number, khoangId: number, gheId: number, payload: Partial<VeTauGheItem>) {
  const response = await api.put(`/api/admin/ve/${maVe}/khoang/${khoangId}/ghe/${gheId}`, payload);
  return response.data;
}

export async function adminDeleteVeTauGhe(maVe: number, khoangId: number, gheId: number) {
  const response = await api.delete(`/api/admin/ve/${maVe}/khoang/${khoangId}/ghe/${gheId}`);
  return response.data;
}
