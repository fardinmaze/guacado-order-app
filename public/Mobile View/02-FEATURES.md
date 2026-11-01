# 02 — Feature list: Guacado Order (web / PWA)

Feature priority:
- **P0 = MVP launch**
- **P1 = shortly after launch**
- **P2 = later phase**

Each feature has a user story and testable acceptance criteria (AC). IDs (e.g. `ORD-03`) are used in `03-TECH-SPEC.md` and in commit messages.

Prices, items and calories come from Guacado's menu boards (see `BRAND.md` §10).

---

## A. Discovery & location

| ID | Feature | Pri |
|---|---|---|
| LOC-01 | Location picker (search, list, "Open now / Closes 3am") | P0 |
| LOC-02 | Use my location (optional, sorts by distance) | P0 |
| LOC-03 | Remember the chosen location (cookie + account) | P0 |
| LOC-04 | Store page: address, hours, directions link, "Coming soon" state | P0 |
| LOC-05 | Deep link per store `/order/[storeSlug]` (for table QR codes and Google Business profile) | P1 |
| LOC-06 | Favourite locations | P1 |

**LOC-01.** *As a guest, I pick my restaurant before I see prices, so that what I order is available there.*

AC:
- 23 stores are listed, grouped by state.
- "Coming soon" stores are visible but not orderable.
- Open/closed status is computed in the **store's time zone**.
- Search matches street, city and ZIP.

**LOC-02.** AC:
- A permission prompt appears only after the user taps "Use my location".
- If permission is denied, the list stays usable with no error modal.

---

## B. Menu & builder (the core)

| ID | Feature | Pri |
|---|---|---|
| MENU-01 | Menu home: categories with photo/illustration, "From $X", calories range | P0 |
| MENU-02 | **Build Your Own builder**: Base → Protein → Toppings → Sauce → Review | P0 |
| MENU-03 | Per-ingredient level: **Light / Regular / Extra / On the side** | P0 |
| MENU-04 | Paid add-ons: Add Fresh Guac +$1.95, Extra Protein +$2.95 | P0 |
| MENU-05 | Live price + calorie total, always visible (sticky bar) | P0 |
| MENU-06 | Name this meal ("Sara's bowl") | P0 |
| MENU-07 | Fixed items with options: Birria Tacos (Chicken/Beef; 2pc/3pc/Pie), Tacos (soft/crispy; 2/3; one meat; toppings), Tostada, Kids meals, Sides, Dips (4oz/8oz), Beverages (Shake flavour), Desserts, Family Kits (2 proteins) | P0 |
| MENU-08 | Sold-out handling per store (item or ingredient greyed, with reason) | P0 |
| MENU-09 | Browser back = previous builder step, never loses the meal | P0 |
| MENU-10 | Heat labels on sauces (Hot / Extra hot) with icon + text | P0 |
| MENU-11 | Allergen/advisory notice on menu + checkout | P0 |
| MENU-12 | Web-only specials (flag `digitalOnly`) | P1 |
| MENU-13 | Nutrition detail per ingredient | P2 |

**MENU-02 / 03 / 05 builder.** *As a guest, I build a bowl step by step and always know the price.*

AC:
- Exactly one base and one protein are required; "Next" stays disabled until they are chosen.
- Toppings and sauces are multi-select; each selected chip opens level options (Light / Regular / Extra / Side).
- **Price = protein price + paid add-ons.** Base, toppings, sauces and levels are free unless the owner configures a price.
- Default meal = Bowl / Grill Chicken / Rice, Beans, Pico / Chipotle = **$12.95**.
- The total updates in under 100 ms after each tap.
- Calories are shown as a range (e.g. 420–1310 Cal) until all choices are made.
- Refreshing the page mid-build restores the same step and choices.

**MENU-07 example: Birria Tacos.**
- Options: Chicken or Beef (required); size 2pc $11.95 / 3pc $15.95 / Pie $30.95 (required).
- Quantity stepper on the item.

**Family Kits.**
- Taco Kit $49.95, Nacho Kit $49.95, Fajita Kit $55.95.
- Each requires **exactly 2 proteins** chosen from the protein list.
- The included items are shown as a read-only checklist.

---

## C. Bag & checkout

| ID | Feature | Pri |
|---|---|---|
| CART-01 | Bag drawer: items, names, modifiers summary, qty, edit, duplicate, remove | P0 |
| CART-02 | Cart persists across refresh/devices (local + server cart id) | P0 |
| CART-03 | Price re-validated on server before payment (client never trusted) | P0 |
| CART-04 | Pickup time: ASAP (shows estimate) or scheduled 15-min slots within store hours | P0 |
| CART-05 | Guest checkout: name, mobile, email | P0 |
| CART-06 | Stripe payment: card, Apple Pay, Google Pay; tip optional (0/10/15/20%) | P0 |
| CART-07 | Tax per store, shown as a line item | P0 |
| CART-08 | Order notes (≤140 chars) and utensils toggle | P1 |
| CART-09 | Promo codes | P1 |
| CART-10 | Changing store revalidates the bag (removes unavailable items with a message) | P0 |

**CART-04 pickup slots.** AC:
- Slots run from opening time + 15 min to closing time − 15 min.
- Slots that are full (capacity per 15 min, default 20 entrées) are disabled.
- The ASAP estimate is base prep minutes + 1 min per 2 entrées queued.

**CART-06 payment.** AC:
- The PaymentIntent amount is computed on the server from the cart.
- The order is created as `PENDING_PAYMENT` and becomes `RECEIVED` only via a verified Stripe webhook.
- A double-click never creates two orders (idempotency key).

---

## D. Order tracking & notifications

| ID | Feature | Pri |
|---|---|---|
| TRK-01 | Order status page `/orders/[id]`: Received → Preparing → Ready (on shelf, letter) → Picked up | P0 |
| TRK-02 | Live updates (SSE or 10-second polling) | P0 |
| TRK-03 | Email receipt + "Ready" email | P0 |
| TRK-04 | SMS "Ready for pickup on shelf G" (Twilio) | P1 |
| TRK-05 | Web push notifications (PWA) | P2 |

---

## E. Accounts & reorder

| ID | Feature | Pri |
|---|---|---|
| ACC-01 | Sign in with email magic link (and/or phone OTP); US +1 default, short country list | P0 |
| ACC-02 | Order history; one-tap **Reorder** | P0 |
| ACC-03 | **Saved meals** (from bag or history), shown first on menu home | P0 |
| ACC-04 | Profile: name, phone, favourite store, marketing consent | P0 |
| ACC-05 | Delete account + data export (privacy) | P0 |
| ACC-06 | Guest orders attach to account when signing up with same email | P1 |

---

## F. Kitchen & admin dashboard

| ID | Feature | Pri |
|---|---|---|
| ADM-01 | Staff login with roles: OWNER, MANAGER (store-scoped), KITCHEN (store-scoped) | P0 |
| ADM-02 | **Live order queue** per store (tablet layout): new-order sound, ticket with named meals and modifiers in kitchen wording | P0 |
| ADM-03 | Status buttons: Start → Ready (assign shelf letter) → Picked up; Cancel/refund (manager) | P0 |
| ADM-04 | Sold-out toggles per store (items and ingredients) | P0 |
| ADM-05 | Store settings: hours, pause online ordering, prep time, slot capacity, tax rate | P0 |
| ADM-06 | Menu editor: prices, descriptions, images, availability (owner) | P1 |
| ADM-07 | Reports: orders, revenue, top items, by store/day | P1 |
| ADM-08 | Printable kitchen ticket (thermal 80 mm CSS) | P1 |

---

## G. Growth (Phase 2)

| ID | Feature | Pri |
|---|---|---|
| RWD-01 | **Guacado Rewards**: 10 pts per $1; rewards exchange (e.g. 1,250 pts = free entrée, 500 = chips & guac); birthday reward | P2 |
| GRP-01 | **Group order**: organiser shares link, each guest builds a named meal, organiser pays, cut-off time, max 15 entrées | P2 |
| CAT-01 | **Catering ordering**: Family Kits and catering packages with 24h lead time; inquiry form for events | P2 |
| DEL-01 | Delivery: link out to existing `order.online` (P0), DoorDash Drive integration later (P2) | P0 / P2 |
| QR-01 | **Table / counter QR**: `/order/[storeSlug]?src=qr`, opens builder directly | P1 |
| GC-01 | Gift cards | P2 |
| I18N-01 | Spanish language | P2 |

---

## H. Cross-cutting (non-functional)

| ID | Requirement | Pri |
|---|---|---|
| NFR-01 | **Mobile-first**, 360 px+, thumb-reachable primary actions, 44 px tap targets | P0 |
| NFR-02 | Core Web Vitals: LCP < 2.5 s on 4G, CLS < 0.1, INP < 200 ms | P0 |
| NFR-03 | WCAG 2.2 AA; full keyboard builder; screen-reader announcements for totals | P0 |
| NFR-04 | Installable PWA (manifest, icons from badge logo, offline menu shell) | P1 |
| NFR-05 | Brand: dark "Night Grill" theme, tokens and components from `BRAND.md` | P0 |
| NFR-06 | Motion: GSAP on marketing pages only; the ordering flow uses short CSS transitions (≤200 ms) and honours reduced motion | P0 |
| NFR-07 | Analytics: page and funnel events (menu_view, item_add, checkout_start, purchase); privacy-respecting | P1 |
| NFR-08 | Error monitoring (Sentry) and uptime check | P0 |
| NFR-09 | E2E tests for: build → bag → refresh → checkout (Stripe test) → kitchen Ready → status page | P0 |

---

## MVP scope at a glance

**In the MVP (P0):**
- LOC-01…04
- MENU-01…11
- CART-01…07 and CART-10
- TRK-01…03
- ACC-01…05
- ADM-01…05
- DEL-01 (link out)
- NFR P0 items

**Not in the MVP:** rewards, group order, catering checkout, SMS/push, gift cards, POS integration.
