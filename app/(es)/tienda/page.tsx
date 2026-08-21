import type { Metadata } from 'next';
import StorePage from '@/components/pages/StorePage';
import { getBrands, getProducts } from '@/lib/shopify';

export const revalidate = 300;
export const metadata: Metadata = {
  title: 'tienda — trends mx',
  alternates: { canonical: '/tienda', languages: { en: '/en/store' } },
};

export default async function Page() {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  return <StorePage lang="es" brands={brands} products={products} />;
}
