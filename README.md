# VESTRA — Fashion E-Commerce Storefront

A production-grade, client-ready fashion & apparel storefront built as a hand-crafted studio site — editorial, tactile, intentional. Next.js (App Router) + TypeScript + Tailwind, with Framer Motion micro-interactions, GSAP ScrollTrigger scroll choreography, and a tasteful React Three Fiber 3D layer.

> **Art direction — "darkroom editorial".** Warm graphite ink on a *cool bone* ground (deliberately greyer than the cream cliché), greige surfaces, a single restrained **oxblood** accent and a deep-moss secondary. Type, layout splits and rhythm derive from the golden ratio (φ ≈ 1.618). The one signature moment is the pinned home hero: a slow draped-textile 3D form whose motion is scroll-linked, behind a mask-reveal headline.

---

## Quick start

```bash
npm install
npm run seed      # generates data/products.json (111 products) — already committed
npm run dev       # http://localhost:3000
```

Build for production:

```bash
npm run build && npm start
```

Visit `/styleguide` to see the type scale and colour tokens rendered.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + CSS-variable design tokens (`styles/tokens.css`) |
| Component micro-interactions | **Framer Motion** — hovers, taps, layout, `AnimatePresence`, springs |
| Scroll choreography | **GSAP + ScrollTrigger** — pinned hero, scrubbed reveals, parallax, horizontal rail |
| 3D | **React Three Fiber + drei** (hero draped-fabric scene + PDP product viewer). Spline can drop into `components/three/Hero3D.tsx`. |
| State | **Zustand** for the cart, persisted to `localStorage` |
| Data | local `data/products.json` via typed loaders in `lib/products.ts` |
| Images | `next/image` (AVIF/WebP) through a single `lib/images.ts` abstraction |

**Division of labour:** Framer Motion owns *element state & interaction*; GSAP owns *scroll position & timeline*. They never animate the same property. Budget is transforms/opacity only.

---

## Project structure

```
app/                  # routes (App Router): home, shop, product, collections, cart, checkout, about, search, states
components/
  ui/                 # Button, Badge, Accordion, Toast, Skeleton, EmptyState, Breadcrumbs
  product/            # ProductCard, ProductGrid, Gallery, ColorSwatch, SizeSelector, QuantityStepper, ProductDetail
  layout/             # Header/Nav + MegaMenu, Footer, CartDrawer, NewsletterForm
  motion/             # Framer wrappers (MotionReveal, Magnetic, PageTransition)
  scroll/             # GSAP wrappers + plugin registration (useGsap, ScrollReveal)
  three/              # R3F surfaces (Hero3D/FabricScene, Product3DViewer/ViewerCanvas)
  home/               # Hero, CollectionsRail, StoryBlock
lib/                  # site.config, types, products loader, collections, images, cart-store, utils
data/products.json    # 111 products
styles/tokens.css     # design tokens (colour / motion / radius)
scripts/generate-products.ts  # deterministic product generator (npm run seed)
```

---

## How to customise (client hand-off)

Everything client-facing is swappable from a small number of files:

- **Brand name, tagline, nav, social, currency, free-shipping threshold** → `lib/site.config.ts` (change `name` to rebrand the entire site).
- **Palette** → `styles/tokens.css` CSS variables (`--ink`, `--paper`, `--clay`, `--signature`, `--accent2`, …). Tailwind reads them via `tailwind.config.ts`.
- **Fonts** → swap the Fontshare `@import` and the `--font-*` variables in `app/globals.css`. Current faces (free for commercial use): **Clash Display** (display), **Satoshi** (body/UI), **Sentient** (serif accent).
- **Type scale** → `fontSize` tokens in `tailwind.config.ts` (golden-ratio steps `caption`→`mega`).
- **Image source** → `lib/images.ts`. Every `<Image>` flows through `img(photoId, surface)`. Today it resolves stable **Unsplash** photo IDs; point `img()` at your own CDN / Shopify asset URLs and no component needs to change.
- **Products / catalogue** → `data/products.json` (typed by `lib/types.ts`). The loaders in `lib/products.ts` are structured so a headless CMS / Shopify backend can replace the JSON without touching the UI.

### Image API keys (optional)

The build always renders real apparel photography from a committed curated list of stable Unsplash IDs — **no key required**. To pull live from the **Pexels** or **Unsplash** API instead, add a key to `.env.local` and extend the resolver in `lib/images.ts`:

```bash
# .env.local
PEXELS_API_KEY=your_key_here
# or
UNSPLASH_ACCESS_KEY=your_key_here
```

---

## Accessibility & performance

- Responsive 360px → 1920px.
- Keyboard navigable with a visible focus ring (`:focus-visible`), skip-to-content link, ARIA on drawer/menu/accordions, focus management on modals.
- `prefers-reduced-motion` honoured globally: scrubbed/parallax/3D auto-motion is disabled, opacity fades retained, the 3D hero falls back to a static poster.
- 3D and below-the-fold media are lazy-loaded and code-split; the 3D layer never blocks first paint and always has a 2D fallback.
- Per-route metadata + Open Graph tags.

---

## Demo checkout

Checkout is a **simulated** multi-step flow (Contact → Shipping → Payment → Review). No real payment processor is involved — the payment step is clearly labelled as a demo. Placing an order generates an order number and routes to the confirmation page.
