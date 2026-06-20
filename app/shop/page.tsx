import type { Metadata } from 'next';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { ShopView } from '@/components/shop/ShopView';
import { getAllProducts, getFacets, CATEGORIES } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'The full VESTRA catalogue. Filter by category, size, colour and price.',
};

export default function ShopPage() {
  const products = getAllProducts();
  const facets = getFacets();

  return (
    <main id="main" className="pt-[120px]">
      <header className="shell pb-2">
        <MotionReveal>
          <p className="eyebrow mb-2">The catalogue</p>
          <h1 className="font-display text-h1">Shop everything</h1>
          <p className="mt-3 max-w-prose text-muted">
            Every piece in the current range. Narrow it down with the filters, or browse the lot.
          </p>
        </MotionReveal>
      </header>

      <ShopView products={products} facets={facets} categories={CATEGORIES} />
    </main>
  );
}
