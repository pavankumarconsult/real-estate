import React, { useState } from 'react';
import { Menu, X, Phone, Calendar, Building2 } from 'lucide-react';
import { Project } from '../data/projects';
import { getPhoneHref, SITE_CONFIG } from '../config/site';
import { OpenEnquiryHandler } from '../types/enquiry';

interface NavbarProps {
  currentProject: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

export const Navbar: React.FC<NavbarProps> = ({ currentProject, onOpenEnquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-stone-50/95 backdrop-blur-md transition-all">
      {/* Strict 3-Zone Top Bar Contract:
          Zone 1: Brand Wordmark (Single text element)
          Zone 2: 4-6 Nav Links (Single line)
          Zone 3: 1-2 Primary Actions
      */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand wordmark */}
        <a 
          href="#" 
          className="group flex items-center gap-2.5 font-serif text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 transition-colors hover:text-amber-800"
        >
          <Building2 className="h-6 w-6 text-amber-700 transition-transform group-hover:scale-105" />
          <span>{SITE_CONFIG.businessName}</span>
        </a>

        {/* Zone 2: 4-6 Nav links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-600">
          <a href="#overview" className="transition-colors hover:text-stone-900">
            Overview
          </a>
          <a href="#floorplans" className="transition-colors hover:text-stone-900">
            Floor Plans
          </a>
          <a href="#amenities" className="transition-colors hover:text-stone-900">
            Amenities
          </a>
          <a href="#location" className="transition-colors hover:text-stone-900">
            Location
          </a>
          <a href="#specifications" className="transition-colors hover:text-stone-900">
            Specifications
          </a>
          <a href="#sitevisit" className="text-amber-800 transition-colors hover:text-amber-900 font-semibold">
            Site Visit
          </a>
        </nav>

        {/* Zone 3: 1-2 Primary actions */}
        <div className="flex items-center gap-3">
          {SITE_CONFIG.phone && (
            <a
              href={getPhoneHref(SITE_CONFIG.phone)}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-amber-800 transition-colors px-3 py-2"
            >
              <Phone className="h-3.5 w-3.5 text-amber-700" />
              <span className="tabular-nums tracking-wide">{SITE_CONFIG.phone}</span>
            </a>
          )}

          <button
            onClick={(event) => onOpenEnquiry('Site visit', event.currentTarget)}
            className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-stone-800 hover:shadow active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5 text-amber-400" />
            <span>Plan Visit</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-stone-900 rounded-md focus-visible:ring-2 focus-visible:ring-stone-400"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="border-b border-stone-200 bg-stone-50 px-4 py-5 lg:hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="mb-4 pb-3 border-b border-stone-200 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-800">
              Active Project: {currentProject.name}
            </span>
            <span className="text-xs text-stone-500 font-mono">
              RERA: {currentProject.reraNumber}
            </span>
          </div>

          <div className="flex flex-col space-y-3.5 text-base font-medium text-stone-700">
            <a
              href="#overview"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 transition-colors hover:text-stone-900"
            >
              Project Overview
            </a>
            <a
              href="#floorplans"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 transition-colors hover:text-stone-900"
            >
              Floor Plans & Unit Layouts
            </a>
            <a
              href="#amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 transition-colors hover:text-stone-900"
            >
              Amenities & Sky Park
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 transition-colors hover:text-stone-900"
            >
              Location & Connectivity
            </a>
            <a
              href="#specifications"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 transition-colors hover:text-stone-900"
            >
              Technical Specifications
            </a>
            <button
              type="button"
              onClick={(event) => {
                setMobileMenuOpen(false);
                onOpenEnquiry('Site visit', event.currentTarget);
              }}
              className="flex items-center gap-2 pt-2 text-left font-semibold text-amber-800"
            >
              <Calendar className="h-4 w-4" /> Preview Site Visit Request
            </button>
          </div>

          {SITE_CONFIG.phone && (
            <div className="mt-5 pt-4 border-t border-stone-200">
              <a
                href={getPhoneHref(SITE_CONFIG.phone)}
                className="flex items-center gap-2 text-sm text-stone-800 font-medium"
              >
                <Phone className="h-4 w-4 text-amber-700" />
                <span>Sales Assistance: {SITE_CONFIG.phone}</span>
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
