import { DICT, type Lang } from '@/lib/i18n';

export default function Manifesto({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <section className="manifesto">
      <div className="container">
        <p className="section-label reveal">{t.manifestoLabel}</p>
        <h2 className="reveal d1">
          {t.manifestoLead} <em>{t.manifestoEm}</em>
          {t.manifestoTail}
        </h2>
        <div className="pillars">
          {t.pillars.map((p, i) => (
            <div key={p.title} className={`pillar reveal d${i + 1}`}>
              <span className="num">{p.num}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
