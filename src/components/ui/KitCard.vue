<script setup>
import { money } from '@/utils/format'

defineProps({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  calories: { type: String, default: '' },
  includes: { type: Array, default: () => [] },
})
</script>

<template>
  <article class="kit" data-card data-kit>
    <div class="kit__top">
      <h3>{{ name }}</h3>
      <span class="kprice">{{ money(price) }}</span>
    </div>
    <ul>
      <li v-for="item in includes" :key="item">{{ item }}</li>
    </ul>
    <span v-if="calories" class="kcal">{{ calories }}</span>
  </article>
</template>

<style scoped>
.kit {
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  transition: border-color 0.3s;
}
.kit:hover { border-color: var(--lime); }
.kit__top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
h3 { font-family: var(--f-display); font-size: 30px; line-height: 1; }
.kprice { font-family: var(--f-cond); font-size: 40px; color: var(--accent-text); line-height: 1; font-variant-numeric: tabular-nums; }
ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
li { font-size: 13px; font-weight: 600; padding: 5px 11px; border-radius: var(--r-pill); background: var(--surface); border: 1px solid var(--line); }
.kcal { margin-top: auto; font-size: 13px; color: var(--ink-muted); font-weight: 500; padding-top: 6px; }
</style>
