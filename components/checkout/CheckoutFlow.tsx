'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { img, BLUR_DATA_URL } from '@/lib/images';
import { site } from '@/lib/site.config';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

const FLAT_SHIPPING = 12;

type StepId = 'contact' | 'shipping' | 'payment' | 'review';
const STEPS: { id: StepId; label: string }[] = [
  { id: 'contact', label: 'Contact' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postal: string;
  country: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const EMPTY: FormData = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postal: '',
  country: '',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

type Errors = Partial<Record<keyof FormData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(label: string, props: React.InputHTMLAttributes<HTMLInputElement>, error?: string) {
  const id = props.id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      <input
        {...props}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className="h-11 w-full rounded-[var(--radius)] border border-ink/25 bg-paper px-3 text-body outline-none transition-colors focus-visible:border-ink"
      />
      {error && (
        <p id={`${id}-err`} className="font-mono text-caption text-accent2" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckoutFlow() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotalFn = useCart((s) => s.subtotal);
  const clear = useCart((s) => s.clear);

  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);

  if (items.length === 0 && !placing) {
    return (
      <div className="shell pb-9 pt-[120px]">
        <EmptyState
          title="Nothing to check out"
          body="Your bag is empty. Add a piece or two and we'll be ready when you are."
          actionLabel="Continue shopping"
          actionHref="/shop"
        />
      </div>
    );
  }

  const subtotal = subtotalFn();
  const shipping = subtotal >= site.freeShippingThreshold ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  const step = STEPS[stepIndex].id;

  function set<K extends keyof FormData>(key: K, value: string) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateStep(current: StepId): Errors {
    const e: Errors = {};
    if (current === 'contact') {
      if (!data.email.trim()) e.email = 'Email is required.';
      else if (!EMAIL_RE.test(data.email.trim())) e.email = 'Enter a valid email address.';
    }
    if (current === 'shipping') {
      if (!data.firstName.trim()) e.firstName = 'Required.';
      if (!data.lastName.trim()) e.lastName = 'Required.';
      if (!data.address.trim()) e.address = 'Required.';
      if (!data.city.trim()) e.city = 'Required.';
      if (!data.postal.trim()) e.postal = 'Required.';
      if (!data.country.trim()) e.country = 'Required.';
    }
    if (current === 'payment') {
      if (!data.cardName.trim()) e.cardName = 'Name on card is required.';
      const digits = data.cardNumber.replace(/\s+/g, '');
      if (!digits) e.cardNumber = 'Card number is required.';
      else if (!/^\d{15,16}$/.test(digits)) e.cardNumber = 'Enter a 15–16 digit demo number.';
      if (!/^\d{2}\s*\/\s*\d{2}$/.test(data.expiry.trim())) e.expiry = 'Use MM/YY.';
      if (!/^\d{3,4}$/.test(data.cvc.trim())) e.cvc = '3–4 digits.';
    }
    return e;
  }

  function next() {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  }

  function back() {
    setErrors({});
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function placeOrder() {
    // Validate everything one last time before placing.
    for (const s of ['contact', 'shipping', 'payment'] as StepId[]) {
      const e = validateStep(s);
      if (Object.keys(e).length > 0) {
        setErrors(e);
        const idx = STEPS.findIndex((st) => st.id === s);
        setStepIndex(idx);
        return;
      }
    }
    setPlacing(true);
    const order = 'VS-' + Math.floor(100000 + Math.random() * 900000).toString();
    clear();
    router.push(`/checkout/success?order=${order}`);
  }

  return (
    <div className="shell pb-9 pt-[120px]">
      <header className="mb-7">
        <p className="eyebrow mb-2">Checkout</p>
        <h1 className="font-display text-h1">Complete your order</h1>
      </header>

      {/* Progress indicator */}
      <ol className="mb-8 flex flex-wrap gap-x-6 gap-y-2" aria-label="Checkout progress">
        {STEPS.map((s, i) => {
          const state = i < stepIndex ? 'done' : i === stepIndex ? 'current' : 'todo';
          return (
            <li key={s.id} className="flex items-center gap-2">
              <span
                aria-hidden
                className={
                  'flex h-6 w-6 items-center justify-center rounded-full font-mono text-[0.7rem] ' +
                  (state === 'current'
                    ? 'bg-signature text-paper'
                    : state === 'done'
                      ? 'bg-ink text-paper'
                      : 'border border-ink/25 text-muted')
                }
              >
                {state === 'done' ? '✓' : i + 1}
              </span>
              <span
                className={
                  'font-mono text-caption uppercase tracking-[0.1em] ' +
                  (state === 'todo' ? 'text-muted' : 'text-ink')
                }
                aria-current={state === 'current' ? 'step' : undefined}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-8 lg:grid-cols-golden lg:items-start lg:gap-9">
        {/* Step form */}
        <div className="flex flex-col gap-6">
          {step === 'contact' && (
            <section className="flex flex-col gap-4" aria-label="Contact details">
              <h2 className="font-display text-h3">Contact</h2>
              <p className="text-muted">We'll send your order confirmation here.</p>
              {field(
                'Email',
                {
                  name: 'email',
                  type: 'email',
                  value: data.email,
                  onChange: (e) => set('email', e.target.value),
                  placeholder: 'you@example.com',
                  autoComplete: 'email',
                },
                errors.email
              )}
            </section>
          )}

          {step === 'shipping' && (
            <section className="flex flex-col gap-4" aria-label="Shipping address">
              <h2 className="font-display text-h3">Shipping</h2>
              <div className="grid grid-cols-2 gap-4">
                {field(
                  'First name',
                  {
                    name: 'firstName',
                    value: data.firstName,
                    onChange: (e) => set('firstName', e.target.value),
                    autoComplete: 'given-name',
                  },
                  errors.firstName
                )}
                {field(
                  'Last name',
                  {
                    name: 'lastName',
                    value: data.lastName,
                    onChange: (e) => set('lastName', e.target.value),
                    autoComplete: 'family-name',
                  },
                  errors.lastName
                )}
              </div>
              {field(
                'Address',
                {
                  name: 'address',
                  value: data.address,
                  onChange: (e) => set('address', e.target.value),
                  autoComplete: 'street-address',
                },
                errors.address
              )}
              <div className="grid grid-cols-2 gap-4">
                {field(
                  'City',
                  {
                    name: 'city',
                    value: data.city,
                    onChange: (e) => set('city', e.target.value),
                    autoComplete: 'address-level2',
                  },
                  errors.city
                )}
                {field(
                  'Postal code',
                  {
                    name: 'postal',
                    value: data.postal,
                    onChange: (e) => set('postal', e.target.value),
                    autoComplete: 'postal-code',
                  },
                  errors.postal
                )}
              </div>
              {field(
                'Country',
                {
                  name: 'country',
                  value: data.country,
                  onChange: (e) => set('country', e.target.value),
                  autoComplete: 'country-name',
                },
                errors.country
              )}
            </section>
          )}

          {step === 'payment' && (
            <section className="flex flex-col gap-4" aria-label="Payment">
              <h2 className="font-display text-h3">Payment</h2>
              <p
                className="rounded-[var(--radius)] border border-signature/40 bg-signature/5 px-4 py-3 font-mono text-caption text-ink"
                role="note"
              >
                Demo only — this is a simulated payment. No card is charged and no real card details
                should be entered.
              </p>
              {field(
                'Name on card',
                {
                  name: 'cardName',
                  value: data.cardName,
                  onChange: (e) => set('cardName', e.target.value),
                  autoComplete: 'cc-name',
                },
                errors.cardName
              )}
              {field(
                'Card number (demo)',
                {
                  name: 'cardNumber',
                  inputMode: 'numeric',
                  value: data.cardNumber,
                  onChange: (e) => set('cardNumber', e.target.value),
                  placeholder: '4242 4242 4242 4242',
                  autoComplete: 'off',
                },
                errors.cardNumber
              )}
              <div className="grid grid-cols-2 gap-4">
                {field(
                  'Expiry (MM/YY)',
                  {
                    name: 'expiry',
                    value: data.expiry,
                    onChange: (e) => set('expiry', e.target.value),
                    placeholder: '12/28',
                    autoComplete: 'off',
                  },
                  errors.expiry
                )}
                {field(
                  'CVC',
                  {
                    name: 'cvc',
                    inputMode: 'numeric',
                    value: data.cvc,
                    onChange: (e) => set('cvc', e.target.value),
                    placeholder: '123',
                    autoComplete: 'off',
                  },
                  errors.cvc
                )}
              </div>
            </section>
          )}

          {step === 'review' && (
            <section className="flex flex-col gap-5" aria-label="Review order">
              <h2 className="font-display text-h3">Review</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[var(--radius)] border border-line p-4">
                  <p className="eyebrow mb-1.5">Contact</p>
                  <p className="text-body">{data.email}</p>
                </div>
                <div className="rounded-[var(--radius)] border border-line p-4">
                  <p className="eyebrow mb-1.5">Ship to</p>
                  <p className="text-body">
                    {data.firstName} {data.lastName}
                    <br />
                    {data.address}
                    <br />
                    {data.city}, {data.postal}
                    <br />
                    {data.country}
                  </p>
                </div>
                <div className="rounded-[var(--radius)] border border-line p-4 sm:col-span-2">
                  <p className="eyebrow mb-1.5">Payment (demo)</p>
                  <p className="text-body">
                    {data.cardName} · card ending{' '}
                    {data.cardNumber.replace(/\s+/g, '').slice(-4) || '----'}
                  </p>
                </div>
              </div>

              <div>
                <p className="eyebrow mb-3">Items</p>
                <ul className="divide-y divide-line border-y border-line">
                  {items.map((item) => (
                    <li key={item.key} className="flex items-center gap-3 py-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[var(--radius)] bg-clay/40">
                        <Image
                          src={img(item.image, 'thumb')}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-body font-medium">{item.name}</p>
                        <p className="font-mono text-caption text-muted">
                          {item.color} · {item.size} · ×{item.quantity}
                        </p>
                      </div>
                      <span className="font-mono text-caption tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {stepIndex > 0 ? (
              <Button variant="ghost" onClick={back} disabled={placing}>
                Back
              </Button>
            ) : (
              <Button variant="ghost" href="/cart">
                Back to bag
              </Button>
            )}

            {step === 'review' ? (
              <Button variant="signature" size="lg" onClick={placeOrder} disabled={placing}>
                {placing ? 'Placing order…' : `Place order — ${formatPrice(total)}`}
              </Button>
            ) : (
              <Button variant="signature" size="lg" onClick={next}>
                Continue
              </Button>
            )}
          </div>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-[100px]">
          <div className="rounded-[var(--radius)] border border-line p-6">
            <h2 className="mb-4 font-display text-h4">Order summary</h2>
            <dl className="flex flex-col gap-2.5 text-body">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-mono tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-mono tabular-nums">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex justify-between border-t border-line pt-4 text-h4">
              <span className="font-display">Total</span>
              <span className="font-mono tabular-nums">{formatPrice(total)}</span>
            </div>
            <p className="mt-4 font-mono text-caption text-muted">
              {items.length} item{items.length === 1 ? '' : 's'} in your bag.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
