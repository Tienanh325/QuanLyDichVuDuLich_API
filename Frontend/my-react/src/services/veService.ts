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
  loaiVeCon: 'MAY_BAY' | 'TAU_HOA' | 'VUI_CHOI';
  trangThai: string;
  tenDichVu: string | null;
  moTa: string | null;
  tenNhaCungCap: string | null;
  chiTiet: Record<string, unknown> | null;
  bảngGia: GiaVe[];
}

// ─── Search Params ─────────────────────────────────────────────────────────

export interface SearchMayBayParams {
  diemKhoiHanh?: string;
  diemDen?: string;
  ngayKhoiHanh?: string;
  limit?: number;
}

export interface SearchTauHoaParams {
  diemKhoiHanh?: string;
  diemDen?: string;
  ngayKhoiHanh?: string;
  limit?: number;
}

// ─── API Functions ──────────────────────────────────────────────────────────

/** Tìm kiếm vé máy bay (public) */
export async function searchMayBay(params?: SearchMayBayParams): Promise<VeMayBayResult[]> {
  const response = await api.get<{ status: string; data: VeMayBayResult[] }>(
    '/api/ve/may-bay/tim-kiem',
    { params },
  );
  return response.data.data ?? [];
}

/** Tìm kiếm vé tàu hỏa (public) */
export async function searchTauHoa(params?: SearchTauHoaParams): Promise<VeTauHoaResult[]> {
  const response = await api.get<{ status: string; data: VeTauHoaResult[] }>(
    '/api/ve/tau-hoa/tim-kiem',
    { params },
  );
  return response.data.data ?? [];
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
