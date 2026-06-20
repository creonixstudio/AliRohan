import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ShopView } from '@/components/shop/ShopView';
import {
  CATEGORIES,
  getProductsByCategory,
  getFacets,
  getCategoryCounts,
} from '@/lib/products';
import type { Category } from '@/lib/types';
import { site } from '@/lib/site.config';

type Params = { category: string };

function isCategory(value: string): value is Category {
  return (CATEGORIES as string[]).includes(value);
}

const COPY: Partial<Record<Category, string>> = {
  outerwear: 'Coats, jackets and layers built for the cold months.',
  knitwear: 'Knits with weight and structure, made to keep their shape.',
  shirts: 'Shirting cut clean, in honest cloth.',
  tops: 'Everyday tops that earn their place in rotation.',
  trousers: 'Trousers with a considered line, from relaxed to sharp.',
  denim: 'Denim woven to wear in, not out.',
  dresses: 'Dresses with quiet construction and a long life.',
  skirts: 'Skirts that move well and hold their drape.',
  footwear: 'Footwear made to be resoled, not replaced.',
  bags: 'Bags in full-grain leather and hard-wearing canvas.',
  accessories: 'The finishing pieces — small, deliberate, well made.',
};

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const { category } = params;
  if (!isCategory(category)) return { title: 'Not found' };
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: label,
    description: COPY[category] ?? `Shop ${category} at ${site.name}.`,
    openGraph: { title: `${label} · ${site.name}`, description: COPY[category] },
  };
}

export default function CategoryPage({ params }: { params: Params }) {
  const { category } = params;
  if (!isCategory(category)) notFound();

  const products = getProductsByCategory(category);
  const facets = getFacets();
  const count = getCategoryCounts()[category] ?? products.length;
  const label = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main id="main" className="pt-[120px]">
      <header className="shell pb-2">
        <Breadcrumbs
          trail={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: category },
          ]}
        />
        <MotionReveal>
          <p className="eyebrow mb-2 mt-4">{count} {count === 1 ? 'piece' : 'pieces'}</p>
          <h1 className="font-display text-h1 capitalize">{label}</h1>
          {COPY[category] && <p className="mt-3 max-w-prose text-muted">{COPY[category]}</p>}
        </MotionReveal>
      </header>

      <ShopView
        products={products}
        facets={facets}
        categories={CATEGORIES}
        lockedCategory={category}
      />
    </main>
  );
}
