import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getAdminSession } from '../../src/server/admin-auth';
import { assertCsrf, assertSameOrigin } from '../../src/server/request-security';
import { createRateLimiter } from '../../src/server/rate-limit';
import { resolveDefaultContentFromBlob, readContentDocument, saveContentDocument } from '../../src/server/blob-content';
import { getAppConfig, readJsonBody, requireMethod, runApiHandler, sendJson } from '../../src/server/vercel-http';
import { ApiError } from '../../src/server/http-errors';

const resetSchema = z.object({ revision: z.string().max(512).optional() });

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  const config = getAppConfig(response);
  if (!config) return;
  await runApiHandler(request, response, async (adminRequest) => {
    requireMethod(adminRequest, 'POST');
    assertSameOrigin(adminRequest, config);
    const session = getAdminSession(adminRequest, config);
    assertCsrf(adminRequest);
    await createRateLimiter(config).enforceLimit(`content:${session.username}`, 30, 60);
    const body = resetSchema.safeParse(
      adminRequest.body ? readJsonBody(adminRequest) : {},
    );
    if (!body.success) throw new ApiError(422, 'CONTENT_INVALID', 'Requisição inválida.');
    const current = await readContentDocument(config);
    const expectedRevision = body.data.revision ?? current?.revision;
    const content = await resolveDefaultContentFromBlob(config);
    const document = await saveContentDocument(config, content, expectedRevision);
    sendJson(response, 200, document);
  });
}
