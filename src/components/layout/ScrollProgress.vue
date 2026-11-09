<script setup>
import { ref } from 'vue'
import { useMotion } from '@/composables/useMotion'

// Fixed 3px lime bar scrubbed by page scroll. Hidden when motion is reduced.
const bar = ref(null)

useMotion(bar, ({ gsap }) => {
  gsap.to(bar.value, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
  })
})
</script>

<template>
  <div ref="bar" class="progress" aria-hidden="true" />
</template>

<style scoped>
.progress {
  position: fixed;
  left: 0;
  top: env(safe-area-inset-top, 0px);
  height: 3px;
  width: 100%;
  background: var(--lime);
  transform-origin: left;
  transform: scaleX(0);
  z-index: 80;
}
</style>
