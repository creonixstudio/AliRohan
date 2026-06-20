/**
 * Generates data/products.json — 100+ products with believable fashion copy.
 * Deterministic (seeded) so the build is reproducible. Run: npm run seed
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { IMAGE_POOL } from '../lib/images';
import type { Product, Category, Badge, ProductColor } from '../lib/types';

// --- tiny seeded RNG (mulberry32) ---
function rng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(20260620);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const pickN = <T,>(arr: T[], n: number) => {
  const c = [...arr];
  const out: T[] = [];
  while (out.length < n && c.length) out.push(c.splice(Math.floor(rand() * c.length), 1)[0]);
  return out;
};
const between = (min: number, max: number) => Math.round(min + rand() * (max - min));

// --- vocab ---
const NAMES: Record<Category, string[]> = {
  outerwear: ['Halsey Overcoat', 'Mertola Field Jacket', 'Aalto Wool Coat', 'Brixton Trench', 'Caldera Parka', 'Norden Chore Coat', 'Vellum Mac', 'Strand Peacoat', 'Ridgeline Anorak', 'Atelier Blazer'],
  knitwear: ['Roan Crewneck', 'Faro Cardigan', 'Dovetail Sweater', 'Mistral Mockneck', 'Cliffe Fisherman Knit', 'Hollow Lambswool', 'Bracken Cable Knit', 'Sable Cashmere Crew', 'Pell Ribbed Polo', 'Ember Waffle Knit'],
  shirts: ['Carrow Oxford', 'Linnet Camp Collar', 'Stowe Flannel', 'Meridian Poplin', 'Hewn Workshirt', 'Pale Linen Shirt', 'Drift Band Collar', 'Tarn Overshirt', 'Quill Twill Shirt', 'Bow Chambray'],
  tops: ['Marsh Boxy Tee', 'Lune Long Sleeve', 'Pith Henley', 'Corso Pocket Tee', 'Vane Mock Tee', 'Halo Ribbed Tank', 'Onsen Thermal', 'Dune Slub Tee', 'Pier Striped Top', 'Wisp Fine Knit Tee'],
  trousers: ['Holt Pleated Trouser', 'Cove Wide Leg', 'Serge Tailored Pant', 'Maris Drawcord Pant', 'Quay Carpenter Pant', 'Lede Tapered Chino', 'Fenn Gurkha Trouser', 'Pell Trouser', 'Vault Suit Pant', 'Reed Linen Trouser'],
  denim: ['Kepler Straight Jean', 'Marlow Relaxed Jean', 'Tide Wide Jean', 'Selvedge Slim Jean', 'Quarry Carpenter Jean', 'Foundry Loose Jean', 'Ridge Tapered Jean', 'Halcyon Bootcut', 'Pier Cropped Jean', 'Anvil Raw Denim'],
  dresses: ['Lior Slip Dress', 'Vesper Shirt Dress', 'Maren Midi Dress', 'Cloud Tiered Dress', 'Solene Wrap Dress', 'Pell Knit Dress', 'Tarn Poplin Dress', 'Halcyon Column Dress', 'Brume Smock Dress', 'Linnea Linen Dress'],
  skirts: ['Maris Bias Skirt', 'Quay Cargo Skirt', 'Fenn Pleated Skirt', 'Cove Wrap Skirt', 'Sable Knit Skirt', 'Tarn Denim Skirt', 'Halo A-Line Skirt', 'Drift Midi Skirt', 'Pell Column Skirt', 'Vane Mini Skirt'],
  footwear: ['Holt Derby', 'Cove Runner', 'Marlow Loafer', 'Tarn Chelsea Boot', 'Quarry Hiker', 'Pier Sandal', 'Strand Sneaker', 'Fenn Mule', 'Reed Boat Shoe', 'Anvil Work Boot'],
  bags: ['Halsey Tote', 'Cove Crossbody', 'Maris Weekender', 'Quay Camera Bag', 'Fenn Belt Bag', 'Pell Shoulder Bag', 'Drift Backpack', 'Strand Clutch', 'Tarn Bucket Bag', 'Reed Document Holder'],
  accessories: ['Mistral Scarf', 'Holt Leather Belt', 'Pell Bucket Hat', 'Cove Beanie', 'Fenn Cardholder', 'Quay Cap', 'Drift Socks', 'Sable Gloves', 'Reed Sunglasses', 'Vane Silk Bandana'],
};

const FABRICS = ['11oz dry organic cotton', 'brushed lambswool', 'garment-dyed cotton twill', 'Irish linen', 'Japanese selvedge denim', 'recycled merino', 'crisp cotton poplin', 'heavyweight French terry', 'Italian wool flannel', 'mulberry silk', 'waxed cotton canvas', 'baby alpaca'];
const ORIGINS = ['woven in Biella, Italy', 'cut and sewn in Porto, Portugal', 'milled in Okayama, Japan', 'knitted in Hawick, Scotland', 'made in a family workshop near Lisbon', 'finished in Los Angeles'];
const BEHAVIOURS = ['It softens with every wash and only looks better worn in.', 'Built with a relaxed drape that holds its line all day.', 'Breathable enough for transitional weather, structured enough to dress up.', 'Wrinkles settle into a lived-in character rather than looking unkempt.', 'Cut a touch generous so it layers without bunching.', 'Holds its shape from morning commute to late dinner.'];
const CUTS = ['A clean, slightly relaxed silhouette', 'A considered, body-skimming cut', 'A roomy, drapey shape', 'A sharp, tailored line', 'An easy, unstructured fit'];

const COLORS: ProductColor[] = [
  { name: 'Ink', hex: '#1a1714' }, { name: 'Bone', hex: '#e9e6de' }, { name: 'Oat', hex: '#d8cfbe' },
  { name: 'Moss', hex: '#36433b' }, { name: 'Oxblood', hex: '#6e2b2b' }, { name: 'Slate', hex: '#5b6068' },
  { name: 'Clay', hex: '#b08968' }, { name: 'Ecru', hex: '#cfc6b0' }, { name: 'Storm', hex: '#3a3f45' },
  { name: 'Sand', hex: '#c2a878' }, { name: 'Indigo', hex: '#2b3a55' }, { name: 'Rust', hex: '#9c5b3b' },
];

const SIZE_SETS: Record<string, string[]> = {
  apparel: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  numeric: ['28', '30', '32', '34', '36', '38'],
  shoe: ['7', '8', '9', '10', '11', '12'],
  one: ['One Size'],
};

function sizeSetFor(c: Category): string[] {
  if (c === 'trousers' || c === 'denim') return SIZE_SETS.numeric;
  if (c === 'footwear') return SIZE_SETS.shoe;
  if (c === 'bags' || c === 'accessories') return SIZE_SETS.one;
  return SIZE_SETS.apparel;
}

const PRICE: Record<Category, [number, number]> = {
  outerwear: [240, 680], knitwear: [120, 380], shirts: [90, 220], tops: [45, 120],
  trousers: [120, 280], denim: [140, 260], dresses: [160, 420], skirts: [110, 240],
  footwear: [160, 420], bags: [90, 520], accessories: [25, 160],
};

const CARE = ['Machine wash cold, hang to dry. Warm iron if needed.', 'Dry clean only to preserve the finish.', 'Hand wash cold, lay flat to dry. Do not wring.', 'Wash inside out, cold. Tumble dry low.', 'Spot clean leather with a damp cloth; condition seasonally.'];

const COLLECTIONS = ['winter-rituals', 'the-work-edit', 'off-season', 'studio-staples'];

const slugCount: Record<string, number> = {};
function uniqueSlug(name: string) {
  let base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  slugCount[base] = (slugCount[base] ?? 0) + 1;
  return slugCount[base] > 1 ? `${base}-${slugCount[base]}` : base;
}

function makeProduct(cat: Category, i: number): Product {
  const name = NAMES[cat][i % NAMES[cat].length] + (i >= NAMES[cat].length ? ` ${String.fromCharCode(65 + Math.floor(i / NAMES[cat].length))}` : '');
  const slug = uniqueSlug(name);
  const [min, max] = PRICE[cat];
  const price = Math.round(between(min, max) / 5) * 5;
  const fabric = pick(FABRICS);
  const description = `${pick(CUTS)} in ${fabric}, ${pick(ORIGINS)}. ${pick(BEHAVIOURS)}`;
  const colorChoices = pickN(COLORS, between(2, 4));
  const sizes = sizeSetFor(cat).map((label) => ({ label, inStock: rand() > 0.18 }));
  // ensure at least one size in stock
  if (!sizes.some((s) => s.inStock)) sizes[0].inStock = true;

  const pool = IMAGE_POOL[cat] ?? IMAGE_POOL.tops;
  const imgIds = pickN(pool, Math.min(4, pool.length));
  const images = imgIds.map((id, idx) => ({
    url: id,
    alt: `${name} in ${colorChoices[0].name}, ${idx === 0 ? 'front view on a neutral studio backdrop' : idx === 1 ? 'detail of the fabric and stitching' : 'styled on model, three-quarter view'}`,
    aspect: (idx === 0 ? '3:4' : '4:5') as '3:4' | '4:5',
  }));

  const badges: Badge[] = [];
  if (rand() > 0.78) badges.push('new');
  if (rand() > 0.9) badges.push('limited');
  if (sizes.filter((s) => s.inStock).length <= 2) badges.push('last-few');

  const details = [
    `Composition: ${fabric}`,
    `Weight: ${between(180, 620)} gsm`,
    `${pick(ORIGINS).replace(/^./, (c) => c.toUpperCase())}`,
    `Model is 183cm / 6'0" wearing size ${sizeSetFor(cat)[1] ?? 'M'}`,
  ];

  return {
    id: `${cat}-${String(i + 1).padStart(3, '0')}`,
    slug,
    name,
    category: cat,
    price,
    currency: 'USD',
    description,
    details,
    care: pick(CARE),
    colors: colorChoices,
    sizes,
    images,
    badges: badges.length ? badges : undefined,
    has3D: false,
    collectionSlug: rand() > 0.55 ? pick(COLLECTIONS) : undefined,
    popularity: between(1, 100),
  };
}

// distribution across 11 categories -> ~110 products
const PLAN: Record<Category, number> = {
  outerwear: 12, knitwear: 12, shirts: 11, tops: 11, trousers: 11, denim: 10,
  dresses: 10, skirts: 8, footwear: 10, bags: 8, accessories: 8,
};

const products: Product[] = [];
(Object.keys(PLAN) as Category[]).forEach((cat) => {
  for (let i = 0; i < PLAN[cat]; i++) products.push(makeProduct(cat, i));
});

// flag a few hero products for the R3F viewer
products
  .filter((p) => p.category === 'bags' || p.category === 'outerwear' || p.category === 'footwear')
  .slice(0, 5)
  .forEach((p) => {
    p.has3D = true;
  });

const dir = join(process.cwd(), 'data');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'products.json'), JSON.stringify(products, null, 2));
console.log(`Wrote ${products.length} products to data/products.json`);
