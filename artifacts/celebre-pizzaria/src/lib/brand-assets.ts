const assetPath = (filename: string) =>
  `${import.meta.env.BASE_URL}images/${filename}`;

export const HEADER_LOGO_PATH = assetPath('logo-escura.png');
export const HERO_LOGO_PATH = assetPath('logo-chromakey.png');
