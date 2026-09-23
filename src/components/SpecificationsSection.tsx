import React from 'react';
import { ProjectSpecification } from '../data/projects';
import { Hammer, Droplets, DoorClosed, Sparkles } from 'lucide-react';

interface SpecificationsSectionProps {
  specifications: ProjectSpecification[];
}

export const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({ specifications }) => {
  const getCategoryIcon = (cat: string) => {
    if (cat.includes('Structure')) return <Hammer className="h-4 w-4 text-amber-700" />;
    if (cat.includes('Flooring')) return <Sparkles className="h-4 w-4 text-amber-700" />;
    if (cat.includes('Doors')) return <DoorClosed className="h-4 w-4 text-amber-700" />;
    return <Droplets className="h-4 w-4 text-amber-700" />;
  };

  return (
    <section id="specifications" className="scroll-mt-24 py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">
            05. Engineering & Specifications
          </div>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            Institutional Build Quality & Premium Fittings
          </h2>
          <p className="mt-3 text-base text-stone-600">
            Engineered for multi-generational durability using seismic-resistant monolithic RCC shear walls, imported Italian glazed vitrified surfaces, and German CP sanitaryware.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {specifications.map((specGroup, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200">
                  <div className="p-2 rounded-lg bg-white border border-stone-200">
                    {getCategoryIcon(specGroup.category)}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-stone-900">
                    {specGroup.category}
                  </h3>
                </div>

                <div className="mt-5 space-y-4">
                  {specGroup.details.map((detail, dIdx) => (
                    <div key={dIdx} className="text-xs">
                      <div className="font-semibold text-stone-800">
                        {detail.label}
                      </div>
                      <div className="mt-1 text-stone-600 leading-relaxed">
                        {detail.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
