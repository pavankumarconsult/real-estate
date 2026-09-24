export const ENQUIRY_INTENTS = [
  'General enquiry',
  'Site visit',
  'Callback request',
] as const;

export type EnquiryIntent =
  | (typeof ENQUIRY_INTENTS)[number]
  | 'Floor plan enquiry'
  | 'Amenities tour'
  | 'Pickup assistance'
  | 'Brochure request';

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
