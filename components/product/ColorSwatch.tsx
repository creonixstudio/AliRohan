'use client';

import { cn } from '@/lib/utils';
import type { ProductColor } from '@/lib/types';

export function ColorSwatch({
  colors,
  selected,
  onSelect,
}: {
  colors: ProductColor[];
  selected: string;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Colour">
      {colors.map((c) => {
        const active = c.name === selected;
        return (
          <button
            key={c.name}
            role="radio"
            aria-checked={active}
            aria-label={c.name}
            title={c.name}
            onClick={() => onSelect(c.name)}
            className={cn(
              'relative h-8 w-8 rounded-full border transition-transform duration-micro ease-house',
              active ? 'border-ink' : 'border-ink/20 hover:scale-110'
            )}
          >
            <span
              className="absolute inset-1 rounded-full"
              style={{ backgroundColor: c.hex }}
            />
            {active && (
              <span className="absolute inset-0 rounded-full ring-1 ring-ink ring-offset-2 ring-offset-paper" />
            )}
          </button>
        );
      })}
    </div>
  );
}
