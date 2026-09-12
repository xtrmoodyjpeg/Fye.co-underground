import {Link} from 'react-router';
import type {Product} from '~/lib/products.server';

export function Shop({products}: {products: Product[]}) {
  return (
    <section className="bg-black px-6 py-20 text-paper sm:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between">
          <h2 className="-rotate-1 font-display text-5xl sm:text-6xl">Shop</h2>
          <Link
            to="/shop"
            prefetch="intent"
            className="font-mono text-xs uppercase tracking-widest text-signal hover:text-paper"
          >
            View all →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.handle}
              to={`/shop/${product.handle}`}
              prefetch="intent"
              className="block"
            >
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-paper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-3 font-mono text-xs uppercase tracking-widest">
                {product.name}
              </h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-paper/60">
                {product.price ? `$${product.price}` : 'Price TBD'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
