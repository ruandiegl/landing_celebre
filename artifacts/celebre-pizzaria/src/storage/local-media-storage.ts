import type { ImageSlot } from '@/content/landing-content';
import type { MediaAsset, MediaStorage } from './media-storage';

function toMediaAsset(image: ImageSlot, index: number): MediaAsset {
  return {
    id: `bundled-${image.slotId}-${index}`,
    pathname: image.src,
    url: image.src,
    kind: 'bundled',
  };
}

export function createLocalMediaStorage(images: ImageSlot[]): MediaStorage {
  const assets = images.map(toMediaAsset);

  return {
    list: async () => [...assets],
    upload: async (file) => {
      const preview: MediaAsset = {
        id: `preview-${crypto.randomUUID()}`,
        pathname: file.name,
        url: URL.createObjectURL(file),
        contentType: file.type,
        kind: 'preview',
      };
      assets.push(preview);
      return preview;
    },
    remove: async (asset) => {
      const index = assets.findIndex((candidate) => candidate.id === asset.id);
      if (index >= 0 && assets[index].kind === 'preview') {
        URL.revokeObjectURL(assets[index].url);
        assets.splice(index, 1);
      }
    },
  };
}
