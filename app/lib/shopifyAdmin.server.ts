// Thin Admin API client used by every feature backed by Shopify Metaobjects
// (Exotics specimens, Contact submissions, Client Cam, the sticky banner).
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

interface StagedTarget {
  url: string;
  resourceUrl: string;
  parameters: Array<{name: string; value: string}>;
}

/**
 * Uploads a File (from a multipart form submission) to Shopify Files and
 * returns the resulting file's GID. Callers store that GID as a
 * file_reference (or list.file_reference) field value on a metaobject.
 */
export async function uploadFileToShopify(
  env: AdminEnv,
  file: File,
): Promise<string> {
  const staged = await adminGraphQL<{
    stagedUploadsCreate: {
      stagedTargets: StagedTarget[];
      userErrors: Array<{field: string; message: string}>;
    };
  }>(
    env,
    `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets { url resourceUrl parameters { name value } }
        userErrors { field message }
      }
    }`,
    {
      input: [
        {
          filename: file.name,
          mimeType: file.type || 'application/octet-stream',
          httpMethod: 'POST',
          resource: 'FILE',
        },
      ],
    },
  );

  if (staged.stagedUploadsCreate.userErrors.length) {
    throw new Error(
      `stagedUploadsCreate errors: ${JSON.stringify(staged.stagedUploadsCreate.userErrors)}`,
    );
  }
  const target = staged.stagedUploadsCreate.stagedTargets[0];

  const form = new FormData();
  for (const param of target.parameters) {
    form.set(param.name, param.value);
  }
  form.set('file', file, file.name);

  const uploadRes = await fetch(target.url, {method: 'POST', body: form});
  if (!uploadRes.ok) {
    throw new Error(`Staged upload failed: ${uploadRes.status}`);
  }

  const created = await adminGraphQL<{
    fileCreate: {
      files: Array<{id: string}>;
      userErrors: Array<{field: string; message: string}>;
    };
  }>(
    env,
    `mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files { id }
        userErrors { field message }
      }
    }`,
    {files: [{originalSource: target.resourceUrl, contentType: 'IMAGE'}]},
  );

  if (created.fileCreate.userErrors.length) {
    throw new Error(
      `fileCreate errors: ${JSON.stringify(created.fileCreate.userErrors)}`,
    );
  }
  return created.fileCreate.files[0].id;
}
