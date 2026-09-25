export const ENQUIRY_INTENTS = [
  'General enquiry about booking a flat',
  'Request a call for a site visit',
  'Ready to buy in 2–3 weeks',
] as const;

export type EnquiryIntent = (typeof ENQUIRY_INTENTS)[number];

export interface EnquiryPayload {
  name: string;
  mobile: string;
  email?: string;
  projectId: string;
  projectName: string;
  intent: EnquiryIntent;
  context?: string;
  consent: true;
  website: string;
  source: {
    pagePath: string;
    referrerHost?: string;
  };
}

export interface EnquirySubmissionResult {
  success: true;
  referenceId: string;
}

export type OpenEnquiryHandler = (
  intent: EnquiryIntent,
  trigger?: HTMLElement | null,
  context?: string,
) => void;
