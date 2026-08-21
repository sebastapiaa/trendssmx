import type { Metadata } from 'next';
import LandingPage from '@/components/pages/LandingPage';

export const metadata: Metadata = {
  title: 'trends mx — lo que ves en tu feed, ahora a tu alcance',
  alternates: { canonical: '/', languages: { en: '/en' } },
};

export default function Page() {
  return <LandingPage lang="es" />;
}
