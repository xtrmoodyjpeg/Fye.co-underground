import {Hero} from './Hero';
import {Shop} from './Shop';
import {SeenSection} from './SeenSection';
import {Collections} from './Collections';
import {BrandConnection} from './BrandConnection';
import {ClientCam} from './ClientCam';
import {Preloader} from './Preloader';
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
      <Preloader />
      <Hero />
      <Shop products={products} />
      <SeenSection products={products} />
      <Collections products={products} />
      <BrandConnection />
      <ClientCam photos={clientCamPhotos} />
    </>
  );
}
