import type { ContentDocument } from '@/lib/admin-types';
import { AdminApiError } from '@/lib/admin-client';
import { isLandingContent } from './landing-content';

export async function fetchPublishedContent(): Promise<ContentDocument | null> {
  try {
    const response = await fetch('/api/content', { credentials: 'same-origin' });
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new AdminApiError(response.status, 'CONTENT_FETCH_FAILED', 'Conteúdo remoto indisponível.');
    }
    const document = (await response.json()) as Partial<ContentDocument>;
    if (
      typeof document.revision !== 'string' ||
      typeof document.updatedAt !== 'string' ||
      !isLandingContent(document.content)
    ) {
      throw new AdminApiError(503, 'CONTENT_INVALID', 'Conteúdo remoto inválido.');
    }
    return document as ContentDocument;
  } catch (error) {
    if (error instanceof AdminApiError) throw error;
    throw new AdminApiError(503, 'CONTENT_FETCH_FAILED', 'Conteúdo remoto indisponível.');
  }
}
