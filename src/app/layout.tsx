import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Newsreader } from 'next/font/google';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/components/cart/CartProvider';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { themeInitScript } from '@/components/layout/ThemeToggle';
import { MotionRoot } from '@/components/motion/MotionRoot';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { JsonLd } from '@/components/ui/JsonLd';
import { absoluteUrl, site } from '@/lib/site';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500'],
  variable: '--font-newsreader',
  display: 'swap',
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Kaapii — Single-Estate Indian Coffee, Roasted by Hand',
    template: '%s · Kaapii Roasting Co.',
  },
  description: site.description,
  applicationName: site.name,
  keywords: ['specialty coffee India', 'single estate coffee', 'filter kaapi', 'Chikmagalur coffee', 'coffee roaster Bengaluru', 'Monsooned Malabar', 'buy coffee beans online'],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: site.url,
    siteName: site.legalName,
    title: 'Kaapii — Single-Estate Indian Coffee, Roasted by Hand',
    description: site.description,
  },
  twitter: { card: 'summary_large_image', title: 'Kaapii Roasting Co.', description: site.tagline },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5eee2' },
    { media: '(prefers-color-scheme: dark)', color: '#140c08' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const organizationLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': absoluteUrl('/#org'),
      name: site.legalName,
      url: site.url,
      logo: absoluteUrl('/icon.svg'),
      email: site.email,
      sameAs: Object.values(site.social),
    },
    {
      '@type': 'CafeOrCoffeeShop',
      '@id': absoluteUrl('/#roastery'),
      name: 'Kaapii Roastery & Tasting Room',
      url: site.url,
      telephone: site.phone,
      servesCuisine: 'Coffee',
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        postalCode: site.address.postcode,
        addressCountry: site.address.country,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '08:00',
          closes: '19:00',
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': absoluteUrl('/#website'),
      url: site.url,
      name: site.name,
      publisher: { '@id': absoluteUrl('/#org') },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: absoluteUrl('/shop?q={search_term_string}') },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${newsreader.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <JsonLd data={organizationLd} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <CartProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
        </CartProvider>
        <SmoothScroll />
        <MotionRoot />
      </body>
    </html>
  );
}
