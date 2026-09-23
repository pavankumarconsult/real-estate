import React from 'react';
import { Building2, Phone, Mail, MapPin, ShieldCheck, MessageCircle } from 'lucide-react';
import { Project } from '../data/projects';
import { getPhoneHref, SITE_CONFIG } from '../config/site';

interface FooterProps {
  project: Project;
  onOpenSiteVisit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ project, onOpenSiteVisit }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & Developer Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 font-serif text-2xl text-stone-100 font-semibold tracking-tight">
              <Building2 className="h-6 w-6 text-amber-500" />
              <span>{SITE_CONFIG.businessName}</span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Presenting {project.name} by {project.developer} in {project.location.area}, {project.location.city}.
            </p>
            {!SITE_CONFIG.businessNameConfirmed && (
              <p className="text-[11px] text-stone-500">Business name pending client confirmation.</p>
            )}
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-400 font-mono">
              <ShieldCheck className="h-4 w-4" />
              <span>Supplied RERA reference: {project.reraNumber}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <div className="text-xs uppercase tracking-wider text-stone-200 font-semibold mb-4">
              Project Navigation
            </div>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a href="#overview" className="hover:text-stone-100 transition-colors">
                  Overview & Architecture
                </a>
              </li>
              <li>
                <a href="#floorplans" className="hover:text-stone-100 transition-colors">
                  3 & 4 BHK Floor Plans
                </a>
              </li>
              <li>
                <a href="#amenities" className="hover:text-stone-100 transition-colors">
                  Clubhouse & Sky Park
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-stone-100 transition-colors">
                  Location & Transit Hubs
                </a>
              </li>
              <li>
                <a href="#specifications" className="hover:text-stone-100 transition-colors">
                  Build Specifications
                </a>
              </li>
            </ul>
          </div>

          {/* Site Visit Assistance */}
          <div>
            <div className="text-xs uppercase tracking-wider text-stone-200 font-semibold mb-4">
              Site Experience
            </div>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={onOpenSiteVisit}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Plan a Site Visit
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSiteVisit}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Pickup Assistance Preference
                </button>
              </li>
              <li>
                <a href="#floorplans" className="hover:text-stone-100 transition-colors">
                  Cost Breakdown Estimator
                </a>
              </li>
              <li>
                <span className="text-stone-500">Supplied possession: {project.possessionDate}</span>
              </li>
            </ul>
          </div>

          {/* Direct Sales Desk */}
          <div>
            <div className="text-xs uppercase tracking-wider text-stone-200 font-semibold mb-4">
              Sales Experience Centre
            </div>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{project.location.address}</span>
              </div>
              {SITE_CONFIG.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                  <a href={getPhoneHref(SITE_CONFIG.phone)} className="hover:text-white font-mono tabular-nums">
                    {SITE_CONFIG.phone}
                  </a>
                </div>
              )}
              {SITE_CONFIG.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                  <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white">
                    {SITE_CONFIG.email}
                  </a>
                </div>
              )}
              {SITE_CONFIG.whatsappUrl && (
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-amber-500 shrink-0" />
                  <a href={SITE_CONFIG.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                    WhatsApp
                  </a>
                </div>
              )}
              {!SITE_CONFIG.phone && !SITE_CONFIG.email && !SITE_CONFIG.whatsappUrl && (
                <p className="text-stone-500">Verified sales contact details are pending.</p>
              )}
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            Disclaimer: Renderings, plans, specifications, dates, pricing, and regulatory references are supplied project information and require independent verification before reliance. Supplied RERA reference: {project.reraNumber}.
          </p>
          <div className="whitespace-nowrap font-sans">
            © {new Date().getFullYear()} {SITE_CONFIG.businessName}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
