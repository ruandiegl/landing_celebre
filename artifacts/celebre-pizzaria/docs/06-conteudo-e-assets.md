# Conteúdo e assets

## Onde editar o conteúdo

O conteúdo editável da landing tem contrato centralizado em `src/content/` e é consumido pela Home e pelo painel `/admin`. O provider atual usa defaults e `localStorage` versionado como preview local; ele não substitui um CMS ou persistência multiusuário.

| Conteúdo | Fonte |
| --- | --- |
| Títulos e slots das seções | `src/content/landing-defaults.ts` |
| Contrato e IDs estáveis | `src/content/landing-content.ts` |
| Edição e preview local | `src/pages/Admin.tsx` e `src/content/content-provider.tsx` |
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
| `attached_assets/client_images/celebre-logo.jpeg` | logo no hero, navegação e rodapé |
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

Os assets atuais são importados no TypeScript, o que permite ao Vite incluí-los no bundle de produção com nomes processados. O admin pode selecionar esses assets ou usar uma URL/preview local. O contrato `src/storage/media-storage.ts` está pronto para a futura integração com Vercel Blob; nessa integração, atualize também o `alt` do slot.

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
