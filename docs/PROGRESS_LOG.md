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
| Unit + smoke tests (25) | Passing |
| Production build | Passing |
| **Visual / browser QA of GSAP motion** | **Not done** (see Open items) |
| Vector logo, real food photos | Blocked on owner |

---

## 2026-11-02 — Session 6: hero reimagined with the mascot

- Hero art is now the Guacado avatar (`public/Guacado_Avatar.jfif` -> `public/media/avatar.jpg`) centred, with the two food photos (`hero-1/2.jpg`) around him where the cartoon illustrations used to be. Cartoon avocado disc and illustrations removed from the hero.
- `components/ui/HeroAvatar.vue`: eyes and head follow the cursor (finger on touch); after 3.5 s without a pointer he glances around by himself; reduced motion = looks straight ahead. The painted irises are hidden by a patch and a moving iris/pupil is drawn in SVG; geometry in `data/avatarEyes.js` (original 1792x2400 coordinates). Placement was checked with an offline render of the same geometry, not in a browser.
- Black backdrops of the avatar and photos are removed with `mix-blend-mode: screen` (on the outer wrapper, so the blend reaches the page).
- **Heart eyes:** hovering or focusing a Menu / Order link or button (any, via event delegation, `isLoveTarget`) swaps his eyes for the hearts from `Guacado Avatar 2` (`media/avatar-love.jpg`, clipped to each eye by `HEARTS` in `data/avatarEyes.js`); they pop in and beat. Works with reduced motion (no beat).

## 2026-11-02 — Session 5: scroll-scrubbed taco video (`#taco`)

Reference approach taken from the Mojito project (scroll drives a video's `currentTime`, clip encoded with every frame a keyframe). New section right after the ticker, centred, `TacoScroll.vue` + `data/tacoScroll.js`.

- **Footage:** owner's `public/Video/gemini_generated_video_60ff5ac9.mp4` (taco built on black: shell, chicken, lettuce, tomato, onion/cilantro, cheese, sauce, folds). Re-encoded to `public/media/taco-build.mp4` (1280x720, no audio, `-g 1, crf 18`) + `taco-poster.jpg` (last frame). The original stays in `public/Video/` (git-ignored).
- **Black background:** the clip has no alpha (MP4 cannot), so `mix-blend-mode: screen` plus a soft mask lets the black melt into the page ground.
- **Steps** (side rail + caption) are timed in `data/tacoScroll.js` (`at` = second). Wording describes the footage, not the menu.
- **No motion / no JS:** normal-height section showing the finished taco and the full step list.
- Not yet seen in a browser. Check pacing (`55vh` per step), phone layout, and blend on the real background.
- Re-encode command: `ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 18 -g 1 -pix_fmt yuv420p -movflags +faststart out.mp4`
- **Rework (full-window):** the stage now fills the screen (video zoomed, `screen`-blended); giant step words sit behind the food and fade/rise in and out per step; sticker tags and a note sit in front; "Folded & ready" adds a READY stamp, sparkle burst, zoom and CTA buttons. The last 10% of scroll holds the final frame so the finale can play (`PLAY_SHARE`). Not yet seen in a browser.

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

## Session 7 - New scroll footage: burrito bowl (client video 3)

- **Footage:** client's `public/Scroll Animation_Video 3.mp4` (19.5 s, 1280x720: an empty bowl built up layer by layer, then finished). Re-encoded to `public/media/bowl-build.mp4` (no audio, `-g 1`, crf 20, all keyframes so seeking is instant) + `bowl-poster.jpg` (last frame). The original stays in `public/` (git-ignored via `public/*.mp4`). The older taco clip is retired.
- **Steps (12), timed to the footage:** The bowl, Yellow rice, Black beans, Grilled chicken, Peppers & onions, Sweet corn, Tomato & cheese, Guacamole, Sour cream, Sauce, Cilantro, Ready to eat. Wording only describes what is on screen.
- **Layout:** the bowl sits low in the frame, so the video is anchored at the bottom with the zoom origin moved down (it would otherwise be cropped), and scroll per step is 52vh (12 steps).
- Tests updated for the 19.5 s clip (33 passing); `vite build` OK. Not yet checked visually in a browser.

## 2026-11-09 — Session 8: sales-first redesign (Chipotle-style layout)

Owner asked to move from the brand-focused dark site to a layout built for conversion, modelled on chipotle.com. Structure follows Chipotle; colours, logo, copy and prices stay Guacado's. The brand build is preserved in git: **tag `brand-version`** (`git checkout brand-version` to view it).

- **Theme:** light "Order Counter" tokens (white / cream bands, ink text, guac-green CTAs, lime highlights). Photo bands stay black because all owner photos are shot on black. Type: Archivo condensed 900 (headlines, prices, buttons) + Figtree (body). Alfa Slab / Bebas / Lobster removed.
- **Order button everywhere:** green promo strip, sticky white header (ORDER NOW at every width), hero, each menu tile, each menu item, each location card, footer CTA band, and a fixed **mobile order bar** that shows the running builder total while Build Your Own is on screen (`useOrderBar`).
- **Home funnel:** HeroPromo (birria tacos with prices) > CategoryGrid "What are you craving?" (3 photo tiles + 6 compact tiles) > Build Your Own > UpsellBand (fresh guac +$1.95, "Make it a meal") > CrowdPleasers (Family Kits + Catering) > Locations (search-first, 6 open locations, "See all") > Jobs/Franchise.
- **/menu** is now an order menu: sticky category tabs with scroll-spy, item cards with every price and an Order button, the builder, sides/dips/drinks boards, advisory.
- **/catering**: green catering hero + family kit cards. **/locations**: full finder with Order pickup + Directions per store.
- **Data:** `src/data/catalog.js` derives every "From $" price and the upsell list from `menu.json` (tested in `tests/catalog.test.js`). Copy says "pickup" only: the live site does not mention delivery.
- **Builder:** "Copy my order" button (the order.online storefront cannot receive a pre-built order) and "Start over".
- **Removed** (still in the `brand-version` tag): mascot hero, marquee, scroll-scrubbed bowl video, scroll progress bar, house favourites, magnetic buttons, GSAP scroll choreography. GSAP now only tweens the ticket total.
- **Checked in a real browser** (headless Chrome via puppeteer-core, 1440px and 390px phone emulation): no horizontal overflow, no console errors.
- Tests: 31 passing. Build OK.

### Open items
1. More food photography: only birria tacos, tacos and the bowl have photos; burritos, nachos, quesadillas, kids, sides and drinks show as text tiles until the owner supplies images.
2. Online ordering is one storefront link; per-location deep links would let "Order pickup" pre-select the store.
3. Unused media still ships in `public/media` (avatar JPGs, `hero 1/2.jfif`, `bowl-build.mp4` ~13 MB). Move them out of `public/` before deploying.
4. If there are real promos (rewards, app, delivery partners), add them to the promo strip: none are invented here.
