import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
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
import { ThankYouPage } from './components/ThankYouPage';
import { EnquiryIntent, OpenEnquiryHandler } from './types/enquiry';

const ENQUIRY_SESSION_KEY = 'team4-aria:enquiry-seen';
const AdminPortal = lazy(() => import('./admin/AdminPortal'));

interface EnquiryState {
  projectId: string;
  intent: EnquiryIntent;
  context?: string;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
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
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (currentPath !== '/') return;
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
  }, [currentPath, currentProjectId]);

  const handleEnquirySuccess = useCallback((_result: { referenceId: string }, projectId: string) => {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: 'lead_form_success',
      project_id: projectId,
    });
    setEnquiryState(null);
    window.history.pushState({}, '', '/thank-you');
    setCurrentPath('/thank-you');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const navigate = useCallback((path: string, replace = false) => {
    if (replace) window.history.replaceState({}, '', path);
    else window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const enquiryProject = enquiryState ? getProjectById(enquiryState.projectId) ?? currentProject : currentProject;

  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#fff8f5] text-sm text-[#635d5c]">Loading admin…</div>}>
        <AdminPortal currentPath={currentPath} onNavigate={navigate} />
      </Suspense>
    );
  }

  if (currentPath === '/thank-you') {
    return <ThankYouPage />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 selection:bg-amber-900 selection:text-white">
      <Navbar currentProject={currentProject} onOpenEnquiry={openEnquiry} />
      <main className="flex-1">
        <Hero project={currentProject} onOpenEnquiry={openEnquiry} />
        <ProjectPortfolioBar currentProject={currentProject} onSelectProject={setCurrentProjectId} />
        <ProjectOverview key={`overview-${currentProject.id}`} project={currentProject} onOpenEnquiry={openEnquiry} />
        <FloorPlansSection key={`floorplans-${currentProject.id}`} project={currentProject} onOpenEnquiry={openEnquiry} />
        <AmenitiesSection key={`amenities-${currentProject.id}`} project={currentProject} onOpenEnquiry={openEnquiry} />
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
        onSuccess={handleEnquirySuccess}
      />
    </div>
  );
}
