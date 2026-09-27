import {useLoaderData, useSearchParams, Form, data} from 'react-router';
import type {Route} from './+types/admin.animals';
import {
  getAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} from '~/lib/animalContent.server';
import type {AnimalCategory, AnimalStatus} from '~/data/animalContent';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.EXOTICS | Admin — Meet The Fam'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const animals = await getAnimals(context.storefront);
  return {animals};
}

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'delete') {
    const handle = String(formData.get('handle'));
    const result = await deleteAnimal(context.env, handle);
    return data(result);
  }

  if (intent === 'update') {
    const handle = String(formData.get('handle'));
    const result = await updateAnimal(context.env, handle, formData);
    return data(result, {status: result.ok ? 200 : 400});
  }

  // intent === 'create'
  const result = await createAnimal(context.env, formData);
  return data(result, {status: result.ok ? 200 : 400});
}

const CATEGORY_OPTIONS: AnimalCategory[] = [
  'Amphibian',
  'Lizard',
  'Snake',
  'Invertebrate',
];
const STATUS_OPTIONS: AnimalStatus[] = [
  'Coming Soon',
  'In Our Care',
  'Breeding Project',
];

const inputClass =
  'border border-bone/30 bg-void px-3 py-2 text-sm normal-case tracking-normal text-bone placeholder:text-fog';
const labelClass =
  'flex flex-col gap-1 font-mono text-xs uppercase tracking-widest text-bone/70';

export default function AdminAnimalsRoute() {
  const {animals} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const editing = editId ? animals.find((a) => a.id === editId) : null;

  return (
    <div className="min-h-screen bg-void text-bone">
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <p className="font-mono text-xs uppercase tracking-widest text-acid">
          FYE.EXOTICS Admin
        </p>
        <h1 className="mt-2 font-exotic-headline text-4xl uppercase">
          Meet The Fam
        </h1>
        <p className="mt-2 max-w-xl text-sm text-bone/60">
          Manage the animal profile cards shown on{' '}
          <a href="/exotics#species" className="text-acid hover:underline">
            /exotics
          </a>
          . Cards render in Sort Order, lowest first.
        </p>

        <table className="mt-8 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-bone/20 font-mono text-xs uppercase tracking-widest text-bone/60">
              <th className="py-2 pr-4">Image</th>
              <th className="py-2 pr-4">Animal</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Order</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {animals.map((animal) => (
              <tr key={animal.id} className="border-b border-bone/10">
                <td className="py-3 pr-4">
                  {animal.images[0] ? (
                    <img
                      src={animal.images[0]}
                      alt={animal.commonName}
                      className="h-14 w-14 object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center border border-bone/15 font-mono text-[9px] uppercase text-fog">
                      No photo
                    </div>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <div>{animal.commonName}</div>
                  <div className="font-mono text-[10px] italic text-fog">
                    {animal.scientificName}
                  </div>
                </td>
                <td className="py-3 pr-4">{animal.category}</td>
                <td className="py-3 pr-4 text-acid">{animal.status}</td>
                <td className="py-3 pr-4">{animal.sortOrder}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-3 font-mono text-xs uppercase tracking-widest">
                    <a
                      href={`/admin/animals?edit=${animal.id}`}
                      className="hover:text-acid"
                    >
                      Edit
                    </a>
                    <Form
                      method="post"
                      onSubmit={(e) => {
                        if (!confirm(`Delete "${animal.commonName}"?`))
                          e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="handle" value={animal.id} />
                      <button type="submit" className="text-red-500">
                        Delete
                      </button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
            {!animals.length && (
              <tr>
                <td colSpan={6} className="py-6 text-bone/50">
                  No animals yet. Add one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-12 border-t border-bone/20 pt-8">
          <h2 className="font-exotic-headline text-2xl uppercase">
            {editing ? `Edit: ${editing.commonName}` : 'Add an animal'}
          </h2>
          <Form
            method="post"
            encType="multipart/form-data"
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
            key={editing?.id ?? 'new'}
          >
            <input
              type="hidden"
              name="intent"
              value={editing ? 'update' : 'create'}
            />
            {editing && (
              <input type="hidden" name="handle" value={editing.id} />
            )}

            <label className={labelClass}>
              Common Name
              <input
                name="common_name"
                defaultValue={editing?.commonName}
                required
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Scientific Name
              <input
                name="scientific_name"
                defaultValue={editing?.scientificName ?? ''}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Type
              <select
                name="animal_type"
                defaultValue={editing?.category ?? 'Lizard'}
                className={inputClass}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Status
              <select
                name="status"
                defaultValue={editing?.status ?? 'Coming Soon'}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Sort Order
              <input
                name="sort_order"
                type="number"
                defaultValue={editing?.sortOrder}
                placeholder={editing ? String(editing.sortOrder) : 'auto'}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Lifespan
              <input
                name="lifespan"
                defaultValue={editing?.lifespan ?? ''}
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} col-span-full`}>
              Native Range
              <textarea
                name="native_range"
                defaultValue={editing?.location}
                rows={2}
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} col-span-full`}>
              Lifestyle (Day In The Life)
              <textarea
                name="lifestyle"
                defaultValue={editing?.lifestyle}
                rows={2}
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} col-span-full`}>
              Diet (What's For Dinner)
              <textarea
                name="diet"
                defaultValue={editing?.diet ?? ''}
                rows={2}
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} col-span-full`}>
              Behavior (Personality)
              <textarea
                name="behavior"
                defaultValue={editing?.behavior ?? ''}
                rows={2}
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} col-span-full`}>
              Fun Fact
              <textarea
                name="fun_fact"
                defaultValue={editing?.funFact ?? ''}
                rows={2}
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} col-span-full`}>
              FYE Note (Breeding Project Callout)
              <textarea
                name="fye_note"
                defaultValue={editing?.breedingNote ?? ''}
                rows={2}
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} col-span-full`}>
              {editing ? 'Replace photo (optional)' : 'Photo'}
              <input
                name="photoss"
                type="file"
                accept="image/*"
                className="text-sm normal-case tracking-normal text-bone"
              />
            </label>

            <div className="col-span-full flex gap-4">
              <button
                type="submit"
                className="bg-acid px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black hover:bg-bone"
              >
                {editing ? 'Save changes' : 'Add animal'}
              </button>
              {editing && (
                <a
                  href="/admin/animals"
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
