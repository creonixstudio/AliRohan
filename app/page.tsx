import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { CollectionsRail } from '@/components/home/CollectionsRail';
import { StoryBlock } from '@/components/home/StoryBlock';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/scroll/ScrollReveal';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { getFeatured } from '@/lib/products';

export default function HomePage() {
  const featured = getFeatured(8);

  return (
    <>
      <Hero />

      {/* Featured */}
      <section className="shell py-8" aria-label="Featured pieces">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <MotionReveal>
              <p className="eyebrow mb-2">This week</p>
              <h2 className="font-display text-h2">Featured pieces</h2>
            </MotionReveal>
          </div>
          <Link href="/shop" className="font-mono text-caption uppercase tracking-[0.12em] hover:text-signature">
            All products →
          </Link>
        </div>
        <ScrollReveal className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-x-4" stagger={0.06}>
          {featured.map((p, i) => (
            <div data-reveal key={p.id}>
              <ProductCard product={p} index={i} priority={i < 4} />
            </div>
          ))}
        </ScrollReveal>
      </section>

      <CollectionsRail />
      <StoryBlock />

      {/* Newsletter prompt strip */}
      <section className="shell py-8 text-center">
        <MotionReveal>
          <p className="eyebrow mb-3">Stay close</p>
          <h2 className="mx-auto max-w-prose font-display text-h2 leading-tight">
            New releases, in limited runs. The list hears first.
          </h2>
          <Link
            href="/about"
            className="mt-5 inline-block font-mono text-caption uppercase tracking-[0.12em] text-signature underline-offset-4 hover:underline"
          >
            Read the studio story →
          </Link>
        </MotionReveal>
      </section>
    </>
  );
}
