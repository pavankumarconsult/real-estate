import { ArrowLeft, Building2, CheckCircle2, Phone } from 'lucide-react';
import { useEffect } from 'react';
import { getPhoneHref, SITE_CONFIG } from '../config/site';

export function ThankYouPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `Thank You | ${SITE_CONFIG.businessName}`;
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-stone-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5 font-serif text-xl font-semibold tracking-tight text-stone-900 hover:text-amber-800 sm:text-2xl">
            <Building2 className="h-6 w-6 text-amber-700" aria-hidden="true" />
            <span>{SITE_CONFIG.businessName}</span>
          </a>
          <a href={getPhoneHref()} className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-800">
            <Phone className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
            Call Now
          </a>
        </div>
      </header>

      <main className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </div>
          <div className="mt-7 text-xs font-bold uppercase tracking-widest text-amber-800">Enquiry received</div>
          <h1 className="mt-3 font-serif text-4xl font-normal tracking-tight text-stone-950 sm:text-5xl">Thank you for contacting Team4 Aria</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
            Your enquiry has been saved successfully. The Team4 Aria team can now review it and follow up with you.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-500">
            This confirmation does not guarantee availability or confirm a site-visit appointment.
          </p>
          <a href="/" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-stone-800">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Team4 Aria
          </a>
        </div>
      </main>
    </div>
  );
}
