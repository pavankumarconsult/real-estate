import { Auth, DecodedIdToken } from 'firebase-admin/auth';

export interface AdminRequestLike {
  headers: Record<string, string | string[] | undefined>;
}

export class AdminAuthorizationError extends Error {
  constructor(
    readonly status: 401 | 403 | 503,
    readonly code: 'session-expired' | 'unauthorized' | 'configuration-error',
  ) {
    super(code);
  }
}

function firstHeader(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function getAllowedAdminUids(): Set<string> {
  const rawValue = process.env.ADMIN_ALLOWED_UIDS?.trim();
  if (!rawValue) {
    throw new AdminAuthorizationError(503, 'configuration-error');
  }

  const uids = rawValue
    .split(',')
    .map((uid) => uid.trim())
    .filter((uid) => /^[A-Za-z0-9:_-]{1,128}$/.test(uid));

  if (!uids.length) {
    throw new AdminAuthorizationError(503, 'configuration-error');
  }

  return new Set(uids);
}

export async function authorizeAdminRequest(
  request: AdminRequestLike,
  auth: Auth,
): Promise<DecodedIdToken> {
  const authorization = firstHeader(request.headers.authorization);
  const match = authorization.match(/^Bearer ([A-Za-z0-9._-]+)$/);
  if (!match) {
    throw new AdminAuthorizationError(401, 'session-expired');
  }

  let decodedToken: DecodedIdToken;
  try {
    decodedToken = await auth.verifyIdToken(match[1], true);
  } catch {
    throw new AdminAuthorizationError(401, 'session-expired');
  }

  if (!getAllowedAdminUids().has(decodedToken.uid)) {
    throw new AdminAuthorizationError(403, 'unauthorized');
  }

  return decodedToken;
}

export function adminErrorResponse(error: unknown): {
  status: 401 | 403 | 503;
  body: { success: false; error: string };
} {
  if (error instanceof AdminAuthorizationError) {
    return {
      status: error.status,
      body: { success: false, error: error.code },
    };
  }

  return {
    status: 503,
    body: { success: false, error: 'service-unavailable' },
  };
}
