import {useState} from 'react';
import {Form, useActionData, useNavigation} from 'react-router';
import type {ClientCamSubmission} from '~/lib/clientCam.server';

export function ClientCam({photos}: {photos: ClientCamSubmission[]}) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const actionData = useActionData<{ok: boolean; error?: string}>();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  const justSubmitted = actionData?.ok === true;

  const looped = photos.length ? [...photos, ...photos] : [];

  return (
    <section
      id="client-cam"
      className="border-t border-paper/10 bg-black py-20 text-paper"
    >
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-signal">
              Client Cam
            </p>
            <h2 className="mt-2 -rotate-1 font-display text-5xl sm:text-6xl">
              Show us how you wear it.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setUploadOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper hover:opacity-90"
          >
            {uploadOpen ? 'Close' : 'Upload your photo'}
          </button>
        </div>

        {uploadOpen && (
          <div className="mt-8 max-w-lg rounded-2xl bg-steel/20 p-6">
            {justSubmitted ? (
              <p className="font-mono text-sm uppercase tracking-widest text-signal">
                Thanks! Your photo is in review and will appear here once
                approved.
              </p>
            ) : (
              <Form
                method="post"
                encType="multipart/form-data"
                className="flex flex-col gap-4"
              >
                <label className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest text-paper/60">
                  Photo
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    className="text-sm normal-case tracking-normal text-paper"
                  />
                </label>
                <label className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest text-paper/60">
                  Name or handle (optional)
                  <input
                    name="clientName"
                    className="rounded-xl border border-paper/15 bg-black px-4 py-3 text-sm normal-case tracking-normal text-paper"
                  />
                </label>
                <label className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest text-paper/60">
                  Caption (optional)
                  <input
                    name="caption"
                    className="rounded-xl border border-paper/15 bg-black px-4 py-3 text-sm normal-case tracking-normal text-paper"
                  />
                </label>

                {actionData?.error && (
                  <p className="font-mono text-xs uppercase tracking-widest text-signal">
                    {actionData.error}
                  </p>
                )}

                <p className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-paper/40">
                  Photos are reviewed before they appear publicly.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Submitting…' : 'Submit photo'}
                </button>
              </Form>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 overflow-hidden">
        {looped.length ? (
          <div className="flex w-max animate-site-ticker gap-4">
            {looped.map((photo, index) => (
              <div
                key={`${photo.id}-${index}`}
                className="h-40 w-40 flex-none overflow-hidden rounded-2xl bg-steel sm:h-52 sm:w-52"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || photo.clientName || 'Client photo'}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="px-6 font-mono text-xs uppercase tracking-widest text-paper/40 sm:px-10">
            No client photos yet -- be the first to post.
          </p>
        )}
      </div>
    </section>
  );
}
