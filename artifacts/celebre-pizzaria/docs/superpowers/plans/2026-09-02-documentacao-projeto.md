# Documentação do projeto Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar uma documentação modular e verificável para que qualquer pessoa consiga executar, entender, manter e evoluir a landing page CELEBRE Pizzaria.

**Architecture:** A documentação ficará dentro de `artifacts/celebre-pizzaria/docs`, com `README.md` como índice e arquivos focados por assunto. O conteúdo será derivado do código e das configurações atuais, distinguindo o artifact da landing page dos scaffolds de API, banco e sandbox existentes no monorepo.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, React Query, Wouter, Radix UI/shadcn, pnpm workspaces, Replit.

**Spec:** Solicitação do usuário nesta conversa: documentar o projeto localizado em `ARTIFACTS`, em arquivos Markdown separados, com `README.md` como índice principal.

## Global Constraints

- Manter a documentação dentro de `artifacts/celebre-pizzaria/docs`.
- Não alterar o comportamento da aplicação; esta tarefa cria apenas arquivos Markdown.
- Registrar somente comportamento, configuração e padrões confirmados nos arquivos existentes.
- Identificar claramente placeholders, links ainda não configurados e integrações que são apenas scaffolds.
- Usar caminhos relativos nos links internos da documentação para manter a navegação portátil.

---

### Task 1: Mapear o produto e o monorepo

**Files:**
- Read: `artifacts/celebre-pizzaria/src/App.tsx`
- Read: `artifacts/celebre-pizzaria/src/pages/Home.tsx`
- Read: `artifacts/celebre-pizzaria/src/components/*.tsx`
- Read: `package.json`, `pnpm-workspace.yaml`, `replit.md` e artifacts auxiliares

**Interfaces:**
- Consumes: estrutura real do workspace, composição da Home e fluxos de navegação.
- Produces: fatos para `01-visao-geral.md` e `02-arquitetura.md`.

- [x] **Step 1: Inventariar os artifacts e pacotes do workspace**
- [x] **Step 2: Identificar stack, tipo da aplicação e ponto de entrada**
- [x] **Step 3: Registrar as fronteiras entre produto principal e scaffolds auxiliares**

### Task 2: Documentar execução e operação

**Files:**
- Create: `docs/03-instalacao-e-execucao.md`
- Create: `docs/09-deploy-e-replit.md`
- Read: `artifacts/celebre-pizzaria/package.json`, `vite.config.ts`, `.replit-artifact/artifact.toml`, `.replit`

**Interfaces:**
- Consumes: scripts, portas, variáveis e comandos confirmados nas configurações.
- Produces: instruções reproduzíveis para desenvolvimento, build, preview e Replit.

- [x] **Step 1: Documentar pré-requisitos e instalação com pnpm**
- [x] **Step 2: Documentar comandos por pacote e por workspace**
- [x] **Step 3: Documentar portas, `BASE_PATH`, `PORT` e produção estática**

### Task 3: Documentar padrões de frontend e design

**Files:**
- Create: `docs/04-frontend-e-componentes.md`
- Create: `docs/05-design-system.md`
- Read: `src/index.css`, `components.json`, `src/hooks`, `src/lib` e componentes customizados

**Interfaces:**
- Consumes: convenções de componentes, Tailwind, tokens, animações e acessibilidade existentes.
- Produces: guidelines para futuras alterações de UI sem quebrar a linguagem visual.

- [x] **Step 1: Mapear composição da página e IDs de seção**
- [x] **Step 2: Registrar regras de estado, scroll, IntersectionObserver e CTA**
- [x] **Step 3: Registrar tipografia, cores, espaçamento, efeitos e responsividade**

### Task 4: Documentar conteúdo, assets e integrações

**Files:**
- Create: `docs/06-conteudo-e-assets.md`
- Create: `docs/07-rotas-e-integracoes.md`
- Read: `attached_assets`, `index.html`, `ReservationSection.tsx`, `Footer.tsx`, `lib/api-spec`, `lib/api-client-react`, `lib/api-zod`, `artifacts/api-server`

**Interfaces:**
- Consumes: textos, preços, imagens, links externos, ambiente WhatsApp e API scaffold.
- Produces: catálogo de conteúdo editável e contrato explícito das integrações atuais.

- [x] **Step 1: Catalogar assets por uso e origem**
- [x] **Step 2: Documentar o fluxo de reserva e seus placeholders**
- [x] **Step 3: Documentar o endpoint de health check e o codegen sem atribuir uso inexistente à landing page**

### Task 5: Documentar qualidade, manutenção e riscos

**Files:**
- Create: `docs/08-testes-e-qualidade.md`
- Create: `docs/10-manutencao-e-gotchas.md`
- Create: `docs/11-mapa-de-arquivos.md`

**Interfaces:**
- Consumes: scripts de typecheck/build, convenções de pastas e limitações observáveis no código.
- Produces: checklist de validação e guia de manutenção.

- [x] **Step 1: Registrar verificações disponíveis e o que elas cobrem**
- [x] **Step 2: Registrar riscos operacionais e pontos a revisar antes de publicar**
- [x] **Step 3: Criar o mapa final de arquivos e responsabilidades**

### Task 6: Indexar e verificar a documentação

**Files:**
- Create: `docs/README.md`
- Verify: todos os Markdown em `docs/`

**Interfaces:**
- Consumes: documentos produzidos nas tarefas anteriores.
- Produces: índice navegável e documentação pronta para entrega.

- [x] **Step 1: Criar o índice com perfil do projeto e trilhas de leitura**
- [x] **Step 2: Revisar links e remover placeholders documentais não intencionais**
- [x] **Step 3: Executar typecheck/build sem modificar o código da aplicação**
