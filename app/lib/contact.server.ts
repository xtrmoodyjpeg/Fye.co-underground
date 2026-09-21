// Talks to the standalone site-server (scripts/site-server.mjs) over plain
// HTTP -- see app/lib/specimens.server.ts for why this can't just be a
// direct filesystem read/write from a Hydrogen loader/action.
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read';
  submittedAt: string;
}

const SITE_SERVER_URL = 'http://localhost:3336';

export async function createContactSubmission(
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const res = await fetch(`${SITE_SERVER_URL}/api/contact`, {
    method: 'POST',
    body: formData,
  });
  return (await res.json()) as {ok: boolean; error?: string};
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const res = await fetch(`${SITE_SERVER_URL}/api/contact`);
  if (!res.ok) return [];
  const {submissions} = (await res.json()) as {
    submissions: ContactSubmission[];
  };
  return submissions;
}

export async function updateContactSubmission(
  id: string,
  status: 'new' | 'read',
): Promise<{ok: boolean}> {
  const formData = new FormData();
  formData.set('status', status);
  const res = await fetch(
    `${SITE_SERVER_URL}/api/contact/${encodeURIComponent(id)}`,
    {method: 'PUT', body: formData},
  );
  return (await res.json()) as {ok: boolean};
}

export async function deleteContactSubmission(id: string): Promise<{ok: boolean}> {
  const res = await fetch(
    `${SITE_SERVER_URL}/api/contact/${encodeURIComponent(id)}`,
    {method: 'DELETE'},
  );
  return (await res.json()) as {ok: boolean};
}
