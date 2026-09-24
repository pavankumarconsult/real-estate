import { EnquiryPayload, EnquirySubmissionResult } from '../types/enquiry';

const ENQUIRY_ENDPOINT = '/api/enquiries';

function isSubmissionResult(value: unknown): value is EnquirySubmissionResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Record<string, unknown>;
  return result.success === true && typeof result.referenceId === 'string' && result.referenceId.length > 0;
}

export function getEnquirySource(): EnquiryPayload['source'] {
  let referrerHost: string | undefined;

  if (document.referrer) {
    try {
      referrerHost = new URL(document.referrer).hostname || undefined;
    } catch {
      // An invalid referrer is simply omitted from the non-sensitive source metadata.
    }
  }

  return {
    pagePath: window.location.pathname,
    ...(referrerHost ? { referrerHost } : {}),
  };
}

export async function submitEnquiry(
  payload: EnquiryPayload,
  idempotencyKey: string,
): Promise<EnquirySubmissionResult> {
  const response = await fetch(ENQUIRY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch {
    throw new Error('The enquiry service returned an invalid response.');
  }

  if (!response.ok || !isSubmissionResult(responseBody)) {
    throw new Error('The enquiry could not be saved.');
  }

  return responseBody;
}
