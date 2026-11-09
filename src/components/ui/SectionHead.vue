<script setup>
// Eyebrow + section heading (+ optional lead). The h2 carries data-reveal for the rise-in motion.
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  lead: { type: String, default: '' },
  as: { type: String, default: 'h2' },
})
</script>

<template>
  <div class="head">
    <span v-if="eyebrow" class="eyebrow"><slot name="eyebrow">{{ eyebrow }}</slot></span>
    <component :is="as" class="h-sec" data-reveal><slot name="title">{{ title }}</slot></component>
    <p v-if="lead" class="lead">{{ lead }}</p>
    <slot />
  </div>
</template>

<style scoped>
.head { display: grid; gap: 12px; }
</style>
