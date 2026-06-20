'use client';

import { cn } from '@/lib/utils';
import type { SortKey } from '@/lib/types';

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'popularity', label: 'Most popular' },
];

export function SortSelect({
  value,
  onChange,
  className,
}: {
  value: SortKey;
  onChange: (value: SortKey) => void;
  className?: string;
}) {
  return (
    <label className={cn('relative inline-flex items-center', className)}>
      <span className="sr-only">Sort products</span>
      <select
        aria-label="Sort products"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className={cn(
          'no-scrollbar appearance-none rounded-[var(--radius)] border border-ink/20 bg-paper',
          'py-2 pl-3 pr-8 font-mono text-caption uppercase tracking-[0.08em] text-ink',
          'cursor-pointer transition-colors duration-micro ease-house hover:border-ink'
        )}
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-ink"
      >
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </label>
  );
}
