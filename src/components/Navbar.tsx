import React, { useState } from 'react';
import { Building2, Menu, MessageSquareText, Phone, X } from 'lucide-react';
import { SITE_CONFIG, getPhoneHref } from '../config/site';
import { Project } from '../data/projects';
import { OpenEnquiryHandler } from '../types/enquiry';

interface NavbarProps {
  currentProject: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

const navItems = [
  ['Overview', '#overview'],
  ['Plans', '#floorplans'],
  ['Amenities', '#amenities'],
  ['Location', '#location'],
  ['Site Visit', '#sitevisit'],
] as const;

export const Navbar: React.FC<NavbarProps> = ({ currentProject, onOpenEnquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-stone-50/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="group flex items-center gap-2.5 font-serif text-xl font-semibold tracking-tight text-stone-900 hover:text-amber-800 sm:text-2xl">
          <Building2 className="h-6 w-6 text-amber-700" aria-hidden="true" />
          <span>{SITE_CONFIG.businessName}</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-stone-600 lg:flex">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="transition-colors hover:text-stone-900">{label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={getPhoneHref()} className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-800">
            <Phone className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
            <span>Call Now</span>
          </a>
          <button
            type="button"
            onClick={(event) => onOpenEnquiry('General enquiry about booking a flat', event.currentTarget)}
            className="hidden items-center gap-2 rounded-lg border border-stone-300 px-4 py-2.5 text-xs font-semibold text-stone-800 transition hover:border-amber-700 hover:text-amber-800 sm:inline-flex"
          >
            <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
            Enquire
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-md p-2 text-stone-700 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-navigation" className="border-b border-stone-200 bg-stone-50 px-4 py-5 lg:hidden">
          <div className="mb-4 border-b border-stone-200 pb-3 text-xs font-semibold uppercase tracking-wider text-amber-800">
            {currentProject.name}
          </div>
          <div className="flex flex-col space-y-3.5 text-base font-medium text-stone-700">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-stone-900">{label}</a>
            ))}
            <button
              type="button"
              onClick={(event) => {
                setMobileMenuOpen(false);
                onOpenEnquiry('General enquiry about booking a flat', event.currentTarget);
              }}
              className="flex items-center gap-2 pt-2 text-left font-semibold text-amber-800"
            >
              <MessageSquareText className="h-4 w-4" /> Open enquiry form
            </button>
          </div>
          <a href={getPhoneHref()} className="mt-5 flex items-center gap-2 border-t border-stone-200 pt-4 text-sm font-medium text-stone-800">
            <Phone className="h-4 w-4 text-amber-700" /> {SITE_CONFIG.phoneDisplay}
          </a>
        </div>
      )}
    </header>
  );
};
