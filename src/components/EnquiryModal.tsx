import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  FileText,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  X,
} from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { Project, PROJECTS } from '../data/projects';
import { submitEnquiry } from '../services/enquiryService';
import { ENQUIRY_INTENTS, EnquiryIntent, EnquirySubmissionResult } from '../types/enquiry';

interface EnquiryModalProps {
  isOpen: boolean;
  project: Project;
  intent: EnquiryIntent;
  context?: string;
  returnFocusElement: HTMLElement | null;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  mobile?: string;
  email?: string;
  consent?: string;
  submit?: string;
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function EnquiryModal({
  isOpen,
  project,
  intent,
  context,
  returnFocusElement,
  onClose,
}: EnquiryModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState(project.id);
  const [enquiryType, setEnquiryType] = useState<EnquiryIntent>(intent);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<EnquirySubmissionResult | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setName('');
    setMobile('');
    setEmail('');
    setProjectId(project.id);
    setEnquiryType(intent);
    setConsent(false);
    setErrors({});
    setSubmissionResult(null);
  }, [isOpen, project.id, intent, context]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => nameInputRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (returnFocusElement?.isConnected) returnFocusElement.focus();
    };
  }, [isOpen, onClose, returnFocusElement]);

  if (!isOpen) return null;

  const selectedProject = PROJECTS.find((item) => item.id === projectId) ?? project;

  const validate = () => {
    const nextErrors: FormErrors = {};
    const cleanMobile = mobile.replace(/\D/g, '');

    if (name.trim().length < 2) nextErrors.name = 'Please enter your name.';
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      nextErrors.mobile = 'Enter a valid 10-digit Indian mobile number.';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address or leave it blank.';
    }
    if (!consent) nextErrors.consent = 'Please confirm that we may respond to this enquiry.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});
    try {
      const result = await submitEnquiry({
        name: name.trim(),
        mobile: mobile.replace(/\D/g, ''),
        email: email.trim() || undefined,
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        intent: enquiryType,
        context,
        consent: true,
      });
      setSubmissionResult(result);
    } catch {
      setErrors({
        submit: 'The enquiry could not be delivered. Please try again after the configured destination is checked.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="enquiry-backdrop"
      className="fixed inset-0 z-[70] overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-dialog-title"
          aria-describedby="enquiry-dialog-description"
          className="relative grid w-full max-w-5xl overflow-y-auto rounded-2xl bg-stone-50 shadow-2xl max-h-[calc(100dvh-1.5rem)] lg:grid-cols-[0.82fr_1.25fr_0.93fr]"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-stone-900/90 p-2 text-white shadow transition hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/50"
            aria-label="Close enquiry form"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <aside className="order-2 border-t border-stone-200 bg-stone-100 p-6 lg:order-1 lg:border-r lg:border-t-0 lg:p-8">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-800">Why enquire</div>
            <h3 className="mt-2 font-serif text-2xl text-stone-900">Plan with clear information</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                [MessageSquareText, 'Ask about current availability'],
                [FileText, 'Request approved cost details'],
                [CalendarDays, 'Discuss a convenient site visit'],
              ].map(([Icon, label]) => (
                <div key={label as string} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3">
                  <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-semibold leading-relaxed text-stone-700">{label as string}</span>
                </div>
              ))}
            </div>
          </aside>

          <section className="order-1 p-6 sm:p-8 lg:order-2 lg:p-9">
            <div className="pr-8">
              <div className="text-xs font-bold uppercase tracking-widest text-amber-800">Enquiry registration</div>
              <h2 id="enquiry-dialog-title" className="mt-2 font-serif text-3xl text-stone-950">
                {enquiryType}
              </h2>
              <p id="enquiry-dialog-description" className="mt-2 text-sm leading-relaxed text-stone-600">
                Ask about {selectedProject.name}. Submitting does not confirm availability, pricing, or an appointment.
              </p>
            </div>

            {submissionResult ? (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6" aria-live="polite">
                <CheckCircle2 className="h-8 w-8 text-amber-800" aria-hidden="true" />
                <h3 className="mt-3 font-serif text-xl text-stone-900">
                  {submissionResult.status === 'demo' ? 'Demo enquiry reviewed' : 'Enquiry delivered'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  {submissionResult.status === 'demo'
                    ? 'No data was sent or stored because an approved enquiry endpoint has not been configured.'
                    : 'Your enquiry reached the configured destination. This is not a booking confirmation; the project team must respond separately.'}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 rounded-lg bg-stone-900 px-5 py-3 text-xs font-semibold text-white transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40"
                >
                  Close enquiry
                </button>
              </div>
            ) : (
              <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="enquiry-name" className="block text-xs font-semibold text-stone-700">Name *</label>
                  <input
                    ref={nameInputRef}
                    id="enquiry-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                  />
                  {errors.name && <p id="enquiry-name-error" className="mt-1 text-xs text-red-700">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="enquiry-mobile" className="block text-xs font-semibold text-stone-700">Indian mobile number *</label>
                  <div className="mt-1 flex">
                    <span className="inline-flex items-center rounded-l-lg border border-r-0 border-stone-300 bg-stone-100 px-3 text-sm text-stone-600">+91</span>
                    <input
                      id="enquiry-mobile"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={14}
                      value={mobile}
                      onChange={(event) => setMobile(event.target.value)}
                      aria-invalid={Boolean(errors.mobile)}
                      aria-describedby={errors.mobile ? 'enquiry-mobile-error' : undefined}
                      className="w-full rounded-r-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                    />
                  </div>
                  {errors.mobile && <p id="enquiry-mobile-error" className="mt-1 text-xs text-red-700">{errors.mobile}</p>}
                </div>

                <div>
                  <label htmlFor="enquiry-email" className="block text-xs font-semibold text-stone-700">Email <span className="font-normal text-stone-400">(optional)</span></label>
                  <input
                    id="enquiry-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'enquiry-email-error' : undefined}
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                  />
                  {errors.email && <p id="enquiry-email-error" className="mt-1 text-xs text-red-700">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="enquiry-project" className="block text-xs font-semibold text-stone-700">Interested project *</label>
                    <select
                      id="enquiry-project"
                      value={projectId}
                      onChange={(event) => setProjectId(event.target.value)}
                      className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                    >
                      {PROJECTS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="enquiry-type" className="block text-xs font-semibold text-stone-700">Enquiry type *</label>
                    <select
                      id="enquiry-type"
                      value={enquiryType}
                      onChange={(event) => setEnquiryType(event.target.value as EnquiryIntent)}
                      className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                    >
                      {ENQUIRY_INTENTS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                </div>

                {context && (
                  <p className="rounded-lg bg-stone-100 px-3 py-2 text-xs text-stone-600">
                    Context: <span className="font-semibold text-stone-800">{context}</span>
                  </p>
                )}

                <div>
                  <label className="flex items-start gap-2.5 text-xs leading-relaxed text-stone-600">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? 'enquiry-consent-error' : undefined}
                      className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-800 focus:ring-amber-700"
                    />
                    <span>I agree to be contacted in response to this enquiry. This is not consent to unrelated marketing.</span>
                  </label>
                  {errors.consent && <p id="enquiry-consent-error" className="mt-1 text-xs text-red-700">{errors.consent}</p>}
                </div>

                {errors.submit && (
                  <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> {errors.submit}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40 disabled:cursor-wait disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending enquiry…' : SITE_CONFIG.enquiryDeliveryUrl ? 'Send enquiry' : 'Review demo enquiry'}
                </button>
                {!SITE_CONFIG.enquiryDeliveryUrl && (
                  <p className="text-center text-[11px] text-stone-500">Demo mode · No information will be transmitted or stored</p>
                )}
              </form>
            )}
          </section>

          <aside className="order-3 border-t border-stone-200 bg-stone-900 p-6 text-stone-100 lg:border-l lg:border-t-0 lg:p-8">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400">Project information</div>
            <h3 className="mt-2 font-serif text-2xl">{selectedProject.name}</h3>
            <div className="mt-6 space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                <div>
                  <div className="font-semibold">{selectedProject.location.area}, {selectedProject.location.city}</div>
                  <div className="mt-1 text-xs leading-relaxed text-stone-400">{selectedProject.location.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                <div>
                  <div className="font-semibold">{selectedProject.overview.unitTypes.join(' · ')}</div>
                  <div className="mt-1 text-xs text-stone-400">{selectedProject.overview.sizes}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                <div>
                  <div className="font-semibold">Supplied RERA reference</div>
                  <div className="mt-1 font-mono text-xs text-stone-400">{selectedProject.reraNumber}</div>
                </div>
              </div>
            </div>
            <div className="mt-7 border-t border-stone-700 pt-5 text-xs leading-relaxed text-stone-400">
              Information shown is supplied project data and should be independently verified before reliance.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
