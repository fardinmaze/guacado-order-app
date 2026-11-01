# 01 — Analysis: Chipotle Middle East app → Guacado web ordering

**Subject:** Chipotle Middle East (Android `com.chipotle.mena`; iOS id 6472633752)
**Prepared for:** the Guacado Mexican Grill web project
**Date:** November 2, 2026

> **Method.** This report is based on:
> - the public Google Play listing and its reviews;
> - third-party app-intelligence pages;
> - Chipotle and Alshaya press releases;
> - the US Chipotle app listing, used as a benchmark.
>
> The app was not installed or run. Screens are therefore **inferred** from the listing, the reviews and the standard Chipotle ordering flow, and are marked *(inferred)* where that applies.

---

## 1. Executive summary

Chipotle Middle East is a **pickup-only ordering app** operated by Alshaya Group, Chipotle's first franchise partner, for Kuwait and the UAE. Its product idea is strong: a "tiny Chipotle in your phone." It offers:
- build-your-own customisation with **extra / light / on-the-side** modifiers;
- saved meals and reorder;
- app-only menu items;
- mobile pickup shelves;
- local payments (K-NET).

Users rate it poorly:
- Google Play: **3.4–3.5★** from about 180 reviews.
- iOS: **1.8★** from 64 ratings.

The complaints are about **execution, not concept**: selections that don't register, an empty bag at checkout, a broken back gesture, hard location setup, prices hidden on the first screen, and an over-long country picker.

**The lesson for Guacado:** copy the *flow* (a guided build-your-own, a smart bag, fast reorder, pickup-time promise). Win on *reliability and clarity*: persistent cart state, prices visible everywhere, location first, and a web-native PWA with no install wall.

---

## 2. App facts

| Item | Value |
|---|---|
| Publisher | Chipotle Mexican Grill, operated with Alshaya Group (Kuwait) |
| Markets | Kuwait (store tagline "Hala Kuwait!") and the UAE (support line +971) |
| First release (iOS) | July 8, 2024 |
| Last store update | Late October 2026 (Android Oct 26, iOS Oct 27). Release notes only say "various updates and enhancements". |
| Version | ~v1.4, with about 5 versions tracked in two years |
| Installs | Android 100K+; iOS ~3.2K installs, ~190 MAU (third-party estimate) |
| Ratings | Android 3.4–3.5★ (~180 reviews); iOS 1.8★ (64 ratings) |
| Fulfilment | **Pickup only.** The listing does not mention delivery. |
| Payments | Credit/debit card and **K-NET** (Kuwait's local debit network) |
| Loyalty | **None.** Unlike the US app, there are no rewards. |
| Data safety | Collects location, personal info and more; encrypted in transit; deletion on request; no third-party sharing |
| In-restaurant tie-ins | Kiosks plus **table QR codes that open the app** for pickup orders (aimed at large families). The quesadilla is digital-only (kiosk or app). |

---

## 3. Feature inventory (as advertised)

1. **Mobile pickup shelves:** the order waits on a labelled shelf, so you skip the line.
2. **App/online-exclusive menu items:** for example the quesadilla, which can't be made on the line.
3. **Saved meals and recent orders:** one-tap reorder.
4. **Unlimited customisation:** each ingredient can be *extra*, *light* or *on the side*.
5. **Local checkout:** cards and K-NET.
6. **Account:** sign-up with a phone number and country code *(inferred from reviews)*.

### Benchmark: what the US Chipotle app adds

The US app is rated 3.9★ from about 540K ratings and has about 11.8M installs. On top of the MENA features it has:
- **Rewards:** points on every order (in-app or by scanning in store); a Rewards Exchange (food, merch, giving); a favourite reward; bonus-point offers; a birthday reward; early access to new items.
- **Delivery** to saved addresses, plus Chipotlane drive-thru pickup.
- **Group ordering:** invite others; each person builds their own meal.
- **Saved favourite locations and addresses.**
- **Split payment** across a gift card and another card; Google Pay and Apple Pay.
- **Nutrition and sustainability** info ("Real Foodprint").

The listing scan shows the kind of analytics stack behind it: Branch (attribution), Firebase, Bugsnag, FullStory, Airship (push).

---

## 4. Ordering flow *(inferred)*

```
Launch → Choose country / sign in → Choose restaurant (location)
      → Menu (categories: Burrito, Bowl, Quesadilla*, Salad, Tacos, Kids, Sides & Drinks)
      → Builder: Protein → Rice → Beans → Toppings → (extra / light / side per item)
      → Add meal name (e.g., "Sara's bowl") → Bag
      → Pickup time (ASAP / scheduled) → Payment (card / K-NET) → Confirmation
      → Order status → Pick up from the shelf by name
```
\* digital-only item

The guided **builder with per-ingredient intensity**, plus **naming each meal** (useful for family and group orders), is the heart of the product. It maps one-to-one onto Guacado's "Build Your Own!" board (Base → Protein → Toppings → Sauce).

---

## 5. What users complain about (from reviews)

| # | Problem | Evidence | What Guacado does instead |
|---|---|---|---|
| P1 | **Selections don't register; the bag shows empty; ordering fails** | Review (Aug 2025) | The cart lives in one store, persisted to `localStorage` and the server. Optimistic UI with rollback. E2E test: add → refresh → checkout. |
| P2 | **The back gesture breaks the builder** | Review (Apr 2025) | Every builder step is a URL state (`?step=protein`), so browser/OS back moves one step back and never loses the meal. |
| P3 | **No prices on the first screen** | Review (Apr 2025) | "From $11.95" on every category card. A live total in the builder at all times. |
| P4 | **Hard to set a location** | Review (Apr 2025) | Location is chosen first, with geolocation **optional**. Searchable list with "Open now" status. The chosen store is remembered. |
| P5 | **Country-code list too long** for a two-country service | Review (Apr 2025) | Phone input defaults to +1 (US) and only shows the countries we serve. Also offer email or magic-link sign-in. |
| P6 | **Buggy menu / errors** | Multiple reviews | Menu is fetched from a typed API and validated with a schema. Unavailable items are shown as "Sold out", not broken. |
| P7 | **Cold food** | Review (Apr 2025) | Pickup slots based on kitchen capacity; a "Ready" notification; the shelf time shown on the order status page. |
| P8 | **Few updates, vague release notes** | Store listing | A public changelog page; web deploys need no store review. |

---

## 6. Strengths worth copying

- **The builder model:** one screen per decision, with chips, a live preview and quantity "levels". It is fast and fun.
- **Named meals:** each item in the bag can carry a person's name, which also labels the bag on the shelf.
- **Reorder:** "Recent" and "Saved" meals on the home screen. For repeat customers this is the fastest path.
- **Digital-only items:** a reason to order online rather than at the counter.
- **QR at the table and kiosk:** links straight into ordering for a specific store.
- **Pickup shelves:** a clear physical promise ("your bag is on shelf G").

## 7. Gaps vs. the US app (opportunities for Guacado)

1. **Loyalty:** Guacado has none today. A simple points programme (Section 8) drives repeat visits.
2. **Group ordering:** Guacado's audience includes families and offices, and the menu already has Family Kits. Group orders are a natural fit.
3. **Catering:** Guacado already sells it. Put catering inquiry and ordering into the same flow.
4. **Delivery:** the current Guacado order link goes to a DoorDash Storefront (`order.online`). Keep it as the **delivery** path while first-party pickup ships. Integrate DoorDash Drive later if wanted.
5. **Wallet payments:** Apple Pay and Google Pay (US). K-NET is irrelevant for Guacado's US locations.
6. **Nutrition:** calories already exist on the boards, so show them per ingredient and in the meal total.

---

## 8. Recommendation for Guacado

Build **"Guacado Order"**, a **mobile-first Progressive Web App** inside the new website (no app-store install):

- **Guided Build-Your-Own builder:** Base → Protein → Toppings (light / regular / extra / side) → Sauce → name the meal. Live price and calories throughout.
- **Location-first pickup ordering:** ASAP or scheduled slots. Stripe checkout with card, Apple Pay and Google Pay.
- **Accounts by email magic link or phone OTP:** saved meals, recent orders, favourite location.
- **Order status page with notifications:** Received → Preparing → Ready on shelf.
- **Kitchen/admin dashboard:** live order queue, mark Ready, toggle items sold out, edit prices and hours.
- **Phase 2:** Guacado Rewards, Group Order, Catering ordering, delivery integration, table-QR ordering.

It reuses the brand system already produced (`BRAND.md`: dark theme, Guac Green / Lime, slab and condensed type, GSAP motion) and Guacado's real menu and prices.

---

## 9. Key risks & decisions for the owner

| Decision | Options | Recommendation |
|---|---|---|
| **Payments** | Stripe / Square / keep DoorDash Storefront only | **Stripe** (Payment Element + Apple/Google Pay). If the stores already use a **Square POS**, use Square Online APIs instead so orders land in the POS. **Ask the owner which POS they use.** |
| **POS integration** | Tablet dashboard (ours) / POS integration | Start with **our kitchen dashboard on a tablet**; integrate the POS in phase 2. |
| **Prices per location** | Single price list / per-store overrides | Data model supports per-store overrides; launch with one list. |
| **Sales tax** | Per location (NYC ~8.875%, others differ) | Store `taxRate` per location, **confirmed by the owner's accountant**, or use Stripe Tax. |
| **Toppings list** | Board says "From Our Fresh Selection" | Use Rice, Beans, Pico, Salsa, Lettuce, Cheese, Sour Cream, Jalapeños (taken from the Family Kit lists). **Confirm with the owner.** |
| **Extra charges** | Which "extra" choices cost money | Board: Extra Protein +$2.95, Add Guac +$1.95. Other extras are free. **Confirm.** |
| **Delivery** | Own delivery / DoorDash Drive / link out | Link out to `order.online` for delivery in the MVP. |

---

## Sources

- [Google Play: Chipotle Middle East](https://play.google.com/store/apps/details?id=com.chipotle.mena)
- [AppGoblin: Chipotle Middle East (iOS)](https://appgoblin.info/apps/6472633752)
- [Marlvel: Chipotle Middle East intel report](https://marlvel.ai/intel-report/food-drink/chipotle-middle-east)
- [Chipotle Newsroom: Chipotle introduces its real ingredients to Kuwait](https://newsroom.chipotle.com/2024-04-22-CHIPOTLE-INTRODUCES-ITS-REAL-INGREDIENTS-TO-KUWAIT)
- [Nation's Restaurant News: Chipotle makes its debut in the UAE](https://nrn.com/fast-casual/chipotle-makes-its-debut-united-arab-emirates)
- [AppGoblin: Chipotle (US app)](https://appgoblin.info/apps/com.chipotle.ordering)
