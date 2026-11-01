# 03 — Technical specification: Guacado Order

This document is for Claude Code. It describes **what to build and how**:
- Feature IDs refer to `02-FEATURES.md`.
- Brand, tokens and motion come from `BRAND.md`.
- Seed data is in `seed/menu.seed.json` and `seed/locations.json`.

---

## 1. Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript**, current stable | SSR menu pages for SEO and speed, route handlers for the API, one deploy |
| Styling | **Tailwind CSS**, with `BRAND.md` tokens mapped into the theme (CSS variables) | Speed; one source of colour truth |
| Motion | **GSAP + ScrollTrigger** on marketing pages; CSS transitions in the order flow | Per `BRAND.md` §9 |
| Database | **PostgreSQL** (Neon or Supabase) via **Prisma** | Relational orders and modifiers |
| Auth | **Auth.js** (email magic link via Resend); phone OTP optional later | Passwordless and simple |
| Payments | **Stripe** Payment Element (card, Apple Pay, Google Pay) and webhooks | US standard. *Swap for Square if the owner's POS is Square (see Analysis §9).* |
| Email | **Resend** + React Email templates | Receipts, Ready notices |
| SMS (P1) | Twilio | "Ready on shelf" texts |
| State (client) | **Zustand** with `persist` (cart, builder) | Fixes the "empty bag" failure class |
| Validation | **Zod** schemas shared by client and server | Never trust client prices |
| Realtime | Server-Sent Events from `/api/stores/[id]/orders/stream`, with polling as fallback | Kitchen queue and order status |
| Hosting | Vercel (or similar), with a Postgres add-on | Simple CI/CD |
| Monitoring | Sentry, plus Vercel Analytics or Plausible | NFR-07/08 |
| Tests | **Vitest** (pricing and slot logic), **Playwright** (E2E) | NFR-09 |

> Pin exact dependency versions in `package.json`. Don't use `latest`.

---

## 2. App structure (routes)

```
app/
  (marketing)/
    page.tsx                  # Landing page (port of reference/guacado-landing.html, GSAP)
    menu/page.tsx             # Static menu (SSR from DB), CTA → /order
    catering/page.tsx         # Catering info + inquiry form (P2 ordering)
    locations/page.tsx        # All stores + map links
    franchise/page.tsx
  (order)/
    order/page.tsx                    # LOC-01 location picker (redirects if store remembered)
    order/[store]/page.tsx            # MENU-01 menu home for a store
    order/[store]/build/page.tsx      # MENU-02 builder (?step=base|protein|toppings|sauce|review)
    order/[store]/item/[slug]/page.tsx  # MENU-07 fixed items with options
    checkout/page.tsx                 # CART-04..07
    orders/[id]/page.tsx              # TRK-01 status (public with signed token)
    account/page.tsx                  # ACC-02..05
    account/saved/page.tsx
  (admin)/
    admin/page.tsx                    # Store switcher
    admin/[store]/queue/page.tsx      # ADM-02/03 kitchen queue (tablet)
    admin/[store]/availability/page.tsx  # ADM-04
    admin/[store]/settings/page.tsx   # ADM-05
    admin/menu/page.tsx               # ADM-06 (P1)
  api/
    stores/route.ts                   # GET list with open status
    stores/[id]/menu/route.ts         # GET menu + availability for store
    cart/price/route.ts               # POST cart → authoritative totals
    checkout/route.ts                 # POST → create Order(PENDING_PAYMENT) + PaymentIntent
    webhooks/stripe/route.ts          # payment_intent.succeeded → RECEIVED
    orders/[id]/route.ts              # GET status (token) ; PATCH status (staff)
    orders/[id]/stream/route.ts       # SSE status for guest
    stores/[id]/orders/stream/route.ts  # SSE queue for kitchen
    stores/[id]/slots/route.ts        # GET pickup slots
    availability/route.ts             # PATCH sold-out toggles (staff)
```

Navigation: keep the site nav and URLs from `BRAND.md` §2. Change "Order" to point at `/order`, and keep `order.online` as the **Delivery** link.

---

## 3. Data model (Prisma)

```prisma
model Store {
  id            String   @id @default(cuid())
  slug          String   @unique            // "brooklyn-avenue-u"
  name          String                       // "Avenue U"
  address       String
  city          String
  state         String
  zip           String
  timezone      String   @default("America/New_York")
  lat           Float?
  lng           Float?
  status        StoreStatus @default(OPEN)   // OPEN | COMING_SOON | PAUSED
  taxRate       Decimal  @db.Decimal(6,5)     // 0.08875 = 8.875% (owner to confirm per store)
  prepMinutes   Int      @default(12)
  slotCapacity  Int      @default(20)        // entrées per 15-min slot
  hours         StoreHours[]
  availability  Availability[]
  orders        Order[]
}
enum StoreStatus { OPEN COMING_SOON PAUSED }

model StoreHours {                           // 10:30 → 03:00 spans midnight
  id        String @id @default(cuid())
  storeId   String
  weekday   Int                              // 0=Sun
  opensAt   String                           // "10:30"
  closesAt  String                           // "03:00" (next day if < opensAt)
  store     Store  @relation(fields: [storeId], references: [id])
}

model Category {
  id        String @id @default(cuid())
  slug      String @unique                   // build-your-own, birria-tacos, ...
  name      String
  sort      Int
  items     Item[]
}

model Item {
  id          String   @id @default(cuid())
  slug        String   @unique
  categoryId  String
  name        String
  description String?
  kind        ItemKind                       // BUILDER | FIXED
  basePriceCents Int    @default(0)          // FIXED items; BUILDER price comes from protein
  calMin      Int?
  calMax      Int?
  image       String?
  digitalOnly Boolean  @default(false)
  active      Boolean  @default(true)
  sort        Int
  groups      ModifierGroup[]
  category    Category @relation(fields: [categoryId], references: [id])
}
enum ItemKind { BUILDER FIXED }

model ModifierGroup {
  id        String @id @default(cuid())
  itemId    String
  key       String                           // base | protein | toppings | sauce | size | meat | shell | flavor | addons | kitProteins
  name      String
  minSelect Int
  maxSelect Int
  allowLevels Boolean @default(false)        // light/regular/extra/side
  setsPrice Boolean   @default(false)        // protein group: option price replaces base price
  sort      Int
  options   ModifierOption[]
  item      Item @relation(fields: [itemId], references: [id])
}

model ModifierOption {
  id         String @id @default(cuid())
  groupId    String
  ingredientId String?                       // for sold-out by ingredient
  name       String
  priceCents Int    @default(0)              // add-on price, or absolute price if group.setsPrice
  calMin     Int?
  calMax     Int?
  heat       Int    @default(0)              // 0..3 (sauces)
  isDefault  Boolean @default(false)
  sort       Int
  group      ModifierGroup @relation(fields: [groupId], references: [id])
}

model Ingredient { id String @id @default(cuid()); key String @unique; name String }

model Availability {                         // per-store sold-out
  id        String  @id @default(cuid())
  storeId   String
  itemId    String?
  ingredientId String?
  soldOut   Boolean @default(true)
  updatedAt DateTime @updatedAt
  store     Store   @relation(fields: [storeId], references: [id])
  @@unique([storeId, itemId, ingredientId])
}

model User {
  id        String  @id @default(cuid())
  email     String  @unique
  name      String?
  phone     String?
  favoriteStoreId String?
  marketingOptIn Boolean @default(false)
  role      Role    @default(GUEST)
  staffStoreIds String[]                     // MANAGER / KITCHEN scope
  orders    Order[]
  savedMeals SavedMeal[]
  createdAt DateTime @default(now())
}
enum Role { GUEST KITCHEN MANAGER OWNER }

model SavedMeal {
  id      String @id @default(cuid())
  userId  String
  label   String                             // "Sara's bowl"
  itemId  String
  selections Json                            // CartLineSelections (see §4)
  user    User @relation(fields: [userId], references: [id])
}

model Order {
  id            String   @id @default(cuid())
  number        Int                         // per-store daily counter, shown to guest/kitchen
  storeId       String
  userId        String?
  guestName     String
  guestEmail    String
  guestPhone    String?
  status        OrderStatus @default(PENDING_PAYMENT)
  pickupAt      DateTime                    // UTC
  isAsap        Boolean
  shelf         String?                     // "G"
  subtotalCents Int
  taxCents      Int
  tipCents      Int      @default(0)
  totalCents    Int
  stripePaymentIntentId String? @unique
  statusToken   String   @unique            // for public /orders/[id]?t=
  notes         String?
  lines         OrderLine[]
  events        OrderEvent[]
  createdAt     DateTime @default(now())
  store         Store @relation(fields: [storeId], references: [id])
  user          User? @relation(fields: [userId], references: [id])
}
enum OrderStatus { PENDING_PAYMENT RECEIVED PREPARING READY PICKED_UP CANCELLED REFUNDED }

model OrderLine {
  id         String @id @default(cuid())
  orderId    String
  itemId     String
  itemName   String                         // snapshot
  mealLabel  String?                        // "Sara's bowl"
  qty        Int
  unitCents  Int                            // snapshot after modifiers
  selections Json                           // snapshot of names, levels, prices
  kitchenText String                        // pre-rendered ticket text
  order      Order @relation(fields: [orderId], references: [id])
}

model OrderEvent { id String @id @default(cuid()); orderId String; status OrderStatus; at DateTime @default(now()); by String?; order Order @relation(fields:[orderId],references:[id]) }
```

---

## 4. Cart & pricing rules (single source: `lib/pricing.ts`)

```ts
type Level = 'light' | 'regular' | 'extra' | 'side';
type Selection = { optionId: string; level?: Level; qty?: number };
type CartLine = {
  id: string; itemId: string; qty: number; mealLabel?: string;
  selections: Record<string /*groupKey*/, Selection[]>;
};
```

**Rules.** These must be implemented exactly, with unit tests for each.

1. **BUILDER items** (Build Your Own):
   - `unit = protein.option.priceCents + sum(addons.priceCents)`.
   - Base, toppings, sauces and levels cost $0.
   - The protein group has `setsPrice = true`.
2. **Add-ons** (group `addons`): Add Fresh Guac **195**; Extra Protein **295**.
   - Choosing level `extra` on the **protein** auto-adds "Extra Protein" (295). The UI shows "+$2.95".
3. **FIXED items**:
   - `unit = item.basePriceCents + sum(selected option priceCents)`.
   - Size options carry absolute prices via `setsPrice` (e.g. Birria 2pc 1195 / 3pc 1595 / Pie 3095).
4. **Family Kits** need `kitProteins` with min = max = 2, at $0 each.
5. `subtotal = Σ unit × qty`. `tax = round(subtotal × taxRate)`, half-up per order. Use integer cents and a Decimal library; never float. `tip` is a % of the subtotal, rounded. `total = subtotal + tax + tip`.
6. **Validation** (Zod plus a menu lookup), all on the server:
   - The option belongs to the item.
   - Group min/max are respected.
   - Levels only appear where `allowLevels` is true.
   - Nothing is sold out at the store.
   - The store is open for the chosen slot.
7. **Calories:** sum each option's calMin/calMax, plus the item's. Display "X–Y Cal".
8. **Kitchen text** for each line, e.g. `BOWL · GRILL CHICKEN (XTRA) · rice, beans LIGHT, pico, cheese SIDE · CHIPOTLE · +GUAC — "Sara"`.

**Required tests** (in `lib/pricing.test.ts`):
- The default bowl = 1295.
- Honey Chipotle + guac = 1590.
- Extra protein on steak = 1690.
- Birria Pie = 3095.
- 2 Dips at 8oz Guacamole = 1390.
- Fajita Kit with 1 protein → validation error.
- Tax at 0.08875 on 1295 = 115.

---

## 5. Pickup slots (`lib/slots.ts`)

- Work in the store `timezone` (use `date-fns-tz` or `Temporal`).
- Hours that cross midnight (10:30 → 03:00) belong to the opening day.
- Slots are 15 minutes, from `now + prepMinutes` (rounded up) until `closesAt − 15m`.
- **ASAP estimate** = `prepMinutes + ceil(queuedEntrees / 2)` minutes.
- **Capacity:** count the entrées (BUILDER, taco and kit items) already booked in each slot. Disable the slot when `≥ slotCapacity`.
- If the store is PAUSED or closed, the result is empty, with a message ("Online ordering is paused at Avenue U. Try another location.").
- **Tests:** a closed day, the after-midnight window, a full slot, and the DST change.

---

## 6. Checkout & payment flow

```
Client cart ──POST /api/cart/price──► server totals (displayed)
Pay ──POST /api/checkout {cart, storeId, slot, contact, tipPct, idempotencyKey}
      server: validate → create Order(PENDING_PAYMENT, lines snapshot) → Stripe PaymentIntent(amount=total, metadata.orderId)
      returns clientSecret
Client confirms with Stripe Payment Element (card / Apple Pay / Google Pay)
Stripe ──webhook payment_intent.succeeded──► Order → RECEIVED, assign daily number, emit SSE, send receipt email
Client redirect → /orders/[id]?t=statusToken
```

- **Never** mark an order paid from the client redirect alone.
- Use the Stripe idempotency key from the client-generated UUID.
- Refunds (manager) go through `stripe.refunds.create` and set status REFUNDED.
- Apple Pay needs domain verification (Stripe dashboard). Document this in the README.

---

## 7. Order status & kitchen

- The status machine allows only these transitions:
  - `RECEIVED → PREPARING → READY → PICKED_UP`
  - `RECEIVED|PREPARING → CANCELLED` (manager, with refund)
- READY requires a `shelf` letter (A–Z). The guest page then shows "Ready on shelf G · Order #47 · under Sara".
- **Kitchen queue UI** (tablet, landscape):
  - Three columns: New / Preparing / Ready.
  - Big ticket cards showing the order number, pickup time, guest name, and lines with meal labels and kitchen text.
  - Tap to advance. A sound and flash on new orders.
  - Auto-reconnecting SSE.
  - **Dark brand theme with high contrast**: `--surface-raised` cards, lime for "due in < 5 min", `--salsa` with the text "LATE" for overdue orders.
- **Sold-out panel:** toggles grouped by Proteins / Toppings / Sauces / Items. Changes apply to the menu instantly (revalidate the tag `menu:{storeId}`).

---

## 8. UX specification for the order flow (mobile-first)

Brand: `BRAND.md` tokens, dark theme.

- **Header** (order flow): logo, store chip ("Avenue U · Open till 3am", tap to change), Bag button with count.
- **Menu home:**
  - Hero card "Build Your Own!" (from $11.95).
  - A "Your saved meals" row (when signed in).
  - Category grid using the green panel style.
  - "Delivery? Order on DoorDash →" link (`order.online`).
- **Builder:**
  - Top progress bar with 4 segments in lime. The step title is in Alfa Slab.
  - Chips per `BRAND.md` §7.
  - Each selected topping chip shows a small segmented control: **Light · Regular · Extra · Side**.
  - Sticky bottom bar: running summary, the total (Bebas, lime), and a primary "Next" / "Add to bag" button.
  - Step changes push `?step=` to history, so back works.
  - Review step: "Name this meal" input (optional), quantity, Add to bag.
- **Bag:**
  - Right drawer on desktop, full-screen sheet on mobile.
  - Each line shows its meal label, summary, Edit (reopens the builder with its selections), Duplicate and Remove.
  - Subtotal, then "Checkout".
- **Checkout:**
  - A single page with three cards: Pickup time (segmented ASAP / Schedule plus a slot picker), Your details, Payment (Stripe Element + tip chips).
  - Order summary.
  - The allergen advisory.
  - Place order (Bebas, full width).
- **Status page:**
  - Big status stepper.
  - The order number in Alfa Slab.
  - The shelf letter in a lime circle when ready.
  - Store address with a directions link, and the receipt.
- **Empty and error states** (copy rules from `BRAND.md` §6). Errors say what happened and what to do:
  - "That slot just filled up. Pick another time."
- **Accessibility:**
  - Chips are `button[aria-pressed]`.
  - Level selectors are radio groups.
  - Total changes are announced via an `aria-live="polite"` region.
  - Focus moves to the step heading on step change.

---

## 9. Security & privacy

- All prices, availability and totals are computed on the server. Client values are ignored.
- Staff routes are protected by middleware and role/store scope. Every staff action is written to the audit log (OrderEvent.by).
- Order status pages are public only with an unguessable `statusToken`.
- Rate-limit `/api/checkout` and the auth endpoints.
- Store no card data; Stripe handles it.
- Data deletion and export endpoints (ACC-05).
- Use a cookie-consent banner only if non-essential analytics are added.

---

## 10. Environment variables

```
DATABASE_URL=
AUTH_SECRET=
AUTH_RESEND_KEY=
EMAIL_FROM="Guacado <orders@guacadomexican.com>"
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=
SENTRY_DSN=
TWILIO_ACCOUNT_SID=        # P1
TWILIO_AUTH_TOKEN=         # P1
TWILIO_FROM=               # P1
```

---

## 11. Definition of done (MVP)

- [ ] All P0 features in `02-FEATURES.md` pass their AC.
- [ ] `pnpm test` (pricing and slots) is green, and the Playwright E2E happy path is green against Stripe test mode.
- [ ] Lighthouse mobile is ≥ 90 for Performance, Accessibility and Best Practices on `/order/[store]` and `/order/[store]/build`.
- [ ] No horizontal scroll at 360 px. All tap targets are ≥ 44 px.
- [ ] Seeded with all 23 stores (4 marked COMING_SOON) and the full menu from `seed/menu.seed.json`.
- [ ] The README covers: setup, env vars, the Stripe webhook locally (`stripe listen`), Apple Pay domain verification, creating an OWNER user, and printing store QR codes.
