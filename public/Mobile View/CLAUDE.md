# CLAUDE.md — Guacado web + ordering project

You are building the Guacado Mexican Grill website and its **pickup ordering web app** ("Guacado Order"). Read these docs before writing code. When they conflict, follow the order of precedence below.

1. `02-FEATURES.md`: **what** to build (feature IDs, priorities, acceptance criteria).
2. `03-TECH-SPEC.md`: **how** to build it (stack, routes, data model, pricing and slot rules, flows).
3. `BRAND.md`: the brand: tokens, type, components, voice, GSAP motion, menu and locations data.
4. `04-BUILD-PLAN.md`: the order of work, one milestone at a time.
5. `01-ANALYSIS.md`: background (why); no instructions.

Seed data:
- `seed/menu.seed.json` (prices in **cents**)
- `seed/locations.json` (23 stores)

Brand assets are in `assets/`. They come from the brand kit zip (logos and illustrations); copy them into `public/brand/`.

## Non-negotiables

- **Prices come from the seed or the DB only.** Never invent items, prices or calories. Anything marked "OWNER TO CONFIRM" stays as data with a TODO. Don't guess values for it.
- **The server computes all money** (subtotal, tax, tip, total) in **integer cents**. The client's totals are display-only.
- **Payment truth comes from the Stripe webhook**, never from the client redirect.
- **The builder must survive refresh and back navigation** (state in a Zustand persist store, plus `?step=` in the URL). This is the #1 bug in the app we analysed.
- **Show prices everywhere:** category cards show "From $X"; the builder shows a live total.
- **Location first:** no ordering without a selected OPEN store. COMING_SOON stores are visible but not orderable.
- **Time zones:** stores are `America/New_York`, except Michigan (`America/Detroit`). Hours of 10:30–03:00 cross midnight.
- **Brand:**
  - Dark "Night Grill" theme from `BRAND.md` §3. Don't add new colours.
  - Type: Alfa Slab One for display, Bebas Neue for prices, labels and buttons, Figtree for body text, Lobster for script (sparingly).
- **Motion:** GSAP on marketing pages only. The order flow uses CSS transitions of 200 ms or less. Always honour `prefers-reduced-motion`.
- **Accessibility:**
  - WCAG 2.2 AA.
  - Chips are `button[aria-pressed]` and levels are radio groups.
  - The live total is announced via `aria-live`.
  - Tap targets are at least 44 px. No horizontal scroll at 360 px.
- **Copy:** follow `BRAND.md` §6. Show the food advisory on menu and checkout pages. Errors say what happened and what to do next.
- **Keep the existing site navigation** from `BRAND.md` §2. "Order" goes to `/order`. Delivery links out to `https://order.online/business/gaucado-14231153`.

## Working rules

- TypeScript strict. Zod schemas in `lib/schemas.ts` are shared by client and server.
- Pricing logic only in `lib/pricing.ts`, and slot logic only in `lib/slots.ts`. Both must have unit tests. Write the tests listed in 03-TECH-SPEC §4–5 before the UI.
- Pin exact dependency versions. Use `pnpm`.
- Commit per feature ID: `feat(MENU-02): builder steps with URL state`.
- After each milestone, run `pnpm lint && pnpm test && pnpm e2e`. Then update `CHANGELOG.md` and tick the milestone in `04-BUILD-PLAN.md`.
- Don't add features beyond the current milestone. Note ideas in `IDEAS.md`.
- If something needed is missing (an owner decision, an API key), stop and list it under "Blocked" in `04-BUILD-PLAN.md`. Don't fake it.

## Commands (once scaffolded)

```
pnpm dev            # Next.js dev server
pnpm db:push        # prisma db push
pnpm db:seed        # load seed/menu.seed.json + seed/locations.json
pnpm test           # vitest
pnpm e2e            # playwright (Stripe test mode)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
