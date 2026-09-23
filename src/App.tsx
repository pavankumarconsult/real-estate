import { useState } from 'react';
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

export default function App() {
  const [currentProjectId, setCurrentProjectId] = useState<string>(PROJECTS[0].id);
  const [preselectedPlan, setPreselectedPlan] = useState<string | undefined>(undefined);

  const currentProject = getProjectById(currentProjectId) || PROJECTS[0];

  const handleOpenSiteVisit = () => {
    const el = document.getElementById('sitevisit');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlanForVisit = (planName: string) => {
    setPreselectedPlan(planName);
    const el = document.getElementById('sitevisit');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    setPreselectedPlan(undefined);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-amber-900 selection:text-white font-sans text-stone-900">
      {/* 3-Zone Top Bar */}
      <Navbar
        currentProject={currentProject}
        onOpenSiteVisit={handleOpenSiteVisit}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          project={currentProject}
          onOpenSiteVisit={handleOpenSiteVisit}
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
          onOpenSiteVisit={handleOpenSiteVisit}
        />

        {/* 02. Floor Plans Explorer & Cost Estimator */}
        <FloorPlansSection
          key={`floorplans-${currentProject.id}`}
          project={currentProject}
          onSelectPlanForVisit={handleSelectPlanForVisit}
        />

        {/* 03. World-Class Amenities & Elevated Sky Park */}
        <AmenitiesSection
          key={`amenities-${currentProject.id}`}
          project={currentProject}
          onOpenSiteVisit={handleOpenSiteVisit}
        />

        {/* 04. Location, Metro & Proximity Advantages */}
        <LocationSection
          key={`location-${currentProject.id}`}
          project={currentProject}
          onOpenSiteVisit={handleOpenSiteVisit}
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
          preselectedPlan={preselectedPlan}
        />
      </main>

      {/* Clean, Regulatory-Compliant Footer */}
      <Footer
        project={currentProject}
        onOpenSiteVisit={handleOpenSiteVisit}
      />
    </div>
  );
}
