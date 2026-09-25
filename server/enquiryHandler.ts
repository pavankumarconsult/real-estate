export const MAX_REQUEST_BYTES = 16 * 1024;

const PROJECT_NAMES: Record<string, string> = {
  'team4-aria': 'Team4 Aria',
};

const ENQUIRY_INTENTS = new Set([
  'General enquiry about booking a flat',
  'Request a call for a site visit',
  'Ready to buy in 2–3 weeks',
]);

export interface LeadRecord {
  name: string;
  mobile: string;
  email: string | null;
  projectId: string;
  projectName: string;
  intent: string;
  context: string | null;
  consent: true;
  status: 'new';
  source: {
    channel: 'website';
    pagePath: string;
    referrerHost: string | null;
  };
}

export interface EnquiryStore {
  save(lead: LeadRecord, idempotencyKey: string): Promise<string>;
}

export interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(value: { success: boolean; referenceId?: string }): void;
}

function firstHeader(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function normalizeText(value: unknown, maximumLength: number): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized || normalized.length > maximumLength) return null;
  return normalized;
}

function normalizeOptionalText(value: unknown, maximumLength: number): string | null | undefined {
  if (value === undefined || value === null || value === '') return null;
  return normalizeText(value, maximumLength) ?? undefined;
}

function normalizeMobile(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 24) return null;
  let digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

function normalizeEmail(value: unknown): string | null | undefined {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') return undefined;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return undefined;
  return email;
}

function normalizePagePath(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const pagePath = value.trim();
  return pagePath.startsWith('/') && pagePath.length <= 120 ? pagePath : null;
}

function normalizeReferrerHost(value: unknown): string | null | undefined {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') return undefined;
  const host = value.trim().toLowerCase();
  if (host.length > 253 || !/^(?=.{1,253}$)[a-z0-9.-]+$/.test(host)) return undefined;
  return host;
}

export function validateEnquiryBody(body: unknown): LeadRecord | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const input = body as Record<string, unknown>;

  if (typeof input.website === 'string' && input.website.trim()) return null;
  if (input.website !== undefined && typeof input.website !== 'string') return null;

  const name = normalizeText(input.name, 80);
  const mobile = normalizeMobile(input.mobile);
  const email = normalizeEmail(input.email);
  const projectId = normalizeText(input.projectId, 64);
  const intent = normalizeText(input.intent, 64);
  const context = normalizeOptionalText(input.context, 160);
  const projectName = projectId ? PROJECT_NAMES[projectId] : undefined;

  if (
    !name || name.length < 2 || !mobile || email === undefined || !projectId || !projectName ||
    input.projectName !== projectName || !intent || !ENQUIRY_INTENTS.has(intent) ||
    context === undefined || input.consent !== true
  ) return null;

  if (!input.source || typeof input.source !== 'object' || Array.isArray(input.source)) return null;
  const source = input.source as Record<string, unknown>;
  const pagePath = normalizePagePath(source.pagePath);
  const referrerHost = normalizeReferrerHost(source.referrerHost);
  if (!pagePath || referrerHost === undefined) return null;

  return {
    name,
    mobile,
    email,
    projectId,
    projectName,
    intent,
    context,
    consent: true,
    status: 'new',
    source: {
      channel: 'website',
      pagePath,
      referrerHost,
    },
  };
}

export function createEnquiryHandler(store: EnquiryStore) {
  return async (request: ApiRequest, response: ApiResponse) => {
    response.setHeader('Cache-Control', 'no-store');

    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      response.status(405).json({ success: false });
      return;
    }

    const contentType = firstHeader(request.headers['content-type']);
    const contentLength = Number(firstHeader(request.headers['content-length']));
    if (!contentType.toLowerCase().startsWith('application/json')) {
      response.status(415).json({ success: false });
      return;
    }
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      response.status(413).json({ success: false });
      return;
    }

    let requestSize = MAX_REQUEST_BYTES + 1;
    try {
      requestSize = Buffer.byteLength(JSON.stringify(request.body), 'utf8');
    } catch {
      // Leave the size over the limit so malformed bodies are rejected.
    }
    if (requestSize > MAX_REQUEST_BYTES) {
      response.status(413).json({ success: false });
      return;
    }

    const idempotencyKey = firstHeader(request.headers['x-idempotency-key']);
    if (!/^[A-Za-z0-9_-]{20,128}$/.test(idempotencyKey)) {
      response.status(400).json({ success: false });
      return;
    }

    const lead = validateEnquiryBody(request.body);
    if (!lead) {
      response.status(400).json({ success: false });
      return;
    }

    try {
      const referenceId = await store.save(lead, idempotencyKey);
      response.status(201).json({ success: true, referenceId });
    } catch {
      response.status(503).json({ success: false });
    }
  };
}
