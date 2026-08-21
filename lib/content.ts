// lib/content.ts — PLACEHOLDER data. In production:
//   brands  <- Shopify collections (roster rotates, never hardcode)
//   products<- Shopify products (see lib/shopify.ts)
//   events  <- Shopify metaobjects (client edits from admin)
//   posts   <- Shopify blog articles (free CMS)
import type { Lang } from './i18n';

export type IconName = 'star' | 'fire' | 'heart' | 'smile';
export type Gradient = 'g1' | 'g2' | 'g3' | 'g4';

export interface Brand {
  handle: string;       // Shopify collection handle
  label: string;
  gradientClass: string; // bubble gradient (bg-* in globals.css)
  icon: IconName;
  logo?: string;        // bubble logo image (replaces icon; /public path or collection image URL)
}

export interface Product {
  handle: string;       // Shopify product handle -> future PDP route
  title: string;
  brand: string;        // matches Brand.handle
  price: string;        // display price, no currency suffix
  gradient: Gradient;   // card background
  icon: IconName;       // placeholder mark when no image
  iconColor: string;
  image?: string;       // Shopify featuredImage.url (replaces icon)
}

export interface EventItem {
  day: string;
  month: Record<Lang, string>;
  title: string;
  venue: Record<Lang, string>;
  chip: Record<Lang, string>;
}

export interface Post {
  icon: IconName;
  tag: string;
  title: string;
  excerpt: string;
}

// The one confirmed brand. Once Shopify is connected, getBrands() reads
// collections instead and this list is only the no-credentials fallback.
export const PLACEHOLDER_BRANDS: Brand[] = [
  { handle: 'jellycat', label: 'Jellycat ®', gradientClass: 'bg-jellycat', icon: 'fire', logo: '/brands/jellycat.png' },
];

// Empty until real events exist. Production plan: Shopify metaobjects so the
// client adds events from admin. Empty list → calendar shows "more dates soon".
export const EVENTS: EventItem[] = [];

export const POSTS: Record<Lang, Post[]> = {
  es: [
    { icon: 'fire', tag: 'en ascenso', title: 'Por qué todos quieren un Jellycat', excerpt: 'La anatomía de un fenómeno: de Londres a tu feed, y qué personajes valen la pena.' },
    { icon: 'star', tag: 'guía', title: 'Cómo detectar una imitación', excerpt: 'Señales rápidas para no caer en falsos. Spoiler: aquí no tienes que preocuparte.' },
    { icon: 'heart', tag: 'radar', title: 'Lo que viene este otoño', excerpt: 'Nuestro radar de lo próximo que se va a agotar — para que llegues primero.' },
    { icon: 'smile', tag: 'detrás', title: 'Cómo empacamos tus envíos', excerpt: 'Del sobre burbuja al rastreo: qué pasa entre tu pedido y tu puerta.' },
    { icon: 'fire', tag: 'unboxing', title: 'Unboxing: lo nuevo de XileChile', excerpt: 'Primeras impresiones de la edición que está por llegar a la tienda.' },
    { icon: 'star', tag: 'guía', title: 'Guía de series: por dónde empezar', excerpt: 'Si es tu primer coleccionable, esto es lo que hay que saber antes de comprar.' },
  ],
  en: [
    { icon: 'fire', tag: 'on the rise', title: 'Why everyone wants a Jellycat', excerpt: 'The anatomy of a phenomenon: from London to your feed, and which characters are worth it.' },
    { icon: 'star', tag: 'guide', title: 'How to spot a fake', excerpt: "Quick signals so you never get burned. Spoiler: here, you don't have to worry." },
    { icon: 'heart', tag: 'radar', title: "What's coming this fall", excerpt: 'Our radar for the next sell-outs — so you get there first.' },
    { icon: 'smile', tag: 'behind the scenes', title: 'How we pack your orders', excerpt: 'From bubble mailer to tracking: what happens between checkout and your door.' },
    { icon: 'fire', tag: 'unboxing', title: 'Unboxing: the new XileChile', excerpt: 'First impressions of the edition about to hit the store.' },
    { icon: 'star', tag: 'guide', title: 'Series guide: where to start', excerpt: "First collectible? Here's what to know before you buy." },
  ],
};
