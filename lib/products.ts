import productsData from '@/data/products.json';
import type { Product, Category, SortKey } from './types';

const products = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}

export const CATEGORIES: Category[] = [
  'outerwear', 'knitwear', 'shirts', 'tops', 'trousers', 'denim',
  'dresses', 'skirts', 'footwear', 'bags', 'accessories',
];

export function getCategoryCounts(): Record<string, number> {
  return products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
}

/** All distinct colors / sizes across the catalogue, for filter UIs. */
export function getFacets() {
  const colors = new Map<string, string>();
  const sizes = new Set<string>();
  let maxPrice = 0;
  for (const p of products) {
    p.colors.forEach((c) => colors.set(c.name, c.hex));
    p.sizes.forEach((s) => sizes.add(s.label));
    if (p.price > maxPrice) maxPrice = p.price;
  }
  return {
    colors: [...colors.entries()].map(([name, hex]) => ({ name, hex })),
    sizes: [...sizes],
    maxPrice: Math.ceil(maxPrice / 50) * 50,
  };
}

export type Filters = {
  category?: Category | 'all';
  sizes?: string[];
  colors?: string[];
  maxPrice?: number;
  minPrice?: number;
  inStockOnly?: boolean;
  badges?: string[];
};

export function filterAndSort(
  list: Product[],
  filters: Filters,
  sort: SortKey = 'newest'
): Product[] {
  let out = list.filter((p) => {
    if (filters.category && filters.category !== 'all' && p.category !== filters.category)
      return false;
    if (filters.sizes?.length && !p.sizes.some((s) => filters.sizes!.includes(s.label)))
      return false;
    if (filters.colors?.length && !p.colors.some((c) => filters.colors!.includes(c.name)))
      return false;
    if (typeof filters.maxPrice === 'number' && p.price > filters.maxPrice) return false;
    if (typeof filters.minPrice === 'number' && p.price < filters.minPrice) return false;
    if (filters.inStockOnly && !p.sizes.some((s) => s.inStock)) return false;
    if (filters.badges?.length && !p.badges?.some((b) => filters.badges!.includes(b)))
      return false;
    return true;
  });

  switch (sort) {
    case 'price-asc':
      out = out.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      out = out.sort((a, b) => b.price - a.price);
      break;
    case 'popularity':
      out = out.sort((a, b) => b.popularity - a.popularity);
      break;
    case 'newest':
    default:
      out = out.sort((a, b) => {
        const an = a.badges?.includes('new') ? 1 : 0;
        const bn = b.badges?.includes('new') ? 1 : 0;
        return bn - an || b.popularity - a.popularity;
      });
  }
  return out;
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products
    .map((p) => {
      const haystack = `${p.name} ${p.category} ${p.colors.map((c) => c.name).join(' ')} ${p.description}`.toLowerCase();
      let score = 0;
      if (p.name.toLowerCase().includes(q)) score += 5;
      if (p.category.includes(q)) score += 3;
      if (haystack.includes(q)) score += 1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

/** "You may also like" — same category first, then popular, excluding self. */
export function getRecommendations(product: Product, count = 4): Product[] {
  const sameCat = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .sort((a, b) => b.popularity - a.popularity);
  const others = products
    .filter((p) => p.id !== product.id && p.category !== product.category)
    .sort((a, b) => b.popularity - a.popularity);
  return [...sameCat, ...others].slice(0, count);
}

export function getFeatured(count = 6): Product[] {
  return [...products]
    .filter((p) => p.images.length >= 2)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, count);
}
