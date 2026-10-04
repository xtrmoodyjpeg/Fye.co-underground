// Writes Contact form submissions as Shopify Metaobjects (type
// "contact_submission") via the Admin API. Reviewing/deleting submissions
// happens natively in Shopify Admin > Content > Metaobjects > Contact
// Submission -- this file only handles the public submit form.
import {adminGraphQL, type AdminEnv} from './shopifyAdmin.server';

const TYPE = 'contact_submission';

export async function createContactSubmission(
  env: AdminEnv,
  formData: FormData,
): Promise<{ok: boolean; error?: string}> {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();

  if (!name || !email || !message) {
    return {ok: false, error: 'Name, email, and message are required.'};
  }

  const handle = `contact-${Date.now()}`;
  try {
    const result = await adminGraphQL<{
      metaobjectCreate: {
        metaobject: {id: string} | null;
        userErrors: Array<{message: string}>;
      };
    }>(
      env,
      `mutation CreateContactSubmission($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject { id }
          userErrors { field message }
        }
      }`,
      {
        metaobject: {
          type: TYPE,
          handle,
          fields: [
            {key: 'name', value: name},
            {key: 'email', value: email},
            {key: 'message', value: message},
            {key: 'status', value: 'new'},
            {key: 'submittedAt', value: new Date().toISOString()},
          ],
        },
      },
    );

    if (result.metaobjectCreate.userErrors.length) {
      return {
        ok: false,
        error: result.metaobjectCreate.userErrors.map((e) => e.message).join(', '),
      };
    }
    return {ok: true};
  } catch {
    return {ok: false, error: 'Message failed to send. Try again.'};
  }
}
