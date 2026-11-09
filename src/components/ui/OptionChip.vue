<script setup>
// Pill toggle. `pressed` drives aria-pressed and the selected (ink) state.
defineProps({
  pressed: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>

<template>
  <button type="button" class="chip" :aria-pressed="pressed" @click="$emit('click')">
    <slot />
  </button>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  font: 700 15px/1 var(--f-body);
  padding: 12px 16px;
  border-radius: var(--r-pill);
  border: 1.5px solid var(--line);
  background: var(--surface-raised);
  color: var(--ink);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.12s;
}
.chip:hover { border-color: var(--ink); }
.chip:active { transform: scale(0.97); }
.chip[aria-pressed='true'] { background: var(--guac); border-color: var(--guac); color: var(--on-green); }
/* Chili glyphs turn white on the green selected state. */
.chip[aria-pressed='true'] :deep(.icons svg) { fill: #fff; }
.chip :deep(small) { font: 800 15px/1 var(--f-display); font-stretch: 80%; opacity: 0.85; }
</style>
