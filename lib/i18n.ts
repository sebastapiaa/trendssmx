// lib/i18n.ts — dictionaries + routes. ES is canonical; EN mirrors it.
// Brand vocabulary ("original only", "what's hot", "viral finds", "must haves",
// "curated drops") intentionally stays in English in BOTH languages — it's the
// client's IG bio verbatim.

export type Lang = 'es' | 'en';
export type PageKey = 'home' | 'store' | 'radar' | 'cal';

export const IG_URL = 'https://www.instagram.com/trendssmx';
export const DM_URL = 'https://ig.me/m/trendssmx';

export const ROUTES: Record<Lang, Record<PageKey, string>> = {
  es: { home: '/', store: '/tienda', radar: '/radar', cal: '/calendario' },
  en: { home: '/en', store: '/en/store', radar: '/en/radar', cal: '/en/calendar' },
};

export const DICT = {
  es: {
    nav: { store: 'tienda', radar: 'radar', cal: 'calendario' },
    heroEyebrow: 'viral finds \u00a0·\u00a0 curated drops \u00a0·\u00a0 must haves',
    heroSub: 'Lo que ves en tu feed, ahora a tu alcance.',
    scroll: 'scroll',
    ticker: ['original only', 'viral finds', 'must haves', 'curated drops', 'envíos a todo méxico'],
    manifestoLabel: 'concepto',
    manifestoLead: 'No seguimos tendencias.',
    manifestoEm: 'Las curamos',
    manifestoTail: ' — y las traemos a México.',
    pillars: [
      { num: 'i.', title: 'Curaduría', body: 'Selección precisa de tendencias relevantes y con valor estético. Menos ruido, más criterio.' },
      { num: 'ii.', title: 'Actualidad', body: 'Conexión constante con lo nuevo y lo que define el momento — antes de que sea obvio.' },
    ],
    storeLabel: 'tienda',
    storeH2: "what's hot",
    storeSub: 'Explora por marca. El catálogo rota con lo que está pasando — todo 100% original.',
    storeMore: 'ver toda la tienda →',
    bubbleAll: 'todo',
    gridEmpty: 'pronto — nuevas piezas en camino',
    storeHeroTitle: 'tienda',
    storeHeroSub: 'Todo lo que está pasando, en un solo lugar — 100% original.',
    pdpBack: '← volver a la tienda',
    pdpOption: 'opción',
    pdpBuy: 'comprar',
    pdpDm: 'pedir por dm',
    pdpDmNote: 'Mándanos DM con el nombre de la pieza y te la apartamos.',
    pdpPerks: ['original only — verificado antes de enviarse', 'envíos a todo méxico', 'entrega personal en MTY'],
    origLabel: 'nuestra promesa',
    trust: [
      { icon: 'star', title: '100% originales', body: 'Cada pieza se verifica antes de llegar a ti. Cero imitaciones, cero sorpresas.' },
      { icon: 'fire', title: 'Envíos a todo México', body: 'Empaque cuidado y rastreo desde que sale hasta que llega a tu puerta.' },
      { icon: 'heart', title: 'Entrega personal en MTY', body: '¿Estás en Monterrey? Coordinamos entrega en mano, el mismo día si se puede.' },
    ],
    radarLabel: 'radar',
    radarH2: 'Lo que se mueve, explicado.',
    radarSub: 'El blog de trends mx: qué está subiendo, por qué importa y cómo conseguirlo antes de que se agote.',
    radarMore: 'ver todo el radar →',
    radarHeroTitle: 'radar',
    radarHeroSub: 'Qué está subiendo, por qué importa y cómo llegar primero.',
    calLabel: 'calendario',
    calH2: 'Próximos eventos',
    calSub: 'Activaciones y noches con las marcas — en persona, no solo en tu feed.',
    calNote: 'más fechas próximamente — síguenos para enterarte primero',
    calMore: 'ver todas las fechas →',
    calHeroTitle: 'calendario',
    calHeroSub: 'Dónde estaremos — ven a verlo en persona.',
    ctaLead: '¿Lo viste en tu feed? ',
    ctaEm: 'Lo tenemos.',
    ctaSub: 'Y si no lo tenemos, lo conseguimos. Síguenos para ver lo nuevo primero o mándanos DM directo.',
    ctaFollow: 'seguir @trendssmx',
    ctaDm: 'mandar dm',
    footBar: ['© 2026 trends mx — original only', 'trendss.mx', 'estudio ———— creativo'],
  },
  en: {
    nav: { store: 'store', radar: 'radar', cal: 'calendar' },
    heroEyebrow: 'viral finds \u00a0·\u00a0 curated drops \u00a0·\u00a0 must haves',
    heroSub: "Things you've seen, now within reach.",
    scroll: 'scroll',
    ticker: ['original only', 'viral finds', 'must haves', 'curated drops', 'shipping all over méxico'],
    manifestoLabel: 'concept',
    manifestoLead: "We don't follow trends.",
    manifestoEm: 'We curate them',
    manifestoTail: ' — and bring them to México.',
    pillars: [
      { num: 'i.', title: 'Curation', body: 'A precise selection of relevant, aesthetically worthwhile trends. Less noise, more taste.' },
      { num: 'ii.', title: 'Relevance', body: "A constant connection to what's new and what defines the moment — before it's obvious." },
    ],
    storeLabel: 'store',
    storeH2: "what's hot",
    storeSub: "Browse by brand. The catalog rotates with what's happening — everything 100% original.",
    storeMore: 'shop everything →',
    bubbleAll: 'all',
    gridEmpty: 'soon — new pieces on the way',
    storeHeroTitle: 'store',
    storeHeroSub: "Everything that's happening, in one place — 100% original.",
    pdpBack: '← back to the store',
    pdpOption: 'option',
    pdpBuy: 'buy now',
    pdpDm: 'order via dm',
    pdpDmNote: "DM us the name of the piece and we'll hold it for you.",
    pdpPerks: ['original only — verified before it ships', 'shipping all over méxico', 'hand delivery in MTY'],
    origLabel: 'our promise',
    trust: [
      { icon: 'star', title: '100% authentic', body: 'Every piece is verified before it gets to you. Zero fakes, zero surprises.' },
      { icon: 'fire', title: 'Shipping all over México', body: 'Careful packaging and tracking from our hands to your door.' },
      { icon: 'heart', title: 'Hand delivery in MTY', body: "In Monterrey? We'll coordinate personal delivery — same day when possible." },
    ],
    radarLabel: 'radar',
    radarH2: "What's moving, explained.",
    radarSub: "The trends mx blog: what's rising, why it matters, and how to get it before it sells out.",
    radarMore: 'read the radar →',
    radarHeroTitle: 'radar',
    radarHeroSub: "What's rising, why it matters, and how to get there first.",
    calLabel: 'calendar',
    calH2: 'Upcoming events',
    calSub: 'Brand nights and activations — in person, not just on your feed.',
    calNote: 'more dates soon — follow us to hear first',
    calMore: 'see all dates →',
    calHeroTitle: 'calendar',
    calHeroSub: "Where we'll be — come see it in person.",
    ctaLead: 'Saw it on your feed? ',
    ctaEm: "We've got it.",
    ctaSub: "And if we don't, we'll get it. Follow us to see what's new first, or just send us a DM.",
    ctaFollow: 'follow @trendssmx',
    ctaDm: 'send a dm',
    footBar: ['© 2026 trends mx — original only', 'trendss.mx', 'estudio ———— creativo'],
  },
} as const;

export const productPath = (lang: Lang, handle: string) => `${ROUTES[lang].store}/${handle}`;

export type Dict = (typeof DICT)[Lang];
export const other = (lang: Lang): Lang => (lang === 'es' ? 'en' : 'es');
