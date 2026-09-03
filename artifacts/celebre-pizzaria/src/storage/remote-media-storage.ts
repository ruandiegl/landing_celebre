import { put } from '@vercel/blob/client';
import { createAdminBlobUploadToken, listAdminMedia, removeAdminMedia } from '@/lib/admin-client';
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
      const { clientToken, pathname } = await createAdminBlobUploadToken(slotId, file.name);
      const result = await put(pathname, file, {
        access: 'public',
        token: clientToken,
        contentType: file.type,
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
