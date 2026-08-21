import { DICT, type Lang } from '@/lib/i18n';
import type { Brand, Product } from '@/lib/content';
import Nav from '@/components/Nav';
import PageHero from '@/components/PageHero';
import Ticker from '@/components/Ticker';
import StoreFilter from '@/components/StoreFilter';
import CtaIg from '@/components/CtaIg';
import Footer from '@/components/Footer';

export default function StorePage({
  lang,
  brands,
  products,
}: {
  lang: Lang;
  brands: Brand[];
  products: Product[];
}) {
  const t = DICT[lang];
  return (
    <>
      <Nav lang={lang} active="store" solid />
      <PageHero title={t.storeHeroTitle} sub={t.storeHeroSub} />
      <Ticker lang={lang} />
      <StoreFilter lang={lang} brands={brands} products={products} />
      <CtaIg lang={lang} />
      <Footer lang={lang} />
    </>
  );
}
