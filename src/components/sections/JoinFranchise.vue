<script setup>
import { ref } from 'vue'
import { links } from '@/data/site'
import { useMotion, revealCards } from '@/composables/useMotion'
import BaseButton from '@/components/ui/BaseButton.vue'

const root = ref(null)
useMotion(root, () => revealCards())
</script>

<template>
  <section id="join" ref="root" class="band band--alt">
    <div class="wrap duo">
      <article id="jobs" class="card" data-card>
        <span class="eyebrow">We are hiring</span>
        <h3>Join the line</h3>
        <p>We're looking for great people to grill, build and serve. See current openings and apply in a few clicks.</p>
        <BaseButton :href="links.jobs">SEE OPEN JOBS</BaseButton>
      </article>
      <article id="franchise" class="card card--lime" data-card>
        <span class="eyebrow">Franchise opportunities</span>
        <h3>Open a Guacado</h3>
        <p>Bring build-your-own Mexican to your neighborhood. Learn what it takes to own and operate a location.</p>
        <BaseButton :href="links.franchise">FRANCHISE INFO</BaseButton>
      </article>
    </div>
  </section>
</template>

<style scoped>
.duo { display: grid; gap: 18px; }
@media (min-width: 860px) { .duo { grid-template-columns: 1fr 1fr; } }
.card {
  border-radius: var(--r-lg);
  padding: clamp(28px, 4vw, 44px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  border: 1px solid var(--line);
  background: var(--surface-raised);
  min-width: 0;
}
.card--lime { background: var(--lime); color: var(--on-lime); border-color: var(--lime); --btn-primary-bg: var(--ground); --btn-primary-ink: var(--ink); }
.card--lime .eyebrow { color: var(--on-lime); }
h3 { font-family: var(--f-display); font-size: clamp(32px, 3.6vw, 46px); line-height: 1; }
p { max-width: 44ch; }
.card :deep(.btn) { margin-top: 8px; }
</style>
