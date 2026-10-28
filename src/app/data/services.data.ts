export interface ServicePage {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  intro: string;
  applications: string[];
  process: string;
  /** Project photo served from /images (processed by scripts/prepare-images.sh). */
  image: string;
}

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: 'aluminium-windows-doors',
    name: 'Aluminium Windows and Doors',
    metaTitle: 'Aluminium Windows and Doors in Nairobi | AGL',
    metaDescription: 'AGL supplies and installs custom aluminium windows and doors in Nairobi and across Kenya for homes, offices and commercial buildings.',
    keywords: 'aluminium windows and doors in Nairobi; aluminium doors Kenya; aluminium windows Kenya',
    intro: 'AGL provides custom aluminium windows and doors in Nairobi for residential, office and commercial projects. Aluminium profiles offer a clean, modern appearance, dependable performance and a practical solution for a wide range of openings.',
    applications: [
      'Homes and apartments',
      'Offices and commercial buildings',
      'Schools, clinics and institutions',
      'Renovations and new developments'
    ],
    process: 'Our team measures each opening, confirms the design and finish, fabricates the frames, prepares the glass and completes the installation on site.',
    image: '/images/shopfront-glazing.jpg'
  },
  {
    slug: 'office-glass-partitioning',
    name: 'Office Glass Partitioning',
    metaTitle: 'Office Glass Partitioning in Kenya | AGL',
    metaDescription: 'Create brighter, more flexible workspaces with custom office glass partitioning in Kenya from AGL.',
    keywords: 'office glass partitioning in Kenya; office partitions Nairobi; frameless glass partitions Kenya',
    intro: 'AGL delivers office glass partitioning in Kenya for modern workplaces that need privacy, natural light and a clean professional appearance. We create partitions for meeting rooms, private offices, boardrooms, reception areas and open-plan workspaces.',
    applications: [
      'Frameless glass partitions',
      'Aluminium-framed glass partitions',
      'Meeting rooms and boardrooms',
      'Private offices and reception areas'
    ],
    process: 'We measure the site, discuss privacy and layout requirements, fabricate the panels and frames, then install the partitioning with careful attention to alignment and finish.',
    image: '/images/aluminium-frame-office-partitioning.jpg'
  },
  {
    slug: 'shower-cubicles',
    name: 'Shower Cubicles and Enclosures',
    metaTitle: 'Shower Cubicles in Nairobi | Custom Glass Enclosures | AGL',
    metaDescription: 'Order custom shower cubicles in Nairobi for homes, apartments, hotels and modern bathrooms. AGL handles measurement, fabrication and installation.',
    keywords: 'shower cubicles in Nairobi; glass shower enclosures Kenya; custom shower screens Nairobi',
    intro: 'AGL designs and installs shower cubicles in Nairobi and across Kenya. Our custom glass shower enclosures help define wet areas while maintaining a clean, open bathroom aesthetic.',
    applications: [
      'Homes and apartments',
      'Hotels and hospitality spaces',
      'Bathroom renovations',
      'Custom shower screens and enclosures'
    ],
    process: 'We take accurate measurements, confirm the opening and hardware, process the glass and install the completed enclosure for a neat, secure fit.',
    image: '/images/frameless-shower-cubicle.jpg'
  },
  {
    slug: 'curtain-walling',
    name: 'Curtain Walling',
    metaTitle: 'Curtain Walling Contractors in Kenya | AGL',
    metaDescription: 'AGL provides curtain walling solutions for commercial and corporate buildings in Nairobi and across Kenya.',
    keywords: 'curtain walling contractors in Kenya; commercial curtain walling Nairobi; aluminium curtain walling',
    intro: 'As curtain walling contractors in Kenya, AGL supports commercial and corporate projects with aluminium and glass façade solutions. Our team coordinates measurement, fabrication and installation to help create contemporary building envelopes.',
    applications: [
      'Commercial buildings',
      'Office developments',
      'Retail and hospitality projects',
      'Contemporary façades and entrances'
    ],
    process: 'We work with project teams to confirm site dimensions, details and finishes before fabrication and installation.',
    image: '/images/structural-facade.jpg'
  },
  {
    slug: 'glass-balustrades',
    name: 'Glass Balustrades',
    metaTitle: 'Glass Balustrades in Kenya | AGL',
    metaDescription: 'Improve the look and openness of staircases, balconies and walkways with custom glass balustrades in Kenya.',
    keywords: 'glass balustrades in Kenya; glass stair railings Nairobi; balcony glass balustrades',
    intro: 'AGL supplies and installs glass balustrades in Kenya for staircases, balconies, terraces and walkways. Glass balustrades provide protection while keeping views open and interiors visually light.',
    applications: [
      'Staircases and landings',
      'Balconies and terraces',
      'Commercial walkways',
      'Residential and hospitality projects'
    ],
    process: 'We measure the installation area, advise on suitable details, prepare the glass and install the balustrade with the selected supports, rails or hardware.',
    image: '/images/balustrade.jpg'
  },
  {
    slug: 'stainless-steel-railings',
    name: 'Stainless-Steel Railings',
    metaTitle: 'Stainless-Steel Railings in Kenya | AGL',
    metaDescription: 'Get durable stainless-steel railings in Kenya for staircases, balconies, walkways and commercial spaces.',
    keywords: 'stainless-steel railings in Kenya; stainless-steel handrails Nairobi; custom metal railings Kenya',
    intro: 'AGL fabricates and installs stainless-steel railings in Kenya for homes, offices, commercial buildings and public spaces. Our railings are designed for a clean appearance, everyday use and dependable performance.',
    applications: [
      'Staircase handrails',
      'Balcony and terrace railings',
      'Walkway and ramp railings',
      'Commercial and public spaces'
    ],
    process: 'Our team confirms dimensions and fixing points, fabricates the stainless-steel components and completes the installation on site.',
    image: '/images/stainless-steel-handrail.jpg'
  },
  {
    slug: 'custom-glass-fabrication',
    name: 'Custom Glass Fabrication',
    metaTitle: 'Custom Glass Fabrication in Nairobi | AGL',
    metaDescription: 'AGL provides custom glass fabrication in Nairobi for residential, office, retail and commercial projects.',
    keywords: 'custom glass fabrication Nairobi; processed glass Kenya; architectural glass Nairobi',
    intro: 'Our custom glass fabrication service supports projects that require a specific size, shape, finish or application. We work with homeowners, contractors, designers and businesses to create glass components that fit the space they are built for.',
    applications: [
      'Glass panels and screens',
      'Office and commercial interiors',
      'Custom architectural details',
      'Glass components for aluminium and steel systems'
    ],
    process: 'We confirm the design and dimensions, process the glass to the required specification and coordinate it with the relevant aluminium or stainless-steel components.',
    image: '/images/spider-fitted-glass-wall.jpg'
  }
];
