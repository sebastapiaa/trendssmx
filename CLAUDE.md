# trends mx — website (Next.js)

Bilingual (ES/EN) landing site + Shopify-connected store for **trends mx**
(@trendssmx · trendss.mx), a Monterrey-based reseller of trending/viral
products (Jellycat, XileChile, rhode — the roster rotates). Built by TSM
Advisory Group. Design follows the Neso brandbook exactly.

## Stack & commands

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 (available, but
the design system lives in `app/globals.css` as custom CSS) · Shopify
Storefront API with placeholder fallback.

```bash
npm install
npm run dev     # http://localhost:3000 (ES) · /en (EN)
npm run build   # verified green
```

Shopify: `cp .env.example .env.local`, fill `SHOPIFY_STORE_DOMAIN` +
`SHOPIFY_STOREFRONT_ACCESS_TOKEN`. Without env vars the site renders
placeholder data — everything still works.

## Architecture

```
app/(es)/…                ES routes: / /tienda /radar /calendario
app/(en)/en/…             EN routes: /en /en/store /en/radar /en/calendar
                          (two route groups = two root layouts = correct
                          <html lang> per language; localized slugs on purpose)
app/globals.css           ALL design tokens + components. The design system.
components/pages/*        page assemblies (Landing/Store/Radar/Calendar)
components/*              sections. Server components except:
  ScrollFX.tsx            'use client' — nav frosting, progress bar, hero
                          parallax, .reveal IntersectionObserver (re-runs on
                          route change via usePathname)
  StoreFilter.tsx         'use client' — brand-bubble filtering with state
lib/i18n.ts               DICT (es/en) + ROUTES. ES is canonical.
lib/content.ts            placeholder brands/products/events/posts + types
lib/shopify.ts            Storefront client (ISR 5 min), getBrands/getProducts,
                          falls back to placeholders when env is missing
```

Key behaviors already wired:
- Landing bubbles are `<Link>`s to `/tienda?brand=<handle>`; the store page
  applies that filter after mount (see StoreFilter) so the route stays
  static/ISR and the FULL grid is in the server HTML. Do not "fix" this by
  switching to `useSearchParams` during render — that CSR-bails the grid out
  of the prerendered HTML (verified) and hurts SEO.
- Store/landing pages: `export const revalidate = 300` (ISR).
- Reveal animations: put `reveal` (+ `d1–d3` stagger) classes on elements;
  ScrollFX observes them. `prefers-reduced-motion` handled globally in CSS.
- Subpage nav = `solid` prop (always frosted); landing nav frosts after hero.

## Brand rules (Neso brandbook — do not violate)

Colors (CSS vars in globals.css): Gris volcánico `#373536` (text/dark
sections), Mandarina `#f7a941`, Azul celeste `#97cded`, Rosa bajo `#f6a0c1`,
Azul cobalto `#2d77e3`, Hueso `#f7f7f7` (background).

Typography: **Times** (serif) display, **Nimbus Sans** body — implemented as
`"Times New Roman"` + Helvetica/Arial stack (Nimbus Sans is a Helvetica
clone). Logotype = lowercase serif `trends` + sans superscript `mx`. Never
stretch it, never change element proportions, never add shadows/3D/effects.

Graphic language: brand gradients (cobalto→rosa→mandarina), photocopy grain
(the fixed `.grain` overlay), emoji-style icons (smiley/flame/star/heart —
`components/Icons.tsx`).

Voice: brand vocabulary stays in English in BOTH languages ("original only",
"viral finds", "must haves", "curated drops", "what's hot") — it's the IG bio
verbatim. Sentences translate. Taglines: EN "Things you've seen, now within
reach." / ES "Lo que ves en tu feed, ahora a tu alcance."

## Business facts (from the client)

- Online-only reseller. Sells via this site, Instagram (@trendssmx), and DMs.
- Ships all of Mexico; hand-delivers personally in Monterrey.
- **Original-only guarantee is the core trust message** (Jellycat fakes are
  rampant). Keep it prominent — it has its own gradient band section.
- Standing catalog, no drop schedule (may change).
- Brand roster rotates → bubbles come from `getBrands()` (Shopify
  collections). Never hardcode brands in components.
- No newsletter. Conversion: Shopify checkout + IG follow/DM (ig.me link).
- He sponsors/hosts brand events at clubs in MTY → calendario.

## Placeholder data (replace with real)

- `lib/content.ts`: EVENTS (dates/venues invented), POSTS (plausible but
  unwritten). Products have NO placeholder fallback — getProducts() returns []
  until Shopify credentials are set (store shows its empty state). Brands
  fallback = Jellycat only.
- Product images: cards show an emoji-style SVG until `product.image` exists
  (Shopify `featuredImage.url` — already mapped in lib/shopify.ts; swap
  `<img>` for `next/image`, remotePatterns for cdn.shopify.com already set)

## Roadmap (rough order)

1. Real Shopify store: create collections per brand; convention — product
   `vendor` slug must match its collection handle (that's how the filter
   matches; small catalog, easy). Or refactor getProducts to query
   per-collection.
2. PDP: `app/(es)/tienda/[handle]/page.tsx` (+ EN mirror) using
   `productByHandle` query; ProductCard already carries the handle.
3. Cart/checkout: Storefront Cart API; v1 shortcut = deep-link
   `https://{shop}.myshopify.com/cart/{variantId}:1` straight to checkout.
4. Radar: swap POSTS for Shopify blog `articles` query (free CMS — client
   writes posts from Shopify admin).
5. Calendario: Shopify metaobjects (`event`: date, title, venue, city, brand
   ref, link) so the client edits events without code.
6. Shipping config (do early in Shopify admin): local-delivery method or a
   shipping profile scoped to Nuevo León zips for MTY hand-delivery,
   otherwise checkout quotes courier rates to local buyers.
7. Deploy: Vercel or Railway (TSM already deploys Next.js on Railway).

## Conventions

- Nav labels lowercase; serif for display, sans for UI text.
- Every section: `.section-label` eyebrow → serif heading → content.
- New copy goes in `lib/i18n.ts` (both languages), never inline in components.
- Spanish is canonical; EN mirrors it.
