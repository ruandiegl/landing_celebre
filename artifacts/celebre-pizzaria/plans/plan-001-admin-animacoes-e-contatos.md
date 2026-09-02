# Plano 001 — Admin, animações e contatos da CELEBRE

> **Para agentes de IA:** execute este plano em tarefas pequenas, validando cada etapa antes de avançar. Leia `../docs/README.md`, `../docs/02-arquitetura.md`, `../docs/10-manutencao-e-gotchas.md`, `../agents/README.md` e o agente específico antes de editar.

**Agente líder:** `../agents/00-tech-lead.md`

**Agentes envolvidos:**

- `02-ux-ui-designer.md`: fluxo do painel administrativo e estados responsivos.
- `03-frontend-engineer.md`: React, TypeScript, conteúdo, rota, animações e landing.
- `04-content-seo.md`: textos, contatos, links externos e metadata.
- `05-api-backend-engineer.md`: contrato da camada de mídia futura, sem endpoint real nesta etapa.
- `06-data-engineer.md`: avaliar a fronteira de persistência e registrar que não haverá banco agora.
- `07-qa-test-engineer.md`: testes automatizados e matriz manual.
- `08-accessibility-engineer.md`: foco, labels, teclado, links externos e movimento reduzido.
- `09-performance-engineer.md`: peso de imagens, bundle e custo das animações.
- `10-security-engineer.md`: dados públicos, ausência de autenticação e não exposição de segredos.
- `11-devops-replit.md`: instalação, build e execução no Replit/Vite.
- `12-code-reviewer.md`: revisão final de arquitetura e regressões.
- `13-technical-writer.md`: documentação sincronizada.

**Goal:** entregar uma landing mais expressiva, uma rota `/admin` identificável para edição provisória de títulos e imagens e contatos comerciais corretos, mantendo a integração real com Vercel Blob para o próximo plano.

**Architecture:** centralizar o conteúdo em um modelo versionável de seções e mini catálogo; expor uma interface `MediaStorage` independente do provedor; usar um adapter local de preview nesta entrega; compartilhar o conteúdo editado entre landing e admin por um provider React com persistência local explícita; manter a futura integração Vercel Blob no limite de uma próxima camada server-side.

**Tech Stack:** React 19, TypeScript strict, Vite, Wouter, Tailwind CSS v4, Framer Motion, GSAP e `@gsap/react`. Consultas Context7 usadas como referência: `/websites/framer_motion`, `/greensock/react`, `/vercel/storage`, `/react/react`, `/vitejs/vite` e `/tailwindlabs/tailwindcss.com`.

**Spec:**

- A landing continua sendo uma SPA web dentro de `artifacts/celebre-pizzaria`.
- `/admin` será uma tela de gerenciamento visual provisória, sem alegar proteção de administrador até existir autenticação real.
- Todas as seções devem ter ID estável, label visível e título editável no painel; o mini catálogo deve expor cada pizza e seu slot de imagem separadamente.
- O adapter local pode usar os assets já empacotados e URLs informadas no painel; upload durável, token, listagem e exclusão do Blob serão implementados no plano seguinte.
- Imagens públicas de landing deverão usar URLs públicas quando a integração Vercel Blob for feita; nenhum token Blob poderá aparecer em `VITE_*`.
- Animações não podem impedir leitura, navegação por teclado ou uso com `prefers-reduced-motion`.
- WhatsApp deve usar o número normalizado `5524999687150`; o telefone exibido poderá ser formatado para leitura.
- Instagram deve apontar para `https://instagram.com/celebrepizzaria`.
- Endereço exibido: `R. Beira Rio n 2233, Morada do Vale, 27275-330`; link de mapa via Google Maps Search API.

## Global Constraints

- Preservar as alterações existentes em `docs/`, `agents/` e arquivos não relacionados.
- Não editar `dist`, arquivos gerados ou pacotes `lib/*` sem necessidade comprovada.
- Usar `pnpm` e os scripts do pacote da landing.
- Não inventar autenticação, persistência remota, preços ou dados comerciais adicionais.
- Registrar no handoff que o admin desta entrega é um preview local e não é controle de acesso.
- Rodar primeiro os testes que devem falhar para confirmar o comportamento desejado; só depois escrever a implementação correspondente.

## Task 1 — Baseline e dependências

**Files:** `package.json`, `pnpm-lock.yaml` ou lockfile correspondente, arquivos de teste a criar.

1. Confirmar que `framer-motion` já está declarado e resolver se o catálogo `catalog:` está instalado.
2. Adicionar `gsap` e `@gsap/react` como dependências da landing usando o gerenciador já adotado pelo monorepo.
3. Preparar Vitest e React Testing Library apenas se não houver runner existente; manter o setup mínimo e compatível com Vite.
4. Rodar `pnpm typecheck` e `pnpm build` como baseline, registrando qualquer warning preexistente.

## Task 2 — Contratos de conteúdo e mídia

**Files:** criar `src/content/landing-content.ts`, `src/content/landing-defaults.ts`, `src/content/content-repository.ts`, `src/content/content-provider.tsx`, `src/storage/media-storage.ts`, `src/storage/local-media-storage.ts` e testes correspondentes.

1. Definir tipos para `LandingSection`, `ImageSlot`, `CatalogItem` e `LandingContent` com IDs literais para `hero`, `nossa-pizza`, `cardapio`, `rodizio`, `karaoke`, `ambiente`, `depoimentos` e `reserva`.
2. Definir os slots de imagem de cada seção com label humano, finalidade e texto alternativo; o catálogo deve ter seis itens com IDs estáveis.
3. Migrar os valores atuais da landing para defaults centralizados, preservando textos, preços e assets existentes.
4. Criar `ContentRepository` com `load`, `save` e `reset`; implementar adapter local usando `localStorage` com chave versionada e fallback seguro para os defaults quando `window` não existir ou o JSON for inválido.
5. Criar `MediaStorage` com operações futuras `list`, `upload` e `remove`, além de metadados de imagem; implementar nesta fase um adapter local somente para assets bundled/URLs e preview temporário, sem token ou chamada Vercel.
6. Expor hook/provider `useLandingContent` para que `/` e `/admin` consumam a mesma fonte e tenham atualização previsível.
7. Testar serialização, reset, fallback para defaults, IDs únicos, slots explícitos e isolamento de uma alteração do catálogo.

## Task 3 — Rota e painel `/admin`

**Files:** criar `src/pages/Admin.tsx` e componentes de admin; alterar `src/App.tsx`; adicionar testes de interação.

1. Registrar a rota `/admin` no Wouter antes do fallback `NotFound`.
2. Criar cabeçalho do painel com título `Administração da landing`, aviso de `Preview local` e link de retorno à landing.
3. Renderizar um card por seção em ordem da landing, sempre exibindo `sectionId`, label, título atual, campo de título e todos os image slots.
4. Para cada slot, exibir preview, nome do slot, finalidade, alt text e controle para escolher asset bundled ou informar URL; indicar quando a imagem é apenas local/temporária.
5. Renderizar o mini catálogo como lista editável de seis cards, com nome, descrição, preço e imagem identificados pelo `catalogItemId`.
6. Aplicar alterações no provider, mostrar feedback de salvamento local, oferecer `Restaurar defaults` e evitar perda silenciosa de mudanças inválidas.
7. Adicionar estados responsivos, foco visível, labels associados, mensagens de erro e navegação por teclado.
8. Não criar login falso nem afirmar que a tela está protegida; incluir no painel a indicação de que autenticação e persistência remota são próximas etapas.

## Task 4 — Refatorar a landing para consumir o conteúdo central

**Files:** `src/pages/Home.tsx`, componentes em `src/components/*`, criar helpers compartilhados se necessário.

1. Envolver a aplicação com `LandingContentProvider` e fazer a página consumir defaults/estado do provider.
2. Trocar constantes locais de títulos e imagens pelo modelo centralizado, preservando o layout e a semântica existente.
3. Adicionar em cada `<section>` o `data-section-id`, `aria-labelledby` e heading com ID derivado do section ID; manter IDs de âncora atuais para navegação.
4. Garantir que cada imagem tenha alt coerente vindo do slot e que mudanças feitas no admin sejam refletidas na landing após retorno à rota.
5. Remover efeitos duplicados somente quando substituídos por um hook compartilhado de reveal; manter o conteúdo e CTA atuais funcionando.

## Task 5 — Framer Motion e GSAP

**Files:** componentes de landing, criar `src/components/motion/Reveal.tsx`, `src/components/motion/useGsapHero.ts` e/ou equivalentes.

1. Escrever testes para reveal de conteúdo, estado reduzido e montagem/desmontagem sem erro antes da implementação.
2. Usar Framer Motion para reveal de headings/cards e microinterações declarativas, com variantes estáveis e `useReducedMotion`.
3. Usar GSAP apenas em uma timeline da hero e em no máximo um elemento decorativo de destaque; escopar seletores a uma ref e usar `useGSAP`/context cleanup.
4. Não misturar transformações concorrentes no mesmo elemento entre CSS, Framer Motion e GSAP sem uma decisão explícita.
5. Desligar transforms, delays e loops decorativos quando `prefers-reduced-motion: reduce` estiver ativo.
6. Testar com `matchMedia` reduzido e verificar que o cleanup não deixa timelines, listeners ou estilos residuais.

## Task 6 — WhatsApp, mapa, Instagram e botão flutuante

**Files:** criar `src/lib/contact-links.ts`, `src/components/FloatingWhatsAppButton.tsx`; alterar `ReservationSection.tsx`, `Footer.tsx`, `Home.tsx` e documentação de configuração.

1. Criar helpers puros para normalizar telefone e montar URL do WhatsApp com mensagem codificada.
2. Usar fallback `5524999687150` e continuar aceitando `VITE_WHATSAPP_PHONE`, validando apenas dígitos.
3. Adicionar botão flutuante fixo, com ícone/label acessível, `target=_blank`, `rel=noopener noreferrer`, posição que não cubra o CTA mobile e foco visível.
4. Atualizar texto do contato da reserva para o número real formatado sem duplicar números conflitantes.
5. Atualizar o endereço e envolver o endereço em link do Google Maps; usar URL estável e query codificada.
6. Atualizar Instagram e manter Facebook como placeholder somente se não houver URL confirmada; nunca deixar o Instagram real como `#`.
7. Testar helpers e verificar manualmente abertura, texto pré-preenchido, mapa e link do Instagram.

## Task 7 — Testes, acessibilidade, performance e release

**Files:** testes criados, docs afetados, `package.json` e configuração somente se necessário.

1. Testar a rota `/`, a rota `/admin`, fallback 404, navegação entre as rotas e persistência local de edição.
2. Testar que todos os IDs listados no admin existem na landing e que cada slot é nomeado de modo assertivo.
3. Rodar `pnpm typecheck`, `pnpm build` e o runner de testes; corrigir falhas antes do encerramento.
4. Auditar teclado, foco, contraste, alt text, links externos e `prefers-reduced-motion`.
5. Verificar bundle e comportamento de imagens; evitar carregar scripts de animação em páginas que não precisam deles.
6. Atualizar `docs/README.md`, `docs/02-arquitetura.md`, `docs/03-instalacao-e-execucao.md`, `docs/06-conteudo-e-assets.md`, `docs/07-rotas-e-integracoes.md`, `docs/08-testes-e-qualidade.md`, `docs/09-deploy-e-replit.md`, `docs/10-manutencao-e-gotchas.md` e `docs/11-mapa-de-arquivos.md` conforme aplicável.
7. Documentar o próximo plano: integração `@vercel/blob`, endpoint server-side para upload/list/remove, controle de acesso e persistência remota do `LandingContent`.
8. Fazer revisão final do diff, separar mudanças preexistentes e registrar evidências dos comandos executados.

## Critérios de aceite

- `pnpm typecheck`, testes e `pnpm build` passam para `artifacts/celebre-pizzaria`.
- Framer Motion é usado na landing e GSAP está instalado e usado com cleanup.
- `/admin` existe, é navegável e apresenta as mesmas seções/IDs/slots que a landing.
- Alterar um título ou imagem no admin atualiza a landing no mesmo navegador e pode ser restaurado para defaults.
- A camada `MediaStorage` está isolada e documenta claramente a integração futura com Vercel Blob, sem fingir que o upload remoto já existe.
- O botão flutuante abre WhatsApp para `5524999687150`.
- O endereço, mapa e Instagram estão corretos e acessíveis.
- O site permanece utilizável com movimento reduzido e navegação por teclado.

## Verificações obrigatórias

```powershell
pnpm --dir artifacts/celebre-pizzaria typecheck
pnpm --dir artifacts/celebre-pizzaria test
pnpm --dir artifacts/celebre-pizzaria build
```

Se o runner de testes ainda não existir, registrar explicitamente a configuração adicionada e executar o script equivalente definido no `package.json`.
