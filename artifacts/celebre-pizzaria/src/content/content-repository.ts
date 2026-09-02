import {
  cloneLandingContent,
  isLandingContent,
  type LandingContent,
} from './landing-content';

export const CONTENT_STORAGE_KEY = 'celebre-pizzaria:landing-content:v1';
const LEGACY_BUNDLED_LOGO_PATH = '/attached_assets/client_images/celebre-logo.jpeg';

export interface ContentRepository {
  load: () => LandingContent;
  save: (content: LandingContent) => void;
  reset: () => LandingContent;
}

export function createLocalContentRepository(
  storage: Storage | null | undefined,
  defaults: LandingContent,
): ContentRepository {
  const fallback = () => cloneLandingContent(defaults);
  const migrate = (content: LandingContent) => {
    if (!content.branding.logo.src.includes(LEGACY_BUNDLED_LOGO_PATH)) {
      return content;
    }

    return {
      ...content,
      branding: {
        ...content.branding,
        logo: {
          ...content.branding.logo,
          src: defaults.branding.logo.src,
        },
      },
    };
  };

  return {
    load: () => {
      if (!storage) return fallback();

      try {
        const raw = storage.getItem(CONTENT_STORAGE_KEY);
        if (!raw) return fallback();
        const parsed: unknown = JSON.parse(raw);
        return isLandingContent(parsed)
          ? migrate(cloneLandingContent(parsed))
          : fallback();
      } catch {
        return fallback();
      }
    },
    save: (content) => {
      storage?.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
    },
    reset: () => {
      storage?.removeItem(CONTENT_STORAGE_KEY);
      return fallback();
    },
  };
}

export function getBrowserContentRepository(
  defaults: LandingContent,
): ContentRepository {
  return createLocalContentRepository(
    typeof window === 'undefined' ? undefined : window.localStorage,
    defaults,
  );
}
