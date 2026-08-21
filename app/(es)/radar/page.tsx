import type { Metadata } from 'next';
import RadarPage from '@/components/pages/RadarPage';

export const metadata: Metadata = {
  title: 'radar — trends mx',
  alternates: { canonical: '/radar', languages: { en: '/en/radar' } },
};

export default function Page() {
  return <RadarPage lang="es" />;
}
