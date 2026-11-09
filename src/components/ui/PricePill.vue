<script setup>
import { price as fmt } from '@/utils/format'

// Lime price pill used on feature panels: "2PC 11.95".
defineProps({
  label: { type: String, default: '' },
  value: { type: Number, required: true },
})
</script>

<template>
  <span class="price"><em v-if="label">{{ label }}</em>{{ fmt(value) }}</span>
</template>

<style scoped>
.price {
  font-family: var(--f-cond);
  font-size: 22px;
  line-height: 1;
  letter-spacing: 0.5px;
  background: var(--lime);
  color: var(--on-lime);
  padding: 8px 14px 6px;
  border-radius: var(--r-pill);
  font-variant-numeric: tabular-nums;
}
.price em { font-style: normal; opacity: 0.65; margin-right: 6px; text-transform: uppercase; }
</style>
