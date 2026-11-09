<script setup>
import { nextTick, reactive, ref, watch } from 'vue'
import { stateNames, site } from '@/data/site'
import { useLocationFilter } from '@/composables/useLocationFilter'
import { gsap, prefersReducedMotion, useMotion, revealHeads } from '@/composables/useMotion'
import SectionHead from '@/components/ui/SectionHead.vue'
import OptionChip from '@/components/ui/OptionChip.vue'
import LocationCard from '@/components/ui/LocationCard.vue'

const root = ref(null)
const { state, query, filtered, stats, chips } = useLocationFilter()

// Counters show their final value; motion counts up from 0 once when scrolled into view.
const counts = reactive({ open: stats.value.open, soon: stats.value.soon, states: stats.value.states })

useMotion(root, ({ ScrollTrigger, root: el }) => {
  revealHeads(el)
  el.querySelectorAll('[data-count]').forEach((node) => {
    const key = node.dataset.count
    const target = stats.value[key]
    const o = { v: 0 }
    ScrollTrigger.create({
      trigger: node,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        counts[key] = 0
        gsap.to(o, { v: target, duration: 1.4, ease: 'power2.out', onUpdate: () => (counts[key] = Math.round(o.v)) })
      },
    })
  })
})

// Re-stagger the grid whenever the visible set changes.
watch(filtered, async () => {
  if (prefersReducedMotion()) return
  await nextTick()
  gsap.from(root.value.querySelectorAll('[data-loc]'), { y: 16, opacity: 0, duration: 0.45, stagger: 0.025, ease: 'power3.out' })
})
</script>

<template>
  <section id="locations" ref="root" class="band">
    <div class="wrap">
      <div class="loc__head">
        <SectionHead
          eyebrow="Find a Guacado"
          title="Locations"
          :lead="`${site.hoursProse}. Tap a location for directions.`"
        />
        <div class="count">
          <div><b data-count="open">{{ counts.open }}</b><span>OPEN NOW</span></div>
          <div><b data-count="soon">{{ counts.soon }}</b><span>COMING SOON</span></div>
          <div><b data-count="states">{{ counts.states }}</b><span>STATES</span></div>
        </div>
      </div>

      <div class="tools">
        <div class="filters" role="group" aria-label="Filter by state">
          <OptionChip v-for="c in chips" :key="c.code" :pressed="state === c.code" @click="state = c.code">
            {{ c.code === 'All' ? 'All' : stateNames[c.code] }} <small>{{ c.count }}</small>
          </OptionChip>
        </div>
        <label class="search">
          <span class="sr-only">Search locations by street, city or ZIP</span>
          <input v-model="query" type="search" placeholder="Search city or ZIP" autocomplete="off" />
        </label>
      </div>

      <div v-if="filtered.length" class="locs">
        <LocationCard v-for="l in filtered" :key="l.address + l.zip" :location="l" />
      </div>
      <p v-else class="empty" role="status">No locations match "{{ query }}". Try a city or ZIP code.</p>
    </div>
  </section>
</template>

<style scoped>
.loc__head { display: grid; gap: 24px; margin-bottom: 36px; }
@media (min-width: 900px) { .loc__head { grid-template-columns: 1fr auto; align-items: end; } }
.count { display: flex; gap: 28px; flex-wrap: wrap; }
.count div { display: grid; }
.count b { font-family: var(--f-display); font-weight: 400; font-size: clamp(48px, 6vw, 72px); line-height: 1; color: var(--lime); font-variant-numeric: tabular-nums; }
.count span { font-family: var(--f-cond); letter-spacing: 2px; font-size: 16px; color: var(--ink-muted); }
.tools { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; }
.search input {
  min-height: 44px;
  width: min(100%, 260px);
  padding: 10px 16px;
  border-radius: var(--r-pill);
  border: 1.5px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  font: 500 15px var(--f-body);
}
.search input::placeholder { color: var(--ink-muted); }
.locs { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr)); }
.empty { color: var(--ink-muted); padding: 24px 0; }
</style>
