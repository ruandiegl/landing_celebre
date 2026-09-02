import heroRoomPath from '../../attached_assets/client_images/celebre-sala-cheia.jpeg';
import eventRoomPath from '../../attached_assets/client_images/celebre-sala-evento.jpeg';
import pizzaRealPath from '../../attached_assets/client_images/celebre-pizza-real.jpeg';
import pizzaVarietyPath from '../../attached_assets/generated_images/pizza-variety.jpg';
import pizzaHeroPath from '../../attached_assets/generated_images/pizza-hero.jpg';
import { HEADER_LOGO_PATH } from '@/lib/brand-assets';
import type { ImageSlot, LandingContent } from './landing-content';
import { cloneLandingContent } from './landing-content';

const image = (
  slotId: string,
  label: string,
  purpose: string,
  src: string,
  alt: string,
): ImageSlot => ({ slotId, label, purpose, src, alt });

const defaultLandingContent: LandingContent = {
  schemaVersion: 1,
  branding: {
    logo: image(
      'logo',
      'Logo principal',
      'Marca exibida no topo e no rodapé',
      HEADER_LOGO_PATH,
      'Logo CELEBRE Pizzaria Gospel Bar Abbas',
    ),
  },
  sections: [
    {
      id: 'hero',
      label: 'Abertura da landing',
      title: 'Celebre cada\nmomento',
      images: [
        image(
          'background',
          'Imagem de fundo da abertura',
          'Foto principal atrás do conteúdo inicial',
          heroRoomPath,
          'Salão da CELEBRE cheio de famílias e grupos',
        ),
      ],
    },
    {
      id: 'nossa-pizza',
      label: 'Nossa pizza',
      title: 'Pizza como deve ser',
      images: [
        image(
          'main',
          'Pizza artesanal em destaque',
          'Imagem principal da história artesanal',
          pizzaRealPath,
          'Pizza artesanal CELEBRE',
        ),
      ],
    },
    {
      id: 'cardapio',
      label: 'Mini catálogo / cardápio',
      title: 'Sabores que celebram',
      images: [
        image(
          'header',
          'Imagem de apresentação do cardápio',
          'Foto exibida acima do título do mini catálogo',
          pizzaVarietyPath,
          'Variedade de pizzas do cardápio CELEBRE',
        ),
      ],
    },
    {
      id: 'rodizio',
      label: 'Rodízio completo',
      title: 'Pizza sem limites',
      images: [
        image(
          'main',
          'Imagem do rodízio',
          'Foto que acompanha a oferta de rodízio',
          pizzaRealPath,
          'Rodízio de pizzas CELEBRE',
        ),
      ],
    },
    {
      id: 'karaoke',
      label: 'Noites de karaokê gospel',
      title: 'Karaokê\nGospel',
      images: [
        image(
          'main',
          'Imagem do palco de karaokê',
          'Foto principal da experiência de karaokê',
          heroRoomPath,
          'Noite de karaokê no CELEBRE',
        ),
      ],
    },
    {
      id: 'ambiente',
      label: 'Ambiente e celebrações',
      title: 'Onde cada detalhe importa',
      images: [
        image(
          'event',
          'Ambiente preparado para eventos',
          'Primeiro card visual do espaço',
          eventRoomPath,
          'Ambiente CELEBRE preparado para evento',
        ),
        image(
          'full-room',
          'Salão com grupos reunidos',
          'Segundo card visual do espaço',
          heroRoomPath,
          'Salão CELEBRE com famílias e grupos reunidos',
        ),
      ],
    },
    {
      id: 'depoimentos',
      label: 'Depoimentos de clientes',
      title: 'O que dizem nossos clientes',
      images: [
        image(
          'background',
          'Imagem de fundo dos depoimentos',
          'Textura visual sutil atrás dos depoimentos',
          heroRoomPath,
          'Clientes reunidos no salão da CELEBRE',
        ),
      ],
    },
    {
      id: 'reserva',
      label: 'Reservas e contato',
      title: 'Garanta seu lugar',
      images: [
        image(
          'main',
          'Imagem da reserva',
          'Foto do salão usada no convite para reservar',
          eventRoomPath,
          'Salão preparado para reservas e eventos no CELEBRE',
        ),
      ],
    },
  ],
  catalog: [
    {
      id: 'margherita-classica',
      name: 'Margherita Clássica',
      description:
        'Molho de tomate San Marzano, mussarela de búfala, manjericão fresco, azeite extravirgem',
      price: 'R$ 58',
      image: image(
        'catalog-image',
        'Imagem da Margherita Clássica',
        'Foto do item 1 do mini catálogo',
        pizzaHeroPath,
        'Pizza Margherita Clássica',
      ),
    },
    {
      id: 'frango-catupiry',
      name: 'Frango com Catupiry',
      description:
        'Frango desfiado, catupiry cremoso, mussarela e borda dourada no forno',
      price: 'R$ 62',
      image: image(
        'catalog-image',
        'Imagem do Frango com Catupiry',
        'Foto do item 2 do mini catálogo',
        pizzaRealPath,
        'Pizza de Frango com Catupiry',
      ),
    },
    {
      id: 'quattro-formaggi',
      name: 'Quattro Formaggi',
      description: 'Gorgonzola, parmesão, mussarela, provolone, mel de engenho',
      price: 'R$ 68',
      image: image(
        'catalog-image',
        'Imagem do Quattro Formaggi',
        'Foto do item 3 do mini catálogo',
        pizzaVarietyPath,
        'Pizza Quattro Formaggi',
      ),
    },
    {
      id: 'portuguesa-gospel',
      name: 'Portuguesa Gospel',
      description: 'Presunto, ovos, cebola, azeitonas, mussarela, orégano',
      price: 'R$ 64',
      image: image(
        'catalog-image',
        'Imagem da Portuguesa Gospel',
        'Foto do item 4 do mini catálogo',
        pizzaRealPath,
        'Pizza Portuguesa Gospel',
      ),
    },
    {
      id: 'vegetariana-casa',
      name: 'Vegetariana da Casa',
      description:
        'Tomate seco, rúcula, champignon, pimentão, azeitonas, queijo de cabra',
      price: 'R$ 66',
      image: image(
        'catalog-image',
        'Imagem da Vegetariana da Casa',
        'Foto do item 5 do mini catálogo',
        pizzaHeroPath,
        'Pizza Vegetariana da Casa',
      ),
    },
    {
      id: 'calabresa-especial',
      name: 'Calabresa Especial',
      description: 'Calabresa artesanal, cebola roxa, mussarela, pimenta biquinho',
      price: 'R$ 60',
      image: image(
        'catalog-image',
        'Imagem da Calabresa Especial',
        'Foto do item 6 do mini catálogo',
        pizzaVarietyPath,
        'Pizza de Calabresa Especial',
      ),
    },
  ],
};

export function createDefaultLandingContent(): LandingContent {
  return cloneLandingContent(defaultLandingContent);
}

export const DEFAULT_MEDIA_ASSETS = [
  defaultLandingContent.branding.logo,
  ...defaultLandingContent.sections.flatMap((section) => section.images),
  ...defaultLandingContent.catalog.map((item) => item.image),
];
