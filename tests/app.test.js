import { beforeAll, describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import { createAppRouter } from '@/router'

beforeAll(() => {
  // jsdom has no matchMedia: report reduced motion so GSAP choreography is skipped.
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

describe('App smoke test', () => {
  it('renders every home section in BRAND.md §8 order', async () => {
    const { wrapper } = await mountAt('/')
    const ids = [...wrapper.element.querySelectorAll('section[id]')].map((s) => s.id)
    expect(ids).toEqual(['taco', 'build', 'favorites', 'menu', 'kits', 'catering', 'locations', 'join'])
    expect(wrapper.find('h1').attributes('aria-label')).toBe('Build your own!')
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

  it('menu page carries the food advisory', async () => {
    const { wrapper } = await mountAt('/menu')
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
