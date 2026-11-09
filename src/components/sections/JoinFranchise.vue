<script setup>
import { links } from '@/data/site'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <section id="join" class="band">
    <div class="wrap duo">
      <article id="jobs" class="card">
        <div>
          <span class="eyebrow">We are hiring</span>
          <h2 class="display">Join the line</h2>
          <p>Grill, build and serve with us. See current openings and apply in a few clicks.</p>
        </div>
        <BaseButton :href="links.jobs" variant="outline">See open jobs</BaseButton>
      </article>
      <article id="franchise" class="card">
        <div>
          <span class="eyebrow">Franchise opportunities</span>
          <h2 class="display">Open a Guacado</h2>
          <p>Bring build-your-own Mexican to your neighborhood.</p>
        </div>
        <BaseButton :href="links.franchise" variant="outline">Franchise info</BaseButton>
      </article>
    </div>
  </section>
</template>

<style scoped>
.duo { display: grid; gap: 14px; }
@media (min-width: 860px) { .duo { grid-template-columns: 1fr 1fr; } }
.card {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
  padding: 24px 26px;
  border-radius: var(--r-lg);
  border: 1.5px solid var(--line);
}
.card > div { display: grid; gap: 6px; max-width: 40ch; }
h2 { font-size: clamp(28px, 3vw, 38px); }
p { color: var(--ink-muted); font-size: 15px; }
</style>
