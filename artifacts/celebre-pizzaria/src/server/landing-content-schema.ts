import { z } from 'zod';
import { isSafeImageSource, LANDING_SECTION_IDS } from '@/content/landing-content';

const imageSlotSchema = z.object({
  slotId: z.string().min(1).max(100),
  label: z.string().min(1).max(160),
  purpose: z.string().min(1).max(300),
  src: z.string().min(1).max(2_048).refine(isSafeImageSource, 'URL de imagem não permitida.'),
  alt: z.string().min(1).max(300),
  mediaKey: z.string().min(1).max(512),
});

const sectionSchema = z.object({
  id: z.enum(LANDING_SECTION_IDS),
  label: z.string().min(1).max(160),
  title: z.string().min(1).max(200),
  images: z.array(imageSlotSchema).min(1).max(12),
});

const catalogItemSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(160),
  description: z.string().max(500),
  price: z.string().min(1).max(80),
  image: imageSlotSchema,
});

export const landingContentSchema = z.object({
  schemaVersion: z.literal(1),
  branding: z.object({ logo: imageSlotSchema }),
  sections: z
    .array(sectionSchema)
    .length(LANDING_SECTION_IDS.length)
    .superRefine((sections, context) => {
      const ids = new Set(sections.map((section) => section.id));
      if (ids.size !== LANDING_SECTION_IDS.length) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'As seções devem possuir IDs únicos.',
        });
      }
    }),
  catalog: z.array(catalogItemSchema).min(1).max(30),
});

export const contentDocumentSchema = z.object({
  content: landingContentSchema,
  revision: z.string().max(512),
  updatedAt: z.string().datetime(),
});
