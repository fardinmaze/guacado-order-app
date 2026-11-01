# Progress Log

Newest entries last. Update this file at the end of every working session.

## Status at a glance

| Area | State |
|---|---|
| Vue 3 + Vite scaffold (JavaScript) | Done |
| Design tokens + global styles | Done |
| Component library (ui / layout / builder / sections) | Done |
| Home page (all 9 sections, BRAND.md §8) | Done |
| `/menu`, `/catering`, `/locations` routes | Done |
| Unit + smoke tests (59) | Passing |
| Mobile ordering flow `/order` (front end) | Done; payment/backend not built |
| Production build | Passing |
| **Visual / browser QA of GSAP motion** | **Not done** (see Open items) |
| Vector logo, real food photos | Blocked on owner |

---

## 2026-11-02 — Session 4: mobile ordering flow (`/order`)

Built from the docs the owner dropped in `public/Mobile View/` (`CLAUDE.md`, `01-ANALYSIS` … `04-BUILD-PLAN`, seed JSON). Those docs describe a Next.js + Postgres + Stripe app; this repo is Vue + JavaScript with no backend, so only the **phone-first front end** was built. Owner chose this scope.

**Built (front end, all in `src/order/`)**
- LOC-01/03/04: location picker (search by street/city/ZIP, grouped by state, open/closed in the store's own time zone, coming-soon stores listed but not selectable, chosen store remembered).
- MENU-01…07, 09, 10, 11: menu home (Build Your Own hero, category cards with "From $X", every item with price + calories, one-tap add for simple items), 5-step builder (`?step=` in the URL so back works), Light/Regular/Extra/On-the-side levels, +$1.95 guac, Extra protein +$2.95 (charged once), heat labels, "name this meal", fixed-item pages (birria, tacos, dips, kids, kits needing exactly 2 proteins), food advisory.
- MENU-05: sticky bottom bar with the live total in a polite live region.
- CART-01/02/04/05/07 (UI): bag sheet (edit, duplicate, remove, qty), bag persisted to `localStorage`, checkout page with ASAP/scheduled slots, guest details validation, tip chips, summary. Slots are computed per store time zone and are DST-safe.
- Mobile specifics: 44 px+ targets, 16 px inputs (no iOS zoom), safe-area padding, bottom action bar, full-screen bag sheet, no horizontal page scroll by design (category strip scrolls inside itself).

**Deliberately not built / open**
- **Payment, order creation, tracking, accounts, kitchen dashboard, SMS/email** need a server (Stripe, DB). The checkout button is disabled and says so; DoorDash link-out is shown.
- **Tax**: store `taxRate` is `null` in the seed ("OWNER TO CONFIRM"), so tax shows "Confirmed at your restaurant" and the total says "+ tax". Nothing invented.
- LOC-02 "use my location": the seed has no coordinates.
- Sold-out handling (MENU-08), saved meals/reorder (ACC), capacity-limited slots: need server data.
- **Entry point**: the main site's Order buttons still go to the live DoorDash URL (BRAND.md contract, and payment is off). `/order` is reachable by URL only. Switching them is a one-line change in `src/data/site.js` once payments are live (update `tests/data.test.js` with it).
- **Not seen in a browser** (extension not connected). Test at 360 / 390 / 768 px.
- `public/Mobile View/` ships with the build (served publicly). Consider moving the docs out of `public/`.

**Tests**: +34 in `tests/order.test.js` (spec pricing cases, selection rules, hours/after-midnight/DST, store persistence, full UI flow). Total 59 passing; build passes.

## 2026-11-02 — Session 3: scroll "making of" removed

Both attempts (drawn SVG, then video-scrubbed) were removed at the owner's request; the home page is back to the original 9 sections. Deleted: `MakingProcess`, `components/process/`, `data/recipes.js`, `utils/recipe.js`, `scatter.js`, `videoMap.js`, `tests/process.test.js`. The two clips remain in `public/` (unused). Session 2 below is kept as history.

## 2026-11-01 — Session 2: "Layer by layer" scroll animation

New home-page section `#making`, placed right after the marquee (`MakingProcess.vue`).

- **What it does:** the section is a tall scroll track with a CSS-sticky stage. A scrubbed GSAP timeline builds the **Grill Chicken Bowl** one beat at a time: bowl base, then Rice, Beans, Pico de Gallo, then the grilled chicken strips, then the Chipotle drizzle draws itself, and finally a READY stamp. Scrolling back up un-builds it.
- **Shows the menu:** beside the bowl, a board lists every beat. The active row opens to show the menu category it comes from (all 8 bases, all 8 proteins with prices, all toppings, all 6 sauces with heat) with the chosen option lit. A running total appears when the protein lands ($12.95; "protein sets your price") and has Order Online / Build Your Own buttons.
- **Data-driven:** `src/data/recipes.js` holds the recipe; `utils/recipe.js` turns it into beats from `menu.json`. Changing the recipe changes the animation and board. Toppings other than rice/beans/pico fall back to a leaf-green sprinkle until they get their own art.
- **Art:** drawn in SVG (the kit has no per-ingredient images), deterministic scatter (`utils/scatter.js`), colours from brand tokens plus a few local food tones (chicken tan, bean brown).
- **No motion / no JS:** normal-height section showing the finished bowl and full board.
- **Tests:** +10 (beat order, price, menu validity, scatter determinism and bounds, bowl layers). Total 35 passing; build passes.
- **Not yet seen in a browser** (extension was not connected). Please check pacing (`62vh` of scroll per beat in `MakingProcess.vue`), the phone layout, and how the food art looks.
- **Spec note:** BRAND.md §9 says "one sticky ticket is the signature moment, don't pin the whole page". This section pins only itself (CSS sticky), not the page, but it is a second sticky moment. Flag if you want it removed or shortened.
- **Ideas:** replace the SVG food with real photography or cut-out layers when the owner supplies it; add more recipes (burrito, nachos) with a picker.

## 2026-11-01 — Session 1: Analysis, migration to Vue, docs

### Analysis of the starting folder
The folder held no code, only:
- `BRAND.md` — the build spec ("single source of truth"): tokens, type, components, section order, GSAP motion table, menu + location JSON, a11y checklist.
- `Guacado Mexican Grill.md` — a scrape of the live homepage text (used to cross-check copy).
- `guacado-brand-kit.zip` — `BRAND.md` (identical copy), 7 PNG assets, `data/menu.json`, `data/locations.json`, and `reference/guacado-landing.html`, a working single-file build (CSS + vanilla JS + GSAP, images inlined as base64).

Conclusion: the reference page is the behavioural spec; this project ports it to Vue components rather than redesigning it.

### Done
- Scaffolded Vite 8 + Vue 3.5 + vue-router + GSAP **3.12.5** (pinned, per BRAND.md §9; now an npm dependency instead of a CDN script). Plain JavaScript, no TypeScript.
- Moved tokens into `src/assets/styles/tokens.css`; global primitives in `base.css`.
- Split the monolithic reference into 29 components, 4 views and the root `App.vue`. See `ARCHITECTURE.md`.
- Moved all behaviour out of DOM-querying script into composables (`useBuilder`, `useLocationFilter`, `useMotion`, `useToast`, ...).
- Menu and location data load from JSON; nothing hard-coded in markup (BRAND.md §13).
- Added tests: pricing, builder rules, data totals (19 open / 4 soon / 6 states), brand contract (nav order, live order URL), and an app smoke test that mounts every route.

### Extensions beyond the reference
| Change | Why |
|---|---|
| Multi-page routes `/menu`, `/catering`, `/locations` | BRAND.md §2 and §13 ask for them |
| Location text search (street / city / ZIP) + empty state | Useful with 23 locations |
| Per-route `document.title` | SEO / tab clarity |
| Skip-to-content link | Keyboard a11y |
| Drawer focus trap, teleported to `<body>` | Fixed-position drawer would otherwise be trapped by the header's `backdrop-filter` |
| Ticket total announced once via an `sr-only` live region | The tweened total would otherwise fire a screen-reader update every frame |
| Directions links open in a new tab, with hidden text saying so | Keeps users on the site |
| Counters derived from data, not typed in | Cannot drift from the location list |
| Money in cents (`orderTotal`) | Avoids float error such as 12.95 + 1.95 |
| `v-magnetic` directive, `BaseButton` theming vars | Removes the scattered per-band CSS overrides |

### Decisions
1. **Franchise and Jobs stay external.** BRAND.md §2 maps Franchise to `/franchise`, but §13 only lists three pages and there is no franchise copy. Inventing it would break "do not invent". Revisit when the owner supplies content.
2. **Nav `Menu`, `Catering`, `Locations` now point to internal routes.** The original production URLs are kept in `nav[].legacy` in `src/data/site.js`.
3. **History mode routing.** Static hosting needs a fallback to `index.html` (see README).
4. **"Sauce" suffix stripped for display** ("Chipotle Sauce" is stored; "Chipotle" is shown) to match the reference.

### Verification
- `npx vitest run`: 25/25 passing.
- `npx vite build`: succeeds (JS 257 kB / 98 kB gzip, CSS 25 kB).
- Dev server returns 200.
- Browser extension was not connected, so **nothing was checked visually**.

### Open items / next steps
1. **Visual QA** at 360 / 768 / 1280 px against `reference/guacado-landing.html`, including every GSAP moment in BRAND.md §9 and the reduced-motion path.
2. **JS-off readability.** BRAND.md §9 wants content readable without JS; a client-rendered SPA cannot meet that. Option: pre-render with `vite-ssg`.
3. Lighthouse run (target performance ≥ 90). Candidates: convert PNGs to WebP/AVIF, `width`/`height` on all images.
4. Confirm the toppings list with the owner (BRAND.md §10 note: derived from the Family Kit descriptions).
5. Owner assets: vector logo (SVG/AI), real food photography, sombrero mascot files.
6. Franchise page, once copy exists.
7. Optional: ESLint + Prettier, CI running `npm test && npm run build`, `git init` (the folder is not yet a repository).
8. Optional features: persist the builder selection, "copy my order" summary, light theme toggle (tokens already exist).
