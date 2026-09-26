// Type definitions for the "Meet The Fam" animal profiles on /exotics.
//
// The actual data lives in Shopify as Metaobjects (type "fye_animal"),
// managed through the /admin/animals CMS -- see
// app/lib/animalContent.server.ts for the Admin API reads/writes.
// This file only defines the shape.

export type AnimalCategory = 'Amphibian' | 'Lizard' | 'Snake' | 'Invertebrate';

export type AnimalStatus = 'Coming Soon' | 'In Our Care' | 'Breeding Project';

export interface AnimalProfile {
  id: string;
  commonName: string;
  scientificName: string | null;
  category: AnimalCategory;
  status: AnimalStatus;
  sortOrder: number;
  location: string;
  lifestyle: string;
  behavior: string | null;
  diet: string | null;
  lifespan: string | null;
  funFact: string | null;
  breedingNote: string | null;
  images: string[];
}
