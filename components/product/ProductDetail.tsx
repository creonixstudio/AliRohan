'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-store';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Accordion } from '@/components/ui/Accordion';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ColorSwatch } from '@/components/product/ColorSwatch';
import { SizeSelector } from '@/components/product/SizeSelector';
import { Gallery } from '@/components/product/Gallery';
import { QuantityStepper } from '@/components/product/QuantityStepper';
import { ProductCard } from '@/components/product/ProductCard';
import { Product3DViewer } from '@/components/three/Product3DViewer';
import { MotionReveal } from '@/components/motion/MotionReveal';

export function ProductDetail({
  product,
  recommendations,
}: {
  product: Product;
  recommendations: Product[];
}) {
  const add = useCart((s) => s.add);
  const { toast } = useToast();

  const [color, setColor] = useState(product.colors[0]?.name ?? '');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);

  const selectedColor = useMemo(
    () => product.colors.find((c) => c.name === color) ?? product.colors[0],
    [product.colors, color]
  );

  const canAdd = size !== '';

  function handleAdd() {
    if (!canAdd) return;
    // add() also opens the cart drawer (see cart-store)
    add(product, size, color, qty);
    toast('Added to bag');
  }

  const trail = [
    { label: 'Shop', href: '/shop' },
    { label: product.category, href: `/shop?category=${product.category}` },
    { label: product.name },
  ];

  return (
    <div className="shell pb-9 pt-[120px]">
      <div className="grid gap-7 lg:grid-cols-golden lg:items-start lg:gap-9">
        {/* LEFT — sticky gallery (61.8%) */}
        <div className="lg:sticky lg:top-[100px] lg:self-start">
          {product.has3D ? (
            <Product3DViewer
              fallbackImage={product.images[0]?.url ?? ''}
              alt={product.images[0]?.alt ?? product.name}
              colorHex={selectedColor?.hex ?? '#000000'}
            />
          ) : (
            <Gallery images={product.images} name={product.name} />
          )}
        </div>

        {/* RIGHT — scrolling detail panel (38.2%) */}
        <div className="flex flex-col gap-6">
          <Breadcrumbs trail={trail} />

          <header className="flex flex-col gap-3">
            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.badges.map((b) => (
                  <Badge key={b} kind={b} />
                ))}
              </div>
            )}
            <h1 className="font-display text-h2 leading-tight">{product.name}</h1>
            <p className="font-mono text-h4 tabular-nums">{formatPrice(product.price)}</p>
            <p className="max-w-prose text-muted">{product.description}</p>
          </header>

          {/* Colour */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Colour</span>
              <span className="font-mono text-caption text-muted">{color}</span>
            </div>
            <ColorSwatch colors={product.colors} selected={color} onSelect={setColor} />
          </div>

          {/* Size */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Size</span>
              <a
                href="#sizing"
                className="font-mono text-caption text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Size guide
              </a>
            </div>
            <SizeSelector sizes={product.sizes} selected={size} onSelect={setSize} />
            {!canAdd && (
              <p className="font-mono text-caption text-muted" aria-live="polite">
                Select a size to continue.
              </p>
            )}
          </div>

          {/* Quantity + add */}
          <div className="flex flex-col gap-3">
            <span className="eyebrow">Quantity</span>
            <div className="flex flex-wrap items-center gap-3">
              <QuantityStepper value={qty} onChange={setQty} min={1} max={10} />
              <Button
                variant="signature"
                size="lg"
                onClick={handleAdd}
                disabled={!canAdd}
                className="flex-1"
              >
                {canAdd ? `Add to bag — ${formatPrice(product.price * qty)}` : 'Select a size'}
              </Button>
            </div>
            <p className="font-mono text-caption text-muted">
              Free shipping over {formatPrice(250)} · 30-day returns
            </p>
          </div>

          {/* Accordions */}
          <div id="sizing" className="mt-2">
            <Accordion
              items={[
                {
                  title: 'Details',
                  content: (
                    <ul className="flex flex-col gap-1.5">
                      {product.details.map((d) => (
                        <li key={d} className="flex gap-2">
                          <span aria-hidden className="text-muted">
                            —
                          </span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  ),
                },
                { title: 'Care', content: <p>{product.care}</p> },
                {
                  title: 'Sizing',
                  content: (
                    <p>
                      Pieces run true to size with a considered, relaxed cut. Between sizes? Size
                      down for a closer fit, up for room. Measurements on request — write to the
                      studio.
                    </p>
                  ),
                },
                {
                  title: 'Shipping & returns',
                  content: (
                    <p>
                      Ships within two business days. Free shipping over {formatPrice(250)};
                      otherwise a flat $12. Return unworn pieces within 30 days for a full refund.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="mt-9" aria-label="You may also like">
          <MotionReveal>
            <p className="eyebrow mb-2">More to consider</p>
            <h2 className="mb-6 font-display text-h2">You may also like</h2>
          </MotionReveal>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-x-4">
            {recommendations.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
