import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import {
  authenticateAdmin,
  type AdminRequest,
} from '../../src/server/admin-auth.js';
import {
  buildAdminCookieHeaders,
  createCsrfToken,
} from '../../src/server/admin-cookies.js';
import { getAppConfig, requireMethod, readJsonBody, runApiHandler, sendJson } from '../../src/server/vercel-http.js';
import { assertSameOrigin, getClientIp } from '../../src/server/request-security.js';
import { createRateLimiter } from '../../src/server/rate-limit.js';
import { ApiError } from '../../src/server/http-errors.js';

const loginSchema = z.object({
  username: z.string().min(1).max(80),
  password: z.string().min(1).max(256),
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  const config = getAppConfig(response);
  if (!config) return;
  await runApiHandler(request, response, async (adminRequest: AdminRequest) => {
    requireMethod(adminRequest, 'POST');
    assertSameOrigin(adminRequest, config);
    const parsed = loginSchema.safeParse(readJsonBody(adminRequest));
    if (!parsed.success) {
      throw new ApiError(422, 'INVALID_LOGIN', 'Credenciais inválidas.');
    }
    const body = parsed.data;
    await createRateLimiter(config).enforceLimit(
      `login:${getClientIp(adminRequest)}:${body.username.toLowerCase()}`,
      5,
      15 * 60,
    );
    const { session, token } = await authenticateAdmin(
      body.username,
      body.password,
      config,
    );
    const csrf = createCsrfToken();
    response.setHeader(
      'Set-Cookie',
      buildAdminCookieHeaders(token, csrf, config.isProduction),
    );
    sendJson(response, 200, { session });
  });
}
