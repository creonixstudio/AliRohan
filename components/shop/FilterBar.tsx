'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Category, SortKey } from '@/lib/types';
import type { Filters } from '@/lib/products';
import { SortSelect } from './SortSelect';
import { PriceRange } from './PriceRange';

type Facets = {
  colors: { name: string; hex: string }[];
  sizes: string[];
  maxPrice: number;
};

const BADGES: { value: string; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'limited', label: 'Limited' },
  { value: 'last-few', label: 'Last few' },
  { value: 'restock', label: 'Restocked' },
];

function toggle(list: string[] | undefined, value: string): string[] {
  const set = new Set(list ?? []);
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return [...set];
}

function Pill({
  active,
  onClick,
  children,
  ariaLabel,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className={cn(
        'rounded-[var(--radius)] border px-3 py-1.5 font-mono text-caption uppercase tracking-[0.08em]',
        'transition-colors duration-micro ease-house',
        active
          ? 'border-ink bg-ink text-paper'
          : 'border-ink/20 text-ink hover:border-ink'
      )}
    >
      {children}
    </button>
  );
}

export function FilterBar({
  facets,
  categories,
  filters,
  sort,
  resultCount,
  showCategory = true,
  onFilters,
  onSort,
  onReset,
}: {
  facets: Facets;
  categories: Category[];
  filters: Filters;
  sort: SortKey;
  resultCount: number;
  /** Hide the category control on category-scoped pages. */
  showCategory?: boolean;
  onFilters: (next: Filters) => void;
  onSort: (next: SortKey) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const set = (patch: Partial<Filters>) => onFilters({ ...filters, ...patch });

  const activeFilterCount =
    (filters.sizes?.length ?? 0) +
    (filters.colors?.length ?? 0) +
    (filters.badges?.length ?? 0) +
    (filters.inStockOnly ? 1 : 0) +
    (typeof filters.maxPrice === 'number' && filters.maxPrice < facets.maxPrice ? 1 : 0) +
    (showCategory && filters.category && filters.category !== 'all' ? 1 : 0);

  return (
    <div className="sticky top-[64px] z-30 -mx-[var(--shell-x,1rem)] border-b border-line bg-paper/90 backdrop-blur-sm sm:top-[72px]">
      <div className="shell flex items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="filter-panel"
            className={cn(
              'inline-flex items-center gap-2 rounded-[var(--radius)] border px-4 py-2',
              'font-mono text-caption uppercase tracking-[0.08em] transition-colors duration-micro ease-house',
              open || activeFilterCount > 0
                ? 'border-ink text-ink'
                : 'border-ink/20 text-ink hover:border-ink'
            )}
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5">
              <path
                d="M3 6h18M6 12h12M10 18h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-signature px-1.5 text-paper">
                {activeFilterCount}
              </span>
            )}
          </button>
          <span className="font-mono text-caption tabular-nums text-muted">
            {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}
          </span>
        </div>

        <SortSelect value={sort} onChange={onSort} />
      </div>

      {open && (
        <div id="filter-panel" className="border-t border-line bg-paper">
          <div className="shell grid gap-6 py-6 md:grid-cols-2 lg:grid-cols-4">
            {showCategory && (
              <fieldset className="flex flex-col gap-3">
                <legend className="eyebrow mb-1">Category</legend>
                <div className="flex flex-wrap gap-2">
                  <Pill
                    active={!filters.category || filters.category === 'all'}
                    onClick={() => set({ category: 'all' })}
                  >
                    All
                  </Pill>
                  {categories.map((c) => (
                    <Pill
                      key={c}
                      active={filters.category === c}
                      onClick={() => set({ category: c })}
                    >
                      {c}
                    </Pill>
                  ))}
                </div>
              </fieldset>
            )}

            <fieldset className="flex flex-col gap-3">
              <legend className="eyebrow mb-1">Size</legend>
              <div className="flex flex-wrap gap-2">
                {facets.sizes.map((s) => (
                  <Pill
                    key={s}
                    active={filters.sizes?.includes(s) ?? false}
                    onClick={() => set({ sizes: toggle(filters.sizes, s) })}
                  >
                    {s}
                  </Pill>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-3">
              <legend className="eyebrow mb-1">Color</legend>
              <div className="flex flex-wrap gap-2">
                {facets.colors.map((c) => {
                  const active = filters.colors?.includes(c.name) ?? false;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => set({ colors: toggle(filters.colors, c.name) })}
                      aria-pressed={active}
                      aria-label={c.name}
                      title={c.name}
                      className={cn(
                        'h-7 w-7 rounded-full border transition-transform duration-micro ease-house',
                        active
                          ? 'border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper'
                          : 'border-ink/20 hover:scale-110'
                      )}
                      style={{ backgroundColor: c.hex }}
                    />
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-col gap-4">
              <fieldset className="flex flex-col gap-3">
                <legend className="eyebrow mb-1">Price</legend>
                <PriceRange
                  max={facets.maxPrice}
                  value={filters.maxPrice ?? facets.maxPrice}
                  onChange={(v) => set({ maxPrice: v })}
                />
              </fieldset>

              <label className="flex cursor-pointer items-center gap-2 font-mono text-caption uppercase tracking-[0.08em] text-ink">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly ?? false}
                  onChange={(e) => set({ inStockOnly: e.target.checked })}
                  className="h-4 w-4 accent-signature"
                />
                In stock only
              </label>
            </div>

            <fieldset className="flex flex-col gap-3 lg:col-span-4">
              <legend className="eyebrow mb-1">Badges</legend>
              <div className="flex flex-wrap gap-2">
                {BADGES.map((b) => (
                  <Pill
                    key={b.value}
                    active={filters.badges?.includes(b.value) ?? false}
                    onClick={() => set({ badges: toggle(filters.badges, b.value) })}
                  >
                    {b.label}
                  </Pill>
                ))}
              </div>
            </fieldset>

            <div className="flex items-center justify-end lg:col-span-4">
              <button
                type="button"
                onClick={onReset}
                disabled={activeFilterCount === 0}
                className="font-mono text-caption uppercase tracking-[0.08em] text-muted underline-offset-4 hover:text-ink hover:underline disabled:opacity-40"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
