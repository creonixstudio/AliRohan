/**
 * Single image abstraction. Every <Image> in the app sources its URL through
 * `img()` so a client can later swap Unsplash for their own CDN / Shopify
 * asset URLs without touching a single component.
 *
 * Source strategy:
 *  - Default: stable Unsplash photo IDs (real apparel/editorial photography),
 *    sized + cropped on the fly via Unsplash's image CDN params.
 *  - The committed `IMAGE_POOL` guarantees the build always renders real
 *    imagery even with no API key. To use the Pexels/Unsplash API instead,
 *    add a key in .env.local and extend `resolveSource` (see README).
 */

const UNSPLASH = 'https://images.unsplash.com/photo-';

type Surface = 'card' | 'gallery' | 'full' | 'thumb';

const SURFACE_SIZE: Record<Surface, { w: number; ar: string }> = {
  card: { w: 720, ar: '3:4' },
  gallery: { w: 1100, ar: '4:5' },
  full: { w: 2000, ar: '16:9' },
  thumb: { w: 200, ar: '1:1' },
};

/** Build a CDN URL for a given Unsplash photo id + surface. */
export function img(
  photoId: string,
  surface: Surface = 'card',
  override?: { w?: number }
) {
  const { w } = SURFACE_SIZE[surface];
  const width = override?.w ?? w;
  // q=80 AVIF/WebP negotiated by next/image; crop=entropy keeps the garment centred
  return `${UNSPLASH}${photoId}?auto=format&fit=crop&crop=entropy&w=${width}&q=80`;
}

/**
 * A tiny, generic blur placeholder (warm greige) so every next/image fades up
 * from an on-brand colour rather than a flash of empty box.
 */
export const BLUR_DATA_URL =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="10"><rect width="8" height="10" fill="#d4cec3"/></svg>`
  ).toString('base64');

/**
 * Curated pool of real apparel/editorial photo IDs (Unsplash). Grouped loosely
 * so generated products get on-theme imagery. Stable IDs => reproducible build.
 */
export const IMAGE_POOL: Record<string, string[]> = {
  outerwear: [
    '1551488831-00ddcb6c6bd3', '1539533018447-63fcce2678e3', '1544022613-e87ca75a784a',
    '1591047139829-d91aecb6caea', '1520975954732-35dd22299614', '1578587018452-892bacefd3f2',
  ],
  knitwear: [
    '1576566588028-4147f3842f27', '1434389677669-e08b4cac3105', '1620799140408-edc6dcb6d633',
    '1591047139756-eec9f9d1e09e', '1620012253295-c15cc3e65df4', '1610652492500-ded49ceeb378',
  ],
  shirts: [
    '1596755094514-f87e34085b2c', '1602810318383-e386cc2a3ccf', '1603252109303-2751441dd157',
    '1620012253295-c15cc3e65df4', '1598033129183-c4f50c736f10', '1622445275576-721325763afe',
  ],
  tops: [
    '1521572163474-6864f9cf17ab', '1503342217505-b0a15ec3261c', '1485231183945-fffde7cc051e',
    '1554568218-0f1715e72254', '1564584217132-2271feaeb3c5', '1572804013309-59a88b7e92f1',
  ],
  trousers: [
    '1473966968600-fa801b869a1a', '1594633312681-425c7b97ccd1', '1542272604-787c3835535d',
    '1624378439575-d8705ad7ae80', '1593030761757-71fae45fa0e7', '1551854838-212c50b4c184',
  ],
  denim: [
    '1542272604-787c3835535d', '1582552938357-32b906df40cb', '1604176354204-9268737828e4',
    '1565084888279-aca607ecce0c', '1541099649105-f69ad21f3246', '1475178626620-a4d074967452',
  ],
  dresses: [
    '1595777457583-95e059d581b8', '1572804013309-59a88b7e92f1', '1612336307429-8a898d10e223',
    '1566174053879-31528523f8ae', '1539008835657-9e8e9680c956', '1551163943-3f6a855d1153',
  ],
  skirts: [
    '1583496661160-fb5886a13d44', '1577900232427-18219b9166a0', '1551163943-3f6a855d1153',
    '1594633312681-425c7b97ccd1', '1583744946564-b52ac1c389c8', '1612336307429-8a898d10e223',
  ],
  footwear: [
    '1542291026-7eec264c27ff', '1460353581641-37baddab0fa2', '1595950653106-6c9ebd614d3a',
    '1543163521-1bf539c55dd2', '1549298916-b41d501d3772', '1600185365926-3a2ce3cdb9eb',
  ],
  bags: [
    '1584917865442-de89df76afd3', '1548036328-c9fa89d128fa', '1559563458-527698bf5295',
    '1591561954557-26941169b49e', '1566150905458-1bf1fc113f0d', '1553062407-98eeb64c6a62',
  ],
  accessories: [
    '1611652022419-a9419f74343d', '1601924994987-69e26d50dc26', '1576053139778-7e32f2ae3cfd',
    '1620625515032-6ed0c1790c75', '1599643478518-a784e5dc4c8f', '1556905055-8f358a7a47b2',
  ],
};

/** Editorial / lookbook hero photos for collections + storytelling surfaces. */
export const EDITORIAL_POOL: string[] = [
  '1490481651871-ab68de25d43d', '1485518882345-15568b007407', '1487222477894-8943e31ef7b2',
  '1483985988355-763728e1935b', '1469334031218-e382a71b716b', '1441984904996-e0b6ba687e04',
  '1492707892479-7bc8d5a4ee93', '1529139574466-a303027c1d8b', '1539109136881-3be0616acf4b',
];
