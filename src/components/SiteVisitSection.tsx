import { ArrowRight, CalendarDays, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { Project } from '../data/projects';
import { OpenEnquiryHandler } from '../types/enquiry';

interface SiteVisitSectionProps {
  project: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

export function SiteVisitSection({ project, onOpenEnquiry }: SiteVisitSectionProps) {
  return (
    <section id="sitevisit" className="scroll-mt-24 border-b border-stone-200 bg-stone-100 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">06. Site Visit Planning</div>
          <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
            Plan a Visit to {project.name}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-stone-600">
            Share your preferred project and enquiry type through the common enquiry form. A visit is arranged only after the project team responds and confirms availability.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <CalendarDays className="h-6 w-6 text-amber-800" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-lg text-stone-900">Share your preference</h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-600">Tell the team which project and type of enquiry you are interested in.</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <Clock className="h-6 w-6 text-amber-800" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-lg text-stone-900">Await confirmation</h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-600">No date, price, pickup, or appointment is confirmed by submitting the form.</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <MapPin className="h-6 w-6 text-amber-800" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-lg text-stone-900">Verify before travel</h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-600">Confirm the approved address, opening hours, and representative details directly.</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-stone-900 p-7 text-stone-100 shadow-lg lg:col-span-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>Honest enquiry flow</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-stone-300">
                {SITE_CONFIG.enquiryDeliveryUrl
                  ? 'Your details are sent only to the configured enquiry destination. A response is still required to confirm a visit.'
                  : 'The form currently runs in demo mode. No personal information is sent or stored.'}
              </p>
            </div>
            <button
              type="button"
              onClick={(event) => onOpenEnquiry('Site visit', event.currentTarget)}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40"
            >
              <span>Open Site Visit Enquiry</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
