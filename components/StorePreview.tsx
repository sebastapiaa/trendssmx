// Landing store preview: bubbles deep-link to the store pre-filtered
// (?brand=<collection handle>), grid shows the first 4 products.
import Link from 'next/link';
import { DICT, ROUTES, productPath, type Lang } from '@/lib/i18n';
import type { Brand, Product } from '@/lib/content';
import { Icon } from './Icons';
import ProductCard from './ProductCard';

export default function StorePreview({
  lang,
  brands,
  products,
}: {
  lang: Lang;
  brands: Brand[];
  products: Product[];
}) {
  const t = DICT[lang];
  const storePath = ROUTES[lang].store;
  return (
    <section className="hot" id="tienda">
      <div className="container">
        <p className="section-label reveal">{t.storeLabel}</p>
        <div className="hot-head">
          <h2 className="reveal d1">{t.storeH2}</h2>
          <p className="reveal d2">{t.storeSub}</p>
        </div>
      </div>
      <div className="container">
        <div className="bubbles reveal">
          <Link className="bubble" href={storePath}>
            <div className="bubble-circle bg-all">
              <Icon name="star" />
            </div>
            <span>{t.bubbleAll}</span>
          </Link>
          {brands.map((b) => (
            <Link key={b.handle} className="bubble" href={`${storePath}?brand=${b.handle}`}>
              <div className={`bubble-circle ${b.gradientClass}`}>
                {b.logo ? <img src={b.logo} alt="" /> : <Icon name={b.icon} />}
              </div>
              <span>{b.label}</span>
            </Link>
          ))}
        </div>
        <div className="shop-grid">
          {products.slice(0, 4).map((p, i) => (
            <ProductCard key={p.handle} product={p} href={productPath(lang, p.handle)} revealClass={`reveal${i ? ` d${i}` : ''}`} />
          ))}
        </div>
        <Link className="more-link reveal" href={storePath}>
          {t.storeMore}
        </Link>
      </div>
    </section>
  );
}
