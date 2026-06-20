/**
 * Brand configuration — swap everything client-facing from one place.
 * Change `name` to rebrand the entire storefront.
 */
export const site = {
  name: 'VESTRA',
  tagline: 'Considered apparel, made to be worn for years.',
  description:
    'VESTRA is a considered-apparel studio. Material-honest pieces with quiet construction, cut to last and made to be lived in.',
  url: 'https://vestra.studio',
  currency: 'USD',
  locale: 'en-US',
  email: 'studio@vestra.studio',
  social: {
    instagram: 'https://instagram.com',
    pinterest: 'https://pinterest.com',
  },
  nav: [
    { label: 'Shop', href: '/shop' },
    { label: 'Collections', href: '/collections' },
    { label: 'About', href: '/about' },
  ],
  freeShippingThreshold: 250,
} as const;

export type SiteConfig = typeof site;
