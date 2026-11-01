// Read-only access to the seed menu and stores. Swap these two imports for API calls later.
import menuSeed from '@/order/data/menu.seed.json'
import storeSeed from '@/order/data/locations.seed.json'
import { fromCents } from './pricing'

export const advisory = menuSeed._meta.advisory
export const categories = menuSeed.categories

const items = categories.flatMap((c) => c.items.map((i) => ({ ...i, category: c.slug })))
export const findItem = (slug) => items.find((i) => i.slug === slug)
export const allItems = items

export const stores = storeSeed.stores
export const findStore = (slug) => stores.find((s) => s.slug === slug)
export const isOrderable = (store) => !!store && store.status === 'OPEN'

export const categoryFrom = (cat) => Math.min(...cat.items.map(fromCents))

/** "420–1310 Cal", "430 Cal" or "" when the boards do not print calories. */
export function calLabel(item) {
  if (item.calMin == null) return ''
  return item.calMin === item.calMax ? `${item.calMin} Cal` : `${item.calMin}–${item.calMax} Cal`
}

/** Items with no choices to make can be added in one tap. */
export const isQuickAdd = (item) => !(item.groups ?? []).length
