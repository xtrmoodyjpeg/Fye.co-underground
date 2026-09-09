import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Home} from '~/components/home/Home';
import {MockShopNotice} from '~/components/MockShopNotice';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.CO | For Your Eyes'}];
};

export async function loader({context}: Route.LoaderArgs) {
  return {isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN)};
}

export default function Homepage() {
  const {isShopLinked} = useLoaderData<typeof loader>();
  return (
    <>
      {isShopLinked ? null : <MockShopNotice />}
      {/* Cancels reset.css's `body > main` gutter so full-bleed sections
          reach the true viewport edge instead of sitting inset by 1rem. */}
      <div className="-mx-4 -mb-4 bg-black">
        <Home />
      </div>
    </>
  );
}
