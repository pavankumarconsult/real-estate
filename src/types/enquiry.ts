export const ENQUIRY_INTENTS = [
  'General enquiry',
  'Site visit',
  'Callback request',
  'Price enquiry',
  'Floor plan enquiry',
  'Amenities tour',
  'Pickup assistance',
  'Brochure request',
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
}

export type EnquirySubmissionResult =
  | { status: 'demo' }
  | { status: 'delivered' };

export type OpenEnquiryHandler = (
  intent: EnquiryIntent,
  trigger?: HTMLElement | null,
  context?: string,
) => void;
