// Photography archive metadata. Separate from `specimens` because a photo
// documents a moment (an expo table, a field observation), not necessarily
// a specimen that will ever be released -- these can outlive any one
// listing. Swap for a CMS/Shopify media query later.

export interface ArchivePhoto {
  id: string;
  title: string;
  slug: string;
  species: string;
  scientificName: string;
  caption: string;
  photographer: string;
  location: string;
  date: string;
  images: string[];
  featured: boolean;
  publishedAt: string;
}

export const archivePhotography: ArchivePhoto[] = [
  {
    id: 'archive-photo-001',
    title: 'Field Table, Reptile Expo',
    slug: 'field-table-reptile-expo',
    species: 'Python regius',
    scientificName: 'Python regius',
    caption: 'Documentation at a regional reptile exposition -- part research, part record.',
    photographer: 'FYE.EXOTICS field archive',
    location: 'Orlando, FL',
    date: '2026-09',
    images: ['/exotics/exotics-archive.webp'],
    featured: true,
    publishedAt: '2026-09-05',
  },
];
