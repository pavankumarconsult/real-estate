import React from 'react';
import { Project, PROJECTS } from '../data/projects';
import { Building, CheckCircle2, Sparkles } from 'lucide-react';

interface ProjectPortfolioBarProps {
  currentProject: Project;
  onSelectProject: (id: string) => void;
}

export const ProjectPortfolioBar: React.FC<ProjectPortfolioBarProps> = ({
  currentProject,
  onSelectProject,
}) => {
  return (
    <section className="border-b border-stone-200 bg-stone-100/70 py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Portfolio Context */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Portfolio Project:
            </span>
            <div className="flex items-center gap-2">
              {PROJECTS.map((proj) => {
                const isActive = proj.id === currentProject.id;
                return (
                  <button
                    key={proj.id}
                    onClick={() => onSelectProject(proj.id)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-stone-900 text-amber-300 shadow-sm'
                        : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-300/70'
                    }`}
                  >
                    <Building className="h-3.5 w-3.5" />
                    <span>{proj.name}</span>
                    {isActive && <CheckCircle2 className="h-3 w-3 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Architectural trust note */}
          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-stone-600">
              <Sparkles className="h-3.5 w-3.5 text-amber-700" />
              <span>Project Information Overview</span>
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="tabular-nums">Expected possession: {currentProject.possessionDate}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
