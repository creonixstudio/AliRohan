'use client';

import Image from 'next/image';
import { img, BLUR_DATA_URL, EDITORIAL_POOL } from '@/lib/images';
import { ScrollReveal } from '@/components/scroll/ScrollReveal';
import { useGsapContext } from '@/components/scroll/useGsap';
import { MotionReveal } from '@/components/motion/MotionReveal';

const PROCESS = [
  {
    photoId: EDITORIAL_POOL[4],
    eyebrow: 'The cloth',
    heading: 'We start at the mill',
    body: 'Before a silhouette exists, there is fabric. We work with weavers in Biella, Okayama and Hawick, choosing cloth for weight, drape and how it ages. If it is not worth keeping for a decade, the cut does not matter.',
  },
  {
    photoId: EDITORIAL_POOL[5],
    eyebrow: 'The cut',
    heading: 'Less, finished better',
    body: 'We cut as little as a garment needs. Fewer seams, honest hems, linings only where they earn their place. The aim is a piece that feels resolved because nothing was added to disguise the work.',
  },
  {
    photoId: EDITORIAL_POOL[6],
    eyebrow: 'The wear',
    heading: 'Made to be lived in',
    body: 'Clothes prove themselves by being reached for. We design for a wardrobe that gets worn, washed and worn again — pieces that settle into a person rather than asking to be preserved.',
  },
];

const NUMBERS: { value: string; label: string }[] = [
  { value: '2019', label: 'Studio founded' },
  { value: '3', label: 'Partner mills' },
  { value: '40+', label: 'Pieces in the line' },
  { value: '1', label: 'Edit at a time' },
];

export function AboutNarrative() {
  // Soft parallax on the process imagery.
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
      {/* Thesis — the Sentient serif moment */}
      <section className="shell py-7" aria-label="What we make">
        <MotionReveal>
          <p className="eyebrow mb-5">The studio</p>
          <p className="max-w-[24ch] font-serif text-mega leading-[0.98]">
            Considered apparel, made to be worn for years.
          </p>
          <p className="mt-6 max-w-prose text-lead text-muted">
            VESTRA is a small apparel studio. We make a tight line of
            material-honest pieces with quiet construction, and we release one
            edit at a time. No drops for the sake of it, no parts you cannot see
            the reason for.
          </p>
        </MotionReveal>
      </section>

      {/* Process — alternating parallax image / text */}
      {PROCESS.map((p, i) => {
        const imageFirst = i % 2 === 0;
        return (
          <section key={p.photoId} className="py-7" aria-label={p.heading}>
            <ScrollReveal className="shell grid items-center gap-6 md:grid-cols-golden">
              <figure
                data-reveal
                className={`relative aspect-[4/5] overflow-hidden rounded-[var(--radius)] bg-clay/40 ${
                  imageFirst ? 'md:order-1' : 'md:order-2'
                }`}
              >
                <div data-parallax className="absolute -inset-y-[10%] inset-x-0">
                  <Image
                    src={img(p.photoId, 'gallery')}
                    alt={`VESTRA studio — ${p.heading.toLowerCase()}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>
              </figure>
              <div data-reveal className={imageFirst ? 'md:order-2' : 'md:order-1'}>
                <p className="eyebrow mb-4">{p.eyebrow}</p>
                <h2 className="font-display text-h2 leading-[1.08]">{p.heading}</h2>
                <p className="mt-4 max-w-prose text-lead text-muted">{p.body}</p>
              </div>
            </ScrollReveal>
          </section>
        );
      })}

      {/* Studio numbers — genuinely sequential facts, kept plain */}
      <section className="bg-ink py-8 text-paper" aria-label="The studio in numbers">
        <ScrollReveal className="shell" stagger={0.1}>
          <p data-reveal className="eyebrow mb-6 text-clay">By the numbers</p>
          <dl className="grid grid-cols-2 gap-x-5 gap-y-7 md:grid-cols-4">
            {NUMBERS.map((n) => (
              <div data-reveal key={n.label}>
                <dt className="sr-only">{n.label}</dt>
                <dd>
                  <span className="block font-display text-h1 leading-none">
                    {n.value}
                  </span>
                  <span className="mt-3 block font-mono text-caption uppercase tracking-[0.14em] text-clay">
                    {n.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
      </section>
    </div>
  );
}
