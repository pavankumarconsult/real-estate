import {
  AdminDateRange,
  AdminLeadFilters,
  AdminLeadQuery,
  AdminSortOrder,
} from '../shared/adminTypes.js';

export const MAX_ADMIN_REQUEST_BYTES = 32 * 1024;

export interface AdminApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface AdminApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): AdminApiResponse;
  json(value: unknown): void;
  send(value: string): void;
}

const DATE_RANGES = new Set<AdminDateRange>(['all', 'today', '7d', '30d']);
const SORT_ORDERS = new Set<AdminSortOrder>(['newest', 'oldest']);

function firstHeader(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export function prepareAdminResponse(response: AdminApiResponse) {
  response.setHeader('Cache-Control', 'private, no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
}

export function hasValidJsonBody(request: AdminApiRequest): boolean {
  const contentType = firstHeader(request.headers['content-type']).toLowerCase();
  if (!contentType.startsWith('application/json')) return false;

  const contentLength = Number(firstHeader(request.headers['content-length']));
  if (Number.isFinite(contentLength) && contentLength > MAX_ADMIN_REQUEST_BYTES) return false;

  try {
    return Buffer.byteLength(JSON.stringify(request.body), 'utf8') <= MAX_ADMIN_REQUEST_BYTES;
  } catch {
    return false;
  }
}

function parseFilters(value: unknown): AdminLeadFilters | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (typeof input.search !== 'string' || input.search.length > 100) return null;
  if (!DATE_RANGES.has(input.dateRange as AdminDateRange)) return null;
  if (!SORT_ORDERS.has(input.sort as AdminSortOrder)) return null;

  return {
    search: input.search.trim(),
    dateRange: input.dateRange as AdminDateRange,
    sort: input.sort as AdminSortOrder,
  };
}

export function parseLeadQuery(value: unknown): AdminLeadQuery | null {
  const filters = parseFilters(value);
  if (!filters || !value || typeof value !== 'object') return null;
  const input = value as Record<string, unknown>;
  if (!Number.isInteger(input.page) || (input.page as number) < 1) return null;
  if (!Number.isInteger(input.pageSize) || (input.pageSize as number) < 1 || (input.pageSize as number) > 50) return null;

  return {
    ...filters,
    page: input.page as number,
    pageSize: input.pageSize as number,
  };
}

export function parseExportRequest(value: unknown): {
  filters: AdminLeadFilters;
  selectedIds: string[];
} | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const filters = parseFilters(input.filters);
  if (!filters || !Array.isArray(input.selectedIds) || input.selectedIds.length > 500) return null;
  const selectedIds = input.selectedIds.filter(
    (id): id is string => typeof id === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(id),
  );
  if (selectedIds.length !== input.selectedIds.length || new Set(selectedIds).size !== selectedIds.length) return null;
  return { filters, selectedIds };
}

export function parseDeleteRequest(value: unknown): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const id = (value as Record<string, unknown>).id;
  return typeof id === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(id) ? id : null;
}
