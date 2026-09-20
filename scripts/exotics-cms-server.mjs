// Standalone specimen-CMS backend for FYE.EXOTICS' Live Archive.
//
// Same reasoning as the apparel product CMS this is modeled on: MiniOxygen
// (the local Hydrogen dev/prod runtime) emulates Shopify's Oxygen worker
// sandbox, which has no filesystem access -- `node:fs` fails to even import
// there. So the actual specimens.json read/write has to live outside that
// sandbox, in a plain Node process. Hydrogen's loaders/actions reach it over
// plain HTTP (the same way they'd call any external API), which the worker
// sandbox fully supports.
//
// This is deliberately a content-management tool, not a storefront: live
// reptiles are never added to a cart or checked out here (see the brief this
// was built against -- inquiry-only until real compliant ecommerce exists).
import {createServer} from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = path.join(ROOT, 'app/data/specimens.json');
const IMAGES_DIR = path.join(ROOT, 'public/exotics');
const PORT = 3335;

const STRING_FIELDS = [
  'commonName',
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
];

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

async function getSpecimens() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function saveSpecimens(specimens) {
  await fs.writeFile(
    DATA_PATH,
    JSON.stringify(specimens, null, 2) + '\n',
    'utf-8',
  );
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function uniqueSlug(base, specimens, skip) {
  let slug = base;
  let i = 2;
  while (specimens.some((s) => s.slug === slug && s.slug !== skip)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}

function nextArchiveNumber(specimens) {
  const numbers = specimens
    .map((s) => Number(String(s.archiveNumber).replace(/\D/g, '')))
    .filter((n) => !Number.isNaN(n));
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `FX-${String(next).padStart(3, '0')}`;
}

async function saveUploadedImage(file, slug) {
  if (!file || typeof file === 'string' || file.size === 0) return null;
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const filename = `${slug}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(IMAGES_DIR, filename), buffer);
  return `/exotics/${filename}`;
}

function json(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

async function toWebRequest(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  return new Request(`http://localhost${req.url}`, {
    method: req.method,
    headers: req.headers,
    body,
  });
}

function readFieldsFromFormData(formData) {
  const fields = {};
  for (const key of STRING_FIELDS) {
    fields[key] = String(formData.get(key) || '').trim();
  }
  const sex = String(formData.get('sex') || 'UNSEXED').toUpperCase();
  fields.sex = SEX_VALUES.includes(sex) ? sex : 'UNSEXED';
  const status = String(formData.get('status') || 'OBSERVATION').toUpperCase();
  fields.status = STATUS_VALUES.includes(status) ? status : 'OBSERVATION';
  fields.featured = formData.get('featured') === 'on';
  fields.shippingAvailable = formData.get('shippingAvailable') === 'on';
  fields.localPickupAvailable = formData.get('localPickupAvailable') === 'on';
  return fields;
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean); // ['api', 'specimens', ':slug'?]

    if (parts[0] !== 'api' || parts[1] !== 'specimens') {
      return json(res, 404, {error: 'Not found'});
    }

    const slugParam = parts[2] ? decodeURIComponent(parts[2]) : null;
    const specimens = await getSpecimens();

    if (req.method === 'GET' && !slugParam) {
      return json(res, 200, {specimens});
    }

    if (req.method === 'GET' && slugParam) {
      const specimen = specimens.find((s) => s.slug === slugParam);
      return specimen
        ? json(res, 200, {specimen})
        : json(res, 404, {error: 'Not found'});
    }

    if (req.method === 'DELETE' && slugParam) {
      await saveSpecimens(specimens.filter((s) => s.slug !== slugParam));
      return json(res, 200, {ok: true});
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const webRequest = await toWebRequest(req);
      const formData = await webRequest.formData();
      const fields = readFieldsFromFormData(formData);
      const imageFile = formData.get('coverImage');

      if (!fields.commonName) {
        return json(res, 400, {error: 'Common name is required.'});
      }

      if (req.method === 'PUT' && slugParam) {
        const existing = specimens.find((s) => s.slug === slugParam);
        if (!existing) return json(res, 404, {error: 'Specimen not found.'});
        const uploadedImage = await saveUploadedImage(imageFile, slugParam);
        const updated = {
          ...existing,
          ...fields,
          coverImage: uploadedImage || existing.coverImage,
          gallery: uploadedImage ? [uploadedImage] : existing.gallery,
        };
        await saveSpecimens(
          specimens.map((s) => (s.slug === slugParam ? updated : s)),
        );
        return json(res, 200, {ok: true, specimen: updated});
      }

      // POST = create
      const slug = uniqueSlug(slugify(fields.commonName), specimens);
      const uploadedImage = await saveUploadedImage(imageFile, slug);
      const archiveNumber = nextArchiveNumber(specimens);
      const newSpecimen = {
        id: `specimen-${slug}`,
        slug,
        archiveNumber,
        ...fields,
        coverImage: uploadedImage || '/exotics/exotics-python.webp',
        gallery: uploadedImage ? [uploadedImage] : [],
        video: null,
        publishedAt: new Date().toISOString().slice(0, 10),
      };
      await saveSpecimens([...specimens, newSpecimen]);
      return json(res, 200, {ok: true, specimen: newSpecimen});
    }

    return json(res, 405, {error: 'Method not allowed'});
  } catch (error) {
    console.error(error);
    return json(res, 500, {error: 'Internal error'});
  }
});

server.listen(PORT, () => {
  console.warn(`[cms] specimens API listening on http://localhost:${PORT}`);
});
