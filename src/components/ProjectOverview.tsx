import React, { useEffect, useState } from 'react';
import { Maximize2, MessageSquareText, Phone, X } from 'lucide-react';
import { getPhoneHref } from '../config/site';
import { Project } from '../data/projects';
import { OpenEnquiryHandler } from '../types/enquiry';

interface ProjectOverviewProps {
  project: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project, onOpenEnquiry }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const images = project.galleryImages;

  useEffect(() => {
    if (!fullscreenImage) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreenImage(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [fullscreenImage]);

  return (
    <section id="overview" className="scroll-mt-24 border-b border-stone-200 bg-stone-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">01. Project Overview</div>
          <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
            {project.name} at a glance
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">{project.overview.description}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {project.keyHighlights.map((item) => (
            <div key={item.title} className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs transition-colors hover:border-amber-300">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl font-normal tabular-nums text-amber-800">{item.metric}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">{item.metricLabel}</span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-stone-900">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-stone-600">{item.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {images.length > 0 && (
            <div className="space-y-4 lg:col-span-7">
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-stone-300/80 bg-stone-200 group">
                <img src={images[activeImageIndex].url} alt={images[activeImageIndex].caption} className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-103" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-amber-300">{images[activeImageIndex].category}</div>
                    <div className="text-sm font-medium text-stone-100 sm:text-base">{images[activeImageIndex].caption}</div>
                  </div>
                  <button type="button" onClick={() => setFullscreenImage(images[activeImageIndex].url)} className="rounded-lg bg-black/40 p-2 text-white backdrop-blur-md hover:bg-black/60" aria-label="View project visual full screen">
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    type="button"
                    key={image.url}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`View project visual ${index + 1}`}
                    aria-pressed={activeImageIndex === index}
                    className={`relative aspect-4/3 overflow-hidden rounded-lg border-2 transition-all ${activeImageIndex === index ? 'border-amber-700 ring-2 ring-amber-700/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={image.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <p className="text-xs leading-relaxed text-stone-500">Images in this gallery are taken from the supplied Team4 Aria brochure.</p>
            </div>
          )}

          <div id="project-details" className="scroll-mt-24 space-y-6 lg:col-span-5">
            <div className="rounded-2xl bg-stone-900 p-8 text-stone-100 shadow-md">
              <div className="text-xs font-semibold uppercase tracking-widest text-amber-400">Project information</div>
              <h3 className="mt-2 font-serif text-2xl font-normal text-stone-50">Approved project details</h3>
              <dl className="mt-6 divide-y divide-stone-800 border-y border-stone-800 text-sm">
                {[
                  ['Size range', project.overview.sizes],
                  ['Price', project.startingPrice],
                  ['Land area', project.overview.landParcel],
                  ['Towers', String(project.overview.towers)],
                  ['Floors', project.overview.floors],
                  ['Open space', project.overview.openSpace],
                  ['Possession', `Expected possession: ${project.possessionDate}`],
                  ...(project.reraNumber ? [['RERA No:', project.reraNumber]] : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 py-3.5">
                    <dt className="text-stone-400">{label}</dt>
                    <dd className="text-right font-semibold text-stone-100">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a href={getPhoneHref()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-3 text-xs font-semibold text-white hover:bg-amber-500">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <button type="button" onClick={(event) => onOpenEnquiry('General enquiry about booking a flat', event.currentTarget)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-700 px-5 py-3 text-xs font-semibold text-stone-100 hover:bg-stone-800">
                  <MessageSquareText className="h-4 w-4" /> Send Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {fullscreenImage && (
        <div role="dialog" aria-modal="true" aria-label="Project image viewer" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] max-w-6xl overflow-hidden rounded-xl">
            <button type="button" onClick={() => setFullscreenImage(null)} className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/90" aria-label="Close full-screen image">
              <X className="h-6 w-6" />
            </button>
            <img src={fullscreenImage} alt="Team4 Aria brochure visual" className="max-h-[85vh] w-auto rounded-lg object-contain" />
          </div>
        </div>
      )}
    </section>
  );
};
