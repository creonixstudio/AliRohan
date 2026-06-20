import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { collections } from '@/lib/collections';
import { img, BLUR_DATA_URL } from '@/lib/images';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MotionReveal } from '@/components/motion/MotionReveal';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Edits built around a way of dressing, not a season. Browse the VESTRA collections.',
};

export default function CollectionsPage() {
  return (
    <main id="main" className="shell pb-9 pt-[120px]">
      <Breadcrumbs trail={[{ label: 'Home', href: '/' }, { label: 'Collections' }]} />

      <header className="mt-5 max-w-prose">
        <MotionReveal>
          <p className="eyebrow mb-3">Collections</p>
          <h1 className="font-display text-h1 leading-[1.02]">Edits, not seasons</h1>
          <p className="mt-4 text-lead text-muted">
            Each collection is built around a way of dressing rather than a date on
            the calendar. Pieces designed to be worn together, and to outlast the
            edit they arrived in.
          </p>
        </MotionReveal>
      </header>

      <ul className="mt-7 grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2">
        {collections.map((c, i) => (
          <MotionReveal as="li" key={c.slug} delay={(i % 2) * 0.08}>
            <Link href={`/collections/${c.slug}`} className="group block">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius)] bg-clay/40">
                <Image
                  src={img(c.coverImage, 'card', { w: 900 })}
                  alt={`${c.title} collection — editorial cover`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-comp ease-house group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  priority={i < 2}
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h2 className="font-display text-h3 leading-tight">
                  <span className="link-underline">{c.title}</span>
                </h2>
                <span className="eyebrow shrink-0">{c.season}</span>
              </div>
              <p className="mt-1 text-body text-muted">{c.subtitle}</p>
            </Link>
          </MotionReveal>
        ))}
      </ul>
    </main>
  );
}
