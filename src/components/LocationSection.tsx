import React from 'react';
import { MapPin, Navigation, Phone } from 'lucide-react';
import { SITE_CONFIG, getPhoneHref } from '../config/site';
import { Project } from '../data/projects';

interface LocationSectionProps {
  project: Project;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ project }) => (
  <section id="location" className="scroll-mt-24 border-b border-stone-200 bg-stone-50 py-16 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">02. Location</div>
        <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">Find {project.name}</h2>
        <p className="mt-3 text-base leading-relaxed text-stone-600">The client-supplied location is shown exactly as provided. No unverified travel times or coordinates are displayed.</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-stone-200 bg-white p-7 shadow-xs lg:col-span-7">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <MapPin className="h-4 w-4" /> Project location
          </div>
          <h3 className="mt-4 font-serif text-2xl text-stone-900">{project.location.address}</h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">Use the supplied Google Maps destination for navigation, or call before travelling to confirm visit arrangements.</p>
        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-stone-900 p-7 text-stone-100 shadow-md lg:col-span-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">Directions & assistance</div>
            <p className="mt-3 text-sm leading-relaxed text-stone-300">Open the client-supplied Maps link. This site does not generate or infer map coordinates.</p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <a href={SITE_CONFIG.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-3 text-xs font-semibold text-white hover:bg-amber-500">
              <Navigation className="h-4 w-4" /> Get Directions
            </a>
            <a href={getPhoneHref()} className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-700 px-4 py-3 text-xs font-semibold text-stone-100 hover:bg-stone-800">
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
