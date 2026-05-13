export type ImageSortField = "altText" | "thuTu" | "maHinhAnh";
export type SortOrder = "asc" | "desc";
export type ViewMode = "grid" | "list";
export type ImageModalMode = "url" | "upload" | "edit";

export interface ImageItem {
  maHinhAnh: number;
  urlAnh: string;
  altText: string | null;
  isAvatar: 0 | 1;
  thuTu: number;
}

export interface ImageQueryParams {
  isAvatar?: 0 | 1;
  search?: string;
  sortBy?: ImageSortField;
  sortOrder?: SortOrder;
}

export interface ImageUrlPayload {
  urlAnh: string;
  altText?: string | null;
  isAvatar?: 0 | 1;
  thuTu?: number;
}

export interface ImageUploadPayload {
  file: File;
  altText?: string | null;
  isAvatar?: 0 | 1;
  thuTu?: number;
}

export interface ImageUpdatePayload {
  urlAnh: string;
  altText?: string | null;
  isAvatar?: 0 | 1;
  thuTu?: number;
}

export interface ImageFormValues {
  urlAnh?: string;
  file?: File;
  altText?: string;
  isAvatar?: boolean;
  thuTu?: number;
}

export interface ImageApiListResponse {
  data: unknown[];
  items?: unknown[];
  status?: string;
  message?: string;
}

export interface ImageApiItemResponse {
  data: unknown;
  status?: string;
  message?: string;
}
