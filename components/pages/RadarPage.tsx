import { DICT, type Lang } from '@/lib/i18n';
import Nav from '@/components/Nav';
import PageHero from '@/components/PageHero';
import RadarSection from '@/components/RadarSection';
import CtaIg from '@/components/CtaIg';
import Footer from '@/components/Footer';

export default function RadarPage({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <>
      <Nav lang={lang} active="radar" solid />
      <PageHero title={t.radarHeroTitle} sub={t.radarHeroSub} />
      <RadarSection lang={lang} full />
      <CtaIg lang={lang} />
      <Footer lang={lang} />
    </>
  );
}
