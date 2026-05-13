import api from "./api";
import type { ImageItem, ImageQueryParams, ImageUrlPayload, ImageUploadPayload, ImageUpdatePayload } from "../types/image";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (typeof payload === "object" && payload !== null) {
    const outer = payload as Record<string, unknown>;
    const inner = outer.data;
    if (Array.isArray(inner)) return inner;
    if (typeof inner === "object" && inner !== null) {
      const nested = (inner as Record<string, unknown>).data;
      if (Array.isArray(nested)) return nested;
      const items = (inner as Record<string, unknown>).items;
      if (Array.isArray(items)) return items;
    }
  }
  return [];
}

function normalizeUrl(value: string): string {
  if (value.startsWith("/")) return `${BASE_URL}${value}`;
  return value;
}

function normalizeImage(input: unknown, index: number): ImageItem {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const urlAnh = String(raw.urlAnh ?? raw.imageUrl ?? raw.url ?? "");
  return {
    maHinhAnh: Number(raw.maHinhAnh ?? raw.id ?? index + 1),
    urlAnh: normalizeUrl(urlAnh),
    altText: raw.altText == null ? null : String(raw.altText),
    isAvatar: raw.isAvatar === 1 || raw.isAvatar === true || raw.isAvatar === "1" ? 1 : 0,
    thuTu: Number(raw.thuTu ?? raw.order ?? 0),
  };
}

const IMAGE_BASE = "/api/admin/hinh-anh";

export async function getImages(params?: ImageQueryParams): Promise<ImageItem[]> {
  const response = await api.get(IMAGE_BASE, { params });
  return extractArray(response.data).map(normalizeImage);
}

export async function createFromUrl(payload: ImageUrlPayload): Promise<ImageItem> {
  const response = await api.post(IMAGE_BASE, payload);
  return normalizeImage(response.data?.data ?? response.data, 0);
}

export async function uploadFile(payload: ImageUploadPayload): Promise<ImageItem> {
  const form = new FormData();
  form.append("file", payload.file);
  if (payload.altText !== undefined) form.append("altText", payload.altText ?? "");
  if (payload.isAvatar !== undefined) form.append("isAvatar", String(payload.isAvatar));
  if (payload.thuTu !== undefined) form.append("thuTu", String(payload.thuTu));
  const response = await api.post(`${IMAGE_BASE}/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalizeImage(response.data?.data ?? response.data, 0);
}

export async function updateImage(id: number, payload: ImageUpdatePayload): Promise<ImageItem> {
  const response = await api.put(`${IMAGE_BASE}/${id}`, payload);
  return normalizeImage(response.data?.data ?? response.data, 0);
}

export async function deleteImage(id: number): Promise<void> {
  await api.delete(`${IMAGE_BASE}/${id}`);
}

export async function deleteImages(ids: number[]): Promise<void> {
  await api.delete(`${IMAGE_BASE}/bulk`, { data: { ids } });
}
