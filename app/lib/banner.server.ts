// Talks to the standalone site-server (scripts/site-server.mjs) over plain
// HTTP -- see app/lib/specimens.server.ts for why this can't just be a
// direct filesystem read/write from a Hydrogen loader/action.
export interface BannerConfig {
  enabled: boolean;
  message: string;
  ctaLabel: string;
  ctaHref: string;
}

const SITE_SERVER_URL = 'http://localhost:3336';

const FALLBACK_BANNER: BannerConfig = {
  enabled: false,
  message: '',
  ctaLabel: '',
  ctaHref: '/shop',
};

export async function getBanner(): Promise<BannerConfig> {
  try {
    const res = await fetch(`${SITE_SERVER_URL}/api/banner`);
    if (!res.ok) return FALLBACK_BANNER;
    const {banner} = (await res.json()) as {banner: BannerConfig};
    return banner;
  } catch {
    return FALLBACK_BANNER;
  }
}

export async function updateBanner(
  formData: FormData,
): Promise<{ok: boolean; banner?: BannerConfig}> {
  const res = await fetch(`${SITE_SERVER_URL}/api/banner`, {
    method: 'PUT',
    body: formData,
  });
  return (await res.json()) as {ok: boolean; banner?: BannerConfig};
}
