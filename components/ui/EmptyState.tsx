import { Button } from './Button';

export function EmptyState({
  title,
  body,
  actionLabel,
  actionHref,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-7 text-center">
      <div className="h-px w-12 bg-ink/30" />
      <h2 className="text-h3 font-display">{title}</h2>
      <p className="max-w-prose text-muted">{body}</p>
      {actionLabel && actionHref && (
        <Button href={actionHref} variant="outline" className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
