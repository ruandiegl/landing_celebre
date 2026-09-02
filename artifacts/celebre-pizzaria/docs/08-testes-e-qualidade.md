# Testes e qualidade

## Cobertura existente

O pacote `@workspace/celebre-pizzaria` possui Vitest com ambiente jsdom e testes de contrato/interação em `src/**/*.test.ts(x)`. A cobertura valida modelo de conteúdo, URLs seguras, hash/sessão/cookies, origem/CSRF, rate limit local, fallback remoto/local, links de contato, comportamento reduzido do reveal e edição de título no admin.

Além dos testes automatizados, a validação disponível inclui:

- TypeScript com `strict` herdado de `tsconfig.base.json`;
- build do Vite;
- revisão manual da jornada e da responsividade;
- validação dos pacotes do workspace quando necessário.

Isso significa que build verde confirma compilação e empacotamento, mas não confirma texto comercial, links externos, contraste ou comportamento visual.

## Verificações obrigatórias

Na raiz do workspace:

```bash
pnpm --filter @workspace/celebre-pizzaria run typecheck
pnpm --filter @workspace/celebre-pizzaria run test
pnpm --filter @workspace/celebre-pizzaria run build
```

Para uma alteração que toca dependências compartilhadas ou contratos:

```bash
pnpm run typecheck
pnpm run build
```

O primeiro comando do pacote chama `tsc -p tsconfig.json --noEmit`. O build do pacote chama `vite build --config vite.config.ts`. Não existe lint configurado no pacote; a dependência `prettier` está no root, mas não há script padronizado de formatação.

## Checklist funcional manual

### Navegação e conversão

- [ ] `/` renderiza a Home sem erro no console.
- [ ] O logo retorna suavemente ao topo.
- [ ] Cardápio, Rodízio e Karaokê levam às seções corretas no desktop.
- [ ] O atalho mobile leva ao cardápio e os CTAs levam à reserva.
- [ ] Os botões do hero, cardápio, rodízio, karaokê e footer chegam a `#reserva` quando aplicável.
- [ ] O CTA flutuante aparece no mobile após aproximadamente 600px de scroll.
- [ ] O link “Reservar pelo WhatsApp” abre a URL esperada e a mensagem está preenchida.
- [ ] O botão flutuante de WhatsApp aparece sem cobrir CTAs e abre `5524999687150`.
- [ ] `/admin` lista as oito seções com `sectionId`, slots nomeados e seis itens com `catalogItemId`.
- [ ] `/admin` sem sessão mostra autenticação e não exibe o editor.
- [ ] Alterar título/imagem cria rascunho; `Salvar alterações` publica e `Restaurar defaults` desfaz a edição remota.
- [ ] Duas sessões com revisões diferentes recebem conflito `409` sem sobrescrever o trabalho mais novo.

### Responsividade e acessibilidade

- [ ] A navegação desktop aparece em `lg` e o CTA flutuante não aparece em desktop.
- [ ] Cards e grids não geram overflow horizontal em viewport estreita.
- [ ] O conteúdo principal continua legível sem depender de hover.
- [ ] Botões podem receber foco pelo teclado e o logo tem nome acessível.
- [ ] Imagens informativas têm `alt` coerente com a seção.
- [ ] Com `prefers-reduced-motion: reduce`, o conteúdo aparece sem depender de animação.
- [ ] Contraste é conferido depois de mudanças de cor/opacidade.

### Conteúdo e publicação

- [ ] Preços, horários, endereço, telefone e e-mail foram aprovados pelo negócio.
- [ ] Links sociais deixaram de usar `#`.
- [ ] Fontes e imagens carregam no build publicado.
- [ ] Favicon e metadata são conferidos no HTML servido.
- [ ] Um caminho inexistente mostra o 404 sem quebrar a aplicação.

### Segurança e Blob

- [ ] Produção tem todas as variáveis server-side configuradas e nenhuma usa `VITE_`.
- [ ] Login repetido recebe `429` no limite e não revela se usuário ou senha estava errado.
- [ ] Mutação sem origem permitida ou sem CSRF recebe `403`.
- [ ] Token Blob aceita apenas JPEG/PNG/WebP, máximo 10 MiB e prefixo `images-celebre/`.
- [ ] `/api/unknown` retorna JSON `404`, não `index.html`.
- [ ] A migração passa primeiro por `--dry-run` e não remove blobs.

## Seletores úteis para testes E2E

Os `data-testid` atuais formam uma superfície prática para automação:

| Seletor | Elemento |
| --- | --- |
| `nav-cardapio`, `nav-rodizio`, `nav-karaoke`, `nav-reserva` | navegação desktop |
| `nav-logo` | botão de retorno ao topo |
| `nav-mobile-menu` | atalho de navegação mobile |
| `hero-cta-cardapio`, `hero-cta-reserva` | CTAs do hero |
| `pizza-card-0` a `pizza-card-5` | cards do cardápio |
| `cardapio-cta`, `rodizio-cta`, `karaoke-cta` | CTAs de seção |
| `whatsapp-reservation` | link externo de reserva |
| `footer-cardapio`, `footer-rodizio`, `footer-karaoke`, `footer-reserva` | links rápidos |
| `social-instagram`, `social-facebook`, `social-whatsapp` | links sociais |
| `mobile-cta-cardapio`, `mobile-cta-reserva` | CTA flutuante |
| `testimonial-0` a `testimonial-2` | depoimentos |
| `floating-whatsapp` | botão flutuante de WhatsApp |

Se um seletor for renomeado, atualize testes e esta tabela no mesmo change.

O admin também expõe `data-section-id` e `data-catalog-item-id` para testes assertivos.

## Critérios de revisão

Antes de aprovar uma alteração de frontend, confirme:

1. O componente continua isolado e a composição permanece em `Home.tsx`.
2. IDs, CTAs e links externos continuam coerentes.
3. Não foi introduzida uma cor, fonte ou animação fora do sistema sem justificativa.
4. O conteúdo comercial foi validado, não apenas copiado de um mockup.
5. Typecheck e build foram executados após a última alteração.
