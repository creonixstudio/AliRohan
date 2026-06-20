import Link from 'next/link';
import { site } from '@/lib/site.config';
import { CATEGORIES } from '@/lib/products';
import { NewsletterForm } from './NewsletterForm';

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-paper">
      <div className="shell grid gap-6 py-7 md:grid-cols-golden">
        <div className="flex flex-col gap-4">
          <Link href="/" className="font-display text-mega leading-[0.9] font-semibold">
            {site.name}
          </Link>
          <p className="max-w-prose text-muted">{site.tagline}</p>
          <NewsletterForm />
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <FooterCol title="Shop">
            {CATEGORIES.slice(0, 6).map((c) => (
              <Link key={c} href={`/shop/${c}`} className="capitalize hover:text-ink link-underline">
                {c}
              </Link>
            ))}
            <Link href="/shop" className="hover:text-ink link-underline">All products</Link>
          </FooterCol>
          <FooterCol title="Studio">
            <Link href="/about" className="hover:text-ink link-underline">About</Link>
            <Link href="/collections" className="hover:text-ink link-underline">Collections</Link>
            <Link href="/search" className="hover:text-ink link-underline">Search</Link>
          </FooterCol>
          <FooterCol title="Connect">
            <a href={site.social.instagram} className="hover:text-ink link-underline">Instagram</a>
            <a href={site.social.pinterest} className="hover:text-ink link-underline">Pinterest</a>
            <a href={`mailto:${site.email}`} className="hover:text-ink link-underline">{site.email}</a>
          </FooterCol>
        </div>
      </div>

      <div className="shell flex flex-col items-start justify-between gap-2 border-t border-line py-4 font-mono text-caption text-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <p>Made with intention. Free shipping over ${site.freeShippingThreshold}.</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="eyebrow mb-1">{title}</h3>
      <div className="flex flex-col gap-1.5 text-muted">{children}</div>
    </div>
  );
}
