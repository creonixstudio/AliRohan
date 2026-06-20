'use client';

import Image from 'next/image';
import { ScrollReveal } from '@/components/scroll/ScrollReveal';
import { img, BLUR_DATA_URL, EDITORIAL_POOL } from '@/lib/images';

/** Material story — the Sentient serif "moment". */
export function StoryBlock() {
  return (
    <section className="bg-ink py-8 text-paper" aria-label="On materials">
      <ScrollReveal className="shell grid items-center gap-6 md:grid-cols-golden-rev">
        <div data-reveal className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)]">
          <Image
            src={img(EDITORIAL_POOL[4], 'gallery')}
            alt="Close detail of woven wool fabric catching raking light"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>
        <div>
          <p data-reveal className="eyebrow mb-5 text-clay">On materials</p>
          <blockquote data-reveal className="font-serif text-h2 leading-[1.15]">
            “We start with the cloth, not the silhouette. If the fabric isn’t
            worth keeping for a decade, the cut doesn’t matter.”
          </blockquote>
          <p data-reveal className="mt-6 max-w-prose text-clay">
            Every piece begins at the mill. We work with weavers in Biella,
            Okayama and Hawick — places where making cloth is still a craft —
            then cut as little as the garment needs. Fewer seams, honest
            finishes, nothing hidden. The result feels considered because it is.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
