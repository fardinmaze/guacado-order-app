<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// Sticky category bar under the header. Highlights the section in view and keeps
// the active tab scrolled into the visible strip on phones.
const props = defineProps({
  sections: { type: Array, required: true }, // [{ id, label }]
})

const active = ref(props.sections[0]?.id)
const strip = ref(null)
let io

onMounted(() => {
  if (typeof IntersectionObserver !== 'function') return
  io = new IntersectionObserver(
    (entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (hit) active.value = hit.target.id
    },
    { rootMargin: '-140px 0px -55% 0px' },
  )
  props.sections.forEach((s) => {
    const el = document.getElementById(s.id)
    if (el) io.observe(el)
  })
})
onBeforeUnmount(() => io?.disconnect())

watch(active, async (id) => {
  await nextTick()
  const el = strip.value
  const tab = el?.querySelector(`[data-id="${id}"]`)
  // Scroll the strip itself; scrollIntoView would fight the page's own smooth scroll.
  if (tab && el.scrollTo) el.scrollTo({ left: tab.offsetLeft - (el.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' })
})
</script>

<template>
  <nav class="tabs" aria-label="Menu categories">
    <div ref="strip" class="wrap tabs__strip">
      <RouterLink
        v-for="s in sections"
        :key="s.id"
        :to="{ hash: `#${s.id}` }"
        :data-id="s.id"
        :class="{ 'is-active': active === s.id }"
        :aria-current="active === s.id ? 'true' : undefined"
      >
        {{ s.label }}
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.tabs {
  position: sticky;
  top: var(--header-h);
  z-index: 30;
  background: var(--ground);
  border-bottom: 1px solid var(--line);
}
.tabs__strip { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }
.tabs__strip::-webkit-scrollbar { display: none; }
a {
  flex: none;
  display: inline-flex;
  align-items: center;
  min-height: 56px;
  padding: 0 14px;
  font: 800 15px/1 var(--f-display);
  font-stretch: 80%;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-decoration: none;
  color: var(--ink-muted);
  box-shadow: inset 0 -3px 0 transparent;
  transition: color 0.15s, box-shadow 0.15s;
}
a:hover { color: var(--ink); }
a.is-active { color: var(--ink); box-shadow: inset 0 -3px 0 var(--guac); }
</style>
