import api from './api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TourListItem {
  maTour: number;
  maDichVu: number;
  viTri: string;
  thoiGian: string;
  giaTour: number;
  ngayBatDau: string;
  soLuongKhach: number;
  ten: string;
  moTa: string;
  tenNhaCungCap: string;
  avatar: string | null;
}

export interface TourDetail extends TourListItem {
  hinhAnh: { maHinhAnh: number; urlAnh: string; isAvatar: boolean }[];
  danhGia: { diemTrungBinh: number | null; soLuongDanhGia: number };
}

export interface TourListResponse {
  data: TourListItem[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

// ─── API Functions ──────────────────────────────────────────────────────────

/** Lấy danh sách tour công khai */
export async function getPublicTours(params?: {
  page?: number;
  limit?: number;
  search?: string;
  viTri?: string;
}): Promise<TourListResponse> {
  const response = await api.get<{ status: string; data: TourListResponse }>(
    '/api/tour',
    { params },
  );
  return response.data.data;
}

/** Lấy chi tiết tour theo id */
export async function getTourById(id: number | string): Promise<TourDetail> {
  const response = await api.get<{ status: string; data: TourDetail }>(`/api/tour/${id}`);
  return response.data.data;
}
