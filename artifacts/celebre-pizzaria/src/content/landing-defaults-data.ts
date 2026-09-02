import type { ImageSlot, LandingContent } from './landing-content';

const image = (
  mediaKey: string,
  slotId: string,
  label: string,
  purpose: string,
  src: string,
  alt: string,
): ImageSlot => ({ mediaKey, slotId, label, purpose, src, alt });

export const DEFAULT_LANDING_CONTENT_DATA: LandingContent = {
  schemaVersion: 1,
  branding: {
    logo: image('brand-logo-escura', 'logo', 'Logo principal', 'Marca exibida no topo e no rodapé', '/images/logo-escura.png', 'Logo CELEBRE Pizzaria Gospel Bar Abbas'),
  },
  sections: [
    { id: 'hero', label: 'Abertura da landing', title: 'Celebre cada\nmomento', images: [image('room-full', 'background', 'Imagem de fundo da abertura', 'Foto principal atrás do conteúdo inicial', '/images/site/celebre-sala-cheia.jpeg', 'Salão da CELEBRE cheio de famílias e grupos')] },
    { id: 'nossa-pizza', label: 'Nossa pizza', title: 'Pizza como deve ser', images: [image('pizza-real', 'main', 'Pizza artesanal em destaque', 'Imagem principal da história artesanal', '/images/site/celebre-pizza-real.jpeg', 'Pizza artesanal CELEBRE')] },
    { id: 'cardapio', label: 'Mini catálogo / cardápio', title: 'Sabores que celebram', images: [image('pizza-variety', 'header', 'Imagem de apresentação do cardápio', 'Foto exibida acima do título do mini catálogo', '/images/site/pizza-variety.jpg', 'Variedade de pizzas do cardápio CELEBRE')] },
    { id: 'rodizio', label: 'Rodízio completo', title: 'Pizza sem limites', images: [image('pizza-real', 'main', 'Imagem do rodízio', 'Foto que acompanha a oferta de rodízio', '/images/site/celebre-pizza-real.jpeg', 'Rodízio de pizzas CELEBRE')] },
    { id: 'karaoke', label: 'Noites de karaokê gospel', title: 'Karaokê\nGospel', images: [image('room-full', 'main', 'Imagem do palco de karaokê', 'Foto principal da experiência de karaokê', '/images/site/celebre-sala-cheia.jpeg', 'Noite de karaokê no CELEBRE')] },
    { id: 'ambiente', label: 'Ambiente e celebrações', title: 'Onde cada detalhe importa', images: [image('room-event', 'event', 'Ambiente preparado para eventos', 'Primeiro card visual do espaço', '/images/site/celebre-sala-evento.jpeg', 'Ambiente CELEBRE preparado para evento'), image('room-full', 'full-room', 'Salão com grupos reunidos', 'Segundo card visual do espaço', '/images/site/celebre-sala-cheia.jpeg', 'Salão CELEBRE com famílias e grupos reunidos')] },
    { id: 'depoimentos', label: 'Depoimentos de clientes', title: 'O que dizem nossos clientes', images: [image('room-full', 'background', 'Imagem de fundo dos depoimentos', 'Textura visual sutil atrás dos depoimentos', '/images/site/celebre-sala-cheia.jpeg', 'Clientes reunidos no salão da CELEBRE')] },
    { id: 'reserva', label: 'Reservas e contato', title: 'Garanta seu lugar', images: [image('room-event', 'main', 'Imagem da reserva', 'Foto do salão usada no convite para reservar', '/images/site/celebre-sala-evento.jpeg', 'Salão preparado para reservas e eventos no CELEBRE')] },
  ],
  catalog: [
    { id: 'margherita-classica', name: 'Margherita Clássica', description: 'Molho de tomate San Marzano, mussarela de búfala, manjericão fresco, azeite extravirgem', price: 'R$ 58', image: image('pizza-hero', 'catalog-image', 'Imagem da Margherita Clássica', 'Foto do item 1 do mini catálogo', '/images/site/pizza-hero.jpg', 'Pizza Margherita Clássica') },
    { id: 'frango-catupiry', name: 'Frango com Catupiry', description: 'Frango desfiado, catupiry cremoso, mussarela e borda dourada no forno', price: 'R$ 62', image: image('pizza-real', 'catalog-image', 'Imagem do Frango com Catupiry', 'Foto do item 2 do mini catálogo', '/images/site/celebre-pizza-real.jpeg', 'Pizza de Frango com Catupiry') },
    { id: 'quattro-formaggi', name: 'Quattro Formaggi', description: 'Gorgonzola, parmesão, mussarela, provolone, mel de engenho', price: 'R$ 68', image: image('pizza-variety', 'catalog-image', 'Imagem do Quattro Formaggi', 'Foto do item 3 do mini catálogo', '/images/site/pizza-variety.jpg', 'Pizza Quattro Formaggi') },
    { id: 'portuguesa-gospel', name: 'Portuguesa Gospel', description: 'Presunto, ovos, cebola, azeitonas, mussarela, orégano', price: 'R$ 64', image: image('pizza-real', 'catalog-image', 'Imagem da Portuguesa Gospel', 'Foto do item 4 do mini catálogo', '/images/site/celebre-pizza-real.jpeg', 'Pizza Portuguesa Gospel') },
    { id: 'vegetariana-casa', name: 'Vegetariana da Casa', description: 'Tomate seco, rúcula, champignon, pimentão, azeitonas, queijo de cabra', price: 'R$ 66', image: image('pizza-hero', 'catalog-image', 'Imagem da Vegetariana da Casa', 'Foto do item 5 do mini catálogo', '/images/site/pizza-hero.jpg', 'Pizza Vegetariana da Casa') },
    { id: 'calabresa-especial', name: 'Calabresa Especial', description: 'Calabresa artesanal, cebola roxa, mussarela, pimenta biquinho', price: 'R$ 60', image: image('pizza-variety', 'catalog-image', 'Imagem da Calabresa Especial', 'Foto do item 6 do mini catálogo', '/images/site/pizza-variety.jpg', 'Pizza de Calabresa Especial') },
  ],
};
