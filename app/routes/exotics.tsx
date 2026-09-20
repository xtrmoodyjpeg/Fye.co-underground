import {useLoaderData} from 'react-router';
import type {Route} from './+types/exotics';
import {ExoticsTicker} from '~/components/exotics/ExoticsTicker';
import {ExoticsHeader} from '~/components/exotics/ExoticsHeader';
import {ExoticsHero} from '~/components/exotics/ExoticsHero';
import {FactGenerator} from '~/components/exotics/FactGenerator';
import {SpecimenEditorial} from '~/components/exotics/SpecimenEditorial';
import {LiveArchive} from '~/components/exotics/LiveArchive';
import {ExoticsManifesto} from '~/components/exotics/ExoticsManifesto';
import {ExoticsFooter} from '~/components/exotics/ExoticsFooter';
import {getSpecimens} from '~/lib/specimens.server';

const OG_IMAGE = '/exotics/exotics-python.webp';

export const meta: Route.MetaFunction = ({location}) => {
  const title = 'FYE.EXOTICS — Reptile Archive by FYE.CO';
  const description =
    'Explore FYE.EXOTICS, a reptile archive featuring strange facts, specimen photography, species information, and future live-animal releases.';

  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: location.pathname},
    {property: 'og:image', content: OG_IMAGE},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image', content: OG_IMAGE},
  ];
};

export async function loader() {
  const specimens = await getSpecimens();
  return {specimens};
}

export default function ExoticsRoute() {
  const {specimens} = useLoaderData<typeof loader>();

  return (
    <div className="bg-void">
      <ExoticsTicker />
      <ExoticsHeader />
      <main>
        <ExoticsHero />
        <FactGenerator />
        <SpecimenEditorial />
        <LiveArchive specimens={specimens} />
        <ExoticsManifesto />
      </main>
      <ExoticsFooter />
    </div>
  );
}
