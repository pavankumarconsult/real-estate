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
  whatsappNumber: string | null;
  whatsappMessageTemplate: string;
  generalWhatsappMessage: string;
  googleMapsUrl: string | null;
  enquiryDeliveryUrl: string | null;
}

export const SITE_CONFIG: SiteConfiguration = {
  businessName: 'Hyderabad Residences',
  businessNameConfirmed: false,
  phone: null,
  email: null,
  whatsappNumber: null,
  whatsappMessageTemplate: "Hello, I'm interested in {projectName}. Please share more details and help me arrange a site visit.",
  generalWhatsappMessage: "Hello, I'd like more information about your available projects.",
  googleMapsUrl: null,
  enquiryDeliveryUrl: null,
};

export const getPhoneHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;

export const getWhatsAppHref = (number: string, projectName?: string) => {
  const digits = number.replace(/\D/g, '');
  if (!digits) return null;

  const message = projectName
    ? SITE_CONFIG.whatsappMessageTemplate.replace('{projectName}', projectName)
    : SITE_CONFIG.generalWhatsappMessage;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};
