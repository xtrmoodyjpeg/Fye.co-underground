import {useLoaderData, useSearchParams, Form, data} from 'react-router';
import type {Route} from './+types/admin.products';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '~/lib/products.server';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.CO | Admin — Products'}];
};

export async function loader() {
  const products = await getProducts();
  return {products};
}

export async function action({request}: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'delete') {
    const handle = String(formData.get('handle'));
    const result = await deleteProduct(handle);
    return data(result);
  }

  if (intent === 'update') {
    const handle = String(formData.get('handle'));
    const result = await updateProduct(handle, formData);
    return data(result, {status: result.ok ? 200 : 400});
  }

  // intent === 'create'
  const result = await createProduct(formData);
  return data(result, {status: result.ok ? 200 : 400});
}

export default function AdminProductsRoute() {
  const {products} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const editHandle = searchParams.get('edit');
  const editing = editHandle ? products.find((p) => p.handle === editHandle) : null;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-[1000px] px-6 py-12">
        <p className="font-mono text-xs uppercase tracking-widest text-steel-light">
          FYE.CO Admin
        </p>
        <h1 className="mt-2 font-display text-4xl">Products</h1>

        <table className="mt-8 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/20 font-mono text-xs uppercase tracking-widest">
              <th className="py-2 pr-4">Image</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.handle} className="border-b border-ink/10">
                <td className="py-3 pr-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                </td>
                <td className="py-3 pr-4">{product.name}</td>
                <td className="py-3 pr-4 text-steel-light">{product.category}</td>
                <td className="py-3 pr-4">
                  {product.price ? `$${product.price}` : 'TBD'}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex gap-3 font-mono text-xs uppercase tracking-widest">
                    <a href={`/admin/products?edit=${product.handle}`}>Edit</a>
                    <Form method="post" onSubmit={(e) => {
                      if (!confirm(`Delete "${product.name}"?`)) e.preventDefault();
                    }}>
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="handle" value={product.handle} />
                      <button type="submit" className="text-signal">
                        Delete
                      </button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 border-t border-ink/20 pt-8">
          <h2 className="font-display text-2xl">
            {editing ? `Edit: ${editing.name}` : 'Add a product'}
          </h2>
          <Form
            method="post"
            encType="multipart/form-data"
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
            key={editing?.handle ?? 'new'}
          >
            <input type="hidden" name="intent" value={editing ? 'update' : 'create'} />
            {editing && <input type="hidden" name="handle" value={editing.handle} />}

            <label className="flex flex-col gap-1 font-mono text-xs uppercase tracking-widest">
              Name
              <input
                name="name"
                defaultValue={editing?.name}
                required
                className="border border-ink/30 bg-paper px-3 py-2 text-sm normal-case tracking-normal"
              />
            </label>

            <label className="flex flex-col gap-1 font-mono text-xs uppercase tracking-widest">
              Category
              <input
                name="category"
                defaultValue={editing?.category}
                className="border border-ink/30 bg-paper px-3 py-2 text-sm normal-case tracking-normal"
              />
            </label>

            <label className="flex flex-col gap-1 font-mono text-xs uppercase tracking-widest">
              Colorway
              <input
                name="colorway"
                defaultValue={editing?.colorway}
                className="border border-ink/30 bg-paper px-3 py-2 text-sm normal-case tracking-normal"
              />
            </label>

            <label className="col-span-full flex flex-col gap-1 font-mono text-xs uppercase tracking-widest">
              Sizes
              <input
                name="sizes"
                defaultValue={editing?.sizes ?? ''}
                placeholder="e.g. Small–XXL, true to size"
                className="border border-ink/30 bg-paper px-3 py-2 text-sm normal-case tracking-normal"
              />
            </label>

            <label className="flex flex-col gap-1 font-mono text-xs uppercase tracking-widest">
              Price (USD, blank = TBD)
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={editing?.price ?? ''}
                className="border border-ink/30 bg-paper px-3 py-2 text-sm normal-case tracking-normal"
              />
            </label>

            <label className="col-span-full flex flex-col gap-1 font-mono text-xs uppercase tracking-widest">
              Description
              <textarea
                name="description"
                defaultValue={editing?.description}
                rows={3}
                className="border border-ink/30 bg-paper px-3 py-2 text-sm normal-case tracking-normal"
              />
            </label>

            <label className="col-span-full flex flex-col gap-1 font-mono text-xs uppercase tracking-widest">
              {editing ? 'Replace photo (optional)' : 'Photo'}
              <input
                name="image"
                type="file"
                accept="image/*"
                required={!editing}
                className="text-sm normal-case tracking-normal"
              />
            </label>

            <div className="col-span-full flex gap-4">
              <button
                type="submit"
                className="bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper"
              >
                {editing ? 'Save changes' : 'Add product'}
              </button>
              {editing && (
                <a
                  href="/admin/products"
                  className="font-mono text-xs uppercase tracking-widest text-steel-light"
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
