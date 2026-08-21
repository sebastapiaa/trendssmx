import type { Metadata } from 'next';
import CalendarPage from '@/components/pages/CalendarPage';

export const metadata: Metadata = {
  title: 'calendar — trends mx',
  alternates: { canonical: '/en/calendar', languages: { es: '/calendario' } },
};

export default function Page() {
  return <CalendarPage lang="en" />;
}
