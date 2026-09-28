// PDP. Only reachable for in-stock products (getProduct returns null → 404
// otherwise), and only in-stock variants are offered. "Buy" posts to
// /api/checkout (Storefront cart → Shopify checkout); while Shopify's primary
// domain is this site, checkout would 404, so it falls back to IG DM.
import Image from 'next/image';
import Link from 'next/link';
import { DICT, DM_URL, ROUTES, other, productPath, type Lang } from '@/lib/i18n';
import type { Brand, ProductDetail } from '@/lib/content';
import Nav from '@/components/Nav';
import CtaIg from '@/components/CtaIg';
import Footer from '@/components/Footer';
import { Icon } from '@/components/Icons';

export default function ProductPage({
  lang,
  product: p,
  brands,
  canBuy,
}: {
  lang: Lang;
  product: ProductDetail;
  brands: Brand[];
  canBuy: boolean;
}) {
  const t = DICT[lang];
  const brandLabel = brands.find((b) => b.handle === p.brand)?.label ?? p.brand;
  const [main, ...rest] = p.images;
  const hasOptions = p.variants.length > 1 || p.variants[0].title !== '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: p.description || undefined,
    image: p.images.map((i) => i.url),
    brand: { '@type': 'Brand', name: brandLabel },
    offers: p.variants.map((v) => ({
      '@type': 'Offer',
      price: v.amount,
      priceCurrency: v.currency,
      availability: 'https://schema.org/InStock',
      url: `https://trendss.mx${productPath(lang, p.handle)}`,
    })),
  };

  return (
    <>
      <Nav lang={lang} active="store" solid altHref={productPath(other(lang), p.handle)} />
      <section className="pdp">
        <div className="container pdp-grid">
          <div className="pdp-gallery">
            <div className={`pdp-main ${p.gradient}`}>
              <div className="card-circle">
                {main ? (
                  <Image src={main.url} alt={main.alt} fill priority sizes="(max-width: 860px) 60vw, 380px" />
                ) : (
                  <Icon name={p.icon} fill={p.iconColor} />
                )}
              </div>
            </div>
            {rest.length > 0 && (
              <div className="pdp-thumbs">
                {rest.map((img) => (
                  <div key={img.url} className="pdp-thumb">
                    <Image src={img.url} alt={img.alt} fill sizes="(max-width: 860px) 45vw, 280px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pdp-info">
            <p className="section-label">{brandLabel}</p>
            <h1>{p.title}</h1>
            <p className="pdp-price">
              {p.price} <small>mxn</small>
            </p>
            {p.description && <p className="pdp-desc">{p.description}</p>}

            {canBuy ? (
              <form className="pdp-buy" action="/api/checkout" method="post">
                <input type="hidden" name="back" value={productPath(lang, p.handle)} />
                {hasOptions ? (
                  <label className="pdp-option">
                    <span>{t.pdpOption}</span>
                    <select name="variant" defaultValue={p.variants[0].id}>
                      {p.variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.title} — {v.price} mxn
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <input type="hidden" name="variant" value={p.variants[0].id} />
                )}
                <button type="submit" className="pdp-cta">
                  {t.pdpBuy}
                </button>
              </form>
            ) : (
              <div className="pdp-buy">
                <a className="pdp-cta" href={DM_URL} target="_blank" rel="noopener noreferrer">
                  {t.pdpDm}
                </a>
                <p className="pdp-note">{t.pdpDmNote}</p>
              </div>
            )}

            <ul className="pdp-perks">
              {t.pdpPerks.map((perk, i) => (
                <li key={perk}>
                  <Icon name={(['star', 'fire', 'heart'] as const)[i % 3]} />
                  {perk}
                </li>
              ))}
            </ul>

            <Link className="more-link" href={ROUTES[lang].store}>
              {t.pdpBack}
            </Link>
          </div>
        </div>
      </section>
      <CtaIg lang={lang} />
      <Footer lang={lang} />
      <script
        type="application/ld+json"
        // JSON.stringify output with '<' escaped can't break out of the tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
