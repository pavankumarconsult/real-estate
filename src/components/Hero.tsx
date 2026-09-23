import React from 'react';
import { Calendar, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';
import { Project } from '../data/projects';
import { OpenEnquiryHandler } from '../types/enquiry';

interface HeroProps {
  project: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

export const Hero: React.FC<HeroProps> = ({ project, onOpenEnquiry }) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Background Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={project.heroImage}
          alt={`${project.name} Luxury High-Rise Architecture`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-40 filter brightness-90 transition-transform duration-1000 ease-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-900/30" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8">
        {/* Subtle trust & location indicator (Zero-pill discipline: unboxed clean text) */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-stone-300 font-medium">
          <span className="flex items-center gap-1.5 text-amber-400">
            <ShieldCheck className="h-4 w-4" />
            <span>RERA Reference: {project.reraNumber}</span>
          </span>
          <span aria-hidden="true" className="text-stone-500">·</span>
          <span className="flex items-center gap-1 text-stone-300">
            <MapPin className="h-3.5 w-3.5 text-amber-500" />
            <span>{project.location.area}, {project.location.city}</span>
          </span>
          <span aria-hidden="true" className="text-stone-500">·</span>
          <span className="text-stone-300">By {project.developer}</span>
        </div>

        {/* Display Headline */}
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-stone-50 leading-[1.15]" style={{ textWrap: 'balance' }}>
            {project.name}
          </h1>
          <p className="mt-4 font-serif text-xl sm:text-2xl text-amber-200/90 font-light italic">
            {project.tagline}
          </p>
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-stone-300 font-normal leading-relaxed">
            Spanning {project.overview.landParcel} in {project.location.area}, {project.name} presents {project.overview.towers} towers with {project.overview.floors}, {project.overview.totalUnits}, and residences from {project.overview.sizes}.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={(event) => onOpenEnquiry('Site visit', event.currentTarget)}
            className="group inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/30 transition-all hover:bg-amber-500 hover:shadow-xl active:scale-98 cursor-pointer whitespace-nowrap"
          >
            <Calendar className="h-4 w-4 text-amber-100" />
            <span>Plan a Site Visit</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <a
            href="#floorplans"
            className="inline-flex items-center gap-2 rounded-lg border border-stone-400/40 bg-stone-900/40 backdrop-blur-sm px-5 py-3.5 text-sm font-medium text-stone-200 transition-colors hover:border-stone-200 hover:bg-stone-800/80 hover:text-white cursor-pointer whitespace-nowrap"
          >
            <span>Explore 3 & 4 BHK Floor Plans</span>
          </a>
        </div>

        {/* Architectural Metrics Bar (Tabular figures, clean unboxed presentation) */}
        <div className="mt-14 pt-8 border-t border-stone-800/80 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-medium text-amber-400 tabular-nums">
              12.5 <span className="text-sm font-sans text-stone-400 font-normal">Acres</span>
            </div>
            <div className="mt-1 text-xs text-stone-400 font-medium">Master Community</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-serif font-medium text-amber-400 tabular-nums">
              G+48 <span className="text-sm font-sans text-stone-400 font-normal">Floors</span>
            </div>
            <div className="mt-1 text-xs text-stone-400 font-medium">7 Iconic High-Rise Towers</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-serif font-medium text-amber-400 tabular-nums">
              3.5 <span className="text-sm font-sans text-stone-400 font-normal">Acres</span>
            </div>
            <div className="mt-1 text-xs text-stone-400 font-medium">Lush Central Courtyard</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-serif font-medium text-amber-400 tabular-nums">
              10.5 <span className="text-sm font-sans text-stone-400 font-normal">Ft</span>
            </div>
            <div className="mt-1 text-xs text-stone-400 font-medium">Grand Ceiling Height</div>
          </div>
        </div>
      </div>
    </section>
  );
};
