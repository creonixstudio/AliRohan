'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-store';
import { img } from '@/lib/images';
import { formatPrice } from '@/lib/utils';
import { site } from '@/lib/site.config';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/product/QuantityStepper';
import { useToast } from '@/components/ui/Toast';

export function CartDrawer() {
  const { isOpen, close, items, setQty, remove, undoRemove } = useCart();
  const subtotal = useCart((s) => s.subtotal());
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  const remaining = Math.max(0, site.freeShippingThreshold - subtotal);

  function handleRemove(key: string, name: string) {
    remove(key);
    toast(`${name} removed`, { label: 'Undo', onClick: undoRemove });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="Shopping bag">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl outline-none"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-h4">Your bag ({items.length})</h2>
              <button onClick={close} aria-label="Close bag" className="text-caption uppercase tracking-[0.12em] hover:text-signature">
                Close
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-muted">Your bag is empty.</p>
                <Button href="/shop" variant="outline" onClick={close}>
                  Start browsing
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5">
                  {remaining > 0 ? (
                    <p className="border-b border-line py-3 text-caption text-muted">
                      You’re {formatPrice(remaining)} away from free shipping.
                    </p>
                  ) : (
                    <p className="border-b border-line py-3 text-caption text-accent2">
                      You’ve unlocked free shipping.
                    </p>
                  )}
                  <ul className="divide-y divide-line">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.key}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="flex gap-3 overflow-hidden py-4"
                        >
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={close}
                            className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-[var(--radius)] bg-clay/40"
                          >
                            <Image src={img(item.image, 'thumb')} alt={item.name} fill sizes="80px" className="object-cover" />
                          </Link>
                          <div className="flex flex-1 flex-col">
                            <div className="flex justify-between gap-2">
                              <h3 className="text-body font-medium leading-tight">{item.name}</h3>
                              <span className="font-mono text-caption tabular-nums">{formatPrice(item.price)}</span>
                            </div>
                            <p className="mt-0.5 font-mono text-caption text-muted">
                              {item.color} · {item.size}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <QuantityStepper value={item.quantity} onChange={(v) => setQty(item.key, v)} />
                              <button
                                onClick={() => handleRemove(item.key, item.name)}
                                className="font-mono text-caption text-muted underline-offset-4 hover:text-signature hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                <div className="border-t border-line px-5 py-4">
                  <div className="flex items-center justify-between pb-3">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-mono text-lead tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <Button href="/checkout" size="lg" className="w-full" onClick={close}>
                    Proceed to checkout
                  </Button>
                  <Link
                    href="/cart"
                    onClick={close}
                    className="mt-2 block text-center font-mono text-caption uppercase tracking-[0.12em] text-muted hover:text-ink"
                  >
                    View full bag
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
