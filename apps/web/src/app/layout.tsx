import './globals.css';
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from './providers';
import { getBrand, getBrandCssVars } from '@mobilidad/brand-config';

const brand = getBrand(process.env.BRAND_ID ?? 'mobilidad');

export const metadata = {
  title: `${brand.appName} – ${brand.tagline}`,
  description: brand.description,
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: brand.colors.primary,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const cssVars = getBrandCssVars(brand);
  return (
    <ClerkProvider>
      <html lang={brand.defaultLanguage} className="dark">
        <head>
          <style dangerouslySetInnerHTML={{ __html: `:root{${cssVars}}` }} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body><Providers>{children}</Providers></body>
      </html>
    </ClerkProvider>
  );
}
