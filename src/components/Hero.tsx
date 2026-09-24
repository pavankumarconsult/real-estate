import React from 'react';
import { MapPin, MessageSquareText, Phone } from 'lucide-react';
import { SITE_CONFIG, getPhoneHref } from '../config/site';
import { Project } from '../data/projects';
import { OpenEnquiryHandler } from '../types/enquiry';

interface HeroProps {
  project: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

export const Hero: React.FC<HeroProps> = ({ project, onOpenEnquiry }) => (
  <section className="relative overflow-hidden bg-stone-900 text-white">
    <div className="absolute inset-0 z-0">
      <img
        src={project.heroImage}
        alt={`${project.name} project visual; usage approval pending`}
        className="h-full w-full object-cover object-center opacity-40 filter brightness-90 transition-transform duration-1000 ease-out hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-900/30" />
    </div>

    <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-stone-300 sm:text-sm">
        <span className="flex items-center gap-1.5 text-amber-400">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {project.location.address}
        </span>
        <span aria-hidden="true" className="text-stone-500">·</span>
        <span>Expected possession: {project.possessionDate}</span>
      </div>

      <div className="max-w-3xl">
        <h1 className="font-serif text-4xl font-normal leading-[1.15] tracking-tight text-stone-50 sm:text-5xl lg:text-6xl">
          {project.name}
        </h1>
        <p className="mt-4 font-serif text-xl font-light italic text-amber-200/90 sm:text-2xl">
          {project.tagline}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-300 sm:text-lg">
          {project.overview.sizes} · {project.priceStarting} · {project.overview.openSpace} open space
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={getPhoneHref()}
          className="group inline-flex items-center gap-2 rounded-lg bg-amber-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/30 transition-all hover:bg-amber-500 hover:shadow-xl active:scale-95"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          <span>Call Now</span>
          <span className="sr-only"> at {SITE_CONFIG.phoneDisplay}</span>
        </a>
        <button
          type="button"
          onClick={(event) => onOpenEnquiry('Site visit', event.currentTarget)}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-400/40 bg-stone-900/40 px-5 py-3.5 text-sm font-medium text-stone-200 backdrop-blur-sm transition-colors hover:border-stone-200 hover:bg-stone-800/80 hover:text-white"
        >
          <MessageSquareText className="h-4 w-4" aria-hidden="true" />
          Enquire on WhatsApp
        </button>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-6 border-t border-stone-800/80 pt-8 sm:grid-cols-4 lg:gap-8">
        {[
          [project.overview.landParcel, 'Land area'],
          [`${project.overview.towers} towers`, 'Project scale'],
          [project.overview.floors, 'Building height'],
          [project.overview.openSpace, 'Open space'],
        ].map(([value, label]) => (
          <div key={label}>
            <div className="font-serif text-2xl font-medium text-amber-400 sm:text-3xl">{value}</div>
            <div className="mt-1 text-xs font-medium text-stone-400">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
