export type MediaAssetKind = 'bundled' | 'remote' | 'preview';

export interface MediaAsset {
  id: string;
  pathname: string;
  url: string;
  contentType?: string;
  kind: MediaAssetKind;
}

export interface MediaStorage {
  list: () => Promise<MediaAsset[]>;
  upload: (file: File, metadata?: { slotId?: string }) => Promise<MediaAsset>;
  remove: (asset: MediaAsset) => Promise<void>;
}

export const MEDIA_STORAGE_INTEGRATION_NOTE =
  'A integração remota usa @vercel/blob/client com token temporário emitido pela API protegida. O segredo read-write permanece somente nas Functions.';
