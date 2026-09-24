import heroExterior from '../assets/images/hero_team4_aria_exterior_1790148691877.jpg';
import courtyardPark from '../assets/images/team4_aria_courtyard_park_1790148702470.jpg';
import clubhousePool from '../assets/images/team4_aria_clubhouse_pool_1790148718932.jpg';
import livingInterior from '../assets/images/team4_aria_living_interior_1790148733432.jpg';

export interface FloorPlan {
  id: string;
  name: string;
  type: '3 BHK' | '4 BHK';
  superBuiltUpArea: number;
  carpetArea: number;
  balconyArea: number;
  facing: 'East' | 'West' | 'North';
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  hasMaidRoom?: boolean;
  basePriceEstimate: string;
  dimensions: {
    living: string;
    dining: string;
    masterBedroom: string;
    bedroom2: string;
    bedroom3: string;
    bedroom4?: string;
    kitchen: string;
    balcony: string;
  };
  features: string[];
}

export interface Amenity {
  name: string;
  description: string;
  category: 'Wellness & Club' | 'Sports & Fitness' | 'Nature & Open Spaces' | 'Convenience & Security';
  tag?: string;
}

export interface Landmark {
  name: string;
  distance: string;
  travelTime: string;
  category: 'Transit' | 'IT Hub' | 'Education' | 'Healthcare' | 'Retail';
}

export interface ProjectSpecification {
  category: string;
  details: { label: string; value: string }[];
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  developer: string | null;
  reraNumber: string | null;
  status: string;
  possessionDate: string;
  priceStarting: string;
  pricePerSqFt: string;
  pricingVerified: boolean;
  pricingNotice: string;
  illustrativeRatePerSqFt: number | null;
  brochureUrl: string | null;
  location: { area: string; city: string; address: string; pincode: string };
  overview: {
    landParcel: string;
    towers: number;
    floors: string;
    openSpace: string;
    elevation: string;
    totalUnits: string;
    unitTypes: string[];
    sizes: string;
    ceilingHeight: string;
    mainDoorHeight: string;
    vaastu: string;
    description: string;
  };
  heroImage: string;
  galleryImages: { url: string; caption: string; category: string }[];
  keyHighlights: { title: string; subtitle: string; metric: string; metricLabel: string }[];
  amenities: Amenity[];
  floorPlans: FloorPlan[];
  connectivity: Landmark[];
  specifications: ProjectSpecification[];
  faqs: { question: string; answer: string }[];
}

/** Client-supplied content only. Unsupported reference claims stay absent. */
export const PROJECTS: Project[] = [
  {
    id: 'team4-aria',
    slug: 'team4-aria',
    name: 'Team4 Aria',
    tagline: 'Miyapur to Bachupally Road, opposite Nyla project',
    developer: null,
    reraNumber: null,
    status: 'Expected possession',
    possessionDate: '2029',
    priceStarting: 'Starting from ₹1.3 crore',
    pricePerSqFt: '',
    pricingVerified: true,
    pricingNotice: 'Starting price supplied by the client. Confirm current availability and the final cost before making a decision.',
    illustrativeRatePerSqFt: null,
    brochureUrl: null,
    location: {
      area: 'Miyapur to Bachupally Road',
      city: '',
      address: 'Miyapur to Bachupally Road, opposite Nyla project',
      pincode: '',
    },
    overview: {
      landParcel: '12.5 acres',
      towers: 7,
      floors: '48 floors',
      openSpace: '70%',
      elevation: '',
      totalUnits: '',
      unitTypes: [],
      sizes: '1,655–2,600 sq ft',
      ceilingHeight: '',
      mainDoorHeight: '',
      vaastu: '',
      description: 'Team4 Aria is located on Miyapur to Bachupally Road, opposite Nyla project. Client-supplied project details list 12.5 acres, 7 towers, 48 floors, 70% open space, residences from 1,655–2,600 sq ft, and expected possession in 2029.',
    },
    heroImage: heroExterior,
    galleryImages: [
      { url: heroExterior, caption: 'Team4 Aria project visual — usage approval required', category: 'Project visual' },
      { url: courtyardPark, caption: 'Team4 Aria project visual — usage approval required', category: 'Project visual' },
      { url: clubhousePool, caption: 'Team4 Aria project visual — usage approval required', category: 'Project visual' },
      { url: livingInterior, caption: 'Team4 Aria project visual — usage approval required', category: 'Project visual' },
    ],
    keyHighlights: [
      { title: 'Land area', subtitle: 'Client-supplied project detail', metric: '12.5', metricLabel: 'Acres' },
      { title: 'Project towers', subtitle: 'Client-supplied project detail', metric: '7', metricLabel: 'Towers' },
      { title: 'Building height', subtitle: 'Client-supplied project detail', metric: '48', metricLabel: 'Floors' },
      { title: 'Open space', subtitle: 'Client-supplied project detail', metric: '70', metricLabel: 'Percent' },
    ],
    amenities: [],
    floorPlans: [],
    connectivity: [],
    specifications: [],
    faqs: [
      { question: 'Where is Team4 Aria located?', answer: 'The client-supplied location is Miyapur to Bachupally Road, opposite Nyla project.' },
      { question: 'What size range is available?', answer: 'The client-supplied size range is 1,655–2,600 sq ft. An area type has not been specified.' },
      { question: 'What is the starting price?', answer: 'Pricing starts from ₹1.3 crore. Please call to confirm current availability and the final cost.' },
      { question: 'When is possession expected?', answer: 'Expected possession is 2029. This is an expectation, not a guaranteed handover date.' },
      { question: 'How can I arrange a site visit?', answer: 'Call +91 80568 85347 or continue through the enquiry form to WhatsApp. In WhatsApp, review the message and press Send.' },
    ],
  },
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id || project.slug === id);
}
