import { describe, expect, it } from 'vitest';
import {
  BLOB_MEDIA_PREFIX,
  buildMediaBlobPath,
  isAllowedBlobPath,
  isAllowedMediaPath,
} from './blob-paths';

describe('blob path allowlist', () => {
  it('only accepts media below the configured prefix', () => {
    expect(isAllowedBlobPath(`${BLOB_MEDIA_PREFIX}site/photo.webp`)).toBe(true);
    expect(isAllowedBlobPath('other-store/photo.webp')).toBe(false);
    expect(isAllowedBlobPath(`${BLOB_MEDIA_PREFIX}../secret`)).toBe(false);
    expect(isAllowedBlobPath(`${BLOB_MEDIA_PREFIX}site\\photo.webp`)).toBe(false);
    expect(isAllowedMediaPath(`${BLOB_MEDIA_PREFIX}config/landing-content.json`)).toBe(false);
  });

  it('normalizes an upload name into the media prefix', () => {
    expect(buildMediaBlobPath('hero', 'pizza final.webp')).toBe(
      `${BLOB_MEDIA_PREFIX}hero/pizza-final.webp`,
    );
  });
});
