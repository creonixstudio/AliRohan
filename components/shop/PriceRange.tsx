'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

export function PriceRange({
  max,
  value,
  onChange,
  className,
}: {
  /** Catalogue ceiling. */
  max: number;
  /** Current selected maximum price. */
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  const id = useId();
  const step = Math.max(10, Math.round(max / 50 / 10) * 10);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="font-mono text-caption uppercase tracking-[0.08em] text-ink">
          Up to
        </label>
        <span className="font-mono text-caption tabular-nums text-ink">
          {value >= max ? `${formatPrice(max)}+` : formatPrice(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        aria-label="Maximum price"
        aria-valuetext={formatPrice(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-signature',
          'focus-visible:outline-none'
        )}
      />
    </div>
  );
}
