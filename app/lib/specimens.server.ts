// Reads/writes FYE.EXOTICS Live Archive specimens as Shopify Metaobjects
// (type "specimen") via the Admin API. See shopifyAdmin.server.ts for why
// this replaces the old local-sidecar approach.
import type {Specimen, SpecimenStatus} from '~/data/specimens';
import {
  adminGraphQL,
  uploadFileToShopify,
  type AdminEnv,
} from './shopifyAdmin.server';

const TYPE = 'specimen';

const STRING_FIELDS = [
  'scientificName',
  'species',
  'morph',
  'hatchDate',
  'age',
  'weight',
  'temperament',
  'feedingStatus',
  'diet',
  'healthNotes',
  'description',
  'price',
  'availability',
  'location',
] as const;

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

const FIELDS_SELECTION = `
  id
  handle
  fields {
    key
    value
    reference { ... on MediaImage { image { url } } }
    references(first: 10) { nodes { ... on MediaImage { image { url } } } }
  }
`;

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

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uniqueSlug(env: AdminEnv, base: string): Promise<string> {
  let slug = base;
  let i = 2;
  while (true) {
    const existing = await getSpecimen(env, slug);
    if (!existing) return slug;
    slug = `${base}-${i}`;
    i += 1;
  }
}

async function nextArchiveNumber(env: AdminEnv): Promise<string> {
  const specimens = await getSpecimens(env);
  const numbers = specimens
    .map((s) => Number(String(s.archiveNumber).replace(/\D/g, '')))
    .filter((n) => !Number.isNaN(n));
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `FX-${String(next).padStart(3, '0')}`;
}

function readFieldsFromFormData(formData: FormData) {
  const fields: Record<string, string> = {};
  for (const key of STRING_FIELDS) {
    fields[key] = String(formData.get(key) || '').trim();
  }
  const sex = String(formData.get('sex') || 'UNSEXED').toUpperCase();
  fields.sex = SEX_VALUES.includes(sex) ? sex : 'UNSEXED';
  const status = String(formData.get('status') || 'OBSERVATION').toUpperCase();
  fields.status = STATUS_VALUES.includes(status) ? status : 'OBSERVATION';
  fields.featured = formData.get('featured') === 'on' ? 'true' : 'false';
  fields.shippingAvailable =
    formData.get('shippingAvailable') === 'on' ? 'true' : 'false';
  fields.localPickupAvailable =
    formData.get('localPickupAvailable') === 'on' ? 'true' : 'false';
  return fields;
}

export async function getSpecimens(env: AdminEnv): Promise<Specimen[]> {
  try {
    const data = await adminGraphQL<{
      metaobjects: {nodes: RawMetaobject[]};
    }>(
      env,
      `query GetSpecimens {
        metaobjects(type: "${TYPE}", first: 50) { nodes { ${FIELDS_SELECTION} } }
      }`,
    );
    return data.metaobjects.nodes.map(toSpecimen);
  } catch {
    return [];
  }
}

export async function getSpecimen(
  env: AdminEnv,
  slug: string,
): Promise<Specimen | null> {
  const data = await adminGraphQL<{metaobjectByHandle: RawMetaobject | null}>(
    env,
    `query GetSpecimen($handle: MetaobjectHandleInput!) {
      metaobjectByHandle(handle: $handle) { ${FIELDS_SELECTION} }
    }`,
    {handle: {type: TYPE, handle: slug}},
  );
  return data.metaobjectByHandle ? toSpecimen(data.metaobjectByHandle) : null;
}

export async function createSpecimen(
  env: AdminEnv,
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const commonName = String(formData.get('commonName') || '').trim();
  if (!commonName) return {ok: false, error: 'Common name is required.'};

  const fields = readFieldsFromFormData(formData);
  const slug = await uniqueSlug(env, slugify(commonName));
  const archiveNumber = await nextArchiveNumber(env);

  const imageFile = formData.get('coverImage');
  let coverImageGid: string | null = null;
  if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
    coverImageGid = await uploadFileToShopify(env, imageFile);
  }

  const metaobjectFields = [
    {key: 'commonName', value: commonName},
    ...STRING_FIELDS.map((key) => ({key, value: fields[key]})),
    {key: 'sex', value: fields.sex},
    {key: 'status', value: fields.status},
    {key: 'featured', value: fields.featured},
    {key: 'shippingAvailable', value: fields.shippingAvailable},
    {key: 'localPickupAvailable', value: fields.localPickupAvailable},
    {key: 'archiveNumber', value: archiveNumber},
    {key: 'publishedAt', value: new Date().toISOString().slice(0, 10)},
  ];
  if (coverImageGid) {
    metaobjectFields.push({key: 'coverImage', value: coverImageGid});
    metaobjectFields.push({
      key: 'gallery',
      value: JSON.stringify([coverImageGid]),
    });
  }

  const result = await adminGraphQL<{
    metaobjectCreate: {
      metaobject: {id: string} | null;
      userErrors: Array<{field: string[]; message: string}>;
    };
  }>(
    env,
    `mutation CreateSpecimen($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject { id }
        userErrors { field message }
      }
    }`,
    {metaobject: {type: TYPE, handle: slug, fields: metaobjectFields}},
  );

  if (result.metaobjectCreate.userErrors.length) {
    return {
      ok: false,
      error: result.metaobjectCreate.userErrors.map((e) => e.message).join(', '),
    };
  }
  return {ok: true};
}

export async function updateSpecimen(
  env: AdminEnv,
  slug: string,
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const commonName = String(formData.get('commonName') || '').trim();
  if (!commonName) return {ok: false, error: 'Common name is required.'};

  const existing = await getSpecimen(env, slug);
  if (!existing) return {ok: false, error: 'Specimen not found.'};

  const fields = readFieldsFromFormData(formData);
  const imageFile = formData.get('coverImage');
  let coverImageGid: string | null = null;
  if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
    coverImageGid = await uploadFileToShopify(env, imageFile);
  }

  const metaobjectFields = [
    {key: 'commonName', value: commonName},
    ...STRING_FIELDS.map((key) => ({key, value: fields[key]})),
    {key: 'sex', value: fields.sex},
    {key: 'status', value: fields.status},
    {key: 'featured', value: fields.featured},
    {key: 'shippingAvailable', value: fields.shippingAvailable},
    {key: 'localPickupAvailable', value: fields.localPickupAvailable},
  ];
  if (coverImageGid) {
    metaobjectFields.push({key: 'coverImage', value: coverImageGid});
    metaobjectFields.push({
      key: 'gallery',
      value: JSON.stringify([coverImageGid]),
    });
  }

  const result = await adminGraphQL<{
    metaobjectUpdate: {
      metaobject: {id: string} | null;
      userErrors: Array<{field: string[]; message: string}>;
    };
  }>(
    env,
    `mutation UpdateSpecimen($id: ID!, $metaobject: MetaobjectUpdateInput!) {
      metaobjectUpdate(id: $id, metaobject: $metaobject) {
        metaobject { id }
        userErrors { field message }
      }
    }`,
    {id: existing.id, metaobject: {fields: metaobjectFields}},
  );

  if (result.metaobjectUpdate.userErrors.length) {
    return {
      ok: false,
      error: result.metaobjectUpdate.userErrors.map((e) => e.message).join(', '),
    };
  }
  return {ok: true};
}

export async function deleteSpecimen(
  env: AdminEnv,
  slug: string,
): Promise<{ok: boolean}> {
  const existing = await getSpecimen(env, slug);
  if (!existing) return {ok: true};
  await adminGraphQL(
    env,
    `mutation DeleteSpecimen($id: ID!) {
      metaobjectDelete(id: $id) { deletedId userErrors { message } }
    }`,
    {id: existing.id},
  );
  return {ok: true};
}
