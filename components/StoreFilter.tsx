'use client';
// Store page: brand bubbles filter the grid. The full grid is server-rendered
// (SEO + instant paint); deep links (?brand=<collection handle>) from the
// landing bubbles are applied after mount so the route stays static/ISR.
import { useEffect, useMemo, useState } from 'react';
import { DICT, productPath, type Lang } from '@/lib/i18n';
import type { Brand, Product } from '@/lib/content';
import { Icon } from './Icons';
import ProductCard from './ProductCard';

export default function StoreFilter({
  lang,
  brands,
  products,
}: {
  lang: Lang;
  brands: Brand[];
  products: Product[];
}) {
  const t = DICT[lang];
  const [active, setActive] = useState('all');

  // apply ?brand= deep link once, client-side, without making the route dynamic
  useEffect(() => {
    const b = new URLSearchParams(window.location.search).get('brand');
    if (!b || !brands.some((x) => x.handle === b)) return;
    setActive(b);
    // mobile: bubbles are a horizontal scroll row — center the selected one
    // so the active filter is visible (scroll the row only, never the page)
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>('.bubble.active');
      const row = el?.closest<HTMLElement>('.bubbles');
      if (!el || !row || row.scrollWidth <= row.clientWidth) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      row.scrollTo({
        left: el.offsetLeft - row.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2,
        behavior: reduced ? 'auto' : 'smooth',
      });
    });
  }, [brands]);

  const shown = useMemo(
    () => (active === 'all' ? products : products.filter((p) => p.brand === active)),
    [active, products],
  );

  const bubble = (key: string, label: string, gradientClass: string, icon: Brand['icon'], logo?: string) => (
    <button
      key={key}
      type="button"
      className={`bubble${active === key ? ' active' : ''}`}
      role="tab"
      aria-selected={active === key}
      onClick={() => setActive(key)}
    >
      <div className={`bubble-circle ${gradientClass}`}>
        {logo ? <img src={logo} alt="" /> : <Icon name={icon} />}
      </div>
      <span>{label}</span>
    </button>
  );

  return (
    <section className="hot" id="tienda">
      <div className="container">
        <div className="bubbles" data-mode="filter" role="tablist" aria-label="Brand filter">
          {bubble('all', t.bubbleAll, 'bg-all', 'star')}
          {brands.map((b) => bubble(b.handle, b.label, b.gradientClass, b.icon, b.logo))}
        </div>
        {/* key={active} remounts the grid so cards replay their entrance animation */}
        <div className="shop-grid" key={active}>
          {shown.map((p, i) => (
            <ProductCard key={p.handle} product={p} href={productPath(lang, p.handle)} delay={i * 0.05} />
          ))}
        </div>
        {shown.length === 0 && (
          <p className="grid-empty" style={{ display: 'block' }}>
            {t.gridEmpty}
          </p>
        )}
      </div>
    </section>
  );
}
