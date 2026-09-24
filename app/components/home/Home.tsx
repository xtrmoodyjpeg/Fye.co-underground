import {Hero} from './Hero';
import {Shop} from './Shop';
import {SeenSection} from './SeenSection';
import {Collections} from './Collections';
import {Manifesto} from './Manifesto';
import {BrandConnection} from './BrandConnection';
import {ClientCam} from './ClientCam';
import type {ProductCardItemFragment} from 'storefrontapi.generated';
import type {ClientCamSubmission} from '~/lib/clientCam.server';

export function Home({
  products,
  clientCamPhotos,
}: {
  products: ProductCardItemFragment[];
  clientCamPhotos: ClientCamSubmission[];
}) {
  return (
    <>
      <Hero />
      <Manifesto />
      <SeenSection products={products} />
      <BrandConnection />
      <Shop products={products} />
      <Collections products={products} />
      <ClientCam photos={clientCamPhotos} />
    </>
  );
}
