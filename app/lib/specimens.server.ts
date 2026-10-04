// Reads FYE.EXOTICS Live Archive specimens as Shopify Metaobjects (type
// "specimen") via the Storefront API. Creating/editing/deleting specimens
// happens natively in Shopify Admin > Content > Metaobjects > Specimen --
// this file is read-only.
import type {Specimen, SpecimenStatus} from '~/data/specimens';

const TYPE = 'specimen';

const SEX_VALUES = ['MALE', 'FEMALE', 'UNSEXED'];
const STATUS_VALUES = [
  'ARCHIVED',
  'OBSERVATION',
  'COMING SOON',
  'AVAILABLE',
  'RESERVED',
  'SOLD',
  'NOT FOR SALE',
];

interface RawField {
  key: string;
  value: string | null;
  reference: {image?: {url: string}} | null;
  references: {nodes: Array<{image?: {url: string}}>} | null;
}
interface RawMetaobject {
  id: string;
  handle: string;
  fields: RawField[];
}

function toSpecimen(raw: RawMetaobject): Specimen {
  const map: Record<string, string> = {};
  const refs: Record<string, RawField> = {};
  for (const f of raw.fields) {
    map[f.key] = f.value ?? '';
    refs[f.key] = f;
  }

  const coverImage = refs.coverImage?.reference?.image?.url ?? '';
  const gallery = (refs.gallery?.references?.nodes ?? [])
    .map((n) => n.image?.url)
    .filter((url): url is string => Boolean(url));

  return {
    id: raw.id,
    slug: raw.handle,
    archiveNumber: map.archiveNumber || '',
    commonName: map.commonName || '',
    scientificName: map.scientificName || '',
    species: map.species || '',
    morph: map.morph || '',
    sex: (SEX_VALUES.includes(map.sex) ? map.sex : 'UNSEXED') as Specimen['sex'],
    hatchDate: map.hatchDate || '',
    age: map.age || '',
    weight: map.weight || '',
    temperament: map.temperament || '',
    feedingStatus: map.feedingStatus || '',
    diet: map.diet || '',
    healthNotes: map.healthNotes || '',
    description: map.description || '',
    price: map.price || '',
    status: (STATUS_VALUES.includes(map.status)
      ? map.status
      : 'OBSERVATION') as SpecimenStatus,
    availability: map.availability || '',
    featured: map.featured === 'true',
    coverImage,
    gallery,
    video: null,
    location: map.location || '',
    shippingAvailable: map.shippingAvailable === 'true',
    localPickupAvailable: map.localPickupAvailable === 'true',
    publishedAt: map.publishedAt || '',
  };
}

interface StorefrontClient {
  query<T>(query: string, options?: {variables?: Record<string, unknown>}): Promise<T>;
}

const STOREFRONT_FIELDS_SELECTION = `
  handle
  fields {
    key
    value
    reference { ... on MediaImage { image { url } } }
    references(first: 10) { nodes { ... on MediaImage { image { url } } } }
  }
`;

export async function getSpecimens(storefront: StorefrontClient): Promise<Specimen[]> {
  try {
    const data = await storefront.query<{
      metaobjects: {nodes: RawMetaobject[]};
    }>(
      `query GetSpecimens {
        metaobjects(type: "${TYPE}", first: 50) { nodes { ${STOREFRONT_FIELDS_SELECTION} } }
      }`,
    );
    return data.metaobjects.nodes.map(toSpecimen);
  } catch {
    return [];
  }
}
