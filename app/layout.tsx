import type { Metadata } from 'next';
import './globals.css';
import { site } from '@/lib/site.config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ToastProvider } from '@/components/ui/Toast';
import { PageTransition } from '@/components/motion/PageTransition';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: ['fashion', 'apparel', 'menswear', 'womenswear', 'considered clothing', site.name],
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: site.locale,
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: site.name, description: site.description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-[var(--radius)] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <ToastProvider>
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
          <CartDrawer />
        </ToastProvider>
      </body>
    </html>
  );
}
