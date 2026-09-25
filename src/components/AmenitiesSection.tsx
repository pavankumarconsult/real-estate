import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AMENITY_MEDIA } from '../data/media';
import { Project } from '../data/projects';
import { OpenEnquiryHandler } from '../types/enquiry';

interface AmenitiesSectionProps {
  project: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ project, onOpenEnquiry }) => {
  if (!AMENITY_MEDIA.length) return null;

  return (
    <section id="amenities" className="scroll-mt-24 bg-stone-900 py-16 text-stone-100 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-400">03. Amenities Gallery</div>
            <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-stone-50 sm:text-4xl">
              Amenities at {project.name}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-stone-300">
              Explore the supplied amenity visuals for {project.name}.
            </p>
          </div>
          <button
            type="button"
            onClick={(event) => onOpenEnquiry('Request a call for a site visit', event.currentTarget, 'Amenities section')}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40 md:w-auto"
          >
            Plan an Amenities Tour
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITY_MEDIA.map((amenity) => (
            <figure
              key={amenity.name}
              className="group relative aspect-[3/2] overflow-hidden rounded-2xl border border-stone-700/80 bg-stone-800 shadow-lg"
            >
              <img
                src={amenity.image}
                alt={amenity.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/5 to-transparent" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <span className="inline-block border-l-2 border-amber-400 pl-3 text-sm font-semibold tracking-wide text-white sm:text-base">
                  {amenity.name}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
