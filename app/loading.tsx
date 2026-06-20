import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div
      className="shell pb-9 pt-[120px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading</span>

      {/* Header block */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-1/2 max-w-sm" />
      </div>

      {/* PLP grid */}
      <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 md:gap-x-4 md:gap-y-7 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
