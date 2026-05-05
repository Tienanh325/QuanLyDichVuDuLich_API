import api from './api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChiTietDonPayload {
  maDichVu: number;
  maPhanLoaiDichVu?: number | null; // ID LoaiPhong hoặc ID GiaVe
  soLuong: number;
  giaTaiThoiDiemMua: number;
  ngayBatDauSuDung?: string | null;
  ngayKetThucSuDung?: string | null;
}

export interface CreateDonDatPayload {
  maKhuyenMai?: number | null;
  chiTietList: ChiTietDonPayload[];
}

export interface DonDatResponse {
  maDon: number;
  maUser: number;
  tongGia: number;
  trangThai: string;
  ngayTao: string;
  chiTietDon: ChiTietDonPayload[];
}

export interface DonDatDetail {
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
  chiTietDon: {
    maChiTiet: number;
    maDichVu: number;
    tenDichVu: string;
    loaiDichVu: string;
    maPhanLoaiDichVu: number | null;
    soLuong: number;
    giaTaiThoiDiemMua: number;
    ngayBatDauSuDung: string | null;
    ngayKetThucSuDung: string | null;
  }[];
  lichSuThanhToan: {
    maThanhToan: number;
    soTien: number;
    phuongThuc: string;
    trangThai: string;
    ngayThanhToan: string;
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

// ─── Customer API ────────────────────────────────────────────────────────────

/** Tạo đơn đặt dịch vụ (cần đăng nhập) */
export async function createDonDat(payload: CreateDonDatPayload): Promise<DonDatResponse> {
  const response = await api.post<{ status: string; data: DonDatResponse; message: string }>(
    '/api/don-dat',
    payload,
  );
  return response.data.data;
}

/** Lấy danh sách đơn của bản thân (cần đăng nhập) */
export async function getMyOrders(params?: {
  page?: number;
  limit?: number;
  trangThai?: string;
}): Promise<PaginatedResponse<DonDatDetail>> {
  const response = await api.get<{
    status: string;
    data: PaginatedResponse<DonDatDetail>;
  }>('/api/toi/don-dat', { params });
  return response.data.data;
}

/** Lấy chi tiết 1 đơn của bản thân (cần đăng nhập) */
export async function getMyOrderById(id: number): Promise<DonDatDetail> {
  const response = await api.get<{ status: string; data: DonDatDetail }>(
    `/api/toi/don-dat/${id}`,
  );
  return response.data.data;
}

/** Hủy đơn (chỉ PENDING, cần đăng nhập) */
export async function cancelOrder(id: number): Promise<void> {
  await api.patch(`/api/toi/don-dat/${id}/huy`);
}

// ─── Thanh Toán ──────────────────────────────────────────────────────────────

export interface CreateThanhToanPayload {
  maDon: number;
  phuongThuc: 'VNPAY' | 'MOMO' | 'COD' | 'BANK_TRANSFER' | 'WALLET';
  soTien: number;
  maGiaoDichNgoai?: string;
  noiDung?: string;
}

export interface ThanhToanResponse {
  maDon: number;
  tongGia: number;
  tongDaThanhToan: number;
  trangThai: string;
}

/** Tạo thanh toán (cần đăng nhập) */
export async function createThanhToan(payload: CreateThanhToanPayload): Promise<ThanhToanResponse> {
  const response = await api.post<{ status: string; data: ThanhToanResponse; message: string }>(
    '/api/thanh-toan',
    payload,
  );
  return response.data.data;
}

/** Lấy lịch sử thanh toán của đơn (cần đăng nhập) */
export async function getThanhToanByDon(donId: number) {
  const response = await api.get(`/api/toi/don-dat/${donId}/thanh-toan`);
  return response.data.data;
}
