import {useLoaderData, data} from 'react-router';
import type {Route} from './+types/_index';
import {Home} from '~/components/home/Home';
import {MockShopNotice} from '~/components/MockShopNotice';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {getClientCamSubmissions, createClientCamSubmission} from '~/lib/clientCam.server';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.CO | For Your Eyes'}];
};

export const links: Route.LinksFunction = () => [
  {
    rel: 'preload',
    as: 'image',
    href: '/fye-co-logo-gator.webp',
    type: 'image/webp',
  },
];

export async function loader({context}: Route.LoaderArgs) {
  const {storefront, env} = context;
  const [{products}, clientCamPhotos] = await Promise.all([
    storefront.query(HOME_PRODUCTS_QUERY, {
      variables: {first: 8},
    }),
    getClientCamSubmissions(env, 'approved'),
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    products: products.nodes,
    clientCamPhotos,
  };
}

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const result = await createClientCamSubmission(context.env, formData);
  return data(result, {status: result.ok ? 200 : 400});
}

export default function Homepage() {
  const {isShopLinked, products, clientCamPhotos} =
    useLoaderData<typeof loader>();
  return (
    <>
      {isShopLinked ? null : <MockShopNotice />}
      {/* Cancels reset.css's `body > main` gutter so full-bleed sections
          reach the true viewport edge instead of sitting inset by 1rem. */}
      <div className="-mx-4 -mb-4 bg-black">
        <Home products={products} clientCamPhotos={clientCamPhotos} />
      </div>
    </>
  );
}

const HOME_PRODUCTS_QUERY = `#graphql
  query HomeProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductCardItem
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
