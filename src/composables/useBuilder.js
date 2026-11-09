import { computed, reactive } from 'vue'
import menu from '@/data/menu.json'
import { orderTotal } from '@/utils/pricing'
import { shortSauce } from '@/utils/format'

export const DEFAULTS = {
  base: 'Bowl',
  protein: 'Grill Chicken',
  toppings: ['Rice', 'Beans', 'Pico de Gallo'],
  sauce: 'Chipotle',
}

/**
 * State + rules for the Build-Your-Own flow.
 * Pure of the DOM so it can be unit-tested (tests/builder.test.js).
 */
export function useBuilder(data = menu.buildYourOwn) {
  const options = {
    bases: data.bases,
    proteins: data.proteins,
    toppings: data.toppings,
    sauces: data.sauces.map((s) => ({ ...s, label: shortSauce(s.name) })),
  }

  const state = reactive({
    base: DEFAULTS.base,
    protein: DEFAULTS.protein,
    toppings: [...DEFAULTS.toppings],
    sauce: DEFAULTS.sauce,
    guac: false,
    extraProtein: false,
    step: 1,
  })

  const proteinPrice = computed(() => options.proteins.find((p) => p.name === state.protein)?.price ?? 0)
  const total = computed(() =>
    orderTotal({ proteinPrice: proteinPrice.value, guac: state.guac, extraProtein: state.extraProtein }),
  )
  const progress = computed(() => state.step * 25)

  const summary = computed(() => {
    // Keep toppings in board order regardless of click order.
    const tops = options.toppings.filter((t) => state.toppings.includes(t))
    if (state.guac) tops.push('Guac')
    return {
      base: state.base,
      protein: state.protein + (state.extraProtein ? ' (double)' : ''),
      toppings: tops.length ? tops.join(', ') : 'None',
      sauce: state.sauce || 'No sauce',
    }
  })

  const markStep = (n) => (state.step = n)

  return {
    options,
    state,
    proteinPrice,
    total,
    progress,
    summary,
    markStep,
    setBase(v) { state.base = v; markStep(1) },
    setProtein(v) { state.protein = v; markStep(2) },
    toggleTopping(v) {
      const i = state.toppings.indexOf(v)
      if (i === -1) state.toppings.push(v)
      else state.toppings.splice(i, 1)
      markStep(3)
    },
    toggleGuac() { state.guac = !state.guac; markStep(3) },
    toggleExtraProtein() { state.extraProtein = !state.extraProtein; markStep(3) },
    /** Clicking the active sauce clears it (matches the reference build). */
    setSauce(v) { state.sauce = state.sauce === v ? '' : v; markStep(4) },
    reset() {
      Object.assign(state, { ...DEFAULTS, toppings: [...DEFAULTS.toppings], guac: false, extraProtein: false, step: 1 })
    },
  }
}
