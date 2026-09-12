// The Hydrogen dev/production runtime (MiniOxygen / Oxygen) is a Workers-style
// sandbox with no filesystem access, so product data can't be read or written
// via `node:fs` from here. Instead this talks to the small standalone CMS
// server (scripts/cms-server.mjs) over plain HTTP, the same way any Hydrogen
// loader/action talks to an external API.
const CMS_URL = 'http://localhost:3334';

export interface Product {
  handle: string;
  name: string;
  category: string;
  colorway: string;
  sizes: string | null;
  description: string;
  price: number | null;
  image: string;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${CMS_URL}/api/products`);
  if (!res.ok) return [];
  const {products} = (await res.json()) as {products: Product[]};
  return products;
}

export async function getProduct(handle: string): Promise<Product | null> {
  const res = await fetch(`${CMS_URL}/api/products/${encodeURIComponent(handle)}`);
  if (!res.ok) return null;
  const {product} = (await res.json()) as {product: Product};
  return product;
}

export async function createProduct(
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const res = await fetch(`${CMS_URL}/api/products`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function updateProduct(
  handle: string,
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const res = await fetch(`${CMS_URL}/api/products/${encodeURIComponent(handle)}`, {
    method: 'PUT',
    body: formData,
  });
  return res.json();
}

export async function deleteProduct(handle: string): Promise<{ok: boolean}> {
  const res = await fetch(`${CMS_URL}/api/products/${encodeURIComponent(handle)}`, {
    method: 'DELETE',
  });
  return res.json();
}
