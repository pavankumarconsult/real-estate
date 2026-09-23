import React, { useState } from 'react';
import { Project } from '../data/projects';
import { MapPin, Navigation, Clock, Train, Briefcase, GraduationCap, Hospital, ShoppingBag } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { OpenEnquiryHandler } from '../types/enquiry';

interface LocationSectionProps {
  project: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  project,
  onOpenEnquiry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const landmarks = project.connectivity;

  const categories = ['All', ...Array.from(new Set(landmarks.map((landmark) => landmark.category)))];

  const filtered =
    selectedCategory === 'All'
      ? landmarks
      : landmarks.filter((l) => l.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transit':
        return <Train className="h-4 w-4 text-amber-700" />;
      case 'IT Hub':
        return <Briefcase className="h-4 w-4 text-sky-700" />;
      case 'Education':
        return <GraduationCap className="h-4 w-4 text-emerald-700" />;
      case 'Healthcare':
        return <Hospital className="h-4 w-4 text-rose-700" />;
      default:
        return <ShoppingBag className="h-4 w-4 text-purple-700" />;
    }
  };

  return (
    <section id="location" className="scroll-mt-24 py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">
            04. Strategic Location & Connectivity
          </div>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            Connectivity around {project.location.area}
          </h2>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Explore the supplied travel-time and distance references for {project.name}. Verify travel times independently before relying on them.
          </p>
        </div>

        {/* 4 Fast Facts */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {landmarks.slice(0, 4).map((landmark) => (
            <div key={landmark.name} className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-medium">{landmark.name}</div>
              <div className="mt-1 font-serif text-2xl font-bold text-amber-900 tabular-nums">{landmark.travelTime}</div>
              <div className="text-[11px] text-stone-400">{landmark.distance} · supplied estimate</div>
            </div>
          ))}
        </div>

        {/* Map & Landmark Explorer Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Landmarks Table */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <h3 className="font-serif text-lg font-medium text-stone-900">
                Key Neighborhood Destinations
              </h3>

              {/* Category selector */}
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={selectedCategory === cat}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Landmarks (Zero-pill metadata) */}
            <div className="mt-4 divide-y divide-stone-100">
              {filtered.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/80">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-stone-900">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                        <span>{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.distance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 font-mono tabular-nums">
                      <Clock className="h-3 w-3 text-amber-700" />
                      {item.travelTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Site Address & Navigation Assist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-stone-900 text-stone-100 shadow-md">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <MapPin className="h-4 w-4" />
                <span>Site Address & Experience Centre</span>
              </div>

              <h4 className="mt-3 font-serif text-xl text-stone-50">
                {project.name} Experience Centre
              </h4>
              <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                {project.location.address}
              </p>

              <div className="mt-6 pt-4 border-t border-stone-800 space-y-2 text-xs text-stone-300">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Supplied Centre Hours:</span>
                  <span className="font-semibold text-stone-100">9:30 AM – 7:30 PM (verify before travel)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Pickup Assistance:</span>
                  <span className="font-semibold text-amber-400">Subject to confirmation</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800 flex flex-col gap-2.5">
                <button
                  onClick={(event) => onOpenEnquiry('Site visit', event.currentTarget)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-3 text-xs font-semibold text-white shadow hover:bg-amber-500 transition-colors cursor-pointer"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Plan a Site Visit</span>
                </button>
                {SITE_CONFIG.googleMapsUrl ? (
                  <a
                    href={SITE_CONFIG.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-stone-700 px-4 py-3 text-xs font-semibold text-stone-200 hover:bg-stone-800 transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Open Verified Map</span>
                  </a>
                ) : (
                  <p className="text-center text-[11px] text-stone-500">Google Maps link pending client confirmation.</p>
                )}
              </div>
            </div>

            {/* Metro & Highway Guide Card */}
            <div className="p-5 rounded-xl bg-white border border-stone-200 text-xs space-y-3">
              <div className="font-semibold text-stone-900 flex items-center gap-2">
                <Train className="h-4 w-4 text-amber-800" />
                <span>Transit Reference:</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                {landmarks.find((landmark) => landmark.category === 'Transit')?.name ?? 'Transit information pending'} — supplied as {landmarks.find((landmark) => landmark.category === 'Transit')?.distance ?? 'distance pending'} / {landmarks.find((landmark) => landmark.category === 'Transit')?.travelTime ?? 'time pending'}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
