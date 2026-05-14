export type PageItem = number | "ellipsis";

export type PaginationState = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  from: number;
  to: number;
};

export function clampPage(value: string | number | null | undefined, fallback = 1) {
  const parsed = Number.parseInt(String(value ?? fallback), 10);
  return Math.max(1, Number.isFinite(parsed) ? parsed : fallback);
}

export function clampPageSize(value: string | number | null | undefined, fallback = 20, max = 100) {
  const parsed = Number.parseInt(String(value ?? fallback), 10);
  return Math.max(1, Math.min(max, Number.isFinite(parsed) ? parsed : fallback));
}

export function getPaginationState(currentPage: number, pageSize: number, totalItems: number): PaginationState {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const from = totalItems === 0 ? 0 : (safeCurrentPage - 1) * safePageSize + 1;
  const to = Math.min(safeCurrentPage * safePageSize, totalItems);

  return {
    currentPage: safeCurrentPage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
    hasPrev: safeCurrentPage > 1,
    hasNext: safeCurrentPage < totalPages,
    from,
    to,
  };
}

export function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = new Set<number>([1, totalPages]);
  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page > 1 && page < totalPages) pages.add(page);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: PageItem[] = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push("ellipsis");
    result.push(page);
  });

  return result;
}
