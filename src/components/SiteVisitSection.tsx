import { ArrowRight, CalendarDays, CheckCircle2, Database, Phone } from 'lucide-react';
import { SITE_CONFIG, getPhoneHref } from '../config/site';
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
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">04. Site Visit Planning</div>
          <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">Plan a visit to {project.name}</h2>
          <p className="mt-3 text-base leading-relaxed text-stone-600">Call directly for the fastest assistance, or submit the shared enquiry form for the Team4 Aria team to review.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <Phone className="h-6 w-6 text-amber-800" />
              <h3 className="mt-4 font-serif text-lg text-stone-900">Call Now</h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-600">Speak directly on {SITE_CONFIG.phoneDisplay} about availability and a site visit.</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <Database className="h-6 w-6 text-amber-800" />
              <h3 className="mt-4 font-serif text-lg text-stone-900">Submit securely</h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-600">The form validates your details and saves one enquiry after the server confirms it.</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <CheckCircle2 className="h-6 w-6 text-amber-800" />
              <h3 className="mt-4 font-serif text-lg text-stone-900">See confirmation</h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-600">A Thank You page appears only after the enquiry has been saved.</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-stone-900 p-7 text-stone-100 shadow-lg lg:col-span-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <CalendarDays className="h-4 w-4" /> Contact options
              </div>
              <p className="mt-4 text-sm leading-relaxed text-stone-300">Submitting the form stores your enquiry securely so the Team4 Aria team can review it.</p>
            </div>
            <div className="mt-7 grid gap-3">
              <a href={getPhoneHref()} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-500">
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <button type="button" onClick={(event) => onOpenEnquiry('Request a call for a site visit', event.currentTarget)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-100 hover:bg-stone-800">
                <span>Open Enquiry Form</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
