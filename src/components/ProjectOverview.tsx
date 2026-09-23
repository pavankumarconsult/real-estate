import React, { useEffect, useState } from 'react';
import { Project } from '../data/projects';
import { Maximize2, Check, X } from 'lucide-react';

interface ProjectOverviewProps {
  project: Project;
  onOpenSiteVisit: () => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project, onOpenSiteVisit }) => {
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
    <section id="overview" className="scroll-mt-24 py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">
            01. Master Development Overview
          </div>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            {project.name} in {project.location.area}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            {project.overview.description}
          </p>
        </div>

        {/* 4 Architectural Highlight Columns */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {project.keyHighlights.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs hover:border-amber-300 transition-colors"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl text-amber-800 font-normal tabular-nums">
                  {item.metric}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {item.metricLabel}
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-stone-900">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Visual Showcase & Architectural Specifications Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image */}
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-stone-300/80 bg-stone-200 group">
              <img
                src={images[activeImageIndex].url}
                alt={images[activeImageIndex].caption}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

              {/* Caption & Fullscreen Trigger */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                    {images[activeImageIndex].category}
                  </div>
                  <div className="text-sm sm:text-base font-medium text-stone-100">
                    {images[activeImageIndex].caption}
                  </div>
                </div>
                <button
                  onClick={() => setFullscreenImage(images[activeImageIndex].url)}
                  className="p-2 rounded-lg bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer"
                  title="View Full Resolution"
                  aria-label="View Full Resolution"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View ${img.caption}`}
                  aria-pressed={activeImageIndex === idx}
                  className={`relative aspect-4/3 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-amber-700 ring-2 ring-amber-700/20 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Distinctions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-stone-900 text-stone-100 p-8 shadow-md">
              <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                Project Dimensions
              </div>
              <h3 className="mt-2 font-serif text-2xl text-stone-50 font-normal">
                Spatial Planning & Core Specifications
              </h3>
              <p className="mt-3 text-sm text-stone-300 leading-relaxed">
                The supplied project information lists {project.overview.ceilingHeight.toLowerCase()}, {project.overview.mainDoorHeight.toLowerCase()}, and {project.overview.vaastu.toLowerCase()}.
              </p>

              <div className="mt-6 space-y-3.5 pt-6 border-t border-stone-800 text-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-amber-500/20 p-1 text-amber-400">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-medium text-stone-200">{project.overview.ceilingHeight}</span>
                    <p className="text-xs text-stone-400 mt-0.5">Expansive room proportion and luxury air volume.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-amber-500/20 p-1 text-amber-400">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-medium text-stone-200">{project.overview.mainDoorHeight}</span>
                    <p className="text-xs text-stone-400 mt-0.5">Teakwood frame with smart digital biometric access lock.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-amber-500/20 p-1 text-amber-400">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-medium text-stone-200">{project.overview.vaastu}</span>
                    <p className="text-xs text-stone-400 mt-0.5">Designed according to traditional spatial harmony principles.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-amber-500/20 p-1 text-amber-400">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-medium text-stone-200">{project.overview.unitTypes.join(' · ')}</span>
                    <p className="text-xs text-stone-400 mt-0.5">Configured across {project.overview.sizes}.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-800">
                <button
                  onClick={onOpenSiteVisit}
                  className="w-full rounded-lg bg-amber-600 px-5 py-3 text-center text-xs font-semibold text-white shadow hover:bg-amber-500 transition-colors cursor-pointer"
                >
                  Plan an On-Site Visit
                </button>
              </div>
            </div>

            {/* Quick stats panel */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 text-xs text-stone-600 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Configuration Mix:</span>
                <span className="font-semibold text-stone-900">3 BHK & 4 BHK Luxury</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Unit Sizes:</span>
                <span className="font-semibold text-stone-900 tabular-nums">{project.overview.sizes}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Total Towers:</span>
                <span className="font-semibold text-stone-900 tabular-nums">{project.overview.towers} Towers</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Supplied RERA Ref:</span>
                <span className="font-semibold text-amber-800 font-mono">{project.reraNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {fullscreenImage && (
        <div role="dialog" aria-modal="true" aria-label="Project image viewer" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="relative max-w-6xl max-h-[90vh] overflow-hidden rounded-xl">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition-colors cursor-pointer"
              aria-label="Close fullscreen image"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={fullscreenImage}
              alt="High resolution architecture render"
              referrerPolicy="no-referrer"
              className="max-h-[85vh] w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
};
