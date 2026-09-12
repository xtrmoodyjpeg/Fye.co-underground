import {Hero} from './Hero';
import {Shop} from './Shop';
import {SeenSection} from './SeenSection';
import {Collections} from './Collections';
import type {Product} from '~/lib/products.server';

export function Home({products}: {products: Product[]}) {
  return (
    <>
      <Hero />
      <Shop products={products} />
      <SeenSection />
      <Collections />
    </>
  );
}
