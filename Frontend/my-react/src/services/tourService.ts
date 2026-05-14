import api from './api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TourListItem {
  maTour: number;
  maDichVu: number;
  maDanhMuc: number | null;
  tenTour: string | null;
  diaDiem: string | null;
  viTri: string | null;
  viTriKhoiHanh: string | null;
  moTaHoatDong: string | null;
  thoiGian: string | null;
  giaTour: number;
  giaGoc: number | null;
  giaKhuyenMai: number | null;
  ngayBatDau: string | null;
  soLuongKhach: number;
  diemDanhGia: number;
  soLuotDanhGia: number;
  highlight: string | null;
  isBestSeller: number;
  chinhSachHuy: string | null;
  xacNhanTucThi: number;
  ten: string;
  moTa: string;
  loaiDichVu: string;
  tenNhaCungCap: string | null;
  avatar: string | null;
}

export interface TourDetail extends TourListItem {
  hinhAnh?: { maHinhAnh: number; urlAnh: string; altText?: string | null; isAvatar: number; thuTu: number }[];
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
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maDanhMuc?: number;
  isBestSeller?: 1;
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
