import type { Metadata } from 'next';
import '../globals.css';
import ScrollFX from '@/components/ScrollFX';

export const metadata: Metadata = {
  metadataBase: new URL('https://trendss.mx'),
  title: 'trends mx',
  description: 'Lo que ves en tu feed, ahora a tu alcance. Original only.',
  openGraph: {
    type: 'website',
    siteName: 'trends mx',
    title: 'trends mx',
    description: 'Lo que ves en tu feed, ahora a tu alcance. Original only.',
    locale: 'es_MX',
    images: [{ url: '/og-es.png', width: 1200, height: 630, alt: 'trends mx' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'trends mx',
    description: 'Lo que ves en tu feed, ahora a tu alcance. Original only.',
    images: ['/og-es.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="grain" aria-hidden="true" />
        <div className="progress" aria-hidden="true" />
        <ScrollFX />
        {children}
      </body>
    </html>
  );
}
