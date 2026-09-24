import { getIdToken, User } from 'firebase/auth';
import {
  AdminLeadFilters,
  AdminLeadQuery,
  AdminLeadQueryResult,
  AdminSessionResult,
} from '../../shared/adminTypes';

export type AdminApiErrorCode =
  | 'session-expired'
  | 'unauthorized'
  | 'configuration-error'
  | 'request-failed';

export class AdminApiError extends Error {
  constructor(readonly code: AdminApiErrorCode) {
    super(code);
  }
}

async function authorizationHeader(user: User): Promise<string> {
  return `Bearer ${await getIdToken(user)}`;
}

function errorForStatus(status: number, body: unknown): AdminApiError {
  const errorCode = body && typeof body === 'object' && 'error' in body
    ? (body as { error?: unknown }).error
    : null;
  if (status === 401 || errorCode === 'session-expired') return new AdminApiError('session-expired');
  if (status === 403 || errorCode === 'unauthorized') return new AdminApiError('unauthorized');
  if (errorCode === 'configuration-error') return new AdminApiError('configuration-error');
  return new AdminApiError('request-failed');
}

async function jsonResponse<T>(response: Response): Promise<T> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    if (!response.ok) throw errorForStatus(response.status, null);
    throw new AdminApiError('request-failed');
  }
  if (!response.ok) throw errorForStatus(response.status, body);
  return body as T;
}

export async function verifyAdminSession(user: User): Promise<AdminSessionResult> {
  const response = await fetch('/api/admin/session', {
    headers: { Authorization: await authorizationHeader(user) },
    cache: 'no-store',
  });
  const result = await jsonResponse<AdminSessionResult>(response);
  if (result.authorized !== true) throw new AdminApiError('request-failed');
  return result;
}

export async function queryLeads(user: User, query: AdminLeadQuery): Promise<AdminLeadQueryResult> {
  const response = await fetch('/api/admin/leads', {
    method: 'POST',
    headers: {
      Authorization: await authorizationHeader(user),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
    cache: 'no-store',
  });
  return jsonResponse<AdminLeadQueryResult>(response);
}

export async function deleteLead(user: User, id: string): Promise<void> {
  const response = await fetch('/api/admin/leads', {
    method: 'DELETE',
    headers: {
      Authorization: await authorizationHeader(user),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
    cache: 'no-store',
  });
  await jsonResponse<{ success: true }>(response);
}

export async function exportLeadsCsv(
  user: User,
  filters: AdminLeadFilters,
  selectedIds: string[],
): Promise<Blob> {
  const response = await fetch('/api/admin/export', {
    method: 'POST',
    headers: {
      Authorization: await authorizationHeader(user),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filters, selectedIds }),
    cache: 'no-store',
  });
  if (!response.ok) {
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      // A non-JSON server failure is reported without exposing its response body.
    }
    throw errorForStatus(response.status, body);
  }
  return response.blob();
}
