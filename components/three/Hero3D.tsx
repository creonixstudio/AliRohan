'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// Lazy — never part of first paint. Spline could be swapped in here; we ship
// an R3F equivalent so the moment always renders even with no Spline asset.
const FabricScene = dynamic(() => import('./FabricScene'), {
  ssr: false,
  loading: () => <Poster />,
});

function Poster() {
  return (
    <div
      className="h-full w-full"
      style={{
        background:
          'radial-gradient(120% 120% at 70% 20%, #7a3236 0%, #5a2327 45%, #2c1a18 100%)',
      }}
      aria-hidden
    />
  );
}

/**
 * Mounts the 3D fabric scene only when in view and only if motion is allowed
 * + the connection isn't save-data. Otherwise shows a static on-brand poster.
 */
export function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // @ts-expect-error - connection is non-standard
    const saveData = navigator.connection?.saveData;
    if (reduce || saveData) {
      setAllowed(false);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {allowed && mount ? <FabricScene /> : <Poster />}
    </div>
  );
}
