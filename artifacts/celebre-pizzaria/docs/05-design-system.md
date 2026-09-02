# Design system e linguagem visual

## Direção visual

A interface é dark-first, editorial e acolhedora. O fundo quase preto cria contraste para dourado, areia quente, fotografia de comida e tipografia serifada. O acabamento combina bordas discretas, grandes áreas de respiro, imagens com overlays e animações suaves.

## Tipografia

As fontes são carregadas em `src/index.css` via Google Fonts:

| Uso | Família | Aplicação |
| --- | --- | --- |
| Sans | `Work Sans` | navegação, corpo, labels, preços e CTAs |
| Serif | `Fraunces` | títulos, nomes de pizzas e destaques editoriais |
| Mono | `SF Mono`, fallback `Roboto Mono` | dados técnicos e variáveis de ambiente |

Use `font-sans` para texto funcional e `font-serif` para títulos da marca. Evite adicionar outra família sem necessidade de marca ou acessibilidade.

## Tokens de cor

Os tokens são definidos como variáveis HSL em `:root` e repetidos no seletor `.dark`; as classes Tailwind são expostas por `@theme inline`.

| Token | Valor atual | Intenção |
| --- | --- | --- |
| `background` | `0 0% 4%` | fundo preto fosco |
| `foreground` | `43 25% 92%` | texto creme claro |
| `primary` | `43 74% 54%` | dourado principal e CTAs |
| `secondary` | `28 77% 64%` | areia/dourado alternativo, usado no karaokê |
| `border` | `0 0% 15%` | bordas discretas |
| `card` | `0 0% 8%` | superfícies elevadas |
| `muted-foreground` | `43 15% 65%` | texto secundário |
| `destructive` | `0 72% 51%` | estados de erro |

Prefira tokens (`bg-primary`, `text-foreground`, `border-border`, `bg-card`) em vez de hex ou valores ad hoc. Valores hex podem ser usados em um efeito de marca específico já existente, como o gradiente dourado.

## Fundos, bordas e forma

- Fundo de aplicação: `bg-background`.
- Superfícies: `bg-card/30`, `bg-card/50` ou `bg-background/70`.
- Bordas: `border-border/30`, `/40` ou `/50`, com `border-primary/20` para destaque de conversão.
- Cards principais: cantos grandes, normalmente `rounded-2xl` ou `rounded-3xl`.
- CTAs: formato pill (`rounded-full`), padding generoso e feedback de escala ou cor.
- Ícones circulares: `rounded-full` com fundo `bg-primary/20` ou `bg-secondary/20`.

O raio base é `0.5rem`, exposto como `--radius`; o tema calcula `radius-sm`, `radius-md`, `radius-lg` e `radius-xl` a partir dele.

## Layout e espaçamento

- Container amplo: `max-w-7xl mx-auto px-6 lg:px-12`.
- Seções: padding vertical `py-24 lg:py-32`.
- Hero: altura mínima `100dvh`, com padding superior para a navegação fixa.
- Grids: mobile primeiro, evoluindo para `md:grid-cols-2` e `lg:grid-cols-2/3`.
- Use `gap-4`, `gap-6`, `gap-8`, `gap-12` e `gap-16` conforme a densidade visual atual; não reduza o respiro para encaixar conteúdo comercial sem revisar a hierarquia.

## Animações e interação

Animações globais em `src/index.css`:

| Classe | Duração | Uso |
| --- | --- | --- |
| `.animate-float` | 6s, ease-in-out, infinite | pizza flutuante |
| `.animate-glow-pulse` | 3s, infinite | halo dourado |
| `.animate-fade-in-up` | 0.8s, ease-out | utilitário de entrada |
| `.animate-fade-in` | 1s, ease-out | utilitário de fade |

As seções mantêm transições suaves legadas e a composição da Home usa `Reveal` com Framer Motion para entradas em viewport. `HeroIntro` usa GSAP apenas para a timeline de abertura, com seletores escopados por ref e cleanup automático via `useGSAP`. Preserve a suavidade; evite animações rápidas ou que bloqueiem leitura e interação.

`prefers-reduced-motion: reduce` remove deslocamentos, reduz transições/animações e desativa smooth scroll. Qualquer nova animação precisa manter esse comportamento.

O logo da navegação usa perspectiva de 900px e gira 180 graus no hover/foco, revelando a imagem de pizza no verso. A pizza flutuante aplica `drop-shadow`, `scale` e uma rotação leve via eventos de mouse.

## Efeitos de marca

- `.grain-overlay` adiciona uma textura SVG de ruído fixa com opacidade 0.03 e `pointer-events: none`.
- `.gold-gradient-text` usa `#D4AF37` e `#F4A460` em um gradiente de texto.
- Overlays de imagem usam gradientes de `background` para manter texto legível.

Ao adicionar uma fotografia, aplique overlay quando houver texto sobre a imagem e confirme contraste nos tamanhos mobile.

## Tema

Embora o arquivo contenha um bloco `.dark` e um comentário `LIGHT MODE`, os valores de `:root` já são escuros e o `.dark` repete essencialmente a mesma paleta. Não trate o projeto como se houvesse um modo claro funcional: a troca de tema não está implementada e `next-themes` aparece apenas como dependência do scaffold.
