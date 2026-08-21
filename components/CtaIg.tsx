import { DICT, DM_URL, IG_URL, type Lang } from '@/lib/i18n';

export default function CtaIg({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <section className="cta" id="siguenos">
      <div className="cta-bg" aria-hidden="true" />
      <div className="cta-inner">
        <h2 className="reveal">
          {t.ctaLead}
          <em>{t.ctaEm}</em>
        </h2>
        <p className="reveal d1">{t.ctaSub}</p>
        <div className="cta-actions reveal d2">
          <a className="cta-primary" href={IG_URL} target="_blank" rel="noopener noreferrer">
            {t.ctaFollow}
          </a>
          <a className="cta-ghost" href={DM_URL} target="_blank" rel="noopener noreferrer">
            {t.ctaDm}
          </a>
        </div>
      </div>
    </section>
  );
}
