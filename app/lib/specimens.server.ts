// The Hydrogen dev/production runtime (MiniOxygen / Oxygen) is a Workers-style
// sandbox with no filesystem access, so specimen data can't be read or
// written via `node:fs` from here. Instead this talks to the small standalone
// CMS server (scripts/exotics-cms-server.mjs) over plain HTTP, the same way
// any Hydrogen loader/action talks to an external API.
import type {Specimen} from '~/data/specimens';

const CMS_URL = 'http://localhost:3335';

export async function getSpecimens(): Promise<Specimen[]> {
  const res = await fetch(`${CMS_URL}/api/specimens`);
  if (!res.ok) return [];
  const {specimens} = (await res.json()) as {specimens: Specimen[]};
  return specimens;
}

export async function getSpecimen(slug: string): Promise<Specimen | null> {
  const res = await fetch(`${CMS_URL}/api/specimens/${encodeURIComponent(slug)}`);
  if (!res.ok) return null;
  const {specimen} = (await res.json()) as {specimen: Specimen};
  return specimen;
}

export async function createSpecimen(
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const res = await fetch(`${CMS_URL}/api/specimens`, {
    method: 'POST',
    body: formData,
  });
  return (await res.json()) as {ok: boolean; error?: string};
}

export async function updateSpecimen(
  slug: string,
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const res = await fetch(
    `${CMS_URL}/api/specimens/${encodeURIComponent(slug)}`,
    {method: 'PUT', body: formData},
  );
  return (await res.json()) as {ok: boolean; error?: string};
}

export async function deleteSpecimen(slug: string): Promise<{ok: boolean}> {
  const res = await fetch(
    `${CMS_URL}/api/specimens/${encodeURIComponent(slug)}`,
    {method: 'DELETE'},
  );
  return (await res.json()) as {ok: boolean};
}
