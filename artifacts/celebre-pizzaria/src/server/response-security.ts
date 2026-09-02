export interface HeaderResponse {
  setHeader: (name: string, value: string) => unknown;
}

export const ADMIN_CONTENT_SECURITY_POLICY =
  "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://*.blob.vercel-storage.com; connect-src 'self' https://*.blob.vercel-storage.com";

export function applySecurityHeaders(response: HeaderResponse): void {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  response.setHeader('Content-Security-Policy', ADMIN_CONTENT_SECURITY_POLICY);
}
