import React, { useState } from 'react';
import { Project } from '../data/projects';

interface AmenitiesSectionProps {
  project: Project;
  onOpenSiteVisit: () => void;
}

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  project,
  onOpenSiteVisit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const amenities = project.amenities;
  const featureImage = project.galleryImages.find((image) => image.category === 'Amenities') ?? project.galleryImages[0];
  const primaryFeature = amenities[0];
  const secondaryFeature = amenities[1] ?? amenities[0];

  const categories = [
    'All',
    'Wellness & Club',
    'Sports & Fitness',
    'Nature & Open Spaces',
    'Convenience & Security',
  ];

  const filteredAmenities =
    selectedCategory === 'All'
      ? amenities
      : amenities.filter((a) => a.category === selectedCategory);

  return (
    <section id="amenities" className="scroll-mt-24 py-16 sm:py-24 bg-stone-900 text-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            03. World-Class Amenities
          </div>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-stone-50 font-normal tracking-tight">
            Amenities at {project.name}
          </h2>
          <p className="mt-4 text-base text-stone-300 leading-relaxed">
            Explore the wellness, recreation, open-space, and convenience features listed for this development.
          </p>
        </div>

        {/* Feature Hero Banner Showcase */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden min-h-[360px] border border-stone-800">
            <img
              src={featureImage.url}
              alt={featureImage.caption}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                Signature Feature
              </span>
              <h3 className="mt-1 font-serif text-2xl text-stone-100">
                {primaryFeature.name}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-stone-300 max-w-xl">
                {primaryFeature.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-stone-800/60 border border-stone-700/60">
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                Featured Amenity
              </div>
              <h3 className="mt-2 font-serif text-2xl text-stone-100">
                {secondaryFeature.name}
              </h3>
              <p className="mt-3 text-sm text-stone-300 leading-relaxed">
                {secondaryFeature.description}
              </p>

              <div className="mt-6 space-y-3 pt-6 border-t border-stone-700 text-xs text-stone-300">
                {amenities.slice(0, 4).map((amenity, index) => (
                  <div key={amenity.name} className={`flex justify-between gap-4 py-1 ${index < 3 ? 'border-b border-stone-700/50' : ''}`}>
                    <span className="text-stone-400">{amenity.category}:</span>
                    <span className="font-semibold text-stone-100 text-right">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-700">
              <button
                onClick={onOpenSiteVisit}
                className="w-full rounded-lg bg-amber-600 px-5 py-3 text-center text-xs font-semibold text-white shadow hover:bg-amber-500 transition-colors cursor-pointer"
              >
                Plan an Amenities Tour
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs (Interactive buttons) */}
        <div className="mt-14 flex flex-wrap gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtered Amenities Grid (Zero-pill metadata, clean cards) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAmenities.map((amenity, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-stone-800/40 border border-stone-700/70 hover:border-amber-500/60 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>{amenity.category}</span>
                  {amenity.tag && (
                    <span className="text-amber-400 font-semibold">{amenity.tag}</span>
                  )}
                </div>
                <h3 className="mt-2 text-base font-semibold text-stone-100">
                  {amenity.name}
                </h3>
                <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                  {amenity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
