import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applySecurityHeaders } from '../src/server/response-security';

export default function handler(
  _request: VercelRequest,
  response: VercelResponse,
): void {
  applySecurityHeaders(response);
  response.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Endpoint não encontrado.' },
  });
}
