// Type definitions for LIVE ARCHIVE specimens on /exotics.
//
// The actual data lives in Shopify as Metaobjects (type "specimen"),
// managed through the /admin/exotics CMS -- see app/lib/specimens.server.ts
// for the Admin API reads/writes. This file only defines the shape.

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
