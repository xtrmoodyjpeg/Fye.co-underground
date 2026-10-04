// Reads the "Meet The Fam" animal profiles on /exotics as Shopify
// Metaobjects (type "fye_animal") via the Storefront API. Creating/editing/
// deleting animal profiles happens natively in Shopify Admin > Content >
// Metaobjects > FYE Animal -- this file is read-only.
import type {AnimalCategory, AnimalProfile, AnimalStatus} from '~/data/animalContent';

const TYPE = 'fye_animal';

const CATEGORY_VALUES: AnimalCategory[] = [
  'Amphibian',
  'Lizard',
  'Snake',
  'Invertebrate',
];
const STATUS_VALUES: AnimalStatus[] = [
  'Coming Soon',
  'In Our Care',
  'Breeding Project',
];

interface RawField {
  key: string;
  value: string | null;
  references: {nodes: Array<{image?: {url: string}}>} | null;
}
interface RawMetaobject {
  handle: string;
  fields: RawField[];
}

function toAnimal(raw: RawMetaobject): AnimalProfile {
  const map: Record<string, string> = {};
  const refs: Record<string, RawField> = {};
  for (const f of raw.fields) {
    map[f.key] = f.value ?? '';
    refs[f.key] = f;
  }

  const images = (refs.photoss?.references?.nodes ?? [])
    .map((n) => n.image?.url)
    .filter((url): url is string => Boolean(url));

  return {
    id: raw.handle,
    commonName: map.common_name || '',
    scientificName: map.scientific_name || null,
    category: (CATEGORY_VALUES.includes(map.animal_type as AnimalCategory)
      ? map.animal_type
      : 'Lizard') as AnimalCategory,
    status: (STATUS_VALUES.includes(map.status as AnimalStatus)
      ? map.status
      : 'Coming Soon') as AnimalStatus,
    sortOrder: Number(map.sort_order) || 0,
    location: map.native_range || '',
    lifestyle: map.lifestyle || '',
    behavior: map.behavior || null,
    diet: map.diet || null,
    lifespan: map.lifespan || null,
    funFact: map.fun_fact || null,
    breedingNote: map.fye_note || null,
    images,
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
    references(first: 10) { nodes { ... on MediaImage { image { url } } } }
  }
`;

export async function getAnimals(storefront: StorefrontClient): Promise<AnimalProfile[]> {
  try {
    const data = await storefront.query<{
      metaobjects: {nodes: RawMetaobject[]};
    }>(
      `query GetAnimals {
        metaobjects(type: "${TYPE}", first: 50) { nodes { ${STOREFRONT_FIELDS_SELECTION} } }
      }`,
    );
    return data.metaobjects.nodes
      .map(toAnimal)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return [];
  }
}
