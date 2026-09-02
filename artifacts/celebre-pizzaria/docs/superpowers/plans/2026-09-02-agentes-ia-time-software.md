# Agentes de IA do time de software Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar um conjunto de agentes de IA em Markdown que cubra as funções essenciais de desenvolvimento e possa ser acionado de forma previsível durante a evolução da CELEBRE Pizzaria.

**Architecture:** Cada agente será um playbook independente, com uma única responsabilidade, contexto obrigatório, regras específicas do workspace, entregáveis e checklist de saída. O `agents/README.md` será o roteador do time e explicará a sequência recomendada, as dependências entre papéis e quando um agente não deve ser usado.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, Wouter, React Query, Radix UI/shadcn, Express 5, OpenAPI/Orval, PostgreSQL/Drizzle, pnpm workspaces e Replit.

**Spec:** `artifacts/celebre-pizzaria/docs/README.md` e demais arquivos em `artifacts/celebre-pizzaria/docs/`, mais o desenho aprovado pelo usuário nesta conversa.

## Global Constraints

- Criar os agentes dentro de `artifacts/celebre-pizzaria/agents`.
- Criar `agents/README.md` como índice principal e guia de acionamento.
- Cada agente deve ler `docs/README.md` e os documentos específicos do seu domínio antes de agir.
- Os agentes devem tratar `artifacts/celebre-pizzaria` como produto principal e distinguir os scaffolds de API, DB e mockup.
- Nenhum agente deve declarar conclusão sem executar as verificações adequadas e registrar evidências.
- Agentes de conteúdo devem marcar valores comerciais ainda demonstrativos como pendentes de validação.
- Agentes de código devem preservar a arquitetura atual, usar pnpm e evitar alterar arquivos gerados manualmente.

---

### Task 1: Criar o índice e o agente de coordenação

**Files:**
- Create: `artifacts/celebre-pizzaria/agents/README.md`
- Create: `artifacts/celebre-pizzaria/agents/00-tech-lead.md`

**Interfaces:**
- Consumes: documentação do projeto em `docs/`.
- Produces: roteamento de agentes, ordem de uso, critérios de handoff e decisões técnicas.

- [x] **Step 1: Definir o catálogo e o momento de uso de cada papel**
- [x] **Step 2: Definir fluxo recomendado de descoberta, design, implementação, validação e release**
- [x] **Step 3: Definir formato comum de handoff e regras de escalonamento**

### Task 2: Criar agentes de produto, UX e conteúdo

**Files:**
- Create: `01-product-manager.md`
- Create: `02-ux-ui-designer.md`
- Create: `04-content-seo.md`

**Interfaces:**
- Consumes: `docs/01-visao-geral.md`, `04-frontend-e-componentes.md`, `05-design-system.md`, `06-conteudo-e-assets.md`.
- Produces: requisitos, fluxos, decisões visuais, copy aprovada e critérios de aceite para os agentes técnicos.

- [x] **Step 1: Separar decisões de negócio de implementação**
- [x] **Step 2: Registrar a linguagem visual e os limites de conteúdo atuais**
- [x] **Step 3: Exigir validação de preços, contatos, horários, claims e links sociais**

### Task 3: Criar agentes de engenharia de frontend, backend e dados

**Files:**
- Create: `03-frontend-engineer.md`
- Create: `05-api-backend-engineer.md`
- Create: `06-data-engineer.md`

**Interfaces:**
- Consumes: requisitos e design aprovados; `docs/02-arquitetura.md`, `03-instalacao-e-execucao.md`, `04-frontend-e-componentes.md`, `07-rotas-e-integracoes.md`.
- Produces: alterações implementadas, contratos, migrações e evidências de validação técnica.

- [x] **Step 1: Preservar a Home como composição e as seções como unidades isoladas**
- [x] **Step 2: Separar a landing estática dos scaffolds Express/OpenAPI/Drizzle**
- [x] **Step 3: Aplicar as regras atuais de React effects, Vite env/base e Tailwind @theme**

### Task 4: Criar agentes de qualidade, acessibilidade e performance

**Files:**
- Create: `07-qa-test-engineer.md`
- Create: `08-accessibility-engineer.md`
- Create: `09-performance-engineer.md`

**Interfaces:**
- Consumes: mudanças dos agentes de engenharia e `docs/08-testes-e-qualidade.md`.
- Produces: matriz de testes, achados priorizados, evidências de regressão e checklist de aceite.

- [x] **Step 1: Cobrir typecheck, build, navegação, CTAs e responsividade**
- [x] **Step 2: Cobrir semântica, teclado, contraste, alt e reduced motion**
- [x] **Step 3: Cobrir imagens, fontes, bundle, base path e métricas de carregamento**

### Task 5: Criar agentes de segurança, DevOps, revisão e documentação

**Files:**
- Create: `10-security-engineer.md`
- Create: `11-devops-replit.md`
- Create: `12-code-reviewer.md`
- Create: `13-technical-writer.md`

**Interfaces:**
- Consumes: diff do trabalho, configuração Replit e documentação existente.
- Produces: avaliação de risco, validação de build/deploy, revisão objetiva e documentação sincronizada.

- [x] **Step 1: Proteger segredos e separar variáveis públicas de servidor**
- [x] **Step 2: Validar pnpm, portas, build estático e rewrites do Replit**
- [x] **Step 3: Exigir revisão e atualização da fonte de verdade**

### Task 6: Fazer revisão final do conjunto de agentes

**Files:**
- Verify: `artifacts/celebre-pizzaria/agents/*.md`
- Verify: links para `artifacts/celebre-pizzaria/docs/*.md`

**Interfaces:**
- Consumes: todos os agentes e o índice.
- Produces: conjunto navegável, sem duplicidade de escopo e sem links quebrados.

- [x] **Step 1: Validar que cada papel possui objetivo, quando usar, limites, entregáveis e checklist**
- [x] **Step 2: Validar links internos e ausência de placeholders documentais acidentais**
- [x] **Step 3: Confirmar que o conteúdo permanece específico para a stack e o estado do projeto**
