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
  border: 1.5px solid var(--line);
  cursor: pointer;
  text-align: left;
  color: var(--ink);
  font: 600 15px/1.3 var(--f-body);
}
.extra[aria-pressed='true'] { border-color: var(--lime); }
.extra b { display: block; font-family: var(--f-cond); font-weight: 400; font-size: 22px; color: var(--accent-text); letter-spacing: 0.5px; }
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
.extra[aria-pressed='true'] .box { background: var(--lime); border-color: var(--lime); }
.box svg { width: 14px; height: 14px; stroke: var(--on-lime); opacity: 0; }
.extra[aria-pressed='true'] .box svg { opacity: 1; }
.extra :slotted(img) { width: 44px; height: auto; }
</style>
