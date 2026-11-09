<script setup>
import { ref } from 'vue'
import { marqueeWords } from '@/data/site'
import { useMotion } from '@/composables/useMotion'

// Lime strip, rotated -1.5deg. The list renders twice so -50% loops seamlessly;
// scroll velocity temporarily speeds the belt up.
const root = ref(null)
const track = ref(null)

useMotion(root, ({ gsap, ScrollTrigger }) => {
  const belt = gsap.to(track.value, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
  ScrollTrigger.create({
    onUpdate(self) {
      const v = gsap.utils.clamp(-4, 4, self.getVelocity() / 400)
      gsap.to(belt, { timeScale: 1 + Math.abs(v), duration: 0.2, overwrite: true })
      gsap.to(belt, { timeScale: 1, duration: 1, delay: 0.25 })
    },
  })
})
</script>

<template>
  <div ref="root" class="mq" aria-hidden="true">
    <div ref="track" class="mq__track">
      <template v-for="n in 2" :key="n">
        <span v-for="w in marqueeWords" :key="`${n}-${w}`">{{ w }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.mq {
  background: var(--lime);
  color: var(--on-lime);
  overflow: hidden;
  border-block: 2px solid var(--ground);
  transform: rotate(-1.5deg);
  margin-block: -8px;
}
.mq__track { display: flex; width: max-content; padding-block: 14px 10px; }
.mq__track span {
  font-family: var(--f-cond);
  font-size: clamp(26px, 3.4vw, 40px);
  letter-spacing: 1px;
  padding-inline: 22px;
  display: flex;
  align-items: center;
  gap: 44px;
  white-space: nowrap;
}
.mq__track span::after { content: ''; width: 14px; height: 14px; border-radius: 50%; background: var(--pit); }
</style>
