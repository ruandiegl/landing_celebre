import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { AdminRequest } from './admin-auth.js';
import { loadConfig, type AppConfig } from './config.js';
import { errorBody, ApiError } from './http-errors.js';
import { applySecurityHeaders } from './response-security.js';

export function toAdminRequest(request: VercelRequest): AdminRequest {
  return {
    method: request.method,
    url: request.url,
    headers: request.headers,
    cookies: request.cookies,
    body: request.body,
  };
}

export function getAppConfig(response: VercelResponse): AppConfig | null {
  try {
    return loadConfig();
  } catch (error) {
    applySecurityHeaders(response);
    const body = errorBody(error);
    response.status(error instanceof ApiError ? error.status : 503).json(body);
    return null;
  }
}

export function sendJson(
  response: VercelResponse,
  status: number,
  body: unknown,
): void {
  applySecurityHeaders(response);
  response.status(status).json(body);
}

export function sendNoContent(response: VercelResponse): void {
  applySecurityHeaders(response);
  response.status(204).end();
}

export async function runApiHandler(
  request: VercelRequest,
  response: VercelResponse,
  handler: (request: AdminRequest, response: VercelResponse) => Promise<void>,
): Promise<void> {
  try {
    await handler(toAdminRequest(request), response);
  } catch (error) {
    const body = errorBody(error);
    if (error instanceof ApiError && error.retryAfter !== undefined) {
      response.setHeader('Retry-After', String(error.retryAfter));
    }
    sendJson(response, error instanceof ApiError ? error.status : 500, body);
  }
}

export function requireMethod(
  request: AdminRequest,
  ...methods: string[]
): void {
  if (!methods.includes((request.method ?? '').toUpperCase())) {
    throw new ApiError(405, 'METHOD_NOT_ALLOWED', 'Método não permitido.');
  }
}

export function readJsonBody<T>(request: AdminRequest): T {
  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body) as T;
    } catch {
      throw new ApiError(422, 'INVALID_JSON', 'Corpo JSON inválido.');
    }
  }
  if (!request.body || typeof request.body !== 'object') {
    throw new ApiError(422, 'INVALID_JSON', 'Corpo JSON inválido.');
  }
  return request.body as T;
}
