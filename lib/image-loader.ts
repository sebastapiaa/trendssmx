// next/image loader (next.config images.loaderFile). Shopify's CDN resizes
// on the fly via ?width=, so product images skip Vercel's optimizer (no
// quota, no extra hop). Anything else is served as-is.
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith('https://cdn.shopify.com/')) return src;
  const url = new URL(src);
  url.searchParams.set('width', String(width));
  return url.toString();
}
