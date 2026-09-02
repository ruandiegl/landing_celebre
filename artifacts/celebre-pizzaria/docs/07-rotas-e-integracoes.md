# Rotas e integrações

## Rotas da landing

O Wouter está configurado em `src/App.tsx`:

| Caminho | Componente | Comportamento |
| --- | --- | --- |
| `/` | `Home` | renderiza a landing completa |
| `/admin` | `Admin` | edita títulos e imagens no preview local; não possui autenticação |
| qualquer outro caminho | `NotFound` | exibe o cartão 404 |
| qualquer outro caminho | `NotFound` | exibe o cartão 404 |

O router recebe `base={import.meta.env.BASE_URL.replace(/\/$/, '')}`. Em desenvolvimento e no deploy padrão, `BASE_PATH=/`. Se a aplicação for publicada em um subcaminho, o servidor precisa manter o mesmo base path e o fallback para `index.html`.

## Âncoras da página

| ID | Alvos que navegam para ele |
| --- | --- |
| `cardapio` | navegação desktop, hero, cardápio, footer e CTA mobile |
| `rodizio` | navegação desktop e footer |
| `karaoke` | navegação desktop e footer |
| `reserva` | navegação desktop, hero, cardápio, rodízio, karaokê, footer e CTA mobile |
| `nossa-pizza` | seção existente, sem item de navegação atual |
| `ambiente` | seção existente, sem item de navegação atual |
| `depoimentos` | seção existente, sem item de navegação atual |

As ações internas usam `document.getElementById(...).scrollIntoView({ behavior: 'smooth' })`. Não remova os IDs sem atualizar todos os consumidores.

## Reserva via WhatsApp

`src/lib/contact-links.ts` compõe o link:

```text
https://wa.me/${VITE_WHATSAPP_PHONE}?text=ol%C3%A1%2C%20quero%20fazer%20uma%20reserva!
```

Detalhes do contrato atual:

- variável: `VITE_WHATSAPP_PHONE`;
- fallback: `5524999687150`;
- mensagem: `olá, quero fazer uma reserva!`;
- abertura: nova aba/janela;
- segurança: `rel="noopener noreferrer"`;
- informações que a equipe pede depois: dia, horário e quantidade de pessoas.

Use apenas dígitos no número, incluindo código do país e DDD. Como a variável é incorporada ao bundle pelo Vite, ela é configuração pública e precisa ser validada no ambiente de build.

## Links sociais

O rodapé possui links para Instagram, Facebook e WhatsApp. O Instagram aponta para `https://instagram.com/celebrepizzaria` e o WhatsApp usa `getWhatsAppUrl()`. Facebook permanece `href="#"` até que o perfil correto seja confirmado.

## Conteúdo e mídia do admin

`LandingContentProvider` compartilha títulos, slots e itens do mini catálogo entre `/` e `/admin`. O `ContentRepository` atual usa `localStorage` com a chave `celebre-pizzaria:landing-content:v1`; o painel identifica cada seção por `sectionId` e cada item por `catalogItemId`.

`MediaStorage` é um contrato local em `src/storage/media-storage.ts`. O adapter de preview lista assets bundled e cria URLs temporárias de arquivos selecionados. A integração seguinte deve usar `@vercel/blob` no servidor: `put` para upload público, `list` para catálogo e `del` para remoção. Tokens e operações server-side não devem entrar no bundle Vite.

## Contato e mapa

- WhatsApp: `+55 (24) 99968-7150`, URL em `https://wa.me/5524999687150`.
- Instagram: `@celebrepizzaria`, URL `https://instagram.com/celebrepizzaria`.
- Endereço: `R. Beira Rio n 2233, Morada do Vale, 27275-330`.
- Mapa: `GOOGLE_MAPS_URL` usa o link oficial compartilhado `https://maps.app.goo.gl/3btrZZdN3EAZXz968`, que leva ao caminho correto do estabelecimento.

## API scaffold do workspace

O monorepo contém uma API independente em `artifacts/api-server`:

| Método | Caminho | Resposta |
| --- | --- | --- |
| `GET` | `/api/healthz` | `{ "status": "ok" }` |

O contrato é definido em `lib/api-spec/openapi.yaml` (OpenAPI 3.1). A rota usa `HealthCheckResponse` de `@workspace/api-zod`, e o servidor registra requests com Pino, habilita CORS e parseia JSON/urlencoded.

O código gerado é dividido em:

- `lib/api-client-react`: cliente React Query e schemas de resposta;
- `lib/api-zod`: schemas/types Zod;
- `lib/api-spec`: entrada OpenAPI e configuração Orval.

Para alterar o contrato, edite primeiro `lib/api-spec/openapi.yaml` e regenere:

```bash
pnpm --filter @workspace/api-spec run codegen
```

Não edite manualmente `lib/api-client-react/src/generated` nem `lib/api-zod/src/generated`; esses arquivos são saídas do codegen.

## Banco de dados scaffold

`lib/db` inicializa um pool PostgreSQL com `DATABASE_URL` e exporta o Drizzle DB/schema. `src/schema/index.ts` ainda não define tabelas. O banco não participa da landing nem do health check atual. Qualquer funcionalidade persistida deve primeiro criar schema, validação e rota antes de ser ligada à interface.

## Ausência de integração no frontend

Apesar de `@workspace/api-client-react` estar listado como dependência do pacote web e `QueryClientProvider` estar montado, não há import de hooks gerados, `fetch` ou `useQuery` em `celebre-pizzaria/src`. Isso é intencionalmente documentado para separar infraestrutura preparada de comportamento realmente ativo.
