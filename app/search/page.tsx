import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchView } from '@/components/search/SearchView';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search the VESTRA catalogue by name, category or colour.',
};

// useSearchParams needs a client boundary; mark dynamic so it never prerenders
// with stale params.
export const dynamic = 'force-dynamic';

function SearchFallback() {
  return (
    <div className="shell pb-9 pt-[120px]">
      <p className="eyebrow mb-2">Search</p>
      <h1 className="font-display text-h1">Find a piece</h1>
      <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 md:gap-x-4 md:gap-y-7 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <main id="main">
      <Suspense fallback={<SearchFallback />}>
        <SearchView />
      </Suspense>
    </main>
  );
}
