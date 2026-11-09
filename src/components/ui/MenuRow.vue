<script setup>
import { computed } from 'vue'
import { price as fmt } from '@/utils/format'

// One menu-board line: name, optional calories / shake flavours, 1 or 2 prices.
const props = defineProps({
  name: { type: String, required: true },
  calories: { type: String, default: '' },
  prices: { type: Array, required: true }, // [3.95] or [3.95, 6.95] (4oz | 8oz)
  flavors: { type: Array, default: () => [] },
})

const hasTwo = computed(() => props.prices.length > 1)
</script>

<template>
  <div class="row" data-row>
    <span class="row__name">{{ name }}</span>
    <span v-if="calories" class="row__cal">{{ calories }}</span>
    <span v-if="flavors.length" class="row__cal flavors">
      <span v-for="f in flavors" :key="f">{{ f }}</span>
    </span>
    <span class="row__price">
      <template v-if="hasTwo">{{ fmt(prices[0]) }}<small aria-hidden="true">|</small><span class="sr-only"> and </span>{{ fmt(prices[1]) }}</template>
      <template v-else>${{ fmt(prices[0]) }}</template>
    </span>
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}
.row__name { font-weight: 700; font-size: 17px; line-height: 1.35; }
.row__cal { grid-column: 1; font-size: 13px; color: var(--ink-muted); font-weight: 500; }
.row__price {
  grid-row: 1 / span 3;
  grid-column: 2;
  align-self: center;
  font: 900 24px/1 var(--f-display);
  font-stretch: 80%;
  color: var(--ink);
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.row__price small { font-size: 16px; color: var(--ink-muted); margin: 0 3px; }
.flavors { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.flavors span {
  font-size: 12.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--r-pill);
  border: 1px solid var(--line);
  color: var(--ink-muted);
}
</style>
