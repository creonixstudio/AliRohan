'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Product } from '@/lib/types';
import { img, BLUR_DATA_URL } from '@/lib/images';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/lib/cart-store';
import { useToast } from '@/components/ui/Toast';

export function ProductCard({
  product,
  priority = false,
  index = 0,
}: {
  product: Product;
  priority?: boolean;
  index?: number;
}) {
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  const add = useCart((s) => s.add);
  const { toast } = useToast();

  const primary = product.images[0];
  const secondary = product.images[1] ?? product.images[0];
  const firstColor = product.colors[0]?.name ?? '';
  const firstSize = product.sizes.find((s) => s.inStock)?.label ?? product.sizes[0]?.label ?? '';

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    add(product, firstSize, firstColor, 1);
    toast(`${product.name} added to bag`);
  }

  return (
    <article
      className="group relative flex flex-col"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden rounded-[var(--radius)] bg-clay/40"
        aria-label={`${product.name}, ${formatPrice(product.price)}`}
      >
        <div className="relative aspect-[3/4] w-full">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hover && !reduce ? 1.04 : 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={img(primary.url, 'card')}
              alt={primary.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              priority={priority}
            />
            <AnimatePresence>
              {hover && secondary !== primary && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={img(secondary.url, 'card')}
                    alt={secondary.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {product.badges && product.badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.badges.map((b) => (
              <Badge key={b} kind={b} />
            ))}
          </div>
        )}

        {/* quick add */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3">
          <motion.button
            onClick={quickAdd}
            initial={false}
            animate={{
              opacity: hover && !reduce ? 1 : 0,
              y: hover && !reduce ? 0 : 8,
            }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full rounded-[var(--radius)] bg-paper/95 py-2.5 font-mono text-caption uppercase tracking-[0.12em] text-ink backdrop-blur transition-colors hover:bg-ink hover:text-paper focus-visible:opacity-100 md:opacity-0"
          >
            Quick add
          </motion.button>
        </div>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-body font-medium">
            <Link href={`/product/${product.slug}`} className="link-underline">
              {product.name}
            </Link>
          </h3>
          <p className="mt-0.5 font-mono text-caption capitalize text-muted">
            {product.category}
          </p>
        </div>
        <span className="shrink-0 font-mono text-body tabular-nums">
          {formatPrice(product.price)}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        {product.colors.slice(0, 5).map((c) => (
          <span
            key={c.name}
            title={c.name}
            className="h-3 w-3 rounded-full border border-ink/15"
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
    </article>
  );
}
