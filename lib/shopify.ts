// lib/shopify.ts — Storefront API client.
// Works WITHOUT credentials (returns placeholder data) so the site runs on
// first clone. Set SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN in
// .env.local to go live. Bump API_VERSION quarterly.
import {
  PLACEHOLDER_BRANDS,
  type Brand,
  type Gradient,
  type IconName,
  type Product,
} from './content';

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = '2025-07';

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
      next: { revalidate: 300 }, // ISR: refresh catalog every 5 min
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

// ---------------------------------------------------------------------------
// Brands = Shopify collections. The roster rotates, so bubbles are generated,
// never hardcoded. Convention: one collection per brand; bubble gradient can
// later come from a collection metafield instead of cycling.
// ---------------------------------------------------------------------------
interface CollectionsRes {
  collections: {
    edges: Array<{ node: { handle: string; title: string; image: { url: string } | null } }>;
  };
}

// Local bubble logos for brands whose Shopify collection has no image set.
const LOCAL_LOGOS: Record<string, string> = {
  jellycat: '/brands/jellycat.png',
};

export async function getBrands(): Promise<Brand[]> {
  const data = await storefront<CollectionsRes>(/* GraphQL */ `
    { collections(first: 10, sortKey: TITLE) { edges { node { handle title image { url } } } } }
  `);
  // 'frontpage' is Shopify's built-in Home page collection, never a brand
  const edges = data?.collections.edges.filter(({ node }) => node.handle !== 'frontpage') ?? [];
  if (edges.length === 0) return PLACEHOLDER_BRANDS;
  return edges.map(({ node }, i) => ({
    handle: node.handle,
    label: node.title,
    gradientClass: BUBBLE_GRADIENTS[i % BUBBLE_GRADIENTS.length],
    icon: BUBBLE_ICONS[i % BUBBLE_ICONS.length],
    logo: node.image?.url ?? LOCAL_LOGOS[node.handle],
  }));
}

// ---------------------------------------------------------------------------
// Products. `brand` is derived from the vendor field, slugified — keep vendor
// names aligned with collection handles in Shopify admin so the bubble filter
// matches (small catalog, easy convention). Alternative: query per-collection.
// ---------------------------------------------------------------------------
interface ProductsRes {
  products: {
    edges: Array<{
      node: {
        handle: string;
        title: string;
        vendor: string;
        featuredImage: { url: string; altText: string | null } | null;
        priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
        collections: { edges: Array<{ node: { handle: string } }> };
      };
    }>;
  };
}

const slug = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-');

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

export async function getProducts(): Promise<Product[]> {
  const data = await storefront<ProductsRes>(/* GraphQL */ `
    {
      products(first: 24, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            handle
            title
            vendor
            featuredImage { url altText }
            priceRange { minVariantPrice { amount currencyCode } }
            collections(first: 5) { edges { node { handle } } }
          }
        }
      }
    }
  `);
  // No placeholder fallback: products come only from Shopify. Empty until
  // credentials are set — the store shows its "coming soon" empty state.
  if (!data || data.products.edges.length === 0) return [];
  return data.products.edges.map(({ node }, i) => {
    const [icon, iconColor] = ICONS[i % ICONS.length];
    // brand = the product's real collection membership (first non-frontpage
    // collection), so the bubble filter works no matter what vendor says;
    // vendor slug is only a fallback for products not in any collection.
    const brand =
      node.collections.edges.map((e) => e.node.handle).find((h) => h !== 'frontpage') ??
      slug(node.vendor);
    return {
      handle: node.handle,
      title: node.title,
      brand,
      price: formatPrice(
        node.priceRange.minVariantPrice.amount,
        node.priceRange.minVariantPrice.currencyCode,
      ),
      gradient: GRADIENTS[i % GRADIENTS.length],
      icon,
      iconColor,
      image: node.featuredImage?.url,
    };
  });
}
