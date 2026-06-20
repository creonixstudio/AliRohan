export type Category =
  | 'outerwear'
  | 'knitwear'
  | 'shirts'
  | 'trousers'
  | 'denim'
  | 'dresses'
  | 'footwear'
  | 'bags'
  | 'accessories'
  | 'tops'
  | 'skirts';

export type Badge = 'new' | 'limited' | 'last-few' | 'restock';

export type ProductImage = {
  url: string;
  alt: string;
  aspect: '3:4' | '1:1' | '4:5';
};

export type ProductColor = { name: string; hex: string };

export type ProductSize = { label: string; inStock: boolean };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  currency: 'USD';
  description: string;
  details: string[];
  care: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  images: ProductImage[];
  badges?: Badge[];
  has3D?: boolean;
  modelUrl?: string;
  collectionSlug?: string;
  popularity: number;
};

export type Collection = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  season: string;
};

export type CartItem = {
  key: string; // productId + size + color
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

export type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'popularity';
