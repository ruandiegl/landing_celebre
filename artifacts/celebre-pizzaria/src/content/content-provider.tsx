import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  updateBrandLogo,
  updateCatalogItem,
  updateCatalogItemImage,
  updateSectionImage,
  updateSectionTitle,
  type LandingContent,
  type LandingSectionId,
} from './landing-content';
import { createDefaultLandingContent } from './landing-defaults';
import { getBrowserContentRepository } from './content-repository';

interface LandingContentContextValue {
  content: LandingContent;
  updateSectionTitle: (sectionId: LandingSectionId, title: string) => void;
  updateSectionImage: (sectionId: LandingSectionId, slotId: string, src: string) => void;
  updateBrandLogo: (src: string) => void;
  updateCatalogItemImage: (itemId: string, src: string) => void;
  updateCatalogItem: (
    itemId: string,
    values: Partial<Pick<LandingContent['catalog'][number], 'name' | 'description' | 'price'>>,
  ) => void;
  resetContent: () => void;
}

const LandingContentContext = createContext<LandingContentContextValue | null>(null);

export function LandingContentProvider({ children }: PropsWithChildren) {
  const defaults = useMemo(() => createDefaultLandingContent(), []);
  const repository = useMemo(() => getBrowserContentRepository(defaults), [defaults]);
  const [content, setContent] = useState<LandingContent>(() => repository.load());

  const commit = useCallback(
    (nextContent: LandingContent) => {
      setContent(nextContent);
      repository.save(nextContent);
    },
    [repository],
  );

  const value = useMemo<LandingContentContextValue>(
    () => ({
      content,
      updateSectionTitle: (sectionId, title) =>
        commit(updateSectionTitle(content, sectionId, title)),
      updateSectionImage: (sectionId, slotId, src) =>
        commit(updateSectionImage(content, sectionId, slotId, src)),
      updateBrandLogo: (src) => commit(updateBrandLogo(content, src)),
      updateCatalogItemImage: (itemId, src) =>
        commit(updateCatalogItemImage(content, itemId, src)),
      updateCatalogItem: (itemId, values) =>
        commit(updateCatalogItem(content, itemId, values)),
      resetContent: () => {
        const reset = repository.reset();
        setContent(reset);
      },
    }),
    [commit, content, repository],
  );

  return (
    <LandingContentContext.Provider value={value}>
      {children}
    </LandingContentContext.Provider>
  );
}

export function useLandingContent(): LandingContentContextValue {
  const context = useContext(LandingContentContext);
  if (!context) {
    throw new Error('useLandingContent must be used inside LandingContentProvider');
  }
  return context;
}
