import { MessageCircle, MessageSquareText, Phone } from 'lucide-react';
import { getPhoneHref, getWhatsAppHref, SITE_CONFIG } from '../config/site';
import { Project } from '../data/projects';
import { OpenEnquiryHandler } from '../types/enquiry';

interface FloatingActionsProps {
  project: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

const actionClass = 'flex h-12 w-12 items-center justify-center rounded-full border border-white/80 shadow-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/50';

export function FloatingActions({ project, onOpenEnquiry }: FloatingActionsProps) {
  const whatsappHref = SITE_CONFIG.whatsappNumber
    ? getWhatsAppHref(SITE_CONFIG.whatsappNumber, project.name)
    : null;

  return (
    <div
      className="fixed bottom-24 right-3 z-40 flex flex-col gap-2 sm:bottom-6 sm:right-5"
      aria-label="Quick enquiry actions"
    >
      <button
        type="button"
        onClick={(event) => onOpenEnquiry('General enquiry', event.currentTarget)}
        className={`${actionClass} bg-stone-900 text-amber-300 hover:bg-stone-800`}
        aria-label="Open enquiry form"
        title="Open enquiry form"
      >
        <MessageSquareText className="h-5 w-5" aria-hidden="true" />
      </button>

      {SITE_CONFIG.phone ? (
        <a
          href={getPhoneHref(SITE_CONFIG.phone)}
          className={`${actionClass} bg-blue-600 text-white hover:bg-blue-500`}
          aria-label={`Call ${SITE_CONFIG.businessName}`}
          title={`Call ${SITE_CONFIG.businessName}`}
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
        </a>
      ) : (
        <button
          type="button"
          disabled
          className={`${actionClass} cursor-not-allowed bg-stone-300 text-stone-500 opacity-90`}
          aria-label="Call unavailable: approved phone number not configured"
          title="Call unavailable until an approved phone number is configured"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
        </button>
      )}

      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${actionClass} bg-emerald-600 text-white hover:bg-emerald-500`}
          aria-label={`Message ${SITE_CONFIG.businessName} on WhatsApp about ${project.name}`}
          title="Open WhatsApp enquiry"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </a>
      ) : (
        <button
          type="button"
          disabled
          className={`${actionClass} cursor-not-allowed bg-stone-300 text-stone-500 opacity-90`}
          aria-label="WhatsApp unavailable: approved WhatsApp number not configured"
          title="WhatsApp unavailable until an approved number is configured"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
