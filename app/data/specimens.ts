// Seed content for LIVE ARCHIVE on /exotics.
//
// Shaped to drop into a future Shopify product/metaobject without a rewrite:
// `status` maps to a metafield or metaobject field, `price` and
// `availability` are dynamic values (currently static placeholders since no
// live-animal commerce exists yet), and `coverImage` / `gallery` map to
// Shopify media. Swap the array below for a storefront.query() call later --
// SpecimenCard and SpecimenModal only consume this shape, not this file.

export type SpecimenStatus =
  | 'ARCHIVED'
  | 'OBSERVATION'
  | 'COMING SOON'
  | 'AVAILABLE'
  | 'RESERVED'
  | 'SOLD'
  | 'NOT FOR SALE';

export interface Specimen {
  id: string;
  slug: string;
  archiveNumber: string;
  commonName: string;
  scientificName: string;
  species: string;
  morph: string;
  sex: 'MALE' | 'FEMALE' | 'UNSEXED';
  hatchDate: string;
  age: string;
  weight: string;
  temperament: string;
  feedingStatus: string;
  diet: string;
  healthNotes: string;
  description: string;
  price: string;
  status: SpecimenStatus;
  availability: string;
  featured: boolean;
  coverImage: string;
  gallery: string[];
  video: string | null;
  location: string;
  shippingAvailable: boolean;
  localPickupAvailable: boolean;
  publishedAt: string;
}

export const specimens: Specimen[] = [
  {
    id: 'specimen-fx-001',
    slug: 'ball-python-fx-001',
    archiveNumber: 'FX-001',
    commonName: 'Ball Python',
    scientificName: 'Python regius',
    species: 'Python regius',
    morph: 'Normal / Wild Type',
    sex: 'UNSEXED',
    hatchDate: 'NOT RELEASED',
    age: 'JUVENILE',
    weight: 'NOT RELEASED',
    temperament: 'Docile, tends to curl defensively rather than strike.',
    feedingStatus: 'ESTABLISHED FEEDER',
    diet: 'Appropriately sized rodent prey',
    healthNotes: 'Visual inspection only -- full health record pending release.',
    description:
      'A ground-dwelling constrictor known for coiling into a tight ball when stressed. One of the most commonly kept python species due to its manageable size and temperament.',
    price: 'NOT RELEASED',
    status: 'COMING SOON',
    availability: 'COMING SOON',
    featured: true,
    coverImage: '/exotics/exotics-ball-python.webp',
    gallery: ['/exotics/exotics-ball-python.webp', '/exotics/exotics-python.webp'],
    video: null,
    location: 'Orlando, FL',
    shippingAvailable: false,
    localPickupAvailable: false,
    publishedAt: '2026-09-05',
  },
  {
    id: 'specimen-fx-002',
    slug: 'red-eyed-tree-frog-fx-002',
    archiveNumber: 'FX-002',
    commonName: 'Red-Eyed Tree Frog',
    scientificName: 'Agalychnis callidryas',
    species: 'Agalychnis callidryas',
    morph: 'Standard',
    sex: 'UNSEXED',
    hatchDate: 'NOT RELEASED',
    age: 'JUVENILE',
    weight: 'NOT RELEASED',
    temperament: 'Nocturnal, arboreal -- rarely handled, best observed.',
    feedingStatus: 'ESTABLISHED FEEDER',
    diet: 'Live insects (crickets, fruit flies)',
    healthNotes: 'Visual inspection only -- full health record pending release.',
    description:
      'An arboreal amphibian recognized by its vivid green body, orange feet, and signature red eyes. Requires high humidity and controlled arboreal habitat.',
    price: 'NOT RELEASED',
    status: 'OBSERVATION',
    availability: 'ARCHIVE PREVIEW',
    featured: false,
    coverImage: '/exotics/exotics-frog.webp',
    gallery: ['/exotics/exotics-frog.webp'],
    video: null,
    location: 'Orlando, FL',
    shippingAvailable: false,
    localPickupAvailable: false,
    publishedAt: '2026-09-05',
  },
  {
    id: 'specimen-fx-003',
    slug: 'veiled-chameleon-fx-003',
    archiveNumber: 'FX-003',
    commonName: 'Veiled Chameleon',
    scientificName: 'Chamaeleo calyptratus',
    species: 'Chamaeleo calyptratus',
    morph: 'Standard',
    sex: 'UNSEXED',
    hatchDate: 'NOT RELEASED',
    age: 'HATCHLING',
    weight: 'NOT RELEASED',
    temperament: 'Independent, territorial -- experienced keepers only.',
    feedingStatus: 'ESTABLISHED FEEDER',
    diet: 'Live insects, supplemented greens',
    healthNotes: 'Visual inspection only -- full health record pending release.',
    description:
      'Identified by the tall casque on its head and independently rotating eyes. Requires precise humidity, UVB, and a tall, ventilated enclosure.',
    price: 'NOT RELEASED',
    status: 'NOT FOR SALE',
    availability: 'DOCUMENTED ONLY',
    featured: false,
    coverImage: '/exotics/exotics-chameleon.webp',
    gallery: ['/exotics/exotics-chameleon.webp'],
    video: null,
    location: 'Orlando, FL',
    shippingAvailable: false,
    localPickupAvailable: false,
    publishedAt: '2026-09-05',
  },
];
