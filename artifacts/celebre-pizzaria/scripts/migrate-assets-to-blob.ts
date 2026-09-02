import { list, put } from '@vercel/blob';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { DEFAULT_LANDING_CONTENT_DATA } from '../src/content/landing-defaults-data';
import type { LandingContent } from '../src/content/landing-content';

const STORE_PREFIX = 'images-celebre/';
const CONTENT_PATH = 'images-celebre/config/landing-content.json';
const dryRun = process.argv.includes('--dry-run');
const replaceExisting = process.argv.includes('--replace-existing');
const artifactRoot = resolve(import.meta.dirname, '..');

const assets = [
  { key: 'brand-logo-escura', source: 'public/images/logo-escura.png', pathname: `${STORE_PREFIX}brand/logo-escura.png`, contentType: 'image/png' },
  { key: 'brand-logo-chromakey', source: 'public/images/logo-chromakey.png', pathname: `${STORE_PREFIX}brand/logo-chromakey.png`, contentType: 'image/png' },
  { key: 'room-full', source: 'attached_assets/client_images/celebre-sala-cheia.jpeg', pathname: `${STORE_PREFIX}site/celebre-sala-cheia.jpeg`, contentType: 'image/jpeg' },
  { key: 'pizza-real', source: 'attached_assets/client_images/celebre-pizza-real.jpeg', pathname: `${STORE_PREFIX}site/celebre-pizza-real.jpeg`, contentType: 'image/jpeg' },
  { key: 'room-event', source: 'attached_assets/client_images/celebre-sala-evento.jpeg', pathname: `${STORE_PREFIX}site/celebre-sala-evento.jpeg`, contentType: 'image/jpeg' },
  { key: 'pizza-top-hover', source: 'attached_assets/client_images/pizza-top-hover.webp', pathname: `${STORE_PREFIX}site/pizza-top-hover.webp`, contentType: 'image/webp' },
  { key: 'pizza-hero', source: 'attached_assets/generated_images/pizza-hero.jpg', pathname: `${STORE_PREFIX}site/pizza-hero.jpg`, contentType: 'image/jpeg' },
  { key: 'pizza-variety', source: 'attached_assets/generated_images/pizza-variety.jpg', pathname: `${STORE_PREFIX}site/pizza-variety.jpg`, contentType: 'image/jpeg' },
] as const;

function replaceContentUrls(content: LandingContent, urls: Map<string, string>): LandingContent {
  const replaceImage = <T extends { mediaKey: string; src: string }>(image: T): T => ({
    ...image,
    src: urls.get(image.mediaKey) ?? image.src,
  });
  return {
    ...content,
    branding: { logo: replaceImage(content.branding.logo) },
    sections: content.sections.map((section) => ({ ...section, images: section.images.map(replaceImage) })),
    catalog: content.catalog.map((item) => ({ ...item, image: replaceImage(item.image) })),
  };
}

async function main(): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!dryRun && !token) {
    throw new Error('BLOB_READ_WRITE_TOKEN é obrigatório fora do dry-run.');
  }

  const existing = dryRun
    ? { blobs: [] as Array<{ pathname: string; url: string }> }
    : await list({ prefix: STORE_PREFIX, limit: 1_000, token });
  const existingByPath = new Map(existing.blobs.map((blob) => [blob.pathname, blob.url]));
  const urls = new Map<string, string>();

  for (const asset of assets) {
    const currentUrl = existingByPath.get(asset.pathname);
    if (currentUrl && !replaceExisting) {
      urls.set(asset.key, currentUrl);
      console.log(`skip existing ${asset.pathname}`);
      continue;
    }

    const sourcePath = resolve(artifactRoot, asset.source);
    if (dryRun) {
      console.log(`${currentUrl ? 'replace' : 'upload'} ${asset.source} -> ${asset.pathname}`);
      continue;
    }

    const body = await readFile(sourcePath);
    const result = await put(asset.pathname, body, {
      access: 'public',
      contentType: asset.contentType,
      addRandomSuffix: false,
      allowOverwrite: replaceExisting,
      token,
    });
    urls.set(asset.key, result.url);
    console.log(`${currentUrl ? 'replaced' : 'uploaded'} ${asset.pathname}`);
  }

  if (dryRun) {
    console.log(`would seed ${CONTENT_PATH} when it does not exist`);
    return;
  }

  const contentAlreadyExists = existingByPath.has(CONTENT_PATH);
  if (contentAlreadyExists) {
    console.log(`skip existing ${CONTENT_PATH}`);
    return;
  }

  const content = replaceContentUrls(DEFAULT_LANDING_CONTENT_DATA, urls);
  await put(
    CONTENT_PATH,
    JSON.stringify({
      content,
      revision: 'migration',
      updatedAt: new Date().toISOString(),
    }),
    {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: false,
      token,
    },
  );
  console.log(`seeded ${CONTENT_PATH}`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : 'Falha na migração.'}\n`);
  process.exitCode = 1;
});
