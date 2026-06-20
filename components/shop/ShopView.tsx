'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { Category, Product, SortKey } from '@/lib/types';
import { filterAndSort, type Filters } from '@/lib/products';
import { cn } from '@/lib/utils';
import { ProductGrid } from '@/components/product/ProductGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { FilterBar } from './FilterBar';

type Facets = {
  colors: { name: string; hex: string }[];
  sizes: string[];
  maxPrice: number;
};

const PAGE = 12;
const SORT_KEYS: SortKey[] = ['newest', 'price-asc', 'price-desc', 'popularity'];

function parseList(value: string | null): string[] | undefined {
  if (!value) return undefined;
  const out = value.split(',').filter(Boolean);
  return out.length ? out : undefined;
}

export function ShopView({
  products,
  facets,
  categories,
  /** When set, the category control is hidden and this label scopes the page. */
  lockedCategory,
}: {
  products: Product[];
  facets: Facets;
  categories: Category[];
  lockedCategory?: Category;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derive state from the URL — single source of truth.
  const filters: Filters = useMemo(() => {
    const f: Filters = {};
    if (!lockedCategory) {
      const cat = searchParams.get('category');
      if (cat) f.category = cat as Category | 'all';
    }
    f.sizes = parseList(searchParams.get('sizes'));
    f.colors = parseList(searchParams.get('colors'));
    f.badges = parseList(searchParams.get('badges'));
    const max = searchParams.get('maxPrice');
    if (max) f.maxPrice = Number(max);
    if (searchParams.get('inStock') === '1') f.inStockOnly = true;
    return f;
  }, [searchParams, lockedCategory]);

  const sort: SortKey = useMemo(() => {
    const s = searchParams.get('sort');
    return s && SORT_KEYS.includes(s as SortKey) ? (s as SortKey) : 'newest';
  }, [searchParams]);

  const [visible, setVisible] = useState(PAGE);

  const writeUrl = useCallback(
    (nextFilters: Filters, nextSort: SortKey) => {
      const params = new URLSearchParams();
      if (!lockedCategory && nextFilters.category && nextFilters.category !== 'all')
        params.set('category', nextFilters.category);
      if (nextFilters.sizes?.length) params.set('sizes', nextFilters.sizes.join(','));
      if (nextFilters.colors?.length) params.set('colors', nextFilters.colors.join(','));
      if (nextFilters.badges?.length) params.set('badges', nextFilters.badges.join(','));
      if (typeof nextFilters.maxPrice === 'number' && nextFilters.maxPrice < facets.maxPrice)
        params.set('maxPrice', String(nextFilters.maxPrice));
      if (nextFilters.inStockOnly) params.set('inStock', '1');
      if (nextSort !== 'newest') params.set('sort', nextSort);

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      setVisible(PAGE);
    },
    [router, pathname, facets.maxPrice, lockedCategory]
  );

  const setFilters = useCallback(
    (next: Filters) => writeUrl(next, sort),
    [writeUrl, sort]
  );
  const setSort = useCallback(
    (next: SortKey) => writeUrl(filters, next),
    [writeUrl, filters]
  );
  const reset = useCallback(() => writeUrl({}, 'newest'), [writeUrl]);

  const effectiveFilters: Filters = lockedCategory
    ? { ...filters, category: lockedCategory }
    : filters;

  const results = useMemo(
    () => filterAndSort(products, effectiveFilters, sort),
    [products, effectiveFilters, sort]
  );

  const shown = results.slice(0, visible);
  const hasMore = visible < results.length;

  // Active-filter chips (excludes locked category).
  const chips = useMemo(() => {
    const list: { label: string; remove: () => void }[] = [];
    if (!lockedCategory && filters.category && filters.category !== 'all') {
      list.push({
        label: filters.category,
        remove: () => setFilters({ ...filters, category: 'all' }),
      });
    }
    filters.sizes?.forEach((s) =>
      list.push({
        label: `Size ${s}`,
        remove: () => setFilters({ ...filters, sizes: filters.sizes!.filter((x) => x !== s) }),
      })
    );
    filters.colors?.forEach((c) =>
      list.push({
        label: c,
        remove: () => setFilters({ ...filters, colors: filters.colors!.filter((x) => x !== c) }),
      })
    );
    filters.badges?.forEach((b) =>
      list.push({
        label: b,
        remove: () => setFilters({ ...filters, badges: filters.badges!.filter((x) => x !== b) }),
      })
    );
    if (typeof filters.maxPrice === 'number' && filters.maxPrice < facets.maxPrice) {
      list.push({
        label: `Up to $${filters.maxPrice}`,
        remove: () => setFilters({ ...filters, maxPrice: undefined }),
      });
    }
    if (filters.inStockOnly) {
      list.push({
        label: 'In stock',
        remove: () => setFilters({ ...filters, inStockOnly: false }),
      });
    }
    return list;
  }, [filters, lockedCategory, facets.maxPrice, setFilters]);

  return (
    <div>
      <FilterBar
        facets={facets}
        categories={categories}
        filters={filters}
        sort={sort}
        resultCount={results.length}
        showCategory={!lockedCategory}
        onFilters={setFilters}
        onSort={setSort}
        onReset={reset}
      />

      <div className="shell pb-9 pt-6">
        {chips.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <AnimatePresence initial={false}>
              {chips.map((chip) => (
                <motion.button
                  key={chip.label}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  type="button"
                  onClick={chip.remove}
                  aria-label={`Remove filter ${chip.label}`}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-ink/20 bg-paper',
                    'px-3 py-1 font-mono text-caption uppercase tracking-[0.08em] capitalize text-ink',
                    'transition-colors duration-micro ease-house hover:border-ink hover:bg-ink/5'
                  )}
                >
                  {chip.label}
                  <span aria-hidden className="text-muted">
                    ✕
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
            <button
              type="button"
              onClick={reset}
              className="ml-1 font-mono text-caption uppercase tracking-[0.08em] text-muted underline-offset-4 hover:text-ink hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {results.length === 0 ? (
          <EmptyState
            title="Nothing matches those filters"
            body="Loosen a constraint or two and the catalogue will open back up. Clearing the filters brings everything back."
            actionLabel="Clear filters"
            actionHref={pathname}
          />
        ) : (
          <>
            <ProductGrid products={shown} priorityCount={4} />
            {hasMore && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="font-mono text-caption tabular-nums text-muted">
                  Showing {shown.length} of {results.length}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setVisible((v) => v + PAGE)}
                >
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
