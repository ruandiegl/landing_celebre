# Manutenção e gotchas

## Antes de alterar conteúdo comercial

Atualize o arquivo que contém a fonte da verdade e revise toda a página para evitar divergências. Hoje o telefone aparece tanto na reserva quanto no footer, e horários aparecem em mais de uma seção. Uma atualização parcial pode deixar informações conflitantes.

Checklist mínimo:

- validar preço e disponibilidade do item;
- validar horário geral versus programação do karaokê;
- validar número no texto, em `src/lib/contact-links.ts` e em `VITE_WHATSAPP_PHONE`;
- validar endereço, e-mail e capacidade;
- validar autorização dos depoimentos;
- atualizar `alt` e metadata se a imagem ou a campanha mudar.

## Placeholders conhecidos

- `Footer.tsx`: Facebook ainda usa `href="#"` porque o perfil não foi confirmado.
- `Admin.tsx`: o painel usa autenticação server-side e publicação remota; sem Functions/variáveis locais, somente o fallback local fica disponível e o login não deve ser contornado.
- `ReservationSection.tsx`: o fallback de WhatsApp é `5524999687150`.
- Dados como endereço, telefone, e-mail, preços, copyright `2024` e promessas de produto parecem iniciais e devem ser confirmados.
- `index.html` usa `lang="en"` embora o conteúdo seja português brasileiro.

Não trate placeholders como configuração válida de produção.

## Favicon

`index.html` aponta para `/images/logo-escura.png`, um asset estável em `public/images`. Verifique o favicon no build servido, especialmente quando o deploy usar um `BASE_PATH` diferente da raiz.

## Alias de assets

O alias `@assets` do `vite.config.ts` resolve para `attached_assets` dois níveis acima do diretório do artifact, isto é, para uma pasta na raiz do workspace. Os assets usados pela aplicação estão em `artifacts/celebre-pizzaria/attached_assets`, e nenhum componente atual usa `@assets`. Ao adicionar um asset, siga os imports relativos já existentes ou corrija o alias e valide typecheck/build antes de adotá-lo.

## CSS e tema

- O comentário `/* LIGHT MODE */` em `src/index.css` não corresponde à paleta: `:root` já define fundo quase preto e o bloco `.dark` repete os valores escuros.
- Não existe seletor ou provider que alterne para um tema claro.
- A classe `grain-overlay` usa pseudo-elemento `position: fixed` em z-index 100; novas camadas fixas precisam considerar essa sobreposição.
- O gradiente `.gold-gradient-text` usa cores hex diretamente porque é um efeito de marca; novos componentes devem continuar preferindo tokens.

## Scroll e animações

- A navegação muda após 50px de scroll.
- O CTA mobile só aparece após 600px.
- Os observers de seção dependem de `IntersectionObserver` e são desconectados no cleanup.
- Alterar alturas do hero ou o fluxo da Home pode mudar a experiência do CTA flutuante.
- Não adicione conteúdo importante somente em hover: a pizza do logo e a pizza flutuante têm efeitos de hover, mas seu conteúdo essencial já está disponível sem hover.
- Framer Motion controla reveals declarativos e usa `useReducedMotion`; GSAP fica restrito à timeline da hero e usa `useGSAP` com escopo/cleanup.
- A regra CSS `prefers-reduced-motion: reduce` reduz transições, animações e smooth scroll para preservar leitura e navegação.

## API/codegen/DB

- O frontend não usa o client gerado hoje.
- `lib/api-spec/openapi.yaml` é a fonte do contrato; os arquivos em `lib/*/src/generated` são derivados.
- O título OpenAPI `Api` não deve ser alterado sem atualizar a configuração/exportações do codegen.
- `lib/db/src/schema/index.ts` ainda não possui tabelas.
- `DATABASE_URL` é obrigatório para importar `@workspace/db`; não importe esse módulo no bundle da landing.

## Dependências e instalação

- Use pnpm; o `preinstall` remove lockfiles npm/yarn e falha se o user-agent não for pnpm.
- O `minimumReleaseAge: 1440` do workspace é uma proteção de supply chain; não reduza ou remova sem revisão de segurança.
- Mantenha React e React DOM na versão de catálogo fixada em `19.1.0`, pois o workspace registra essa restrição.
- Alterações nas dependências devem considerar todos os artifacts e libs, não apenas a landing.

## Conteúdo e Vercel Blob

`src/content/landing-content.ts` é o contrato de títulos, IDs, slots, `mediaKey` e catálogo. O admin publica em `images-celebre/config/landing-content.json`; `localStorage` é somente fallback/cache. `src/storage/media-storage.ts` não deve receber tokens Blob no cliente e previews `blob:` não são URLs duráveis.

Segurança obrigatória da rota administrativa:

- `celebre_admin_session`: cookie HttpOnly, Secure em produção, SameSite Strict, expiração de 30 minutos;
- `celebre_admin_csrf`: cookie não HttpOnly comparado ao header `X-CSRF-Token` nas mutações;
- origem validada contra `ADMIN_ALLOWED_ORIGINS`;
- rate limit local de melhor esforço por instância: login 5/15 min, conteúdo 30/min, token 20/h e mídia 60/min;
- CSP, `nosniff`, `X-Frame-Options: DENY`, Referrer Policy, Permissions Policy e `Cache-Control: no-store`;
- conteúdo validado com Zod; imagens limitadas a JPEG/PNG/WebP, 10 MiB e prefixo allowlisted;
- nenhum password hash ou token Blob em `VITE_*`, HTML ou bundle.

Para alterar a autenticação, atualize os testes em `src/server/` antes do código. O hash informado pelo operador deve ser gerado uma única vez pelo script e configurado como variável secreta; nunca o copie para documentação ou commit.

## Quando criar uma nova abstração

O projeto tem várias primitives UI já disponíveis, mas a Home é simples e estática. Antes de criar store, API, CMS ou componente genérico:

1. confirme que a necessidade aparece em mais de uma seção;
2. identifique a fonte de dados e o contrato;
3. preserve a composição da Home;
4. documente a nova decisão em [Arquitetura](02-arquitetura.md) e [Mapa de arquivos](11-mapa-de-arquivos.md);
5. adicione uma verificação automatizada ou um passo manual reproduzível.
