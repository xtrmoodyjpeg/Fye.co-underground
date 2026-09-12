import {Link, useLoaderData, data} from 'react-router';
import type {Route} from './+types/shop.$handle';
import {getProduct} from '~/lib/products.server';

export const meta: Route.MetaFunction = ({data: loaderData}) => {
  return [
    {
      title: loaderData
        ? `FYE.CO | ${loaderData.product.name}`
        : 'FYE.CO | Shop',
    },
  ];
};

export async function loader({params}: Route.LoaderArgs) {
  const product = params.handle ? await getProduct(params.handle) : null;
  if (!product) {
    throw data('Product not found', {status: 404});
  }
  return {product};
}

export default function ShopProductRoute() {
  const {product} = useLoaderData<typeof loader>();

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
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-paper">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-paper/60">
              {product.category}
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 font-mono text-sm uppercase tracking-widest text-signal">
              {product.price ? `$${product.price}` : 'Price TBD'}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-paper/60">
              Colorway: {product.colorway}
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-paper/80">
              {product.description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
