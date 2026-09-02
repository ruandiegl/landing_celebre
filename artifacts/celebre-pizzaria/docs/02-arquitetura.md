# Arquitetura e organização

## Visão arquitetural

A aplicação principal é um SPA client-side sem servidor de aplicação próprio. O Vite entrega o HTML de entrada e o bundle; o React monta `App` no elemento `#root`; o Wouter resolve a rota atual; os componentes compõem a única página da experiência.

```text
Vite
  -> src/main.tsx
    -> src/App.tsx
      -> QueryClientProvider
      -> TooltipProvider
      -> LandingContentProvider
        -> Wouter Router
          -> / : pages/Home.tsx
            -> componentes de seção
          -> /admin : pages/Admin.tsx (lazy)
          -> demais caminhos : pages/not-found.tsx
      -> Toaster
```

`QueryClientProvider` e `Toaster` estão preparados no shell da aplicação, mas a Home não possui consultas React Query nem chamadas de toast no momento.

## Monorepo

```text
workspace/
├─ artifacts/
│  ├─ celebre-pizzaria/  # produto web principal
│  ├─ api-server/        # Express + health check scaffold
│  └─ mockup-sandbox/    # preview de componentes para o canvas
├─ lib/
│  ├─ api-spec/          # OpenAPI + configuração Orval
│  ├─ api-client-react/  # cliente React Query gerado e custom fetch
│  ├─ api-zod/           # schemas Zod gerados
│  └─ db/                # conexão/schema Drizzle para PostgreSQL
├─ scripts/              # scripts auxiliares do workspace
├─ package.json
├─ pnpm-workspace.yaml
└─ tsconfig*.json
```

O workspace declara `artifacts/*`, `lib/*`, `lib/integrations/*` e `scripts` como pacotes pnpm. O diretório `artifacts/celebre-pizzaria` é o limite do produto documentado aqui.

## Fluxo da aplicação principal

1. `src/main.tsx` importa `src/index.css` e monta `<App />`.
2. `src/App.tsx` cria um `QueryClient`, registra providers e configura o Wouter com `import.meta.env.BASE_URL` sem a barra final.
3. `LandingContentProvider` carrega defaults e alterações do `localStorage` versionado.
4. A rota `/` renderiza `Home`; `/admin` carrega o painel administrativo sob demanda.
5. `Home` mantém a ordem da narrativa; as seções consomem títulos e imagens do provider.
6. O admin edita conteúdo no adapter local e a landing reflete a mesma fonte após a navegação.
7. A reserva usa os helpers puros de `src/lib/contact-links.ts` e `VITE_WHATSAPP_PHONE` como configuração pública.

## Convenções de importação

- `@/*` aponta para `artifacts/celebre-pizzaria/src/*` em `tsconfig.json` e em `vite.config.ts`.
- `@assets` está configurado no Vite para `attached_assets` na raiz do workspace, embora os assets existentes estejam em `artifacts/celebre-pizzaria/attached_assets` e os componentes atuais importem-nos por caminhos relativos. Não use esse alias sem primeiro corrigir/alinhar o destino.
- Componentes de produto usam imports nomeados, por exemplo `import { HeroSection } from '@/components/HeroSection'`.
- Páginas usam export default (`Home` e `NotFound`).
- Componentes UI gerados ficam em `src/components/ui` e seguem os aliases definidos em `components.json`.

## Estado e dados

`src/content/landing-content.ts` define o contrato `LandingContent`, IDs estáveis das seções, slots de imagem e itens do mini catálogo. `landing-defaults.ts` preserva os valores atuais e é a fonte inicial do provider.

`ContentRepository` tem `load`, `save` e `reset`. A implementação atual grava em `localStorage` com a chave `celebre-pizzaria:landing-content:v1`; JSON inválido ou ausência de storage retornam aos defaults. Essa é uma solução de preview, não uma persistência multiusuário.

`MediaStorage` está separado em `src/storage/media-storage.ts`. O adapter atual lista assets bundled e cria previews temporários com `URL.createObjectURL`. O próximo plano deve conectá-lo a endpoints server-side com `@vercel/blob` para `put`, `list` e `del`, sem expor tokens no bundle.

## Fronteira com os scaffolds

O `api-server` usa Express 5, CORS, body parsers e Pino; expõe o router em `/api` e hoje só possui `/api/healthz`. O `lib/api-spec/openapi.yaml` é a fonte do contrato, e o Orval gera os pacotes `api-client-react` e `api-zod`.

O `lib/db` inicializa PostgreSQL via `DATABASE_URL`, mas o schema está vazio. Esses módulos podem sustentar futuras funcionalidades, porém não fazem parte do caminho de renderização da landing atual. Detalhes e comandos estão em [Rotas e integrações](07-rotas-e-integracoes.md).

## Build

- Desenvolvimento: Vite na raiz do artifact.
- Produção: `vite build` gera `dist/public` dentro de `artifacts/celebre-pizzaria`.
- Replit serve `dist/public` como conteúdo estático e reescreve `/*` para `/index.html`, necessário para o fallback do SPA.
