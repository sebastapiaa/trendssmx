import Link from 'next/link';
import { DICT, IG_URL, ROUTES, type Lang } from '@/lib/i18n';

const KEYS = ['store', 'radar', 'cal'] as const;

export default function Footer({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  const r = ROUTES[lang];
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div className="foot-logo">
            trends<sup>mx</sup>
          </div>
          <ul className="foot-links">
            {KEYS.map((k) => (
              <li key={k}>
                <Link href={r[k]}>{t.nav[k]}</Link>
              </li>
            ))}
            <li>
              <a href={IG_URL} target="_blank" rel="noopener noreferrer">
                instagram
              </a>
            </li>
          </ul>
        </div>
        <div className="foot-bar">
          {t.footBar.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
