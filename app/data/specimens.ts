// Type definitions for LIVE ARCHIVE specimens on /exotics.
//
// Shaped to drop into a future Shopify product/metaobject without a
// rewrite: `status` maps to a metafield or metaobject field, `price` and
// `availability` are dynamic values (currently editable placeholders since
// no live-animal commerce exists yet), and `coverImage` / `gallery` map to
// Shopify media.
//
// The actual data lives in app/data/specimens.json, managed through the
// /admin/exotics CMS (see app/lib/specimens.server.ts) rather than hardcoded
// here -- this file only defines the shape.

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
