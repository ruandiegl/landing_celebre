import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSession } from '../../src/server/admin-auth.js';
import { clearAdminCookieHeaders } from '../../src/server/admin-cookies.js';
import { assertCsrf, assertSameOrigin } from '../../src/server/request-security.js';
import { getAppConfig, requireMethod, runApiHandler, sendNoContent } from '../../src/server/vercel-http.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  const config = getAppConfig(response);
  if (!config) return;
  await runApiHandler(request, response, async (adminRequest) => {
    requireMethod(adminRequest, 'POST');
    assertSameOrigin(adminRequest, config);
    getAdminSession(adminRequest, config);
    assertCsrf(adminRequest);
    response.setHeader(
      'Set-Cookie',
      clearAdminCookieHeaders(config.isProduction),
    );
    sendNoContent(response);
  });
}
