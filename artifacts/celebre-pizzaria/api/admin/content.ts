import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getAdminSession } from '../../src/server/admin-auth';
import { assertCsrf, assertSameOrigin } from '../../src/server/request-security';
import { createRateLimiter } from '../../src/server/rate-limit';
import { contentDocumentSchema, landingContentSchema } from '../../src/server/landing-content-schema';
import { saveContentDocument } from '../../src/server/blob-content';
import { ApiError } from '../../src/server/http-errors';
import { getAppConfig, readJsonBody, requireMethod, runApiHandler, sendJson } from '../../src/server/vercel-http';

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
