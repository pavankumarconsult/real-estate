import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, MapPin, MessageSquareText, Phone } from 'lucide-react';
import { SITE_CONFIG, getPhoneHref } from '../config/site';
import { Project } from '../data/projects';
import { HERO_SLIDES, PROJECT_DOCUMENTS } from '../data/media';
import { OpenEnquiryHandler } from '../types/enquiry';

interface HeroProps {
  project: Project;
  onOpenEnquiry: OpenEnquiryHandler;
}

const AUTOPLAY_DELAY_MS = 5000;

export const Hero: React.FC<HeroProps> = ({ project, onOpenEnquiry }) => {
  const heroRef = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isHoverPaused || isFocusPaused) return;

    const timerId = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [activeSlide, isFocusPaused, isHoverPaused, prefersReducedMotion, timerResetKey]);

  const selectSlide = (index: number) => {
    setActiveSlide((index + HERO_SLIDES.length) % HERO_SLIDES.length);
    setTimerResetKey((key) => key + 1);
  };

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (!heroRef.current?.contains(event.relatedTarget as Node | null)) {
      setIsFocusPaused(false);
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-stone-900 text-white"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${project.name} project images`}
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
      onFocusCapture={() => setIsFocusPaused(true)}
      onBlurCapture={handleBlur}
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {HERO_SLIDES.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${slide.positionClass} ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/45 via-transparent to-stone-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/75 via-stone-950/25 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-24 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-stone-300 sm:text-sm">
          <span className="flex items-center gap-1.5 text-amber-400">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {project.location.address}
          </span>
          <span aria-hidden="true" className="text-stone-500">·</span>
          <span>Expected possession: {project.possessionDate}</span>
        </div>

        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl font-normal leading-[1.15] tracking-tight text-stone-50 sm:text-5xl lg:text-6xl">
            {project.name}
          </h1>
          <p className="mt-4 font-serif text-xl font-light italic text-amber-200/90 sm:text-2xl">
            {project.tagline}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-200 sm:text-lg">
            {project.overview.sizes} · {project.overview.openSpace} open space
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={getPhoneHref()}
            className="group inline-flex items-center gap-2 rounded-lg bg-amber-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/30 transition-all hover:bg-amber-500 hover:shadow-xl active:scale-95"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span>Call Now</span>
            <span className="sr-only"> at {SITE_CONFIG.phoneDisplay}</span>
          </a>
          <button
            type="button"
            onClick={(event) => onOpenEnquiry('Site visit', event.currentTarget)}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300/50 bg-stone-950/45 px-5 py-3.5 text-sm font-medium text-stone-100 backdrop-blur-sm transition-colors hover:border-stone-100 hover:bg-stone-800/90 hover:text-white"
          >
            <MessageSquareText className="h-4 w-4" aria-hidden="true" />
            Send Enquiry
          </button>
          <a
            href={PROJECT_DOCUMENTS.brochure.url}
            download={PROJECT_DOCUMENTS.brochure.fileName}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-300/60 bg-amber-50/10 px-5 py-3.5 text-sm font-medium text-amber-100 backdrop-blur-sm transition-colors hover:border-amber-200 hover:bg-amber-100/15 hover:text-white"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {PROJECT_DOCUMENTS.brochure.actionLabel}
          </a>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6 border-t border-stone-700/80 pt-8 sm:grid-cols-4 lg:gap-8">
          {[
            [project.overview.landParcel, 'Land area'],
            [`${project.overview.towers} towers`, 'Project scale'],
            [project.overview.floors, 'Building height'],
            [project.overview.openSpace, 'Open space'],
          ].map(([value, label]) => (
            <div key={label}>
              <div className="font-serif text-2xl font-medium text-amber-400 sm:text-3xl">{value}</div>
              <div className="mt-1 text-xs font-medium text-stone-300">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-center gap-3 sm:justify-end" aria-label="Hero slideshow controls">
          <button
            type="button"
            onClick={() => selectSlide(activeSlide - 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-stone-950/45 text-white backdrop-blur-sm transition hover:border-white/70 hover:bg-stone-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Show previous image"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectSlide(index)}
                className="group flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label={`Show image ${index + 1} of ${HERO_SLIDES.length}`}
                aria-current={activeSlide === index ? 'true' : undefined}
              >
                <span className={`block h-2 rounded-full transition-all motion-reduce:transition-none ${activeSlide === index ? 'w-7 bg-amber-400' : 'w-2 bg-white/55 group-hover:bg-white/80'}`} />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => selectSlide(activeSlide + 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-stone-950/45 text-white backdrop-blur-sm transition hover:border-white/70 hover:bg-stone-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Show next image"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
