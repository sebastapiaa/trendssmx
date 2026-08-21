import { DICT, type Lang } from '@/lib/i18n';
import type { IconName } from '@/lib/content';
import { Icon } from './Icons';

export default function OriginalOnly({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <section className="original">
      <div className="original-bg" aria-hidden="true" />
      <div className="container original-inner">
        <p className="section-label reveal" style={{ color: '#fff', opacity: 0.8 }}>
          {t.origLabel}
        </p>
        <h2 className="reveal d1" style={{ marginTop: 44 }}>
          original only.
        </h2>
        <div className="trust">
          {t.trust.map((item, i) => (
            <div key={item.title} className={`trust-item reveal d${i + 1}`}>
              <Icon name={item.icon as IconName} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
