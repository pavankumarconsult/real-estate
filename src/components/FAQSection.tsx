import { Project } from '../data/projects';

export function FAQSection({ project }: { project: Project }) {
  if (!project.faqs.length) return null;

  return (
    <section id="faq" className="scroll-mt-24 border-b border-stone-200 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">03. Frequently Asked Questions</div>
          <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-stone-900 sm:text-4xl">Team4 Aria essentials</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {project.faqs.map((faq) => (
            <details key={faq.question} className="group rounded-xl border border-stone-200 bg-stone-50 p-5 open:border-amber-300">
              <summary className="cursor-pointer list-none pr-6 text-sm font-semibold text-stone-900">{faq.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

