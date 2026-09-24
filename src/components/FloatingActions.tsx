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
  return (
    <div className="fixed bottom-24 right-3 z-40 flex flex-col gap-2 sm:bottom-6 sm:right-5" aria-label="Quick enquiry actions">
      <button
        type="button"
        onClick={(event) => onOpenEnquiry('General enquiry', event.currentTarget)}
        className={`${actionClass} bg-stone-900 text-amber-300 hover:bg-stone-800`}
        aria-label="Open enquiry form"
        title="Enquiry"
      >
        <MessageSquareText className="h-5 w-5" aria-hidden="true" />
      </button>
      <a
        href={getPhoneHref()}
        className={`${actionClass} bg-blue-600 text-white hover:bg-blue-500`}
        aria-label={`Call ${SITE_CONFIG.phoneDisplay}`}
        title="Call"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
      </a>
      <a
        href={getWhatsAppHref(project.name)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${actionClass} bg-emerald-600 text-white hover:bg-emerald-500`}
        aria-label={`Message ${SITE_CONFIG.businessName} on WhatsApp about ${project.name}`}
        title="WhatsApp"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
      </a>
    </div>
  );
}
