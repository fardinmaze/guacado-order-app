<script setup>
import { ref } from 'vue'
import { links, occasions, site } from '@/data/site'
import { useMotion, revealHeads } from '@/composables/useMotion'
import BaseButton from '@/components/ui/BaseButton.vue'

const root = ref(null)

// The loud moment: the only full-bleed --guac band (BRAND.md §3 "Section rhythm").
useMotion(root, ({ gsap, root: el }) => {
  revealHeads(el)
  gsap.from(el.querySelectorAll('.cater__occ span'), {
    y: 40,
    scale: 0.8,
    opacity: 0.15,
    stagger: 0.06,
    duration: 0.6,
    ease: 'back.out(2)',
    scrollTrigger: { trigger: el, start: 'top 75%' },
  })
})
</script>

<template>
  <section id="catering" ref="root" class="band cater">
    <div class="wrap cater__in">
      <div class="cater__copy">
        <span class="eyebrow">Catering</span>
        <h2 class="h-sec" data-reveal>Let us cater your next event</h2>
        <p>
          Every event is built around your tastes and your guest list, from a birthday at home to a company
          lunch. Tell us the date and headcount and we'll plan the spread.
        </p>
        <div class="cater__actions">
          <BaseButton variant="lime" :href="links.cateringPackages">CATERING PACKAGES</BaseButton>
          <BaseButton variant="ghost" :href="site.orderUrl">ORDER FOR PICKUP</BaseButton>
        </div>
      </div>
      <ul class="cater__occ" aria-label="Occasions we cater">
        <li v-for="o in occasions" :key="o">{{ o.toUpperCase() }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.cater { background: var(--guac); color: var(--on-green); overflow: hidden; --btn-ghost-ink: var(--on-green); --btn-ghost-line: rgba(246, 241, 231, 0.45); }
.cater__in { display: grid; gap: 32px; align-items: center; }
@media (min-width: 900px) { .cater__in { grid-template-columns: 1.2fr 0.8fr; } }
.cater__copy { display: grid; gap: 18px; }
.eyebrow { color: var(--lime); }
.h-sec { color: var(--on-green); }
p { max-width: 52ch; font-size: 18px; opacity: 0.92; }
.cater__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
.cater__occ { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
.cater__occ li { font-family: var(--f-cond); font-size: clamp(22px, 2.6vw, 30px); letter-spacing: 1px; padding: 10px 18px 6px; border: 2px solid var(--lime); border-radius: var(--r-pill); }
.cater__occ li:nth-child(3n + 1) { background: var(--lime); color: var(--on-lime); }
</style>
