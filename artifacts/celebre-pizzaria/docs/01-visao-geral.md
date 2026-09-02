# Visão geral do produto

## O que é

CELEBRE Pizzaria é uma landing page comercial, em português, voltada a famílias, grupos de igreja e celebrações. A proposta combina pizza artesanal, rodízio, karaokê gospel e atendimento para reservas.

A experiência é uma página única, visual e orientada à conversão. O visitante percorre a narrativa da marca e encontra chamadas para consultar o cardápio ou reservar uma mesa.

## Jornada principal

```text
Entrada na página
  -> Hero com proposta de valor
  -> Tradição artesanal
  -> Cardápio e preços demonstrativos
  -> Rodízio
  -> Karaokê gospel
  -> Ambiente
  -> Depoimentos
  -> Reserva via WhatsApp
  -> Contato e links sociais
```

O usuário pode interromper a sequência a qualquer momento pelos botões de navegação, CTAs ou pelo CTA flutuante no mobile.

## Seções da Home

| Ordem | Componente | ID/âncora | Papel na experiência |
| ---: | --- | --- | --- |
| 1 | `Navigation` | — | Navegação fixa, logo e CTA de reserva |
| 2 | `HeroSection` | — | Mensagem principal e CTAs de cardápio/reserva |
| 3 | `FloatingPizzaSection` | `nossa-pizza` | Diferenciais artesanais: 72h, 400°C e ingredientes frescos |
| 4 | `CardapioSection` | `cardapio` | Seis pizzas, descrições, preços e CTA |
| 5 | `RodizioSection` | `rodizio` | Benefícios do rodízio e preço inicial |
| 6 | `KaraokeSection` | `karaoke` | Programação e atributos das noites de karaokê |
| 7 | `AmbienceSection` | `ambiente` | Imagens do salão e atributos do espaço |
| 8 | `TestimonialsSection` | `depoimentos` | Três depoimentos estáticos com cinco estrelas |
| 9 | `ReservationSection` | `reserva` | CTA externo de reserva via WhatsApp, telefone, endereço e horário |
| 10 | `Footer` | — | Marca, links rápidos, contato e redes sociais |
| 11 | `MobileFloatingCTA` | — | CTAs fixos de cardápio e reserva após scroll no mobile |

## Capacidades atuais

- Exibe uma apresentação responsiva da pizzaria.
- Usa animações de entrada quando seções entram na viewport.
- Navega suavemente entre seções por `scrollIntoView`.
- Alterna o estado visual da navegação após 50px de scroll.
- Mostra CTAs flutuantes no mobile após 600px de scroll.
- Abre o WhatsApp em nova aba com a mensagem de reserva preenchida.
- Exibe botão flutuante global de WhatsApp para o número confirmado.
- Exibe uma página 404 para qualquer caminho diferente de `/` e `/admin`.
- Oferece `/admin` para editar títulos, imagens e itens do mini catálogo no preview local.

## O que não existe hoje

- Autenticação de administrador ou proteção de acesso de produção.
- Carrinho, checkout ou pedido online.
- Formulário próprio para reservas.
- Persistência remota de cardápio, depoimentos ou horários em banco de dados/CMS.
- Upload durável de imagens no Vercel Blob; há somente o contrato e o adapter de preview local.
- Consumo do endpoint `/api/healthz` pela landing.
- Analytics, pixels de marketing ou observabilidade de conversão visíveis no código.

## Conteúdo comercial a validar

Os textos são parte da interface, mas vários valores têm aparência de conteúdo inicial/demonstrativo. Antes de produção, confirme com o negócio:

- endereço, cidade, telefone e e-mail;
- número real do WhatsApp;
- preços das pizzas e do rodízio;
- horários gerais e horários do karaokê;
- capacidade de 120 pessoas;
- promessas como fermentação de 72 horas, forno a 400°C e “mais de 30 sabores”;
- nomes e autorização dos depoimentos;
- perfis reais de Instagram, Facebook e WhatsApp.
