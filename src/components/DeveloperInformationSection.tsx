import { Project } from '../data/projects';

/** Renders only after the client supplies an approved developer identity. */
export function DeveloperInformationSection({ project }: { project: Project }) {
  if (!project.developer) return null;

  return (
    <section id="developer" className="scroll-mt-24 border-b border-stone-200 bg-stone-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-amber-800">Developer information</div>
        <h2 className="mt-2 font-serif text-3xl font-normal text-stone-900 sm:text-4xl">{project.developer}</h2>
      </div>
    </section>
  );
}
