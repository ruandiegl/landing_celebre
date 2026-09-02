import { del, list } from '@vercel/blob';
import type { AppConfig } from './config.js';
import { ApiError } from './http-errors.js';
import { BLOB_MEDIA_PREFIX, isAllowedMediaPath } from './blob-paths.js';

export interface ListedMedia {
  id: string;
  pathname: string;
  url: string;
  contentType?: string;
  kind: 'remote';
}

function requireBlobToken(config: AppConfig): string {
  if (!config.blobReadWriteToken) {
    throw new ApiError(
      503,
      'BLOB_NOT_CONFIGURED',
      'O armazenamento de imagens não está configurado.',
    );
  }
  return config.blobReadWriteToken;
}

export async function listMedia(config: AppConfig): Promise<ListedMedia[]> {
  const token = requireBlobToken(config);
  try {
    const result = await list({ prefix: BLOB_MEDIA_PREFIX, token, limit: 1_000 });
    return result.blobs
      .filter((blob) => isAllowedMediaPath(blob.pathname))
      .map((blob) => ({
        id: blob.etag,
        pathname: blob.pathname,
        url: blob.url,
        kind: 'remote' as const,
      }));
  } catch {
    throw new ApiError(
      503,
      'BLOB_UNAVAILABLE',
      'Não foi possível listar as imagens.',
    );
  }
}

export async function removeMedia(
  config: AppConfig,
  pathname: string,
): Promise<void> {
  const token = requireBlobToken(config);
  if (!isAllowedMediaPath(pathname)) {
    throw new ApiError(422, 'INVALID_MEDIA_PATH', 'Caminho de imagem inválido.');
  }
  try {
    await del(pathname, { token });
  } catch {
    throw new ApiError(
      503,
      'BLOB_UNAVAILABLE',
      'Não foi possível remover a imagem.',
    );
  }
}
