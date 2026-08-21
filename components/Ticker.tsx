import { DICT, type Lang } from '@/lib/i18n';
import type { IconName } from '@/lib/content';
import { Icon } from './Icons';

const ICONS: IconName[] = ['star', 'fire', 'heart', 'smile', 'star'];

export default function Ticker({ lang }: { lang: Lang }) {
  const items = DICT[lang].ticker;
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {/* rendered twice for a seamless loop */}
        {[0, 1].map((pass) =>
          items.map((label, i) => (
            <span key={`${pass}-${i}`}>
              <Icon name={ICONS[i % ICONS.length]} />
              {label}
            </span>
          )),
        )}
      </div>
    </div>
  );
}
