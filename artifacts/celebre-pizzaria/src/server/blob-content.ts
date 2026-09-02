import { get, put } from '@vercel/blob';
import type { ContentDocument } from '../lib/admin-types.js';
import type { LandingContent } from '../content/landing-content.js';
import { DEFAULT_LANDING_CONTENT_DATA } from '../content/landing-defaults-data.js';
import type { AppConfig } from './config.js';
import { ApiError } from './http-errors.js';
import { contentDocumentSchema } from './landing-content-schema.js';

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

export async function readContentDocument(
  config: AppConfig,
): Promise<ContentDocument | null> {
  const token = requireBlobToken(config);
  try {
    const result = await get(config.contentBlobPath, {
      access: 'public',
      token,
      useCache: false,
    });
    if (!result || result.statusCode !== 200) return null;
    const raw = await new Response(result.stream).json();
    const parsed = contentDocumentSchema.safeParse(raw);
    if (!parsed.success) {
      throw new ApiError(
        503,
        'CONTENT_INVALID',
        'O conteúdo publicado está inválido.',
      );
    }
    return {
      content: parsed.data.content,
      revision: result.blob.etag,
      updatedAt: parsed.data.updatedAt,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      503,
      'BLOB_UNAVAILABLE',
      'Não foi possível acessar o conteúdo publicado.',
    );
  }
}

export async function saveContentDocument(
  config: AppConfig,
  content: LandingContent,
  expectedRevision?: string,
): Promise<ContentDocument> {
  const token = requireBlobToken(config);
  const parsed = contentDocumentSchema.shape.content.safeParse(content);
  if (!parsed.success) {
    throw new ApiError(422, 'CONTENT_INVALID', 'Conteúdo inválido.');
  }

  const current = await readContentDocument(config);
  if (expectedRevision && current?.revision !== expectedRevision) {
    throw new ApiError(
      409,
      'CONTENT_CONFLICT',
      'O conteúdo foi alterado por outra sessão. Recarregue antes de salvar.',
    );
  }

  try {
    const updatedAt = new Date().toISOString();
    const result = await put(
      config.contentBlobPath,
      JSON.stringify({
        content: parsed.data,
        revision: expectedRevision ?? current?.revision ?? 'initial',
        updatedAt,
      }),
      {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
        ...(expectedRevision ? { ifMatch: expectedRevision } : {}),
        token,
      },
    );
    return { content: parsed.data, revision: result.etag, updatedAt };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'BlobPreconditionFailedError') {
      throw new ApiError(
        409,
        'CONTENT_CONFLICT',
        'O conteúdo foi alterado por outra sessão. Recarregue antes de salvar.',
      );
    }
    throw new ApiError(
      503,
      'BLOB_UNAVAILABLE',
      'Não foi possível salvar o conteúdo publicado.',
    );
  }
}

const mediaFilenameByKey: Record<string, string> = {
  'brand-logo-escura': 'logo-escura.png',
  'brand-logo-chromakey': 'logo-chromakey.png',
  'room-full': 'celebre-sala-cheia.jpeg',
  'room-event': 'celebre-sala-evento.jpeg',
  'pizza-real': 'celebre-pizza-real.jpeg',
  'pizza-top-hover': 'pizza-top-hover.webp',
  'pizza-hero': 'pizza-hero.jpg',
  'pizza-variety': 'pizza-variety.jpg',
};

export async function resolveDefaultContentFromBlob(
  config: AppConfig,
): Promise<LandingContent> {
  const token = requireBlobToken(config);
  try {
    const result = await import('@vercel/blob').then(({ list }) =>
      list({ prefix: 'images-celebre/', token, limit: 1_000 }),
    );
    const urls = new Map(
      result.blobs.map((blob) => [blob.pathname.split('/').pop(), blob.url]),
    );
    const replaceImage = <T extends { mediaKey: string; src: string }>(
      image: T,
    ): T => {
      const filename = mediaFilenameByKey[image.mediaKey];
      const url = filename ? urls.get(filename) : undefined;
      return url ? { ...image, src: url } : image;
    };
    const defaults = DEFAULT_LANDING_CONTENT_DATA;
    return {
      ...defaults,
      branding: { logo: replaceImage(defaults.branding.logo) },
      sections: defaults.sections.map((section) => ({
        ...section,
        images: section.images.map(replaceImage),
      })),
      catalog: defaults.catalog.map((item) => ({
        ...item,
        image: replaceImage(item.image),
      })),
    };
  } catch {
    throw new ApiError(
      503,
      'BLOB_UNAVAILABLE',
      'Não foi possível carregar as imagens publicadas.',
    );
  }
}
