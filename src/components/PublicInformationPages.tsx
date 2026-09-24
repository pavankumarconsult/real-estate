import { ArrowLeft, Building2, Mail } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { SITE_CONFIG } from '../config/site';

interface PublicInformationPageProps {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}

const legalLinks = [
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
];

function PublicInformationPage({ title, lastUpdated, children }: PublicInformationPageProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | ${SITE_CONFIG.businessName}`;
    window.scrollTo({ top: 0, behavior: 'auto' });
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900 selection:bg-amber-900 selection:text-white">
      <header className="border-b border-stone-200 bg-stone-50">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5 font-serif text-xl font-semibold tracking-tight text-stone-900 transition hover:text-amber-800 sm:text-2xl">
            <Building2 className="h-6 w-6 shrink-0 text-amber-700" aria-hidden="true" />
            <span>{SITE_CONFIG.businessName}</span>
          </a>
          <a href="/" className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-amber-700 hover:text-amber-800 sm:px-4 sm:py-2.5">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to project
          </a>
        </div>
      </header>

      <main className="flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <article className="mx-auto max-w-3xl">
          <div className="border-b border-stone-200 pb-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Team4 Aria information</p>
            <h1 className="mt-3 font-serif text-4xl font-normal tracking-tight text-stone-950 sm:text-5xl">{title}</h1>
            {lastUpdated && <p className="mt-4 text-sm text-stone-500">Last updated: {lastUpdated}</p>}
          </div>
          <div className="space-y-8 py-8 text-[15px] leading-7 text-stone-700 sm:text-base sm:leading-8">
            {children}
          </div>
          <div className="border-t border-stone-200 pt-8">
            <a href="/" className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-stone-800">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Return to Team4 Aria
            </a>
          </div>
        </article>
      </main>

      <footer className="border-t border-stone-800 bg-stone-950 px-4 py-8 text-stone-400 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center text-xs sm:flex-row sm:text-left">
          <div>
            <p className="font-semibold text-stone-200">{SITE_CONFIG.businessName}</p>
            <a href={`mailto:${SITE_CONFIG.email}`} className="mt-1 inline-flex items-center gap-1.5 break-all transition hover:text-white">
              <Mail className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
              {SITE_CONFIG.email}
            </a>
          </div>
          <nav aria-label="Information pages" className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:justify-end">
            {legalLinks.map((link) => <a key={link.href} href={link.href} className="transition hover:text-white">{link.label}</a>)}
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl font-semibold text-stone-950 sm:text-3xl">{title}</h2>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

export function DisclaimerPage() {
  return (
    <PublicInformationPage title="Disclaimer">
      <p>This Team4 Aria landing page provides general project information and a way to submit an enquiry. It is for information and enquiry purposes only. It is not an offer, booking confirmation, or guarantee of any property, feature, specification, availability, or delivery date.</p>
      <p>Project information and brochure images are provided for reference and may be updated. Illustrations may show a proposed appearance. Please confirm current details, approved plans, availability, and applicable terms directly with the project&apos;s authorized representative before making a decision. Visitors may also verify project registration details through the relevant RERA authority.</p>
      <p>Submitting an enquiry does not create a purchase agreement or reserve a unit. Links to external websites are provided for convenience; their content and practices are controlled by their respective operators.</p>
    </PublicInformationPage>
  );
}

export function PrivacyPolicyPage() {
  return (
    <PublicInformationPage title="Privacy Policy" lastUpdated="24 September 2026">
      <p>This policy explains how personal information submitted through the Team4 Aria landing page is handled.</p>
      <Section title="Information we collect">
        <p>When you submit an enquiry, we collect the information you provide, such as your name, mobile number, optional email address, enquiry type, preferences, and message. We also record the submission time and limited technical information needed to operate and protect the form.</p>
      </Section>
      <Section title="How we use it">
        <p>The team managing this landing page uses your information to receive your enquiry, contact you about Team4 Aria, coordinate a response, and maintain an internal record of enquiries. Authorized team members can access submissions through a private admin panel.</p>
        <p>We may share your enquiry and contact details with the Team4 Aria project client or its authorized representatives so they can respond to you. We do not sell enquiry details.</p>
      </Section>
      <Section title="Website measurement">
        <p>The website uses Google Tag Manager. Tags configured through it may measure visits and successful enquiry submissions to help assess advertising performance. Enquiry tracking should not include your name, phone number, email address, or message.</p>
      </Section>
      <Section title="Storage and access">
        <p>Enquiries are stored using Firebase services. Access to the enquiry records is restricted to authorized personnel. We keep information only for as long as needed to handle enquiries and related records, subject to applicable requirements.</p>
      </Section>
      <Section title="Your requests">
        <p>To ask about your information, request a correction or deletion, or raise a privacy concern, contact <a href={`mailto:${SITE_CONFIG.email}`} className="font-semibold text-amber-800 underline decoration-amber-800/40 underline-offset-4 hover:text-amber-950">{SITE_CONFIG.email}</a>.</p>
        <p>We may update this policy when the website or its data practices change. The current version will be posted on this page.</p>
      </Section>
    </PublicInformationPage>
  );
}

export function TermsAndConditionsPage() {
  return (
    <PublicInformationPage title="Terms & Conditions" lastUpdated="24 September 2026">
      <p>These terms apply to your use of the Team4 Aria landing page.</p>
      <Section title="Website content">
        <p>Text, brochure images, logos, and other materials belong to their respective owners or licensors. You may view them for personal information about the project. Do not reproduce or distribute them without permission from the relevant owner.</p>
        <p>The information on this page may change. Please verify important project details with an authorized representative and the relevant official records before relying on them.</p>
      </Section>
      <Section title="Enquiries">
        <p>Please provide accurate information when submitting a form. Submission allows the team managing this page and the project&apos;s authorized representatives to contact you about your Team4 Aria enquiry. It does not guarantee availability, pricing, an appointment, or a property reservation. Our handling of your information is described in the <a href="/privacy-policy" className="font-semibold text-amber-800 underline decoration-amber-800/40 underline-offset-4 hover:text-amber-950">Privacy Policy</a>.</p>
      </Section>
      <Section title="Acceptable use">
        <p>Do not misuse the website, submit spam or false enquiries, attempt unauthorized access, or interfere with its operation.</p>
      </Section>
      <Section title="External links">
        <p>External websites, including map or messaging services, operate under their own terms and privacy practices.</p>
      </Section>
      <Section title="Changes to these terms">
        <p>We may update these terms by posting a revised version on this page. Your use of the website after an update is subject to the version then displayed. Applicable Indian law governs these terms.</p>
      </Section>
    </PublicInformationPage>
  );
}
