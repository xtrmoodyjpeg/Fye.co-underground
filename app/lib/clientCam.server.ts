// Reads/writes Client Cam submissions as Shopify Metaobjects (type
// "client_cam_submission") via the Admin API (this metaobject has no
// Storefront API access, so even the public "approved photos" gallery on
// the homepage reads through here). Approving/rejecting/deleting
// submissions happens natively in Shopify Admin > Content > Metaobjects >
// Client Cam Submission.
import {
  adminGraphQL,
  uploadFileToShopify,
  type AdminEnv,
} from './shopifyAdmin.server';

const TYPE = 'client_cam_submission';

export type ClientCamStatus = 'pending' | 'approved' | 'rejected';

export interface ClientCamSubmission {
  id: string;
  imageUrl: string;
  clientName: string | null;
  caption: string | null;
  status: ClientCamStatus;
  submittedAt: string;
}

interface RawField {
  key: string;
  value: string | null;
  reference: {image?: {url: string}} | null;
}
interface RawMetaobject {
  id: string;
  handle: string;
  fields: RawField[];
}

const FIELDS_SELECTION = `
  id
  handle
  fields {
    key
    value
    reference { ... on MediaImage { image { url } } }
  }
`;

const STATUS_VALUES: ClientCamStatus[] = ['pending', 'approved', 'rejected'];

function toSubmission(raw: RawMetaobject): ClientCamSubmission {
  const map: Record<string, string> = {};
  const refs: Record<string, RawField> = {};
  for (const f of raw.fields) {
    map[f.key] = f.value ?? '';
    refs[f.key] = f;
  }
  return {
    id: raw.id,
    imageUrl: refs.image?.reference?.image?.url ?? '',
    clientName: map.clientName || null,
    caption: map.caption || null,
    status: (STATUS_VALUES.includes(map.status as ClientCamStatus)
      ? map.status
      : 'pending') as ClientCamStatus,
    submittedAt: map.submittedAt || '',
  };
}

export async function getClientCamSubmissions(
  env: AdminEnv,
  status?: ClientCamStatus,
): Promise<ClientCamSubmission[]> {
  try {
    const data = await adminGraphQL<{metaobjects: {nodes: RawMetaobject[]}}>(
      env,
      `query GetClientCamSubmissions {
        metaobjects(type: "${TYPE}", first: 100, sortKey: "updated_at", reverse: true) {
          nodes { ${FIELDS_SELECTION} }
        }
      }`,
    );
    const submissions = data.metaobjects.nodes.map(toSubmission);
    return status ? submissions.filter((s) => s.status === status) : submissions;
  } catch {
    return [];
  }
}

export async function createClientCamSubmission(
  env: AdminEnv,
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const image = formData.get('image');
  const clientName = String(formData.get('clientName') || '').trim();
  const caption = String(formData.get('caption') || '').trim();

  if (!image || typeof image === 'string' || image.size === 0) {
    return {ok: false, error: 'A photo is required.'};
  }

  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
  if (image.type && !allowed.has(image.type)) {
    return {ok: false, error: 'Only JPG, PNG, or WEBP images are allowed.'};
  }
  if (image.size > 8 * 1024 * 1024) {
    return {ok: false, error: 'Image must be 8MB or smaller.'};
  }

  let imageGid: string;
  try {
    imageGid = await uploadFileToShopify(env, image);
  } catch {
    return {ok: false, error: 'Photo upload failed. Try again.'};
  }

  const handle = `client-cam-${Date.now()}`;
  const result = await adminGraphQL<{
    metaobjectCreate: {
      metaobject: {id: string} | null;
      userErrors: Array<{message: string}>;
    };
  }>(
    env,
    `mutation CreateClientCamSubmission($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject { id }
        userErrors { field message }
      }
    }`,
    {
      metaobject: {
        type: TYPE,
        handle,
        fields: [
          {key: 'clientName', value: clientName},
          {key: 'caption', value: caption},
          {key: 'image', value: imageGid},
          {key: 'status', value: 'pending'},
          {key: 'submittedAt', value: new Date().toISOString()},
        ],
      },
    },
  );

  if (result.metaobjectCreate.userErrors.length) {
    return {
      ok: false,
      error: result.metaobjectCreate.userErrors.map((e) => e.message).join(', '),
    };
  }
  return {ok: true};
}
