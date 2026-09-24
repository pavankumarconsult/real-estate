import brochureCover from '../assets/media/Screenshot 2026-09-24 122811.png';
import brochureStreetView from '../assets/media/Screenshot 2026-09-24 122823.png';
import brochureTowerElevation from '../assets/media/Screenshot 2026-09-24 122836.png';
import brochureAerialView from '../assets/media/Screenshot 2026-09-24 122849.png';
import brochureEntrance from '../assets/media/Screenshot 2026-09-24 122859.png';
import brochureModel from '../assets/media/Screenshot 2026-09-24 122911.png';
import brochureElevatedLiving from '../assets/media/Screenshot 2026-09-24 122923.png';
import brochureCourtyard from '../assets/media/Screenshot 2026-09-24 122936.png';
import brochureAmenitySpaces from '../assets/media/Screenshot 2026-09-24 122946.png';
import brochureClubhouse from '../assets/media/Screenshot 2026-09-24 123005.png';
import brochureSportsComplex from '../assets/media/Screenshot 2026-09-24 123025.png';
import brochureNightElevation from '../assets/media/Screenshot 2026-09-24 123038.png';

import brochurePdf from '../assets/media/Team 4 Lifespaces_Aria_Brochure_Compressed.pdf?url';
import sitePlanPdf from '../assets/media/GP2354-CD-MP-00-140 ( Site Plan with Full Balconies).pdf?url';
import planAdSinglePdf from '../assets/media/A & D Single balconies.pdf?url';
import planAriaCbFbPdf from '../assets/media/ARIA CB & FB .pdf?url';
import planBeFullPdf from '../assets/media/B & E Full Balconies.pdf?url';
import planBeSinglePdf from '../assets/media/B & E Single balconies.pdf?url';
import planCfSinglePdf from '../assets/media/C & F Single balconies.pdf?url';

export interface HeroSlide {
  src: string;
  positionClass: string;
}

export interface AmenityMedia {
  name: string;
  image: string;
  alt: string;
}

export interface GalleryMedia {
  url: string;
  caption: string;
  category: string;
}

export interface ProjectDocument {
  id: string;
  title: string;
  actionLabel: string;
  fileName: string;
  url: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  { src: brochureTowerElevation, positionClass: 'object-center' },
  { src: brochureAerialView, positionClass: 'object-center' },
  { src: brochureEntrance, positionClass: 'object-center' },
  { src: brochureElevatedLiving, positionClass: 'object-center' },
];

export const AMENITY_MEDIA: AmenityMedia[] = [
  { name: 'Landscaped Courtyard', image: brochureCourtyard, alt: 'Landscaped courtyard shown in the Team4 Aria brochure' },
  { name: 'Podium Amenity Spaces', image: brochureAmenitySpaces, alt: 'Podium amenity spaces shown in the Team4 Aria brochure' },
  { name: 'Clubhouse', image: brochureClubhouse, alt: 'Clubhouse and pool shown in the Team4 Aria brochure' },
  { name: 'Sports Complex', image: brochureSportsComplex, alt: 'Sports complex shown in the Team4 Aria brochure' },
];

export const PROJECT_GALLERY_MEDIA: GalleryMedia[] = [
  { url: brochureStreetView, caption: 'Project setting shown in the supplied brochure', category: 'Brochure visual' },
  { url: brochureModel, caption: 'Architectural model shown in the supplied brochure', category: 'Brochure visual' },
  { url: brochureNightElevation, caption: 'Night elevation shown in the supplied brochure', category: 'Brochure visual' },
  { url: brochureCover, caption: 'Team4 Aria brochure cover', category: 'Project identity' },
];

export const PROJECT_DOCUMENTS = {
  brochure: {
    id: 'project-brochure',
    title: 'Team4 Aria Brochure',
    actionLabel: 'Download Brochure',
    fileName: 'Team 4 Lifespaces_Aria_Brochure_Compressed.pdf',
    url: brochurePdf,
  },
  sitePlan: {
    id: 'site-plan-full-balconies',
    title: 'Site Plan with Full Balconies',
    actionLabel: 'Download Site Plan',
    fileName: 'GP2354-CD-MP-00-140 ( Site Plan with Full Balconies).pdf',
    url: sitePlanPdf,
  },
  floorPlans: [
    {
      id: 'plan-a-d-single-balconies',
      title: 'A & D — Single Balconies',
      actionLabel: 'Download A & D Plan',
      fileName: 'A & D Single balconies.pdf',
      url: planAdSinglePdf,
    },
    {
      id: 'plan-aria-cb-fb',
      title: 'ARIA CB & FB',
      actionLabel: 'Download ARIA CB & FB Plan',
      fileName: 'ARIA CB & FB .pdf',
      url: planAriaCbFbPdf,
    },
    {
      id: 'plan-b-e-full-balconies',
      title: 'B & E — Full Balconies',
      actionLabel: 'Download B & E Full Balconies Plan',
      fileName: 'B & E Full Balconies.pdf',
      url: planBeFullPdf,
    },
    {
      id: 'plan-b-e-single-balconies',
      title: 'B & E — Single Balconies',
      actionLabel: 'Download B & E Single Balconies Plan',
      fileName: 'B & E Single balconies.pdf',
      url: planBeSinglePdf,
    },
    {
      id: 'plan-c-f-single-balconies',
      title: 'C & F — Single Balconies',
      actionLabel: 'Download C & F Plan',
      fileName: 'C & F Single balconies.pdf',
      url: planCfSinglePdf,
    },
  ] satisfies ProjectDocument[],
} satisfies {
  brochure: ProjectDocument;
  sitePlan: ProjectDocument;
  floorPlans: ProjectDocument[];
};
