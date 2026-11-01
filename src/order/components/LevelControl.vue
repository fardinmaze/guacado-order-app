<script setup>
import { EXTRA_PROTEIN_CENTS, LEVELS, LEVEL_LABEL, cents } from '@/order/lib/pricing'

// Light · Regular · Extra · On the side. A radio group, so screen readers and arrow keys work.
const props = defineProps({
  modelValue: { type: String, default: 'regular' },
  label: { type: String, required: true },
  extraPrice: { type: Boolean, default: false }, // protein: "Extra" adds +$2.95
})
const emit = defineEmits(['update:modelValue'])

function onKey(e) {
  const i = LEVELS.indexOf(props.modelValue)
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
  if (!step) return
  e.preventDefault()
  emit('update:modelValue', LEVELS[(i + step + LEVELS.length) % LEVELS.length])
}
</script>

<template>
  <div class="lv" role="radiogroup" :aria-label="`How much ${label}`" @keydown="onKey">
    <button
      v-for="l in LEVELS"
      :key="l"
      type="button"
      role="radio"
      class="lv__b"
      :aria-checked="modelValue === l"
      :tabindex="modelValue === l ? 0 : -1"
      @click="emit('update:modelValue', l)"
    >
      {{ LEVEL_LABEL[l] }}
      <small v-if="extraPrice && l === 'extra'">+{{ cents(EXTRA_PROTEIN_CENTS) }}</small>
    </button>
  </div>
</template>

<style scoped>
.lv { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; padding: 4px; background: var(--ground); border-radius: var(--r-pill); border: 1px solid var(--line); }
.lv__b {
  min-height: 44px;
  padding: 6px 2px;
  border: 0;
  border-radius: var(--r-pill);
  background: transparent;
  color: var(--ink-muted);
  font: 700 13px/1.1 var(--f-body);
  cursor: pointer;
  display: grid;
  place-content: center;
  gap: 1px;
  transition: background 0.15s, color 0.15s;
}
.lv__b small { font: 400 15px/1 var(--f-cond); letter-spacing: 0.5px; }
.lv__b[aria-checked='true'] { background: var(--lime); color: var(--on-lime); }
@media (max-width: 359px) { .lv__b { font-size: 12px; } }
</style>
