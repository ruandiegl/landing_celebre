import { describe, expect, it } from 'vitest';
import { applySecurityHeaders } from './response-security';

describe('response security headers', () => {
  it('sets restrictive headers for admin responses', () => {
    const values = new Map<string, string>();
    applySecurityHeaders({
      setHeader(name, value) {
        values.set(name, String(value));
      },
    });

    expect(values.get('Cache-Control')).toBe('no-store');
    expect(values.get('X-Content-Type-Options')).toBe('nosniff');
    expect(values.get('X-Frame-Options')).toBe('DENY');
    expect(values.get('Content-Security-Policy')).toContain("frame-ancestors 'none'");
  });
});
