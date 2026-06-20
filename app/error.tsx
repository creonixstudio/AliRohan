'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for diagnostics; replace with real logging in production.
    console.error(error);
  }, [error]);

  return (
    <main
      id="main"
      className="shell flex min-h-[70vh] flex-col items-center justify-center py-9 pt-[120px] text-center"
    >
      <p className="eyebrow mb-4">Something broke</p>
      <h1 className="font-display text-h1 leading-[1.02]">A seam came loose</h1>
      <p className="mt-5 max-w-prose text-lead text-muted">
        An unexpected error stopped this page from loading. Apologies — this one
        is on us. Try again, and if it keeps happening, head back home.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-caption text-muted">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()} variant="primary">
          Try again
        </Button>
        <Button href="/" variant="outline">
          Return home
        </Button>
      </div>
    </main>
  );
}
