# Architecture

Vue 3 (Composition API, `<script setup>`), Vue Router, Vite, GSAP 3.12.5 + ScrollTrigger. JavaScript only.

## Folder map

```
index.html                 fonts, meta, mount point
vite.config.js             "@" alias -> src, vitest config
BRAND.md                   design + build spec (source of truth)
reference/                 original single-file build, for visual comparison
docs/                      this documentation
tests/                     vitest: builder, data, app smoke test, ordering
public/                    favicon + OG image (badge)
src/
  main.js                  creates app, installs router, loads CSS
  App.vue                  skip link, progress bar, header, <RouterView>, footer, toast
  router/index.js          routes + per-route title + scroll behaviour
  views/                   Home, Menu, Catering, Locations (compose sections only)
  components/
    layout/                SiteHeader, MobileDrawer, SiteFooter, ScrollProgress, ToastNotice
    sections/              HeroSection, MarqueeStrip, BuildYourOwn, HouseFavorites,
                           MenuSection, FamilyKits, CateringBand, LocationsSection, JoinFranchise
    builder/               BuilderStep, ExtraToggle, OrderTicket
    ui/                    AppLink, BaseButton, OptionChip, HeatIcons, SectionHead, BrushTag,
                           MenuBlock, MenuRow, PricePill, FeaturePanel, KitCard, LocationCard
  composables/             useBuilder, useLocationFilter, useMotion, useToast,
                           useCopyToClipboard, useScrolled
  directives/magnetic.js   v-magnetic
  data/                    menu.json, locations.json (from owner), site.js (nav, links, copy)
  utils/                   format.js, pricing.js, locations.js (pure functions)
  assets/                  logos/, illustrations/ (+ index.js), styles/tokens.css, base.css
```

## Layering rules

1. **Views** only arrange sections. **Sections** own a band of the page, read data, and own their motion. **UI components** are presentational: props in, events out, no data imports (exceptions: `MenuRow`/`LocationCard` helpers from `utils`).
2. **Business rules live outside components.** Pricing is `utils/pricing.js`; builder state is `useBuilder`; filtering is `utils/locations.js`. These are unit-tested without a DOM.
3. **Content lives in data.** Menu and locations in JSON. Navigation, URLs, hours, marquee words, occasions, and favourites copy in `data/site.js`. Never hard-code these in templates.
4. **Styles:** global tokens in `tokens.css`; every component has `<style scoped>` using tokens only. No new colours (BRAND.md §12).

## Data flow: Build Your Own

```
menu.json -> useBuilder() -> { options, state, total, summary, progress }
BuildYourOwn.vue  -- props --> BuilderStep / OptionChip / ExtraToggle
                  -- props --> OrderTicket  (tweens displayed total with GSAP)
chip click -> builder method -> state changes -> total recomputed (orderTotal, cents)
ScrollTrigger on each .step -> markStep(n) -> active border + progress bar
```

Rule (BRAND.md §8): `total = protein + $1.95 guac + $2.95 extra protein`. Base, toppings, sauce are free.

## Motion

- `useMotion(rootRef, setup)` runs `setup({ gsap, ScrollTrigger, root })` inside a `gsap.context` scoped to the component, so selectors cannot leak and everything reverts on unmount (important with routing).
- It returns early when `prefers-reduced-motion: reduce`, so all content stays in place.
- Helpers: `revealHeads`, `revealCards` (batch), `tiltCards` (hover devices only; returns a cleanup).
- Rule kept from the spec: animate **from** a visible state; opacity never starts at 0 (uses .15).
- `OrderTicket`, `MobileDrawer`, `LocationsSection` animate outside `useMotion` because they react to state, and check `prefersReducedMotion()` themselves.
- `App.vue` calls `ScrollTrigger.refresh()` after each route change.

## Ordering flow (`/order`, mobile-first)

```
src/order/
  data/            menu.seed.json, locations.seed.json   (prices in cents; from the owner's ordering docs)
  lib/pricing.js   unit price, validation, level/selection rules, tax/tip   (pure, tested)
  lib/hours.js     open/closed + pickup slots in the store time zone, DST-safe (pure, tested)
  lib/catalog.js   read access to the seed (swap for API calls later)
  useOrder.js      persisted store: chosen store, bag lines, in-progress meal
  components/      ModifierGroup, LevelControl, StickyBar, BagSheet, OrderHeader, MealExtras
  views/           OrderShell, OrderLocationView, OrderMenuView, OrderBuilderView, OrderItemView, OrderCheckoutView
```

- Routes: `/order` (picker), `/order/:store` (menu), `/order/:store/build?step=`, `/order/:store/item/:slug`, `/order/checkout`. `meta.order` makes `App.vue` hide the marketing header/footer.
- Guard: a non-OPEN or unknown `:store` redirects to `/order?change=1`. A remembered store skips the picker.
- The bag stores only selections; prices are recomputed from the catalog on read, so a stale price can never be shown. When a server exists it must re-price (client totals are display-only).
- No GSAP in this flow (BRAND/ordering docs: CSS transitions only, honour reduced motion).

## Routing

| Path | View | Notes |
|---|---|---|
| `/` | HomeView | all sections; in-page anchors `#build`, `#menu`, `#kits`, `#catering`, `#locations` |
| `/menu` | MenuView | menu + favourites + kits |
| `/catering` | CateringView | catering band + kits |
| `/locations` | LocationsView | map list + jobs/franchise |
| anything else | redirect to `/` | |

Order, Jobs, Franchise are external links (`nav` in `data/site.js`).

## Accessibility implemented

Chips and extras are `<button aria-pressed>`; heat has hidden text; drawer has `role=dialog`, `aria-expanded/controls`, Escape, focus trap, focus return; ticket changes are announced politely once; 44px minimum targets on interactive controls; skip link; decorative images `alt=""`; food advisory on every menu view.

## Testing

`npm test` runs vitest in jsdom. `tests/app.test.js` stubs `matchMedia` as reduced-motion, so it checks structure and behaviour, not animation.
