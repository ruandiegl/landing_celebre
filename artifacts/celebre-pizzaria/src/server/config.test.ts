import { describe, expect, it } from 'vitest';
import { loadConfig } from './config';

describe('loadConfig', () => {
  it('fails closed when production secrets are missing', () => {
    expect(() => loadConfig({ NODE_ENV: 'production' })).toThrow(
      'Configuração de produção incompleta',
    );
  });

  it('loads the admin, storage and rate-limit settings', () => {
    const config = loadConfig({
      NODE_ENV: 'test',
      ADMIN_USERNAME: 'administrator',
      ADMIN_PASSWORD_HASH: 'scrypt$1$8$1$test$test',
      ADMIN_SESSION_SECRET: 'session-secret',
      BLOB_READ_WRITE_TOKEN: 'blob-token',
      ADMIN_ALLOWED_ORIGINS: 'https://celebre.example, http://localhost:5173',
      CONTENT_BLOB_PATH: 'images-celebre/config/landing-content.json',
    });

    expect(config).toMatchObject({
      isProduction: false,
      adminUsername: 'administrator',
      adminPasswordHash: 'scrypt$1$8$1$test$test',
      adminSessionSecret: 'session-secret',
      blobReadWriteToken: 'blob-token',
      contentBlobPath: 'images-celebre/config/landing-content.json',
      allowedOrigins: ['https://celebre.example', 'http://localhost:5173'],
    });
  });

  it('allows production with Blob and local rate limiting only', () => {
    const config = loadConfig({
      NODE_ENV: 'production',
      ADMIN_USERNAME: 'administrator',
      ADMIN_PASSWORD_HASH: 'scrypt$16384$8$1$test$test',
      ADMIN_SESSION_SECRET: 'session-secret',
      BLOB_READ_WRITE_TOKEN: 'blob-token',
      ADMIN_ALLOWED_ORIGINS: 'https://celebre.example',
    });

    expect(config.isProduction).toBe(true);
    expect(config.blobReadWriteToken).toBe('blob-token');
  });

  it('uses safe local defaults without pretending to be production-ready', () => {
    const config = loadConfig({ NODE_ENV: 'development' });

    expect(config.adminUsername).toBe('administrator');
    expect(config.contentBlobPath).toBe(
      'images-celebre/config/landing-content.json',
    );
    expect(config.isProduction).toBe(false);
    expect(config.adminPasswordHash).toBeUndefined();
  });
});
