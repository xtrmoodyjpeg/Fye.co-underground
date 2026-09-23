// Reads/writes Contact form submissions as Shopify Metaobjects
// (type "contact_submission") via the Admin API.
import {adminGraphQL, type AdminEnv} from './shopifyAdmin.server';

const TYPE = 'contact_submission';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read';
  submittedAt: string;
}

interface RawField {
  key: string;
  value: string | null;
}
interface RawMetaobject {
  id: string;
  handle: string;
  fields: RawField[];
}

const FIELDS_SELECTION = `id handle fields { key value }`;

function toSubmission(raw: RawMetaobject): ContactSubmission {
  const map: Record<string, string> = {};
  for (const f of raw.fields) map[f.key] = f.value ?? '';
  return {
    id: raw.id,
    name: map.name || '',
    email: map.email || '',
    message: map.message || '',
    status: map.status === 'read' ? 'read' : 'new',
    submittedAt: map.submittedAt || '',
  };
}

export async function getContactSubmissions(
  env: AdminEnv,
): Promise<ContactSubmission[]> {
  const data = await adminGraphQL<{metaobjects: {nodes: RawMetaobject[]}}>(
    env,
    `query GetContactSubmissions {
      metaobjects(type: "${TYPE}", first: 100, sortKey: "updated_at", reverse: true) {
        nodes { ${FIELDS_SELECTION} }
      }
    }`,
  );
  return data.metaobjects.nodes.map(toSubmission);
}

export async function createContactSubmission(
  env: AdminEnv,
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();

  if (!name || !email || !message) {
    return {ok: false, error: 'Name, email, and message are required.'};
  }

  const handle = `contact-${Date.now()}`;
  const result = await adminGraphQL<{
    metaobjectCreate: {
      metaobject: {id: string} | null;
      userErrors: Array<{message: string}>;
    };
  }>(
    env,
    `mutation CreateContactSubmission($metaobject: MetaobjectCreateInput!) {
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
          {key: 'name', value: name},
          {key: 'email', value: email},
          {key: 'message', value: message},
          {key: 'status', value: 'new'},
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

export async function updateContactSubmission(
  env: AdminEnv,
  id: string,
  status: 'new' | 'read',
): Promise<{ok: boolean}> {
  await adminGraphQL(
    env,
    `mutation UpdateContactSubmission($id: ID!, $metaobject: MetaobjectUpdateInput!) {
      metaobjectUpdate(id: $id, metaobject: $metaobject) {
        metaobject { id }
        userErrors { message }
      }
    }`,
    {id, metaobject: {fields: [{key: 'status', value: status}]}},
  );
  return {ok: true};
}

export async function deleteContactSubmission(
  env: AdminEnv,
  id: string,
): Promise<{ok: boolean}> {
  await adminGraphQL(
    env,
    `mutation DeleteContactSubmission($id: ID!) {
      metaobjectDelete(id: $id) { deletedId userErrors { message } }
    }`,
    {id},
  );
  return {ok: true};
}
