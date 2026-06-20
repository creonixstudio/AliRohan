import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { site } from '@/lib/site.config';

export const metadata: Metadata = {
  title: 'Order confirmed',
  description: 'Thank you for your order.',
  robots: { index: false, follow: false },
};

function estimatedDelivery(): string {
  const start = new Date();
  start.setDate(start.getDate() + 3);
  const end = new Date();
  end.setDate(end.getDate() + 7);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const order = searchParams.order;

  return (
    <div className="shell pb-9 pt-[120px]">
      <div className="mx-auto flex max-w-prose flex-col items-center gap-5 py-8 text-center">
        <div className="h-px w-12 bg-ink/30" />
        <p className="eyebrow">Order confirmed</p>

        {order ? (
          <>
            <h1 className="font-display text-h1 leading-tight">Thank you — your order's in.</h1>
            <p className="text-muted">
              We've received your order and emailed a confirmation. Everything is cut and packed by
              hand at the studio, so give us a moment to do it properly.
            </p>

            <div className="mt-2 flex flex-col items-center gap-1 rounded-[var(--radius)] border border-line px-8 py-5">
              <span className="eyebrow">Order number</span>
              <span className="font-mono text-h3 tabular-nums">{order}</span>
            </div>

            <dl className="mt-2 flex flex-col gap-1 font-mono text-caption text-muted">
              <div className="flex items-center justify-center gap-2">
                <dt>Estimated delivery:</dt>
                <dd className="text-ink">{estimatedDelivery()}</dd>
              </div>
              <div className="flex items-center justify-center gap-2">
                <dt>Questions?</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="text-ink link-underline">
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>

            <Button href="/shop" variant="signature" size="lg" className="mt-4">
              Continue shopping
            </Button>
          </>
        ) : (
          <>
            <h1 className="font-display text-h1 leading-tight">No order to show here.</h1>
            <p className="text-muted">
              We couldn't find an order reference. If you just placed one, check your email for the
              confirmation — otherwise, pick up where you left off.
            </p>
            <Button href="/shop" variant="outline" size="lg" className="mt-2">
              Continue shopping
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
