# Documentação — CELEBRE Pizzaria

Documentação de referência da aplicação web `@workspace/celebre-pizzaria`, uma landing page de página única para a CELEBRE Pizzaria Gospel Bar Abbas.

> Escopo: esta documentação descreve o estado encontrado no código em 02/09/2026. Quando um endereço, preço, link ou integração ainda é demonstrativo, isso está indicado explicitamente.

## Perfil do projeto

| Item | Valor |
| --- | --- |
| Tipo | WEB — landing page responsiva |
| Stack principal | React 19, TypeScript 5.9, Vite 7 |
| UI e estilo | Tailwind CSS 4, shadcn/Radix UI, CSS customizado |
| Navegação | Wouter, com `/` público, `/admin` e âncoras internas |
| Dados | `src/content/` com defaults versionados e adapter local de preview |
| Reserva | Link externo para WhatsApp |
| Backend da landing | Nenhum consumido atualmente; Vercel Blob fica preparado por contrato |
| Animações | Framer Motion para reveals e GSAP para timeline da hero |
| Pacote | `@workspace/celebre-pizzaria` |
| Diretório | `artifacts/celebre-pizzaria` |

## Comece por aqui

1. [Instalação e execução](03-instalacao-e-execucao.md) — instale dependências e rode a landing localmente.
2. [Visão geral do produto](01-visao-geral.md) — entenda a experiência e a ordem das seções.
3. [Arquitetura](02-arquitetura.md) — veja como os artifacts e pacotes do monorepo se relacionam.
4. [Frontend e componentes](04-frontend-e-componentes.md) — saiba onde alterar comportamento e conteúdo.
5. [Design system](05-design-system.md) — preserve tipografia, cores, espaçamento e animações.
6. [Conteúdo e assets](06-conteudo-e-assets.md) — encontre textos, preços e imagens.
7. [Rotas e integrações](07-rotas-e-integracoes.md) — consulte âncoras, WhatsApp e o scaffold de API.
8. [Testes e qualidade](08-testes-e-qualidade.md) — valide alterações antes de publicar.
9. [Deploy e Replit](09-deploy-e-replit.md) — entenda portas, build estático e configuração de deploy.
10. [Manutenção e gotchas](10-manutencao-e-gotchas.md) — pontos de atenção e riscos conhecidos.
11. [Mapa de arquivos](11-mapa-de-arquivos.md) — referência rápida dos diretórios e responsabilidades.
12. [Plano 001](../plans/plan-001-admin-animacoes-e-contatos.md) — implementação de admin, animações, contatos e próxima integração de mídia.

## Execução rápida

Na raiz do repositório:

```bash
pnpm install
pnpm --filter @workspace/celebre-pizzaria run dev
```

Para validar a aplicação principal:

```bash
pnpm --filter @workspace/celebre-pizzaria run typecheck
pnpm --filter @workspace/celebre-pizzaria run test
pnpm --filter @workspace/celebre-pizzaria run build
```

O endereço e a porta efetivos dependem de `PORT` e `BASE_PATH`; veja [Instalação e execução](03-instalacao-e-execucao.md).

## Limites importantes

- A aplicação é montada no cliente e não possui formulário de reserva persistido.
- `/admin` é um painel de preview local: não é autenticação nem controle de acesso de produção.
- Alterações do admin são salvas no `localStorage` versionado e não substituem persistência remota.
- Os botões de navegação fazem scroll suave para IDs da mesma página; não são rotas independentes.
- A reserva abre o WhatsApp com uma mensagem pré-preenchida.
- O monorepo possui `api-server`, `api-spec`, `api-zod`, `api-client-react` e `db`, mas a landing não importa nem chama esses módulos no estado atual.
- Instagram e WhatsApp estão configurados; Facebook continua sem perfil confirmado e permanece placeholder.

## Fonte da verdade

| Assunto | Arquivo de referência |
| --- | --- |
| Composição da home | `src/pages/Home.tsx` |
| Roteamento | `src/App.tsx` |
| Conteúdo, títulos e slots | `src/content/landing-defaults.ts` e `src/content/landing-content.ts` |
| Persistência local de conteúdo | `src/content/content-repository.ts` e `content-provider.tsx` |
| Textos fixos complementares | componentes em `src/components/` |
| Painel administrativo | `src/pages/Admin.tsx` |
| Contatos e URLs externas | `src/lib/contact-links.ts` |
| Contrato de mídia futura | `src/storage/media-storage.ts` |
| Tokens e efeitos visuais | `src/index.css` |
| Dependências e scripts da landing | `package.json` |
| Porta, base path e produção | `vite.config.ts` e `.replit-artifact/artifact.toml` |
| Contrato da API scaffold | `lib/api-spec/openapi.yaml` |
| Planejamento de implementação | `plans/plan-001-admin-animacoes-e-contatos.md` |

## Convenção desta documentação

Os links apontam para arquivos relativos ao diretório `docs`. Ao atualizar uma regra, atualize também o arquivo-fonte indicado como fonte da verdade. A documentação não substitui o código: ela explica o comportamento vigente e as decisões que não são óbvias apenas pela árvore de arquivos.
