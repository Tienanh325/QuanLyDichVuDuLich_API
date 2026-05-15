import api from './api';

export type CustomerProfile = {
  maUser: number;
  username: string;
  ten: string;
  email: string | null;
  sdt: string | null;
  gioiTinh: 'Nam' | 'Nữ' | 'Khác' | null;
  ngaySinh: string | null;
  thanhPho: string | null;
  vaiTro: string;
  trangThai: number | boolean;
};

export type UpdateCustomerProfilePayload = {
  ten: string;
  email: string | null;
  sdt: string | null;
  gioiTinh: 'Nam' | 'Nữ' | 'Khác' | null;
  ngaySinh: string | null;
  thanhPho: string | null;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export async function getMyProfile(): Promise<CustomerProfile> {
  const response = await api.get<{ status: string; data: CustomerProfile }>('/api/toi/profile');
  return response.data.data;
}

export async function updateMyProfile(payload: UpdateCustomerProfilePayload): Promise<UpdateCustomerProfilePayload> {
  const response = await api.put<{ status: string; data: UpdateCustomerProfilePayload }>('/api/toi/profile', payload);
  return response.data.data;
}

export async function changeMyPassword(payload: ChangePasswordPayload) {
  const response = await api.patch('/api/toi/doi-mat-khau', payload);
  return response.data;
}
