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
  upload: (file: File) => Promise<MediaAsset>;
  remove: (asset: MediaAsset) => Promise<void>;
}

export const MEDIA_STORAGE_INTEGRATION_NOTE =
  'Próximo plano: conectar este contrato a @vercel/blob por endpoints server-side. Não colocar tokens em VITE_*.';
