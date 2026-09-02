import { describe, expect, it } from 'vitest';
import {
  LANDING_SECTION_IDS,
  isSafeImageSource,
  updateCatalogItemImage,
  updateSectionImage,
  updateSectionTitle,
} from '@/content/landing-content';
import { createDefaultLandingContent } from '@/content/landing-defaults';

describe('landing content model', () => {
  it('accepts bundled/blob images and rejects executable or third-party URLs', () => {
    expect(isSafeImageSource('/images/site/pizza.webp')).toBe(true);
    expect(isSafeImageSource('https://store.blob.vercel-storage.com/pizza.webp')).toBe(true);
    expect(isSafeImageSource('https://example.com/pizza.webp')).toBe(false);
    expect(isSafeImageSource('javascript:alert(1)')).toBe(false);
    expect(isSafeImageSource('data:image/png;base64,abc')).toBe(false);
  });

  it('keeps the same explicit section ids used by the landing and admin', () => {
    const content = createDefaultLandingContent();

    expect(content.branding.logo.src).toContain('/images/logo-escura.png');
    expect(content.sections.map((section) => section.id)).toEqual(
      LANDING_SECTION_IDS,
    );
    expect(content.sections.every((section) => section.label && section.title)).toBe(
      true,
    );
    expect(content.catalog).toHaveLength(6);
    expect(content.catalog.every((item) => item.id && item.image.slotId)).toBe(
      true,
    );
  });

  it('updates a section title and image immutably', () => {
    const original = createDefaultLandingContent();
    const titled = updateSectionTitle(original, 'cardapio', 'Novo cardápio');
    const updated = updateSectionImage(
      titled,
      'cardapio',
      'header',
      'https://example.com/cardapio.webp',
    );

    expect(original.sections.find((section) => section.id === 'cardapio')?.title).toBe(
      'Sabores que celebram',
    );
    expect(updated.sections.find((section) => section.id === 'cardapio')?.title).toBe(
      'Novo cardápio',
    );
    expect(
      updated.sections.find((section) => section.id === 'cardapio')?.images[0].src,
    ).toBe('https://example.com/cardapio.webp');
  });

  it('updates only the selected mini catalog image', () => {
    const original = createDefaultLandingContent();
    const updated = updateCatalogItemImage(
      original,
      'margherita-classica',
      'https://example.com/margherita.webp',
    );

    expect(updated.catalog[0].image.src).toBe('https://example.com/margherita.webp');
    expect(updated.catalog.slice(1).map((item) => item.image.src)).toEqual(
      original.catalog.slice(1).map((item) => item.image.src),
    );
  });
});
