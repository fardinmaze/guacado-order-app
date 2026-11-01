<script setup>
import { computed } from 'vue'
import { storeStatus } from '@/order/lib/hours'
import { useOrder } from '@/order/useOrder'
import { useBagSheet } from '@/order/useBagSheet'
import logo from '@/assets/logos/guacado-wordmark-reverse.png'

// Order-flow header: logo, store chip (tap to change), bag button with a count.
const order = useOrder()
const { show } = useBagSheet()
const status = computed(() => (order.store.value ? storeStatus(order.store.value) : null))
</script>

<template>
  <header class="oh">
    <div class="oh__in">
      <RouterLink to="/" class="oh__logo" aria-label="Guacado Mexican Grill, back to the main site">
        <img :src="logo" alt="" width="120" height="29" />
      </RouterLink>

      <RouterLink v-if="order.store.value" class="chip" :to="{ path: '/order', query: { change: 1 } }">
        <span class="chip__where">{{ order.store.value.address }}</span>
        <span class="chip__st" :class="status.state">{{ status.label }}</span>
        <span class="sr-only">. Change restaurant</span>
      </RouterLink>
      <span v-else class="chip chip--none">Choose a restaurant</span>

      <button type="button" class="bag" :aria-label="`Open bag, ${order.count.value} item${order.count.value === 1 ? '' : 's'}`" @click="show">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
        <span v-if="order.count.value" class="bag__n" aria-hidden="true">{{ order.count.value }}</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.oh { position: sticky; top: 0; z-index: 50; background: rgba(10, 18, 14, 0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); padding-top: env(safe-area-inset-top, 0px); }
.oh__in { display: flex; align-items: center; gap: 10px; max-width: 720px; margin: 0 auto; min-height: 64px; padding: 8px var(--gut-r) 8px var(--gut-l); }
.oh__logo { flex: none; display: grid; place-items: center; min-width: 44px; min-height: 44px; }
.oh__logo img { width: 92px; height: auto; }
.chip { flex: 1; min-width: 0; display: grid; text-decoration: none; padding: 6px 14px; min-height: 48px; align-content: center; border-radius: var(--r-md); border: 1.5px solid var(--line); background: var(--surface); line-height: 1.2; }
.chip--none { color: var(--ink-muted); font-weight: 700; place-content: center; }
.chip__where { font-weight: 800; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chip__st { font-size: 12px; color: var(--ink-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chip__st.open { color: var(--lime); }
.chip__st.closed { color: var(--chili); }
.bag { position: relative; flex: none; width: 48px; height: 48px; border-radius: 50%; border: 1.5px solid var(--line); background: var(--surface); color: var(--ink); display: grid; place-items: center; cursor: pointer; }
.bag svg { width: 24px; height: 24px; }
.bag__n { position: absolute; top: -4px; right: -4px; min-width: 22px; height: 22px; padding: 0 5px; border-radius: 11px; background: var(--lime); color: var(--on-lime); font: 800 13px/22px var(--f-body); text-align: center; }
@media (max-width: 380px) { .oh__logo img { display: none; } .oh__logo { min-width: 0; } }
</style>
