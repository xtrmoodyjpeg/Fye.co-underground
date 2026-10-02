// Gates every /admin/* route behind HTTP Basic Auth. These routes read and
// write Shopify Metaobjects (and, for Client Cam, uploaded customer photos
// and contact-form PII) via the Admin API token, so they must never be
// reachable by an unauthenticated visitor.
export interface AdminAuthEnv {
  ADMIN_USER?: string;
  ADMIN_PASSWORD?: string;
}

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let result = 0;
  for (let i = 0; i < aBytes.length; i++) {
    result |= aBytes[i] ^ bBytes[i];
  }
  return result === 0;
}

export function requireAdminAuth(request: Request, env: AdminAuthEnv): void {
  const user = env.ADMIN_USER;
  const pass = env.ADMIN_PASSWORD;
  if (!user || !pass) {
    throw new Response('Admin auth is not configured.', {status: 503});
  }

  const header = request.headers.get('Authorization') ?? '';
  const expected = `Basic ${btoa(`${user}:${pass}`)}`;
  if (!timingSafeEqual(header, expected)) {
    throw new Response('Unauthorized', {
      status: 401,
      headers: {'WWW-Authenticate': 'Basic realm="FYE.CO Admin"'},
    });
  }
}
