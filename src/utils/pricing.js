// Order-ticket pricing (BRAND.md §8):
// total = protein price + $1.95 if guac + $2.95 if extra protein.
// Base, toppings and sauce are free.
export const GUAC_PRICE = 1.95
export const EXTRA_PROTEIN_PRICE = 2.95

export function orderTotal({ proteinPrice, guac = false, extraProtein = false }) {
  // Work in cents to avoid float drift (12.95 + 1.95 + 2.95).
  const cents =
    Math.round(proteinPrice * 100) +
    (guac ? Math.round(GUAC_PRICE * 100) : 0) +
    (extraProtein ? Math.round(EXTRA_PROTEIN_PRICE * 100) : 0)
  return cents / 100
}
