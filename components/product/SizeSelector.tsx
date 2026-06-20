'use client';

import { cn } from '@/lib/utils';
import type { ProductSize } from '@/lib/types';

export function SizeSelector({
  sizes,
  selected,
  onSelect,
}: {
  sizes: ProductSize[];
  selected: string;
  onSelect: (label: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
      {sizes.map((s) => {
        const active = s.label === selected;
        return (
          <button
            key={s.label}
            role="radio"
            aria-checked={active}
            disabled={!s.inStock}
            onClick={() => onSelect(s.label)}
            className={cn(
              'relative min-w-[3rem] rounded-[var(--radius)] border px-3 py-2 font-mono text-caption uppercase tracking-wide transition-colors duration-micro ease-house',
              active
                ? 'border-ink bg-ink text-paper'
                : 'border-ink/25 hover:border-ink',
              !s.inStock &&
                'cursor-not-allowed border-ink/10 text-ink/30 line-through hover:border-ink/10'
            )}
            title={s.inStock ? s.label : `${s.label} — out of stock`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
