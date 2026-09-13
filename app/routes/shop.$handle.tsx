import {Link, useLoaderData, data} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import type {Route} from './+types/shop.$handle';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data: loaderData}) => {
  return [
    {
      title: loaderData
        ? `FYE.CO | ${loaderData.product.title}`
        : 'FYE.CO | Shop',
    },
  ];
};

export async function loader({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(SHOP_PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw data('Product not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

export default function ShopProductRoute() {
  const {product} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  return (
    <div className="-mx-4 -mb-4 bg-black text-paper">
      <section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <Link
          to="/shop"
          prefetch="intent"
          className="font-mono text-xs uppercase tracking-widest text-signal hover:text-paper"
        >
          ← Back to shop
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          <div className="overflow-hidden rounded-2xl bg-paper [&_.product-image]:h-full [&_.product-image]:w-full [&_img]:object-contain">
            <ProductImage image={selectedVariant?.image} />
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-paper/60">
              {product.vendor}
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">
              {product.title}
            </h1>
            <div className="mt-4 font-mono text-sm uppercase tracking-widest text-signal [&_s]:text-paper/40">
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>

            <div className="mt-6 [&_h5]:mb-2 [&_h5]:font-mono [&_h5]:text-xs [&_h5]:uppercase [&_h5]:tracking-widest [&_h5]:text-paper/60 [&_.product-options-grid]:flex [&_.product-options-grid]:flex-wrap [&_.product-options-grid]:gap-2 [&_.product-options-item]:border [&_.product-options-item]:border-paper/30 [&_.product-options-item]:px-3 [&_.product-options-item]:py-2 [&_.product-options-item]:font-mono [&_.product-options-item]:text-xs [&_.product-options-item]:uppercase [&_.product-options-item]:tracking-widest [&_button[type=submit]]:mt-6 [&_button[type=submit]]:w-full [&_button[type=submit]]:bg-signal [&_button[type=submit]]:px-6 [&_button[type=submit]]:py-4 [&_button[type=submit]]:font-mono [&_button[type=submit]]:text-xs [&_button[type=submit]]:uppercase [&_button[type=submit]]:tracking-widest [&_button[type=submit]]:text-paper [&_button[type=submit]:disabled]:opacity-40">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />
            </div>

            <div
              className="mt-8 max-w-md text-sm leading-relaxed text-paper/80"
              dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
            />
          </div>
        </div>
      </section>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const SHOP_PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ShopProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const SHOP_PRODUCT_FRAGMENT = `#graphql
  fragment ShopProduct on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ShopProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ShopProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ShopProductVariant
    }
    seo {
      description
      title
    }
  }
  ${SHOP_PRODUCT_VARIANT_FRAGMENT}
` as const;

const SHOP_PRODUCT_QUERY = `#graphql
  query ShopProduct(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ShopProduct
    }
  }
  ${SHOP_PRODUCT_FRAGMENT}
` as const;
