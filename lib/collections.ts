import type { Collection } from './types';
import { EDITORIAL_POOL } from './images';

export const collections: Collection[] = [
  {
    slug: 'winter-rituals',
    title: 'Winter Rituals',
    subtitle: 'Layering for the cold months',
    description:
      'Weight, texture and warmth, considered as a system. Pieces built to be worn together — a base, a middle, a shell — so dressing for the cold becomes a quiet routine rather than a daily negotiation.',
    coverImage: EDITORIAL_POOL[0],
    season: 'AW / 26',
  },
  {
    slug: 'the-work-edit',
    title: 'The Work Edit',
    subtitle: 'Tailoring without the stiffness',
    description:
      'Clothes for the part of the week that asks more of you. Soft-shouldered tailoring, trousers cut to move, shirts that hold a line. Dressed-up, never dressed-stiff.',
    coverImage: EDITORIAL_POOL[1],
    season: 'Core',
  },
  {
    slug: 'off-season',
    title: 'Off-Season',
    subtitle: 'For the in-between weather',
    description:
      'The transitional wardrobe — overshirts, light knits, unlined jackets. Made for those weeks the forecast can’t make up its mind.',
    coverImage: EDITORIAL_POOL[2],
    season: 'SS / 26',
  },
  {
    slug: 'studio-staples',
    title: 'Studio Staples',
    subtitle: 'The pieces we reorder every season',
    description:
      'No trend, no expiry. The tee, the trouser, the tote — refined over years until there was nothing left to remove. The quiet backbone of the wardrobe.',
    coverImage: EDITORIAL_POOL[3],
    season: 'Permanent',
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
