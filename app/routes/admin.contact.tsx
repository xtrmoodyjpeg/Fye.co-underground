import {Form, useLoaderData, data} from 'react-router';
import type {Route} from './+types/admin.contact';
import {
  getContactSubmissions,
  updateContactSubmission,
  deleteContactSubmission,
} from '~/lib/contact.server';
import {requireAdminAuth} from '~/lib/adminAuth.server';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.CO | Admin — Contact'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  requireAdminAuth(request, context.env);
  const submissions = await getContactSubmissions(context.env);
  return {submissions};
}

export async function action({request, context}: Route.ActionArgs) {
  requireAdminAuth(request, context.env);
  const formData = await request.formData();
  const intent = formData.get('intent');
  const id = String(formData.get('id'));

  if (intent === 'delete') {
    const result = await deleteContactSubmission(context.env, id);
    return data(result);
  }

  if (intent === 'mark-read') {
    const result = await updateContactSubmission(context.env, id, 'read');
    return data(result);
  }

  return data({ok: false}, {status: 400});
}

export default function AdminContactRoute() {
  const {submissions} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-black px-6 py-12 text-paper sm:px-10">
      <div className="mx-auto max-w-[900px]">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          FYE.CO Admin
        </p>
        <h1 className="mt-2 font-heading text-4xl">Contact inbox</h1>

        <div className="mt-8 flex flex-col gap-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className={`rounded-2xl border p-5 ${
                submission.status === 'new'
                  ? 'border-signal/40 bg-signal/5'
                  : 'border-paper/10 bg-steel/10'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs uppercase tracking-widest text-paper/60">
                <span>{new Date(submission.submittedAt).toLocaleString()}</span>
                <span className={submission.status === 'new' ? 'text-signal' : ''}>
                  {submission.status}
                </span>
              </div>
              <p className="mt-2 font-mono text-sm">
                {submission.name} &lt;{submission.email}&gt;
              </p>
              <p className="mt-2 text-sm leading-relaxed text-paper/80">
                {submission.message}
              </p>
              <div className="mt-4 flex gap-4 font-mono text-xs uppercase tracking-widest">
                {submission.status === 'new' && (
                  <Form method="post">
                    <input type="hidden" name="intent" value="mark-read" />
                    <input type="hidden" name="id" value={submission.id} />
                    <button type="submit" className="hover:text-signal">
                      Mark read
                    </button>
                  </Form>
                )}
                <Form
                  method="post"
                  onSubmit={(e) => {
                    if (!confirm('Delete this message?')) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="intent" value="delete" />
                  <input type="hidden" name="id" value={submission.id} />
                  <button type="submit" className="text-red-500">
                    Delete
                  </button>
                </Form>
              </div>
            </div>
          ))}
          {!submissions.length && (
            <p className="text-paper/50">No messages yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
