'use client';

import { useGsapContext } from './useGsap';

/**
 * GSAP-driven scrubbed reveal. Owns SCROLL POSITION (vs. Framer which owns
 * element interaction state) — the two never animate the same property.
 * Children with `data-reveal` fade + rise as they enter, scrubbed to scroll.
 */
export function ScrollReveal({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useGsapContext(({ scope, gsap }) => {
    const items = scope.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    gsap.fromTo(
      items,
      { y: 48, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger,
        scrollTrigger: {
          trigger: scope,
          start: 'top 78%',
          end: 'top 40%',
          scrub: 0.6,
        },
      }
    );
  });

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
}
