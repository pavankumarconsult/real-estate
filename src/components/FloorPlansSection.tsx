import React, { useState } from 'react';
import { Project } from '../data/projects';
import { OpenEnquiryHandler } from '../types/enquiry';
import { 
  Compass, 
  Check, 
  Calculator, 
  Calendar, 
  Download, 
  Info
} from 'lucide-react';

interface FloorPlansSectionProps {
  project: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

export const FloorPlansSection: React.FC<FloorPlansSectionProps> = ({
  project,
  onOpenEnquiry,
}) => {
  const floorPlans = project.floorPlans;
  const [activePlanId, setActivePlanId] = useState(floorPlans[0].id);
  const [showCostEstimator, setShowCostEstimator] = useState(false);

  const currentPlan = floorPlans.find((p) => p.id === activePlanId) || floorPlans[0];

  const baseRate = project.illustrativeRatePerSqFt;
  const illustrativeBaseCost = baseRate ? currentPlan.superBuiltUpArea * baseRate : null;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="floorplans" className="scroll-mt-24 py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              02. Architectural Plans & Layouts
            </div>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
              Floor Plans at {project.name}
            </h2>
            <p className="mt-3 text-base text-stone-600">
              Compare the supplied layouts, areas, room dimensions, and orientation details for this project.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCostEstimator(!showCostEstimator)}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <Calculator className="h-4 w-4 text-amber-700" />
              <span>{showCostEstimator ? 'Hide Illustration' : 'Illustrative Price Calculator'}</span>
            </button>
          </div>
        </div>

        {/* Floor Plan Selector Tabs (Interactive filter buttons adhering to constitution) */}
        <div className="mt-10 flex overflow-x-auto pb-2 gap-2 scrollbar-none border-b border-stone-200">
          {floorPlans.map((plan) => {
            const isActive = plan.id === activePlanId;
            return (
              <button
                key={plan.id}
                onClick={() => setActivePlanId(plan.id)}
                aria-pressed={isActive}
                className={`whitespace-nowrap px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-amber-800 text-amber-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                <span>{plan.name}</span>
                <span className="ml-2 font-normal text-xs text-stone-400 tabular-nums">
                  ({plan.superBuiltUpArea} sq.ft)
                </span>
              </button>
            );
          })}
        </div>

        {/* Cost Estimator Drawer / Panel (if toggled) */}
        {showCostEstimator && (
          <div className="mt-6 p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-amber-200">
              <div>
                <h4 className="font-serif text-lg font-medium text-stone-900">
                  Illustrative Base-Price Example — {currentPlan.name}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  {project.pricingVerified
                    ? 'This mathematical illustration uses the configured project rate and is not an all-inclusive quote.'
                    : 'This is a mathematical illustration using the unconfirmed reference rate from the supplied design—not a quote.'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Illustrative base amount:</span>
                <div className="font-serif text-2xl font-bold text-amber-900 tabular-nums">
                  {illustrativeBaseCost ? formatINR(illustrativeBaseCost) : 'Unavailable'}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-amber-100">
                <span className="text-stone-500">Super built-up area</span>
                <div className="mt-1 font-semibold text-stone-900 tabular-nums">{currentPlan.superBuiltUpArea.toLocaleString('en-IN')} sq.ft</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Supplied project data</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-100">
                <span className="text-stone-500">Reference rate</span>
                <div className="mt-1 font-semibold text-stone-900 tabular-nums">{baseRate ? `${formatINR(baseRate)} / sq.ft` : 'Not configured'}</div>
                <div className="text-[10px] text-amber-700 mt-0.5">
                  {project.pricingVerified ? 'Configured project reference rate' : 'Unconfirmed—verify with developer'}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-100">
                <span className="text-stone-500">Not included</span>
                <div className="mt-1 font-semibold text-stone-900">Taxes, registration, parking and fees</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Unsupported figures intentionally hidden</div>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-stone-600">{project.pricingNotice}</p>
          </div>
        )}

        {/* Main Floor Plan Presentation */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Architectural 2D Schematic Plan Layout */}
          <div className="lg:col-span-7 bg-stone-50 rounded-2xl border border-stone-200 p-6 flex flex-col justify-between relative overflow-hidden">
            {/* Top Bar of Diagram */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-medium text-stone-900">
                  {currentPlan.name}
                </span>
                <span className="text-xs text-stone-500">·</span>
                <span className="flex items-center gap-1 text-xs text-stone-600 font-medium">
                  <Compass className="h-3.5 w-3.5 text-amber-700" />
                  <span>Facing: {currentPlan.facing}</span>
                </span>
              </div>

              <div className="text-xs text-stone-500">
                Scale 1:100 Architectural Layout
              </div>
            </div>

            {/* Custom Interactive SVG Floor Plan Diagram */}
            <div className="my-6 p-4 bg-white rounded-xl border border-stone-200 shadow-inner flex items-center justify-center min-h-[380px]">
              <svg
                viewBox="0 0 600 420"
                className="w-full h-auto max-h-[420px] text-stone-800 select-none font-sans"
              >
                {/* Outer Wall Boundary */}
                <rect
                  x="20"
                  y="20"
                  width="560"
                  height="380"
                  fill="#fafaf9"
                  stroke="#292524"
                  strokeWidth="4"
                  rx="4"
                />

                {/* Foyer / Entrance */}
                <rect
                  x="20"
                  y="160"
                  width="90"
                  height="80"
                  fill="#f5f5f4"
                  stroke="#78716c"
                  strokeWidth="2"
                />
                <text x="65" y="195" fontSize="11" textAnchor="middle" fill="#44403c" fontWeight="600">
                  MAIN ENTRANCE
                </text>
                <text x="65" y="212" fontSize="9" textAnchor="middle" fill="#78716c">
                  8 ft Teak Door
                </text>

                {/* Living Hall */}
                <rect
                  x="110"
                  y="120"
                  width="220"
                  height="160"
                  fill="#fef3c7"
                  fillOpacity="0.35"
                  stroke="#78716c"
                  strokeWidth="2"
                />
                <text x="220" y="190" fontSize="14" textAnchor="middle" fill="#1c1917" fontWeight="bold">
                  GRAND LIVING ROOM
                </text>
                <text x="220" y="210" fontSize="11" textAnchor="middle" fill="#78716c" fontWeight="500">
                  {currentPlan.dimensions.living}
                </text>
                <text x="220" y="228" fontSize="9" textAnchor="middle" fill="#92400e">
                  10.5 ft Clear Height
                </text>

                {/* Dining Room */}
                <rect
                  x="110"
                  y="20"
                  width="170"
                  height="100"
                  fill="#f5f5f4"
                  stroke="#78716c"
                  strokeWidth="2"
                />
                <text x="195" y="65" fontSize="12" textAnchor="middle" fill="#1c1917" fontWeight="600">
                  DINING
                </text>
                <text x="195" y="82" fontSize="10" textAnchor="middle" fill="#78716c">
                  {currentPlan.dimensions.dining}
                </text>

                {/* Scenic Balcony Deck */}
                <rect
                  x="20"
                  y="20"
                  width="90"
                  height="140"
                  fill="#ecfccb"
                  fillOpacity="0.4"
                  stroke="#65a30d"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <text x="65" y="80" fontSize="11" textAnchor="middle" fill="#365314" fontWeight="600">
                  SCENIC DECK
                </text>
                <text x="65" y="98" fontSize="9" textAnchor="middle" fill="#4d7c0f">
                  {currentPlan.dimensions.balcony}
                </text>
                <text x="65" y="112" fontSize="8" textAnchor="middle" fill="#65a30d">
                  Glass Railing
                </text>

                {/* Modular Kitchen & Utility */}
                <rect
                  x="280"
                  y="20"
                  width="130"
                  height="100"
                  fill="#f5f5f4"
                  stroke="#78716c"
                  strokeWidth="2"
                />
                <text x="345" y="65" fontSize="12" textAnchor="middle" fill="#1c1917" fontWeight="600">
                  KITCHEN & UTILITY
                </text>
                <text x="345" y="82" fontSize="10" textAnchor="middle" fill="#78716c">
                  {currentPlan.dimensions.kitchen}
                </text>

                {/* Master Bedroom Suite */}
                <rect
                  x="330"
                  y="120"
                  width="250"
                  height="160"
                  fill="#fef3c7"
                  fillOpacity="0.25"
                  stroke="#78716c"
                  strokeWidth="2"
                />
                <text x="455" y="185" fontSize="13" textAnchor="middle" fill="#1c1917" fontWeight="bold">
                  MASTER SUITE
                </text>
                <text x="455" y="205" fontSize="10" textAnchor="middle" fill="#78716c">
                  {currentPlan.dimensions.masterBedroom}
                </text>
                <text x="455" y="222" fontSize="9" textAnchor="middle" fill="#854d0e">
                  En-suite Bath & Dresser
                </text>

                {/* Bedroom 2 */}
                <rect
                  x="20"
                  y="280"
                  width="180"
                  height="120"
                  fill="#f5f5f4"
                  stroke="#78716c"
                  strokeWidth="2"
                />
                <text x="110" y="335" fontSize="12" textAnchor="middle" fill="#1c1917" fontWeight="600">
                  BEDROOM 2
                </text>
                <text x="110" y="352" fontSize="10" textAnchor="middle" fill="#78716c">
                  {currentPlan.dimensions.bedroom2}
                </text>

                {/* Bedroom 3 */}
                <rect
                  x="200"
                  y="280"
                  width="180"
                  height="120"
                  fill="#f5f5f4"
                  stroke="#78716c"
                  strokeWidth="2"
                />
                <text x="290" y="335" fontSize="12" textAnchor="middle" fill="#1c1917" fontWeight="600">
                  BEDROOM 3
                </text>
                <text x="290" y="352" fontSize="10" textAnchor="middle" fill="#78716c">
                  {currentPlan.dimensions.bedroom3}
                </text>

                {/* Maid / Bathrooms / Bedroom 4 Block */}
                <rect
                  x="380"
                  y="280"
                  width="200"
                  height="120"
                  fill="#fafaf9"
                  stroke="#78716c"
                  strokeWidth="2"
                />
                <text x="480" y="335" fontSize="11" textAnchor="middle" fill="#1c1917" fontWeight="600">
                  {currentPlan.hasMaidRoom ? 'MAID SUITE & TOILETS' : 'EN-SUITE TOILETS'}
                </text>
                <text x="480" y="355" fontSize="9" textAnchor="middle" fill="#78716c">
                  Toto / Kohler fittings
                </text>
              </svg>
            </div>

            {/* Bottom info banner */}
            <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-amber-700" />
                <span>All dimensions shown in feet & inches. Non-destructive RERA carpet measurements.</span>
              </span>
              <span className="font-mono text-stone-700">RERA Carpet: {currentPlan.carpetArea} sq.ft</span>
            </div>
          </div>

          {/* Right: Detailed Area Metrics & Specifications */}
          <div className="lg:col-span-5 space-y-6">
            {/* Area Breakdown Cards */}
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Area Metrics & Configuration
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 pb-6 border-b border-stone-100 text-center">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-xs text-stone-500">Super Built-Up</div>
                  <div className="mt-1 font-serif text-2xl font-bold text-stone-900 tabular-nums">
                    {currentPlan.superBuiltUpArea}
                  </div>
                  <div className="text-[10px] text-stone-400">Sq. Ft</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-xs text-stone-500">RERA Carpet</div>
                  <div className="mt-1 font-serif text-2xl font-bold text-stone-900 tabular-nums">
                    {currentPlan.carpetArea}
                  </div>
                  <div className="text-[10px] text-stone-400">Sq. Ft</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-xs text-stone-500">Balconies</div>
                  <div className="mt-1 font-serif text-2xl font-bold text-stone-900 tabular-nums">
                    {currentPlan.balconyArea}
                  </div>
                  <div className="text-[10px] text-stone-400">Sq. Ft</div>
                </div>
              </div>

              {/* Quick Spec List */}
              <div className="mt-5 space-y-2.5 text-xs text-stone-700">
                <div className="flex justify-between py-1 border-b border-stone-50">
                  <span className="text-stone-500">Bedrooms & Bathrooms:</span>
                  <span className="font-semibold text-stone-900">{currentPlan.bedrooms} Bed · {currentPlan.bathrooms} Baths</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50">
                  <span className="text-stone-500">Balcony Decks:</span>
                  <span className="font-semibold text-stone-900">{currentPlan.balconies} Outdoor Decks</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50">
                  <span className="text-stone-500">Main Orientation:</span>
                  <span className="font-semibold text-amber-800">{currentPlan.facing} Facing (Vaastu Compliant)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Maid / Helper Suite:</span>
                  <span className="font-semibold text-stone-900">
                    {currentPlan.hasMaidRoom ? 'Included with Separate Entry' : 'Not Included'}
                  </span>
                </div>
              </div>

              {/* Key Layout Features */}
              <div className="mt-6 pt-4 border-t border-stone-200">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-3">
                  Architectural Highlights
                </div>
                <ul className="space-y-2">
                  {currentPlan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                      <Check className="h-3.5 w-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions: Direct Site Visit Booking & Brochure Download */}
            <div className="space-y-3">
              <button
                onClick={(event) => onOpenEnquiry('Site visit', event.currentTarget, currentPlan.name)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-5 py-3.5 text-xs font-semibold text-white shadow hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-amber-400" />
                <span>Schedule Visit for {currentPlan.name}</span>
              </button>

              {project.brochureUrl ? (
                <a
                  href={project.brochureUrl}
                  download
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Download className="h-4 w-4 text-stone-500" />
                  <span>Download Project Brochure</span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-stone-100 px-5 py-3 text-xs font-semibold text-stone-500 cursor-not-allowed"
                >
                  <Download className="h-4 w-4 text-stone-400" />
                  <span>Brochure Not Yet Provided</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
