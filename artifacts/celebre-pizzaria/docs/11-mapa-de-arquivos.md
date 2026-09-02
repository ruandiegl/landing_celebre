# Mapa de arquivos

## Produto principal: `artifacts/celebre-pizzaria`

| Caminho | Responsabilidade |
| --- | --- |
| `package.json` | scripts, dependências e nome do pacote web |
| `vite.config.ts` | plugins, aliases, porta, base path e build |
| `tsconfig.json` | TypeScript da aplicação, Functions e scripts |
| `components.json` | convenção shadcn/Radix e aliases de UI |
| `index.html` | ponto de entrada HTML, metadata e favicon |
| `.replit-artifact/artifact.toml` | preview, portas e serviço estático de produção |
| `public/robots.txt` | regra pública de rastreamento |
| `public/favicon.svg` | SVG disponível no diretório público |
| `src/main.tsx` | bootstrap do React |
| `src/App.tsx` | providers, Wouter e fallback de rota |
| `src/pages/Home.tsx` | composição e ordem da landing |
| `src/pages/Admin.tsx` | painel protegido para rascunho e publicação de títulos, imagens e mini catálogo |
| `src/pages/AdminLogin.tsx` | autenticação do administrador |
| `src/pages/not-found.tsx` | página 404 |
| `src/content/landing-content.ts` | contratos, IDs estáveis e helpers imutáveis |
| `src/content/landing-defaults.ts` | defaults com fontes bundled para fallback |
| `src/content/landing-defaults-data.ts` | defaults puros usados por reset/migração |
| `src/content/content-repository.ts` | persistência local versionada e reset |
| `src/content/content-provider.tsx` | fonte compartilhada entre landing e admin |
| `src/storage/media-storage.ts` | contrato de mídia |
| `src/storage/local-media-storage.ts` | assets bundled e previews temporários |
| `src/storage/remote-media-storage.ts` | upload client-side com token temporário |
| `src/content/remote-content-repository.ts` | leitura do documento publicado |
| `src/lib/admin-client.ts` | cliente same-origin de auth/conteúdo/mídia |
| `src/lib/admin-types.ts` | tipos compartilhados de sessão e documento |
| `src/hooks/use-admin-session.ts` | estado de sessão do Admin |
| `api/*.ts` | Vercel Functions públicas e administrativas |
| `src/server/*.ts` | autenticação, cookies, CSRF, rate limit, Blob e validação |
| `scripts/hash-admin-password.ts` | geração local de hash scrypt, sem persistir segredo |
| `scripts/migrate-assets-to-blob.ts` | seed idempotente dos oito assets no Blob |
| `src/lib/contact-links.ts` | telefone, WhatsApp, mapa e Instagram |
| `src/index.css` | Tailwind, tokens, tema, fontes e animações |
| `src/lib/utils.ts` | helper `cn` para classes |
| `src/hooks/use-mobile.tsx` | hook de breakpoint de 768px, disponível para uso |
| `src/hooks/use-toast.ts` | estado e dispatcher do sistema de toast |
| `src/components/Navigation.tsx` | navegação fixa, logo e CTAs |
| `src/components/HeroSection.tsx` | hero e proposta de valor |
| `src/components/FloatingPizzaSection.tsx` | processo artesanal e pizza com efeito flutuante |
| `src/components/CardapioSection.tsx` | cards e dados do cardápio |
| `src/components/RodizioSection.tsx` | rodízio e benefícios |
| `src/components/KaraokeSection.tsx` | experiência e horários do karaokê |
| `src/components/AmbienceSection.tsx` | galeria e atributos do ambiente |
| `src/components/TestimonialsSection.tsx` | depoimentos estáticos |
| `src/components/ReservationSection.tsx` | CTA WhatsApp e informações de contato |
| `src/components/Footer.tsx` | marca, navegação auxiliar, contato e redes |
| `src/components/MobileFloatingCTA.tsx` | CTAs fixos em viewport mobile |
| `src/components/FloatingWhatsAppButton.tsx` | botão flutuante global de WhatsApp |
| `src/components/motion/Reveal.tsx` | reveal com Framer Motion e reduced motion |
| `src/components/motion/HeroIntro.tsx` | timeline GSAP escopada na hero |
| `src/components/ui/*.tsx` | primitives shadcn/Radix; são componentes de infraestrutura visual |
| `attached_assets/client_images/*` | imagens fornecidas pelo cliente |
| `attached_assets/generated_images/*` | imagens geradas disponíveis para uso |
| `dist/public/` | saída gerada do build; não é fonte de edição |
| `docs/` | esta documentação |
| `plans/plan-001-admin-animacoes-e-contatos.md` | plano executado da primeira entrega |
| `plans/plan-002-autenticacao-admin-e-vercel-blob.md` | plano da autenticação, Functions, Blob e migração |

## Artifacts auxiliares

### `artifacts/api-server`

Servidor Express 5 separado. `src/app.ts` monta middleware e `/api`; `src/routes/health.ts` expõe `/api/healthz`; `src/index.ts` valida `PORT`; `src/lib/logger.ts` configura Pino; `build.mjs` empacota a API com esbuild.

### `artifacts/mockup-sandbox`

Sandbox do Replit para preview de componentes. `mockupPreviewPlugin.ts` descobre arquivos em `src/components/mockups`, gera `src/.generated/mockup-components.ts` e expõe previews sob `BASE_PATH/preview/:component`. Ele é uma ferramenta de apoio e não é a rota da landing CELEBRE.

## Bibliotecas compartilhadas

| Pacote | Fonte da verdade | Papel |
| --- | --- | --- |
| `@workspace/api-spec` | `lib/api-spec/openapi.yaml` e `orval.config.ts` | contrato e geração |
| `@workspace/api-client-react` | `lib/api-client-react/src` | cliente React Query gerado + `customFetch` |
| `@workspace/api-zod` | `lib/api-zod/src` | schemas e tipos Zod gerados |
| `@workspace/db` | `lib/db/src/schema/index.ts` | Drizzle/PostgreSQL |
| `@workspace/scripts` | `scripts/src` | scripts auxiliares |

## Arquivos que não devem ser editados manualmente

- `pnpm-lock.yaml`, salvo quando uma mudança de dependência realmente exigir regeneração pelo pnpm;
- `lib/api-client-react/src/generated/*`;
- `lib/api-zod/src/generated/*`;
- `artifacts/mockup-sandbox/src/.generated/*`;
- `dist/public/*`, porque são saídas de build.

Edite a fonte correspondente e execute o comando de geração/build indicado na documentação.
