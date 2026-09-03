import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { getAdminSession } from '../../src/server/admin-auth.js';
import { assertCsrf, assertSameOrigin, getClientIp } from '../../src/server/request-security.js';
import { createRateLimiter } from '../../src/server/rate-limit.js';
import { ApiError } from '../../src/server/http-errors.js';
import { getAppConfig, readJsonBody, requireMethod, runApiHandler, sendJson } from '../../src/server/vercel-http.js';
import { buildMediaBlobPath, hasAllowedMediaExtension, isAllowedMediaPath } from '../../src/server/blob-paths.js';

const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const uploadRequestSchema = z.object({
  slotId: z.string().trim().min(1).max(100),
  filename: z.string().trim().min(1).max(255),
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  const config = getAppConfig(response);
  if (!config) return;
  await runApiHandler(request, response, async (adminRequest) => {
    requireMethod(adminRequest, 'POST');
    assertSameOrigin(adminRequest, config);
    const session = getAdminSession(adminRequest, config);
    assertCsrf(adminRequest);
    await createRateLimiter(config).enforceLimit(
      `blob-token:${session.username}:${getClientIp(adminRequest)}`,
      20,
      60 * 60,
    );
    if (!config.blobReadWriteToken) {
      throw new ApiError(503, 'BLOB_NOT_CONFIGURED', 'O armazenamento de imagens não está configurado.');
    }
    const parsed = uploadRequestSchema.safeParse(readJsonBody(adminRequest));
    if (!parsed.success) {
      throw new ApiError(422, 'INVALID_UPLOAD_REQUEST', 'Dados do upload inválidos.');
    }
    if (!hasAllowedMediaExtension(parsed.data.filename)) {
      throw new ApiError(
        415,
        'UNSUPPORTED_MEDIA_TYPE',
        'Use uma imagem JPEG, PNG ou WebP.',
      );
    }

    const pathname = buildMediaBlobPath(
      parsed.data.slotId,
      randomUUID() + '-' + parsed.data.filename,
    );
    if (!isAllowedMediaPath(pathname)) {
      throw new ApiError(422, 'INVALID_MEDIA_PATH', 'Caminho de imagem inválido.');
    }

    try {
      const clientToken = await generateClientTokenFromReadWriteToken({
        token: config.blobReadWriteToken,
        pathname,
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        maximumSizeInBytes: MAX_IMAGE_BYTES,
        validUntil: Date.now() + 10 * 60 * 1000,
        addRandomSuffix: false,
        allowOverwrite: false,
      });
      sendJson(response, 200, { clientToken, pathname });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && error.name === 'BlobFileTooLargeError') {
        throw new ApiError(413, 'FILE_TOO_LARGE', 'A imagem excede o limite de 10 MiB.');
      }
      if (error instanceof Error && error.name === 'BlobContentTypeNotAllowedError') {
        throw new ApiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Use uma imagem JPEG, PNG ou WebP.');
      }
      throw new ApiError(503, 'BLOB_UNAVAILABLE', 'Não foi possível preparar o upload da imagem.');
    }
  });
}
