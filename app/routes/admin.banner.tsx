import {Form, useLoaderData, useActionData, data} from 'react-router';
import type {Route} from './+types/admin.banner';
import {getBanner, updateBanner} from '~/lib/banner.server';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.CO | Admin — Sticky Banner'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const banner = await getBanner(context.env);
  return {banner};
}

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const result = await updateBanner(context.env, formData);
  return data(result, {status: result.ok ? 200 : 400});
}

export default function AdminBannerRoute() {
  const {banner} = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const current = actionData?.banner ?? banner;

  return (
    <div className="min-h-screen bg-black px-6 py-12 text-paper sm:px-10">
      <div className="mx-auto max-w-[700px]">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          FYE.CO Admin
        </p>
        <h1 className="mt-2 font-display text-4xl">Sticky banner</h1>
        <p className="mt-2 max-w-lg text-sm text-paper/60">
          Shown site-wide when a visitor scrolls back up the page. Use it for
          sales, new arrivals, or announcements.
        </p>

        {actionData?.ok && (
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-signal">
            Saved.
          </p>
        )}

        <Form method="post" className="mt-8 flex flex-col gap-5" key={JSON.stringify(current)}>
          <label className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-paper/60">
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={current.enabled}
            />
            Banner enabled
          </label>

          <label className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest text-paper/60">
            Message
            <input
              name="message"
              defaultValue={current.message}
              placeholder="Drop 02 is live -- new pieces just dropped"
              className="rounded-xl border border-paper/15 bg-black px-4 py-3 text-sm normal-case tracking-normal text-paper"
            />
          </label>

          <label className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest text-paper/60">
            Button label
            <input
              name="ctaLabel"
              defaultValue={current.ctaLabel}
              placeholder="Shop now"
              className="rounded-xl border border-paper/15 bg-black px-4 py-3 text-sm normal-case tracking-normal text-paper"
            />
          </label>

          <label className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest text-paper/60">
            Button link
            <input
              name="ctaHref"
              defaultValue={current.ctaHref}
              placeholder="/shop"
              className="rounded-xl border border-paper/15 bg-black px-4 py-3 text-sm normal-case tracking-normal text-paper"
            />
          </label>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-opacity hover:opacity-90"
          >
            Save changes
          </button>
        </Form>
      </div>
    </div>
  );
}
