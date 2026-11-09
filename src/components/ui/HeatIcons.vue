<script setup>
import { heatLabels } from '@/data/site'

// 1-3 chili glyphs plus a visually hidden word, so heat never relies on colour alone.
defineProps({ level: { type: Number, required: true } })
</script>

<template>
  <span v-if="level" class="heat">
    <span class="icons" aria-hidden="true" :title="heatLabels[level]">
      <svg v-for="n in level" :key="n" viewBox="0 0 12 14">
        <path d="M8.6 1.2c.4-.6 1.3-.3 1.2.4l-.2.9c1.2.6 1.6 2 1 3.2C9.4 9.4 6 12.6 1.5 13.3.9 13.4.7 12.6 1.2 12.3 4.2 10.6 6 8.4 6.6 5.2c.2-1.1.9-1.9 1.8-2.2z" />
      </svg>
    </span>
    <span class="sr-only">{{ heatLabels[level] }}</span>
  </span>
</template>

<style scoped>
.icons { display: inline-flex; gap: 1px; }
.icons svg { width: 12px; height: 14px; fill: var(--salsa); }
/* Selected chip is lime: darken the chili for contrast. */
:global(.chip[aria-pressed='true']) .icons svg { fill: #8d1219; }
</style>
