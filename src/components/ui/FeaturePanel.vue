<script setup>
import PricePill from './PricePill.vue'

// Green menu-board panel edged in lime. Slot = description; image overlaps the top-right corner.
defineProps({
  title: { type: String, required: true },
  meta: { type: String, default: '' },
  image: { type: String, default: '' },
  prices: { type: Array, default: () => [] }, // [{ label, price }]
  kid: { type: Boolean, default: false },
})
</script>

<template>
  <article class="panel" :class="{ 'panel--kid': kid }" data-card data-panel>
    <img v-if="image" class="panel__img" :src="image" alt="" loading="lazy" />
    <span class="panel__meta">{{ meta }}</span>
    <h3>{{ title }}</h3>
    <p><slot /></p>
    <div class="prices">
      <PricePill v-for="p in prices" :key="p.label ?? 'one'" :label="p.label" :value="p.price" />
    </div>
  </article>
</template>

<style scoped>
.panel {
  position: relative;
  background: var(--guac);
  color: var(--on-green);
  border-radius: var(--r-lg);
  padding: clamp(24px, 3vw, 36px);
  box-shadow: inset 0 0 0 4px var(--lime);
  overflow: hidden;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
h3, p, .panel__meta { position: relative; z-index: 2; }
h3 { font-family: var(--f-cond); font-size: clamp(52px, 6.4vw, 80px); line-height: 0.88; max-width: 8ch; text-transform: uppercase; }
p { font-size: 15.5px; max-width: 34ch; opacity: 0.92; }
.panel__meta { font-size: 13px; font-weight: 600; opacity: 0.8; letter-spacing: 0.3px; text-transform: uppercase; }
.prices { margin-top: auto; display: flex; flex-wrap: wrap; gap: 8px; position: relative; z-index: 2; }
.panel__img { position: absolute; right: -4%; top: -4%; width: min(42%, 220px); filter: drop-shadow(0 18px 24px rgba(0, 0, 0, 0.45)); pointer-events: none; }
.panel--kid .panel__img { width: min(30%, 150px); top: auto; bottom: 18px; right: 18px; }
</style>
