# Guacado Mexican Grill — Brand & Build Guide

> **For Claude Code.** This file is the single source of truth for building the Guacado website: a dark-theme, GSAP-animated landing site. Follow it exactly.
> - Where it gives a value, use that value.
> - Where it says "never", don't.
> - The menu, prices, navigation URLs and locations below come from the owner's menu boards and the current site (guacadomexican.com). Do not invent items or prices.

---

## 1. Project brief

| | |
|---|---|
| **Brand** | Guacado Mexican Grill (one word, "Guacado"; descriptor "Mexican Grill") |
| **What it is** | Fast-casual, build-your-own Mexican grill. Multiple locations in NY, NJ, MD, CT, PA and MI. |
| **Site goal** | Get people to **order online**, explore the menu, book **catering**, find a **location**. |
| **Primary CTA** | `ORDER ONLINE` → https://order.online/business/gaucado-14231153 |
| **Look** | "Night Grill": deep green-black ground, cream type, the logo's Guac Green and Lime as big confident fills, hand-cut menu-board panels. |
| **Tech** | Static HTML/CSS/JS (or the framework of your choice) + **GSAP 3.12.5 + ScrollTrigger**. |
| **Reference build** | `reference/guacado-landing.html` in this kit. It is a working single-file version of the homepage; port it, don't redesign it. |

---

## 2. Navigation — keep the existing site's structure

Keep these labels and order exactly. These are the current production URLs.

| Label | URL |
|---|---|
| Menu | https://guacadomexican.com/brooklyn-guacado-mexican-grill-food-menu |
| Order | https://order.online/business/gaucado-14231153 |
| Catering | https://guacadomexican.com/brooklyn-guacado-mexican-grill-catering |
| Jobs | https://tmt.spotapps.co/job-listings?spot_id=466389&callback_url=http%3A%2F%2Fguacadomexican.com%2F |
| Locations | https://guacadomexican.com/brooklyn-guacado-mexican-grill-locations |
| Franchise Opportunities | https://guacadomexican.com/brooklyn-guacado-mexican-grill-franchise-opportunities |

Other links:
- Accessibility: https://guacadomexican.com/accessibility-page-01
- Facebook: https://www.facebook.com/61573724264624
- Instagram: https://www.instagram.com/guacadomexicangrill
- Email: guacadomexicangrill@gmail.com
- Hours (all locations, per current site): **Mon–Sun 10:30am – 3am**

**About the order URL.** It contains the misspelling `gaucado`. Keep the URL exactly as it is, because it is the live ordering link. But never write the brand name as "Gaucado" or "Guac Ado" in copy.

**If you build a multi-page site**, map the nav to your own routes:
- Menu → `/menu`
- Catering → `/catering`
- Locations → `/locations`
- Franchise Opportunities → `/franchise`
- Order and Jobs stay external.

---

## 3. Design tokens

Paste this as the global stylesheet root. The website is **dark by default**. A light "Menu Board" theme exists for print and email, if ever needed.

```css
:root {
  color-scheme: dark;

  /* Surfaces */
  --ground:          #0a120e;  /* page background */
  --surface:         #111d17;  /* alternating section bands */
  --surface-raised:  #182a21;  /* cards, drawers, tickets */
  --line:            #24382d;  /* hairlines, card borders (decorative) */

  /* Text */
  --ink:             #f6f1e7;  /* headings + body (13:1+) */
  --ink-muted:       #a7b5ab;  /* calories, descriptions (7:1+) */
  --accent-text:     #c8d82c;  /* prices, eyebrows, links (lime) */

  /* Brand fills */
  --guac:            #006d44;  /* Guac Green: logo + menu panels */
  --guac-bright:     #0b8a55;  /* hover of guac fills only */
  --lime:            #c8d82c;  /* panel edging, highlight fills */
  --leaf:            #a2ca49;  /* avocado flesh: illustration only */
  --pit:             #874c1b;  /* avocado pit: small accents only */

  /* Signals */
  --chili:           #ff7a2e;  /* step numbers, "new", coming soon */
  --salsa:           #e5484d;  /* heat level only, always with a word */

  /* On-colors */
  --on-green:        #f6f1e7;  /* text on --guac (5.7:1) */
  --on-lime:         #0a120e;  /* text on --lime / --chili (7.3:1+) */
  --focus:           #c8d82c;  /* 2px solid ring, 3px offset */

  /* Type */
  --f-display: "Alfa Slab One", Rockwell, "Roboto Slab", Georgia, serif;
  --f-cond:    "Bebas Neue", "Oswald", Impact, "Arial Narrow", sans-serif;
  --f-script:  "Lobster", "Brush Script MT", cursive;
  --f-body:    "Figtree", "Segoe UI", system-ui, sans-serif;

  /* Radius */
  --r-sm: 6px;  --r-md: 14px;  --r-lg: 28px;  --r-pill: 999px;

  /* Spacing (4px base) */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-6: 24px;  --space-8: 32px;  --space-12: 48px; --space-16: 64px;
  --space-24: 96px; --space-32: 128px;

  /* Shadows */
  --shadow-card: 0 18px 40px -18px rgba(0,0,0,.7);
  --shadow-glow: 0 0 0 1px rgba(200,216,44,.35), 0 10px 40px -10px rgba(200,216,44,.45);
}
body { background: var(--ground); color: var(--ink); font: 400 16px/1.56 var(--f-body); }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }
```

**Light "Menu Board" theme** (optional; only the overrides change):

```css
[data-theme="light"] {
  color-scheme: light;
  --ground: #fffcf7;
  --surface: #f4efe4;
  --surface-raised: #ffffff;
  --line: #e2dacb;
  --ink: #14231b;
  --ink-muted: #55645a;
  --accent-text: #006d44;
  --chili: #c24a00;
  --salsa: #be1323;
  --focus: #006d44;
}
```

### Colour rules
- **Never** set `--guac` as text on the dark ground (it is too low-contrast). Use it as a **fill**, with `--on-green` text.
- `--lime` is a text colour **only on dark**. On light it is a fill only.
- `--salsa` (red) is for heat level and sale badges only. Always pair it with a word or icon, never colour alone.
- `--leaf` and `--pit` are illustration colours. Never use them for text or large fields.
- **Section rhythm:** `ground` → `surface` → `ground` …, with one full-bleed `--guac` band (Catering) as the loud moment.
- Don't use gradients except the avocado illustration itself. No purple or blue anywhere.

---

## 4. Typography

Load the fonts from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Bebas+Neue&family=Figtree:wght@400;500;700;800&family=Lobster&display=swap">
```

| Role | Face | Size / leading | Use |
|---|---|---|---|
| `display-xl` | Alfa Slab One | clamp(54px, 10.4vw, 138px) / .88, UPPERCASE, -1px tracking | Hero headline only ("BUILD YOUR OWN!") |
| `h-section` | Alfa Slab One | clamp(40px, 6.4vw, 76px) / .95, UPPERCASE | Section heads |
| `display-m` | Alfa Slab One | 24–32px / 1.05 | Card + step titles, brush tags |
| `poster` | Bebas Neue | clamp(52px, 6.4vw, 80px) / .88 | Feature item names on green panels ("BIRRIA TACOS") |
| `price` | Bebas Neue | 22–40px / 1, `tabular-nums` | Every price, in `--accent-text` |
| `eyebrow` | Bebas Neue | 15–16px, letter-spacing 3px, UPPERCASE | Labels above headings, nav, buttons (button tracking is 2px) |
| `script` | Lobster | clamp(28px, 4vw, 44px); "Family Kit" up to 112px | **One** flourish per section max ("From our fresh selection", "Family Kit") |
| `body-l` | Figtree 400 | 17–19px / 1.6 | Intro paragraphs, max 56ch |
| `body` | Figtree 400 | 16px / 1.56 | Default |
| `item` | Figtree 700 | 17.5px / 1.35 | Menu item names |
| `caption` | Figtree 500 | 13px | Calories, fine print, in `--ink-muted` |

These faces were chosen to match the menu boards:
- the slab-serif wordmark and the "BUILD YOUR OWN!" board → Alfa Slab One
- the tall TACOS / KIDS MEAL poster letters → Bebas Neue
- the "Family Kit" script → Lobster

---

## 5. Logo & assets

The files are in `assets/` in this kit. All are transparent PNGs, cut from the menu-board artwork.

| File | Use |
|---|---|
| `assets/logos/guacado-wordmark-reverse.png` | **Default on the dark site.** Cream letters, cream "MEXICAN GRILL" bar, full-colour avocado. Header at 150–200px wide. |
| `assets/logos/guacado-badge.png` | Round stamp. Footer (120px), favicon/app icon source, social avatar. Works on any ground. |
| `assets/logos/guacado-wordmark.png` | Original green wordmark. **Light ground only**, never on dark. |
| `assets/illustrations/tacos.png` | Hero, Tacos panel |
| `assets/illustrations/birria.png` | Hero, Birria Tacos panel |
| `assets/illustrations/tostada.png` | Hero, Specials/Tostada panel |
| `assets/illustrations/guac.png` | "Add fresh guac" extra, Kids Meal panel |

Rules:
- Clear space around a mark equals the height of the avocado pit.
- Never recolour, outline, stretch or rotate a logo.
- Never rebuild the logo in CSS or type.
- **TODO for the owner:** these are raster cut-outs at ~1000px. Swap in vector master files (SVG/AI) when available.

**Photography (recommended upgrade).** The current site has real food photos (tacos, burritos, loaded nachos, salads). Use them for menu cards and the catering band, if the owner provides the originals. The style is close, warm and saturated on dark backgrounds. Keep the illustrations for playful accents.

**Mascots.** The sombrero mascot and the kid character on the boards are in-store art. Don't use them on the web without the original files.

**Icons.** Use 1.75–2px stroke outline icons (Lucide style). Heat is 1–3 small chili glyphs in `--salsa`, plus visually hidden text ("Hot", "Extra hot").

---

## 6. Voice & copy

- Short, upbeat, direct, addressing the guest as "you". Reuse the board language:
  - "Build Your Own!"
  - "From Our Fresh Selection"
  - "Choose Your Base / Protein / Toppings / Sauce"
  - "Feeds 4–6"
  - "Soft or Crispy"
  - "Pick One Meat"
- Write steps as imperatives: Choose, Pick, Add.
- **Casing:**
  - Display and poster headings are UPPERCASE.
  - Item names are Title Case.
  - Body copy is sentence case.
- **Prices:** `$13.95` on the web. For two sizes, show `3.95 | 6.95` under a `4OZ | 8OZ` header.
- **Calories:** `430–1150 Cal` with an en dash and a capital "C".
- No emoji in UI copy.
- **Required on every menu view:**

  > Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness, especially if you have certain medical conditions. Please inform us of any allergies you may have prior to ordering.

---

## 7. Components

| Component | Spec |
|---|---|
| **Button: primary** | Pill (`--r-pill`), Bebas Neue 20px, 2px tracking, padding 16px 28px 13px. Background `--guac`, text `--on-green`. On hover: background `--guac-bright` plus `--shadow-glow`. Magnetic hover (see §9). |
| **Button: lime** | Background `--lime`, text `--on-lime`. Use on green bands and for the second hero CTA. |
| **Button: ghost** | Transparent, 2px border `--line`, text `--ink`. On hover the border turns `--ink`. |
| **Header** | Sticky. Transparent at the top; once scrolled past 10px: `rgba(10,18,14,.88)` + 12px backdrop blur + bottom hairline. Logo left, 6 nav links (Bebas 18px, with a lime underline that grows on hover), ORDER ONLINE button right. Below 1080px: a round burger button that opens a full-screen `--guac` drawer with a GSAP circle reveal. Close with Escape; return focus to the burger. |
| **Brush tag** | Section label from the boards ("Sides", "Beverages", "Desserts", "Proteins"). Alfa Slab 26–32px on `--guac`, rotated -1.5deg, with `clip-path: polygon(2% 8%,10% 0,40% 6%,70% 0,97% 5%,100% 40%,98% 92%,70% 100%,35% 94%,6% 100%,0 60%)`. |
| **Feature panel** | `--guac` fill, `border-radius: --r-lg`, a 4px inset lime edge (`box-shadow: inset 0 0 0 4px var(--lime)`). Contents: a meta line (13px caps), a `poster` title and a short description, with lime price pills at the bottom. The illustration overlaps the top-right corner; text sits above it (z-index). |
| **Menu row** | Grid `1fr auto`. Item name in `item`, calories under it in `caption`, and the price right-aligned in `price`. Rows are separated by a 1px `--line` bottom border, with 12px vertical padding. |
| **Option chip** | Pill, Figtree 700 15px, `--surface` background, 1.5px `--line` border. When selected (`aria-pressed="true"`): `--lime` fill with `--on-lime` text. |
| **Order ticket** | Sticky aside (`top: 96px`), `--guac` panel with a lime inset edge. Contains a progress bar (25% per step), the rows BASE / PROTEIN / TOPPINGS / SAUCE, the TOTAL in Bebas 56px lime, an ORDER THIS ONLINE button and fine print. |
| **Kit card** | `--surface-raised`, `--r-lg`. The name in Alfa Slab and the price in Bebas 40px lime sit on the top row; then the included items as small pills, and calories at the bottom. |
| **Location card** | `--surface-raised`, `--r-md`. Shows the street (bold), then city, state and ZIP (muted), then "DIRECTIONS →" or a chili "COMING SOON" pill. Links to Google Maps search. On hover: lime border and lifts 2px. |

---

## 8. Homepage structure (in order)

1. **Header**: see §7.
2. **Hero**:
   - Open-hours pill: "Open every day · 10:30am – 3am".
   - Script line: "From our fresh selection".
   - H1: **BUILD / YOUR / OWN!** (each word on its own line, the "!" in lime).
   - A lead paragraph and two CTAs: ORDER ONLINE and BUILD YOUR BOWL (anchors to #build).
   - Art on the right: a big CSS avocado half (lime/leaf rings with a brown pit), the tacos, birria and tostada illustrations floating around it, and a spinning circular "FRESH · GRILLED · BUILT YOUR WAY" stamp.
   - The hero is sized to its content, not 100vh.
3. **Marquee**: a lime strip rotated -1.5deg, listing item names separated by pit-brown dots. It speeds up with scroll velocity.
4. **Build Your Own (#build)**:
   - Four step cards (Base → Protein → Toppings + extras → Sauce).
   - On the right, a sticky **order ticket** whose total updates live.
   - Default selection: Bowl / Grill Chicken / Rice, Beans, Pico de Gallo / Chipotle = **$12.95**.
   - **Total = protein price + $1.95 if guac is added + $2.95 if extra protein is added.** Base, toppings and sauce are free.
5. **House Favorites**: a 2×2 grid of green feature panels: Birria Tacos, Tacos, Tostada (Special), Kids Meal.
6. **Menu (#menu)**: four blocks with brush tags: Proteins, Sides (+ 4oz/8oz dips), Beverages (with shake flavours), Desserts. Then the food advisory.
7. **Family Kits (#kits)**: the script heading "Family Kit", tagged "FEEDS 4–6", and three kit cards.
8. **Catering (#catering)**:
   - Full-bleed `--guac` band.
   - Heading: "Let us cater your next event".
   - Buttons: CATERING PACKAGES (lime) and ORDER FOR PICKUP (ghost).
   - Occasion pills: Birthdays, Holiday Parties, Corporate, Weddings, Rehearsal Dinners, Game Day.
9. **Locations (#locations)**:
   - Counters: 19 OPEN NOW · 4 COMING SOON · 6 STATES.
   - State filter chips with counts.
   - A grid of location cards.
10. **Jobs + Franchise**: two cards. "Join the line" (surface) and "Open a Guacado" (lime).
11. **Footer**:
    - The badge logo, a one-line description and social icons.
    - Link columns: Explore (Menu, Order, Catering, Locations) and Company (Jobs, Franchise Opportunities, Accessibility).
    - Contact: the email as a copy-to-clipboard button, plus hours.
    - "© 2026 Guacado Mexican Grill" and "Back to top".

Also: a fixed 3px lime **scroll-progress bar** at the top of the viewport.

**Layout.** Max width 1280px. Side gutter is 16px on phones and 48px from 900px up. Section padding is `clamp(64px, 9vw, 120px)`. Every grid stacks to one column under ~760–960px. The page body must never scroll horizontally.

---

## 9. Motion spec (GSAP 3.12.5 + ScrollTrigger)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

| Moment | Animation |
|---|---|
| **Page load (hero timeline)** | H1 lines rise from `yPercent: 110` (1s, `power4.out`, stagger .08). The H1 lines are wrapped in `overflow:hidden` masks. The other hero items fade/rise 24px. The avocado scales from .6 with `elastic.out(1,.7)`. The pit pops with `back.out(2.4)`. The illustrations fly in from the sides with rotation. The stamp spins in. |
| **Idle** | Illustrations float with `yoyo` sine (2.8–3.6s, ±10–14px, a few degrees of rotation). The stamp text rotates 360° every 22s. |
| **Hero scroll** | Parallax: the avocado `yPercent: 12` and the illustrations `yPercent: -25`, both scrubbed. |
| **Marquee** | `xPercent: -50`, 28s linear, infinite. `timeScale` rises with `ScrollTrigger` velocity, then eases back to 1. |
| **Section heads** | Rise 40px from opacity .15 at `top 88%`. |
| **Build steps** | Cards stagger in. Each step's ScrollTrigger (`top 60%` → `bottom 40%`) sets it active (lime border) and moves the ticket progress bar. The total tweens numerically (.5s) and does a small `back.out` scale bump on change. |
| **Cards** | `ScrollTrigger.batch` on panels, kits and duo cards: y 60 plus a 1.5° rotate, stagger .1. On hover-capable devices, a pointer tilt of ±6° with `transformPerspective: 900`, released with `elastic.out`. |
| **Menu blocks** | Brush tag scales/rotates in with `back.out(2)`. Rows slide in from x -24 with a .04 stagger. |
| **Catering** | Occasion pills bounce in with `back.out(2)`. |
| **Locations** | Counters count up from 0 once. Cards re-stagger in when the filter changes. |
| **Buttons** | Primary and lime buttons are magnetic on hover (x .18 / y .3 of the pointer offset), released with `elastic.out(1,.4)`. |
| **Mobile drawer** | `clip-path: circle(0% → 150% at 92% 4%)` over .7s, then the links stagger up. |

**Rules:**
- Respect `prefers-reduced-motion: reduce`: skip GSAP entirely and show everything in place.
- Content must be readable with JS off. Animate *from* a visible state; never leave content at opacity 0 waiting for a trigger.
- Never animate prices or body copy after they are visible (except the ticket total count-up).
- Don't pin the whole page. One sticky ticket is the "signature" moment.

---

## 10. Menu data (from the menu boards — use verbatim)

```json
{
  "buildYourOwn": {
    "calories": "420–1310 Cal",
    "bases": ["Bowl", "Burrito", "Nachos", "Quesadilla", "Crunch Wrap", "Salad", "Taco Salad", "Fries"],
    "proteins": [
      { "name": "Grill Chicken", "price": 12.95 },
      { "name": "Honey Chipotle", "price": 13.95 },
      { "name": "Grilled Steak", "price": 13.95 },
      { "name": "Ground Beef", "price": 13.95 },
      { "name": "Grilled Shrimp", "price": 13.95 },
      { "name": "Beef Barbacoa", "price": 13.95 },
      { "name": "Veggie Fajita w/ Guac", "price": 11.95 },
      { "name": "Tofu", "price": 11.95 }
    ],
    "toppingsNote": "From Our Fresh Selection",
    "toppings": ["Rice", "Beans", "Pico de Gallo", "Salsa", "Lettuce", "Shredded Cheese", "Sour Cream", "Jalapeños"],
    "extras": [
      { "name": "Add Fresh Guac", "price": 1.95 },
      { "name": "Extra Protein (per serving)", "price": 2.95 }
    ],
    "sauces": [
      { "name": "Chipotle Sauce", "heat": 1 },
      { "name": "Mango Sauce", "heat": 0 },
      { "name": "Limon Sauce", "heat": 0 },
      { "name": "Sour Cream Sauce", "heat": 0 },
      { "name": "Guacado Sauce", "heat": 0 },
      { "name": "Smoky Habanero Sauce", "heat": 3 }
    ]
  },
  "featured": [
    { "name": "Birria Tacos", "options": "Chicken or Beef", "calories": "430–1150 Cal",
      "prices": [{ "label": "2pc", "price": 11.95 }, { "label": "3pc", "price": 15.95 }, { "label": "Pie", "price": 30.95 }] },
    { "name": "Tacos", "options": "Soft or Crispy · Pick one meat w/ your choice of toppings", "calories": "390–1240 Cal",
      "prices": [{ "label": "2", "price": 11.95 }, { "label": "3", "price": 15.95 }] },
    { "name": "Tostada", "section": "Specials", "calories": "333–690 Cal", "price": 8.95,
      "description": "Choice of one protein, served w/ black beans, pico de gallo, cheese, guac, lettuce and sauce" }
  ],
  "kidsMeal": {
    "note": "Includes Organic Milk or Water",
    "items": [
      { "name": "Kids Create Your Own", "calories": "300–530 Cal", "price": 8.95,
        "description": "W/ choice of a meat or guac & two toppings, with two soft or crispy tortillas" },
      { "name": "Kids Cheese Quesadilla", "calories": "310–540 Cal", "price": 8.95 }
    ]
  },
  "sides": [
    { "name": "Chips", "price": 2.95, "calories": "430 Cal" },
    { "name": "Fries Dipper", "price": 4.95, "calories": "395 Cal" },
    { "name": "Nacho Cheese Fries", "price": 6.95, "calories": "598 Cal" },
    { "name": "Tortilla on Side", "price": 0.95 },
    { "name": "Rice and Beans", "price": 4.95, "calories": "160–220 Cal" }
  ],
  "dips": {
    "sizes": ["4oz", "8oz"],
    "items": [
      { "name": "Guacamole", "prices": [3.95, 6.95], "calories": "270–660 Cal" },
      { "name": "Queso", "prices": [3.95, 6.95], "calories": "456–780 Cal" },
      { "name": "Salsa", "prices": [2.95, 5.45], "calories": "40–95 Cal" },
      { "name": "Chips & Guac", "prices": [6.45, 8.95], "calories": "510–770 Cal" },
      { "name": "Chips & Queso", "prices": [6.45, 8.95], "calories": "520–820 Cal" },
      { "name": "Chips & Salsa", "prices": [5.45, 7.45], "calories": "435–545 Cal" }
    ]
  },
  "beverages": [
    { "name": "Bottle Drink", "price": 2.95 },
    { "name": "Water", "price": 1.95 },
    { "name": "Organic Tractor Tea", "price": 4.95 },
    { "name": "Organic Lemonade", "price": 4.95 },
    { "name": "Shake", "price": 4.95, "flavors": ["Vanilla", "Chocolate", "Strawberry", "Oreo"] }
  ],
  "desserts": [
    { "name": "Churros", "price": 3.95 },
    { "name": "Tres Leches Cake", "price": 4.95 },
    { "name": "Plantains", "price": 3.95 }
  ],
  "familyKits": {
    "serves": "Feeds 4–6",
    "items": [
      { "name": "Taco Kit", "price": 49.95, "calories": "5900–6626 Cal",
        "includes": ["12 soft corn tortillas", "Your choice of 2 proteins", "Pico de gallo", "Salsa", "Rice", "Beans", "Lettuce", "Shredded cheese", "Sour cream"] },
      { "name": "Nacho Kit", "price": 49.95, "calories": "8912–9798 Cal",
        "includes": ["Chips", "Your choice of 2 proteins", "2 queso", "2 pico de gallo", "Salsa", "Beans", "Jalapeños", "Sour cream"] },
      { "name": "Fajita Kit", "price": 55.95, "calories": "6341–7160 Cal",
        "includes": ["12 soft corn tortillas", "Your choice of 2 proteins", "Fajita", "Guac", "Pico de gallo", "Salsa", "Rice", "Beans", "Lettuce", "Shredded cheese", "Sour cream"] }
    ]
  }
}
```

**Notes for the build:**
- The toppings list is taken from the Family Kit descriptions, because the board only says "From Our Fresh Selection". Confirm it with the owner.
- Sauce heat follows the chili icons on the board: Chipotle has 1, Smoky Habanero has 3.
- The Proteins block in the Menu section shows each protein's price with the caption "Priced with any base".

---

## 11. Locations (from guacadomexican.com, Nov 2026)

`soon: true` means the location is labelled "Coming Soon" or "Opening Soon" on the current site. The totals are 23 locations: 19 open and 4 coming soon, across 6 states.

```json
[
  { "address": "5119-A Avenue U",        "city": "Brooklyn",      "state": "NY", "zip": "11234" },
  { "address": "2006 Cropsey Avenue",    "city": "Brooklyn",      "state": "NY", "zip": "11214" },
  { "address": "508 Clarkson Ave",       "city": "Brooklyn",      "state": "NY", "zip": "11203" },
  { "address": "1884 3rd Ave",           "city": "New York",      "state": "NY", "zip": "10029", "soon": true },
  { "address": "523 W 207th St",         "city": "New York",      "state": "NY", "zip": "10034" },
  { "address": "3504 Broadway",          "city": "New York",      "state": "NY", "zip": "10031" },
  { "address": "746 Lydig Ave",          "city": "Bronx",         "state": "NY", "zip": "10462" },
  { "address": "3429 E Tremont Ave",     "city": "Bronx",         "state": "NY", "zip": "10465" },
  { "address": "421 E 149 Street",       "city": "Bronx",         "state": "NY", "zip": "10455" },
  { "address": "157-02 Cross Bay Blvd",  "city": "Howard Beach",  "state": "NY", "zip": "11414" },
  { "address": "7019 Austin Street",     "city": "Forest Hills",  "state": "NY", "zip": "11375" },
  { "address": "95-05 57th Ave",         "city": "Corona",        "state": "NY", "zip": "11368" },
  { "address": "1679 Hylan Boulevard",   "city": "Staten Island", "state": "NY", "zip": "10305" },
  { "address": "255 Fulton Avenue",      "city": "Hempstead",     "state": "NY", "zip": "11550" },
  { "address": "490 Pearl St",           "city": "Buffalo",       "state": "NY", "zip": "14202" },
  { "address": "939 Main Street",        "city": "Paterson",      "state": "NJ", "zip": "07503" },
  { "address": "55 Bloomfield Avenue",   "city": "Bloomfield",    "state": "NJ", "zip": "07003", "soon": true },
  { "address": "275 Comly Rd",           "city": "Lincoln Park",  "state": "NJ", "zip": "07035" },
  { "address": "240 McMechen St.",       "city": "Baltimore",     "state": "MD", "zip": "21217", "soon": true },
  { "address": "13600 Baltimore Avenue", "city": "Laurel",        "state": "MD", "zip": "20707" },
  { "address": "1405 E Main St",         "city": "Waterbury",     "state": "CT", "zip": "06705" },
  { "address": "410 Semple St",          "city": "Pittsburgh",    "state": "PA", "zip": "15213", "soon": true },
  { "address": "12197 Conant Rd",        "city": "Hamtramck",     "state": "MI", "zip": "48212" }
]
```

**Directions link:**

```
https://www.google.com/maps/search/?api=1&query=<encodeURIComponent("Guacado Mexican Grill " + address + " " + city + " " + state + " " + zip)>
```

---

## 12. Accessibility & quality checklist

- [ ] All text meets WCAG AA in the dark theme. The token pairs above are pre-checked; don't introduce new text colours.
- [ ] Visible 2px lime focus ring on every link, button and chip.
- [ ] Chips use `<button aria-pressed>`; the ticket is `aria-live="polite"`.
- [ ] Heat icons have text equivalents.
- [ ] The burger has `aria-expanded` and `aria-controls`; the drawer closes on Escape.
- [ ] `prefers-reduced-motion` disables GSAP.
- [ ] No horizontal scroll at 360px. Tap targets are ≥ 44px.
- [ ] Images have `alt` text. Decorative illustrations use `alt=""`.
- [ ] The food advisory and allergy note are present on menu views.
- [ ] Meta: title "Guacado Mexican Grill", plus a description and OG image (the badge or a food photo).
- [ ] Lighthouse: performance ≥ 90. Lazy-load below-the-fold images; preconnect fonts.

---

## 13. Suggested prompt for Claude Code

> Read `BRAND.md` and `reference/guacado-landing.html`. Build the Guacado Mexican Grill site as **[Astro / Next.js / plain HTML]**.
> - Use the tokens in §3 as global CSS, the fonts in §4 and the assets in `assets/`.
> - Implement the homepage sections in the order of §8, with the GSAP motion in §9.
> - Load menu and location data from `data/menu.json` and `data/locations.json` (§10–11). Don't hard-code it into markup.
> - Keep the navigation and URLs from §2 exactly.
> - Then add `/menu`, `/catering` and `/locations` pages reusing the same components.
