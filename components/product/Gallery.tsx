'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ProductImage } from '@/lib/types';
import { img, BLUR_DATA_URL } from '@/lib/images';
import { cn } from '@/lib/utils';

/** PDP gallery — large active image with a thumbnail rail. 4:5 aspect. */
export function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius)] bg-clay/40">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={img(current.url, 'gallery')}
            alt={current.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            priority
          />
        </motion.div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2" role="tablist" aria-label={`${name} images`}>
          {images.map((im, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`View image ${i + 1}: ${im.alt}`}
              onClick={() => setActive(i)}
              className={cn(
                'relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-[var(--radius)] border transition-colors md:w-20',
                i === active ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              <Image
                src={img(im.url, 'thumb')}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
