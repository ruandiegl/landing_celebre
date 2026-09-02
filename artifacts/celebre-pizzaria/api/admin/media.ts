import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getAdminSession } from '../../src/server/admin-auth';
import { assertCsrf, assertSameOrigin } from '../../src/server/request-security';
import { createRateLimiter } from '../../src/server/rate-limit';
import { listMedia, removeMedia } from '../../src/server/blob-media';
import { ApiError } from '../../src/server/http-errors';
import { getAppConfig, readJsonBody, requireMethod, runApiHandler, sendJson, sendNoContent } from '../../src/server/vercel-http';

const removeSchema = z.object({ pathname: z.string().min(1).max(512) });

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  const config = getAppConfig(response);
  if (!config) return;
  await runApiHandler(request, response, async (adminRequest) => {
    const session = getAdminSession(adminRequest, config);
    if ((adminRequest.method ?? '').toUpperCase() === 'GET') {
      await createRateLimiter(config).enforceLimit(`media:${session.username}`, 60, 60);
      sendJson(response, 200, { assets: await listMedia(config) });
      return;
    }
    requireMethod(adminRequest, 'DELETE');
    assertSameOrigin(adminRequest, config);
    assertCsrf(adminRequest);
    await createRateLimiter(config).enforceLimit(`media:${session.username}`, 60, 60);
    const parsed = removeSchema.safeParse(readJsonBody(adminRequest));
    if (!parsed.success) throw new ApiError(422, 'INVALID_MEDIA_PATH', 'Caminho de imagem inválido.');
    await removeMedia(config, parsed.data.pathname);
    sendNoContent(response);
  });
}
