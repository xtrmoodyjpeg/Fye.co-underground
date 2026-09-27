import {Link, useLoaderData} from 'react-router';
import {Image, Money, getPaginationVariables} from '@shopify/hydrogen';
import type {Route} from './+types/shop._index';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import type {ProductCardItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.CO | Shop'}];
};

export async function loader({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 12});

  const [{products}] = await Promise.all([
    storefront.query(SHOP_PRODUCTS_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);

  return {products};
}

export default function ShopIndexRoute() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="-mx-4 -mb-4 bg-black text-paper">
      <section className="mx-auto max-w-[1800px] px-6 py-20 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          Drop 02
        </p>
        <h1 className="font-heading text-[16vw] leading-[1.05] sm:text-[clamp(3rem,9vw,6.5rem)]">
          Shop
        </h1>

        <PaginatedResourceSection<ProductCardItemFragment>
          connection={products}
          resourcesClassName="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
        >
          {({node: product}) => (
            <Link key={product.id} to={`/shop/${product.handle}`} prefetch="intent" className="block">
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-paper">
                {product.featuredImage && (
                  <Image
                    data={product.featuredImage}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 25vw, 50vw"
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <h3 className="mt-3 font-mono text-xs uppercase tracking-widest">
                {product.title}
              </h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-paper/60">
                <Money data={product.priceRange.minVariantPrice} />
              </p>
            </Link>
          )}
        </PaginatedResourceSection>
      </section>
    </div>
  );
}

const SHOP_PRODUCTS_QUERY = `#graphql
  query ShopProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductCardItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
