import {Form, data, useActionData, useNavigation} from 'react-router';
import type {Route} from './+types/contact';
import {createContactSubmission} from '~/lib/contact.server';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.CO | Contact'}];
};

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const result = await createContactSubmission(context.env, formData);
  return data(result, {status: result.ok ? 200 : 400});
}

export default function ContactRoute() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  const submitted = actionData?.ok;

  return (
    <div className="-mx-4 -mb-4 bg-black text-paper">
      <section className="mx-auto max-w-[1800px] px-6 py-20 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          Get in touch
        </p>
        <h1 className="font-heading text-[16vw] leading-[1.05] sm:text-[clamp(3rem,9vw,6.5rem)]">
          Say something.
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="max-w-lg text-sm leading-relaxed text-paper/80">
              Questions about an order, a collab pitch, press, wholesale --
              whatever it is, this reaches us directly.
            </p>

            <dl className="mt-10 space-y-6 font-mono text-xs uppercase tracking-widest text-paper/60">
              <div>
                <dt className="text-paper/60">Email</dt>
                <dd className="mt-1 text-paper">hello@fye.co</dd>
              </div>
              <div>
                <dt className="text-paper/60">Based in</dt>
                <dd className="mt-1 text-paper">Orlando, FL</dd>
              </div>
              <div>
                <dt className="text-paper/60">Response time</dt>
                <dd className="mt-1 text-paper">1-3 business days</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl bg-steel/20 p-6 sm:p-8">
            {submitted ? (
              <p className="font-mono text-sm uppercase tracking-widest text-signal">
                Message sent. We&rsquo;ll get back to you soon.
              </p>
            ) : (
              <Form method="post" className="flex flex-col gap-5">
                <label className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest text-paper/60">
                  Name
                  <input
                    name="name"
                    required
                    className="rounded-xl border border-paper/15 bg-black px-4 py-3 text-sm normal-case tracking-normal text-paper"
                  />
                </label>
                <label className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest text-paper/60">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    className="rounded-xl border border-paper/15 bg-black px-4 py-3 text-sm normal-case tracking-normal text-paper"
                  />
                </label>
                <label className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest text-paper/60">
                  Message
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="rounded-xl border border-paper/15 bg-black px-4 py-3 text-sm normal-case tracking-normal text-paper"
                  />
                </label>

                {actionData?.error && (
                  <p className="font-mono text-xs uppercase tracking-widest text-signal">
                    {actionData.error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Sending…' : 'Send message'}
                </button>
              </Form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
