'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { img } from '@/lib/images';

const Viewer = dynamic(() => import('./ViewerCanvas'), {
  ssr: false,
  loading: () => <div className="h-full w-full skeleton" />,
});

/**
 * Interactive R3F material viewer for flagged "hero" products. Mounts only on
 * interaction/in-view; falls back to the 2D gallery image when no model exists
 * or motion is reduced.
 */
export function Product3DViewer({
  fallbackImage,
  alt,
  colorHex,
}: {
  fallbackImage: string;
  alt: string;
  colorHex: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) setAllowed(false);
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius)] bg-clay/40"
    >
      {allowed && active ? (
        <Viewer colorHex={colorHex} />
      ) : (
        <>
          <Image
            src={img(fallbackImage, 'gallery')}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
          {allowed && (
            <button
              onClick={() => setActive(true)}
              className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-ink/80 py-3 font-mono text-caption uppercase tracking-[0.12em] text-paper backdrop-blur transition-colors hover:bg-ink"
            >
              <span aria-hidden>◰</span> View in 3D
            </button>
          )}
        </>
      )}
    </div>
  );
}
