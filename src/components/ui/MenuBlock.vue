<script setup>
import BrushTag from './BrushTag.vue'

// A titled column of menu rows (Proteins, Sides, Beverages, Desserts).
defineProps({
  title: { type: String, required: true },
  sub: { type: String, default: '' },
})
</script>

<template>
  <div class="mblock" data-block>
    <BrushTag>{{ title }}</BrushTag>
    <p v-if="sub" class="mblock__sub">{{ sub }}</p>
    <slot />
  </div>
</template>

<style scoped>
.mblock { min-width: 0; }
.mblock__sub { font-size: 13px; color: var(--ink-muted); margin: -6px 0 8px; font-weight: 600; letter-spacing: 0.3px; }
</style>
