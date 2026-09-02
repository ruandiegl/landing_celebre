import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload } from '@vercel/blob/client';
import { getAdminSession } from '../../src/server/admin-auth.js';
import { assertCsrf, assertSameOrigin, getClientIp } from '../../src/server/request-security.js';
import { createRateLimiter } from '../../src/server/rate-limit.js';
import { ApiError } from '../../src/server/http-errors.js';
import { getAppConfig, requireMethod, runApiHandler, sendJson } from '../../src/server/vercel-http.js';
import { isAllowedMediaPath } from '../../src/server/blob-paths.js';

const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

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
    let result;
    try {
      result = await handleUpload({
        request,
        body: adminRequest.body as never,
        token: config.blobReadWriteToken,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          if (!isAllowedMediaPath(pathname)) {
            throw new ApiError(
              422,
              'INVALID_MEDIA_PATH',
              'Caminho de imagem inválido.',
            );
          }
          if (clientPayload && clientPayload.length > 512) {
            throw new ApiError(
              422,
              'INVALID_MEDIA_METADATA',
              'Metadados da imagem inválidos.',
            );
          }
          return {
            allowedContentTypes: ALLOWED_CONTENT_TYPES,
            maximumSizeInBytes: MAX_IMAGE_BYTES,
            validUntil: Date.now() + 10 * 60 * 1000,
            addRandomSuffix: true,
            allowOverwrite: false,
          };
        },
        onUploadCompleted: async ({ blob }) => {
          if (!isAllowedMediaPath(blob.pathname)) {
            throw new ApiError(
              422,
              'INVALID_MEDIA_PATH',
              'Caminho de imagem inválido.',
            );
          }
        },
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && error.name === 'BlobFileTooLargeError') {
        throw new ApiError(413, 'FILE_TOO_LARGE', 'A imagem excede o limite de 10 MiB.');
      }
      if (error instanceof Error && error.name === 'BlobContentTypeNotAllowedError') {
        throw new ApiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Use uma imagem JPEG, PNG ou WebP.');
      }
      throw error;
    }
    sendJson(response, 200, result);
  });
}
