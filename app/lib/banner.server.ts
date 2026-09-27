// Reads/writes the sitewide sticky banner's content as a single Shopify
// Metaobject (type "banner_config", handle "main") via the Admin API.
import {adminGraphQL, type AdminEnv} from './shopifyAdmin.server';

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

// Reads go through the Storefront API: the banner_config metaobject
// definition has Storefront API access enabled, so the sticky banner
// keeps working even when PRIVATE_ADMIN_API_TOKEN is unset or invalid.
// Writes (updateBanner below) still require the Admin API.
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

export async function updateBanner(
  env: AdminEnv,
  formData: FormData,
): Promise<{ok: boolean; banner?: BannerConfig}> {
  const config: BannerConfig = {
    enabled: formData.get('enabled') === 'on',
    message: String(formData.get('message') || '').trim(),
    ctaLabel: String(formData.get('ctaLabel') || '').trim(),
    ctaHref: String(formData.get('ctaHref') || '').trim(),
  };

  await adminGraphQL(
    env,
    `mutation UpsertBanner($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
      metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
        metaobject { id }
        userErrors { message }
      }
    }`,
    {
      handle: {type: TYPE, handle: HANDLE},
      metaobject: {
        fields: [
          {key: 'enabled', value: String(config.enabled)},
          {key: 'message', value: config.message},
          {key: 'ctaLabel', value: config.ctaLabel},
          {key: 'ctaHref', value: config.ctaHref},
        ],
      },
    },
  );

  return {ok: true, banner: config};
}
