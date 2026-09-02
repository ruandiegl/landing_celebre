export const BLOB_MEDIA_PREFIX = 'images-celebre/';

export function isAllowedBlobPath(pathname: string): boolean {
  return (
    pathname.startsWith(BLOB_MEDIA_PREFIX) &&
    !pathname.includes('..') &&
    !pathname.includes('\\') &&
    !pathname.startsWith('/') &&
    pathname.length <= 512
  );
}

export function isAllowedMediaPath(pathname: string): boolean {
  return isAllowedBlobPath(pathname) && !pathname.startsWith(`${BLOB_MEDIA_PREFIX}config/`);
}

function safeSegment(value: string, fallback: string): string {
  const segment = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return segment || fallback;
}

export function buildMediaBlobPath(slotId: string, filename: string): string {
  const extension = filename.toLowerCase().match(/\.(jpe?g|png|webp)$/)?.[1];
  const basename = filename.replace(/\.[^.]+$/, '');
  return `${BLOB_MEDIA_PREFIX}${safeSegment(slotId, 'upload')}/${safeSegment(
    basename,
    'image',
  )}.${extension === 'jpeg' ? 'jpg' : extension ?? 'bin'}`;
}
