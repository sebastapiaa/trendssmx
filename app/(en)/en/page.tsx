import type { Metadata } from 'next';
import LandingPage from '@/components/pages/LandingPage';

export const metadata: Metadata = {
  title: "trends mx — things you've seen, now within reach",
  alternates: { canonical: '/en', languages: { es: '/' } },
};

export default function Page() {
  return <LandingPage lang="en" />;
}
