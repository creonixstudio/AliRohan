'use client';

import { motion } from 'framer-motion';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

export function ProductGrid({
  products,
  priorityCount = 4,
}: {
  products: Product[];
  priorityCount?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 md:gap-x-4 md:gap-y-7 lg:grid-cols-4">
      {products.map((p, i) => (
        <motion.div
          key={p.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: Math.min(i, 8) * 0.03 }}
        >
          <ProductCard product={p} index={i} priority={i < priorityCount} />
        </motion.div>
      ))}
    </div>
  );
}
