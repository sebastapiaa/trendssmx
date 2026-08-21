import type { Lang } from '@/lib/i18n';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import Manifesto from '@/components/Manifesto';
import OriginalOnly from '@/components/OriginalOnly';
import RadarSection from '@/components/RadarSection';
import CalSection from '@/components/CalSection';
import CtaIg from '@/components/CtaIg';
import Footer from '@/components/Footer';

export default function LandingPage({ lang }: { lang: Lang }) {
  return (
    <>
      <Nav lang={lang} active="home" />
      <Hero lang={lang} />
      <Ticker lang={lang} />
      <Manifesto lang={lang} />
      <OriginalOnly lang={lang} />
      <RadarSection lang={lang} />
      <CalSection lang={lang} />
      <CtaIg lang={lang} />
      <Footer lang={lang} />
    </>
  );
}
