import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPage from '@/components/pages/ProductPage';
import { checkoutEnabled, getBrands, getProduct, getProducts } from '@/lib/shopify';

// ISR like the store. Sold-out products 404 on the next revalidation.
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ handle: p.handle }));
}

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const p = await getProduct(handle);
  if (!p) return {};
  return {
    title: `${p.title} — trends mx`,
    description: p.description || `${p.title} — original only.`,
    alternates: { canonical: `/tienda/${handle}`, languages: { en: `/en/store/${handle}` } },
    openGraph: p.image ? { images: [{ url: p.image, alt: p.title }] } : undefined,
  };
}

export default async function Page({ params }: Props) {
  const { handle } = await params;
  const [product, brands, canBuy] = await Promise.all([getProduct(handle), getBrands(), checkoutEnabled()]);
  if (!product) notFound();
  return <ProductPage lang="es" product={product} brands={brands} canBuy={canBuy} />;
}
