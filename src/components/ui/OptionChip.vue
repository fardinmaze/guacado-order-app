<script setup>
// Pill toggle. `pressed` drives aria-pressed and the lime selected state.
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
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
}
.chip:hover { border-color: var(--ink-muted); }
.chip:active { transform: scale(0.97); }
.chip[aria-pressed='true'] { background: var(--lime); border-color: var(--lime); color: var(--on-lime); }
.chip :deep(small) { font: 400 18px/1 var(--f-cond); letter-spacing: 0.5px; opacity: 0.9; }
</style>
