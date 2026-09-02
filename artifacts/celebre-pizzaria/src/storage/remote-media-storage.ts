import { upload } from '@vercel/blob/client';
import { getAdminCsrfToken, listAdminMedia, removeAdminMedia } from '@/lib/admin-client';
import type { MediaStorage } from './media-storage';

export interface RemoteMediaStorageOptions {
  onProgress?: (percentage: number) => void;
}

export function createRemoteMediaStorage(options: RemoteMediaStorageOptions = {}): MediaStorage {
  return {
    async list() {
      return listAdminMedia();
    },
    async upload(file, metadata) {
      const slotId = metadata?.slotId ?? 'general';
      const pathname = `images-celebre/${slotId}/${crypto.randomUUID()}-${file.name}`;
      const result = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob-token',
        clientPayload: JSON.stringify({ slotId }),
        headers: {
          'X-CSRF-Token': getAdminCsrfToken() ?? '',
        },
        onUploadProgress: ({ percentage }) => options.onProgress?.(percentage),
      });
      return {
        id: result.etag,
        pathname: result.pathname,
        url: result.url,
        contentType: file.type,
        kind: 'remote',
      };
    },
    async remove(asset) {
      await removeAdminMedia(asset.pathname);
    },
  };
}
