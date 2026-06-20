'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { useMounted } from '@/lib/use-mounted';
import { formatPrice } from '@/lib/utils';
import { img, BLUR_DATA_URL } from '@/lib/images';
import { site } from '@/lib/site.config';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { QuantityStepper } from '@/components/product/QuantityStepper';
import { useToast } from '@/components/ui/Toast';

const FLAT_SHIPPING = 12;
const PROMO_CODE = 'STUDIO10';
const PROMO_RATE = 0.1;

export function CartView() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const undoRemove = useCart((s) => s.undoRemove);
  const subtotalFn = useCart((s) => s.subtotal);
  const { toast } = useToast();

  const mounted = useMounted();

  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Until the persisted cart rehydrates, render a neutral placeholder that
  // matches the server output (avoids hydration mismatch + empty-state flash).
  if (!mounted) {
    return (
      <div className="shell pb-9 pt-[120px]">
        <Skeleton className="mb-7 h-12 w-48" />
        <div className="grid gap-8 lg:grid-cols-golden lg:gap-9">
          <div className="flex flex-col gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="aspect-square w-20 sm:w-24" />
                <div className="flex-1 space-y-2 py-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="shell pb-9 pt-[120px]">
        <EmptyState
          title="Your bag is empty"
          body="Nothing here yet. Browse the latest pieces and add something you'll wear for years."
          actionLabel="Continue shopping"
          actionHref="/shop"
        />
      </div>
    );
  }

  const subtotal = subtotalFn();
  const discount = promoApplied ? subtotal * PROMO_RATE : 0;
  const discountedSubtotal = subtotal - discount;
  const qualifiesFreeShipping = discountedSubtotal >= site.freeShippingThreshold;
  const shipping = qualifiesFreeShipping ? 0 : FLAT_SHIPPING;
  const total = discountedSubtotal + shipping;
  const remaining = Math.max(0, site.freeShippingThreshold - discountedSubtotal);

  function handleRemove(key: string, name: string) {
    remove(key);
    toast(`${name} removed`, {
      label: 'Undo',
      onClick: () => undoRemove(),
    });
  }

  function handlePromo(e: React.FormEvent) {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (code === PROMO_CODE) {
      setPromoApplied(true);
      setPromoError('');
      toast('Promo applied — 10% off');
    } else {
      setPromoApplied(false);
      setPromoError(`"${promoInput.trim()}" isn't a valid code.`);
    }
  }

  return (
    <div className="shell pb-9 pt-[120px]">
      <header className="mb-7">
        <p className="eyebrow mb-2">Your bag</p>
        <h1 className="font-display text-h1">
          Bag <span className="text-muted">({items.length})</span>
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-golden lg:items-start lg:gap-9">
        {/* Line items */}
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.key} className="flex gap-4 py-5">
              <Link
                href={`/product/${item.slug}`}
                className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-[var(--radius)] bg-clay/40 sm:w-24"
              >
                <Image
                  src={img(item.image, 'thumb')}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-body font-medium">
                      <Link href={`/product/${item.slug}`} className="link-underline">
                        {item.name}
                      </Link>
                    </h2>
                    <p className="mt-0.5 font-mono text-caption text-muted">
                      {item.color} · {item.size}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-body tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(v) => setQty(item.key, v)}
                    min={1}
                    max={10}
                  />
                  <button
                    onClick={() => handleRemove(item.key, item.name)}
                    className="font-mono text-caption uppercase tracking-[0.1em] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-[100px]">
          <div className="rounded-[var(--radius)] border border-line p-6">
            <h2 className="mb-4 font-display text-h4">Summary</h2>

            <dl className="flex flex-col gap-2.5 text-body">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-mono tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-signature">
                  <dt>Promo ({PROMO_CODE})</dt>
                  <dd className="font-mono tabular-nums">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Estimated shipping</dt>
                <dd className="font-mono tabular-nums">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </dd>
              </div>
            </dl>

            {!qualifiesFreeShipping && remaining > 0 && (
              <p className="mt-3 font-mono text-caption text-muted">
                Add {formatPrice(remaining)} for free shipping.
              </p>
            )}

            <div className="mt-4 flex justify-between border-t border-line pt-4 text-h4">
              <span className="font-display">Total</span>
              <span className="font-mono tabular-nums">{formatPrice(total)}</span>
            </div>

            {/* Promo */}
            <form onSubmit={handlePromo} className="mt-5 flex flex-col gap-2">
              <label htmlFor="promo" className="eyebrow">
                Promo code
              </label>
              <div className="flex gap-2">
                <input
                  id="promo"
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="STUDIO10"
                  autoComplete="off"
                  aria-invalid={!!promoError}
                  aria-describedby={promoError ? 'promo-msg' : undefined}
                  className="h-11 min-w-0 flex-1 rounded-[var(--radius)] border border-ink/25 bg-paper px-3 font-mono text-caption uppercase tracking-[0.1em] outline-none focus-visible:border-ink"
                />
                <Button type="submit" variant="outline" disabled={!promoInput.trim()}>
                  Apply
                </Button>
              </div>
              {promoError && (
                <p id="promo-msg" className="font-mono text-caption text-accent2" aria-live="polite">
                  {promoError}
                </p>
              )}
              {promoApplied && !promoError && (
                <p
                  id="promo-msg"
                  className="font-mono text-caption text-signature"
                  aria-live="polite"
                >
                  10% off applied.
                </p>
              )}
            </form>

            <Button href="/checkout" variant="signature" size="lg" className="mt-5 w-full">
              Proceed to checkout
            </Button>
          </div>

          <Link
            href="/shop"
            className="text-center font-mono text-caption uppercase tracking-[0.12em] text-muted hover:text-ink"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
