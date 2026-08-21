// Events. PLACEHOLDER dates/venues — production: Shopify metaobjects so the
// client edits events from Shopify admin without touching code.
import Link from 'next/link';
import { DICT, ROUTES, type Lang } from '@/lib/i18n';
import { EVENTS } from '@/lib/content';

export default function CalSection({ lang, full = false }: { lang: Lang; full?: boolean }) {
  const t = DICT[lang];
  const events = full ? EVENTS : EVENTS.slice(0, 2);
  return (
    <section className="cal" id="calendario">
      <div className="container">
        <p className="section-label reveal">{t.calLabel}</p>
        <div className="cal-head">
          <h2 className="reveal d1">{t.calH2}</h2>
          <p className="reveal d2">{t.calSub}</p>
        </div>
        {events.length > 0 && (
          <div className="cal-list reveal">
            {events.map((e) => (
              <a key={e.title} className="cal-row" href="#">
                <div className="cal-date">
                  {e.day}
                  <small>{e.month[lang]}</small>
                </div>
                <div className="cal-info">
                  <h3>{e.title}</h3>
                  <p>{e.venue[lang]}</p>
                </div>
                <span className="cal-chip">{e.chip[lang]}</span>
                <span className="cal-arrow">→</span>
              </a>
            ))}
          </div>
        )}
        {full || events.length === 0 ? (
          <p className="cal-note reveal">{t.calNote}</p>
        ) : (
          <Link className="more-link reveal" href={ROUTES[lang].cal}>
            {t.calMore}
          </Link>
        )}
      </div>
    </section>
  );
}
