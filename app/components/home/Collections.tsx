import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {ProductCardItemFragment} from 'storefrontapi.generated';

const CATEGORIES = [
  {name: 'Outerwear', tagline: 'Built for real ones', handle: 'fc-dino-track-jacket'},
  {name: 'Tops', tagline: 'Graphics with attitude', handle: 'i-love-fc-tee'},
  {name: 'Accessories', tagline: 'Finish the fit', handle: 'fye-co-crew-socks-red-logo'},
];

export function Collections({
  products,
}: {
  products: ProductCardItemFragment[];
}) {
  const byHandle = new Map(products.map((product) => [product.handle, product]));
  const tiles = CATEGORIES.map((category) => ({
    ...category,
    product: byHandle.get(category.handle),
  })).filter((tile) => tile.product);

  if (!tiles.length) return null;

  return (
    <section className="bg-black px-6 py-20 text-paper sm:px-10">
      <div className="mx-auto max-w-[1800px]">
        <h2 className="-rotate-1 font-heading text-5xl sm:text-6xl">
          Shop by category
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile) => (
            <div
              key={tile.name}
              className="relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-steel/70 p-6"
            >
              {tile.product!.featuredImage && (
                <Image
                  data={tile.product!.featuredImage}
                  aspectRatio="4/5"
                  sizes="(min-width: 45em) 33vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"
              />
              <div className="relative z-10">
                <h3 className="font-heading text-3xl">{tile.name}</h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-paper/70">
                  {tile.tagline}
                </p>
                <Link
                  to={`/shop/${tile.product!.handle}`}
                  prefetch="intent"
                  className="mt-4 inline-flex items-center gap-1 rounded-full bg-signal px-4 py-2 font-mono text-[10px] uppercase tracking-widest"
                >
                  Shop →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
