# Editing Content

No component edits are needed for routine changes.

| To change | Edit | Notes |
|---|---|---|
| Protein, topping, sauce, side, drink, dessert, kit, featured item | `src/data/menu.json` | Prices are numbers (`13.95`). Dips take `prices: [4oz, 8oz]`. Sauce `heat` is 0–3. |
| Add / remove / mark a location "coming soon" | `src/data/locations.json` | Add `"soon": true`. Counters and state chips update automatically. A new state also needs a name in `stateNames` in `src/data/site.js`. |
| Navigation, order URL, jobs / franchise URLs | `src/data/site.js` | Keep labels and order (BRAND.md §2). A test enforces this. The order URL deliberately contains the misspelling `gaucado`. |
| Hours, email, social links | `src/data/site.js` → `site` | |
| Marquee words, catering occasions | `src/data/site.js` | |
| House-favourite descriptions | `src/data/site.js` → `favoriteCopy` | |
| Add-on prices (guac, extra protein) | `src/utils/pricing.js` | Tests in `tests/builder.test.js` will need updating. |
| Colours, fonts, spacing | `src/assets/styles/tokens.css` | Follow BRAND.md §3 colour rules. |
| Page `<title>` per route | `src/router/index.js` | |

After editing, run `npm test`. Tests check, for example, that there are 19 open + 4 coming-soon locations across 6 states. Update those numbers deliberately when the real counts change.
