// Sales-facing view of menu.json: categories for the "What are you craving?" grid and
// the order menu. Every price here is derived from menu.json so the two cannot drift.
import menu from './menu.json'

// Owner photography, served from public/media (all shot on black).
export const photos = {
  birria: '/media/hero-1.jpg',
  tacos: '/media/hero-2.jpg',
  bowl: '/media/bowl-poster.jpg',
}

const low = (xs) => Math.min(...xs)
const byName = (list, name) => list.find((i) => i.name === name)

const byo = menu.buildYourOwn
const [birria, tacos, tostada] = ['Birria Tacos', 'Tacos', 'Tostada'].map((n) => byName(menu.featured, n))

export const fromPrices = {
  byo: low(byo.proteins.map((p) => p.price)),
  birria: low(birria.prices.map((p) => p.price)),
  tacos: low(tacos.prices.map((p) => p.price)),
  tostada: tostada.price,
  kits: low(menu.familyKits.items.map((k) => k.price)),
  kids: low(menu.kidsMeal.items.map((k) => k.price)),
  sides: low([...menu.sides.map((s) => s.price), ...menu.dips.items.map((d) => d.prices[0])]),
  drinks: low([...menu.beverages.map((b) => b.price), ...menu.desserts.map((d) => d.price)]),
}

/** "2pc" -> "2 pc", "2" -> "2 for", "Pie" -> "Pie" for price option labels. */
export const optionLabel = (label) => (/^\d+$/.test(label) ? `${label} for` : label.replace(/^(\d+)pc$/, '$1 pc'))

// Photo cards (the three items the owner has photography for).
export const featuredTiles = [
  {
    id: 'birria',
    name: 'Birria Tacos',
    blurb: `${birria.options}. Slow-braised, griddled and served for dipping.`,
    calories: birria.calories,
    from: fromPrices.birria,
    image: photos.birria,
    badge: 'Signature',
    to: '/menu#signature',
  },
  {
    id: 'bowl',
    name: 'Burrito Bowl',
    blurb: 'Your base, your protein, fresh toppings and a homemade sauce.',
    calories: byo.calories,
    from: fromPrices.byo,
    image: photos.bowl,
    badge: 'Build your own',
    to: '/menu#build',
  },
  {
    id: 'tacos',
    name: 'Tacos',
    blurb: 'Soft or crispy. Pick one meat and finish them your way.',
    calories: tacos.calories,
    from: fromPrices.tacos,
    image: photos.tacos,
    to: '/menu#signature',
  },
]

// Compact cards for the rest of the board.
export const moreTiles = [
  {
    id: 'byo',
    name: 'Burritos, Nachos & More',
    blurb: byo.bases.filter((b) => b !== 'Bowl').join(' · '),
    from: fromPrices.byo,
    to: '/menu#build',
  },
  { id: 'tostada', name: 'Tostada', blurb: 'Special · one protein, beans, pico, cheese, guac', from: fromPrices.tostada, to: '/menu#signature' },
  { id: 'kits', name: 'Family Kits', blurb: `${menu.familyKits.serves} · Taco, Nacho or Fajita`, from: fromPrices.kits, to: '/menu#family-kits' },
  { id: 'kids', name: 'Kids Meal', blurb: menu.kidsMeal.note, from: fromPrices.kids, to: '/menu#kids' },
  { id: 'sides', name: 'Sides & Dips', blurb: 'Chips & guac, queso, nacho cheese fries', from: fromPrices.sides, to: '/menu#sides' },
  { id: 'drinks', name: 'Drinks & Desserts', blurb: 'Shakes, lemonade, churros, tres leches', from: fromPrices.drinks, to: '/menu#drinks' },
]

// "Make it a meal" upsell: add-ons that pair with any entrée.
const pick = (list, name) => {
  const item = byName(list, name)
  return { name: item.name, price: item.price ?? item.prices[0], calories: item.calories ?? '' }
}
export const addOns = [
  { ...pick(menu.dips.items, 'Chips & Guac'), note: '4oz' },
  { ...pick(menu.desserts, 'Churros') },
  { ...pick(menu.beverages, 'Organic Lemonade') },
  { ...pick(menu.beverages, 'Shake'), note: byName(menu.beverages, 'Shake').flavors.join(', ') },
]

// Order-menu sections, in tab order.
export const menuSections = [
  { id: 'signature', label: 'Signature' },
  { id: 'build', label: 'Build Your Own' },
  { id: 'family-kits', label: 'Family Kits' },
  { id: 'kids', label: 'Kids' },
  { id: 'sides', label: 'Sides & Dips' },
  { id: 'drinks', label: 'Drinks & Desserts' },
]
