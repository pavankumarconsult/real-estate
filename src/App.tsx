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
import { FAQSection } from './components/FAQSection';
import { DeveloperInformationSection } from './components/DeveloperInformationSection';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';
import { FloatingActions } from './components/FloatingActions';
import { EnquiryIntent, OpenEnquiryHandler } from './types/enquiry';

const ENQUIRY_SESSION_KEY = 'medha-ventures:enquiry-seen';

interface EnquiryState {
  projectId: string;
  intent: EnquiryIntent;
  context?: string;
}

export default function App() {
  const [currentProjectId, setCurrentProjectId] = useState(PROJECTS[0].id);
  const [enquiryState, setEnquiryState] = useState<EnquiryState | null>(null);
  const enquiryTriggerRef = useRef<HTMLElement | null>(null);
  const autoOpenTimerRef = useRef<number | null>(null);
  const enquirySeenInMemoryRef = useRef(false);
  const currentProject = getProjectById(currentProjectId) || PROJECTS[0];

  const markEnquirySeen = () => {
    try {
      window.sessionStorage.setItem(ENQUIRY_SESSION_KEY, 'true');
    } catch {
      // Auto-open frequency memory is optional; visitor details are never stored.
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

  useEffect(() => {
    if (enquirySeenInMemoryRef.current) return;
    try {
      if (window.sessionStorage.getItem(ENQUIRY_SESSION_KEY)) {
        enquirySeenInMemoryRef.current = true;
        return;
      }
    } catch {
      // Continue with one auto-open attempt when session storage is unavailable.
    }
    autoOpenTimerRef.current = window.setTimeout(() => {
      markEnquirySeen();
      enquirySeenInMemoryRef.current = true;
      enquiryTriggerRef.current = null;
      setEnquiryState({ projectId: currentProjectId, intent: 'General enquiry' });
      autoOpenTimerRef.current = null;
    }, 1100);
    return () => {
      if (autoOpenTimerRef.current !== null) window.clearTimeout(autoOpenTimerRef.current);
    };
  }, [currentProjectId]);

  const enquiryProject = enquiryState ? getProjectById(enquiryState.projectId) ?? currentProject : currentProject;

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 selection:bg-amber-900 selection:text-white">
      <Navbar currentProject={currentProject} onOpenEnquiry={openEnquiry} />
      <main className="flex-1">
        <Hero project={currentProject} onOpenEnquiry={openEnquiry} />
        <ProjectPortfolioBar currentProject={currentProject} onSelectProject={setCurrentProjectId} />
        <ProjectOverview key={`overview-${currentProject.id}`} project={currentProject} onOpenEnquiry={openEnquiry} />
        {currentProject.floorPlans.length > 0 && <FloorPlansSection key={`floorplans-${currentProject.id}`} project={currentProject} onOpenEnquiry={openEnquiry} />}
        {currentProject.amenities.length > 0 && <AmenitiesSection key={`amenities-${currentProject.id}`} project={currentProject} onOpenEnquiry={openEnquiry} />}
        <LocationSection key={`location-${currentProject.id}`} project={currentProject} />
        {currentProject.specifications.length > 0 && <SpecificationsSection key={`specifications-${currentProject.id}`} specifications={currentProject.specifications} />}
        <DeveloperInformationSection project={currentProject} />
        <FAQSection project={currentProject} />
        <SiteVisitSection key={`sitevisit-${currentProject.id}`} project={currentProject} onOpenEnquiry={openEnquiry} />
      </main>
      <Footer project={currentProject} onOpenEnquiry={openEnquiry} />
      <FloatingActions project={currentProject} onOpenEnquiry={openEnquiry} />
      <EnquiryModal
        isOpen={Boolean(enquiryState)}
        project={enquiryProject}
        intent={enquiryState?.intent ?? 'General enquiry'}
        context={enquiryState?.context}
        returnFocusElement={enquiryTriggerRef.current}
        onClose={() => setEnquiryState(null)}
      />
    </div>
  );
}
