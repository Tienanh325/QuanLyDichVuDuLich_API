export function formatVnd(value?: number | string | null) {
  const amount = Number(value ?? 0);
  const safeAmount = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `${safeAmount.toLocaleString("vi-VN")} VNĐ`;
}
