import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { collections, getCollection } from '@/lib/collections';
import { getAllProducts, getFeatured } from '@/lib/products';
import { img, BLUR_DATA_URL } from '@/lib/images';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LookbookView } from '@/components/collections/LookbookView';

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const collection = getCollection(params.slug);
  if (!collection) return { title: 'Collection not found' };
  return {
    title: collection.title,
    description: collection.description,
    openGraph: {
      title: collection.title,
      description: collection.description,
      images: [{ url: img(collection.coverImage, 'full') }],
    },
  };
}

export default function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const collection = getCollection(params.slug);
  if (!collection) notFound();

  const matched = getAllProducts().filter(
    (p) => p.collectionSlug === collection.slug
  );
  const products = matched.length >= 4 ? matched : getFeatured(8);

  return (
    <main id="main" className="pt-[120px]">
      {/* Hero */}
      <header className="shell">
        <Breadcrumbs
          trail={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/collections' },
            { label: collection.title },
          ]}
        />

        <div className="mt-5 max-w-prose">
          <p className="eyebrow mb-3">{collection.season}</p>
          <h1 className="font-display text-h1 leading-[1.02]">{collection.title}</h1>
          <p className="mt-4 text-lead text-muted">{collection.description}</p>
        </div>

        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-[var(--radius)] bg-clay/40">
          <Image
            src={img(collection.coverImage, 'full')}
            alt={`${collection.title} — collection lookbook cover`}
            fill
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            priority
          />
        </div>
      </header>

      <LookbookView collection={collection} products={products} />
    </main>
  );
}
