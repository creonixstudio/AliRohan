import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="shell flex min-h-[70vh] flex-col items-center justify-center py-9 pt-[120px] text-center"
    >
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="font-display text-mega leading-none">Off the rail</h1>
      <p className="mt-5 max-w-prose text-lead text-muted">
        The page you were after isn&rsquo;t here — it may have moved, sold
        through, or never existed. No harm done. Here&rsquo;s the way back.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button href="/shop" variant="primary">
          Browse the shop
        </Button>
        <Button href="/" variant="outline">
          Return home
        </Button>
      </div>
    </main>
  );
}
