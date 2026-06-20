'use client';

import { Hero3D } from '@/components/three/Hero3D';
import { useGsapContext } from '@/components/scroll/useGsap';
import { Button } from '@/components/ui/Button';
import { site } from '@/lib/site.config';

/**
 * Signature surface. Pinned hero: GSAP scrubs the headline mask-reveal + a
 * parallax drift on the overlay while the R3F fabric does its own internal
 * cloth motion (the two never animate the same property). Reduced-motion gets
 * a static poster + instant text.
 */
export function Hero() {
  const ref = useGsapContext(({ scope, gsap }) => {
    const lines = scope.querySelectorAll('[data-hero-line] > span');
    gsap.set(lines, { yPercent: 115 });

    // intro settle
    gsap.to(lines, {
      yPercent: 0,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.12,
      delay: 0.15,
    });

    // scrubbed parallax + fade as you scroll past the hero
    gsap.to(scope.querySelector('[data-hero-overlay]'), {
      yPercent: -18,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: {
        trigger: scope,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        pin: scope.querySelector('[data-hero-pin]'),
        pinSpacing: false,
      },
    });

    gsap.to(scope.querySelector('[data-hero-3d]'), {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden"
      aria-label="Introduction"
    >
      <div data-hero-pin className="absolute inset-0">
        <div data-hero-3d className="absolute inset-0">
          <Hero3D />
        </div>
        {/* tonal scrim for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-paper/70 via-transparent to-paper/30" />

        <div data-hero-overlay className="shell relative flex h-full flex-col justify-end pb-7">
          <p className="eyebrow mb-4">{site.name} — Studio {new Date().getFullYear()}</p>
          <h1 className="font-display text-h1 font-semibold leading-[0.98] sm:text-mega">
            <span data-hero-line className="block overflow-hidden">
              <span className="block">Clothes that</span>
            </span>
            <span data-hero-line className="block overflow-hidden">
              <span className="block italic font-serif text-signature">earn their keep.</span>
            </span>
          </h1>
          <p className="mt-5 max-w-prose text-lead text-ink/80">
            {site.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/shop" size="lg" variant="signature">Shop the collection</Button>
            <Button href="/collections" size="lg" variant="outline">View lookbook</Button>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 hidden font-mono text-caption uppercase tracking-[0.18em] text-muted sm:block">
          Scroll to explore ↓
        </div>
      </div>
    </section>
  );
}
