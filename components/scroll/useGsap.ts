'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
export function registerGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/**
 * Scoped GSAP context hook. The callback receives the scope element; all
 * tweens/ScrollTriggers created inside are auto-reverted on unmount. Honours
 * prefers-reduced-motion by skipping the animation entirely.
 */
export function useGsapContext(
  setup: (ctx: { scope: HTMLElement; gsap: typeof gsap }) => void,
  deps: unknown[] = []
) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    registerGsap();
    const el = ref.current;
    const ctx = gsap.context(() => setup({ scope: el, gsap }), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export { gsap, ScrollTrigger };
