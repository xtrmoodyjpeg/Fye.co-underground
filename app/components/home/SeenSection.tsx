import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductCardItemFragment} from 'storefrontapi.generated';

const FEATURED_HANDLES = [
  'fc-dino-track-jacket',
  'pixel-flamingo-long-sleeve',
  'pixel-flamingo-swim-shorts',
];

export function SeenSection({
  products,
}: {
  products: ProductCardItemFragment[];
}) {
  const byHandle = new Map(products.map((product) => [product.handle, product]));
  const featured = FEATURED_HANDLES.map((handle) => byHandle.get(handle)).filter(
    (product): product is ProductCardItemFragment => Boolean(product),
  );

  if (!featured.length) return null;

  return (
    <section className="relative overflow-hidden bg-black px-6 py-20 text-paper sm:px-10">
      <div
        aria-hidden="true"
        className="absolute -left-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-paper/10"
      />
      <div className="relative mx-auto flex max-w-[1800px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative">
          <h2 className="-rotate-2 font-display text-[clamp(3.5rem,24vw,7rem)] leading-[1.1] text-signal sm:text-[clamp(4rem,10vw,11rem)]">
            Seen
          </h2>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-paper/60">
            Same city
            <br />
            different minds
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:max-w-xl">
          {featured.map((product) => (
            <Link
              key={product.id}
              to={`/shop/${product.handle}`}
              prefetch="intent"
              className="block rounded-2xl bg-steel/60 p-4"
            >
              <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-steel">
                {product.featuredImage && (
                  <Image
                    data={product.featuredImage}
                    aspectRatio="3/4"
                    sizes="(min-width: 64em) 20vw, (min-width: 40em) 30vw, 90vw"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <h3 className="mt-3 font-mono text-xs uppercase tracking-widest">
                {product.title}
              </h3>
              <span className="mt-1 inline-block font-mono text-[10px] uppercase tracking-widest text-signal">
                <Money data={product.priceRange.minVariantPrice} /> →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
