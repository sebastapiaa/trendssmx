import type { Metadata } from 'next';
import '../globals.css';
import ScrollFX from '@/components/ScrollFX';

export const metadata: Metadata = {
  metadataBase: new URL('https://trendss.mx'),
  title: 'trends mx',
  description: "Things you've seen, now within reach. Original only.",
  openGraph: {
    type: 'website',
    siteName: 'trends mx',
    title: 'trends mx',
    description: "Things you've seen, now within reach. Original only.",
    locale: 'en_US',
    images: [{ url: '/og-en.png', width: 1200, height: 630, alt: 'trends mx' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'trends mx',
    description: "Things you've seen, now within reach. Original only.",
    images: ['/og-en.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="grain" aria-hidden="true" />
        <div className="progress" aria-hidden="true" />
        <ScrollFX />
        {children}
      </body>
    </html>
  );
}
