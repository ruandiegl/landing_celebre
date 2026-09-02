# Instalação e execução

## Pré-requisitos

- Node.js 24, alinhado ao módulo configurado em `.replit`.
- pnpm, porque o `preinstall` do workspace recusa agentes npm/yarn e o lockfile oficial é `pnpm-lock.yaml`.
- Acesso à internet para instalar dependências e carregar as fontes Google usadas no CSS durante a execução da página.

## Instalação

Execute na raiz `D:/Projetos-PJ/landing_celebre`:

```bash
pnpm install
```

O `pnpm-workspace.yaml` impõe idade mínima de 1440 minutos para pacotes, permite pacotes `@replit/*` sem essa espera e define overrides de binários nativos para o ambiente Replit. Não remova essas proteções para acelerar uma instalação.

## Desenvolvimento da landing

```bash
pnpm --filter @workspace/celebre-pizzaria run dev
```

Esse script executa `vite --config vite.config.ts --host 0.0.0.0`. A porta padrão do Vite é `5173`; no artifact Replit, `PORT` é definido como `23141`.

Para abrir a aplicação em outra porta:

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/celebre-pizzaria run dev
```

No PowerShell, configure o processo antes de executar:

```powershell
$env:PORT = "5173"
$env:BASE_PATH = "/"
pnpm --filter @workspace/celebre-pizzaria run dev
```

`strictPort: true` faz o Vite falhar em vez de escolher outra porta automaticamente. O host `0.0.0.0` permite acesso pelo preview do Replit e pela rede local.

## Build e preview local

```bash
pnpm --filter @workspace/celebre-pizzaria run typecheck
pnpm --filter @workspace/celebre-pizzaria run test
pnpm --filter @workspace/celebre-pizzaria run build
pnpm --filter @workspace/celebre-pizzaria run serve
```

O build gera `artifacts/celebre-pizzaria/dist/public`. O comando `serve` usa `vite preview` e respeita `PORT`/`BASE_PATH` do ambiente.

## Comandos do workspace

```bash
pnpm run typecheck        # libs + artifacts + scripts
pnpm run typecheck:libs   # referências TypeScript das libs
pnpm run build            # typecheck + builds disponíveis nos pacotes
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/db run push
```

Os quatro últimos comandos são para os scaffolds e não são necessários para executar a landing. O build recursivo da raiz também inclui o `mockup-sandbox`; como o Vite desse sandbox exige `PORT` e `BASE_PATH`, execute-o com o ambiente do sandbox quando quiser validar todos os artifacts:

```powershell
$env:PORT = "8081"
$env:BASE_PATH = "/__mockup"
pnpm run build
```

Sem essas variáveis, o typecheck completo ainda funciona, mas o `pnpm run build` da raiz falha ao carregar a configuração do sandbox.

## Variáveis de ambiente

| Variável | Aplicação | Obrigatória | Padrão/efeito |
| --- | --- | ---: | --- |
| `PORT` | Vite e API server | Não para a landing; sim para a API | Landing: `5173`; API: falha se ausente |
| `BASE_PATH` | Vite/Wouter da landing | Não | `/` |
| `VITE_WHATSAPP_PHONE` | Bundle da landing | Não | `5524999687150` |
| `DATABASE_URL` | `lib/db` e operações Drizzle | Para usar DB | O módulo lança erro se ausente |
| `NODE_ENV` | API server/logger | Não | Define logging de desenvolvimento/produção |
| `LOG_LEVEL` | Logger da API | Não | `info` |
| `BASE_PATH` + `PORT` | `mockup-sandbox` | Para build/execução do sandbox | `/__mockup` + `8081` |

`VITE_WHATSAPP_PHONE` é uma variável exposta ao bundle por definição do Vite. Ela não deve conter segredo; contém apenas o número público usado no link `wa.me`.

O painel `/admin` usa `localStorage` para preview local. Não há variável de autenticação ou token de Vercel Blob nesta entrega. A futura integração de mídia deverá manter tokens somente no servidor.

## Diagnóstico rápido

- **Porta ocupada:** defina outra `PORT`; não espere fallback automático, pois `strictPort` está ativo.
- **Página vazia após alterar o base path:** confirme que `BASE_PATH` começa com `/` e que o deploy mantém o mesmo prefixo.
- **Erro de pacote ou lockfile:** use pnpm na raiz e não remova `pnpm-lock.yaml`.
- **Erro no typecheck de uma lib:** execute `pnpm run typecheck:libs` antes de analisar o artifact da landing.
- **WhatsApp abre para o número errado:** confira a variável de build `VITE_WHATSAPP_PHONE`, sem espaços, máscara ou símbolos.
- **Admin não persiste em outro dispositivo:** comportamento esperado do preview local; a persistência remota será adicionada com Vercel Blob/API em um próximo plano.
