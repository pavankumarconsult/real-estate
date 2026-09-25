import React from 'react';
import { Download, FileText, LayoutTemplate, Map, MessageSquareText } from 'lucide-react';
import { PROJECT_DOCUMENTS, ProjectDocument } from '../data/media';
import { Project } from '../data/projects';
import { OpenEnquiryHandler } from '../types/enquiry';

interface FloorPlansSectionProps {
  project: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

function DownloadButton({ document }: { document: ProjectDocument }) {
  return (
    <a
      href={document.url}
      download={document.fileName}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-3 text-xs font-semibold text-stone-800 transition hover:border-amber-600 hover:bg-amber-50 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/30"
      aria-label={`${document.actionLabel} as PDF`}
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      <span>{document.actionLabel}</span>
    </a>
  );
}

export const FloorPlansSection: React.FC<FloorPlansSectionProps> = ({ project, onOpenEnquiry }) => (
  <section id="floorplans" className="scroll-mt-24 border-b border-stone-200 bg-white py-16 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">02. Site & Floor Plans</div>
        <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">
          Supplied plans for {project.name}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-stone-600">
          Download the supplied PDFs directly. Plan labels follow the source filenames; no unverified configuration, size, or tower details have been added.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col justify-between rounded-2xl bg-stone-900 p-7 text-stone-100 shadow-lg lg:col-span-5 lg:self-start">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <Map className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-amber-400">Site plan</div>
            <h3 className="mt-2 font-serif text-2xl text-white">{PROJECT_DOCUMENTS.sitePlan.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-300">A direct PDF download of the supplied site-plan document.</p>
          </div>
          <a
            href={PROJECT_DOCUMENTS.sitePlan.url}
            download={PROJECT_DOCUMENTS.sitePlan.fileName}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {PROJECT_DOCUMENTS.sitePlan.actionLabel}
          </a>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 shadow-xs lg:col-span-7 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <LayoutTemplate className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">Floor-plan set</div>
              <h3 className="font-serif text-xl text-stone-900">Five supplied plan documents</h3>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PROJECT_DOCUMENTS.floorPlans.map((document) => (
              <article key={document.id} className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5">
                <div>
                  <FileText className="h-5 w-5 text-amber-700" aria-hidden="true" />
                  <h4 className="mt-3 text-sm font-semibold leading-snug text-stone-900">{document.title}</h4>
                  <p className="mt-1 text-[11px] text-stone-500">Supplied PDF</p>
                </div>
                <div className="mt-5">
                  <DownloadButton document={document} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50 p-5 sm:flex-row">
        <p className="text-center text-xs leading-relaxed text-stone-600 sm:text-left">
          Need help understanding which supplied plan document applies to your enquiry?
        </p>
        <button
          type="button"
          onClick={(event) => onOpenEnquiry('General enquiry about booking a flat', event.currentTarget, 'Floor plans section')}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-stone-900 px-5 py-3 text-xs font-semibold text-white transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/30 sm:w-auto"
        >
          <MessageSquareText className="h-4 w-4 text-amber-400" aria-hidden="true" />
          Ask About the Plans
        </button>
      </div>
    </div>
  </section>
);
