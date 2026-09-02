# Frontend e padrões de componentes

## Estrutura da interface

O frontend separa o shell de aplicação, páginas, seções de produto, primitives de UI e utilitários:

```text
src/
├─ main.tsx              # bootstrap React + CSS global
├─ App.tsx               # providers e roteamento
├─ pages/
│  ├─ Home.tsx           # composição da landing
│  ├─ Admin.tsx           # painel local de conteúdo
│  └─ not-found.tsx      # fallback 404
├─ components/
│  ├─ *.tsx              # seções específicas da CELEBRE
│  └─ ui/*.tsx           # primitives shadcn/Radix disponíveis
├─ content/               # contrato, defaults e provider do conteúdo
├─ storage/               # contrato de mídia e adapter de preview
├─ hooks/                # hooks utilitários compartilháveis
└─ lib/utils.ts          # cn(), merge de classes Tailwind
```

As seções da CELEBRE são componentes independentes, mas a ordem e a presença delas são controladas por `src/pages/Home.tsx`. Não coloque uma seção diretamente em `App.tsx`.

## Regras para criar ou alterar uma seção

1. Crie um componente nomeado em `src/components/NomeDaSection.tsx`.
2. Mantenha o conteúdo e o comportamento da seção nesse arquivo; evite espalhar a mesma regra em `Home`.
3. Se a seção for destino de navegação, use um `id` estável em `<section>` e registre o ID em [Rotas e integrações](07-rotas-e-integracoes.md).
4. Importe a seção em `Home.tsx` e insira-a na posição narrativa correta.
5. Para títulos e imagens editáveis, use o modelo em `src/content/`; para conteúdo fixo complementar, prefira uma constante tipada próxima do componente e renderização com `.map()`.
6. Para uma ação dentro da mesma página, use `<button>` e `scrollIntoView({ behavior: 'smooth' })`; para um destino externo, use `<a>`.
7. Adicione ou preserve `data-testid` em elementos de conversão e navegação.
8. Valide desktop, tablet e mobile antes de considerar a alteração concluída.

## Estado e efeitos

O estado existente é local e simples:

- `Navigation`: `scrolled` muda quando `window.scrollY > 50`.
- `HeroSection`: `isVisible` é ativado no primeiro efeito de montagem para iniciar o fade-in.
- Seções de conteúdo: `IntersectionObserver` ativa `isVisible` quando a seção entra na viewport; os thresholds variam entre `0.1` e `0.2` conforme a seção.
- `MobileFloatingCTA`: `isVisible` muda quando `window.scrollY > 600`.

Ao adicionar listeners ou observers:

- registre-os dentro de `useEffect`;
- remova listeners no cleanup;
- desconecte observers no cleanup;
- mantenha o array de dependências estável;
- não crie estado global para uma transição visual local.

## Navegação por âncoras

O helper repetido nas seções procura um elemento pelo ID e chama `scrollIntoView`. Portanto:

- IDs devem ser únicos;
- a grafia do ID é parte do contrato entre botão e seção;
- alterar um ID exige atualizar todos os `scrollToSection` relacionados;
- âncoras não alteram a URL nem criam uma nova rota Wouter.

O botão chamado “menu mobile” em `Navigation` é atualmente um atalho que leva ao `cardapio`; ele não abre um drawer ou menu expansível. Preserve a semântica ou altere o texto/comportamento juntos se um menu real for implementado.

## Responsividade

- A navegação completa aparece a partir de `lg`; em telas menores aparece apenas o logo e o atalho móvel.
- O layout usa breakpoints utilitários do Tailwind (`sm`, `md`, `lg`) e grids que passam de uma para duas ou três colunas.
- `useIsMobile` considera mobile uma largura menor que 768px; ele é um utilitário disponível, mas não é usado pelos componentes da landing atual.
- O CTA flutuante possui `lg:hidden`, aparece apenas em telas menores que `lg` e fica fixo a 24px do rodapé e das laterais.

## Acessibilidade e HTML

- Use headings na hierarquia da seção (`h1` no hero, `h2` para seções e `h3` para cards).
- Toda seção editável deve manter `data-section-id`, `data-section-label` e `aria-labelledby` coerentes com `LANDING_SECTION_IDS`.
- Use `alt` descritivo em imagens informativas; imagens puramente decorativas podem usar `alt=""`.
- Mantenha `aria-label` em botões cujo conteúdo é apenas logo/ícone.
- Para links com `target="_blank"`, mantenha `rel="noopener noreferrer"`.
- Não substitua links externos por `button` apenas para reaproveitar classes.
- Verifique contraste ao trocar tokens claros, sobretudo `text-foreground/60` e `text-foreground/70`.
- Reveals com Framer Motion devem usar `useReducedMotion`; timelines GSAP devem usar `useGSAP` com escopo e cleanup.

## UI primitives

`src/components/ui` contém componentes gerados/estilizados no padrão shadcn New York com Radix UI. Hoje a página usa diretamente `Card`, `CardContent`, `Toaster` e `TooltipProvider`; `Toast` é usado internamente pelo `Toaster`. Os demais estão disponíveis para futuras telas.

Ao reutilizar uma primitive:

- importe de `@/components/ui/...`;
- use `cn()` para combinar classes condicionais;
- evite duplicar uma primitive em `src/components`;
- preserve a API e os atributos de acessibilidade do Radix.

## Convenção de estilo do código

Siga o estilo existente do arquivo que está sendo editado: TypeScript estrito, imports no topo, componentes funcionais, export nomeado para componentes de seção e classes Tailwind diretamente no JSX. Use comentários apenas para explicar uma decisão de layout ou uma limitação não óbvia.
