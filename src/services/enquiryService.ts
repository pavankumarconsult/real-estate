import { SITE_CONFIG } from '../config/site';
import { EnquiryPayload, EnquirySubmissionResult } from '../types/enquiry';

/** Prepare a WhatsApp draft. The visitor must still press Send in WhatsApp. */
export function prepareWhatsAppEnquiry(payload: EnquiryPayload): EnquirySubmissionResult {
  const messageLines = [
    SITE_CONFIG.whatsappMessageTemplate.replace('{projectName}', payload.projectName),
    '',
    `Name: ${payload.name}`,
    `Mobile: +91 ${payload.mobile}`,
    payload.email ? `Email: ${payload.email}` : null,
    `Project: ${payload.projectName}`,
    `Enquiry type: ${payload.intent}`,
    payload.context ? `Context: ${payload.context}` : null,
  ].filter((line): line is string => Boolean(line));

  return {
    status: 'whatsapp-opened',
    whatsappUrl: `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(messageLines.join('\n'))}`,
  };
}
