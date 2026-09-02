# Autenticação do Admin e integração de imagens com Vercel Blob — Plano de Implementação

> **Para agentes de IA:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recomendado) ou `superpowers:executing-plans` para implementar este plano tarefa por tarefa, com revisão entre as etapas. Marque cada etapa com checkbox (`- [ ]`) e não declare conclusão sem evidência dos testes.

**Goal:** proteger a rota `/admin` com autenticação server-side e políticas de segurança de produção, migrar todas as imagens efetivamente usadas pela landing para o Vercel Blob e substituir o botão flutuante por um ícone oficial do WhatsApp.

**Architecture:** manter a Home como SPA Vite pública, mas adicionar Vercel Functions Node.js dentro de `artifacts/celebre-pizzaria/api` para autenticação, conteúdo e mídia no mesmo domínio. A sessão será um cookie assinado, sem token no `localStorage`; o Vercel Blob será usado para os assets públicos e para um documento JSON editorial sem dados secretos. O rate limit será local, de melhor esforço, sem provisionar outro serviço; proteção distribuída adicional pode ser configurada no Firewall/WAF da Vercel. O cliente continuará usando fallback local quando o backend remoto estiver indisponível, sem tratar o preview como fonte de verdade em produção.

**Tech Stack:** React 19, TypeScript strict, Vite 7, Wouter, Tailwind CSS 4, `react-icons`, Vercel Functions Node.js, `@vercel/blob`, `@vercel/blob/client`, Zod, `node:crypto`, OpenAPI 3.1 e Orval.

> **Atualização de requisito:** o armazenamento deve usar somente o Vercel Blob. As referências originais a Upstash Redis foram substituídas nesta execução; o limiter em memória é uma proteção de melhor esforço por instância e não deve ser descrito como distribuído.

**Spec:** `../docs/README.md`, `../docs/02-arquitetura.md`, `../docs/06-conteudo-e-assets.md`, `../docs/07-rotas-e-integracoes.md`, `../docs/08-testes-e-qualidade.md`, `../docs/09-deploy-e-replit.md`, `../docs/10-manutencao-e-gotchas.md`, `../agents/00-tech-lead.md`, `../agents/05-api-backend-engineer.md`, `../agents/10-security-engineer.md` e os requisitos desta tarefa.

## Agente recomendado e coordenação

**Agente líder:** `../agents/10-security-engineer.md`.

Ele é o melhor agente primário porque a parte crítica da tarefa é impedir que uma senha, token Blob ou sessão seja confiada ao browser, além de combinar cookie, CSRF, rate limit, CSP, validação de upload, origem e logging. O agente deve trabalhar sob a coordenação do `../agents/00-tech-lead.md`, que resolve as fronteiras entre a landing estática, as Functions da Vercel e o scaffold Express existente.

**Agentes de apoio, na ordem de handoff:**

1. `05-api-backend-engineer.md`: contratos OpenAPI, handlers server-side, erros, cookies e integração com Blob.
2. `03-frontend-engineer.md`: tela de login, guard visual do admin, cliente de sessão, conteúdo remoto e upload direto.
3. `06-data-engineer.md`: revisar a decisão de persistir o documento editorial no Blob em vez de criar tabelas sem necessidade; não criar PostgreSQL nesta tarefa.
4. `07-qa-test-engineer.md`: testes de contrato, segurança, integração, regressão de rota e matriz manual no preview da Vercel.
5. `08-accessibility-engineer.md`: labels, foco, mensagens de erro, teclado, contraste e leitura do estado autenticado.
6. `09-performance-engineer.md`: tamanho do bundle, cache dos assets Blob, limite de upload e impacto das Functions.
7. `11-devops-replit.md`: variáveis da Vercel, Root Directory, build, ambientes Preview/Production e migração idempotente.
8. `12-code-reviewer.md`: revisão final de diff, segredos, autorização, escopo e regressões.
9. `13-technical-writer.md`: sincronização de docs, runbook de credenciais e operação do Blob.

## Situação confirmada antes da implementação

- `src/App.tsx` registra `/admin` no Wouter, mas a página atual é carregada sem autenticação.
- `src/pages/Admin.tsx` lê e grava `localStorage` por meio de `LandingContentProvider` e usa `createLocalMediaStorage` para previews temporários.
- `src/storage/media-storage.ts` já define `list`, `upload` e `remove`, mas ainda não chama um servidor.
- `LandingContent` em `src/content/landing-content.ts` já possui IDs estáveis para oito seções e para os seis itens do mini catálogo.
- `artifacts/api-server` possui apenas `GET /api/healthz`; a landing não consome esse serviço atualmente.
- `lib/api-spec/openapi.yaml` é a fonte obrigatória de contratos, e seus arquivos gerados não devem ser editados manualmente.
- O projeto Vercel da imagem está em um Blob Store chamado `images`, público, com a pasta lógica `images-celebre` vazia. A tentativa de leitura do projeto remoto pelo MCP da Vercel respondeu `403 Forbidden`; portanto, nenhum ID de projeto, token ou variável remota deve ser inventado no plano ou no código.
- A configuração atual da landing já gera `dist/public` e possui `vercel.json`; ela precisa passar a preservar `/api/*` antes do rewrite da SPA.

## Referências técnicas consultadas

- [Vercel Blob](https://vercel.com/docs/vercel-blob) — `put`, `list`, `get`, `del`, upload direto pelo cliente e token server-side.
- [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite) — rewrite para deep linking em SPA.
- [Vercel Functions Node.js](https://vercel.com/docs/functions/runtimes/node-js) — handlers, cookies e configuração de Functions.
- [Vercel Monorepos](https://vercel.com/docs/monorepos) — Root Directory por projeto.
- Context7 `/vercel/storage` — limites de upload, `handleUpload`, validação de MIME e `BLOB_READ_WRITE_TOKEN`.

## Imagens que devem ser migradas

O critério “todas as imagens do site” significa todas as imagens efetivamente renderizadas pela landing, não todos os arquivos de rascunho presentes no repositório. A migração inicial deve deduplicar estas oito imagens:

| Chave estável | Arquivo local atual | Uso na landing | Prefixo Blob |
| --- | --- | --- | --- |
| `brand-logo-escura` | `public/images/logo-escura.png` | header, rodapé e favicon | `images-celebre/brand/logo-escura.png` |
| `brand-logo-chromakey` | `public/images/logo-chromakey.png` | logo do hero | `images-celebre/brand/logo-chromakey.png` |
| `room-full` | `attached_assets/client_images/celebre-sala-cheia.jpeg` | hero, karaokê, ambiente e depoimentos | `images-celebre/site/celebre-sala-cheia.jpeg` |
| `pizza-real` | `attached_assets/client_images/celebre-pizza-real.jpeg` | nossa pizza, rodízio e catálogo | `images-celebre/site/celebre-pizza-real.jpeg` |
| `room-event` | `attached_assets/client_images/celebre-sala-evento.jpeg` | ambiente e reserva | `images-celebre/site/celebre-sala-evento.jpeg` |
| `pizza-top-hover` | `attached_assets/client_images/pizza-top-hover.webp` | efeito da navegação | `images-celebre/site/pizza-top-hover.webp` |
| `pizza-hero` | `attached_assets/generated_images/pizza-hero.jpg` | Margherita e Vegetariana | `images-celebre/site/pizza-hero.jpg` |
| `pizza-variety` | `attached_assets/generated_images/pizza-variety.jpg` | cardápio e Quattro Formaggi | `images-celebre/site/pizza-variety.jpg` |

`dining-room.jpg`, `floating-pizza.jpg`, `ingredients.jpg` e `karaoke-stage.jpg` continuam fora da migração inicial porque a documentação atual registra que não são importados pela landing. Se entrarem em uma seção no futuro, deverão ser adicionados ao inventário e ao teste de cobertura.

## Global Constraints

- Nunca colocar `ADMIN_PASSWORD`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` ou `BLOB_READ_WRITE_TOKEN` em código, Markdown versionado, `VITE_*`, HTML ou bundle.
- O valor de senha fornecido na tarefa deve ser usado somente como entrada do gerador local de hash e nunca repetido no repositório; o servidor deve armazenar apenas um hash lento com salt, preferencialmente no formato scrypt definido pelo plano.
- O usuário de produção deve ser configurado como `administrator` por `ADMIN_USERNAME`; não confiar em fallback de credencial quando `NODE_ENV=production`.
- A autenticação é server-side. Esconder componentes no React não é autorização; toda leitura protegida, mutação, upload e remoção deve validar a sessão no servidor.
- Usar cookie de sessão `HttpOnly`, `Secure` em produção, `SameSite=Strict`, `Path=/` e expiração curta. Não usar token de sessão no `localStorage`.
- Exigir origem same-origin e CSRF para toda mutação autenticada; login deve ter proteção de origem, mas não pode exigir um CSRF prévio inexistente.
- Usar rate limit local de melhor esforço em cada instância das Functions, retornando `429` quando o bucket local exceder o limite. A limitação não é compartilhada entre instâncias; regras do Firewall/WAF da Vercel são a opção de proteção distribuída sem adicionar banco.
- Aplicar CSP e headers de segurança sem quebrar Google Fonts, imagens locais, imagens Blob públicas e upload direto para o domínio Blob.
- Aceitar somente `image/jpeg`, `image/png` e `image/webp`, com limite de 10 MiB por arquivo; rejeitar SVG e qualquer MIME/pathname incompatível.
- Permitir Blob somente no prefixo `images-celebre/`; o cliente nunca escolhe um pathname arbitrário para sobrescrever outro arquivo.
- Validar `LandingContent` com Zod, preservar os oito IDs de seção e seis IDs de catálogo, limitar tamanho de título/texto e rejeitar URLs `javascript:`, `data:`, `blob:` ou hosts não permitidos.
- O documento editorial no Blob é público por conter apenas conteúdo da landing; nenhum segredo, hash, cookie ou informação operacional pode ser gravado nesse JSON.
- Preservar fallback local para a Home durante indisponibilidade do backend, mas exibir no admin o estado de sincronização e nunca informar “salvo” se a gravação remota falhou.
- Manter o `api-server` Express separado até existir uma decisão de consolidação; as Functions da landing são a camada same-origin desta tarefa.
- Manter `minimumReleaseAge: 1440`, `onlyBuiltDependencies` e demais proteções de supply chain do workspace.
- Usar `pnpm`; atualizar `pnpm-lock.yaml` apenas por comandos do pnpm; não editar geração de Orval ou `dist` manualmente.
- Preservar `data-testid`, IDs de âncora, `alt`, `prefers-reduced-motion` e a página pública sem exigir login.

## Task 1: Baseline, dependências e configuração segura

**Files:**

- Modify: `artifacts/celebre-pizzaria/package.json`
- Modify: `pnpm-lock.yaml`
- Create: `artifacts/celebre-pizzaria/.env.example`
- Create: `artifacts/celebre-pizzaria/scripts/hash-admin-password.ts`
- Test: `artifacts/celebre-pizzaria/src/server/config.test.ts`

**Interfaces:**

- Produces the environment contract consumed by Tasks 2–5.
- Does not place real credential values in `.env.example`; the file documents names, scopes and whether each value is secret.

- [ ] **Step 1: Record the baseline and confirm the source tree.**

Run:

```powershell
pnpm --filter @workspace/celebre-pizzaria run typecheck
pnpm --filter @workspace/celebre-pizzaria run test
pnpm --filter @workspace/celebre-pizzaria run build
```

Expected: all commands exit with code `0`; record the existing Vite sourcemap warning if it appears, without hiding it.

- [ ] **Step 2: Add runtime dependencies through pnpm.**

Add `@vercel/blob` and `zod` as runtime dependencies of the landing. Add `@vercel/node` and `tsx` as development dependencies only if the installed Vercel handler types and migration runner require them. Keep `react-icons`, which is already present, and do not add another icon package.

- [ ] **Step 3: Define the safe environment contract.**

Create `.env.example` with these names and comments, without values:

```env
# Server-only Vercel Blob token; never prefix with VITE_.
BLOB_READ_WRITE_TOKEN=

# Production admin identity and scrypt password hash.
ADMIN_USERNAME=administrator
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=

# Optional comma-separated same-origin allowlist for custom domains.
ADMIN_ALLOWED_ORIGINS=

# Public, non-secret Blob path for the editorial JSON.
CONTENT_BLOB_PATH=images-celebre/config/landing-content.json
```

Add or confirm the ignore rule for `.env`, `.env.local`, `.env.*.local` and generated migration output.

- [ ] **Step 4: Implement a non-persistent password hash generator.**

Create `hash-admin-password.ts` using `node:crypto` `scrypt` with a random 16-byte salt and this serialized format:

```text
scrypt$N$r$p$base64url-salt$base64url-derived-key
```

The command must read the bootstrap password from an interactive input, print only the resulting hash, and never write the input to a file or log. The exact password supplied in the task is entered only at execution time. The server will compare passwords against the generated scrypt hash; it must not treat the supplied SHA-256-looking value as a secure password hash.

- [ ] **Step 5: Add configuration tests before feature code.**

Test that production configuration fails closed when `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` or `BLOB_READ_WRITE_TOKEN` are absent; test that development configuration may use the explicit local adapters without accepting a missing production secret.

- [ ] **Step 6: Run the focused baseline test and commit the setup.**

Run:

```powershell
pnpm --dir artifacts/celebre-pizzaria run test -- src/server/config.test.ts
```

Expected: PASS. Commit with:

```text
chore: prepare admin security and blob dependencies
```

## Task 2: Server-side authentication, cookie session and CSRF

**Files:**

- Create: `artifacts/celebre-pizzaria/src/server/admin-password.ts`
- Create: `artifacts/celebre-pizzaria/src/server/admin-session.ts`
- Create: `artifacts/celebre-pizzaria/src/server/admin-cookies.ts`
- Create: `artifacts/celebre-pizzaria/src/server/admin-auth.ts`
- Create: `artifacts/celebre-pizzaria/src/lib/admin-types.ts`
- Create: `artifacts/celebre-pizzaria/api/admin/login.ts`
- Create: `artifacts/celebre-pizzaria/api/admin/session.ts`
- Create: `artifacts/celebre-pizzaria/api/admin/logout.ts`
- Test: `artifacts/celebre-pizzaria/src/server/admin-password.test.ts`
- Test: `artifacts/celebre-pizzaria/src/server/admin-session.test.ts`
- Test: `artifacts/celebre-pizzaria/src/server/admin-auth.test.ts`

**Interfaces:**

```ts
// src/lib/admin-types.ts contains only shared, non-secret client/server types.
import type { LandingContent } from '@/content/landing-content';

export interface AdminSession {
  username: string;
  issuedAt: number;
  expiresAt: number;
}

export interface ContentDocument {
  content: LandingContent;
  revision: string;
  updatedAt: string;
}
```

The `AdminSession` and `ContentDocument` types must live in `src/lib/admin-types.ts`, so the client never imports a server implementation module. The server-only files consume these types; the browser imports them as type-only symbols.

```ts
import type { AdminSession } from '@/lib/admin-types';

export function verifyAdminPassword(
  password: string,
  serializedHash: string,
): Promise<boolean>;

export function createAdminSessionToken(
  session: AdminSession,
  secret: string,
): string;

export function readAdminSessionToken(
  token: string | undefined,
  secret: string,
  now?: number,
): AdminSession | null;
```

- [ ] **Step 1: Write failing password tests.**

Cover a valid scrypt hash, an invalid password, a malformed serialized hash, an expired/unsupported parameter set and a comparison with different-length derived keys. Expected behavior is `false` for all invalid cases, never a thrown error that reaches the handler.

- [ ] **Step 2: Implement password verification.**

Parse only the exact `scrypt$N$r$p$salt$hash` format, enforce safe bounds for `N`, `r`, `p` and derived-key length, derive with `node:crypto.scrypt`, and compare equal-length buffers with `timingSafeEqual`. Never log either password or hash.

- [ ] **Step 3: Write failing session tests.**

Test round-trip signing, tampered payload, tampered signature, wrong secret, expired session, future-issued session beyond the allowed clock skew and a username other than the configured administrator. The result must be `null` for invalid tokens.

- [ ] **Step 4: Implement the signed session.**

Use a compact base64url payload plus HMAC-SHA-256 signature generated from `ADMIN_SESSION_SECRET`; use a 30-minute absolute expiration and a five-minute clock-skew tolerance. Do not add a bearer token to JSON responses.

- [ ] **Step 5: Implement cookies and CSRF.**

Create `celebre_admin_session` as `HttpOnly; Secure in production; SameSite=Strict; Path=/; Max-Age=1800` and `celebre_admin_csrf` as the same cookie without `HttpOnly`. Generate the CSRF token with `randomBytes(32)`. Parse and serialize cookies using a maintained package rather than string concatenation.

- [ ] **Step 6: Implement the auth handlers.**

`POST /api/admin/login` accepts `{ username, password }`, validates string lengths, applies the login limiter from Task 3, compares against the configured administrator, sets both cookies and returns `{ authenticated: true, username, expiresAt }`. Invalid credentials always return `401` with the same generic message and no field-specific hint. Missing server configuration returns `503` without naming the missing variable.

`GET /api/admin/session` returns the authenticated session or `401`. `POST /api/admin/logout` clears both cookies and returns `204`; it must be safe to call repeatedly.

- [ ] **Step 7: Test the handlers and commit.**

Run:

```powershell
pnpm --dir artifacts/celebre-pizzaria run test -- src/server/admin-password.test.ts src/server/admin-session.test.ts src/server/admin-auth.test.ts
```

Expected: PASS. Commit with:

```text
feat: add server-side admin authentication
```

## Task 3: Security policy, rate limiting and Vercel routing

**Files:**

- Create: `artifacts/celebre-pizzaria/src/server/request-security.ts`
- Create: `artifacts/celebre-pizzaria/src/server/rate-limit.ts`
- Create: `artifacts/celebre-pizzaria/src/server/response-security.ts`
- Modify: `artifacts/celebre-pizzaria/vercel.json`
- Test: `artifacts/celebre-pizzaria/src/server/request-security.test.ts`
- Test: `artifacts/celebre-pizzaria/src/server/rate-limit.test.ts`
- Test: `artifacts/celebre-pizzaria/src/server/response-security.test.ts`

**Interfaces:**

```ts
export function assertSameOrigin(request: Request): void;
export function assertCsrf(request: Request): void;
export function requireAdmin(request: Request): AdminSession;
export async function enforceLimit(
  key: string,
  limit: number,
  window: string,
): Promise<void>;
```

- [ ] **Step 1: Write failing origin and CSRF tests.**

Cover accepted same-origin requests, a configured custom origin, mismatched `Origin`, missing `Origin` on a browser mutation, missing CSRF header, mismatched CSRF cookie/header and valid double-submit. Return `403` at the handler boundary without exposing which check failed.

- [ ] **Step 2: Implement same-origin and CSRF checks.**

Derive the canonical origin from the request URL, accept only that origin or the exact values in `ADMIN_ALLOWED_ORIGINS`, read the CSRF cookie server-side and compare it with `x-csrf-token` using `timingSafeEqual`. Apply the check to `PUT`, `POST` and `DELETE` admin operations except the initial login route.

- [ ] **Step 3: Write failing rate-limit tests.**

Use a fake limiter to verify these exact policies:

| Operation | Key | Limit |
| --- | --- | --- |
| Login | `admin-login:ip:<ip>:user:<username>` | 5 attempts per 15 minutes |
| Authenticated content mutation | `admin-content:session:<session-id>` | 30 per minute |
| Blob token generation | `admin-upload:session:<session-id>` | 20 per hour |
| Media listing/removal | `admin-media:session:<session-id>` | 60 per minute |

Test that an exceeded local limit returns `429` with `Retry-After`, including in a production configuration without external storage.

- [ ] **Step 4: Implement local rate limiting without external storage.**

Use bounded in-memory sliding-window buckets inside each Function instance. Extract the first valid IP from `x-forwarded-for` only for the rate-limit key; do not log the complete header. Document that serverless instances do not share the buckets and recommend Vercel Firewall/WAF rules for distributed edge protection.

- [ ] **Step 5: Add response security.**

Create a helper that applies `Cache-Control: no-store` and `Pragma: no-cache` to login, session, logout and all `/api/admin/*` responses. Add JSON content type, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Cross-Origin-Opener-Policy: same-origin` and `frame-ancestors 'none'` through the Vercel configuration.

- [ ] **Step 6: Update `vercel.json` without intercepting Functions.**

Keep `buildCommand: "pnpm run build"` and `outputDirectory: "dist/public"`. Replace the current blanket SPA rewrite with a path pattern that excludes `/api`, then route all remaining client paths to `/index.html`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist/public",
  "rewrites": [
    {
      "source": "/:path((?!api(?:/|$)).*)",
      "destination": "/index.html"
    }
  ]
}
```

Add a `headers` entry with this CSP, preserving the current Google Fonts and the Blob upload/image domains:

```text
default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://*.blob.vercel-storage.com; connect-src 'self' https://*.blob.vercel-storage.com
```

Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` only after the production domain and every included subdomain are confirmed HTTPS-only.

- [ ] **Step 7: Run focused tests and commit.**

Run:

```powershell
pnpm --dir artifacts/celebre-pizzaria run test -- src/server/request-security.test.ts src/server/rate-limit.test.ts src/server/response-security.test.ts
```

Expected: PASS. Commit with:

```text
feat: enforce admin security policies and SPA routing
```

## Task 4: OpenAPI contract and Vercel Function handlers

**Files:**

- Modify: `lib/api-spec/openapi.yaml`
- Regenerate: `lib/api-client-react/src/generated/*`
- Regenerate: `lib/api-zod/src/generated/*`
- Create: `artifacts/celebre-pizzaria/api/content.ts`
- Create: `artifacts/celebre-pizzaria/api/admin/content.ts`
- Create: `artifacts/celebre-pizzaria/api/admin/content-reset.ts`
- Create: `artifacts/celebre-pizzaria/api/admin/media.ts`
- Create: `artifacts/celebre-pizzaria/api/admin/blob-token.ts`
- Create: handler tests under `artifacts/celebre-pizzaria/src/server/handlers/`

**Interfaces:**

The OpenAPI contract must define these operations under the existing `/api` server base:

| Method | Path | Authentication | Success |
| --- | --- | --- | --- |
| `GET` | `/content` | public | `200 { content, revision, source }` |
| `POST` | `/admin/login` | origin + rate limit | `200 { authenticated, username, expiresAt }` |
| `GET` | `/admin/session` | session cookie | `200 { authenticated, username, expiresAt }` |
| `POST` | `/admin/logout` | session if present | `204` |
| `PUT` | `/admin/content` | session + CSRF | `200 { content, revision }` |
| `POST` | `/admin/content-reset` | session + CSRF | `200 { content, revision }` |
| `GET` | `/admin/media` | session | `200 { assets }` |
| `DELETE` | `/admin/media` | session + CSRF | `204` |
| `POST` | `/admin/blob-token` | session + CSRF | Blob client token response |

Every error schema must include a stable `code`, a safe `message` and an optional `retryAfter`; it must not include stack traces, environment variables or raw Blob errors.

- [ ] **Step 1: Write the OpenAPI schemas and error responses first.**

Define `LandingContent`, `ImageSlot`, `LandingSection`, `CatalogItem`, `MediaAsset`, `AdminSession`, `LoginRequest`, `ContentUpdateRequest`, `ContentUpdateResponse` and error schemas. Define `401`, `403`, `409`, `413`, `415`, `422`, `429` and `503` where each operation can return them.

- [ ] **Step 2: Regenerate the clients and Zod schemas.**

Run:

```powershell
pnpm --filter @workspace/api-spec run codegen
```

Review generated changes; do not edit them manually. If the generated client does not preserve same-origin cookies, update the handwritten `lib/api-client-react/src/custom-fetch.ts` rather than generated files.

- [ ] **Step 3: Implement the public content handler.**

`GET /api/content` loads the editorial JSON through the Blob service from Task 5, validates it, returns `source: "blob"` and a revision when available, and returns validated defaults with `source: "defaults"` when the seed blob does not exist. It must never return admin configuration.

- [ ] **Step 4: Implement protected content handlers.**

`PUT /api/admin/content` requires session, origin, CSRF and content rate limit; it accepts `{ content, revision }`, validates the full shape, checks the revision for optimistic concurrency and returns `409` when another admin has changed the document. `POST /api/admin/content-reset` writes validated defaults through the same protected path.

- [ ] **Step 5: Implement protected Blob handlers.**

`GET /api/admin/media` lists only `images-celebre/` and maps Blob metadata to `MediaAsset`. `DELETE /api/admin/media` accepts only a URL/pathname from that prefix, rejects all other hosts/paths and calls `del` only after authorization. `POST /api/admin/blob-token` delegates to `handleUpload`, checks the authenticated session in `onBeforeGenerateToken`, permits only the three image MIME types, sets the 10 MiB limit, expires the client token after 10 minutes and verifies the upload-completed callback through the library signature validation.

- [ ] **Step 6: Verify routing precedence.**

Run a Vercel-compatible build or preview and verify that `/api/content` reaches a Function, while `/`, `/admin` and a client-side unknown path receive `index.html`. A request to `/api/unknown` must return JSON `404`, never the HTML SPA shell.

- [ ] **Step 7: Run codegen, typecheck and commit.**

Run:

```powershell
pnpm --filter @workspace/api-spec run codegen
pnpm run typecheck
```

Expected: codegen and typecheck pass. Commit with:

```text
feat: define protected admin and media API contracts
```

## Task 5: Blob media service, editorial document and one-time migration

**Files:**

- Create: `artifacts/celebre-pizzaria/src/server/blob-paths.ts`
- Create: `artifacts/celebre-pizzaria/src/server/blob-media.ts`
- Create: `artifacts/celebre-pizzaria/src/server/blob-content.ts`
- Create: `artifacts/celebre-pizzaria/src/storage/vercel-blob-media-storage.ts`
- Create: `artifacts/celebre-pizzaria/scripts/migrate-assets-to-blob.ts`
- Modify: `artifacts/celebre-pizzaria/src/lib/admin-types.ts`
- Modify: `artifacts/celebre-pizzaria/src/storage/media-storage.ts`
- Modify: `artifacts/celebre-pizzaria/src/content/landing-content.ts`
- Modify: `artifacts/celebre-pizzaria/src/content/landing-defaults.ts`
- Create or modify: `artifacts/celebre-pizzaria/src/content/landing-defaults-data.ts`
- Modify: `artifacts/celebre-pizzaria/src/components/Navigation.tsx`
- Test: `artifacts/celebre-pizzaria/src/server/blob-paths.test.ts`
- Test: `artifacts/celebre-pizzaria/src/server/blob-content.test.ts`
- Test: `artifacts/celebre-pizzaria/src/storage/vercel-blob-media-storage.test.ts`

**Interfaces:**

```ts
export const BLOB_MEDIA_PREFIX = 'images-celebre/';
export const CONTENT_BLOB_PATH = 'images-celebre/config/landing-content.json';

export function isAllowedBlobUrl(value: string): boolean;
export function isAllowedBlobPath(value: string): boolean;

// In `src/storage/media-storage.ts`, make metadata optional so both adapters
// satisfy the same contract.
export interface MediaStorage {
  list: () => Promise<MediaAsset[]>;
  upload: (file: File, metadata?: { slotId?: string }) => Promise<MediaAsset>;
  remove: (asset: MediaAsset) => Promise<void>;
}

export type RemoteMediaStorage = MediaStorage;
```

`ContentDocument` is imported from the shared `src/lib/admin-types.ts`; it is not duplicated in a server-only module.

- [ ] **Step 1: Make the default content importable without Vite-only binary imports.**

Extract the pure editorial/default data into `landing-defaults-data.ts` and add a stable `mediaKey` to every `ImageSlot`. Preserve the existing eight section IDs, six catalog IDs, labels, purposes, alt texts, prices and titles. Keep `landing-defaults.ts` as the public factory and resolve the current local image paths there. Update `Navigation.tsx` to use the shared `PIZZA_TOP_HOVER_PATH` constant instead of importing the binary asset directly. Do not remove local files; they remain the fallback and migration source.

- [ ] **Step 2: Write path allowlist tests.**

Accept only the exact `images-celebre/` prefix and the configured `*.blob.vercel-storage.com` host. Reject `http://`, `javascript:`, `data:`, `blob:`, path traversal, a second Blob store, an external image host and a pathname outside `images-celebre/`.

- [ ] **Step 3: Implement the server Blob service.**

Use `put`, `list`, `get` and `del` from `@vercel/blob` with `BLOB_READ_WRITE_TOKEN` read only on the server. Public images use `access: 'public'`, deterministic migration paths, the correct content type and cache control. The content JSON is written to `CONTENT_BLOB_PATH` with `access: 'public'`, `contentType: 'application/json'` and overwrite guarded by the revision check. Never put the token in a client import.

- [ ] **Step 4: Implement the client media adapter.**

Use `upload` from `@vercel/blob/client` with `handleUploadUrl: '/api/admin/blob-token'`, `access: 'public'`, the slot metadata as `clientPayload`, progress reporting and an abort signal. The client receives only the Blob result URL. `list` and `remove` call the protected API endpoints; previews continue to use the local adapter only in explicit offline mode.

- [ ] **Step 5: Write migration tests before the migration command.**

Test that the inventory contains exactly the eight unique site images, duplicate source uses map to one Blob pathname, an existing Blob is skipped by default, and the content JSON is not overwritten when a revision already exists.

- [ ] **Step 6: Implement the idempotent migration command.**

Create `scripts/migrate-assets-to-blob.ts` with the explicit inventory from this plan. It must support `--dry-run` and default to non-destructive behavior: list the prefix, upload only missing files, seed `images-celebre/config/landing-content.json` only when absent, and print counts/paths without printing the token. A separate `--replace-existing` flag may overwrite only the exact inventory paths after a human has reviewed the dry run; it must never delete unrelated blobs.

Run locally only after Vercel environment variables are available:

```powershell
pnpm --dir artifacts/celebre-pizzaria exec tsx scripts/migrate-assets-to-blob.ts --dry-run
pnpm --dir artifacts/celebre-pizzaria exec tsx scripts/migrate-assets-to-blob.ts
```

Expected after the real run: eight unique image blobs under `images-celebre/`, one editorial JSON blob, every `ImageSlot.src` in the seeded content points to an allowlisted Blob URL, and the local fallback remains intact.

- [ ] **Step 7: Run media tests and commit.**

Run:

```powershell
pnpm --dir artifacts/celebre-pizzaria run test -- src/server/blob-paths.test.ts src/server/blob-content.test.ts src/storage/vercel-blob-media-storage.test.ts
```

Expected: PASS. Commit with:

```text
feat: add Vercel Blob media and content storage
```

## Task 6: Frontend login gate, remote content and admin persistence

**Files:**

- Create: `artifacts/celebre-pizzaria/src/lib/admin-client.ts`
- Create: `artifacts/celebre-pizzaria/src/hooks/use-admin-session.ts`
- Create: `artifacts/celebre-pizzaria/src/pages/AdminLogin.tsx`
- Modify: `artifacts/celebre-pizzaria/src/App.tsx`
- Modify: `artifacts/celebre-pizzaria/src/pages/Admin.tsx`
- Modify: `artifacts/celebre-pizzaria/src/content/content-provider.tsx`
- Create: `artifacts/celebre-pizzaria/src/content/remote-content-repository.ts`
- Modify: `artifacts/celebre-pizzaria/src/storage/media-storage.ts`
- Create: `artifacts/celebre-pizzaria/src/storage/remote-media-storage.ts`
- Test: `artifacts/celebre-pizzaria/src/pages/AdminLogin.test.tsx`
- Modify: `artifacts/celebre-pizzaria/src/pages/Admin.test.tsx`
- Test: `artifacts/celebre-pizzaria/src/content/remote-content-repository.test.ts`

**Interfaces:**

```ts
export interface AdminClient {
  login(username: string, password: string): Promise<AdminSession>;
  session(): Promise<AdminSession | null>;
  logout(): Promise<void>;
  saveContent(content: LandingContent, revision: string): Promise<ContentDocument>;
}

export interface ContentSyncState {
  source: 'local' | 'defaults' | 'blob';
  loading: boolean;
  saving: boolean;
  revision: string | null;
  error: string | null;
}
```

- [ ] **Step 1: Write failing login and guard tests.**

Test the login form labels `Usuário` and `Senha`, autocomplete values `username` and `current-password`, disabled submit while pending, generic invalid-credential feedback, no credential value in rendered text, authenticated panel after a successful session and redirect/guard after `401`.

- [ ] **Step 2: Implement the session client.**

Use same-origin `fetch` or the regenerated client with `credentials: 'same-origin'`. Read only the non-HttpOnly CSRF cookie to send `x-csrf-token` on mutations. Never read, store or display the session cookie. Convert `401`, `403`, `409`, `429` and `503` into user-safe messages while preserving retry information where available.

- [ ] **Step 3: Implement the login screen at `/admin`.**

Keep `/admin` discoverable as a public route that initially renders only `AdminLogin`; the static bundle cannot be a security boundary. Do not render the editor until `/api/admin/session` confirms authentication. Provide a loading state, retry state and a logout action. Do not prefill the password or include the bootstrap value in the bundle.

- [ ] **Step 4: Replace local-only admin saves with draft plus explicit remote save.**

Keep the existing explicit section labels, `sectionId`, `slotId` and `catalogItemId`. Load the remote document after login, keep edits in a draft, and add `Salvar alterações` so every title/content update is not sent on every keystroke. On success, update the provider, revision and local fallback; on `409`, reload the current remote version and show that the draft must be reviewed. `Restaurar defaults` must call the protected reset endpoint and only show success after the server responds.

- [ ] **Step 5: Connect Blob media controls.**

Replace the default `localMediaStorage` in production with `remoteMediaStorage`. The editor must show “Blob Vercel” for remote assets, upload progress, unsupported-type/size errors, retry, and a remove action that cannot remove an asset still referenced by a slot without an explicit confirmation. Keep the temporary local preview option only for offline development and label it as non-persistent.

- [ ] **Step 6: Make the public Home consume remote content with fallback.**

On provider initialization, render validated defaults immediately, request `/api/content`, replace the content when the response is valid and preserve defaults if the request fails. Do not let a stale `localStorage` document override a newer Blob document. Keep localStorage only as an offline draft/cache with the existing versioned key.

- [ ] **Step 7: Run frontend tests and commit.**

Run:

```powershell
pnpm --dir artifacts/celebre-pizzaria run test -- src/pages/AdminLogin.test.tsx src/pages/Admin.test.tsx src/content/remote-content-repository.test.ts
```

Expected: PASS. Commit with:

```text
feat: protect and persist the admin content editor
```

## Task 7: Official WhatsApp icon and acessibilidade da UI

**Files:**

- Modify: `artifacts/celebre-pizzaria/src/components/FloatingWhatsAppButton.tsx`
- Modify: `artifacts/celebre-pizzaria/src/components/FloatingWhatsAppButton.test.tsx`
- Modify: `artifacts/celebre-pizzaria/docs/06-conteudo-e-assets.md`
- Modify: `artifacts/celebre-pizzaria/docs/08-testes-e-qualidade.md`

- [ ] **Step 1: Write the icon regression test.**

Keep the existing `floating-whatsapp` test ID and accessible name. Assert that the button still links to `wa.me/5524999687150` and renders a brand SVG from `react-icons`, not the generic `MessageCircle` icon.

- [ ] **Step 2: Replace the generic icon.**

Import `FaWhatsapp` from the already installed `react-icons/fa6`, retain the official green brand treatment, `aria-hidden="true"`, screen-reader label, focus ring, `target="_blank"` and `rel="noopener noreferrer"`. Do not add another icon dependency.

- [ ] **Step 3: Run the focused test and commit.**

Run:

```powershell
pnpm --dir artifacts/celebre-pizzaria run test -- src/components/FloatingWhatsAppButton.test.tsx
```

Expected: PASS. Commit with:

```text
fix: use official WhatsApp brand icon
```

The accessibility review must confirm the login and editor states remain operable with keyboard, readable by assistive technology and usable with reduced motion.

## Task 8: Security, integration and regression verification

**Files:**

- Create or modify: `artifacts/celebre-pizzaria/src/server/integration-tests/*`
- Modify: `artifacts/celebre-pizzaria/docs/08-testes-e-qualidade.md`
- Modify: `artifacts/celebre-pizzaria/docs/09-deploy-e-replit.md`
- Modify: `artifacts/celebre-pizzaria/docs/10-manutencao-e-gotchas.md`

- [ ] **Step 1: Add contract/security tests.**

Cover:

1. unauthenticated `GET /api/admin/session` returns `401`;
2. invalid login returns the same generic `401` shape for unknown user and wrong password;
3. the sixth login attempt in the window returns `429`;
4. admin content mutation without session returns `401`;
5. mutation without CSRF or with a different origin returns `403`;
6. stale content revision returns `409` and does not overwrite Blob;
7. unsupported file type, oversized file and invalid pathname are rejected;
8. delete outside `images-celebre/` is rejected without calling `del`;
9. logout clears cookies and a previous browser session no longer authorizes client requests;
10. `BLOB_READ_WRITE_TOKEN` does not occur in the generated JS/CSS bundle.

- [ ] **Step 2: Run the complete workspace validation.**

Run each command and record its exit code:

```powershell
pnpm -r --if-present run test
pnpm run typecheck
pnpm --filter @workspace/celebre-pizzaria run typecheck
pnpm --filter @workspace/celebre-pizzaria run build
git diff --check
```

Expected: tests, typechecks, build and diff check pass. Keep the known sourcemap warning visible if it remains.

- [ ] **Step 3: Run the published-flow manual matrix.**

In a Vercel Preview with the configured environment, verify:

| Scenario | Expected result |
| --- | --- |
| Open `/` | Home renders without login |
| Open `/admin` | Login screen only |
| Login with configured administrator and bootstrap password | Editor loads and session cookies are set |
| Inspect `document.cookie` | Session token is absent; only CSRF cookie may be visible |
| Refresh `/admin` | Session remains until expiration |
| Logout and refresh | Login screen returns; protected API calls are `401` |
| Edit title and save | Response `200`; new title appears in Home after reload |
| Upload JPEG/PNG/WebP under 10 MiB | Blob URL is returned and slot can select it |
| Upload SVG, wrong MIME or over 10 MiB | Rejected with safe validation message |
| Direct Blob URL | Image loads publicly with cache headers |
| `/api/content` | JSON response, never SPA HTML |
| `/admin` after direct navigation/refresh | `index.html` fallback loads and the login gate remains |
| `/path-that-does-not-exist` | Existing NotFound UI remains |
| Browser console | No CSP violation for fonts, app scripts or Blob upload |
| `prefers-reduced-motion: reduce` | Admin and Home remain usable without required animation |

- [ ] **Step 4: Add performance checks.**

Measure the production bundle before and after the migration, confirm that the browser no longer embeds duplicate binary assets when the remote document is active, verify Blob cache headers, and confirm that direct uploads do not route a 10 MiB file through a Function unnecessarily.

- [ ] **Step 5: Handoff to Security, QA and Code Review.**

The Security Engineer must report secrets, cookie flags, CSRF, rate-limit behavior, CSP and residual risks. QA must report every manual scenario with URL, environment and result. Code Review must inspect the staged diff and reject any token, password, generated-file edit or unprotected handler.

## Task 9: Vercel provisioning, first migration and operational release

**Files:**

- Modify: `artifacts/celebre-pizzaria/docs/README.md`
- Modify: `artifacts/celebre-pizzaria/docs/02-arquitetura.md`
- Modify: `artifacts/celebre-pizzaria/docs/06-conteudo-e-assets.md`
- Modify: `artifacts/celebre-pizzaria/docs/07-rotas-e-integracoes.md`
- Modify: `artifacts/celebre-pizzaria/docs/09-deploy-e-replit.md`
- Modify: `artifacts/celebre-pizzaria/docs/10-manutencao-e-gotchas.md`
- Modify: `artifacts/celebre-pizzaria/docs/11-mapa-de-arquivos.md`

- [ ] **Step 1: Configure the Vercel project manually or through an authorized Vercel integration.**

Use the project shown in the user’s browser and set:

- Root Directory: `artifacts/celebre-pizzaria`
- Framework Preset: `Vite`
- Build Command: `pnpm run build`
- Output Directory: `dist/public`
- Production and Preview environment variables: `BLOB_READ_WRITE_TOKEN`, `ADMIN_USERNAME`, generated `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, `ADMIN_ALLOWED_ORIGINS` and `CONTENT_BLOB_PATH`

Attach the existing public Blob Store `images` and keep the application prefix `images-celebre/`. Do not provision Redis or another storage service for this application. Do not paste secret values into GitHub, the plan, issue comments or terminal output.

- [ ] **Step 2: Generate and set the admin credentials.**

Set `ADMIN_USERNAME=administrator`. Run the hash generator from Task 1 using the password supplied by the user, paste only the resulting scrypt hash into `ADMIN_PASSWORD_HASH`, and generate `ADMIN_SESSION_SECRET` with at least 32 random bytes. Changing `ADMIN_SESSION_SECRET` is the documented emergency action to revoke all existing sessions; rotating `ADMIN_PASSWORD_HASH` is the documented credential rotation.

- [ ] **Step 3: Deploy the code before seeding.**

Push the reviewed implementation, wait for a successful Preview deployment, verify the Function endpoints and headers, then promote only after the manual matrix passes. The migration must not run during the Vite build and must not run automatically on every deployment.

- [ ] **Step 4: Run the migration exactly once against the intended Blob Store.**

Execute the dry run, review the eight paths, execute the real migration, then call `/api/content` and `/api/admin/media` to verify the counts and URLs. Keep a copy of the command output without secrets as the release evidence.

- [ ] **Step 5: Document rollback.**

Rollback consists of restoring the previous Vercel deployment; the client fallback to validated defaults is automatic when `/api/content` is unavailable. Leave existing Blob objects untouched. Never delete the store to roll back a code deployment. If a Blob object must be removed, use the protected admin delete path only after confirming no `ImageSlot.src` references it.

- [ ] **Step 6: Update the documentation index and commit the runbook.**

Add a link to this plan in `docs/README.md`, document the new API/media boundaries, security variables, migration command, cookie behavior, CSP domains, rate-limit prerequisites and emergency rotation in the referenced docs. Commit with:

```text
docs: document admin auth and Vercel Blob operations
```

## Acceptance criteria

- `/admin` shows an authentication screen before the editor and the editor is inaccessible through the UI without a valid server session.
- The configured user is `administrator`; the supplied bootstrap password works only through the server-side verification flow and is never present in source, HTML, `VITE_*` or client storage.
- Session cookies are HttpOnly/Secure/SameSite-protected, expire after 30 minutes and are revoked by logout or session-secret rotation.
- Login and protected admin operations have local best-effort rate limits, generic auth errors and safe `429` responses; distributed edge protection can be added through Vercel Firewall/WAF rules.
- Same-origin, CSRF and validation checks protect every state-changing admin endpoint.
- CSP and response headers protect the landing and still permit current fonts, scripts, local images and public Blob images/direct uploads.
- All eight images actually used by the landing are present under `images-celebre/` and all configured image slots resolve to public Blob URLs after seeding.
- Titles, section images, catalog images and reset are persisted remotely in the editorial document; `localStorage` is only an offline fallback/cache.
- The Vercel rewrite serves `/admin` without turning `/api/*` into `index.html`.
- The floating WhatsApp button uses `FaWhatsapp` from `react-icons`, preserves its accessible name and opens the confirmed phone.
- Workspace tests, landing tests, typechecks, build, security tests and the Vercel Preview manual matrix pass with evidence.

## Verificações obrigatórias finais

```powershell
pnpm --filter @workspace/api-spec run codegen
pnpm -r --if-present run test
pnpm run typecheck
pnpm --filter @workspace/celebre-pizzaria run typecheck
pnpm --filter @workspace/celebre-pizzaria run build
git diff --check
```

Não marcar o plano como concluído apenas porque o build passou: a sessão, o CSRF, o rate limit, a CSP, o Blob público, o fallback da SPA e a jornada de login precisam ser verificados no Preview da Vercel.
