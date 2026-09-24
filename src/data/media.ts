import slider1 from '../assets/images/slider1.jpg';
import slider2 from '../assets/images/slider2.jpg';
import slider3 from '../assets/media/slider3.webp';
import slider4 from '../assets/media/slider4.webp';

import grandClubhouse from '../assets/media/grandclubhouse.webp';
import swimmingPool from '../assets/media/swimmingpool.webp';
import landscapedGarden from '../assets/media/landscapedgarden.webp';
import gymnasium from '../assets/media/gymnasium.webp';
import joggingTrack from '../assets/media/joggingtrack.webp';
import yogaZone from '../assets/media/yogazone.webp';
import kidsPlayArea from '../assets/media/kidsplayarea.webp';
import indoorGamesArea from '../assets/media/indoorgamesarea.webp';
import amphitheatre from '../assets/media/amphitheatre.webp';
import centralCourtyard from '../assets/media/centralcourtyard.webp';
import tenBadmintonCourts from '../assets/media/tenbadmintoncourts.webp';
import olympicSizeSwimmingPools from '../assets/media/olympicsizeswimmingpools.webp';

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

export interface ProjectDocument {
  id: string;
  title: string;
  actionLabel: string;
  fileName: string;
  url: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  { src: slider1, positionClass: 'object-[52%_center] sm:object-center' },
  { src: slider2, positionClass: 'object-[58%_center] sm:object-center' },
  { src: slider3, positionClass: 'object-center' },
  { src: slider4, positionClass: 'object-center' },
];

export const AMENITY_MEDIA: AmenityMedia[] = [
  { name: 'Grand Clubhouse', image: grandClubhouse, alt: 'Grand Clubhouse at Team4 Aria' },
  { name: 'Swimming Pool', image: swimmingPool, alt: 'Swimming Pool at Team4 Aria' },
  { name: 'Landscaped Garden', image: landscapedGarden, alt: 'Landscaped Garden at Team4 Aria' },
  { name: 'Gymnasium', image: gymnasium, alt: 'Gymnasium at Team4 Aria' },
  { name: 'Jogging Track', image: joggingTrack, alt: 'Jogging Track at Team4 Aria' },
  { name: 'Yoga Zone', image: yogaZone, alt: 'Yoga Zone at Team4 Aria' },
  { name: 'Kids’ Play Area', image: kidsPlayArea, alt: 'Kids’ Play Area at Team4 Aria' },
  { name: 'Indoor Games Area', image: indoorGamesArea, alt: 'Indoor Games Area at Team4 Aria' },
  { name: 'Amphitheatre', image: amphitheatre, alt: 'Amphitheatre at Team4 Aria' },
  { name: 'Central Courtyard', image: centralCourtyard, alt: 'Central Courtyard at Team4 Aria' },
  { name: 'Ten Badminton Courts', image: tenBadmintonCourts, alt: 'Ten Badminton Courts at Team4 Aria' },
  { name: 'Olympic-size Swimming Pools', image: olympicSizeSwimmingPools, alt: 'Olympic-size Swimming Pools at Team4 Aria' },
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
