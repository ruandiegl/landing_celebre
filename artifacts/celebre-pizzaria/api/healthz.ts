import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applySecurityHeaders } from '../src/server/response-security';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
): void {
  applySecurityHeaders(response);
  if (request.method !== 'GET') {
    response.status(405).json({
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' },
    });
    return;
  }
  response.status(200).json({ status: 'ok' });
}
