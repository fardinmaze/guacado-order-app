<script setup>
import { site } from '@/data/site'
import { money } from '@/utils/format'
import { useOrderBar } from '@/composables/useOrderBar'
import BaseButton from '@/components/ui/BaseButton.vue'

// Phones only: an order button that never leaves the thumb zone. While the builder
// is on screen it shows the running order and total instead of the menu link.
const { current } = useOrderBar()
</script>

<template>
  <div class="bar" role="region" aria-label="Quick order">
    <div v-if="current" class="bar__order">
      <span class="bar__label">{{ current.label }}</span>
      <strong class="display">{{ money(current.total) }}</strong>
    </div>
    <BaseButton v-else to="/menu" variant="outline">Menu</BaseButton>
    <BaseButton :href="site.orderUrl" class="bar__cta">{{ current ? 'Order this' : 'Order now' }}</BaseButton>
  </div>
</template>

<style scoped>
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px var(--gut-r) calc(10px + env(safe-area-inset-bottom, 0px)) var(--gut-l);
  background: var(--ground);
  border-top: 1px solid var(--line);
  box-shadow: 0 -8px 24px -16px rgba(20, 35, 27, 0.4);
}
.bar__cta { flex: 1; }
.bar__order { display: grid; min-width: 0; flex: 0 1 auto; }
.bar__label { font-size: 12.5px; font-weight: 600; color: var(--ink-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar__order strong { font-size: 26px; line-height: 1; font-variant-numeric: tabular-nums; }
@media (min-width: 900px) { .bar { display: none; } }
</style>
