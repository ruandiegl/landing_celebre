import heroRoomPath from '../../attached_assets/client_images/celebre-sala-cheia.jpeg';
import eventRoomPath from '../../attached_assets/client_images/celebre-sala-evento.jpeg';
import pizzaRealPath from '../../attached_assets/client_images/celebre-pizza-real.jpeg';
import pizzaVarietyPath from '../../attached_assets/generated_images/pizza-variety.jpg';
import pizzaHeroPath from '../../attached_assets/generated_images/pizza-hero.jpg';
import { HEADER_LOGO_PATH } from '@/lib/brand-assets';
import type { ImageSlot, LandingContent } from './landing-content';
import { cloneLandingContent } from './landing-content';
import { DEFAULT_LANDING_CONTENT_DATA } from './landing-defaults-data';

const bundledMediaByKey: Record<string, string> = {
  'brand-logo-escura': HEADER_LOGO_PATH,
  'room-full': heroRoomPath,
  'room-event': eventRoomPath,
  'pizza-real': pizzaRealPath,
  'pizza-variety': pizzaVarietyPath,
  'pizza-hero': pizzaHeroPath,
};

function withBundledSource(image: ImageSlot): ImageSlot {
  return {
    ...image,
    src: bundledMediaByKey[image.mediaKey] ?? image.src,
  };
}

function createBundledContent(data: LandingContent): LandingContent {
  return {
    ...data,
    branding: { logo: withBundledSource(data.branding.logo) },
    sections: data.sections.map((section) => ({
      ...section,
      images: section.images.map(withBundledSource),
    })),
    catalog: data.catalog.map((item) => ({
      ...item,
      image: withBundledSource(item.image),
    })),
  };
}

const defaultLandingContent = createBundledContent(DEFAULT_LANDING_CONTENT_DATA);

export function createDefaultLandingContent(): LandingContent {
  return cloneLandingContent(defaultLandingContent);
}

export const DEFAULT_MEDIA_ASSETS = [
  defaultLandingContent.branding.logo,
  ...defaultLandingContent.sections.flatMap((section) => section.images),
  ...defaultLandingContent.catalog.map((item) => item.image),
].filter(
  (asset, index, assets) =>
    assets.findIndex((candidate) => candidate.mediaKey === asset.mediaKey) === index,
);
