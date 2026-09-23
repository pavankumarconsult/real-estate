/**
 * Business and outbound-link configuration.
 *
 * The supplied design did not include client-approved contact details. Keep a
 * value as null until the client confirms it. Components intentionally avoid
 * rendering clickable phone, email, WhatsApp, Maps, or enquiry links for null
 * values so the published site can never send visitors to dummy destinations.
 */
export interface SiteConfiguration {
  businessName: string;
  businessNameConfirmed: boolean;
  phone: string | null;
  email: string | null;
  whatsappUrl: string | null;
  googleMapsUrl: string | null;
  enquiryDeliveryUrl: string | null;
}

export const SITE_CONFIG: SiteConfiguration = {
  businessName: 'Hyderabad Residences',
  businessNameConfirmed: false,
  phone: null,
  email: null,
  whatsappUrl: null,
  googleMapsUrl: null,
  enquiryDeliveryUrl: null,
};

export const getPhoneHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;
