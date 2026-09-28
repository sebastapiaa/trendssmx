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
app/(es)/…                ES routes: / /tienda /tienda/[handle] /radar /calendario
app/(en)/en/…             EN routes: /en /en/store /en/store/[handle] /en/radar /en/calendar
app/api/checkout          POST (form) → Storefront cartCreate → 303 to Shopify checkout
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
lib/shopify.ts            Storefront client (ISR 5 min), getBrands/getProducts/
                          getProduct/checkoutEnabled/createCheckout; falls back
                          to placeholders when env is missing
lib/image-loader.ts       next/image loader → Shopify CDN ?width= (no Vercel optimizer)
```

Key behaviors already wired:
- Landing bubbles are `<Link>`s to `/tienda?brand=<handle>`; the store page
  applies that filter after mount (see StoreFilter) so the route stays
  static/ISR and the FULL grid is in the server HTML. Do not "fix" this by
  switching to `useSearchParams` during render — that CSR-bails the grid out
  of the prerendered HTML (verified) and hurts SEO.
- Store/landing/PDP pages: `export const revalidate = 300` (ISR).
- **In-stock only (client requirement).** Sold-out products never appear in
  any list, their PDPs 404, sold-out variants are never offered. Relies on
  Shopify "Track quantity" on + "Continue selling when out of stock" off.
- Brands: if any collection has metafield `custom.brand` = true (Boolean,
  Storefront access), only flagged collections are brands; otherwise all
  collections except `frontpage`. Brands with nothing in stock are hidden.
  A product's brand = its first brand collection (vendor slug = fallback;
  vendor is currently "Trends MX" on everything, so collections are what count).
- Checkout: Shopify builds checkout URLs on the store's PRIMARY domain. While
  that is trendss.mx (= this Vercel site) checkout 404s, so `checkoutEnabled()`
  is false and the PDP shows "order via DM" instead of "buy". Fix in Shopify
  admin → Domains: make a subdomain (e.g. shop.trendss.mx) primary — the buy
  button then turns on by itself within 5 min. Live on Vercel (www.trendss.mx);
  pushing main deploys.
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
- Product images: cards/PDP use next/image with Shopify images; an emoji-style
  SVG shows only when a product has no image.

## Roadmap (rough order)

Done: Shopify collections, PDP, buy-now checkout (pending the primary-domain
fix above), in-stock filtering, full-catalog pagination. Deployed on Vercel.

1. Multi-item cart (Storefront Cart API; buy button is single-item today).
2. Radar: swap POSTS for Shopify blog `articles` query (free CMS — client
   writes posts from Shopify admin).
3. Calendario: Shopify metaobjects (`event`: date, title, venue, city, brand
   ref, link) so the client edits events without code.
4. Shipping config (Shopify admin): local-delivery method or a shipping
   profile scoped to Nuevo León zips for MTY hand-delivery, otherwise
   checkout quotes courier rates to local buyers.

## Conventions

- Nav labels lowercase; serif for display, sans for UI text.
- Every section: `.section-label` eyebrow → serif heading → content.
- New copy goes in `lib/i18n.ts` (both languages), never inline in components.
- Spanish is canonical; EN mirrors it.
