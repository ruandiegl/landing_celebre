# Conteúdo e assets

## Onde editar o conteúdo

O conteúdo editável da landing tem contrato centralizado em `src/content/` e é consumido pela Home e pelo painel `/admin`. O documento publicado fica no Vercel Blob; o provider usa defaults e `localStorage` versionado como fallback/cache offline.

| Conteúdo | Fonte |
| --- | --- |
| Títulos e slots das seções | `src/content/landing-defaults-data.ts` (puro) e `landing-defaults.ts` (bundled) |
| Contrato e IDs estáveis | `src/content/landing-content.ts` |
| Edição, autenticação e publicação | `src/pages/Admin.tsx`, `AdminLogin.tsx`, `src/hooks/use-admin-session.ts` |
| Hero, subtítulo e CTAs | `src/components/HeroSection.tsx` + conteúdo central |
| Processo artesanal e métricas | `src/components/FloatingPizzaSection.tsx` + conteúdo central |
| Pizzas, descrições, preços e imagens | `content.catalog` em `src/content/landing-defaults.ts` |
| Benefícios e preço inicial do rodízio | constante `benefits` e JSX em `src/components/RodizioSection.tsx` |
| Programação e benefícios do karaokê | `src/components/KaraokeSection.tsx` |
| Capacidade e atributos do espaço | `src/components/AmbienceSection.tsx` |
| Depoimentos e ratings | constante `testimonials` em `src/components/TestimonialsSection.tsx` |
| WhatsApp, endereço e horário | `src/lib/contact-links.ts` e `src/components/ReservationSection.tsx` |
| Links rápidos, redes, contato e copyright | `src/components/Footer.tsx` e `src/lib/contact-links.ts` |
| SEO básico e social cards textuais | `index.html` |

## Assets disponíveis

### Imagens de cliente

| Arquivo | Uso atual |
| --- | --- |
| `public/images/logo-escura.png` | logo circular no header, favicon e rodapé |
| `public/images/logo-chromakey.png` | logo principal transparente do hero |
| `attached_assets/client_images/celebre-pizza-real.jpeg` | pizza flutuante, rodízio e cards do cardápio |
| `attached_assets/client_images/celebre-sala-cheia.jpeg` | fundo do hero, karaokê e ambiente com grupos |
| `attached_assets/client_images/celebre-sala-evento.jpeg` | ambiente de evento e imagem da reserva |
| `attached_assets/client_images/pizza-top-hover.webp` | verso do logo na navegação |

### Imagens geradas

| Arquivo | Uso atual |
| --- | --- |
| `attached_assets/generated_images/pizza-hero.jpg` | Margherita Clássica e Vegetariana da Casa |
| `attached_assets/generated_images/pizza-variety.jpg` | Quattro Formaggi e Calabresa Especial |
| `attached_assets/generated_images/dining-room.jpg` | disponível, não importado pela landing atual |
| `attached_assets/generated_images/floating-pizza.jpg` | disponível, não importado pela landing atual |
| `attached_assets/generated_images/ingredients.jpg` | disponível, não importado pela landing atual |
| `attached_assets/generated_images/karaoke-stage.jpg` | disponível, não importado pela landing atual |

Os assets atuais são importados no TypeScript, o que permite ao Vite incluí-los no fallback bundled de produção. A migração para o Blob usa o prefixo `images-celebre/` e os `mediaKey` estáveis dos slots. O admin pode selecionar assets remotos ou enviar JPEG/PNG/WebP de até 10 MiB; a URL final é gravada no documento somente ao publicar.

### Inventário de migração para o Blob

O script `scripts/migrate-assets-to-blob.ts` trabalha com estes oito arquivos e caminhos exatos:

| `mediaKey` | Origem | Caminho no Blob |
| --- | --- | --- |
| `brand-logo-escura` | `public/images/logo-escura.png` | `images-celebre/brand/logo-escura.png` |
| `brand-logo-chromakey` | `public/images/logo-chromakey.png` | `images-celebre/brand/logo-chromakey.png` |
| `room-full` | `attached_assets/client_images/celebre-sala-cheia.jpeg` | `images-celebre/site/celebre-sala-cheia.jpeg` |
| `pizza-real` | `attached_assets/client_images/celebre-pizza-real.jpeg` | `images-celebre/site/celebre-pizza-real.jpeg` |
| `room-event` | `attached_assets/client_images/celebre-sala-evento.jpeg` | `images-celebre/site/celebre-sala-evento.jpeg` |
| `pizza-top-hover` | `attached_assets/client_images/pizza-top-hover.webp` | `images-celebre/site/pizza-top-hover.webp` |
| `pizza-hero` | `attached_assets/generated_images/pizza-hero.jpg` | `images-celebre/site/pizza-hero.jpg` |
| `pizza-variety` | `attached_assets/generated_images/pizza-variety.jpg` | `images-celebre/site/pizza-variety.jpg` |

O documento editorial é `images-celebre/config/landing-content.json`. A migração não apaga blobs, ignora caminhos existentes por padrão e só substitui caminhos exatos quando `--replace-existing` é informado.

As logos de marca ficam em `public/images` porque são referências estáveis da identidade visual. A versão chromakey foi materializada como PNG com transparência para evitar que o fundo verde apareça no hero.

## Regras de conteúdo

- Mantenha português do Brasil, incluindo acentuação de “cardápio”, “rodízio”, “karaokê” e “à la carte”.
- Preserve o tom: acolhedor, celebrativo, familiar e ligado à fé, sem transformar a interface em texto excessivamente promocional.
- Preços devem permanecer como strings formatadas em reais (`R$ 58`) até existir uma fonte de dados numérica.
- `key` de listas comerciais deve ser estável; hoje o nome da pizza/depoimento cumpre esse papel.
- Atualize `alt` quando a imagem mudar. O texto alternativo deve descrever a função da imagem na página.
- Não embuta informações comerciais que não foram confirmadas pelo negócio.

## Dados atualmente exibidos

### Cardápio de exemplo

| Pizza | Preço atual no código |
| --- | ---: |
| Margherita Clássica | R$ 58 |
| Frango com Catupiry | R$ 62 |
| Quattro Formaggi | R$ 68 |
| Portuguesa Gospel | R$ 64 |
| Vegetariana da Casa | R$ 66 |
| Calabresa Especial | R$ 60 |

### Mensagens comerciais

- Rodízio: a partir de `R$ 69` por pessoa.
- Rodízio: terça a domingo, das 18h às 23h.
- Karaokê: sexta e sábado; a programação mostra sexta 19h–23h e sábado 19h–00h.
- Espaço: capacidade declarada de até 120 pessoas.
- Reserva: `+55 (24) 99968-7150`, `R. Beira Rio n 2233, Morada do Vale, 27275-330` e `Ter-Dom: 18h - 23h`.

Esses valores são conteúdo do protótipo e não devem ser tratados como dados validados sem confirmação operacional.

## SEO e metadata

`index.html` define título, description, robots, Open Graph e Twitter card textuais. O idioma do HTML ainda está como `en`, apesar do conteúdo ser em português; isso é um ponto de manutenção registrado em [Manutenção e gotchas](10-manutencao-e-gotchas.md). O favicon declarado também merece verificação no deploy.
