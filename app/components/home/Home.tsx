import {Hero} from './Hero';
import {Shop} from './Shop';
import {SeenSection} from './SeenSection';
import {Collections} from './Collections';
import {Manifesto} from './Manifesto';
import {BrandConnection} from './BrandConnection';
import type {ProductCardItemFragment} from 'storefrontapi.generated';

export function Home({products}: {products: ProductCardItemFragment[]}) {
  return (
    <>
      <Hero />
      <Manifesto />
      <SeenSection products={products} />
      <BrandConnection />
      <Shop products={products} />
      <Collections products={products} />
    </>
  );
}
