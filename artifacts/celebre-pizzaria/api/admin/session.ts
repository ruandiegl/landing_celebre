import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSession } from '../../src/server/admin-auth.js';
import { getAppConfig, requireMethod, runApiHandler, sendJson } from '../../src/server/vercel-http.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  const config = getAppConfig(response);
  if (!config) return;
  await runApiHandler(request, response, async (adminRequest) => {
    requireMethod(adminRequest, 'GET');
    const session = getAdminSession(adminRequest, config);
    sendJson(response, 200, { session });
  });
}
