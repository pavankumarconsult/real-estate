import { SITE_CONFIG } from '../config/site';
import { EnquiryPayload, EnquirySubmissionResult } from '../types/enquiry';

/**
 * Single delivery seam for every enquiry form submission.
 * With no approved endpoint, the form remains a local-only demo.
 */
export async function submitEnquiry(payload: EnquiryPayload): Promise<EnquirySubmissionResult> {
  if (!SITE_CONFIG.enquiryDeliveryUrl) {
    return { status: 'demo' };
  }

  const response = await fetch(SITE_CONFIG.enquiryDeliveryUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Enquiry delivery failed with status ${response.status}`);
  }

  return { status: 'delivered' };
}
