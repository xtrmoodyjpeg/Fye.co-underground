import {useLoaderData, useSearchParams, Form, data} from 'react-router';
import type {Route} from './+types/admin.exotics';
import {
  getSpecimens,
  createSpecimen,
  updateSpecimen,
  deleteSpecimen,
} from '~/lib/specimens.server';
import type {SpecimenStatus} from '~/data/specimens';
import {requireAdminAuth} from '~/lib/adminAuth.server';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.EXOTICS | Admin — Live Archive'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  requireAdminAuth(request, context.env);
  const specimens = await getSpecimens(context.storefront);
  return {specimens};
}

export async function action({request, context}: Route.ActionArgs) {
  requireAdminAuth(request, context.env);
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'delete') {
    const slug = String(formData.get('slug'));
    const result = await deleteSpecimen(context.env, slug);
    return data(result);
  }

  if (intent === 'update') {
    const slug = String(formData.get('slug'));
    const result = await updateSpecimen(context.env, slug, formData);
    return data(result, {status: result.ok ? 200 : 400});
  }

  // intent === 'create'
  const result = await createSpecimen(context.env, formData);
  return data(result, {status: result.ok ? 200 : 400});
}

const STATUS_OPTIONS: SpecimenStatus[] = [
  'ARCHIVED',
  'OBSERVATION',
  'COMING SOON',
  'AVAILABLE',
  'RESERVED',
  'SOLD',
  'NOT FOR SALE',
];

const inputClass =
  'border border-bone/30 bg-void px-3 py-2 text-sm normal-case tracking-normal text-bone placeholder:text-fog';
const labelClass =
  'flex flex-col gap-1 font-mono text-xs uppercase tracking-widest text-bone/70';

export default function AdminExoticsRoute() {
  const {specimens} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const editSlug = searchParams.get('edit');
  const editing = editSlug
    ? specimens.find((s) => s.slug === editSlug)
    : null;

  return (
    <div className="min-h-screen bg-void text-bone">
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <p className="font-mono text-xs uppercase tracking-widest text-acid">
          FYE.EXOTICS Admin
        </p>
        <h1 className="mt-2 font-exotic-headline text-4xl uppercase">
          Live Archive
        </h1>
        <p className="mt-2 max-w-xl text-sm text-bone/60">
          Manage the specimen cards shown on{' '}
          <a href="/exotics#archive" className="text-acid hover:underline">
            /exotics
          </a>
          . These are archive records, not a storefront — live animals are
          never added to a cart here.
        </p>

        <table className="mt-8 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-bone/20 font-mono text-xs uppercase tracking-widest text-bone/60">
              <th className="py-2 pr-4">Image</th>
              <th className="py-2 pr-4">Specimen</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {specimens.map((specimen) => (
              <tr key={specimen.slug} className="border-b border-bone/10">
                <td className="py-3 pr-4">
                  <img
                    src={specimen.coverImage}
                    alt={specimen.commonName}
                    className="h-14 w-14 object-cover"
                  />
                </td>
                <td className="py-3 pr-4">
                  <div>{specimen.commonName}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-fog">
                    {specimen.archiveNumber}
                  </div>
                </td>
                <td className="py-3 pr-4 text-acid">{specimen.status}</td>
                <td className="py-3 pr-4">{specimen.price}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-3 font-mono text-xs uppercase tracking-widest">
                    <a
                      href={`/admin/exotics?edit=${specimen.slug}`}
                      className="hover:text-acid"
                    >
                      Edit
                    </a>
                    <Form
                      method="post"
                      onSubmit={(e) => {
                        if (
                          !confirm(`Delete "${specimen.commonName}"?`)
                        )
                          e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="intent" value="delete" />
                      <input
                        type="hidden"
                        name="slug"
                        value={specimen.slug}
                      />
                      <button type="submit" className="text-red-500">
                        Delete
                      </button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
            {!specimens.length && (
              <tr>
                <td colSpan={5} className="py-6 text-bone/50">
                  No specimens yet. Add one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-12 border-t border-bone/20 pt-8">
          <h2 className="font-exotic-headline text-2xl uppercase">
            {editing ? `Edit: ${editing.commonName}` : 'Add a specimen'}
          </h2>
          <Form
            method="post"
            encType="multipart/form-data"
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
            key={editing?.slug ?? 'new'}
          >
            <input
              type="hidden"
              name="intent"
              value={editing ? 'update' : 'create'}
            />
            {editing && (
              <input type="hidden" name="slug" value={editing.slug} />
            )}

            <label className={labelClass}>
              Common Name
              <input
                name="commonName"
                defaultValue={editing?.commonName}
                required
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Scientific Name
              <input
                name="scientificName"
                defaultValue={editing?.scientificName}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Species
              <input
                name="species"
                defaultValue={editing?.species}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Morph
              <input
                name="morph"
                defaultValue={editing?.morph}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Sex
              <select
                name="sex"
                defaultValue={editing?.sex ?? 'UNSEXED'}
                className={inputClass}
              >
                <option value="UNSEXED">Unsexed</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </label>

            <label className={labelClass}>
              Status
              <select
                name="status"
                defaultValue={editing?.status ?? 'OBSERVATION'}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Hatch Date
              <input
                name="hatchDate"
                defaultValue={editing?.hatchDate}
                placeholder="NOT RELEASED"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Age
              <input
                name="age"
                defaultValue={editing?.age}
                placeholder="JUVENILE"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Weight
              <input
                name="weight"
                defaultValue={editing?.weight}
                placeholder="NOT RELEASED"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Feeding Status
              <input
                name="feedingStatus"
                defaultValue={editing?.feedingStatus}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Diet
              <input
                name="diet"
                defaultValue={editing?.diet}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Location
              <input
                name="location"
                defaultValue={editing?.location}
                placeholder="Orlando, FL"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Availability
              <input
                name="availability"
                defaultValue={editing?.availability}
                placeholder="COMING SOON"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Price (blank = NOT RELEASED)
              <input
                name="price"
                defaultValue={editing?.price}
                placeholder="NOT RELEASED"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Temperament
              <input
                name="temperament"
                defaultValue={editing?.temperament}
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} col-span-full`}>
              Description
              <textarea
                name="description"
                defaultValue={editing?.description}
                rows={3}
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} col-span-full`}>
              Health Notes
              <textarea
                name="healthNotes"
                defaultValue={editing?.healthNotes}
                rows={2}
                className={inputClass}
              />
            </label>

            <div className="col-span-full flex flex-wrap gap-6 font-mono text-xs uppercase tracking-widest text-bone/70">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={editing?.featured}
                />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="shippingAvailable"
                  defaultChecked={editing?.shippingAvailable}
                />
                Shipping Available
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="localPickupAvailable"
                  defaultChecked={editing?.localPickupAvailable}
                />
                Local Pickup Available
              </label>
            </div>

            <label className={`${labelClass} col-span-full`}>
              {editing ? 'Replace photo (optional)' : 'Photo'}
              <input
                name="coverImage"
                type="file"
                accept="image/*"
                required={!editing}
                className="text-sm normal-case tracking-normal text-bone"
              />
            </label>

            <div className="col-span-full flex gap-4">
              <button
                type="submit"
                className="bg-acid px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black hover:bg-bone"
              >
                {editing ? 'Save changes' : 'Add specimen'}
              </button>
              {editing && (
                <a
                  href="/admin/exotics"
                  className="font-mono text-xs uppercase tracking-widest text-fog hover:text-bone"
                >
                  Cancel
                </a>
              )}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
