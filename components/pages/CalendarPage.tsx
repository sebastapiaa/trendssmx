import { DICT, type Lang } from '@/lib/i18n';
import Nav from '@/components/Nav';
import PageHero from '@/components/PageHero';
import CalSection from '@/components/CalSection';
import CtaIg from '@/components/CtaIg';
import Footer from '@/components/Footer';

export default function CalendarPage({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <>
      <Nav lang={lang} active="cal" solid />
      <PageHero title={t.calHeroTitle} sub={t.calHeroSub} />
      <CalSection lang={lang} full />
      <CtaIg lang={lang} />
      <Footer lang={lang} />
    </>
  );
}
