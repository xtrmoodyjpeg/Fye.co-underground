// Reads/writes the "Meet The Fam" animal profiles on /exotics as Shopify
// Metaobjects (type "fye_animal") via the Admin API. See
// shopifyAdmin.server.ts for the shared client these calls run through.
import type {AnimalCategory, AnimalProfile, AnimalStatus} from '~/data/animalContent';
import {
  adminGraphQL,
  uploadFileToShopify,
  type AdminEnv,
} from './shopifyAdmin.server';

const TYPE = 'fye_animal';

const STRING_FIELDS = [
  'scientific_name',
  'native_range',
  'lifestyle',
  'behavior',
  'diet',
  'lifespan',
  'fun_fact',
  'fye_note',
] as const;

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

const FIELDS_SELECTION = `
  id
  handle
  fields {
    key
    value
    references(first: 10) { nodes { ... on MediaImage { image { url } } } }
  }
`;

interface RawField {
  key: string;
  value: string | null;
  references: {nodes: Array<{image?: {url: string}}>} | null;
}
interface RawMetaobject {
  id: string;
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

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uniqueHandle(env: AdminEnv, base: string): Promise<string> {
  let handle = base;
  let i = 2;
  while (true) {
    const existing = await getAnimal(env, handle);
    if (!existing) return handle;
    handle = `${base}-${i}`;
    i += 1;
  }
}

async function nextSortOrder(env: AdminEnv): Promise<number> {
  const data = await adminGraphQL<{
    metaobjects: {nodes: Array<{fields: Array<{key: string; value: string | null}>}>};
  }>(
    env,
    `query NextSortOrder {
      metaobjects(type: "${TYPE}", first: 50) {
        nodes { fields { key value } }
      }
    }`,
  );
  const max = data.metaobjects.nodes.reduce((m, node) => {
    const value = node.fields.find((f) => f.key === 'sort_order')?.value;
    return Math.max(m, Number(value) || 0);
  }, 0);
  return max + 1;
}

function readFieldsFromFormData(formData: FormData) {
  const fields: Record<string, string> = {};
  for (const key of STRING_FIELDS) {
    fields[key] = String(formData.get(key) || '').trim();
  }
  const animalType = String(formData.get('animal_type') || 'Lizard');
  fields.animal_type = CATEGORY_VALUES.includes(animalType as AnimalCategory)
    ? animalType
    : 'Lizard';
  const status = String(formData.get('status') || 'Coming Soon');
  fields.status = STATUS_VALUES.includes(status as AnimalStatus)
    ? status
    : 'Coming Soon';
  return fields;
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

// Reads go through the Storefront API instead of the Admin API: the
// fye_animal metaobject definition has Storefront API access enabled
// (unlike specimen/banner_config/client_cam_submission), so these public
// cards keep working even when PRIVATE_ADMIN_API_TOKEN is unset or
// invalid. Writes (create/update/delete below) still require the Admin
// API -- the /admin/animals CMS needs a working admin token regardless.
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

export async function getAnimal(
  env: AdminEnv,
  handle: string,
): Promise<AnimalProfile | null> {
  const data = await adminGraphQL<{metaobjectByHandle: RawMetaobject | null}>(
    env,
    `query GetAnimal($handle: MetaobjectHandleInput!) {
      metaobjectByHandle(handle: $handle) { ${FIELDS_SELECTION} }
    }`,
    {handle: {type: TYPE, handle}},
  );
  return data.metaobjectByHandle ? toAnimal(data.metaobjectByHandle) : null;
}

export async function createAnimal(
  env: AdminEnv,
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const commonName = String(formData.get('common_name') || '').trim();
  if (!commonName) return {ok: false, error: 'Common name is required.'};

  const fields = readFieldsFromFormData(formData);
  const handle = await uniqueHandle(env, slugify(commonName));
  const sortOrder = await nextSortOrder(env);

  const imageFile = formData.get('photoss');
  let imageGid: string | null = null;
  if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
    imageGid = await uploadFileToShopify(env, imageFile);
  }

  const metaobjectFields = [
    {key: 'common_name', value: commonName},
    ...STRING_FIELDS.map((key) => ({key, value: fields[key]})),
    {key: 'animal_type', value: fields.animal_type},
    {key: 'status', value: fields.status},
    {key: 'sort_order', value: String(sortOrder)},
  ];
  if (imageGid) {
    metaobjectFields.push({key: 'photoss', value: JSON.stringify([imageGid])});
  }

  const result = await adminGraphQL<{
    metaobjectCreate: {
      metaobject: {id: string} | null;
      userErrors: Array<{field: string[]; message: string}>;
    };
  }>(
    env,
    `mutation CreateAnimal($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject { id }
        userErrors { field message }
      }
    }`,
    {metaobject: {type: TYPE, handle, fields: metaobjectFields}},
  );

  if (result.metaobjectCreate.userErrors.length) {
    return {
      ok: false,
      error: result.metaobjectCreate.userErrors.map((e) => e.message).join(', '),
    };
  }
  return {ok: true};
}

export async function updateAnimal(
  env: AdminEnv,
  handle: string,
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const commonName = String(formData.get('common_name') || '').trim();
  if (!commonName) return {ok: false, error: 'Common name is required.'};

  const existing = await getAnimal(env, handle);
  if (!existing) return {ok: false, error: 'Animal not found.'};
  const id = await getAnimalId(env, handle);

  const fields = readFieldsFromFormData(formData);
  const sortOrderRaw = String(formData.get('sort_order') || '').trim();
  const sortOrder = sortOrderRaw ? Number(sortOrderRaw) : existing.sortOrder;

  const imageFile = formData.get('photoss');
  let imageGid: string | null = null;
  if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
    imageGid = await uploadFileToShopify(env, imageFile);
  }

  const metaobjectFields = [
    {key: 'common_name', value: commonName},
    ...STRING_FIELDS.map((key) => ({key, value: fields[key]})),
    {key: 'animal_type', value: fields.animal_type},
    {key: 'status', value: fields.status},
    {key: 'sort_order', value: String(sortOrder)},
  ];
  if (imageGid) {
    metaobjectFields.push({key: 'photoss', value: JSON.stringify([imageGid])});
  }

  const result = await adminGraphQL<{
    metaobjectUpdate: {
      metaobject: {id: string} | null;
      userErrors: Array<{field: string[]; message: string}>;
    };
  }>(
    env,
    `mutation UpdateAnimal($id: ID!, $metaobject: MetaobjectUpdateInput!) {
      metaobjectUpdate(id: $id, metaobject: $metaobject) {
        metaobject { id }
        userErrors { field message }
      }
    }`,
    {id, metaobject: {fields: metaobjectFields}},
  );

  if (result.metaobjectUpdate.userErrors.length) {
    return {
      ok: false,
      error: result.metaobjectUpdate.userErrors.map((e) => e.message).join(', '),
    };
  }
  return {ok: true};
}

async function getAnimalId(env: AdminEnv, handle: string): Promise<string> {
  const data = await adminGraphQL<{
    metaobjectByHandle: {id: string} | null;
  }>(
    env,
    `query GetAnimalId($handle: MetaobjectHandleInput!) {
      metaobjectByHandle(handle: $handle) { id }
    }`,
    {handle: {type: TYPE, handle}},
  );
  if (!data.metaobjectByHandle) throw new Error('Animal not found.');
  return data.metaobjectByHandle.id;
}

export async function deleteAnimal(
  env: AdminEnv,
  handle: string,
): Promise<{ok: boolean}> {
  const id = await getAnimalId(env, handle).catch(() => null);
  if (!id) return {ok: true};
  await adminGraphQL(
    env,
    `mutation DeleteAnimal($id: ID!) {
      metaobjectDelete(id: $id) { deletedId userErrors { message } }
    }`,
    {id},
  );
  return {ok: true};
}
