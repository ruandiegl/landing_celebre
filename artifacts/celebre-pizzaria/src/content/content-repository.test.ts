import { describe, expect, it } from 'vitest';
import {
  createLocalContentRepository,
  CONTENT_STORAGE_KEY,
} from '@/content/content-repository';
import { createDefaultLandingContent } from '@/content/landing-defaults';

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
    key: (index) => Array.from(values.keys())[index] ?? null,
    get length() {
      return values.size;
    },
  };
}

describe('local content repository', () => {
  it('falls back to defaults when storage is empty or invalid', () => {
    const storage = createMemoryStorage();
    const defaults = createDefaultLandingContent();
    const repository = createLocalContentRepository(storage, defaults);

    expect(repository.load()).toEqual(defaults);
    storage.setItem(CONTENT_STORAGE_KEY, '{invalid json');
    expect(repository.load()).toEqual(defaults);
    storage.setItem(CONTENT_STORAGE_KEY, JSON.stringify({ ...defaults, branding: null }));
    expect(repository.load()).toEqual(defaults);
  });

  it('saves, loads and resets versioned content', () => {
    const storage = createMemoryStorage();
    const defaults = createDefaultLandingContent();
    const repository = createLocalContentRepository(storage, defaults);
    const edited = { ...defaults, sections: defaults.sections.map((section) => ({ ...section })) };
    edited.sections[0].title = 'Título editado';

    repository.save(edited);
    expect(repository.load().sections[0].title).toBe('Título editado');
    expect(repository.reset()).toEqual(defaults);
    expect(repository.load()).toEqual(defaults);
  });
});
