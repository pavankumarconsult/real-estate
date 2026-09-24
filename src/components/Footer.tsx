import React from 'react';
import { Building2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SITE_CONFIG, getPhoneHref, getWhatsAppHref } from '../config/site';
import { Project } from '../data/projects';
import { OpenEnquiryHandler } from '../types/enquiry';

interface FooterProps {
  project: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

export const Footer: React.FC<FooterProps> = ({ project, onOpenEnquiry }) => (
  <footer className="border-t border-stone-800 bg-stone-950 pb-12 pt-16 text-stone-300">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 border-b border-stone-800 pb-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2.5 font-serif text-2xl font-semibold tracking-tight text-stone-100">
            <Building2 className="h-6 w-6 text-amber-500" />
            <span>{SITE_CONFIG.businessName}</span>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-stone-400">Project information for {project.name} at {project.location.address}.</p>
          <p className="max-w-md text-[11px] leading-relaxed text-stone-500">{project.name} is the property featured on this landing page. This website does not claim to be the developer&apos;s official website.</p>
        </div>

        <div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-200">Project navigation</div>
          <ul className="space-y-2.5 text-xs text-stone-400">
            <li><a href="#overview" className="hover:text-stone-100">Overview</a></li>
            <li><a href="#pricing" className="hover:text-stone-100">Pricing & unit information</a></li>
            <li><a href="#location" className="hover:text-stone-100">Location</a></li>
            <li><a href="#faq" className="hover:text-stone-100">FAQ</a></li>
            <li><button type="button" onClick={(event) => onOpenEnquiry('Site visit', event.currentTarget)} className="text-left hover:text-amber-400">Site visit enquiry</button></li>
          </ul>
        </div>

        <div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-200">Contact</div>
          <div className="space-y-3 text-xs text-stone-400">
            <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" /><span>{project.location.address}</span></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-amber-500" /><a href={getPhoneHref()} className="font-mono tabular-nums hover:text-white">{SITE_CONFIG.phoneDisplay}</a></div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-amber-500" /><a href={`mailto:${SITE_CONFIG.email}`} className="break-all hover:text-white">{SITE_CONFIG.email}</a></div>
            <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 shrink-0 text-amber-500" /><a href={getWhatsAppHref(project.name)} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-amber-500" /><a href={SITE_CONFIG.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">View on Google Maps</a></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 pt-8 text-center text-[11px] leading-relaxed text-stone-500">
        <div className="flex max-w-full flex-col items-center gap-1.5">
          <p>© 2026 Digystate Digital Marketing Agency. All rights reserved.</p>
          <p>Hyderabad · Bangalore</p>
          <a
            href="https://digystate.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-full break-all text-stone-400 underline decoration-stone-700 underline-offset-4 transition-colors hover:text-stone-100 hover:decoration-stone-400"
          >
            www.digystate.com
          </a>
        </div>
        <p className="max-w-full break-words pt-1">
          <span>Disclaimer</span>
          <span aria-hidden="true"> | </span>
          <span>Privacy Policy</span>
          <span aria-hidden="true"> | </span>
          <span>Terms &amp; Conditions</span>
        </p>
      </div>
    </div>
  </footer>
);
