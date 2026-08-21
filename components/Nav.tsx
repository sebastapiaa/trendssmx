import Link from 'next/link';
import { DICT, IG_URL, ROUTES, other, type Lang, type PageKey } from '@/lib/i18n';

const KEYS = ['store', 'radar', 'cal'] as const;

export default function Nav({ lang, active, solid = false }: { lang: Lang; active: PageKey; solid?: boolean }) {
  const t = DICT[lang];
  const r = ROUTES[lang];
  const altLang = other(lang);
  return (
    <nav id="nav" className={solid ? 'scrolled solid' : undefined}>
      <Link className="nav-logo" href={r.home}>
        trends<sup>mx</sup>
      </Link>
      <ul className="nav-links">
        {KEYS.map((k) => (
          <li key={k}>
            <Link href={r[k]} className={active === k ? 'active' : undefined}>
              {t.nav[k]}
            </Link>
          </li>
        ))}
      </ul>
      <div className="nav-right">
        <Link className="nav-lang" href={ROUTES[altLang][active]}>
          {altLang}
        </Link>
        <a className="nav-cta" href={IG_URL} target="_blank" rel="noopener noreferrer">
          @trendssmx
        </a>
      </div>
    </nav>
  );
}
