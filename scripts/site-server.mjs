// Standalone backend for three small FYE.CO site features: the contact
// form, the "Client Cam" upload/moderation queue, and the sitewide sticky
// banner's editable content.
//
// Same reasoning as scripts/exotics-cms-server.mjs: the Hydrogen dev/prod
// runtime (MiniOxygen / Oxygen) is a Workers-style sandbox with no
// filesystem access, so reading/writing these JSON stores and saving
// uploaded images has to happen outside that sandbox, in a plain Node
// process reached over plain HTTP.
import {createServer} from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTACT_PATH = path.join(ROOT, 'app/data/contactSubmissions.json');
const CLIENT_CAM_PATH = path.join(ROOT, 'app/data/clientCamSubmissions.json');
const CLIENT_CAM_IMAGES_DIR = path.join(ROOT, 'public/client-cam');
const BANNER_PATH = path.join(ROOT, 'app/data/bannerConfig.json');
const PORT = 3336;

const ALLOWED_IMAGE_TYPES = new Set(['jpg', 'jpeg', 'png', 'webp']);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
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

async function saveClientCamImage(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(ext)) {
    throw new Error('Only JPG, PNG, or WEBP images are allowed.');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be 8MB or smaller.');
  }
  const filename = `${makeId()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(CLIENT_CAM_IMAGES_DIR, filename), buffer);
  return `/client-cam/${filename}`;
}

async function handleContact(req, res, parts) {
  const idParam = parts[2] ? decodeURIComponent(parts[2]) : null;
  const submissions = await readJson(CONTACT_PATH);

  if (req.method === 'GET') {
    return json(res, 200, {submissions});
  }

  if (req.method === 'POST') {
    const webRequest = await toWebRequest(req);
    const formData = await webRequest.formData();
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
      return json(res, 400, {error: 'Name, email, and message are required.'});
    }

    const submission = {
      id: makeId(),
      name,
      email,
      message,
      status: 'new',
      submittedAt: new Date().toISOString(),
    };
    await writeJson(CONTACT_PATH, [submission, ...submissions]);
    return json(res, 200, {ok: true, submission});
  }

  if (req.method === 'PUT' && idParam) {
    const webRequest = await toWebRequest(req);
    const formData = await webRequest.formData();
    const status = String(formData.get('status') || '');
    if (!['new', 'read'].includes(status)) {
      return json(res, 400, {error: 'Invalid status.'});
    }
    const updated = submissions.map((s) =>
      s.id === idParam ? {...s, status} : s,
    );
    await writeJson(CONTACT_PATH, updated);
    return json(res, 200, {ok: true});
  }

  if (req.method === 'DELETE' && idParam) {
    await writeJson(
      CONTACT_PATH,
      submissions.filter((s) => s.id !== idParam),
    );
    return json(res, 200, {ok: true});
  }

  return json(res, 405, {error: 'Method not allowed'});
}

async function handleClientCam(req, res, parts, url) {
  const idParam = parts[2] ? decodeURIComponent(parts[2]) : null;
  const submissions = await readJson(CLIENT_CAM_PATH);

  if (req.method === 'GET' && !idParam) {
    const statusFilter = url.searchParams.get('status');
    const filtered = statusFilter
      ? submissions.filter((s) => s.status === statusFilter)
      : submissions;
    return json(res, 200, {submissions: filtered});
  }

  if (req.method === 'POST') {
    const webRequest = await toWebRequest(req);
    const formData = await webRequest.formData();
    const image = formData.get('image');
    const clientName = String(formData.get('clientName') || '').trim();
    const caption = String(formData.get('caption') || '').trim();

    if (!image || typeof image === 'string' || image.size === 0) {
      return json(res, 400, {error: 'A photo is required.'});
    }

    let imageUrl;
    try {
      imageUrl = await saveClientCamImage(image);
    } catch (error) {
      return json(res, 400, {error: error.message});
    }

    const submission = {
      id: makeId(),
      imageUrl,
      clientName: clientName || null,
      caption: caption || null,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    await writeJson(CLIENT_CAM_PATH, [submission, ...submissions]);
    return json(res, 200, {ok: true, submission});
  }

  if (req.method === 'PUT' && idParam) {
    const webRequest = await toWebRequest(req);
    const formData = await webRequest.formData();
    const status = String(formData.get('status') || '');
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return json(res, 400, {error: 'Invalid status.'});
    }
    const updated = submissions.map((s) =>
      s.id === idParam ? {...s, status} : s,
    );
    await writeJson(CLIENT_CAM_PATH, updated);
    return json(res, 200, {ok: true});
  }

  if (req.method === 'DELETE' && idParam) {
    await writeJson(
      CLIENT_CAM_PATH,
      submissions.filter((s) => s.id !== idParam),
    );
    return json(res, 200, {ok: true});
  }

  return json(res, 405, {error: 'Method not allowed'});
}

async function handleBanner(req, res) {
  if (req.method === 'GET') {
    const config = await readJson(BANNER_PATH);
    return json(res, 200, {banner: config});
  }

  if (req.method === 'PUT') {
    const webRequest = await toWebRequest(req);
    const formData = await webRequest.formData();
    const config = {
      enabled: formData.get('enabled') === 'on',
      message: String(formData.get('message') || '').trim(),
      ctaLabel: String(formData.get('ctaLabel') || '').trim(),
      ctaHref: String(formData.get('ctaHref') || '').trim(),
    };
    await writeJson(BANNER_PATH, config);
    return json(res, 200, {ok: true, banner: config});
  }

  return json(res, 405, {error: 'Method not allowed'});
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
    const parts = url.pathname.split('/').filter(Boolean); // ['api', 'contact'|'client-cam', ':id'?]

    if (parts[0] !== 'api') return json(res, 404, {error: 'Not found'});
    if (parts[1] === 'contact') return await handleContact(req, res, parts);
    if (parts[1] === 'client-cam') {
      return await handleClientCam(req, res, parts, url);
    }
    if (parts[1] === 'banner') return await handleBanner(req, res);
    return json(res, 404, {error: 'Not found'});
  } catch (error) {
    console.error(error);
    return json(res, 500, {error: 'Internal error'});
  }
});

server.listen(PORT, () => {
  console.warn(`[site] contact + client-cam + banner API listening on http://localhost:${PORT}`);
});
