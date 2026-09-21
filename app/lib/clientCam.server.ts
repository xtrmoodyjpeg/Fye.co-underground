// Talks to the standalone site-server (scripts/site-server.mjs) over plain
// HTTP -- see app/lib/specimens.server.ts for why this can't just be a
// direct filesystem read/write from a Hydrogen loader/action.
export type ClientCamStatus = 'pending' | 'approved' | 'rejected';

export interface ClientCamSubmission {
  id: string;
  imageUrl: string;
  clientName: string | null;
  caption: string | null;
  status: ClientCamStatus;
  submittedAt: string;
}

const SITE_SERVER_URL = 'http://localhost:3336';

export async function getClientCamSubmissions(
  status?: ClientCamStatus,
): Promise<ClientCamSubmission[]> {
  const url = status
    ? `${SITE_SERVER_URL}/api/client-cam?status=${status}`
    : `${SITE_SERVER_URL}/api/client-cam`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const {submissions} = (await res.json()) as {
    submissions: ClientCamSubmission[];
  };
  return submissions;
}

export async function createClientCamSubmission(
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const res = await fetch(`${SITE_SERVER_URL}/api/client-cam`, {
    method: 'POST',
    body: formData,
  });
  return (await res.json()) as {ok: boolean; error?: string};
}

export async function updateClientCamSubmission(
  id: string,
  status: ClientCamStatus,
): Promise<{ok: boolean}> {
  const formData = new FormData();
  formData.set('status', status);
  const res = await fetch(
    `${SITE_SERVER_URL}/api/client-cam/${encodeURIComponent(id)}`,
    {method: 'PUT', body: formData},
  );
  return (await res.json()) as {ok: boolean};
}

export async function deleteClientCamSubmission(
  id: string,
): Promise<{ok: boolean}> {
  const res = await fetch(
    `${SITE_SERVER_URL}/api/client-cam/${encodeURIComponent(id)}`,
    {method: 'DELETE'},
  );
  return (await res.json()) as {ok: boolean};
}
