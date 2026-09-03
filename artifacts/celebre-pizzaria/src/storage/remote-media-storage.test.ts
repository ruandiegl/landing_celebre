import { describe, expect, it, vi } from 'vitest';

const { putMock, createTokenMock, listMock, removeMock } = vi.hoisted(() => ({
  putMock: vi.fn(),
  createTokenMock: vi.fn(),
  listMock: vi.fn(),
  removeMock: vi.fn(),
}));

vi.mock('@vercel/blob/client', () => ({ put: putMock }));
vi.mock('@/lib/admin-client', () => ({
  createAdminBlobUploadToken: createTokenMock,
  listAdminMedia: listMock,
  removeAdminMedia: removeMock,
}));

import { createRemoteMediaStorage } from './remote-media-storage';

describe('remote media storage', () => {
  it('requests a constrained token and uploads directly to Vercel Blob', async () => {
    const file = new File(['pizza'], 'pizza final.png', { type: 'image/png' });
    const pathname = 'images-celebre/hero/pizza-final.png';
    createTokenMock.mockResolvedValueOnce({
      clientToken: 'client-token',
      pathname,
    });
    putMock.mockResolvedValueOnce({
      etag: 'etag-1',
      pathname,
      url: 'https://images.public.blob.vercel-storage.com/hero/pizza-final.png',
      contentType: 'image/png',
    });

    const storage = createRemoteMediaStorage();
    const asset = await storage.upload(file, { slotId: 'hero' });

    expect(createTokenMock).toHaveBeenCalledWith('hero', file.name);
    expect(putMock).toHaveBeenCalledWith(
      pathname,
      file,
      expect.objectContaining({
        access: 'public',
        token: 'client-token',
        contentType: 'image/png',
      }),
    );
    expect(asset).toEqual({
      id: 'etag-1',
      pathname,
      url: 'https://images.public.blob.vercel-storage.com/hero/pizza-final.png',
      contentType: 'image/png',
      kind: 'remote',
    });
  });
});
