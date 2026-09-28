// SHOPIFY MAPPING: title -> .card-name, price -> .price-pill,
// featuredImage -> <Image> in .card-circle (replaces the placeholder icon),
// handle -> PDP route (/tienda/[handle] · /en/store/[handle]).
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/content';
import { Icon } from './Icons';

export default function ProductCard({
  product,
  href,
  revealClass,
  delay,
}: {
  product: Product;
  href: string;
  revealClass?: string;
  delay?: number;
}) {
  const p = product;
  return (
    <Link
      href={href}
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
          <Image src={p.image} alt={p.title} fill sizes="(max-width: 560px) 32vw, 220px" />
        ) : (
          <Icon name={p.icon} fill={p.iconColor} />
        )}
      </div>
      <div className="price-pill">
        {p.price} <small>mxn</small>
      </div>
    </Link>
  );
}
