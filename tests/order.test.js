import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import { createAppRouter } from '@/router'
import { findItem, findStore, stores, categories, categoryFrom } from '@/order/lib/catalog'
import {
  cents, defaultSelection, fromCents, setLevel, summaryParts, taxCents, togglePick, totals, unitCents, validate,
} from '@/order/lib/pricing'
import { minutesUntilClose, pickupSlots, storeStatus } from '@/order/lib/hours'
import { __resetOrder, useOrder } from '@/order/useOrder'

const byo = findItem('build-your-own')
const sel = (over = {}) => ({ ...defaultSelection(byo), ...over })
const pick = (name, level = 'regular') => [{ name, level }]

describe('seed data', () => {
  it('has 23 stores, 4 coming soon, Michigan on Detroit time', () => {
    expect(stores).toHaveLength(23)
    expect(stores.filter((s) => s.status === 'COMING_SOON')).toHaveLength(4)
    expect(findStore('hamtramck-12197-conant-rd').timezone).toBe('America/Detroit')
  })
  it('every category has "From $X" and every option name is unique inside its group', () => {
    categories.forEach((c) => expect(categoryFrom(c)).toBeGreaterThan(0))
    categories.flatMap((c) => c.items).flatMap((i) => i.groups ?? []).forEach((g) => {
      expect(new Set(g.options.map((o) => o.name)).size).toBe(g.options.length)
    })
  })
})

describe('pricing (03-TECH-SPEC §4 required cases)', () => {
  it('default bowl = $12.95', () => {
    expect(unitCents(byo, sel())).toBe(1295)
  })
  it('Honey Chipotle + guac = $15.90', () => {
    expect(unitCents(byo, sel({ protein: pick('Honey Chipotle'), addons: pick('Add Fresh Guac') }))).toBe(1590)
  })
  it('Extra protein on steak = $16.90, charged once whether by level or add-on', () => {
    expect(unitCents(byo, sel({ protein: pick('Grilled Steak', 'extra') }))).toBe(1690)
    expect(unitCents(byo, sel({ protein: pick('Grilled Steak'), addons: pick('Extra Protein') }))).toBe(1690)
    expect(unitCents(byo, sel({ protein: pick('Grilled Steak', 'extra'), addons: pick('Extra Protein') }))).toBe(1690)
  })
  it('base, toppings, sauces and levels are free', () => {
    const s = sel({ base: pick('Nachos'), toppings: [{ name: 'Salsa', level: 'extra' }, { name: 'Lettuce', level: 'side' }], sauce: pick('Smoky Habanero Sauce', 'light') })
    expect(unitCents(byo, s)).toBe(1295)
  })
  it('Birria Pie = $30.95', () => {
    const birria = findItem('birria-tacos')
    expect(unitCents(birria, { meat: pick('Beef'), size: pick('Pie') })).toBe(3095)
  })
  it('2 dips at 8oz guacamole = $13.90', () => {
    const g = findItem('guacamole')
    expect(unitCents(g, { size: pick('8 oz') }) * 2).toBe(1390)
  })
  it('a fixed item with a base price: tostada $8.95', () => {
    expect(unitCents(findItem('tostada'), defaultSelection(findItem('tostada')))).toBe(895)
  })
  it('Fajita Kit needs exactly 2 proteins', () => {
    const kit = findItem('fajita-kit')
    expect(validate(kit, { kitProteins: pick('Tofu') })[0].message).toBe('Pick exactly 2.')
    expect(validate(kit, { kitProteins: [...pick('Tofu'), ...pick('Grill Chicken')] })).toEqual([])
    expect(unitCents(kit, { kitProteins: [...pick('Tofu'), ...pick('Grill Chicken')] })).toBe(5595)
  })
  it('tax at 0.08875 on 1295 = 115; unknown rate shows no tax', () => {
    expect(taxCents(1295, 0.08875)).toBe(115)
    expect(taxCents(1295, null)).toBeNull()
    expect(totals(1295, { rate: null, tipPct: 15 })).toMatchObject({ tax: null, taxPending: true, tip: 194, total: 1489 })
    expect(totals(1295, { rate: 0.08875 }).total).toBe(1410)
  })
  it('"From" prices', () => {
    expect(fromCents(byo)).toBe(1195)
    expect(fromCents(findItem('birria-tacos'))).toBe(1195)
    expect(fromCents(findItem('chips'))).toBe(295)
    expect(cents(1195)).toBe('$11.95')
  })
})

describe('selection rules', () => {
  const toppings = byo.groups.find((g) => g.key === 'toppings')
  const base = byo.groups.find((g) => g.key === 'base')
  it('single choice swaps and cannot be cleared', () => {
    expect(togglePick(base, pick('Bowl'), 'Burrito')).toEqual(pick('Burrito'))
    expect(togglePick(base, pick('Bowl'), 'Bowl')).toEqual(pick('Bowl'))
  })
  it('multi choice toggles and stops at the cap', () => {
    let p = []
    toppings.options.forEach((o) => (p = togglePick(toppings, p, o.name)))
    expect(p).toHaveLength(toppings.maxSelect)
    expect(togglePick(toppings, p, 'Rice')).toHaveLength(toppings.maxSelect - 1)
  })
  it('levels only apply where the group allows them', () => {
    expect(validate(byo, sel({ base: [{ name: 'Bowl', level: 'extra' }] }))).toHaveLength(1)
    expect(validate(byo, sel({ toppings: [{ name: 'Rice', level: 'side' }] }))).toEqual([])
    expect(setLevel(pick('Rice'), 'Rice', 'light')).toEqual(pick('Rice', 'light'))
  })
  it('summarises a meal for the bag', () => {
    const s = sel({ toppings: [{ name: 'Rice', level: 'light' }, { name: 'Beans', level: 'regular' }] })
    expect(summaryParts(byo, s)).toEqual(['Bowl', 'Grill Chicken', 'Rice (light), Beans', 'Chipotle Sauce'])
  })
})

describe('hours and pickup slots (store time zone)', () => {
  const avenueU = findStore('brooklyn-5119-a-avenue-u') // 10:30 → 03:00
  it('open in the afternoon, closes 3am', () => {
    const t = new Date('2026-11-02T20:00:00Z') // 3:00pm EST
    expect(minutesUntilClose(avenueU, t)).toBe(720)
    expect(storeStatus(avenueU, t)).toEqual({ state: 'open', label: 'Open · closes 3am' })
  })
  it('still open after midnight (the window belongs to the day it opened)', () => {
    const t = new Date('2026-11-03T06:30:00Z') // 1:30am EST
    expect(minutesUntilClose(avenueU, t)).toBe(90)
    const slots = pickupSlots(avenueU, t)
    expect(slots.map((s) => s.label)).toEqual(['1:45 AM', '2:00 AM', '2:15 AM', '2:30 AM', '2:45 AM'])
  })
  it('closed in the morning: slots start 15 min after opening', () => {
    const t = new Date('2026-11-03T11:00:00Z') // 6:00am EST
    expect(storeStatus(avenueU, t)).toEqual({ state: 'closed', label: 'Closed · opens 10:30am' })
    expect(pickupSlots(avenueU, t)[0].label).toBe('10:45 AM')
  })
  it('first slot is now + prep, rounded up to the quarter hour', () => {
    const s = pickupSlots(avenueU, new Date('2026-11-02T20:00:00Z'))
    expect(s[0].label).toBe('3:15 PM')
    expect(s.at(-1).label).toBe('2:45 AM')
  })
  it('clocks going back: 1:30am EDT really has 150 minutes left, not 90', () => {
    expect(minutesUntilClose(avenueU, new Date('2026-11-01T05:30:00Z'))).toBe(150)
  })
  it('Michigan uses Detroit time; coming-soon stores have no slots', () => {
    expect(pickupSlots(findStore('hamtramck-12197-conant-rd'), new Date('2026-11-02T20:00:00Z')).length).toBeGreaterThan(0)
    const soon = findStore('new-york-1884-3rd-ave')
    expect(pickupSlots(soon)).toEqual([])
    expect(storeStatus(soon).state).toBe('soon')
  })
})

describe('order store', () => {
  beforeEach(() => {
    localStorage.clear()
    __resetOrder()
  })
  it('only lets guests choose an open store', () => {
    const o = useOrder()
    expect(o.chooseStore('new-york-1884-3rd-ave')).toBe(false)
    expect(o.chooseStore('brooklyn-5119-a-avenue-u')).toBe(true)
    expect(o.store.value.city).toBe('Brooklyn')
  })
  it('builds, edits, duplicates and removes lines; the subtotal follows', () => {
    const o = useOrder()
    o.openDraft('build-your-own')
    o.pick('protein', 'Grilled Steak')
    o.level('protein', 'Grilled Steak', 'extra')
    o.setLabel('Sara')
    o.setQty(2)
    expect(o.draftUnit.value).toBe(1690)
    const line = o.commitDraft()
    expect(o.subtotal.value).toBe(3380)
    o.duplicateLine(line.id)
    expect(o.count.value).toBe(4)
    o.setLineQty(line.id, 0)
    expect(o.state.lines).toHaveLength(1)
    o.quickAdd('chips')
    o.quickAdd('chips')
    expect(o.state.lines.find((l) => l.itemSlug === 'chips').qty).toBe(2)
    expect(o.subtotal.value).toBe(3380 + 590)
  })
  it('a draft survives a "refresh" (persisted to localStorage)', async () => {
    const o = useOrder()
    o.openDraft('build-your-own')
    o.pick('base', 'Burrito')
    await flushPromises()
    expect(JSON.parse(localStorage.getItem('guacado.order.v1')).draft.selections.base[0].name).toBe('Burrito')
  })
})

describe('ordering flow in the app', () => {
  beforeAll(() => {
    window.matchMedia = (q) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} })
    window.scrollTo = () => {}
    Element.prototype.scrollIntoView = () => {}
  })
  beforeEach(() => {
    localStorage.clear()
    __resetOrder()
  })
  async function mountAt(path) {
    const router = createAppRouter(createMemoryHistory())
    router.push(path)
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] }, attachTo: document.body })
    await flushPromises()
    return { wrapper, router }
  }
  const click = async (w, text, sel = 'button') => {
    await w.findAll(sel).find((b) => b.text().includes(text)).trigger('click')
    await flushPromises()
  }

  it('hides the marketing header and footer on /order', async () => {
    const { wrapper } = await mountAt('/order')
    expect(wrapper.find('footer').exists()).toBe(false)
    expect(wrapper.text()).toContain('Where are we')
    wrapper.unmount()
  })

  it('location picker: search, coming soon is not selectable, choosing opens the menu', async () => {
    const { wrapper, router } = await mountAt('/order')
    expect(wrapper.findAll('.row')).toHaveLength(23)
    await wrapper.find('input[type=search]').setValue('1884')
    const row = wrapper.find('.row')
    expect(row.attributes('disabled')).toBeDefined()
    await wrapper.find('input[type=search]').setValue('Avenue U')
    await wrapper.find('.row').trigger('click')
    await vi.waitFor(() => expect(router.currentRoute.value.path).toBe('/order/brooklyn-5119-a-avenue-u'))
    await flushPromises()
    expect(wrapper.text()).toContain('Build your own!')
    expect(wrapper.text()).toContain('From $11.95')
    wrapper.unmount()
  })

  it('a coming-soon store link is bounced back to the picker', async () => {
    const { wrapper, router } = await mountAt('/order/new-york-1884-3rd-ave')
    expect(router.currentRoute.value.path).toBe('/order')
    wrapper.unmount()
  })

  it('remembers the store: /order skips the picker', async () => {
    useOrder().chooseStore('brooklyn-2006-cropsey-avenue')
    const { wrapper, router } = await mountAt('/order')
    expect(router.currentRoute.value.path).toBe('/order/brooklyn-2006-cropsey-avenue')
    wrapper.unmount()
  })

  it('builder: default bowl $12.95, steak + guac $15.90, add to bag, URL carries the step', async () => {
    const { wrapper, router } = await mountAt('/order/brooklyn-5119-a-avenue-u/build')
    const total = () => wrapper.find('.bar__total').text().replace('Total', '').trim()
    expect(total()).toBe('$12.95')
    await click(wrapper, 'NEXT')
    expect(router.currentRoute.value.query.step).toBe('protein')
    await click(wrapper, 'Grilled Steak')
    expect(total()).toBe('$13.95')
    await click(wrapper, 'NEXT')
    await click(wrapper, 'Add Fresh Guac')
    expect(total()).toBe('$15.90')
    await click(wrapper, 'NEXT')
    await click(wrapper, 'NEXT')
    expect(router.currentRoute.value.query.step).toBe('review')
    expect(wrapper.text()).toContain('Grilled Steak')
    await click(wrapper, 'ADD TO BAG')
    expect(router.currentRoute.value.path).toBe('/order/brooklyn-5119-a-avenue-u')
    expect(useOrder().subtotal.value).toBe(1590)
    wrapper.unmount()
  })

  it('refresh mid-build keeps the choices and the step', async () => {
    const first = await mountAt('/order/brooklyn-5119-a-avenue-u/build?step=protein')
    await click(first.wrapper, 'Grilled Shrimp')
    first.wrapper.unmount()
    const again = await mountAt('/order/brooklyn-5119-a-avenue-u/build?step=protein')
    expect(again.wrapper.find('.b__h').text()).toBe('Pick your protein')
    expect(again.wrapper.find('[aria-pressed=true]').text()).toContain('Grilled Shrimp')
    expect(again.wrapper.find('.bar__total').text()).toContain('$13.95')
    again.wrapper.unmount()
  })

  it('level control appears for a picked topping and is a radio group', async () => {
    const { wrapper } = await mountAt('/order/brooklyn-5119-a-avenue-u/build?step=toppings')
    const group = wrapper.find('[role=radiogroup]')
    expect(group.exists()).toBe(true)
    expect(group.findAll('[role=radio]')).toHaveLength(4)
    await group.findAll('[role=radio]')[0].trigger('click')
    expect(group.findAll('[role=radio]')[0].attributes('aria-checked')).toBe('true')
    wrapper.unmount()
  })

  it('kit item: add is blocked until exactly 2 proteins are chosen', async () => {
    const { wrapper } = await mountAt('/order/brooklyn-5119-a-avenue-u/item/taco-kit')
    // default selection already picks nothing for kit proteins
    await click(wrapper, 'ADD TO BAG')
    expect(useOrder().state.lines).toHaveLength(0)
    expect(wrapper.text()).toContain('Pick exactly 2.')
    await click(wrapper, 'Tofu')
    await click(wrapper, 'Grilled Steak')
    await click(wrapper, 'ADD TO BAG')
    expect(useOrder().subtotal.value).toBe(4995)
    wrapper.unmount()
  })

  it('quick add, bag sheet and checkout (payment stays off)', async () => {
    const { wrapper, router } = await mountAt('/order/brooklyn-5119-a-avenue-u')
    await wrapper.find('[aria-label="Add Chips to bag"]').trigger('click')
    expect(wrapper.find('.bar__total').text()).toContain('$2.95')
    await click(wrapper, 'VIEW BAG')
    const sheet = document.querySelector('[role=dialog]')
    expect(sheet.textContent).toContain('Chips')
    expect(sheet.textContent).toContain('$2.95')
    sheet.querySelector('[aria-label="Close bag"]').click()
    await flushPromises()
    expect(document.querySelector('[role=dialog]')).toBeNull()
    wrapper.unmount()
    const co = await mountAt('/order/checkout')
    expect(co.wrapper.text()).toContain('Online payment isn')
    expect(co.wrapper.text()).toContain('Confirmed at your restaurant')
    expect(co.wrapper.find('.bar button').attributes('disabled')).toBeDefined()
    expect(router).toBeTruthy()
    co.wrapper.unmount()
  })
})
