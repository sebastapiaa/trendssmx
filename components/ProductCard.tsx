// SHOPIFY MAPPING: title -> .card-name, price -> .price-pill,
// featuredImage -> <img> in .card-circle (replaces the placeholder icon),
// handle -> future PDP route (/tienda/[handle]).
import type { Product } from '@/lib/content';
import { Icon } from './Icons';

export default function ProductCard({
  product,
  revealClass,
  delay,
}: {
  product: Product;
  revealClass?: string;
  delay?: number;
}) {
  const p = product;
  return (
    <article
      className={`card${revealClass ? ` ${revealClass}` : ''}`}
      data-brand={p.brand}
      data-shopify-handle={p.handle}
      style={delay !== undefined ? { animationDelay: `${delay}s` } : undefined}
    >
      <div className={`card-bg ${p.gradient}`} />
      <div className="card-grid" />
      <div className="card-top">
        <div className="card-brand-logo">
          trends<sup>mx</sup>
        </div>
        <div className="card-name">
          <span>{p.title}</span>
        </div>
      </div>
      <div className="card-circle">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- swap to next/image once real assets land
          <img src={p.image} alt={p.title} />
        ) : (
          <Icon name={p.icon} fill={p.iconColor} />
        )}
      </div>
      <div className="price-pill">
        {p.price} <small>mxn</small>
      </div>
    </article>
  );
}
