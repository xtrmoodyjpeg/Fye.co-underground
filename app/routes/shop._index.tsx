import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/shop._index';
import {getProducts} from '~/lib/products.server';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.CO | Shop'}];
};

export async function loader() {
  const products = await getProducts();
  return {products};
}

export default function ShopIndexRoute() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="-mx-4 -mb-4 bg-black text-paper">
      <section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          Drop 02
        </p>
        <h1 className="-rotate-1 font-display text-[16vw] leading-[1.05] sm:text-[9vw]">
          Shop
        </h1>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
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
      </section>
    </div>
  );
}
