export const LANDING_SECTION_IDS = [
  'hero',
  'nossa-pizza',
  'cardapio',
  'rodizio',
  'karaoke',
  'ambiente',
  'depoimentos',
  'reserva',
] as const;

export type LandingSectionId = (typeof LANDING_SECTION_IDS)[number];

export function isSafeImageSource(src: string): boolean {
  if (src.startsWith('/') && !src.startsWith('//')) return true;
  try {
    const url = new URL(src);
    return (
      url.protocol === 'https:' &&
      (url.hostname === 'blob.vercel-storage.com' ||
        url.hostname.endsWith('.blob.vercel-storage.com'))
    );
  } catch {
    return false;
  }
}

export interface ImageSlot {
  slotId: string;
  mediaKey: string;
  label: string;
  purpose: string;
  src: string;
  alt: string;
}

export interface LandingSection {
  id: LandingSectionId;
  label: string;
  title: string;
  images: ImageSlot[];
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: ImageSlot;
}

export interface LandingContent {
  schemaVersion: 1;
  branding: {
    logo: ImageSlot;
  };
  sections: LandingSection[];
  catalog: CatalogItem[];
}

export function cloneLandingContent(content: LandingContent): LandingContent {
  return JSON.parse(JSON.stringify(content)) as LandingContent;
}

export function updateSectionTitle(
  content: LandingContent,
  sectionId: LandingSectionId,
  title: string,
): LandingContent {
  return {
    ...content,
    sections: content.sections.map((section) =>
      section.id === sectionId ? { ...section, title } : section,
    ),
  };
}

export function updateSectionImage(
  content: LandingContent,
  sectionId: LandingSectionId,
  slotId: string,
  src: string,
): LandingContent {
  return {
    ...content,
    sections: content.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            images: section.images.map((image) =>
              image.slotId === slotId ? { ...image, src } : image,
            ),
          }
        : section,
    ),
  };
}

export function updateBrandLogo(
  content: LandingContent,
  src: string,
): LandingContent {
  return {
    ...content,
    branding: {
      ...content.branding,
      logo: { ...content.branding.logo, src },
    },
  };
}

export function updateCatalogItemImage(
  content: LandingContent,
  itemId: string,
  src: string,
): LandingContent {
  return {
    ...content,
    catalog: content.catalog.map((item) =>
      item.id === itemId
        ? { ...item, image: { ...item.image, src } }
        : item,
    ),
  };
}

export function updateCatalogItem(
  content: LandingContent,
  itemId: string,
  values: Partial<Pick<CatalogItem, 'name' | 'description' | 'price'>>,
): LandingContent {
  return {
    ...content,
    catalog: content.catalog.map((item) =>
      item.id === itemId ? { ...item, ...values } : item,
    ),
  };
}

export function isLandingContent(value: unknown): value is LandingContent {
  if (!value || typeof value !== 'object') return false;

  const content = value as Partial<LandingContent>;
  const isImageSlot = (image: unknown): image is ImageSlot => {
    if (!image || typeof image !== 'object') return false;
    const candidate = image as Partial<ImageSlot>;
    return (
      typeof candidate.slotId === 'string' &&
      typeof candidate.mediaKey === 'string' &&
      typeof candidate.label === 'string' &&
      typeof candidate.purpose === 'string' &&
      typeof candidate.src === 'string' &&
      isSafeImageSource(candidate.src) &&
      typeof candidate.alt === 'string'
    );
  };

  return (
    content.schemaVersion === 1 &&
    !!content.branding &&
    isImageSlot(content.branding.logo) &&
    Array.isArray(content.sections) &&
    content.sections.length === LANDING_SECTION_IDS.length &&
    content.sections.every(
      (section) =>
        section &&
        LANDING_SECTION_IDS.includes(section.id) &&
        typeof section.label === 'string' &&
        typeof section.title === 'string' &&
        Array.isArray(section.images) &&
        section.images.every(isImageSlot),
    ) &&
    Array.isArray(content.catalog) &&
    content.catalog.every(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.description === 'string' &&
        typeof item.price === 'string' &&
        isImageSlot(item.image),
    )
  );
}
