import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminSession } from '../../src/server/admin-auth';
import { clearAdminCookieHeaders } from '../../src/server/admin-cookies';
import { assertCsrf, assertSameOrigin } from '../../src/server/request-security';
import { getAppConfig, requireMethod, runApiHandler, sendNoContent } from '../../src/server/vercel-http';

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
