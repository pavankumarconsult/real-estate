import { FormEvent, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Database, FileText, MapPin, MessageSquareText, X } from 'lucide-react';
import { Project, PROJECTS } from '../data/projects';
import { getEnquirySource, submitEnquiry } from '../services/enquiryService';
import { ENQUIRY_INTENTS, EnquiryIntent, EnquirySubmissionResult } from '../types/enquiry';

interface EnquiryModalProps {
  isOpen: boolean;
  project: Project;
  intent: EnquiryIntent;
  context?: string;
  returnFocusElement: HTMLElement | null;
  onClose: () => void;
  onSuccess: (result: EnquirySubmissionResult, projectId: string) => void;
}

interface FormErrors {
  name?: string;
  mobile?: string;
  email?: string;
  consent?: string;
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function EnquiryModal({ isOpen, project, intent, context, returnFocusElement, onClose, onSuccess }: EnquiryModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState(project.id);
  const [enquiryType, setEnquiryType] = useState<EnquiryIntent>(intent);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionError, setSubmissionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const idempotencyKeyRef = useRef('');

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setMobile('');
    setEmail('');
    setProjectId(project.id);
    setEnquiryType(ENQUIRY_INTENTS.includes(intent) ? intent : 'General enquiry about booking a flat');
    setConsent(false);
    setWebsite('');
    setErrors({});
    setSubmissionError('');
    setIsSubmitting(false);
    idempotencyKeyRef.current = crypto.randomUUID();
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
      const elements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
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
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) nextErrors.mobile = 'Enter a valid 10-digit Indian mobile number.';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Enter a valid email address or leave it blank.';
    if (!consent) nextErrors.consent = 'Please confirm that we may respond to this enquiry.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !validate()) return;

    setSubmissionError('');
    setIsSubmitting(true);

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
        website,
        source: getEnquirySource(),
      }, idempotencyKeyRef.current);
      onSuccess(result, selectedProject.id);
    } catch {
      setSubmissionError('We could not save your enquiry right now. Your details are still here—please try again.');
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
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="enquiry-dialog-title" aria-describedby="enquiry-dialog-description" className="relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl overflow-y-auto rounded-2xl bg-stone-50 shadow-2xl lg:grid-cols-[0.82fr_1.25fr_0.93fr]">
          <button type="button" onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-stone-900/90 p-2 text-white shadow hover:bg-stone-700" aria-label="Close enquiry form">
            <X className="h-5 w-5" />
          </button>

          <aside className="order-2 border-t border-stone-200 bg-stone-100 p-6 lg:order-1 lg:border-r lg:border-t-0 lg:p-8">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-800">How it works</div>
            <h3 className="mt-2 font-serif text-2xl text-stone-900">Send your enquiry</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                [MessageSquareText, 'Enter your details and choose an enquiry type'],
                [Database, 'Your enquiry is saved securely after validation'],
                [CheckCircle2, 'A confirmation page appears after a successful save'],
              ].map(([Icon, label]) => (
                <div key={label as string} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3">
                  <div className="rounded-lg bg-amber-100 p-2 text-amber-800"><Icon className="h-5 w-5" /></div>
                  <span className="text-xs font-semibold leading-relaxed text-stone-700">{label as string}</span>
                </div>
              ))}
            </div>
          </aside>

          <section className="order-1 p-6 sm:p-8 lg:order-2 lg:p-9">
            <div className="pr-8">
              <div className="text-xs font-bold uppercase tracking-widest text-amber-800">Enquiry</div>
              <h2 id="enquiry-dialog-title" className="mt-2 font-serif text-3xl text-stone-950">{enquiryType}</h2>
              <p id="enquiry-dialog-description" className="mt-2 text-sm leading-relaxed text-stone-600">Submit your details for the Team4 Aria team to review. This does not confirm availability or an appointment.</p>
            </div>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
                {submissionError && (
                  <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-relaxed text-red-800">
                    {submissionError}
                  </div>
                )}
                <div>
                  <label htmlFor="enquiry-name" className="block text-xs font-semibold text-stone-700">Name *</label>
                  <input ref={nameInputRef} id="enquiry-name" type="text" autoComplete="name" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} aria-invalid={Boolean(errors.name)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20" />
                  {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="enquiry-mobile" className="block text-xs font-semibold text-stone-700">Indian mobile number *</label>
                  <div className="mt-1 flex"><span className="inline-flex items-center rounded-l-lg border border-r-0 border-stone-300 bg-stone-100 px-3 text-sm text-stone-600">+91</span><input id="enquiry-mobile" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} value={mobile} onChange={(event) => setMobile(event.target.value)} aria-invalid={Boolean(errors.mobile)} className="w-full rounded-r-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20" /></div>
                  {errors.mobile && <p className="mt-1 text-xs text-red-700">{errors.mobile}</p>}
                </div>
                <div>
                  <label htmlFor="enquiry-email" className="block text-xs font-semibold text-stone-700">Email <span className="font-normal text-stone-400">(optional)</span></label>
                  <input id="enquiry-email" type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20" />
                  {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div><label htmlFor="enquiry-project" className="block text-xs font-semibold text-stone-700">Interested project *</label><select id="enquiry-project" value={projectId} onChange={(event) => setProjectId(event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-700">{PROJECTS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
                  <div><label htmlFor="enquiry-type" className="block text-xs font-semibold text-stone-700">Enquiry type *</label><select id="enquiry-type" value={enquiryType} onChange={(event) => setEnquiryType(event.target.value as EnquiryIntent)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-700">{ENQUIRY_INTENTS.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                </div>
                {context && <p className="rounded-lg bg-stone-100 px-3 py-2 text-xs text-stone-600">Context: <span className="font-semibold text-stone-800">{context}</span></p>}
                <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="enquiry-website">Website</label>
                  <input id="enquiry-website" name="website" type="text" autoComplete="off" tabIndex={-1} value={website} onChange={(event) => setWebsite(event.target.value)} />
                </div>
                <div>
                  <label className="flex items-start gap-2.5 text-xs leading-relaxed text-stone-600"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} aria-invalid={Boolean(errors.consent)} className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-800 focus:ring-amber-700" /><span>I agree to be contacted about this enquiry using the details I provided.</span></label>
                  {errors.consent && <p className="mt-1 text-xs text-red-700">{errors.consent}</p>}
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-500">
                  {isSubmitting ? 'Saving enquiry…' : 'Submit Enquiry'}
                </button>
                <p className="text-center text-[11px] text-stone-500">Your details are saved only after the server confirms the submission.</p>
              </form>
          </section>

          <aside className="order-3 border-t border-stone-200 bg-stone-900 p-6 text-stone-100 lg:border-l lg:border-t-0 lg:p-8">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400">Project information</div>
            <h3 className="mt-2 font-serif text-2xl">{selectedProject.name}</h3>
            <div className="mt-6 space-y-5 text-sm">
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /><div><div className="font-semibold">{selectedProject.location.address}</div></div></div>
              <div className="flex items-start gap-3"><FileText className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /><div><div className="font-semibold">{selectedProject.overview.sizes}</div>{selectedProject.reraNumber && <div className="mt-1 text-xs text-stone-400">RERA No: {selectedProject.reraNumber}</div>}</div></div>
              <div className="text-xs leading-relaxed text-stone-400">Expected possession: {selectedProject.possessionDate}. This is not a guaranteed handover date.</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
