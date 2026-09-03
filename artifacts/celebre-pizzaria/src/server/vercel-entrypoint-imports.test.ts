import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../api');
const serverRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const adminTypesPath = resolve(serverRoot, '../lib/admin-types.ts');
const defaultsDataPath = resolve(serverRoot, '../content/landing-defaults-data.ts');

function collectTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTypeScriptFiles(path);
    return entry.isFile() && entry.name.endsWith('.ts') ? [path] : [];
  });
}

describe('Vercel Function ESM imports', () => {
  it('uses explicit .js extensions for relative imports', () => {
    const files = [
      ...[apiRoot, serverRoot].flatMap((root) =>
        collectTypeScriptFiles(root).filter((filePath) => !filePath.endsWith('.test.ts')),
      ),
      adminTypesPath,
      defaultsDataPath,
    ];
    const violations = files.flatMap((filePath) => {
      const source = readFileSync(filePath, 'utf8');
      const imports = [...source.matchAll(/from\s+['"](\.\.?\/[^'"]+)['"]/g)].map(
        ([, specifier]) => specifier,
      );
      return imports
        .filter((specifier): specifier is string => Boolean(specifier) && !specifier.endsWith('.js'))
        .map((specifier) => `${relative(resolve(apiRoot, '..'), filePath)} -> ${specifier}`);
    });

    expect(violations).toEqual([]);
  });

  it('does not use bundler-only aliases in the server dependency graph', () => {
    const files = [
      ...collectTypeScriptFiles(serverRoot).filter((filePath) => !filePath.endsWith('.test.ts')),
      adminTypesPath,
      defaultsDataPath,
    ];
    const violations = files.flatMap((filePath) => {
      const source = readFileSync(filePath, 'utf8');
      return [...source.matchAll(/from\s+['"](@\/[^'"]+)['"]/g)].map(
        ([, specifier]) => `${relative(resolve(apiRoot, '..'), filePath)} -> ${specifier}`,
      );
    });

    expect(violations).toEqual([]);
  });

  it('keeps the cookie declaration attached to the isolated Function graph', () => {
    const source = readFileSync(resolve(serverRoot, 'admin-cookies.ts'), 'utf8');

    expect(source).toContain('/// <reference path="./cookie.d.ts" />');
  });

  it('allows Vercel to emit Function entrypoints', () => {
    const tsconfig = JSON.parse(
      readFileSync(resolve(serverRoot, '../../tsconfig.json'), 'utf8'),
    ) as { compilerOptions?: { noEmit?: boolean } };

    expect(tsconfig.compilerOptions?.noEmit).not.toBe(true);
  });

  it('does not enable ts-extension imports when Vercel must emit JavaScript', () => {
    const tsconfig = JSON.parse(
      readFileSync(resolve(serverRoot, '../../tsconfig.json'), 'utf8'),
    ) as { compilerOptions?: { allowImportingTsExtensions?: boolean } };

    expect(tsconfig.compilerOptions?.allowImportingTsExtensions).not.toBe(true);
  });

  it('does not require the Vite client type library in emitted Functions', () => {
    const tsconfig = JSON.parse(
      readFileSync(resolve(serverRoot, '../../tsconfig.json'), 'utf8'),
    ) as { compilerOptions?: { types?: string[] } };

    expect(tsconfig.compilerOptions?.types ?? []).not.toContain('vite/client');
  });
});
