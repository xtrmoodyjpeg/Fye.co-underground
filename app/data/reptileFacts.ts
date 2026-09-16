// Seed content for the FACT FILES generator on /exotics.
//
// This is intentionally a plain data file, separate from the components that
// render it (FactGenerator / FactProgress). Swap `reptileFacts` below for a
// Shopify metaobject query, a headless CMS fetch, or any other data source
// later without touching the presentation layer -- every field a future
// backend would need (source, publish flag, featured flag) is already
// modeled here even though the current UI only uses a subset of them.

export interface ReptileFact {
  id: string;
  factNumber: number;
  headline: string;
  body: string;
  species: string;
  scientificName: string;
  category: 'senses' | 'defense' | 'physiology' | 'behavior' | 'anatomy';
  source: string;
  published: boolean;
  featured: boolean;
}

export const reptileFacts: ReptileFact[] = [
  {
    id: 'fact-001',
    factNumber: 1,
    headline: 'Heat in complete darkness.',
    body: 'Ball pythons use heat-sensitive pits around their mouths to detect warm-blooded prey in complete darkness.',
    species: 'Ball Python',
    scientificName: 'Python regius',
    category: 'senses',
    source: 'Herpetological field observation',
    published: true,
    featured: true,
  },
  {
    id: 'fact-002',
    factNumber: 2,
    headline: 'The replacement is never identical.',
    body: 'Geckos can detach their tails to escape predators, but the replacement tail may look different from the original.',
    species: 'Gecko (various species)',
    scientificName: 'Gekkota',
    category: 'defense',
    source: 'Herpetological field observation',
    published: true,
    featured: true,
  },
  {
    id: 'fact-003',
    factNumber: 3,
    headline: 'A body plan that outlasted extinction events.',
    body: 'Crocodilians have remained structurally similar for millions of years because their body plan is extremely effective.',
    species: 'Crocodilia',
    scientificName: 'Crocodylia',
    category: 'physiology',
    source: 'Herpetological field observation',
    published: true,
    featured: false,
  },
  {
    id: 'fact-004',
    factNumber: 4,
    headline: 'Drinking without a mouth.',
    body: 'Some reptiles can absorb moisture through specialized areas of their skin instead of drinking normally.',
    species: 'Various desert species',
    scientificName: 'Squamata',
    category: 'physiology',
    source: 'Herpetological field observation',
    published: true,
    featured: false,
  },
  {
    id: 'fact-005',
    factNumber: 5,
    headline: 'Scent, delivered to a second nose.',
    body: 'A snake’s tongue collects scent particles and delivers them to the Jacobson’s organ in the roof of its mouth.',
    species: 'Snakes (all species)',
    scientificName: 'Serpentes',
    category: 'senses',
    source: 'Herpetological field observation',
    published: true,
    featured: true,
  },
  {
    id: 'fact-006',
    factNumber: 6,
    headline: 'The habitat sets the metabolism.',
    body: 'Reptiles rely on external heat sources to regulate their body temperature, which makes habitat temperature essential.',
    species: 'Reptilia',
    scientificName: 'Reptilia',
    category: 'behavior',
    source: 'Herpetological field observation',
    published: true,
    featured: false,
  },
  {
    id: 'fact-007',
    factNumber: 7,
    headline: 'Color that reacts, not just decorates.',
    body: 'Chameleons shift color largely to communicate mood and regulate temperature -- camouflage is a secondary function, not the primary one.',
    species: 'Veiled Chameleon',
    scientificName: 'Chamaeleo calyptratus',
    category: 'behavior',
    source: 'Herpetological field observation',
    published: true,
    featured: false,
  },
  {
    id: 'fact-008',
    factNumber: 8,
    headline: 'Eyes that operate independently.',
    body: 'A chameleon’s eyes can move and focus independently of one another, giving it a near 360-degree field of view without turning its head.',
    species: 'Veiled Chameleon',
    scientificName: 'Chamaeleo calyptratus',
    category: 'anatomy',
    source: 'Herpetological field observation',
    published: true,
    featured: false,
  },
  {
    id: 'fact-009',
    factNumber: 9,
    headline: 'Transparent lower eyelids, permanently shut.',
    body: 'Snakes have no eyelids. A transparent scale called a brille covers and protects each eye, and it sheds along with the rest of the skin.',
    species: 'Snakes (all species)',
    scientificName: 'Serpentes',
    category: 'anatomy',
    source: 'Herpetological field observation',
    published: true,
    featured: false,
  },
  {
    id: 'fact-010',
    factNumber: 10,
    headline: 'Toe pads built from microscopic hairs.',
    body: 'Many gecko species can climb smooth vertical surfaces using millions of microscopic hair-like structures on their toe pads, not suction or adhesive.',
    species: 'Gecko (various species)',
    scientificName: 'Gekkota',
    category: 'anatomy',
    source: 'Herpetological field observation',
    published: true,
    featured: false,
  },
];
