<script setup>
import { money } from '@/utils/format'

// Checkbox-style add-on button (fresh guac, extra protein). Slot = leading icon.
defineProps({
  label: { type: String, required: true },
  price: { type: Number, required: true },
  pressed: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>

<template>
  <button type="button" class="extra" :aria-pressed="pressed" @click="$emit('click')">
    <slot />
    <span>{{ label }}<b>+ {{ money(price) }}</b></span>
    <span class="box" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
    </span>
  </button>
</template>

<style scoped>
.extra {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 44px;
  padding: 14px 16px;
  border-radius: var(--r-md);
  background: var(--surface);
  border: 1.5px solid transparent;
  cursor: pointer;
  text-align: left;
  color: var(--ink);
  font: 600 15px/1.3 var(--f-body);
}
.extra:hover { border-color: var(--line); }
.extra[aria-pressed='true'] { border-color: var(--guac); background: #eef6f0; }
.extra b { display: block; font: 900 20px/1.2 var(--f-display); font-stretch: 80%; color: var(--accent-text); }
.box {
  margin-left: auto;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid var(--ink-muted);
  display: grid;
  place-items: center;
  flex: none;
}
.extra[aria-pressed='true'] .box { background: var(--guac); border-color: var(--guac); }
.box svg { width: 14px; height: 14px; stroke: #fff; opacity: 0; }
.extra[aria-pressed='true'] .box svg { opacity: 1; }
.extra :slotted(img) { width: 44px; height: auto; }
</style>
