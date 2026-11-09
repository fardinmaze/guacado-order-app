<script setup>
// Eyebrow + uppercase headline + optional lead. Slot = actions on the right.
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  lead: { type: String, default: '' },
  tag: { type: String, default: 'h2' },
})
</script>

<template>
  <div class="head">
    <div class="head__text">
      <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
      <component :is="tag" class="display h-sec">{{ title }}</component>
      <p v-if="lead" class="lead">{{ lead }}</p>
    </div>
    <div v-if="$slots.default" class="head__aside"><slot /></div>
  </div>
</template>

<style scoped>
.head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 20px 32px; margin-bottom: clamp(28px, 4vw, 44px); }
.head__text { display: grid; gap: 12px; min-width: 0; }
.head__aside { display: flex; flex-wrap: wrap; gap: 10px; }
</style>
