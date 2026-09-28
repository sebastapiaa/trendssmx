// lib/shopify.ts — Storefront API client.
// Works WITHOUT credentials (returns placeholder data) so the site runs on
// first clone. Set SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN in
// .env.local to go live. Bump API_VERSION quarterly.
//
// STOCK RULE: the site only ever shows what can be bought. Sold-out products
// are filtered out of every list, their PDPs 404, and sold-out variants are
// never offered. Requires "Track quantity" on + "Continue selling when out of
// stock" off in Shopify admin (otherwise Shopify reports them as available).
import {
  PLACEHOLDER_BRANDS,
  type Brand,
  type Gradient,
  type IconName,
  type Product,
  type ProductDetail,
} from './content';

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = '2025-07';
// This site's own host. Shopify builds checkout URLs on the store's primary
// domain; if that's this host, checkout would land on our 404 (see
// checkoutEnabled).
const SITE_HOST = 'trendss.mx';

const GRADIENTS: Gradient[] = ['g1', 'g2', 'g3', 'g4'];
const ICONS: Array<[IconName, string]> = [
  ['heart', '#f6a0c1'],
  ['fire', '#2d77e3'],
  ['star', '#f7a941'],
  ['smile', '#97cded'],
];
const BUBBLE_GRADIENTS = ['bg-jellycat', 'bg-xilechile', 'bg-rhode', 'bg-all'];
const BUBBLE_ICONS: IconName[] = ['fire', 'heart', 'smile', 'star'];

export async function storefront<T>(
  query: string,
  variables?: Record<string, unknown>,
  { fresh = false }: { fresh?: boolean } = {},
): Promise<T | null> {
  if (!DOMAIN || !TOKEN) return null;
  try {
    const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      // ISR: refresh catalog every 5 min. Mutations (cart) must never cache.
      ...(fresh ? { cache: 'no-store' as const } : { next: { revalidate: 300 } }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T; errors?: unknown };
    if (json.errors) {
      console.error('[shopify] GraphQL errors:', JSON.stringify(json.errors));
      return null;
    }
    return json.data ?? null;
  } catch (err) {
    console.error('[shopify] fetch failed:', err);
    return null;
  }
}

const normHost = (h: string) => h.toLowerCase().replace(/^www\./, '');

// ---------------------------------------------------------------------------
// Brands = Shopify collections. The roster rotates, so bubbles are generated,
// never hardcoded.
//
// Which collections count as brands: if ANY collection has the metafield
// custom.brand = true (Boolean, Storefront access on), only those are brands —
// so "New arrivals" / "Sale" collections never become bubbles. With no
// collection flagged, every collection except 'frontpage' is a brand.
// Brands with nothing in stock are hidden.
// ---------------------------------------------------------------------------
interface CollectionsRes {
  collections: {
    edges: Array<{
      node: {
        handle: string;
        title: string;
        image: { url: string } | null;
        brand: { value: string } | null;
        products: { edges: Array<{ node: { id: string } }> };
      };
    }>;
  };
}

// Local bubble logos for brands whose Shopify collection has no image set.
const LOCAL_LOGOS: Record<string, string> = {
  jellycat: '/brands/jellycat.png',
};

async function brandCollections() {
  const data = await storefront<CollectionsRes>(/* GraphQL */ `
    {
      collections(first: 250, sortKey: TITLE) {
        edges {
          node {
            handle
            title
            image { url }
            brand: metafield(namespace: "custom", key: "brand") { value }
            products(first: 1, filters: [{ available: true }]) { edges { node { id } } }
          }
        }
      }
    }
  `);
  if (!data) return null;
  // 'frontpage' is Shopify's built-in Home page collection, never a brand
  const all = data.collections.edges.map((e) => e.node).filter((n) => n.handle !== 'frontpage');
  const flagged = all.filter((n) => n.brand?.value === 'true');
  return flagged.length > 0 ? flagged : all;
}

export async function getBrands(): Promise<Brand[]> {
  const cols = await brandCollections();
  if (!cols) return PLACEHOLDER_BRANDS;
  return cols
    .filter((n) => n.products.edges.length > 0)
    .map((node, i) => ({
      handle: node.handle,
      label: node.title,
      gradientClass: BUBBLE_GRADIENTS[i % BUBBLE_GRADIENTS.length],
      icon: BUBBLE_ICONS[i % BUBBLE_ICONS.length],
      logo: node.image?.url ?? LOCAL_LOGOS[node.handle],
    }));
}

// ---------------------------------------------------------------------------
// Products. `brand` = the product's first collection that is a brand (see
// above), so non-brand collections can't steal it. Vendor slug is only a
// fallback for products in no brand collection.
// ---------------------------------------------------------------------------
interface ProductNode {
  handle: string;
  title: string;
  vendor: string;
  availableForSale: boolean;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  collections: { edges: Array<{ node: { handle: string } }> };
}

interface ProductsRes {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: Array<{ node: ProductNode }>;
  };
}

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function formatPrice(amount: string, currency: string): string {
  const n = Number(amount);
  const formatted = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
  // card renders its own lowercase "mxn" suffix
  return formatted.replace(/\s?MXN$/i, '').trim();
}

function brandOf(node: Pick<ProductNode, 'vendor' | 'collections'>, brandHandles: Set<string>) {
  return (
    node.collections.edges.map((e) => e.node.handle).find((h) => brandHandles.has(h)) ??
    slug(node.vendor)
  );
}

// Card look (gradient + placeholder icon). Grids cycle by position so
// neighbours differ; the PDP derives a stable index from the handle.
function lookOf(i: number) {
  const [icon, iconColor] = ICONS[i % ICONS.length];
  return { gradient: GRADIENTS[i % GRADIENTS.length], icon, iconColor };
}
const handleIndex = (handle: string) =>
  [...handle].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($after: String) {
    products(
      first: 250
      after: $after
      sortKey: CREATED_AT
      reverse: true
      query: "available_for_sale:true"
    ) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          handle
          title
          vendor
          availableForSale
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
          collections(first: 20) { edges { node { handle } } }
        }
      }
    }
  }
`;

export async function getProducts(): Promise<Product[]> {
  // No placeholder fallback: products come only from Shopify. Empty until
  // credentials are set — the store shows its "coming soon" empty state.
  const nodes: ProductNode[] = [];
  let after: string | null = null;
  // whole catalog, 250 per page (cap of 20 pages is only a runaway guard)
  for (let page = 0; page < 20; page++) {
    const data: ProductsRes | null = await storefront<ProductsRes>(PRODUCTS_QUERY, { after });
    if (!data) break;
    nodes.push(...data.products.edges.map((e) => e.node));
    if (!data.products.pageInfo.hasNextPage) break;
    after = data.products.pageInfo.endCursor;
  }
  if (nodes.length === 0) return [];
  const brandHandles = new Set((await brandCollections())?.map((c) => c.handle));
  // In stock only. The query filter does the work server-side; this re-check
  // guards against search-index lag right after a product sells out.
  return nodes
    .filter((node) => node.availableForSale)
    .map((node, i) => ({
      handle: node.handle,
      title: node.title,
      brand: brandOf(node, brandHandles),
      price: formatPrice(
        node.priceRange.minVariantPrice.amount,
        node.priceRange.minVariantPrice.currencyCode,
      ),
      ...lookOf(i),
      image: node.featuredImage?.url,
    }));
}

// ---------------------------------------------------------------------------
// PDP. Returns null (→ 404) when the product doesn't exist OR is sold out.
// Only variants that can be bought are returned.
// ---------------------------------------------------------------------------
interface ProductRes {
  product:
    | (Omit<ProductNode, 'priceRange' | 'featuredImage'> & {
        description: string;
        images: { edges: Array<{ node: { url: string; altText: string | null; width: number; height: number } }> };
        variants: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              availableForSale: boolean;
              price: { amount: string; currencyCode: string };
            };
          }>;
        };
      })
    | null;
}

export async function getProduct(handle: string): Promise<ProductDetail | null> {
  const data = await storefront<ProductRes>(
    /* GraphQL */ `
      query Product($handle: String!) {
        product(handle: $handle) {
          handle
          title
          vendor
          availableForSale
          description
          images(first: 10) { edges { node { url altText width height } } }
          variants(first: 100) {
            edges { node { id title availableForSale price { amount currencyCode } } }
          }
          collections(first: 20) { edges { node { handle } } }
        }
      }
    `,
    { handle },
  );
  const p = data?.product;
  if (!p || !p.availableForSale) return null;
  const variants = p.variants.edges
    .map((e) => e.node)
    .filter((v) => v.availableForSale)
    .map((v) => ({
      id: v.id,
      // Shopify's placeholder name for products without options
      title: v.title === 'Default Title' ? '' : v.title,
      price: formatPrice(v.price.amount, v.price.currencyCode),
      amount: v.price.amount,
      currency: v.price.currencyCode,
    }));
  if (variants.length === 0) return null;
  const brandHandles = new Set((await brandCollections())?.map((c) => c.handle));
  const images = p.images.edges.map((e) => e.node);
  return {
    handle: p.handle,
    title: p.title,
    brand: brandOf(p, brandHandles),
    price: variants[0].price,
    ...lookOf(handleIndex(p.handle)),
    image: images[0]?.url,
    images: images.map((i) => ({ url: i.url, alt: i.altText ?? p.title, width: i.width, height: i.height })),
    description: p.description,
    variants,
  };
}

// ---------------------------------------------------------------------------
// Checkout. Shopify builds checkout URLs on the store's PRIMARY domain. While
// that primary domain is this site (trendss.mx → Vercel), every checkout URL
// 404s here, so the PDP shows "order via DM" instead of "buy". Fix in Shopify
// admin → Settings → Domains: connect e.g. shop.trendss.mx and make it
// primary. The buy button then turns on by itself within 5 minutes.
// ---------------------------------------------------------------------------
interface ShopRes {
  shop: { primaryDomain: { host: string } };
}

export async function checkoutEnabled(): Promise<boolean> {
  const data = await storefront<ShopRes>(`{ shop { primaryDomain { host } } }`);
  return !!data && normHost(data.shop.primaryDomain.host) !== SITE_HOST;
}

interface CartCreateRes {
  cartCreate: {
    cart: { checkoutUrl: string; lines: { edges: Array<{ node: { id: string } }> } } | null;
    userErrors: Array<{ message: string }>;
  };
}

/** Creates a one-line cart and returns its Shopify checkout URL, or null if
 *  the variant can't be bought (sold out, bad id) or checkout would 404. */
export async function createCheckout(variantId: string, quantity = 1): Promise<string | null> {
  const data = await storefront<CartCreateRes>(
    /* GraphQL */ `
      mutation CartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart { checkoutUrl lines(first: 1) { edges { node { id } } } }
          userErrors { message }
        }
      }
    `,
    { lines: [{ merchandiseId: variantId, quantity }] },
    { fresh: true },
  );
  const cart = data?.cartCreate.cart;
  if (!cart || cart.lines.edges.length === 0) {
    if (data?.cartCreate.userErrors.length) {
      console.error('[shopify] cartCreate:', JSON.stringify(data.cartCreate.userErrors));
    }
    return null;
  }
  const url = new URL(cart.checkoutUrl);
  if (normHost(url.host) === SITE_HOST) return null;
  return url.toString();
}
