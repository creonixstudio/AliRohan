'use client';

import Image from 'next/image';
import type { Collection, Product } from '@/lib/types';
import { img, BLUR_DATA_URL, EDITORIAL_POOL } from '@/lib/images';
import { ScrollReveal } from '@/components/scroll/ScrollReveal';
import { useGsapContext } from '@/components/scroll/useGsap';
import { ProductGrid } from '@/components/product/ProductGrid';

type Spread = {
  photoId: string;
  eyebrow: string;
  heading: string;
  body: string;
};

/**
 * Scroll-driven editorial lookbook. Full-bleed images alternate with text
 * spreads; a couple of images get a GSAP parallax drift. Reduced-motion is
 * honoured by the shared hooks (parallax + reveal both skip).
 */
export function LookbookView({
  collection,
  products,
}: {
  collection: Collection;
  products: Product[];
}) {
  const spreads: Spread[] = [
    {
      photoId: EDITORIAL_POOL[4],
      eyebrow: 'The intent',
      heading: 'Built to be worn together',
      body: `${collection.subtitle}. Each piece is cut to sit alongside the next — a wardrobe that reads as one hand, not a scatter of trends.`,
    },
    {
      photoId: EDITORIAL_POOL[5],
      eyebrow: 'The cloth',
      heading: 'Material first, always',
      body: 'We begin at the mill and let the fabric decide the silhouette. Weight, drape and hand are chosen before a single line is drawn.',
    },
    {
      photoId: EDITORIAL_POOL[6],
      eyebrow: 'The wear',
      heading: 'Better with time',
      body: 'Honest finishes, considered seams, nothing hidden. These are pieces that earn their place by being reached for, season after season.',
    },
  ];

  // Parallax drift on the full-bleed spread images.
  const parallaxRef = useGsapContext(({ scope, gsap }) => {
    const layers = scope.querySelectorAll<HTMLElement>('[data-parallax]');
    layers.forEach((layer) => {
      gsap.fromTo(
        layer,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: layer.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  });

  return (
    <div ref={parallaxRef as React.RefObject<HTMLDivElement>}>
      {spreads.map((s, i) => {
        const imageFirst = i % 2 === 0;
        return (
          <section
            key={s.photoId}
            className="py-7"
            aria-label={s.heading}
          >
            <ScrollReveal className="shell grid items-center gap-6 md:grid-cols-golden">
              <figure
                data-reveal
                className={`relative aspect-[4/5] overflow-hidden rounded-[var(--radius)] bg-clay/40 md:aspect-[3/4] ${
                  imageFirst ? 'md:order-1' : 'md:order-2'
                }`}
              >
                <div data-parallax className="absolute -inset-y-[10%] inset-x-0">
                  <Image
                    src={img(s.photoId, 'gallery')}
                    alt={`${collection.title} — ${s.heading.toLowerCase()}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>
              </figure>
              <div
                data-reveal
                className={imageFirst ? 'md:order-2' : 'md:order-1'}
              >
                <p className="eyebrow mb-4">{s.eyebrow}</p>
                <h2 className="font-display text-h2 leading-[1.08]">{s.heading}</h2>
                <p className="mt-4 max-w-prose text-lead text-muted">{s.body}</p>
              </div>
            </ScrollReveal>
          </section>
        );
      })}

      {/* The pieces */}
      <section className="shell py-7" aria-label="Pieces in this collection">
        <div className="mb-6 max-w-prose">
          <p className="eyebrow mb-3">The pieces</p>
          <h2 className="font-display text-h2 leading-[1.08]">
            {products.length} in {collection.title}
          </h2>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
