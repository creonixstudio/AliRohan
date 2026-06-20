import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts, getRecommendations } from '@/lib/products';
import { img } from '@/lib/images';
import { formatPrice } from '@/lib/utils';
import { site } from '@/lib/site.config';
import { ProductDetail } from '@/components/product/ProductDetail';

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return { title: 'Product not found' };
  }

  const ogImage = img(product.images[0]?.url ?? '', 'full');
  const description = `${product.description} ${formatPrice(product.price)}.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} · ${site.name}`,
      description,
      type: 'website',
      images: ogImage
        ? [{ url: ogImage, alt: product.images[0]?.alt ?? product.name }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default function ProductPage({ params }: Params) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const recommendations = getRecommendations(product, 4);

  return <ProductDetail product={product} recommendations={recommendations} />;
}
