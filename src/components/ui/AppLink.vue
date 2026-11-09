<script setup>
// Internal routes use RouterLink; everything else is a plain anchor.
defineProps({
  to: { type: String, default: '' },
  href: { type: String, default: '' },
})
</script>

<template>
  <RouterLink v-if="to" :to="to"><slot /></RouterLink>
  <a v-else :href="href"><slot /></a>
</template>
