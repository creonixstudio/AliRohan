'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGsapContext } from '@/components/scroll/useGsap';
import { collections } from '@/lib/collections';
import { img, BLUR_DATA_URL } from '@/lib/images';

/**
 * Horizontal-scroll collections rail. On desktop GSAP pins the section and
 * translates the track horizontally as you scroll vertically. On reduced
 * motion / mobile it degrades to a native horizontal swipe rail.
 */
export function CollectionsRail() {
  const ref = useGsapContext(({ scope, gsap, }) => {
    if (window.innerWidth < 768) return; // native swipe on mobile
    const track = scope.querySelector('[data-rail-track]') as HTMLElement;
    if (!track) return;
    const distance = track.scrollWidth - window.innerWidth + 64;
    gsap.to(track, {
      x: -distance,
      ease: 'none',
      scrollTrigger: {
        trigger: scope,
        start: 'top top',
        end: () => `+=${distance}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });
  });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative overflow-hidden py-7">
      <div className="shell mb-6 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-2">Curated</p>
          <h2 className="font-display text-h2">Collections</h2>
        </div>
        <Link href="/collections" className="hidden font-mono text-caption uppercase tracking-[0.12em] hover:text-signature sm:block">
          View all →
        </Link>
      </div>

      <div
        data-rail-track
        className="no-scrollbar flex gap-4 overflow-x-auto px-4 md:overflow-visible md:px-6"
      >
        {collections.map((c) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            className="group relative aspect-[3/4] w-[78vw] shrink-0 overflow-hidden rounded-[var(--radius)] bg-clay/40 sm:w-[46vw] md:w-[34vw] lg:w-[28vw]"
          >
            <Image
              src={img(c.coverImage, 'card', { w: 900 })}
              alt={`${c.title} collection`}
              fill
              sizes="(max-width: 768px) 78vw, 30vw"
              className="object-cover transition-transform duration-comp ease-house group-hover:scale-105"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
              <p className="font-mono text-caption uppercase tracking-[0.14em] opacity-80">{c.season}</p>
              <h3 className="mt-1 font-display text-h3 leading-tight">{c.title}</h3>
              <p className="mt-1 text-caption opacity-85">{c.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
