'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { searchProducts } from '@/lib/products';
import { cn } from '@/lib/utils';
import { ProductGrid } from '@/components/product/ProductGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { MotionReveal } from '@/components/motion/MotionReveal';

export function SearchView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initial);

  // Debounce the URL write (~250ms). The grid reads from `query` directly so
  // typing feels instant; the URL is the shareable artefact.
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 250);
    return () => clearTimeout(t);
  }, [query, pathname, router]);

  const trimmed = query.trim();
  const results = useMemo(() => (trimmed ? searchProducts(trimmed) : []), [trimmed]);

  return (
    <div className="shell pb-9 pt-[120px]">
      <MotionReveal>
        <p className="eyebrow mb-2">Search</p>
        <h1 className="font-display text-h1">Find a piece</h1>
      </MotionReveal>

      <div className="mt-6 max-w-2xl">
        <label htmlFor="search-input" className="sr-only">
          Search products
        </label>
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          >
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 21l-4.3-4.3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id="search-input"
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category or colour"
            aria-label="Search products"
            className={cn(
              'h-14 w-full rounded-[var(--radius)] border border-ink/20 bg-paper',
              'pl-11 pr-4 text-body text-ink placeholder:text-muted',
              'transition-colors duration-micro ease-house focus:border-ink focus:outline-none'
            )}
          />
        </div>
        {trimmed && (
          <p className="mt-3 font-mono text-caption tabular-nums text-muted">
            {results.length} {results.length === 1 ? 'result' : 'results'} for “{trimmed}”
          </p>
        )}
      </div>

      <div className="mt-8">
        {!trimmed ? (
          <EmptyState
            title="What are you after?"
            body="Start typing a name, category or colour and matching pieces appear as you go. Try “wool”, “coat” or “navy”."
            actionLabel="Browse the shop"
            actionHref="/shop"
          />
        ) : results.length === 0 ? (
          <EmptyState
            title={`No results for “${trimmed}”`}
            body="Nothing in the current range matches that. Check the spelling, try a broader term, or browse everything."
            actionLabel="Browse the shop"
            actionHref="/shop"
          />
        ) : (
          <ProductGrid products={results} priorityCount={4} />
        )}
      </div>
    </div>
  );
}
