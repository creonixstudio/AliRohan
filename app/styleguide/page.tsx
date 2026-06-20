import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Styleguide',
  description: 'The VESTRA design system — golden-ratio type scale, color tokens and components.',
};

const TYPE_SCALE: { name: string; rem: string; sample: string }[] = [
  { name: 'mega', rem: '6.854rem', sample: 'Aa' },
  { name: 'h1', rem: '4.236rem', sample: 'Aa' },
  { name: 'h2', rem: '2.618rem', sample: 'Considered apparel' },
  { name: 'h3', rem: '2.058rem', sample: 'Considered apparel' },
  { name: 'h4', rem: '1.618rem', sample: 'Considered apparel' },
  { name: 'lead', rem: '1.272rem', sample: 'Considered apparel, made to last.' },
  { name: 'body', rem: '1rem', sample: 'Considered apparel, made to be worn for years.' },
  { name: 'caption', rem: '0.764rem', sample: 'Considered apparel, made to be worn for years.' },
];

const TYPE_CLASS: Record<string, string> = {
  mega: 'text-mega',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  h4: 'text-h4',
  lead: 'text-lead',
  body: 'text-body',
  caption: 'text-caption',
};

const COLORS: { name: string; token: string; hex: string; swatch: string; ink?: boolean }[] = [
  { name: 'Ink', token: 'ink', hex: '#1a1714', swatch: 'bg-ink' },
  { name: 'Paper', token: 'paper', hex: '#e9e6de', swatch: 'bg-paper', ink: true },
  { name: 'Clay', token: 'clay', hex: '#d4cec3', swatch: 'bg-clay', ink: true },
  { name: 'Signature', token: 'signature', hex: '#6e2b2b', swatch: 'bg-signature' },
  { name: 'Accent 2', token: 'accent2', hex: '#36433b', swatch: 'bg-accent2' },
  { name: 'Muted', token: 'muted', hex: '#6b6357', swatch: 'bg-muted' },
];

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-7" aria-label={title}>
      <header className="mb-6">
        <p className="eyebrow mb-2">{label}</p>
        <h2 className="font-display text-h3 leading-tight">{title}</h2>
      </header>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <main id="main" className="shell pb-9 pt-[120px]">
      <header className="max-w-prose">
        <p className="eyebrow mb-3">Milestone 1</p>
        <h1 className="font-display text-h1 leading-[1.02]">Styleguide</h1>
        <p className="mt-4 text-lead text-muted">
          The design system that every page derives from — a golden-ratio type
          scale (φ ≈ 1.618), a darkroom-editorial palette, and the shared
          component primitives.
        </p>
      </header>

      <Section label="Typography" title="Golden-ratio type scale">
        <ul className="flex flex-col divide-y divide-line">
          {TYPE_SCALE.map((t) => (
            <li
              key={t.name}
              className="flex flex-col gap-2 py-5 md:flex-row md:items-baseline md:gap-6"
            >
              <div className="flex shrink-0 items-baseline gap-3 md:w-48">
                <code className="font-mono text-caption text-ink">text-{t.name}</code>
                <span className="font-mono text-caption text-muted">{t.rem}</span>
              </div>
              <p className={`${TYPE_CLASS[t.name]} font-display leading-none`}>
                {t.sample}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Color" title="Palette tokens">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {COLORS.map((c) => (
            <li key={c.token}>
              <div
                className={`flex aspect-[4/5] items-end rounded-[var(--radius)] border border-line p-3 ${c.swatch} ${
                  c.ink ? 'text-ink' : 'text-paper'
                }`}
              >
                <span className="font-mono text-caption">{c.hex}</span>
              </div>
              <p className="mt-2 text-body font-medium">{c.name}</p>
              <code className="font-mono text-caption text-muted">{c.token}</code>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Components" title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="signature">Signature</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </Section>

      <Section label="Components" title="Badges">
        <div className="flex flex-wrap items-center gap-3">
          <Badge kind="new" />
          <Badge kind="limited" />
          <Badge kind="last-few" />
          <Badge kind="restock" />
        </div>
      </Section>
    </main>
  );
}
