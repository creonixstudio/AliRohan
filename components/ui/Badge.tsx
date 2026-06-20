import { cn } from '@/lib/utils';
import type { Badge as BadgeType } from '@/lib/types';

const LABELS: Record<BadgeType, string> = {
  new: 'New',
  limited: 'Limited',
  'last-few': 'Last few',
  restock: 'Back in stock',
};

const STYLES: Record<BadgeType, string> = {
  new: 'bg-ink text-paper',
  limited: 'bg-signature text-paper',
  'last-few': 'bg-accent2 text-paper',
  restock: 'border border-ink/30 text-ink',
};

export function Badge({
  kind,
  className,
}: {
  kind: BadgeType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] rounded-[var(--radius)]',
        STYLES[kind],
        className
      )}
    >
      {LABELS[kind]}
    </span>
  );
}
