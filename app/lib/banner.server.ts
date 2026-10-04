// Reads the sitewide sticky banner's content as a single Shopify
// Metaobject (type "banner_config", handle "main") via the Storefront API.
// Editing the banner happens natively in Shopify Admin > Content >
// Metaobjects > Banner Config -- this file is read-only.
const TYPE = 'banner_config';
const HANDLE = 'main';

export interface BannerConfig {
  enabled: boolean;
  message: string;
  ctaLabel: string;
  ctaHref: string;
}

interface RawField {
  key: string;
  value: string | null;
}
interface RawMetaobject {
  id: string;
  fields: RawField[];
}

const FALLBACK_BANNER: BannerConfig = {
  enabled: false,
  message: '',
  ctaLabel: '',
  ctaHref: '/shop',
};

function toBanner(raw: RawMetaobject): BannerConfig {
  const map: Record<string, string> = {};
  for (const f of raw.fields) map[f.key] = f.value ?? '';
  return {
    enabled: map.enabled === 'true',
    message: map.message || '',
    ctaLabel: map.ctaLabel || '',
    ctaHref: map.ctaHref || '/shop',
  };
}

interface StorefrontClient {
  query<T>(query: string, options?: {variables?: Record<string, unknown>}): Promise<T>;
}

export async function getBanner(storefront: StorefrontClient): Promise<BannerConfig> {
  try {
    const data = await storefront.query<{
      metaobject: RawMetaobject | null;
    }>(
      `query GetBanner($handle: MetaobjectHandleInput!) {
        metaobject(handle: $handle) { fields { key value } }
      }`,
      {variables: {handle: {type: TYPE, handle: HANDLE}}},
    );
    return data.metaobject ? toBanner(data.metaobject) : FALLBACK_BANNER;
  } catch {
    return FALLBACK_BANNER;
  }
}
