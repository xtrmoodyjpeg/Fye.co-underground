// Standalone product-CMS backend.
//
// MiniOxygen (the local Hydrogen dev runtime) emulates Shopify's Oxygen
// worker sandbox, which has no filesystem access — `node:fs` fails to even
// import there. So the actual products.json read/write has to live outside
// that sandbox, in a plain Node process. Hydrogen's loaders/actions reach it
// over plain HTTP (the same way they'd call any external API), which the
// worker sandbox fully supports.
import {createServer} from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = path.join(ROOT, 'app/data/products.json');
const IMAGES_DIR = path.join(ROOT, 'public/products');
const PORT = 3334;

async function getProducts() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function saveProducts(products) {
  await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2) + '\n', 'utf-8');
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function uniqueHandle(base, products, skip) {
  let handle = base;
  let i = 2;
  while (products.some((p) => p.handle === handle && p.handle !== skip)) {
    handle = `${base}-${i}`;
    i += 1;
  }
  return handle;
}

async function saveUploadedImage(file, handle) {
  if (!file || file.size === 0) return null;
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const filename = `${handle}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(IMAGES_DIR, filename), buffer);
  return `/products/${filename}`;
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
    const parts = url.pathname.split('/').filter(Boolean); // ['api', 'products', ':handle'?]

    if (parts[0] !== 'api' || parts[1] !== 'products') {
      return json(res, 404, {error: 'Not found'});
    }

    const handleParam = parts[2] ? decodeURIComponent(parts[2]) : null;
    const products = await getProducts();

    if (req.method === 'GET' && !handleParam) {
      return json(res, 200, {products});
    }

    if (req.method === 'GET' && handleParam) {
      const product = products.find((p) => p.handle === handleParam);
      return product ? json(res, 200, {product}) : json(res, 404, {error: 'Not found'});
    }

    if (req.method === 'DELETE' && handleParam) {
      await saveProducts(products.filter((p) => p.handle !== handleParam));
      return json(res, 200, {ok: true});
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const webRequest = await toWebRequest(req);
      const formData = await webRequest.formData();

      const name = String(formData.get('name') || '').trim();
      const category = String(formData.get('category') || '').trim();
      const colorway = String(formData.get('colorway') || '').trim();
      const description = String(formData.get('description') || '').trim();
      const priceRaw = String(formData.get('price') || '').trim();
      const price = priceRaw ? Number(priceRaw) : null;
      const imageFile = formData.get('image');

      if (!name) return json(res, 400, {error: 'Product name is required.'});

      if (req.method === 'PUT' && handleParam) {
        const existing = products.find((p) => p.handle === handleParam);
        if (!existing) return json(res, 404, {error: 'Product not found.'});
        const uploadedImage =
          imageFile && imageFile.size > 0 ? await saveUploadedImage(imageFile, handleParam) : null;
        const updated = {
          ...existing,
          name,
          category,
          colorway,
          description,
          price,
          image: uploadedImage || existing.image,
        };
        await saveProducts(products.map((p) => (p.handle === handleParam ? updated : p)));
        return json(res, 200, {ok: true, product: updated});
      }

      // POST = create
      const handle = uniqueHandle(slugify(name), products);
      const uploadedImage =
        imageFile && imageFile.size > 0 ? await saveUploadedImage(imageFile, handle) : null;
      const newProduct = {
        handle,
        name,
        category,
        colorway,
        description,
        price,
        image: uploadedImage || '/products/placeholder.png',
      };
      await saveProducts([...products, newProduct]);
      return json(res, 200, {ok: true, product: newProduct});
    }

    return json(res, 405, {error: 'Method not allowed'});
  } catch (error) {
    console.error(error);
    return json(res, 500, {error: 'Internal error'});
  }
});

server.listen(PORT, () => {
  console.warn(`[cms] products API listening on http://localhost:${PORT}`);
});
