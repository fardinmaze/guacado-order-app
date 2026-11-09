import { beforeAll, describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import { createAppRouter } from '@/router'
import { ORDER_URL } from '@/data/site'
import { menuSections } from '@/data/catalog'

beforeAll(() => {
  // jsdom has no matchMedia: report reduced motion so GSAP tweens are skipped.
  window.matchMedia = (q) => ({
    matches: q.includes('reduce'),
    media: q,
    addEventListener() {},
    removeEventListener() {},
  })
  window.scrollTo = () => {}
})

async function mountAt(path) {
  const router = createAppRouter(createMemoryHistory())
  router.push(path)
  await router.isReady()
  const wrapper = mount(App, { global: { plugins: [router] }, attachTo: document.body })
  await flushPromises()
  return { wrapper, router }
}

const orderLinks = (wrapper) => wrapper.findAll(`a[href="${ORDER_URL}"]`)

describe('App smoke test', () => {
  it('home runs the sales funnel in order', async () => {
    const { wrapper } = await mountAt('/')
    const ids = [...wrapper.element.querySelectorAll('section[id]')].map((s) => s.id)
    expect(ids).toEqual(['menu', 'build', 'locations', 'join'])
    expect(wrapper.find('h1').text()).toContain('Your bowl')
    expect(wrapper.find('.birria').text()).toContain('Birria tacos')
    // Bowl clip: hero loop, Burrito Bowl tile, guac upsell, builder preview
    expect(wrapper.findAll('video')).toHaveLength(4)
    expect(wrapper.find('#kits').exists()).toBe(true)
    expect(wrapper.find('#catering').exists()).toBe(true)
    wrapper.unmount()
  })

  it('puts an order button in the promo bar, header, hero, mobile bar and every menu tile', async () => {
    const { wrapper } = await mountAt('/')
    expect(wrapper.find('.promo a').attributes('href')).toBe(ORDER_URL)
    expect(wrapper.find('.hdr__order').attributes('href')).toBe(ORDER_URL)
    expect(wrapper.find('.bar__cta').attributes('href')).toBe(ORDER_URL)
    expect(wrapper.findAll('.tile .tile__order')).toHaveLength(3)
    expect(orderLinks(wrapper).length).toBeGreaterThan(10)
    wrapper.unmount()
  })

  it('order ticket updates live: default $12.95, steak + guac = $15.90', async () => {
    const { wrapper } = await mountAt('/')
    expect(wrapper.find('.ticket__total strong').text()).toBe('$12.95')
    const click = async (label) => {
      await wrapper.findAll('button').find((b) => b.text().startsWith(label)).trigger('click')
    }
    await click('Grilled Steak')
    await click('Add fresh guac')
    expect(wrapper.find('.ticket__total strong').text()).toBe('$15.90')
    expect(wrapper.find('.ticket').text()).toContain('Guac')
    await click('Start over')
    expect(wrapper.find('.ticket__total strong').text()).toBe('$12.95')
    wrapper.unmount()
  })

  it('home shows 6 locations until the guest searches', async () => {
    const { wrapper } = await mountAt('/')
    expect(wrapper.findAll('[data-loc]')).toHaveLength(6)
    await wrapper.find('input[type=search]').setValue('brooklyn')
    expect(wrapper.findAll('[data-loc]')).toHaveLength(3)
    wrapper.unmount()
  })

  it('shows 23 locations, filters by state and shows the empty state', async () => {
    const { wrapper } = await mountAt('/locations')
    expect(wrapper.findAll('[data-loc]')).toHaveLength(23)
    await wrapper.findAll('button').find((b) => b.text().startsWith('Michigan')).trigger('click')
    expect(wrapper.findAll('[data-loc]')).toHaveLength(1)
    await wrapper.find('input[type=search]').setValue('zzz')
    expect(wrapper.find('.empty').exists()).toBe(true)
    wrapper.unmount()
  })

  it('menu page has a section per tab, an order button per item and the food advisory', async () => {
    const { wrapper } = await mountAt('/menu')
    menuSections.forEach((s) => expect(wrapper.find(`section#${s.id}`).exists()).toBe(true))
    // 3 signature + 3 kits + 2 kids
    expect(wrapper.findAll('.item .item__order')).toHaveLength(8)
    expect(wrapper.text()).toContain('Consuming raw or undercooked meats')
    wrapper.unmount()
  })

  it('sets the document title per route', async () => {
    const { wrapper, router } = await mountAt('/catering')
    expect(document.title).toBe('Catering · Guacado Mexican Grill')
    await router.push('/')
    expect(document.title).toBe('Guacado Mexican Grill')
    wrapper.unmount()
  })
})
