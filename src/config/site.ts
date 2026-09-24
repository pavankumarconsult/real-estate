/**
 * Client-approved display identity and outbound contact configuration.
 * Keep contact details here so every call, email, WhatsApp, and Maps action
 * uses the same source of truth.
 */
export interface SiteConfiguration {
  businessName: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  whatsappNumber: string;
  whatsappMessageTemplate: string;
  googleMapsUrl: string;
}

export const SITE_CONFIG: SiteConfiguration = {
  businessName: 'Medha Ventures',
  phoneDisplay: '+91 80568 85347',
  phoneHref: 'tel:+918056885347',
  email: 'jayapalreddy5347@gmail.com',
  whatsappNumber: '918056885347',
  whatsappMessageTemplate: "Hello, I'm interested in {projectName}. Please share details and help me arrange a site visit.",
  googleMapsUrl: 'https://maps.app.goo.gl/4DYLxvuHhwsqaGgW7',
};

export const getPhoneHref = () => SITE_CONFIG.phoneHref;

export const getWhatsAppHref = (projectName: string) => {
  const message = SITE_CONFIG.whatsappMessageTemplate.replace('{projectName}', projectName);
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
};
