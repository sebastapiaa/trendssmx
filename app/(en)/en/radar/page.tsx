import type { Metadata } from 'next';
import RadarPage from '@/components/pages/RadarPage';

export const metadata: Metadata = {
  title: 'radar — trends mx',
  alternates: { canonical: '/en/radar', languages: { es: '/radar' } },
};

export default function Page() {
  return <RadarPage lang="en" />;
}
