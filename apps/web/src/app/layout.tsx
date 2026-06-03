import './globals.css';
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from './providers';

export const metadata = {
  title: 'Mobilidad – Tu viaje, tus reglas',
  description: 'Plataforma de movilidad con tarifa negociable.',
};

export const viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1, viewportFit: 'cover', themeColor: '#6C63FF',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es" className="dark">
        <head>
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body><Providers>{children}</Providers></body>
      </html>
    </ClerkProvider>
  );
}