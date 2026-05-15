import api from './api';

export interface ReviewCriterion {
  maTieuChi: number;
  tenTieuChi: string;
  moTa?: string | null;
  thuTu?: number;
  diem?: number;
  diemTrungBinh?: number | string | null;
}

export interface ReviewItem {
  maDanhGia: number;
  maUser: number;
  maDichVu: number;
  maDon?: number | null;
  soSao: number;
  tieuDe?: string | null;
  binhLuan?: string | null;
  ngayDanhGia: string;
  ngayCapNhat: string;
  tenUser?: string | null;
  username?: string | null;
  tenDichVu?: string | null;
  daXacMinh?: boolean | number;
  tieuChi?: ReviewCriterion[];
  hinhAnh?: string[];
}

export interface ReviewSummary {
  diemTrungBinh: number | string | null;
  tongDanhGia: number;
  phanPhoi: { soSao: number; soLuong: number }[];
  tieuChi: ReviewCriterion[];
}

export interface ReviewListResponse {
  data: ReviewItem[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  thongKeSao: ReviewSummary | null;
}

export interface ReviewPayload {
  maDichVu: number;
  soSao: number;
  tieuDe?: string;
  binhLuan?: string;
  tieuChi?: { maTieuChi: number; diem: number }[];
  hinhAnh?: string[];
}

export async function getReviews(params: {
  maDichVu: number;
  page?: number;
  limit?: number;
  soSao?: number;
  sort?: 'newest' | 'highest' | 'lowest' | 'images';
  hasImages?: boolean;
  verified?: boolean;
}): Promise<ReviewListResponse> {
  const response = await api.get<{ status: string; data: ReviewListResponse }>('/api/danh-gia', { params });
  return response.data.data;
}

export async function getReviewSummary(maDichVu: number): Promise<ReviewSummary> {
  const response = await api.get<{ status: string; data: ReviewSummary }>(`/api/danh-gia/${maDichVu}/tom-tat`);
  return response.data.data;
}

export async function getReviewCriteria(maDichVu: number): Promise<ReviewCriterion[]> {
  const response = await api.get<{ status: string; data: ReviewCriterion[] }>(`/api/danh-gia/${maDichVu}/tieu-chi`);
  return response.data.data;
}

export async function getMyReview(maDichVu: number): Promise<ReviewItem | null> {
  const response = await api.get<{ status: string; data: ReviewItem | null }>(`/api/toi/danh-gia/${maDichVu}`);
  return response.data.data;
}

export async function createReview(payload: ReviewPayload): Promise<ReviewItem> {
  const response = await api.post<{ status: string; data: ReviewItem; message?: string }>('/api/danh-gia', payload);
  return response.data.data;
}

export async function updateReview(maDanhGia: number, payload: ReviewPayload): Promise<void> {
  await api.put(`/api/danh-gia/${maDanhGia}`, payload);
}
