export interface AppConfig {
  isProduction: boolean;
  adminUsername: string;
  adminPasswordHash?: string;
  adminSessionSecret?: string;
  blobReadWriteToken?: string;
  allowedOrigins: string[];
  contentBlobPath: string;
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

const DEFAULT_CONTENT_BLOB_PATH = 'images-celebre/config/landing-content.json';

export function loadConfig(
  env: Record<string, string | undefined> = process.env,
): AppConfig {
  const isProduction = env.NODE_ENV === 'production';
  const requiredInProduction = [
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD_HASH',
    'ADMIN_SESSION_SECRET',
    'BLOB_READ_WRITE_TOKEN',
    'ADMIN_ALLOWED_ORIGINS',
  ];

  if (isProduction) {
    const missing = requiredInProduction.filter((name) => !env[name]?.trim());
    if (missing.length > 0) {
      throw new ConfigurationError(
        `Configuração de produção incompleta: ${missing.join(', ')}`,
      );
    }
  }

  return {
    isProduction,
    adminUsername: env.ADMIN_USERNAME?.trim() || 'administrator',
    adminPasswordHash: env.ADMIN_PASSWORD_HASH?.trim() || undefined,
    adminSessionSecret: env.ADMIN_SESSION_SECRET?.trim() || undefined,
    blobReadWriteToken: env.BLOB_READ_WRITE_TOKEN?.trim() || undefined,
    allowedOrigins: (env.ADMIN_ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    contentBlobPath:
      env.CONTENT_BLOB_PATH?.trim() || DEFAULT_CONTENT_BLOB_PATH,
  };
}

export { DEFAULT_CONTENT_BLOB_PATH };
