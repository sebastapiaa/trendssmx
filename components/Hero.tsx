import { DICT, type Lang } from '@/lib/i18n';

export default function Hero({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <div className="hero-wrap" id="top">
      <header className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-inner" id="heroInner">
          <p className="hero-eyebrow">{t.heroEyebrow}</p>
          <h1 className="hero-logo">
            trends<sup>mx</sup>
          </h1>
          <p className="hero-sub">{t.heroSub}</p>
        </div>
        <div className="scroll-cue">{t.scroll}</div>
      </header>
    </div>
  );
}
