# Deploy e Replit

## Configuração do artifact web

`artifacts/celebre-pizzaria/.replit-artifact/artifact.toml` define:

| Configuração | Valor |
| --- | --- |
| kind | `web` |
| previewPath | `/` |
| título | `CELEBRE Pizzaria` |
| serviço | `web` |
| localPort | `23141` |
| desenvolvimento | `pnpm --filter @workspace/celebre-pizzaria run dev` |
| build | `pnpm --filter @workspace/celebre-pizzaria run build` |
| modo de produção | `static` |
| publicDir | `artifacts/celebre-pizzaria/dist/public` |
| `PORT` | `23141` |
| `BASE_PATH` | `/` |

Em produção, todas as requisições são reescritas de `/*` para `/index.html`. Isso mantém o fallback client-side do Wouter quando alguém acessa diretamente uma URL do SPA.

## Configuração global do Replit

O `.replit` da raiz:

- seleciona o módulo `nodejs-24`;
- usa deployment `autoscale` com router de aplicação;
- define o botão de execução como `Project`;
- executa `pnpm store prune` após o build;
- usa `scripts/post-merge.sh` no hook pós-merge;
- identifica o stack como `PNPM_WORKSPACE`.

O `.replitignore` evita duplicar o pnpm store no artefato de deploy.

O `mockup-sandbox` é um artifact de design separado. Seu `vite.config.ts` exige as duas variáveis `PORT` e `BASE_PATH`; a configuração Replit dele usa `PORT=8081` e `BASE_PATH=/__mockup`. Isso explica por que o build recursivo da raiz precisa desse ambiente quando inclui o sandbox.

## Fluxo de publicação

1. Instale dependências com o lockfile (`pnpm install`).
2. Confirme `VITE_WHATSAPP_PHONE` no ambiente que fará o build; o fallback atual é `5524999687150`.
3. Rode typecheck, testes e build do artifact web conforme [Testes e qualidade](08-testes-e-qualidade.md). Para o build recursivo do workspace, forneça também o ambiente do `mockup-sandbox`, conforme [Instalação e execução](03-instalacao-e-execucao.md).
4. Confirme que `dist/public` foi gerado dentro do artifact web.
5. Publique o conteúdo estático usando a configuração do artifact.
6. Teste `/`, `/admin`, um caminho inexistente, todos os CTAs, o link do WhatsApp, o mapa e o Instagram no preview publicado.

Como `VITE_WHATSAPP_PHONE` é substituído no build, mudar a variável depois de gerar `dist/public` não altera o bundle já existente; refaça o build.

## Deploy fora do Replit

O resultado da landing é um diretório estático. O servidor escolhido precisa:

- servir `artifacts/celebre-pizzaria/dist/public`;
- encaminhar rotas desconhecidas para `index.html`;
- preservar os arquivos estáticos gerados pelo Vite;
- fornecer o prefixo usado em `BASE_PATH` quando houver subdiretório.

Se o host não suportar rewrite, links diretos ou refresh em rotas client-side podem retornar 404. As rotas de produto são `/` e `/admin`; o fallback continua sendo parte da configuração.

## API e DB no Replit

O API server possui artifact próprio e porta padrão configurada como `8080` em produção; ele exige `PORT` e possui health startup em `/api/healthz`. O banco exige `DATABASE_URL`. Nenhum desses serviços é necessário para publicar a landing no estado atual.

Não misture as variáveis da API/DB no bundle web sem uma decisão explícita de arquitetura. Segredos como `DATABASE_URL` nunca devem usar o prefixo `VITE_`.

## Dependências externas e disponibilidade

- `src/index.css` importa Google Fonts em runtime; confirme que a política de CSP e a rede do ambiente permitem esse carregamento.
- A reserva depende do domínio `wa.me` e da disponibilidade do WhatsApp.
- As imagens são empacotadas pelo Vite a partir de `attached_assets`; verifique o tamanho do bundle e o carregamento em conexão móvel.
- O painel `/admin` é um preview local sem autenticação; não o publique como área protegida até integrar autenticação e persistência remota.
- A integração planejada com Vercel Blob deverá usar operações server-side e variáveis secretas fora do prefixo `VITE_`.
