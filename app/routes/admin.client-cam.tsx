import {Form, useLoaderData, data} from 'react-router';
import type {Route} from './+types/admin.client-cam';
import {
  getClientCamSubmissions,
  updateClientCamSubmission,
  deleteClientCamSubmission,
} from '~/lib/clientCam.server';
import {requireAdminAuth} from '~/lib/adminAuth.server';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.CO | Admin — Client Cam'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  requireAdminAuth(request, context.env);
  const submissions = await getClientCamSubmissions(context.env);
  return {submissions};
}

export async function action({request, context}: Route.ActionArgs) {
  requireAdminAuth(request, context.env);
  const formData = await request.formData();
  const intent = formData.get('intent');
  const id = String(formData.get('id'));

  if (intent === 'delete') {
    return data(await deleteClientCamSubmission(context.env, id));
  }
  if (intent === 'approve') {
    return data(await updateClientCamSubmission(context.env, id, 'approved'));
  }
  if (intent === 'reject') {
    return data(await updateClientCamSubmission(context.env, id, 'rejected'));
  }

  return data({ok: false}, {status: 400});
}

function Group({
  title,
  submissions,
  children,
}: {
  title: string;
  submissions: unknown[];
  children: React.ReactNode;
}) {
  if (!submissions.length) return null;
  return (
    <div className="mt-10">
      <h2 className="font-mono text-xs uppercase tracking-widest text-paper/50">
        {title} ({submissions.length})
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

export default function AdminClientCamRoute() {
  const {submissions} = useLoaderData<typeof loader>();
  const pending = submissions.filter((s) => s.status === 'pending');
  const approved = submissions.filter((s) => s.status === 'approved');
  const rejected = submissions.filter((s) => s.status === 'rejected');

  return (
    <div className="min-h-screen bg-black px-6 py-12 text-paper sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          FYE.CO Admin
        </p>
        <h1 className="mt-2 font-heading text-4xl">Client Cam</h1>
        <p className="mt-2 max-w-xl text-sm text-paper/60">
          Approve photos to add them to the live ticker on the homepage.
        </p>

        <Group title="Pending review" submissions={pending}>
          {pending.map((submission) => (
            <div key={submission.id} className="rounded-xl bg-steel/20 p-3">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-steel">
                <img
                  src={submission.imageUrl}
                  alt={submission.caption || 'Client submission'}
                  className="h-full w-full object-cover"
                />
              </div>
              {submission.clientName && (
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-paper/70">
                  {submission.clientName}
                </p>
              )}
              {submission.caption && (
                <p className="mt-1 text-xs text-paper/60">{submission.caption}</p>
              )}
              <div className="mt-3 flex gap-3 font-mono text-[10px] uppercase tracking-widest">
                <Form method="post">
                  <input type="hidden" name="intent" value="approve" />
                  <input type="hidden" name="id" value={submission.id} />
                  <button type="submit" className="text-signal">
                    Approve
                  </button>
                </Form>
                <Form method="post">
                  <input type="hidden" name="intent" value="reject" />
                  <input type="hidden" name="id" value={submission.id} />
                  <button type="submit" className="text-paper/50 hover:text-paper">
                    Reject
                  </button>
                </Form>
              </div>
            </div>
          ))}
        </Group>

        <Group title="Live on homepage" submissions={approved}>
          {approved.map((submission) => (
            <div key={submission.id} className="rounded-xl bg-steel/20 p-3">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-steel">
                <img
                  src={submission.imageUrl}
                  alt={submission.caption || 'Client submission'}
                  className="h-full w-full object-cover"
                />
              </div>
              <Form
                method="post"
                className="mt-3"
                onSubmit={(e) => {
                  if (!confirm('Remove from the live ticker?')) e.preventDefault();
                }}
              >
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value={submission.id} />
                <button
                  type="submit"
                  className="font-mono text-[10px] uppercase tracking-widest text-red-500"
                >
                  Remove
                </button>
              </Form>
            </div>
          ))}
        </Group>

        <Group title="Rejected" submissions={rejected}>
          {rejected.map((submission) => (
            <div key={submission.id} className="rounded-xl bg-steel/20 p-3 opacity-60">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-steel">
                <img
                  src={submission.imageUrl}
                  alt={submission.caption || 'Client submission'}
                  className="h-full w-full object-cover"
                />
              </div>
              <Form method="post" className="mt-3">
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value={submission.id} />
                <button
                  type="submit"
                  className="font-mono text-[10px] uppercase tracking-widest text-red-500"
                >
                  Delete
                </button>
              </Form>
            </div>
          ))}
        </Group>

        {!submissions.length && (
          <p className="mt-10 text-paper/50">No submissions yet.</p>
        )}
      </div>
    </div>
  );
}
