import type { Metadata } from 'next';
import StorePage from '@/components/pages/StorePage';
import { getBrands, getProducts } from '@/lib/shopify';

export const revalidate = 300;
export const metadata: Metadata = {
  title: 'store — trends mx',
  alternates: { canonical: '/en/store', languages: { es: '/tienda' } },
};

export default async function Page() {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  return <StorePage lang="en" brands={brands} products={products} />;
}
