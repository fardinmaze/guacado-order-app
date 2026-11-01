# 04 — Build plan & Claude Code prompts

Work **one milestone per session**. Paste each prompt into Claude Code from the project root, with all the docs present. Tick the boxes as you go.

## Before you start: owner decisions (fill in)

- [ ] **POS** in the stores: ____ (if it's Square or Toast, revisit payments; see Analysis §9)
- [ ] **Stripe account** owner and keys: ____
- [ ] **Sales tax rate** per store (or use Stripe Tax): ____
- [ ] **Toppings list** confirmed (seed currently uses Rice, Beans, Pico, Salsa, Lettuce, Cheese, Sour Cream, Jalapeños): ____
- [ ] **Which "extras" are charged** (seed: Extra Protein $2.95, Add Guac $1.95; everything else is free): ____
- [ ] **Hours per store** (seed: 10:30–03:00 daily): ____
- [ ] **Order email sender** domain (e.g. orders@guacadomexican.com) verified in Resend: ____
- [ ] **Food photos** (originals from the current site) supplied: ____

Blocked: *(Claude Code adds items here)*

---

## M0 — Scaffold & brand foundation

- [ ] Done

> Read `CLAUDE.md`, then `BRAND.md` and `03-TECH-SPEC.md` §1–2.
>
> 1. Scaffold a Next.js App Router + TypeScript + Tailwind project with pnpm.
> 2. Map the `BRAND.md` §3 tokens to CSS variables and the Tailwind theme, and load the four Google Fonts with `next/font`.
> 3. Copy `assets/` to `public/brand/`.
> 4. Build the shared components: Button (primary, lime, ghost), Chip, BrushTag, FeaturePanel, MenuRow, plus the site Header/Drawer with the nav from `BRAND.md` §2 and the Footer.
> 5. Set up ESLint, Prettier, Vitest, Playwright and Sentry.
> 6. Add a `/styleguide` page showing every component.
>
> No business logic yet.

## M1 — Marketing site (GSAP)

- [ ] Done

> Port `reference/guacado-landing.html` (from the brand kit) to `app/(marketing)/page.tsx` using the M0 components, with the GSAP motion spec in `BRAND.md` §9 (`useGSAP` hook, cleanup on unmount, reduced-motion guard).
>
> Then add `/menu` (SSR from the seed JSON for now), `/locations` (from `seed/locations.json`), `/catering` (info + inquiry form that emails via Resend) and `/franchise`.
>
> Point the "Order" CTAs at `/order`. Delivery links to `order.online`.

## M2 — Database, seed, pricing & slots (logic first)

- [ ] Done

> Implement the Prisma schema from `03-TECH-SPEC.md` §3 and a seed script that loads `seed/menu.seed.json` and `seed/locations.json`. Create Ingredients from the option `ingredient` keys.
>
> Implement `lib/pricing.ts` (§4) and `lib/slots.ts` (§5) with Zod schemas in `lib/schemas.ts`. Write **all** the listed unit tests first and make them pass. Include the after-midnight and DST slot cases.
>
> Add `GET /api/stores`, `GET /api/stores/[id]/menu`, `GET /api/stores/[id]/slots` and `POST /api/cart/price`.

## M3 — Location picker & menu home

- [ ] Done

> Build LOC-01…04 and MENU-01, following `02-FEATURES.md` and the UX spec in `03-TECH-SPEC.md` §8:
> - `/order` location picker with search, state groups, open-now status (store time zone), optional geolocation sorting and a remembered store.
> - `/order/[store]` menu home: the Build Your Own hero card, a category grid with "From $X" and calorie ranges, and the delivery link.
> - Sold-out items render disabled with a reason.

## M4 — Builder & item options (the core)

- [ ] Done

> Build MENU-02…11:
> - The 4-step builder with `?step=` URL state and a Zustand persist store.
> - Level controls (Light/Regular/Extra/Side). Extra on protein adds Extra Protein +$2.95.
> - Add Guac +$1.95. Heat labels. Name-this-meal.
> - A sticky total bar with aria-live.
> - FIXED item pages driven by modifier groups (Birria, Tacos, Tostada, Kids, Sides, Dips sizes, Shake flavour, Family Kits with exactly 2 proteins).
>
> Playwright: build the default bowl = $12.95; refresh mid-build keeps the state; browser back returns to the previous step.

## M5 — Bag & checkout with Stripe

- [ ] Done

> Build CART-01…07 and CART-10 and the payment flow in `03-TECH-SPEC.md` §6:
> - The bag drawer/sheet with edit, duplicate and remove.
> - Server re-pricing.
> - ASAP or scheduled slots.
> - Guest contact form.
> - Stripe Payment Element (card, Apple Pay, Google Pay) and tip chips.
> - The idempotent `POST /api/checkout`.
> - A webhook that moves the order to RECEIVED, assigns the daily number and sends the React Email receipt.
>
> Playwright E2E against Stripe test mode, using card 4242.

## M6 — Order status & kitchen dashboard

- [ ] Done

> Build TRK-01…03 and ADM-01…05:
> - The `/orders/[id]?t=` status page with live SSE updates and polling fallback.
> - Staff auth with roles and store scope.
> - The tablet kitchen queue (New / Preparing / Ready columns, new-order sound, shelf letter on Ready, late flags).
> - Sold-out toggles that revalidate the store menu.
> - Store settings (hours, pause ordering, prep minutes, slot capacity, tax rate).
> - The "Ready on shelf" email.
>
> E2E: place an order → the kitchen marks it Ready (shelf G) → the guest page shows "Ready on shelf G".

## M7 — Accounts, saved meals, reorder

- [ ] Done

> Build ACC-01…05:
> - Auth.js email magic link.
> - Profile and favourite store.
> - Order history with one-tap Reorder (revalidated against the current store menu).
> - Saved meals from the bag or history, shown first on the menu home.
> - Account deletion and data export.
> - Attach guest orders on sign-up (ACC-06).

## M8 — Launch hardening

- [ ] Done

> - PWA manifest and icons from the badge logo, with an offline menu shell (NFR-04).
> - Analytics funnel events (NFR-07).
> - Rate limits.
> - Lighthouse ≥ 90 on order pages.
> - An a11y audit with axe.
> - A 360 px layout pass.
> - README: setup, env vars, Stripe webhook, Apple Pay domain verification, creating the OWNER user, printing per-store QR codes for `/order/[store]?src=qr`.
> - Tick the "Definition of done" in `03-TECH-SPEC.md` §11.

---

## Phase 2 (after launch)

Run each as its own milestone, with a short spec added to `02-FEATURES.md` first:

1. **SMS ready texts** (TRK-04, Twilio) and **promo codes** (CART-09)
2. **Menu editor and reports** (ADM-06…08)
3. **Guacado Rewards** (RWD-01): points ledger, rewards exchange, birthday reward
4. **Group order** (GRP-01): shareable link, named meals per guest, organiser pays, cut-off time
5. **Catering ordering** (CAT-01): kits and packages with a 24h lead time
6. **Delivery integration** (DEL-01): DoorDash Drive
7. **Spanish language** (I18N-01)
