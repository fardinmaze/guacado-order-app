<script setup>
import { cityLine, mapsUrl } from '@/utils/format'

defineProps({
  location: { type: Object, required: true }, // { address, city, state, zip, soon? }
})
</script>

<template>
  <a class="loc" :href="mapsUrl(location)" target="_blank" rel="noopener" data-loc>
    <b>{{ location.address }}</b>
    <span>{{ cityLine(location) }}</span>
    <span class="st">
      <span v-if="location.soon" class="soon">COMING SOON</span>
      <template v-else>DIRECTIONS →</template>
      <span class="sr-only">(opens Google Maps in a new tab)</span>
    </span>
  </a>
</template>

<style scoped>
.loc {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 18px 16px;
  border-radius: var(--r-md);
  background: var(--surface-raised);
  border: 1px solid var(--line);
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s;
}
.loc:hover { border-color: var(--lime); transform: translateY(-2px); }
b { font-size: 16px; }
span { font-size: 14px; color: var(--ink-muted); }
.st { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-family: var(--f-cond); letter-spacing: 2px; font-size: 14px; color: var(--accent-text); }
.soon { color: var(--on-lime); background: var(--chili); padding: 3px 9px 1px; border-radius: var(--r-pill); font-size: 13px; letter-spacing: 1.5px; }
</style>
