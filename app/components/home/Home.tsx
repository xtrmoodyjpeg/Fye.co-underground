import {Hero} from './Hero';
import {Shop} from './Shop';
import {SeenSection} from './SeenSection';
import {Collections} from './Collections';
import {Preloader} from './Preloader';
import type {ProductCardItemFragment} from 'storefrontapi.generated';

export function Home({products}: {products: ProductCardItemFragment[]}) {
  return (
    <>
      <Preloader />
      <Hero />
      <Shop products={products} />
      <SeenSection />
      <Collections />
    </>
  );
}
