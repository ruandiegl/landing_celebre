import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readContentDocument } from '../src/server/blob-content.js';
import { getAppConfig, requireMethod, runApiHandler, sendJson } from '../src/server/vercel-http.js';
import { ApiError } from '../src/server/http-errors.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  const config = getAppConfig(response);
  if (!config) return;
  await runApiHandler(request, response, async (adminRequest) => {
    requireMethod(adminRequest, 'GET');
    const document = await readContentDocument(config);
    if (!document) {
      throw new ApiError(404, 'CONTENT_NOT_FOUND', 'Conteúdo publicado não encontrado.');
    }
    sendJson(response, 200, document);
  });
}
