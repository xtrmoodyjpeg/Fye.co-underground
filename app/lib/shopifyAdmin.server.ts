// Thin Admin API client used by the one remaining feature backed by it:
// the public contact form, which writes a Shopify Metaobject.
//
// This replaces the local sidecar-server pattern used earlier in this
// project: MiniOxygen/Oxygen have no filesystem, but they support outbound
// fetch(), and the Admin API is a real hosted backend that works identically
// in local dev and in production -- no separate process required.
const API_VERSION = '2025-01';

function shopDomain(env: {PUBLIC_STORE_DOMAIN?: string}): string {
  const domain = env.PUBLIC_STORE_DOMAIN;
  if (!domain) throw new Error('PUBLIC_STORE_DOMAIN is not set.');
  return domain.replace(/^https?:\/\//, '');
}

export interface AdminEnv {
  PUBLIC_STORE_DOMAIN?: string;
  PRIVATE_ADMIN_API_TOKEN?: string;
}

export async function adminGraphQL<T = unknown>(
  env: AdminEnv,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const token = env.PRIVATE_ADMIN_API_TOKEN;
  if (!token) throw new Error('PRIVATE_ADMIN_API_TOKEN is not set.');

  const res = await fetch(
    `https://${shopDomain(env)}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({query, variables}),
    },
  );

  if (!res.ok) {
    throw new Error(`Admin API request failed: ${res.status}`);
  }

  const json = (await res.json()) as {data?: T; errors?: unknown[]};
  if (json.errors?.length) {
    throw new Error(`Admin API GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data as T;
}
