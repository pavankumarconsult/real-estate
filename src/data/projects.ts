export interface FloorPlan {
  id: string;
  name: string;
  type: '3 BHK' | '4 BHK';
  superBuiltUpArea: number; // sq ft
  carpetArea: number; // sq ft
  balconyArea: number; // sq ft
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
  developer: string;
  reraNumber: string;
  status: 'Under Construction' | 'Ready to Move' | 'Pre-Launch';
  possessionDate: string;
  priceStarting: string;
  pricePerSqFt: string;
  pricingVerified: boolean;
  pricingNotice: string;
  illustrativeRatePerSqFt: number | null;
  brochureUrl: string | null;
  location: {
    area: string;
    city: string;
    address: string;
    pincode: string;
  };
  overview: {
    landParcel: string;
    towers: number;
    floors: string;
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
  galleryImages: {
    url: string;
    caption: string;
    category: string;
  }[];
  keyHighlights: {
    title: string;
    subtitle: string;
    metric: string;
    metricLabel: string;
  }[];
  amenities: Amenity[];
  floorPlans: FloorPlan[];
  connectivity: Landmark[];
  specifications: ProjectSpecification[];
}

/**
 * MASTER PROJECTS DATABASE
 *
 * To add a new property project to this website, simply append a new Project object to this array.
 * The entire website (portfolio grid, project details, floor plans, and site visit booking) will
 * automatically populate and support the new project without requiring any other code changes.
 */
export const PROJECTS: Project[] = [
  {
    id: 'team4-aria',
    slug: 'team4-aria',
    name: 'Team4 ARIA',
    tagline: 'G+48 Floors of Sovereign High-Rise Luxury in Miyapur',
    developer: 'Team4 Life Spaces',
    reraNumber: 'P02400010543',
    status: 'Under Construction',
    possessionDate: 'December 2030 / Q1 2031',
    priceStarting: '₹1.65 Cr*',
    pricePerSqFt: '₹7,499 / sq.ft',
    pricingVerified: false,
    pricingNotice: 'Pricing shown in the supplied design is unconfirmed. Contact the developer for an approved cost sheet before making a decision.',
    illustrativeRatePerSqFt: 7499,
    brochureUrl: null,
    location: {
      area: 'Miyapur',
      city: 'Hyderabad',
      address: 'Near Miyapur X Roads & Metro Station, NH-65 corridor, Hyderabad',
      pincode: '500049'
    },
    overview: {
      landParcel: '12.5 Acres',
      towers: 7,
      floors: 'G + 48 Floors',
      elevation: '~220 Meters',
      totalUnits: '2,800 Exclusive Homes',
      unitTypes: ['3 BHK Luxury', '3 BHK + Maid', '4 BHK Grand'],
      sizes: '1,625 to 2,465 sq.ft',
      ceilingHeight: '10.5 ft (3.15m) Grand Clear Height',
      mainDoorHeight: '8 ft Designer Engineered Doors',
      vaastu: '100% Vaastu Compliant Orientations',
      description: 'Team4 ARIA stands as an iconic 48-storey residential landmark in Miyapur, Hyderabad. Spread across 12.5 acres of sovereign luxury, ARIA integrates 7 soaring towers with a 3.5-acre grand central courtyard, Hyderabad\'s largest 50-foot elevated sky park, and 2 exclusive clubhouses dedicated to wellness and championship sports.'
    },
    heroImage: heroExterior,
    galleryImages: [
      {
        url: heroExterior,
        caption: 'Architectural Skyline Facade at Dusk',
        category: 'Exterior'
      },
      {
        url: courtyardPark,
        caption: '3.5-Acre Central Courtyard & 50-Foot Elevated Sky Park',
        category: 'Landscape'
      },
      {
        url: clubhousePool,
        caption: 'Rooftop Sky Infinity Pool & Wellness Clubhouse',
        category: 'Amenities'
      },
      {
        url: livingInterior,
        caption: '10.5-Foot Ceiling Living Residence with Panoramic Deck',
        category: 'Interior'
      }
    ],
    keyHighlights: [
      {
        title: 'Master Land Parcel',
        subtitle: 'Unobstructed low-density high-rise living',
        metric: '12.5',
        metricLabel: 'Acres'
      },
      {
        title: 'Skyward Architecture',
        subtitle: '7 Soaring towers rising 220 meters into the skyline',
        metric: 'G+48',
        metricLabel: 'Storeys'
      },
      {
        title: 'Lush Central Podiums',
        subtitle: 'Expansive courtyard landscape with pedestrian priority',
        metric: '3.5',
        metricLabel: 'Acres Park'
      },
      {
        title: 'Sky-High Living Experience',
        subtitle: 'The largest elevated park elevated 50 feet above ground',
        metric: '50',
        metricLabel: 'Ft Sky Deck'
      }
    ],
    amenities: [
      {
        name: 'Dual Grand Clubhouses',
        description: 'Two independent clubhouses spanning over 100,000 sq.ft for fitness, private dining, banquets, and co-working.',
        category: 'Wellness & Club',
        tag: 'Featured'
      },
      {
        name: 'Rooftop Sky Infinity Pool',
        description: 'Breathtaking infinity swimming pool located on the upper terrace overlooking the western skyline.',
        category: 'Wellness & Club',
        tag: 'Sky Luxury'
      },
      {
        name: 'Olympic-Length Lap Pool',
        description: 'Full-spec competition lap pool on the podium level with heated children’s splash zones.',
        category: 'Wellness & Club'
      },
      {
        name: '10 International Badminton Courts',
        description: 'High-ceiling wooden indoor badminton courts built to BWF professional tournament standards.',
        category: 'Sports & Fitness',
        tag: 'Sports Hub'
      },
      {
        name: '6 Regulation Pickleball Courts',
        description: 'Dedicated outdoor tournament-grade pickleball courts with tournament floodlighting.',
        category: 'Sports & Fitness'
      },
      {
        name: 'Squash & Billiards Arena',
        description: 'Glass-back regulation squash courts and a private cue sports lounge with championship tables.',
        category: 'Sports & Fitness'
      },
      {
        name: '3.5-Acre Central Green Courtyard',
        description: 'Massive vehicular-free central park with dense native flora, sensory gardens, and water walls.',
        category: 'Nature & Open Spaces',
        tag: 'Central Lung'
      },
      {
        name: '50-Foot Elevated Sky Park',
        description: 'Hyderabad’s premier elevated aerial promenade linking recreational decks, yoga gazebos, and viewing verandas.',
        category: 'Nature & Open Spaces',
        tag: 'Signature'
      },
      {
        name: 'Private Screening Preview Theatre',
        description: 'Acoustically tuned 40-seat Dolby Atmos cinema for community screenings and family entertainment.',
        category: 'Convenience & Security'
      },
      {
        name: 'Executive Co-Working Suites',
        description: 'High-speed business lounge with ergonomic meeting pods, private phone booths, and conference rooms.',
        category: 'Convenience & Security'
      },
      {
        name: '5-Tier Intelligent Security System',
        description: 'Boom barrier RFID entry, continuous perimeter surveillance, biometric lobby access, and 24/7 patrolling.',
        category: 'Convenience & Security'
      },
      {
        name: 'Kids Creche & Adventure Play Arena',
        description: 'Safe rubberized play surfaces, interactive climbing structures, and an indoor supervised activity hub.',
        category: 'Sports & Fitness'
      }
    ],
    floorPlans: [
      {
        id: 'plan-3bhk-classic',
        name: '3 BHK Type A (Classic)',
        type: '3 BHK',
        superBuiltUpArea: 1625,
        carpetArea: 1145,
        balconyArea: 110,
        facing: 'East',
        bedrooms: 3,
        bathrooms: 3,
        balconies: 2,
        hasMaidRoom: false,
        basePriceEstimate: '₹1.65 Cr*',
        dimensions: {
          living: '17\'0" x 12\'6"',
          dining: '13\'6" x 11\'0"',
          masterBedroom: '15\'0" x 12\'0"',
          bedroom2: '13\'0" x 11\'6"',
          bedroom3: '12\'0" x 11\'0"',
          kitchen: '11\'0" x 8\'6"',
          balcony: '12\'6" x 5\'0"'
        },
        features: [
          'East-facing main door adhering to classical Vaastu geometry',
          'Expansive living room connecting directly to scenic balcony deck',
          'Zero corridor wastage maximizing effective usable carpet area',
          'Separate utility balcony space adjoining the modular kitchen'
        ]
      },
      {
        id: 'plan-3bhk-premium',
        name: '3 BHK Type B (Premium)',
        type: '3 BHK',
        superBuiltUpArea: 1850,
        carpetArea: 1310,
        balconyArea: 135,
        facing: 'West',
        bedrooms: 3,
        bathrooms: 3,
        balconies: 2,
        hasMaidRoom: false,
        basePriceEstimate: '₹1.88 Cr*',
        dimensions: {
          living: '19\'0" x 13\'6"',
          dining: '14\'6" x 12\'0"',
          masterBedroom: '16\'6" x 13\'0"',
          bedroom2: '14\'0" x 12\'0"',
          bedroom3: '13\'0" x 11\'6"',
          kitchen: '12\'0" x 9\'0"',
          balcony: '14\'0" x 5\'6"'
        },
        features: [
          'Generous master suite with dedicated walk-in wardrobe space',
          'Cross-ventilation between north-facing dining and west balcony',
          'Powder room arrangement for visiting guests',
          'Wide 5.5-foot deep sunset deck with unobstructed skyline vistas'
        ]
      },
      {
        id: 'plan-3bhk-maid',
        name: '3 BHK + Maid Suite (Elite)',
        type: '3 BHK',
        superBuiltUpArea: 2150,
        carpetArea: 1530,
        balconyArea: 160,
        facing: 'East',
        bedrooms: 3,
        bathrooms: 4,
        balconies: 3,
        hasMaidRoom: true,
        basePriceEstimate: '₹2.18 Cr*',
        dimensions: {
          living: '21\'6" x 14\'6"',
          dining: '16\'0" x 13\'0"',
          masterBedroom: '18\'0" x 14\'0"',
          bedroom2: '15\'0" x 12\'6"',
          bedroom3: '14\'0" x 12\'0"',
          kitchen: '13\'6" x 9\'6"',
          balcony: '16\'0" x 6\'0"'
        },
        features: [
          'Dedicated maid/helper room with private separate washroom entrance',
          'Grand 21-foot long living hall with double glazed sliding French doors',
          'Private master bedroom balcony overlooking the 3.5-acre central courtyard',
          'Extended wet-and-dry kitchen format with breakfast counter'
        ]
      },
      {
        id: 'plan-4bhk-grand',
        name: '4 BHK Grand Imperial',
        type: '4 BHK',
        superBuiltUpArea: 2465,
        carpetArea: 1775,
        balconyArea: 195,
        facing: 'North',
        bedrooms: 4,
        bathrooms: 4,
        balconies: 3,
        hasMaidRoom: true,
        basePriceEstimate: '₹2.52 Cr*',
        dimensions: {
          living: '24\'0" x 15\'6"',
          dining: '17\'6" x 13\'6"',
          masterBedroom: '19\'6" x 15\'0"',
          bedroom2: '16\'0" x 13\'0"',
          bedroom3: '14\'6" x 12\'6"',
          bedroom4: '13\'6" x 12\'0"',
          kitchen: '14\'6" x 10\'0"',
          balcony: '18\'0" x 6\'6"'
        },
        features: [
          'Sovereign corner unit configuration with 3 sides open panoramic ventilation',
          'Double-height ceiling volume sensation with 10.5 ft floor-to-slab clear height',
          'Luxury guest bedroom with en-suite bath and separate study nook',
          'Palatial master bath accommodating dual vanities and walk-in rain shower'
        ]
      }
    ],
    connectivity: [
      {
        name: 'Miyapur Metro Station (Red Line)',
        distance: '1.2 km',
        travelTime: '4 Mins',
        category: 'Transit'
      },
      {
        name: 'Miyapur X Roads / NH-65 Expressway',
        distance: '0.6 km',
        travelTime: '1 Min',
        category: 'Transit'
      },
      {
        name: 'Hitech City & Cyber Towers',
        distance: '11.5 km',
        travelTime: '18 Mins',
        category: 'IT Hub'
      },
      {
        name: 'Financial District & Gachibowli',
        distance: '14.2 km',
        travelTime: '20 Mins',
        category: 'IT Hub'
      },
      {
        name: 'Outer Ring Road (ORR) Interchange',
        distance: '6.5 km',
        travelTime: '8 Mins',
        category: 'Transit'
      },
      {
        name: 'Oakridge & Creek International Schools',
        distance: '3.8 km',
        travelTime: '7 Mins',
        category: 'Education'
      },
      {
        name: 'Kennedy High the Global School',
        distance: '4.2 km',
        travelTime: '9 Mins',
        category: 'Education'
      },
      {
        name: 'Lotus & SLG Multi-Specialty Hospitals',
        distance: '2.4 km',
        travelTime: '5 Mins',
        category: 'Healthcare'
      },
      {
        name: 'Lulu Mall & Nexus Mall Kukatpally',
        distance: '5.1 km',
        travelTime: '10 Mins',
        category: 'Retail'
      }
    ],
    specifications: [
      {
        category: 'Structure & Shell',
        details: [
          { label: 'Super Structure', value: 'RCC shear wall structure designed to withstand severe wind and seismic loads (Zone II compliant).' },
          { label: 'Ceiling Height', value: '10.5 ft (3.15 meters) floor-to-slab clearance for expansive airiness.' },
          { label: 'External Walls', value: 'Aerated concrete blocks / RCC monolithic walls with weather-proof exterior textured paint.' }
        ]
      },
      {
        category: 'Flooring & Finishes',
        details: [
          { label: 'Living & Dining', value: 'Imported large-format 1200mm x 1800mm glazed vitrified tiles / marble finish.' },
          { label: 'Master Bedroom', value: 'Laminated hardwood engineered flooring or premium acoustic vitrified tiles.' },
          { label: 'Balconies & Decks', value: 'Anti-skid wood-finish vitrified tiles with stainless steel & toughened glass railings.' }
        ]
      },
      {
        category: 'Doors & Windows',
        details: [
          { label: 'Main Entrance Door', value: '8 ft height teakwood frame with flush shutter finished with veneer and melamine polish, equipped with smart digital biometric lock.' },
          { label: 'Internal Doors', value: 'Engineered wood frame with modular flush shutter and premium brass/matte black hardware.' },
          { label: 'Windows', value: 'Heavy-duty UPVC sliding systems with toughened glass and integrated mosquito mesh track.' }
        ]
      },
      {
        category: 'Bathrooms & Sanitary',
        details: [
          { label: 'Sanitary Ware', value: 'Wall-hung water closets by Kohler / Toto or equivalent with concealed cistern.' },
          { label: 'CP Fittings', value: 'Single lever thermostatic diverters and rain shower heads by Grohe / Kohler.' },
          { label: 'Water Supply', value: 'Central pressurized hydro-pneumatic water supply system with 100% water softener treatment.' }
        ]
      }
    ]
  }
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id || p.slug === id);
}
import heroExterior from '../assets/images/hero_team4_aria_exterior_1790148691877.jpg';
import courtyardPark from '../assets/images/team4_aria_courtyard_park_1790148702470.jpg';
import clubhousePool from '../assets/images/team4_aria_clubhouse_pool_1790148718932.jpg';
import livingInterior from '../assets/images/team4_aria_living_interior_1790148733432.jpg';
