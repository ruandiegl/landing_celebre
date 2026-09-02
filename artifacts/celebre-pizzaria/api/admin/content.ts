import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getAdminSession } from '../../src/server/admin-auth.js';
import { assertCsrf, assertSameOrigin } from '../../src/server/request-security.js';
import { createRateLimiter } from '../../src/server/rate-limit.js';
import { contentDocumentSchema, landingContentSchema } from '../../src/server/landing-content-schema.js';
import { saveContentDocument } from '../../src/server/blob-content.js';
import { ApiError } from '../../src/server/http-errors.js';
import { getAppConfig, readJsonBody, requireMethod, runApiHandler, sendJson } from '../../src/server/vercel-http.js';

const mutationSchema = z.object({
  content: landingContentSchema,
  revision: z.string().max(512).optional(),
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  const config = getAppConfig(response);
  if (!config) return;
  await runApiHandler(request, response, async (adminRequest) => {
    requireMethod(adminRequest, 'PUT');
    assertSameOrigin(adminRequest, config);
    const session = getAdminSession(adminRequest, config);
    assertCsrf(adminRequest);
    await createRateLimiter(config).enforceLimit(
      `content:${session.username}`,
      30,
      60,
    );
    const parsed = mutationSchema.safeParse(readJsonBody(adminRequest));
    if (!parsed.success) {
      throw new ApiError(422, 'CONTENT_INVALID', 'Conteúdo inválido.');
    }
    const document = await saveContentDocument(
      config,
      parsed.data.content,
      parsed.data.revision,
    );
    sendJson(response, 200, document);
  });
}
