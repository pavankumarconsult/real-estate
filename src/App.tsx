import { useCallback, useEffect, useRef, useState } from 'react';
import { PROJECTS, getProjectById } from './data/projects';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectPortfolioBar } from './components/ProjectPortfolioBar';
import { ProjectOverview } from './components/ProjectOverview';
import { FloorPlansSection } from './components/FloorPlansSection';
import { AmenitiesSection } from './components/AmenitiesSection';
import { LocationSection } from './components/LocationSection';
import { SpecificationsSection } from './components/SpecificationsSection';
import { SiteVisitSection } from './components/SiteVisitSection';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';
import { FloatingActions } from './components/FloatingActions';
import { EnquiryIntent, OpenEnquiryHandler } from './types/enquiry';

const ENQUIRY_SESSION_KEY = 'hyderabad-residences:enquiry-seen';

interface EnquiryState {
  projectId: string;
  intent: EnquiryIntent;
  context?: string;
}

export default function App() {
  const [currentProjectId, setCurrentProjectId] = useState<string>(PROJECTS[0].id);
  const [enquiryState, setEnquiryState] = useState<EnquiryState | null>(null);
  const enquiryTriggerRef = useRef<HTMLElement | null>(null);
  const autoOpenTimerRef = useRef<number | null>(null);
  const enquirySeenInMemoryRef = useRef(false);

  const currentProject = getProjectById(currentProjectId) || PROJECTS[0];

  const markEnquirySeen = () => {
    try {
      window.sessionStorage.setItem(ENQUIRY_SESSION_KEY, 'true');
    } catch {
      // The popup still works when storage is unavailable; only frequency memory is lost.
    }
  };

  const openEnquiry = useCallback<OpenEnquiryHandler>((intent, trigger = null, context) => {
    if (autoOpenTimerRef.current !== null) {
      window.clearTimeout(autoOpenTimerRef.current);
      autoOpenTimerRef.current = null;
    }
    markEnquirySeen();
    enquirySeenInMemoryRef.current = true;
    enquiryTriggerRef.current = trigger;
    setEnquiryState({ projectId: currentProjectId, intent, context });
  }, [currentProjectId]);

  const closeEnquiry = useCallback(() => {
    setEnquiryState(null);
  }, []);

  useEffect(() => {
    if (enquirySeenInMemoryRef.current) return;
    try {
      if (window.sessionStorage.getItem(ENQUIRY_SESSION_KEY)) {
        enquirySeenInMemoryRef.current = true;
        return;
      }
    } catch {
      // Continue with one auto-open attempt when storage access is unavailable.
    }

    autoOpenTimerRef.current = window.setTimeout(() => {
      markEnquirySeen();
      enquirySeenInMemoryRef.current = true;
      enquiryTriggerRef.current = null;
      setEnquiryState({ projectId: currentProjectId, intent: 'General enquiry' });
      autoOpenTimerRef.current = null;
    }, 1100);

    return () => {
      if (autoOpenTimerRef.current !== null) {
        window.clearTimeout(autoOpenTimerRef.current);
        autoOpenTimerRef.current = null;
      }
    };
  }, [currentProjectId]);

  const handleSelectProject = (projectId: string) => {
    setCurrentProjectId(projectId);
  };

  const enquiryProject = enquiryState
    ? getProjectById(enquiryState.projectId) ?? currentProject
    : currentProject;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-amber-900 selection:text-white font-sans text-stone-900">
      {/* 3-Zone Top Bar */}
      <Navbar
        currentProject={currentProject}
        onOpenEnquiry={openEnquiry}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          project={currentProject}
          onOpenEnquiry={openEnquiry}
        />

        {/* Portfolio Switcher (Data-driven: ready for multiple projects) */}
        <ProjectPortfolioBar
          currentProject={currentProject}
          onSelectProject={handleSelectProject}
        />

        {/* 01. Master Development Overview & Photo Gallery */}
        <ProjectOverview
          key={`overview-${currentProject.id}`}
          project={currentProject}
          onOpenEnquiry={openEnquiry}
        />

        {/* 02. Floor Plans Explorer & Cost Estimator */}
        <FloorPlansSection
          key={`floorplans-${currentProject.id}`}
          project={currentProject}
          onOpenEnquiry={openEnquiry}
        />

        {/* 03. World-Class Amenities & Elevated Sky Park */}
        <AmenitiesSection
          key={`amenities-${currentProject.id}`}
          project={currentProject}
          onOpenEnquiry={openEnquiry}
        />

        {/* 04. Location, Metro & Proximity Advantages */}
        <LocationSection
          key={`location-${currentProject.id}`}
          project={currentProject}
          onOpenEnquiry={openEnquiry}
        />

        {/* 05. Engineering & Technical Build Specifications */}
        <SpecificationsSection
          key={`specifications-${currentProject.id}`}
          specifications={currentProject.specifications}
        />

        {/* 06. Interactive Site Visit & Model Flat Experience Engine */}
        <SiteVisitSection
          key={`sitevisit-${currentProject.id}`}
          project={currentProject}
          onOpenEnquiry={openEnquiry}
        />
      </main>

      {/* Clean, Regulatory-Compliant Footer */}
      <Footer
        project={currentProject}
        onOpenEnquiry={openEnquiry}
      />
      <FloatingActions project={currentProject} onOpenEnquiry={openEnquiry} />
      <EnquiryModal
        isOpen={Boolean(enquiryState)}
        project={enquiryProject}
        intent={enquiryState?.intent ?? 'General enquiry'}
        context={enquiryState?.context}
        returnFocusElement={enquiryTriggerRef.current}
        onClose={closeEnquiry}
      />
    </div>
  );
}
