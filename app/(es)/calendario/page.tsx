import type { Metadata } from 'next';
import CalendarPage from '@/components/pages/CalendarPage';

export const metadata: Metadata = {
  title: 'calendario — trends mx',
  alternates: { canonical: '/calendario', languages: { en: '/en/calendar' } },
};

export default function Page() {
  return <CalendarPage lang="es" />;
}
